import { fetchGo4EventByUrl, extractGo4EventId } from "@/lib/go4events";
import {
  getLocalFestivals,
  sortFestivals,
  type Festival,
} from "@/lib/festivals";

function normalizeFestival(raw: Record<string, unknown>): Festival | null {
  const go4eventsUrl = String(raw.go4eventsUrl ?? raw.go4events ?? "").trim();

  let id = String(raw.id ?? "").trim();
  if (!id && go4eventsUrl) {
    id = extractGo4EventId(go4eventsUrl) || "";
  }
  if (!id && !go4eventsUrl) return null;

  let image = String(raw.image ?? raw.imageUrl ?? "").trim();
  if (image) {
    image = image.replace(/^public\//, "");
    if (!/^https?:\/\//i.test(image) && !image.startsWith("/")) {
      image = `/${image}`;
    }
  }

  return {
    id: id || "event",
    title: String(raw.title ?? "").trim(),
    city: String(raw.city ?? "").trim(),
    address: String(raw.address ?? "").trim(),
    dateStart: String(raw.dateStart ?? "").trim(),
    dateEnd: String(raw.dateEnd ?? "").trim(),
    timeStart: String(raw.timeStart ?? "").trim(),
    timeEnd: String(raw.timeEnd ?? "").trim(),
    sortDate: String(raw.sortDate ?? "").trim(),
    image,
    descriptionShort: String(raw.descriptionShort ?? raw.description ?? "").trim(),
    descriptionLong: String(
      raw.descriptionLong ?? raw.descriptionShort ?? raw.description ?? ""
    ).trim(),
    instagramUrl: String(raw.instagramUrl ?? "").trim(),
    go4eventsUrl,
  };
}

async function enrichFromGo4(f: Festival): Promise<Festival> {
  if (!f.go4eventsUrl) return f;

  const fromGo4 = await fetchGo4EventByUrl(f.go4eventsUrl);
  if (!fromGo4) return f;

  return {
    ...f,
    id: f.id || fromGo4.id,
    title: f.title || fromGo4.title,
    city: f.city || fromGo4.city,
    address: f.address || fromGo4.address,
    dateStart: f.dateStart || fromGo4.dateStart,
    dateEnd: f.dateEnd || fromGo4.dateEnd,
    timeStart: f.timeStart || fromGo4.timeStart,
    timeEnd: f.timeEnd || fromGo4.timeEnd,
    sortDate: f.sortDate || fromGo4.sortDate,
    image: f.image || fromGo4.image,
    descriptionShort: f.descriptionShort || fromGo4.descriptionShort,
    descriptionLong: f.descriptionLong || fromGo4.descriptionLong,
    go4eventsUrl: f.go4eventsUrl,
  };
}

export async function fetchPublishedFestivals(): Promise<Festival[]> {
  const gasUrl = process.env.GAS_WEB_APP_URL?.trim();
  if (gasUrl) {
    try {
      const url = new URL(gasUrl);
      url.searchParams.set("action", "festivals");
      const res = await fetch(url.toString(), { next: { revalidate: 120 } });
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.festivals)) {
          const base = data.festivals
            .map((row: Record<string, unknown>) => normalizeFestival(row))
            .filter(
              (f: Festival | null): f is Festival =>
                f !== null && (!!f.go4eventsUrl || !!f.title)
            );
          const enriched = await Promise.all(base.map(enrichFromGo4));
          if (enriched.length > 0) return sortFestivals(enriched);
        }
      }
    } catch {
      /* fallback */
    }
  }
  return getLocalFestivals();
}

export async function fetchFestivalById(id: string): Promise<Festival | null> {
  const wanted = decodeURIComponent(id).trim().toLowerCase();
  const list = await fetchPublishedFestivals();
  return (
    list.find((f) => f.id.trim().toLowerCase() === wanted) ??
    list.find((f) => f.id.trim() === id.trim()) ??
    null
  );
}
