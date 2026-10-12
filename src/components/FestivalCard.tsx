import Link from "next/link";
import type { Festival } from "@/lib/festivals";
import { instagramHandleFromUrl } from "@/lib/instagram";
import styles from "./FestivalCard.module.css";

export function FestivalCard({ festival }: { festival: Festival }) {
  const imageSrc = festival.image || "/festivals/placeholder.svg";
  const externalUrl = festival.go4eventsUrl?.trim();
  const instagramUrl = festival.instagramUrl?.trim();
  const igLabel = instagramUrl ? instagramHandleFromUrl(instagramUrl) : null;

  const eventHref = externalUrl || `/festival/${encodeURIComponent(festival.id)}`;
  const eventLinkProps = externalUrl
    ? { href: eventHref, rel: "noopener noreferrer" as const }
    : { href: eventHref };

  const EventLink = externalUrl ? "a" : Link;

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <EventLink {...eventLinkProps} className={styles.imageLink}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt={festival.title} className={styles.image} />
        </EventLink>
        {igLabel && instagramUrl ? (
          <a
            href={instagramUrl}
            className={styles.igBadge}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {igLabel}
          </a>
        ) : null}
      </div>
      <EventLink {...eventLinkProps} className={styles.body}>
        <p className={styles.meta}>
          <span>📅 {festival.dateStart} – {festival.dateEnd}</span>
          <span>🕐 {festival.timeStart} – {festival.timeEnd}</span>
          <span>📍 {festival.city}</span>
          <span className={styles.address}>{festival.address}</span>
        </p>
        <h2 className={styles.title}>{festival.title}</h2>
        <p className={styles.desc}>{festival.descriptionShort}</p>
        {externalUrl ? (
          <p className={styles.go4Hint}>Tap card for full details on Go4Events</p>
        ) : null}
      </EventLink>
    </article>
  );
}
