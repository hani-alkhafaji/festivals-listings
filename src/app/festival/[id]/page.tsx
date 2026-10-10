import Link from "next/link";
import { notFound } from "next/navigation";
import { getFestivalById, getLocalFestivals } from "@/lib/festivals";
import styles from "./detail.module.css";

async function loadFestival(id: string) {
  const gasUrl = process.env.GAS_WEB_APP_URL;
  if (gasUrl) {
    try {
      const url = new URL(gasUrl);
      url.searchParams.set("action", "festivals");
      const res = await fetch(url.toString(), { next: { revalidate: 120 } });
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.festivals)) {
          return data.festivals.find((f: { id: string }) => f.id === id) ?? null;
        }
      }
    } catch {
      /* fallback */
    }
  }
  return getFestivalById(id);
}

export async function generateStaticParams() {
  return getLocalFestivals().map((f) => ({ id: f.id }));
}

export default async function FestivalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const festival = await loadFestival(params.id);
  if (!festival) notFound();

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.back}>
        ← Back to festivals
      </Link>
      <article className={styles.card}>
        <div className={styles.imageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={festival.image} alt={festival.title} className={styles.image} />
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
