const DEFAULT_PROJECT_ID = "bachataalist-x7jsy8";

/** Same zone as most events (matches Go4Events in Austria / Central Europe). */
const EVENT_TIMEZONE =
  process.env.EVENT_TIMEZONE?.trim() || "Europe/Vienna";

type FirestoreValue = {
  stringValue?: string;
  timestampValue?: string;
  doubleValue?: number;
};

function fieldString(fields: Record<string, FirestoreValue>, key: string): string {
  const v = fields[key];
  if (!v) return "";
  if (v.stringValue) return v.stringValue;
  if (v.timestampValue) return v.timestampValue;
  return "";
}

export function extractGo4EventId(url: string): string | null {
  const trimmed = url.trim();
  const match = trimmed.match(/eventDetalis\/([^/?#]+)/i);
  return match ? match[1] : null;
}

export type Go4EventData = {
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
};

function parseIsoDate(iso: string): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

function formatDisplayDate(iso: string): string {
  const d = parseIsoDate(iso);
  if (!d) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: EVENT_TIMEZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(d)
    .toUpperCase()
    .replace(/\./g, "");
}

function formatTime(iso: string): string {
  const d = parseIsoDate(iso);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: EVENT_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

function sortDateFromIso(iso: string): string {
  const d = parseIsoDate(iso);
  if (!d) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: EVENT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export async function fetchGo4EventByUrl(go4Url: string): Promise<Go4EventData | null> {
  const eventId = extractGo4EventId(go4Url);
  if (!eventId) return null;

  const projectId =
    process.env.GO4_FIREBASE_PROJECT_ID?.trim() || DEFAULT_PROJECT_ID;

  const docUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/events/${eventId}`;

  try {
    const res = await fetch(docUrl, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const doc = await res.json();
    const fields = (doc.fields || {}) as Record<string, FirestoreValue>;

    const title = fieldString(fields, "title") || "Event on Go4Events";
    const image = fieldString(fields, "eventPhoto");
    const city = fieldString(fields, "city");
    const address = fieldString(fields, "location") || city;
    const description = fieldString(fields, "description");
    const startIso = fieldString(fields, "date");
    const endIso = fieldString(fields, "closeDate");

    return {
      id: eventId,
      title,
      city,
      address,
      dateStart: formatDisplayDate(startIso),
      dateEnd: formatDisplayDate(endIso || startIso),
      timeStart: formatTime(startIso),
      timeEnd: formatTime(endIso),
      sortDate: sortDateFromIso(startIso) || "9999-12-31",
      image,
      descriptionShort: description.slice(0, 180),
      descriptionLong: description,
    };
  } catch {
    return null;
  }
}
