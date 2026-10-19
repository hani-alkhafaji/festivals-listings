"use client";

import { useState, type FormEvent } from "react";
import {
  RepostPeriodPicker,
  periodsToSheetText,
  type RepostPeriod,
} from "./RepostPeriodPicker";
import styles from "./join-network.module.css";

export function NetworkMemberForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [periods, setPeriods] = useState<RepostPeriod[]>([]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) {
      setMessage("Please accept the agreement to continue.");
      setStatus("error");
      return;
    }
    if (periods.length === 0) {
      setMessage("Please add at least one date range for repost availability.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries()) as Record<string, string>;
    payload.agreementAccepted = agreed ? "yes" : "no";
    payload.repostAvailability = periodsToSheetText(periods);

    try {
      const res = await fetch("/api/submit-network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Submission failed");
      }
      setStatus("ok");
      setMessage("Thank you. We received your application and we will contact you by email.");
      form.reset();
      setAgreed(false);
      setPeriods([]);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label>
        Festival / page name *
        <input name="festivalPageName" required maxLength={200} placeholder="Madrid Bachata Festival" />
      </label>
      <label>
        Instagram username *
        <input name="instagramUsername" required maxLength={100} placeholder="@your_festival_page" />
      </label>
      <label>
        City (English) *
        <input name="city" required maxLength={100} placeholder="Madrid" />
      </label>
      <label>
        Contact email *
        <input name="email" type="email" required maxLength={200} />
      </label>

      <RepostPeriodPicker periods={periods} onChange={setPeriods} />

      <label>
        Max reposts per month you accept *
        <input
          name="maxRepostsPerMonth"
          required
          type="number"
          min={1}
          max={100}
          placeholder="e.g. 4"
        />
      </label>
      <label>
        Your Go4Events event link (optional)
        <input
          name="go4eventsUrl"
          type="url"
          placeholder="https://go4events.now/eventDetalis/..."
        />
      </label>
      <label>
        Notes (optional)
        <textarea name="notes" rows={2} maxLength={1000} />
      </label>
      <label className={styles.checkLabel}>
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span>
          I agree to join the international festival repost network: I will repost other members&apos;
          festivals on my Instagram when requested, and I allow my festivals to be reposted by other
          approved pages in the network. I understand this is a cooperation agreement, not paid
          advertising unless agreed separately.
        </span>
      </label>
      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Apply to join"}
      </button>
      {message ? (
        <p className={status === "ok" ? styles.success : styles.error}>{message}</p>
      ) : null}
    </form>
  );
}
