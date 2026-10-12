import localFestivals from "../../data/festivals.json";
import site from "../../data/site.json";

export type Festival = {
  id: string;
  title: string;
  city: string;
  address: string;
  dateStart: string;
  dateEnd: string;
  timeStart: string;
  timeEnd: string;
  sortDate: string;
  image: string;
  descriptionShort: string;
  descriptionLong: string;
  instagramUrl: string;
  /** When set, card opens this Go4Events page (image/title loaded from Go4Events). */
  go4eventsUrl?: string;
  /** Ticket booking page (GoAndDance, etc.) */
  bookingUrl?: string;
};

export function getSiteConfig() {
  return site;
}

export function getLocalFestivals(): Festival[] {
  return sortFestivals(localFestivals as Festival[]);
}

export function getFestivalById(id: string): Festival | null {
  return getLocalFestivals().find((f) => f.id === id) ?? null;
}

export function sortFestivals(list: Festival[]): Festival[] {
  return [...list].sort((a, b) => {
    const da = a.sortDate || "9999-12-31";
    const db = b.sortDate || "9999-12-31";
    return da.localeCompare(db);
  });
}

export function filterByCity(list: Festival[], query: string): Festival[] {
  const q = query.trim().toLowerCase();
  if (!q) return sortFestivals(list);
  return sortFestivals(list.filter((f) => f.city.toLowerCase().includes(q)));
}

export function uniqueCities(list: Festival[]): string[] {
  const set = new Set(list.map((f) => f.city.trim()).filter(Boolean));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}
