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
    "festivalPageName",
    "instagramUsername",
    "city",
    "email",
    "repostAvailability",
    "maxRepostsPerMonth",
  ] as const;

  for (const key of required) {
    if (!String(body[key] ?? "").trim()) {
      return NextResponse.json({ ok: false, error: `Missing field: ${key}` }, { status: 400 });
    }
  }

  if (!String(body.eventTypes ?? "").trim()) {
    return NextResponse.json({ ok: false, error: "Missing field: eventTypes" }, { status: 400 });
  }

  if (body.agreementAccepted !== "yes") {
    return NextResponse.json({ ok: false, error: "Agreement must be accepted" }, { status: 400 });
  }

  const payload = {
    type: "network_member",
    timestamp: new Date().toISOString(),
    ...body,
    status: "NEW",
  };

  try {
    const res = await fetch(gasUrl.trim(), {
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
