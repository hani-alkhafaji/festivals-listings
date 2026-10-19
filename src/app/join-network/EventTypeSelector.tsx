"use client";

import { NETWORK_EVENT_TYPES } from "./eventTypes";
import styles from "./join-network.module.css";

type Props = {
  selected: string[];
  onChange: (types: string[]) => void;
  otherText: string;
  onOtherTextChange: (v: string) => void;
};

export function EventTypeSelector({ selected, onChange, otherText, onOtherTextChange }: Props) {
  function toggle(type: string) {
    if (selected.includes(type)) {
      onChange(selected.filter((t) => t !== type));
    } else {
      onChange([...selected, type]);
    }
  }

  return (
    <fieldset className={styles.typeFieldset}>
      <legend className={styles.typeLegend}>
        Event types on your page (what you can repost) *
      </legend>
      <p className={styles.periodHint}>
        Choose only styles that match your audience. We will not ask you to repost unrelated events
        (for example salsa/bachata pages will not be asked to repost reggaeton-only events).
      </p>
      <div className={styles.typeGrid}>
        {NETWORK_EVENT_TYPES.map((type) => (
          <label key={type} className={styles.typeChip}>
            <input
              type="checkbox"
              checked={selected.includes(type)}
              onChange={() => toggle(type)}
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
      {selected.includes("Other") ? (
        <label className={styles.otherTypeLabel}>
          Describe other styles
          <input
            type="text"
            value={otherText}
            onChange={(e) => onOtherTextChange(e.target.value)}
            maxLength={200}
            placeholder="e.g. West Coast Swing"
          />
        </label>
      ) : null}
    </fieldset>
  );
}

export function eventTypesForSheet(selected: string[], otherText: string): string {
  const list = selected.filter((t) => t !== "Other");
  if (selected.includes("Other") && otherText.trim()) {
    list.push(`Other: ${otherText.trim()}`);
  } else if (selected.includes("Other")) {
    list.push("Other");
  }
  return list.join(", ");
}
