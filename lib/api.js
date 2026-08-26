export async function apiPost(path, body) {
  const res = await fetch(`http://localhost:5000/api${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "An error occurred");
  }
  return data;
}
