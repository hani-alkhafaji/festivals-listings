import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.back}>
        ← Back
      </Link>
      <h1 className={styles.title}>How to add a festival (simple way)</h1>
      <ol className={styles.ol}>
        <li>Create or open the event on <strong>Go4Events</strong> (as you always do).</li>
        <li>Copy the event link from the browser, for example:<br />
          <code className={styles.inlineCode}>
            https://go4events.now/eventDetalis/IP6E1tzEXAU4d7PwEo9D
          </code>
        </li>
        <li>Open Google Sheet → tab <strong>Published Festivals</strong>.</li>
        <li>Add a new row:
          <ul>
            <li>
              <strong>city</strong> = English city name for search (example: Vienna)
            </li>
            <li>
              <strong>go4eventsUrl</strong> = paste the Go4Events link
            </li>
            <li>
              <strong>bookingUrl</strong> = ticket shop link (green Book ticket now button)
            </li>
            <li>
              <strong>instagramUrl</strong> = festival Instagram (optional)
            </li>
          </ul>
        </li>
        <li>Wait 1–2 minutes, refresh your listing website (Ctrl+F5).</li>
      </ol>
      <p className={styles.p}>
        Photo, title, date and time are loaded from Go4Events. You do <strong>not</strong> need
        to upload images in VS Code for this method.
      </p>
      <p className={styles.p}>
        When a visitor taps the card, they open the full event page on Go4Events.
      </p>
    </div>
  );
}
