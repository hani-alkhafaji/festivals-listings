import { NextResponse } from "next/server";

function validateGasUrl(url: string): string | null {
  const trimmed = url.trim();
  if (trimmed.startsWith("/**") || trimmed.includes("function doPost")) {
    return "GAS_WEB_APP_URL must be the Web App link (https://script.google.com/.../exec), not the Apps Script code.";
  }
  if (!trimmed.startsWith("https://script.google.com/")) {
    return "GAS_WEB_APP_URL must start with https://script.google.com/ and end with /exec";
  }
  if (!trimmed.includes("/exec")) {
    return "Use the deployment URL that ends with /exec (Deploy → Web app → copy URL).";
  }
  return null;
}

export async function POST(request: Request) {
  const gasUrl = process.env.GAS_WEB_APP_URL;
  if (!gasUrl) {
    return NextResponse.json(
      { ok: false, error: "Server is not connected to Google Sheets yet." },
      { status: 503 }
    );
  }

  const urlError = validateGasUrl(gasUrl);
  if (urlError) {
    return NextResponse.json({ ok: false, error: urlError }, { status: 503 });
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
    const res = await fetch(gasUrl.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirect: "follow",
    });

    const text = await res.text();
    let data: { ok?: boolean; error?: string } = {};
    try {
      data = JSON.parse(text);
    } catch {
      if (text.includes("function doPost") || text.startsWith("/**")) {
        throw new Error(
          "Wrong GAS_WEB_APP_URL: Vercel must use the Web App URL ending in /exec, not the script source code."
        );
      }
      throw new Error(
        "Google did not return JSON. Check Web app deploy (Anyone) and redeploy a new version."
      );
    }

    if (!res.ok || data.ok === false) {
      throw new Error(data.error || "Google Sheets error");
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Submit failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 502 });
  }
}
