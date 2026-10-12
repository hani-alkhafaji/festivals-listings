export function instagramHandleFromUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const u = trimmed.startsWith("http") ? new URL(trimmed) : new URL(`https://${trimmed}`);
    const parts = u.pathname.split("/").filter(Boolean);
    const user = parts[0];
    if (!user || user === "p" || user === "reel") return null;
    return `@${user.replace(/^@/, "")}`;
  } catch {
    const m = trimmed.match(/instagram\.com\/([^/?#]+)/i);
    return m ? `@${m[1]}` : null;
  }
}
