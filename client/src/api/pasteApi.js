const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function createPaste(payload) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create paste");
  }

  return res.json();
}

export async function getPaste(id) {
  const res = await fetch(`${BASE_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Paste not found or expired");
  }

  return res.json();
}
