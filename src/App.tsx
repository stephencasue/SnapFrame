import { useRef, useState } from 'react';
import { Landing } from './screens/Landing';
import { Settings } from './screens/Settings';
import { Capture } from './screens/Capture';
import { Customize } from './screens/Customize';
import { Pickup } from './screens/Pickup';
import { DEFAULT_FILTER, DEFAULT_STRIP } from './presets';
import type { FilterStyle, SessionSettings, Step, StripStyle } from './types';

const DEFAULT_SETTINGS: SessionSettings = { timer: 3, shots: 3 };

/** How long the outgoing screen takes to fade+slide out before the next
 * screen mounts (PRD supplement, animation 2: 250-400ms total). */
const EXIT_MS = 160;
/** How long the incoming screen takes to fade+slide in once mounted. */
const ENTER_MS = 200;

type TransitionPhase = 'idle' | 'exiting' | 'entering';
type Direction = 'forward' | 'backward';

/**
 * Root app component implementing the 5-screen SnapFrame session flow
 * (PRD Section 5). Owns all session state; each screen is a pure view
 * driven by props + callbacks. Screen changes are wrapped in a short
 * directional fade+slide transition (forward = slide from the right,
 * backward = slide from the left), independent of the Pickup screen's
 * own print-out animation.
 */
export default function App() {
  const [step, setStep] = useState<Step>('landing');
  const [settings, setSettings] = useState<SessionSettings>(DEFAULT_SETTINGS);
  const [photos, setPhotos] = useState<string[]>([]);
  const [strip, setStrip] = useState<StripStyle>(DEFAULT_STRIP);
  const [filter, setFilter] = useState<FilterStyle>(DEFAULT_FILTER);

  const [direction, setDirection] = useState<Direction>('forward');
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const timers = useRef<number[]>([]);

  /** Plays exit-then-enter transition, running `commit` (the actual state
   * updates for the new screen) right as the incoming screen mounts. */
  const goTo = (dir: Direction, commit: () => void) => {
    timers.current.forEach((id) => window.clearTimeout(id));
    setDirection(dir);
    setPhase('exiting');
    const toEnter = window.setTimeout(() => {
      commit();
      setPhase('entering');
      const toIdle = window.setTimeout(() => setPhase('idle'), ENTER_MS);
      timers.current = [toIdle];
    }, EXIT_MS);
    timers.current = [toEnter];
  };

  const resetSession = () => {
    setPhotos([]);
    setStrip(DEFAULT_STRIP);
    setFilter(DEFAULT_FILTER);
    setSettings(DEFAULT_SETTINGS);
    setStep('landing');
  };

  // Shared by Customize's "Retake" and "Back" — both discard the current
  // captures and return to a fresh Capture session with the same settings.
  const retakePhotos = () => {
    setPhotos([]);
    setStep('capture');
  };

  const transitionClass =
    phase === 'exiting' ? `sf-transition-exit-${direction}` : phase === 'entering' ? `sf-transition-enter-${direction}` : '';

  return (
    <div className="sf-app">
      <div className={`sf-transition ${transitionClass}`} key={step}>
        {step === 'landing' && <Landing onStart={() => goTo('forward', () => setStep('settings'))} />}

        {step === 'settings' && (
          <Settings
            settings={settings}
            onChange={setSettings}
            onNext={() => goTo('forward', () => setStep('capture'))}
            onBack={() => goTo('backward', () => setStep('landing'))}
          />
        )}

        {step === 'capture' && (
          <Capture
            settings={settings}
            onComplete={(captured) =>
              goTo('forward', () => {
                setPhotos(captured);
                setStep('customize');
              })
            }
            onBack={() => goTo('backward', () => setStep('settings'))}
          />
        )}

        {step === 'customize' && (
          <Customize
            photos={photos}
            strip={strip}
            filter={filter}
            onStripChange={setStrip}
            onFilterChange={setFilter}
            onNext={() => goTo('forward', () => setStep('pickup'))}
            onRetake={() => goTo('backward', retakePhotos)}
            onBack={() => goTo('backward', retakePhotos)}
          />
        )}

        {step === 'pickup' && (
          <Pickup
            photos={photos}
            strip={strip}
            filter={filter}
            onEdit={() => goTo('backward', () => setStep('customize'))}
            onReset={() => goTo('backward', resetSession)}
            onBack={() => goTo('backward', () => setStep('customize'))}
          />
        )}
      </div>

      <p className="sf-made-by" aria-label="Made by Stephen">
        <span>made by</span>
        <strong>Stephen</strong>
      </p>
    </div>
  );
}
