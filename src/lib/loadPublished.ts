import {
  getLocalFestivals,
  sortFestivals,
  type Festival,
} from "@/lib/festivals";

function normalizeFestival(raw: Record<string, unknown>): Festival | null {
  const id = String(raw.id ?? "").trim();
  if (!id) return null;

  let image = String(raw.image ?? raw.imageUrl ?? "").trim();
  if (image) {
    image = image.replace(/^public\//, "");
    if (!/^https?:\/\//i.test(image) && !image.startsWith("/")) {
      image = `/${image}`;
    }
  }

  return {
    id,
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
          const list = data.festivals
            .map((row: Record<string, unknown>) => normalizeFestival(row))
            .filter((f: Festival | null): f is Festival => f !== null && !!f.title);
          if (list.length > 0) return sortFestivals(list);
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
