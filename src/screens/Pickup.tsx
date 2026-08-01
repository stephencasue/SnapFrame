import { useEffect, useRef, useState } from 'react';
import { BackButton } from '../components/BackButton';
import { renderStrip, type RenderedStrip } from '../utils/strip';
import type { FilterStyle, StripStyle } from '../types';

interface PickupProps {
  photos: string[];
  strip: StripStyle;
  filter: FilterStyle;
  onEdit: () => void;
  onReset: () => void;
  onBack: () => void;
}

/** Width the strip renders at inside the slot card (display px, not native px). */
const SLOT_STRIP_WIDTH = 220;
/** Delay before printing starts, so it only begins once the screen's own
 * enter transition (see App.tsx) has finished (PRD supplement, animation 2). */
const START_DELAY_MS = 320;
/** Total time the "printing" reveal takes, top-to-bottom (PRD supplement: 2.5-3.5s). */
const PRINT_MS = 2800;
/** Small ease-out bounce once the strip has fully emerged. */
const SETTLE_MS = 450;

type PrintPhase = 'idle' | 'printing' | 'settling' | 'done';

/** Screen 5 — Pickup / Download: a pink "print slot" dispenser with a
 * mechanical, top-to-bottom print-out reveal (base PRD Screen 5 + supplement). */
export function Pickup({ photos, strip, filter, onEdit, onReset, onBack }: PickupProps) {
  const [rendered, setRendered] = useState<RenderedStrip | null>(null);
  const [phase, setPhase] = useState<PrintPhase>('idle');
  const timers = useRef<number[]>([]);

  useEffect(() => {
    let active = true;
    renderStrip(photos, strip, filter).then((result) => {
      if (active) setRendered(result);
    });
    return () => {
      active = false;
    };
    // Re-render whenever this screen is (re)entered with new inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos, strip, filter]);

  useEffect(() => {
    // Replay the print-out sequence every time this screen mounts (PRD: once per arrival).
    timers.current.forEach((id) => window.clearTimeout(id));
    setPhase('idle');

    const toPrint = window.setTimeout(() => setPhase('printing'), START_DELAY_MS);
    const toSettle = window.setTimeout(() => setPhase('settling'), START_DELAY_MS + PRINT_MS);
    const toDone = window.setTimeout(() => setPhase('done'), START_DELAY_MS + PRINT_MS + SETTLE_MS);
    timers.current = [toPrint, toSettle, toDone];

    return () => timers.current.forEach((id) => window.clearTimeout(id));
  }, [photos]);

  const handleDownload = () => {
    if (!rendered) return;
    const link = document.createElement('a');
    link.href = rendered.dataUrl;
    link.download = 'snapframe-strip.png';
    link.click();
  };

  const displayHeight = rendered ? SLOT_STRIP_WIDTH * (rendered.height / rendered.width) : 0;
  const isPrinting = phase === 'printing';
  const isEmerged = phase !== 'idle';

  return (
    <div className="sf-screen sf-pickup">
      <div className="sf-topbar">
        <BackButton onClick={onBack} />
      </div>
      <div className="sf-pickup-grid">
        <div className="sf-slot-wrap">
          <div className="sf-slot-card">
            <p className="sf-slot-label">
              Pick up your
              <br />
              photos here
            </p>
            <svg className="sf-slot-chevron" viewBox="0 0 24 14" aria-hidden="true">
              <path
                d="M2 2l10 10 10-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {rendered && (
            <div
              className="sf-slot-strip-clip"
              style={{ width: SLOT_STRIP_WIDTH, height: isEmerged ? displayHeight : 0 }}
            >
              {isPrinting && <div className="sf-slot-scanline" />}
              <img
                src={rendered.dataUrl}
                alt="Your finished photo strip"
                className={`sf-slot-strip-img${isPrinting ? ' is-jittering' : ''}${phase === 'settling' ? ' is-settling' : ''}`}
                style={{ width: SLOT_STRIP_WIDTH, height: displayHeight }}
              />
            </div>
          )}
        </div>

        <div className={`sf-pickup-actions${phase === 'done' ? ' is-visible' : ''}`}>
          <button type="button" className="sf-btn sf-btn-card" onClick={handleDownload} disabled={!rendered}>
            Download
          </button>
          <button type="button" className="sf-btn sf-btn-card" onClick={onEdit}>
            Edit
          </button>
          <button type="button" className="sf-btn sf-btn-card" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>

      <p className="sf-footer-credit">Developed by Stephen</p>
    </div>
  );
}
