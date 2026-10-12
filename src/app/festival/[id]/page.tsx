import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchFestivalById } from "@/lib/loadPublished";
import styles from "./detail.module.css";

export const dynamic = "force-dynamic";

export default async function FestivalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const festival = await fetchFestivalById(params.id);
  if (!festival) notFound();

  const imageSrc = festival.image || "/festivals/placeholder.svg";

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.back}>
        ← Back to festivals
      </Link>
      <article className={styles.card}>
        <div className={styles.imageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt={festival.title} className={styles.image} />
        </div>
        <div className={styles.body}>
          <h1 className={styles.title}>{festival.title}</h1>
          <p className={styles.row}>📅 Start: {festival.dateStart} · End: {festival.dateEnd}</p>
          <p className={styles.row}>🕐 Start: {festival.timeStart} · End: {festival.timeEnd}</p>
          <p className={styles.row}>📍 {festival.city}</p>
          <p className={styles.row}>{festival.address}</p>
          <p className={styles.desc}>{festival.descriptionLong}</p>
          {festival.instagramUrl ? (
            <a
              href={festival.instagramUrl}
              className={styles.igBtn}
              target="_blank"
              rel="noopener noreferrer"
            >
              Festival Instagram
            </a>
          ) : null}
        </div>
      </article>
    </div>
  );
}
