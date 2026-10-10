"use client";

import Link from "next/link";
import { useState } from "react";
import { useCitySearch } from "./SearchContext";
import styles from "./SiteHeader.module.css";

export function SiteHeader({ cityOptions }: { cityOptions: string[] }) {
  const [open, setOpen] = useState(false);
  const { cityQuery, setCityQuery } = useCitySearch();

  return (
    <>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.burger}
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={styles.searchWrap}>
          <input
            type="search"
            className={styles.search}
            placeholder="Search for city"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            autoComplete="off"
            list="city-suggestions"
            aria-label="Search for city"
          />
          <datalist id="city-suggestions">
            {cityOptions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </header>

      {open && (
        <div className={styles.overlay} role="presentation" onClick={() => setOpen(false)} />
      )}
      <nav className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`} aria-hidden={!open}>
        <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Close menu">
          ×
        </button>
        <p className={styles.drawerTitle}>Menu</p>
        <Link href="/" className={styles.drawerLink} onClick={() => setOpen(false)}>
          All festivals
        </Link>
        <Link href="/submit" className={styles.drawerLink} onClick={() => setOpen(false)}>
          Submit your festival (€49 listing)
        </Link>
        <Link href="/admin" className={styles.drawerLink} onClick={() => setOpen(false)}>
          Publisher notes
        </Link>
      </nav>
    </>
  );
}
