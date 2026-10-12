import Link from "next/link";
import type { Festival } from "@/lib/festivals";
import styles from "./FestivalCard.module.css";

export function FestivalCard({ festival }: { festival: Festival }) {
  const imageSrc = festival.image || "/festivals/placeholder.svg";
  const externalUrl = festival.go4eventsUrl?.trim();

  const card = (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt={festival.title} className={styles.image} />
      </div>
      <div className={styles.body}>
        <p className={styles.meta}>
          <span>📅 {festival.dateStart} – {festival.dateEnd}</span>
          <span>🕐 {festival.timeStart} – {festival.timeEnd}</span>
          <span>📍 {festival.city}</span>
          <span className={styles.address}>{festival.address}</span>
        </p>
        <h2 className={styles.title}>{festival.title}</h2>
        <p className={styles.desc}>{festival.descriptionShort}</p>
        {externalUrl ? (
          <p className={styles.go4Hint}>Opens full details on Go4Events</p>
        ) : null}
      </div>
    </article>
  );

  if (externalUrl) {
    return (
      <a href={externalUrl} className={styles.link} rel="noopener noreferrer">
        {card}
      </a>
    );
  }

  return (
    <Link href={`/festival/${encodeURIComponent(festival.id)}`} className={styles.link}>
      {card}
    </Link>
  );
}
