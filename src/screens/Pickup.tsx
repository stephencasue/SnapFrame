import { useEffect, useState, type TransitionEvent } from 'react';
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

const SLOT_STRIP_WIDTH = 220;
const START_DELAY_MS = 420;
const PRINT_FALLBACK_MS = 3100;
const SETTLE_MS = 360;

type PrintPhase = 'rendering' | 'ready' | 'printing' | 'settling' | 'done' | 'error';

const PHASE_LABELS: Record<PrintPhase, string> = {
  rendering: 'Developing your photo strip',
  ready: 'Photo booth ready',
  printing: 'Printing photo strip',
  settling: 'Finishing photo strip',
  done: 'Photo strip ready',
  error: 'Photo strip could not be printed',
};

/** Screen 5 — a photo booth machine with a rendering-aware print reveal. */
export function Pickup({ photos, strip, filter, onEdit, onReset, onBack }: PickupProps) {
  const [rendered, setRendered] = useState<RenderedStrip | null>(null);
  const [phase, setPhase] = useState<PrintPhase>('rendering');
  const [error, setError] = useState('');
  const [renderAttempt, setRenderAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setRendered(null);
    setError('');
    setPhase('rendering');

    renderStrip(photos, strip, filter)
      .then((result) => {
        if (!active) return;
        setRendered(result);
        setPhase('ready');
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(reason instanceof Error ? reason.message : 'Your strip could not be prepared.');
        setPhase('error');
      });

    return () => {
      active = false;
    };
  }, [photos, strip, filter, renderAttempt]);

  useEffect(() => {
    if (phase !== 'ready') return;

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done');
      return;
    }

    const timer = window.setTimeout(() => setPhase('printing'), START_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'printing') return;
    const fallback = window.setTimeout(() => setPhase('settling'), PRINT_FALLBACK_MS);
    return () => window.clearTimeout(fallback);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'settling') return;
    const timer = window.setTimeout(() => setPhase('done'), SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  const handlePrintTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName === 'height' && phase === 'printing') setPhase('settling');
  };

  const handleDownload = () => {
    if (!rendered || phase !== 'done') return;
    const link = document.createElement('a');
    link.href = rendered.dataUrl;
    link.download = `snapframe-${strip.id}-${filter.id}.png`;
    link.click();
  };

  const displayHeight = rendered ? SLOT_STRIP_WIDTH * (rendered.height / rendered.width) : 0;
  const isEmerged = phase === 'printing' || phase === 'settling' || phase === 'done';
  const actionsVisible = phase === 'done' || phase === 'error';

  return (
    <div className="sf-screen sf-pickup">
      <div className="sf-topbar">
        <BackButton onClick={onBack} />
      </div>

      <header className="sf-pickup-header">
        <h1>Photo lab</h1>
        <p>Your photos are developing inside the booth.</p>
      </header>

      <div className="sf-pickup-grid">
        <div className="sf-slot-wrap">
          <p className="sf-visually-hidden" aria-live="polite">{PHASE_LABELS[phase]}</p>

          <div className={`sf-photobooth-machine is-${phase}`} aria-label="SnapFrame photo booth printer">
            <div className="sf-machine-top">
              <span className="sf-machine-flash" aria-hidden="true"><i /></span>
              <div className="sf-machine-brand">
                <strong>SnapFrame</strong>
                <small>PHOTO BOOTH</small>
              </div>
              <span className="sf-machine-flash" aria-hidden="true"><i /></span>
            </div>

            <div className="sf-machine-display" aria-hidden="true">
              <span className="sf-viewfinder-corner is-top-left" />
              <span className="sf-viewfinder-corner is-top-right" />
              <span className="sf-viewfinder-corner is-bottom-left" />
              <span className="sf-viewfinder-corner is-bottom-right" />
              <div className="sf-machine-lens">
                <span className="sf-machine-lens-core" />
              </div>
              <span className="sf-machine-sparkle is-one">✦</span>
              <span className="sf-machine-sparkle is-two">✦</span>
            </div>

            <div className="sf-machine-console" aria-hidden="true">
              <div className="sf-machine-controls">
                <span />
                <span />
                <span />
              </div>
              <div className="sf-machine-feed"><span /></div>
            </div>

            {phase === 'error' && (
              <button type="button" className="sf-machine-retry" onClick={() => setRenderAttempt((attempt) => attempt + 1)}>
                Retry
              </button>
            )}

            <div className="sf-machine-output" aria-hidden="true">
              <span>PRINTS HERE</span>
              <div className="sf-machine-slot-mouth" />
            </div>
          </div>

          {rendered && (
            <div
              className={`sf-slot-strip-clip${phase === 'printing' ? ' is-printing' : ''}`}
              style={{ width: SLOT_STRIP_WIDTH, height: isEmerged ? displayHeight : 0 }}
              onTransitionEnd={handlePrintTransitionEnd}
            >
              {phase === 'printing' && <div className="sf-slot-scanline" />}
              <img
                src={rendered.dataUrl}
                alt="Your finished photo strip"
                className={`sf-slot-strip-img${phase === 'printing' ? ' is-jittering' : ''}${phase === 'settling' ? ' is-settling' : ''}`}
                style={{ width: SLOT_STRIP_WIDTH, height: displayHeight }}
              />
            </div>
          )}

          {error && <p className="sf-print-error">{error}</p>}
        </div>

        <div className={`sf-pickup-actions${actionsVisible ? ' is-visible' : ''}`}>
          <button
            type="button"
            className="sf-btn sf-btn-card"
            onClick={handleDownload}
            disabled={!rendered || phase !== 'done'}
          >
            Download strip
          </button>
          <button type="button" className="sf-btn sf-btn-card" onClick={onEdit}>
            Edit design
          </button>
          <button type="button" className="sf-btn sf-btn-card sf-btn-quiet" onClick={onReset}>
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
