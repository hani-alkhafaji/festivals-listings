import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.back}>
        ← Back
      </Link>
      <h1 className={styles.title}>Publisher notes (for you only)</h1>
      <p className={styles.p}>
        New festival requests arrive in Google Sheet tab <strong>Festival Requests</strong>. After €49 payment, publish the event using one of these methods:
      </p>
      <ol className={styles.ol}>
        <li>
          <strong>Google Sheet (recommended on Vercel):</strong> add a row in tab{" "}
          <strong>Published Festivals</strong>. The live site reads from this tab every few minutes.
        </li>
        <li>
          <strong>VS Code:</strong> edit <code className={styles.inlineCode}>data/festivals.json</code>, add images under{" "}
          <code className={styles.inlineCode}>public/festivals/</code>, then <code className={styles.inlineCode}>git push</code> (works if GAS URL is not set).
        </li>
      </ol>
      <p className={styles.p}>
        City names must be in <strong>English</strong> (Vienna, Prague, Berlin). Events sort by{" "}
        <code className={styles.inlineCode}>sortDate</code> (YYYY-MM-DD), nearest date first.
      </p>
    </div>
  );
}
