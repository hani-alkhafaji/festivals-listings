"use client";

import { useState } from "react";
import styles from "./join-network.module.css";

export type RepostPeriod = { start: string; end: string };

function formatLabel(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function periodsToSheetText(periods: RepostPeriod[]): string {
  return periods
    .map((p) => `${formatLabel(p.start)} – ${formatLabel(p.end)}`)
    .join(" | ");
}

type Props = {
  periods: RepostPeriod[];
  onChange: (periods: RepostPeriod[]) => void;
};

export function RepostPeriodPicker({ periods, onChange }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [draftStart, setDraftStart] = useState("");
  const [draftEnd, setDraftEnd] = useState("");
  const [pickerError, setPickerError] = useState("");

  function openModal() {
    setDraftStart("");
    setDraftEnd("");
    setPickerError("");
    setModalOpen(true);
  }

  function addPeriod() {
    if (!draftStart || !draftEnd) {
      setPickerError("Please choose start and end dates.");
      return;
    }
    if (draftEnd < draftStart) {
      setPickerError("End date must be on or after start date.");
      return;
    }
    onChange([...periods, { start: draftStart, end: draftEnd }]);
    setModalOpen(false);
  }

  function removePeriod(index: number) {
    onChange(periods.filter((_, i) => i !== index));
  }

  return (
    <div className={styles.periodBlock}>
      <span className={styles.periodLabel}>
        When can you repost other festivals? (date ranges) *
      </span>
      <p className={styles.periodHint}>
        Add one or more periods (like flight dates). Days only — no times.
      </p>

      {periods.length > 0 ? (
        <ul className={styles.periodList}>
          {periods.map((p, i) => (
            <li key={`${p.start}-${p.end}-${i}`} className={styles.periodItem}>
              <span>
                {formatLabel(p.start)} → {formatLabel(p.end)}
              </span>
              <button type="button" className={styles.periodRemove} onClick={() => removePeriod(i)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.periodEmpty}>No periods added yet.</p>
      )}

      <button type="button" className={styles.periodAddBtn} onClick={openModal}>
        + Add date range
      </button>

      {modalOpen ? (
        <div className={styles.modalBackdrop} role="presentation" onClick={() => setModalOpen(false)}>
          <div
            className={styles.modal}
            role="dialog"
            aria-labelledby="period-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="period-modal-title" className={styles.modalTitle}>
              Select availability period
            </h3>
            <p className={styles.modalSub}>From — To (inclusive)</p>
            <div className={styles.modalDates}>
              <label>
                From
                <input
                  type="date"
                  value={draftStart}
                  onChange={(e) => setDraftStart(e.target.value)}
                />
              </label>
              <label>
                To
                <input
                  type="date"
                  value={draftEnd}
                  min={draftStart || undefined}
                  onChange={(e) => setDraftEnd(e.target.value)}
                />
              </label>
            </div>
            {pickerError ? <p className={styles.modalError}>{pickerError}</p> : null}
            <div className={styles.modalActions}>
              <button type="button" className={styles.modalCancel} onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="button" className={styles.modalConfirm} onClick={addPeriod}>
                Add period
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
