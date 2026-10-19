import Link from "next/link";
import { NetworkMemberForm } from "./NetworkMemberForm";
import styles from "./join-network.module.css";

export default function JoinNetworkPage() {
  return (
    <div className={styles.page}>
      <Link href="/" className={styles.back}>
        ← Back
      </Link>
      <h1 className={styles.title}>Join international repost network</h1>
      <p className={styles.intro}>
        For festival or event Instagram pages in any city. By joining, you agree to occasionally
        repost other members&apos; festivals when we share them on our main Instagram. In return,
        your events can be promoted through the same network.
      </p>
      <NetworkMemberForm />
    </div>
  );
}
