import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "#fff", padding: "2rem", color: "#111" }}>
      <h1 style={{ fontSize: "1.5rem" }}>Page not found</h1>
      <p style={{ marginTop: "0.75rem" }}>
        This festival may have been removed or the link id does not match Google Sheet column{" "}
        <strong>id</strong>.
      </p>
      <Link href="/" style={{ display: "inline-block", marginTop: "1.25rem", fontWeight: 600 }}>
        ← Back to all festivals
      </Link>
    </div>
  );
}
