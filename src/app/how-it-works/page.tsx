import Link from "next/link";
import styles from "./how-it-works.module.css";

export default function HowItWorksPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.back}>
        ← Back to festivals
      </Link>
      <h1 className={styles.title}>How to use this site</h1>

      <section className={styles.section}>
        <h2>1. All festivals</h2>
        <p>
          From the menu, choose <strong>All festivals</strong> to see every published event.
          Use the search bar to filter by city name in English (for example Vienna, Prague,
          Madrid).
        </p>
      </section>

      <section className={styles.section}>
        <h2>2. Submit your festival (€49 listing)</h2>
        <p>Use this if you want your festival shown on this listing website.</p>
        <ol>
          <li>Open <strong>Submit your festival (€49 listing)</strong> from the menu.</li>
          <li>Fill in the form with your festival details.</li>
          <li>We receive your request in our system.</li>
          <li>
            We email you about the <strong>€49 listing fee</strong>. This amount is fee to publish your event on our Instagrame page and Our International Website.
          </li>
          <li>
            After payment, we publish your event (usually via Instgrame page + Go4Events + this site). You can
            share your Go4Events link and poster with us in the form.
          </li>
        </ol>
        <Link href="/submit" className={styles.btn}>
          Go to submit form
        </Link>
      </section>

      <section className={styles.section}>
        <h2>3. Join international repost network</h2>
        <p>
          For festival Instagram pages that agree to repost other cities&apos; events in our
          network. Choose <strong>Join international repost network</strong> from the menu.
        </p>
        <Link href="/join-network" className={styles.btnSecondary}>
          Join the network
        </Link>
      </section>
    </div>
  );
}
