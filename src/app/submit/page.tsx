import Link from "next/link";
import { getSiteConfig } from "@/lib/festivals";
import { SubmitForm } from "./SubmitForm";
import styles from "./submit.module.css";

export default function SubmitPage() {
  const site = getSiteConfig();

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.back}>
        ← Back
      </Link>
      <h1 className={styles.title}>Submit your festival</h1>
      <p className={styles.note}>{site.submitNote}</p>
      <SubmitForm />
    </div>
  );
}
