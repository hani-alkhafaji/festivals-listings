"use client";

import { useState, type FormEvent } from "react";
import styles from "./submit.module.css";

export function SubmitForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/submit-festival", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Submission failed");
      }
      setStatus("ok");
      setMessage("Thank you. We received your request and will email you about payment (€49) before publishing.");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label>
        Festival name *
        <input name="festivalName" required maxLength={200} />
      </label>
      <label>
        City (English) *
        <input name="city" required placeholder="Vienna" maxLength={100} />
      </label>
      <label>
        Venue / address *
        <input name="address" required maxLength={300} />
      </label>
      <div className={styles.row2}>
        <label>
          Start date *
          <input name="dateStart" type="date" required />
        </label>
        <label>
          End date *
          <input name="dateEnd" type="date" required />
        </label>
      </div>
      <div className={styles.row2}>
        <label>
          Start time *
          <input name="timeStart" type="time" required />
        </label>
        <label>
          End time *
          <input name="timeEnd" type="time" required />
        </label>
      </div>
      <label>
        Contact email *
        <input name="email" type="email" required maxLength={200} />
      </label>
      <label>
        Festival entrance ticket price (for visitors)
        <input
          name="ticketPrice"
          type="text"
          placeholder="e.g. €25, Free before 22:00, from €30"
          maxLength={120}
        />
      </label>
      <label>
        Ticket booking link (optional)
        <input
          name="bookingUrl"
          type="url"
          placeholder="https://goandance.com/... or your ticket shop"
        />
      </label>
      <label>
        Festival Instagram URL
        <input name="instagramUrl" type="url" placeholder="https://instagram.com/your_festival" />
      </label>
      <label>
        Poster image URL (optional)
        <input name="imageUrl" type="url" placeholder="https://..." />
      </label>
      <p className={styles.help}>
        For the poster link: upload your image to Go4Events when you create the event, or use a
        public link (Google Drive → Share → anyone with the link → copy link). We keep the URL field
        to keep the form simple.
      </p>
      <label>
        Short description *
        <textarea name="description" required rows={4} maxLength={2000} />
      </label>
      <button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Submit request"}
      </button>
      {message ? (
        <p className={status === "ok" ? styles.success : styles.error}>{message}</p>
      ) : null}
    </form>
  );
}
