import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPaste } from "../api/pasteApi";

export default function ViewPaste() {
  const { id } = useParams();

  const [content, setContent] = useState("");
  const [viewsLeft, setViewsLeft] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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

  /* ---------- Copy handler ---------- */
  function copyToClipboard() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  /* ---------- UI states ---------- */
  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error) return <h2 style={{ textAlign: "center" }}>{error}</h2>;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.meta}>
          {viewsLeft !== null && (
            <span>Views left: {viewsLeft}</span>
          )}

          <button
            onClick={copyToClipboard}
            title="Copy to clipboard"
            style={styles.copyButton}
          >
            {copied ? "✓" : <CopyIcon />}
          </button>
        </div>

        <pre style={styles.content}>{content}</pre>
      </div>
    </div>
  );
}

/* ---------- Clipboard icon ---------- */
function CopyIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

/* ---------- Styles ---------- */
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
    alignItems: "center",
    marginBottom: "16px",
    fontSize: "14px",
    color: "#555",
  },

  copyButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    color: "#555",
    fontSize: "14px",
  },

  content: {
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#222",
  },
};
