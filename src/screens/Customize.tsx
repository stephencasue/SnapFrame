import { FILTER_STYLES, STRIP_STYLES } from '../presets';
import { BackButton } from '../components/BackButton';
import { Pill } from '../components/Pill';
import type { FilterStyle, StripStyle } from '../types';

interface CustomizeProps {
  photos: string[];
  strip: StripStyle;
  filter: FilterStyle;
  onStripChange: (strip: StripStyle) => void;
  onFilterChange: (filter: FilterStyle) => void;
  onNext: () => void;
  onRetake: () => void;
  onBack: () => void;
}

/** Screen 4 — Strip & Filter Customization (PRD Section 7, Screen 4). */
export function Customize({ photos, strip, filter, onStripChange, onFilterChange, onNext, onRetake, onBack }: CustomizeProps) {
  return (
    <div className="sf-screen sf-customize">
      <div className="sf-topbar">
        <BackButton onClick={onBack} />
      </div>
      <div className="sf-customize-grid">
        <div className="sf-strip-preview" style={{ background: strip.frameColor }}>
          {photos.map((src, i) => (
            <div key={i} className="sf-strip-photo" style={{ borderColor: strip.dividerColor }}>
              <img src={src} alt={`Captured shot ${i + 1}`} style={{ filter: filter.cssFilter }} />
            </div>
          ))}
          {strip.motif && (
            <div className="sf-strip-motif" style={{ color: strip.captionColor }} aria-hidden="true">
              {strip.motif}
            </div>
          )}
        </div>

        <div className="sf-customize-controls">
          <div>
            <h2 className="sf-selector-title">Strips</h2>
            <div className="sf-pill-group" role="radiogroup" aria-label="Strip frame style">
              {STRIP_STYLES.map((s) => (
                <Pill key={s.id} label={s.label} selected={strip.id === s.id} onClick={() => onStripChange(s)} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="sf-selector-title">Filters</h2>
            <div className="sf-pill-group" role="radiogroup" aria-label="Photo filter">
              {FILTER_STYLES.map((f) => (
                <Pill key={f.id} label={f.label} selected={filter.id === f.id} onClick={() => onFilterChange(f)} />
              ))}
            </div>
          </div>

          <div className="sf-customize-actions">
            <button type="button" className="sf-btn sf-btn-primary" onClick={onNext}>
              Next
            </button>
            <button type="button" className="sf-btn sf-btn-outline" onClick={onRetake}>
              Retake
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
