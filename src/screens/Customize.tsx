import { FILTER_STYLES, STRIP_STYLES } from '../presets';
import { BackButton } from '../components/BackButton';
import type { FilterStyle, StripSticker, StripStyle } from '../types';

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

interface StickerLayerProps {
  stickers?: readonly StripSticker[];
}

function StickerLayer({ stickers }: StickerLayerProps) {
  if (!stickers?.length) return null;

  return (
    <div className="sf-strip-sticker-layer" aria-hidden="true">
      {stickers.map((sticker) => (
        <img
          key={`${sticker.src}-${sticker.x}`}
          src={sticker.src}
          alt=""
          className="sf-strip-sticker"
          style={{
            left: `${sticker.x * 100}%`,
            width: `${sticker.size * 100}%`,
            transform: `translateX(-50%) rotate(${sticker.rotation ?? 0}deg)`,
          }}
        />
      ))}
    </div>
  );
}

/** Screen 4 — visual strip and filter customization. */
export function Customize({
  photos,
  strip,
  filter,
  onStripChange,
  onFilterChange,
  onNext,
  onRetake,
  onBack,
}: CustomizeProps) {
  const previewPhoto = photos[0];

  return (
    <div className="sf-screen sf-customize">
      <div className="sf-topbar">
        <BackButton onClick={onBack} />
      </div>

      <header className="sf-customize-header">
        <h1>Make it yours</h1>
        <p>Choose a frame and a photo mood. Your preview updates instantly.</p>
      </header>

      <div className="sf-customize-grid">
        <section className="sf-preview-stage" aria-label={`Preview: ${strip.label} frame with ${filter.label} filter`}>
          <span className="sf-preview-badge">Live preview</span>
          <div className="sf-strip-preview" style={{ backgroundColor: strip.frameColor }}>
            {photos.map((src, index) => (
              <div key={src} className="sf-strip-photo" style={{ borderColor: strip.dividerColor }}>
                <img src={src} alt={`Captured shot ${index + 1}`} style={{ filter: filter.cssFilter }} />
              </div>
            ))}
            <div className="sf-strip-footer" style={{ color: strip.captionColor }}>
              {strip.motif && <span className="sf-strip-motif">{strip.motif}</span>}
              <StickerLayer stickers={strip.stickers} />
            </div>
          </div>
          <div className="sf-preview-selection" aria-live="polite">
            <strong>{strip.label}</strong>
            <span>{filter.label}</span>
          </div>
        </section>

        <div className="sf-customize-controls sf-panel">
          <section className="sf-preset-section" aria-labelledby="strip-options-title">
            <div className="sf-selector-heading">
              <div>
                <span className="sf-selector-step">01</span>
                <h2 id="strip-options-title" className="sf-selector-title">Pick a strip</h2>
              </div>
              <span>{strip.description}</span>
            </div>
            <div className="sf-strip-options" role="radiogroup" aria-label="Strip frame style">
              {STRIP_STYLES.map((option) => {
                const selected = strip.id === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={`${option.label}: ${option.description}`}
                    className={`sf-strip-option${selected ? ' is-selected' : ''}`}
                    onClick={() => onStripChange(option)}
                  >
                    <span className="sf-strip-option-thumb" style={{ backgroundColor: option.frameColor }} aria-hidden="true">
                      <span className="sf-strip-option-photos">
                        {[0, 1].map((item) => (
                          <span key={item} className="sf-strip-option-photo" style={{ borderColor: option.dividerColor }}>
                            {previewPhoto && <img src={previewPhoto} alt="" style={{ filter: filter.cssFilter }} />}
                          </span>
                        ))}
                      </span>
                      <span className="sf-strip-option-footer">
                        <StickerLayer stickers={option.stickers} />
                      </span>
                    </span>
                    <span className="sf-strip-option-copy">
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </span>
                    <span className="sf-option-check" aria-hidden="true">✓</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="sf-preset-section" aria-labelledby="filter-options-title">
            <div className="sf-selector-heading">
              <div>
                <span className="sf-selector-step">02</span>
                <h2 id="filter-options-title" className="sf-selector-title">Pick a filter</h2>
              </div>
              <span>{filter.description}</span>
            </div>
            <div className="sf-filter-options" role="radiogroup" aria-label="Photo filter">
              {FILTER_STYLES.map((option) => {
                const selected = filter.id === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={`${option.label}: ${option.description}`}
                    className={`sf-filter-option${selected ? ' is-selected' : ''}`}
                    onClick={() => onFilterChange(option)}
                  >
                    <span className="sf-filter-option-image" aria-hidden="true">
                      {previewPhoto ? (
                        <img src={previewPhoto} alt="" style={{ filter: option.cssFilter }} />
                      ) : (
                        <span className="sf-filter-placeholder" />
                      )}
                    </span>
                    <span className="sf-filter-option-copy">
                      <strong>{option.label}</strong>
                      <small>{option.description}</small>
                    </span>
                    <span className="sf-option-check" aria-hidden="true">✓</span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="sf-customize-actions">
            <button type="button" className="sf-btn sf-btn-primary" onClick={onNext}>
              Print my strip
            </button>
            <button type="button" className="sf-btn sf-btn-outline" onClick={onRetake}>
              Retake photos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
