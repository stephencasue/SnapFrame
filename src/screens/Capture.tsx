import { useEffect, useRef, useState } from 'react';
import { BackButton } from '../components/BackButton';
import { useCamera } from '../hooks/useCamera';
import type { SessionSettings } from '../types';

interface CaptureProps {
  settings: SessionSettings;
  onComplete: (photos: string[]) => void;
  onBack: () => void;
}

/** Screen 3 — Capture Session (PRD Section 7, Screen 3). */
export function Capture({ settings, onComplete, onBack }: CaptureProps) {
  const { videoRef, status, start, captureFrame } = useCamera();
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentShot, setCurrentShot] = useState(1); // 1-based shot number currently being taken
  const [countdown, setCountdown] = useState<number | null>(null);
  const photosRef = useRef<string[]>([]);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const runCountdownAndCapture = (shotNumber: number) => {
    setCurrentShot(shotNumber);
    let remaining = settings.timer;
    setCountdown(remaining);

    const tick = () => {
      timeoutRef.current = window.setTimeout(() => {
        remaining -= 1;
        if (remaining > 0) {
          setCountdown(remaining);
          tick();
        } else {
          setCountdown(0);
          // Small delay so the user sees "0" flash before the shutter.
          timeoutRef.current = window.setTimeout(() => {
            const frame = captureFrame();
            if (frame) photosRef.current.push(frame);
            setCountdown(null);

            if (shotNumber < settings.shots) {
              runCountdownAndCapture(shotNumber + 1);
            } else {
              onComplete(photosRef.current);
            }
          }, 250);
        }
      }, 1000);
    };
    tick();
  };

  const handleStartSession = () => {
    photosRef.current = [];
    setSessionStarted(true);
    runCountdownAndCapture(1);
  };

  // Back cancels any in-progress countdown/session and returns to Settings,
  // leaving the previously chosen timer/shot values untouched (PRD supplement 2.2).
  const handleBack = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    photosRef.current = [];
    setSessionStarted(false);
    setCountdown(null);
    setCurrentShot(1);
    onBack();
  };

  return (
    <div className="sf-screen sf-capture">
      <div className="sf-topbar">
        <BackButton onClick={handleBack} />
      </div>
      <h1 className="sf-capture-heading">Smile</h1>

      <div className="sf-capture-preview-wrap">
        <div className="sf-capture-preview">
          {status === 'denied' && (
            <div className="sf-camera-fallback">
              <p className="sf-error-banner">
                Camera access was denied. Please allow camera permissions in your browser settings, then retry.
              </p>
              <button type="button" className="sf-btn sf-btn-outline" onClick={start}>
                Retry
              </button>
            </div>
          )}
          {status === 'unavailable' && (
            <div className="sf-camera-fallback">
              <p className="sf-error-banner">No camera was found on this device. Connect a camera and retry.</p>
              <button type="button" className="sf-btn sf-btn-outline" onClick={start}>
                Retry
              </button>
            </div>
          )}
          {(status === 'ready' || status === 'requesting') && (
            <video ref={videoRef} className="sf-video" autoPlay playsInline muted aria-label="Live camera preview" />
          )}
          {countdown !== null && countdown > 0 && (
            <div className="sf-countdown" aria-live="assertive">
              {countdown}
            </div>
          )}
        </div>
      </div>

      <div className="sf-capture-meta">
        <span aria-live="polite">
          Shot {currentShot} of {settings.shots} • Timer: {settings.timer}s
        </span>
        <span>Camera 1</span>
      </div>

      <button
        type="button"
        className="sf-btn sf-btn-primary"
        onClick={handleStartSession}
        disabled={sessionStarted || status !== 'ready'}
      >
        {sessionStarted ? 'Session in progress…' : `Start Session (${settings.shots} shots)`}
      </button>
    </div>
  );
}
