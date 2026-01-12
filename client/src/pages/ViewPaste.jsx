import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPaste } from "../api/pasteApi";

export default function ViewPaste() {
  const { id } = useParams();

  const [content, setContent] = useState("");
  const [viewsLeft, setViewsLeft] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------- Fetch paste ---------- */
  useEffect(() => {
    async function loadPaste() {
      try {
        const data = await getPaste(id);

        setContent(data.content);
        setViewsLeft(data.viewsLeft);

        
        
      } catch {
        setError("Paste not found or expired");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadPaste();
  }, [id]);

  /* ---------- UI states ---------- */
  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error) return <h2 style={{ textAlign: "center" }}>{error}</h2>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.meta}>
        { viewsLeft &&  <span> Views left: {viewsLeft}</span>}
          
        </div>

        <pre style={styles.content}>{content}</pre>
      </div>
    </div>
  );
}


const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6f8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },

  card: {
    background: "#ffffff",
    width: "100%",
    maxWidth: "700px",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  meta: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "16px",
    fontSize: "14px",
    color: "#555",
  },

  content: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#222",
  },
};
