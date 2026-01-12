import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pasteRoutes from "./routes/paste.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/paste", pasteRoutes);

app.get("/", (_, res) => {
  res.json({ ok: true });
});
app.get("/healthz",(_,res)=> {
    res.status(200).json({"ok":true});
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running`);
});
