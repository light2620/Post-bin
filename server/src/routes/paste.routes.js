import express from "express";
import { nanoid } from "nanoid";
import { query } from "../db.js";

const router = express.Router();

/* =========================
   CREATE PASTE
========================= */
router.post("/", async (req, res) => {
  try {
    const { content, expiresIn, maxViews } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({ error: "Content is required" });
    }

    const id = nanoid(8);

    // ---- Sanitize inputs ----
    const expiresInSeconds =
      Number.isInteger(Number(expiresIn)) && Number(expiresIn) > 0
        ? Number(expiresIn)
        : null;

    const maxViewsInt =
      Number.isInteger(Number(maxViews)) && Number(maxViews) > 0
        ? Number(maxViews)
        : null;

    let expiresAt = null;
    if (expiresInSeconds) {
      expiresAt = new Date(Date.now() + expiresInSeconds * 1000);
    }

    await query(
      `
      INSERT INTO pastes (id, content, expires_at, max_views)
      VALUES ($1, $2, $3, $4)
      `,
      [id, content, expiresAt, maxViewsInt]
    );

    res.status(201).json({
      id,
      url: `http://localhost:5173/paste/${id}`,
    });
  } catch (err) {
    console.error("CREATE PASTE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   GET PASTE
========================= */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `
      UPDATE pastes
      SET view_count = view_count + 1
      WHERE
        id = $1
        AND is_deleted = false
        AND (expires_at IS NULL OR expires_at > NOW())
        AND (max_views IS NULL OR view_count < max_views)
      RETURNING content, expires_at, max_views, view_count
      `,
      [id]
    );

    if (result.rowCount === 0) {
      await query(
        `UPDATE pastes SET is_deleted = true WHERE id = $1`,
        [id]
      );
      return res.status(410).json({ error: "Paste expired or not found" });
    }

    const paste = result.rows[0];

    const viewsLeft =
      paste.max_views !== null
        ? Math.max(paste.max_views - paste.view_count, 0)
        : null;

    res.json({
      content: paste.content,
      viewsLeft,
      expiresAt: paste.expires_at,
    });
  } catch (err) {
    console.error("GET PASTE ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
