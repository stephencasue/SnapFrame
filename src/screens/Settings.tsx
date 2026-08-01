import { BackButton } from '../components/BackButton';
import { Logo } from '../components/Logo';
import { PhotoBoothArtwork } from '../components/PhotoBoothArtwork';
import { Pill } from '../components/Pill';
import type { SessionSettings, ShotOption, TimerOption } from '../types';

interface SettingsProps {
  settings: SessionSettings;
  onChange: (settings: SessionSettings) => void;
  onNext: () => void;
  onBack: () => void;
}

const TIMER_OPTIONS: TimerOption[] = [3, 5, 10];
const SHOT_OPTIONS: ShotOption[] = [3, 4];

/** Screen 2 — Photo Booth Settings (PRD Section 7, Screen 2). */
export function Settings({ settings, onChange, onNext, onBack }: SettingsProps) {
  return (
    <div className="sf-screen sf-settings">
      <div className="sf-topbar">
        <BackButton onClick={onBack} />
        <Logo />
      </div>
      <h2 className="sf-settings-title">Photo Booth Settings</h2>

      <div className="sf-settings-grid">
        <div className="sf-settings-form">
          <section>
            <h3 className="sf-section-label">Timer</h3>
            <div className="sf-pill-group" role="radiogroup" aria-label="Timer duration">
              {TIMER_OPTIONS.map((t) => (
                <Pill
                  key={t}
                  label={`${t}s`}
                  selected={settings.timer === t}
                  onClick={() => onChange({ ...settings, timer: t })}
                />
              ))}
            </div>
          </section>

          <section>
            <h3 className="sf-section-label">Shots</h3>
            <div className="sf-pill-group" role="radiogroup" aria-label="Number of shots">
              {SHOT_OPTIONS.map((s) => (
                <Pill
                  key={s}
                  label={`${s} photos`}
                  selected={settings.shots === s}
                  onClick={() => onChange({ ...settings, shots: s })}
                />
              ))}
            </div>
          </section>

          <button type="button" className="sf-btn sf-btn-primary" onClick={onNext}>
            Next
          </button>
        </div>

        <PhotoBoothArtwork />
      </div>
    </div>
  );
}
