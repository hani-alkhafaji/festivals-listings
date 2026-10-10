import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const gasUrl = process.env.GAS_WEB_APP_URL;
  if (!gasUrl) {
    return NextResponse.json(
      { ok: false, error: "Server is not connected to Google Sheets yet." },
      { status: 503 }
    );
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const required = [
    "festivalName",
    "city",
    "address",
    "dateStart",
    "dateEnd",
    "timeStart",
    "timeEnd",
    "email",
    "description",
  ] as const;

  for (const key of required) {
    if (!String(body[key] ?? "").trim()) {
      return NextResponse.json({ ok: false, error: `Missing field: ${key}` }, { status: 400 });
    }
  }

  const payload = {
    type: "festival_request",
    timestamp: new Date().toISOString(),
    ...body,
    status: "NEW",
    listingFeeEur: 49,
  };

  try {
    const res = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      throw new Error(data.error || "Google Sheets error");
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Submit failed" },
      { status: 502 }
    );
  }
}
