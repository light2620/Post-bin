import { useState } from "react";
import { createPaste } from "../api/pasteApi";

export default function CreatePaste() {
  const [content, setContent] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setUrl("");
    setCopied(false);
    setLoading(true);

    try {
      const data = await createPaste({
        content,
        expiresIn: expiresIn ? Number(expiresIn) : undefined,
        maxViews: maxViews ? Number(maxViews) : undefined,
      });

      setUrl(data.url);
      setContent("");
      setExpiresIn("");
      setMaxViews("");
    } catch {
      setError("Failed to create paste");
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(url);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="card">
      <h1>Pastebin Lite</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Paste your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          disabled={loading}
        />
      <div
        style={{ display: "flex", gap: "10px", alignItems: "center" ,justifyContent:"center",marginTop:"10px"}}
      >
        <input
          type="number"
          placeholder="Expires in seconds (optional)"
          value={expiresIn}
          onChange={(e) => setExpiresIn(e.target.value)}
          disabled={loading}
        />

        <input
          type="number"
          placeholder="Max views (optional)"
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Paste"}
        </button>

      </div>
        
      </form>

      {url && (
        <div className="result">
          <p>
            Shareable link: <a href={url}>{url}</a>
          </p>
          <button onClick={copyToClipboard} className="secondary">
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
