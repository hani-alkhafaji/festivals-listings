"use client";

import { useMemo } from "react";
import type { Festival } from "@/lib/festivals";
import { filterByCity } from "@/lib/festivals";
import { FestivalCard } from "./FestivalCard";
import { useCitySearch } from "./SearchContext";
import styles from "./HomeClient.module.css";

type Props = {
  festivals: Festival[];
  headline: string;
};

export function HomeClient({ festivals, headline }: Props) {
  const { cityQuery } = useCitySearch();

  const filtered = useMemo(
    () => filterByCity(festivals, cityQuery),
    [festivals, cityQuery]
  );

  const hasSearch = cityQuery.trim().length > 0;
  const noResults = hasSearch && filtered.length === 0;

  return (
    <main className={styles.main}>
      <h1 className={styles.headline}>{headline}</h1>

      {!hasSearch && <p className={styles.sectionLabel}>New Festivals</p>}
      {hasSearch && !noResults && (
        <p className={styles.sectionLabel}>Festivals in {cityQuery.trim()}</p>
      )}

      <div className={styles.list}>
        {noResults && (
          <p className={styles.empty}>
            No festivals found in &quot;{cityQuery.trim()}&quot;. Try another city name in English (e.g. Vienna, Prague).
          </p>
        )}
        {filtered.map((f) => (
          <div key={f.id} className={styles.snapItem}>
            <FestivalCard festival={f} />
          </div>
        ))}
      </div>
    </main>
  );
}
