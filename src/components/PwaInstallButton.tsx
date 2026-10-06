import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

function isPhoneOrTablet() {
  const userAgent = navigator.userAgent;
  const isMobileDevice = /Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle|PlayBook/i.test(userAgent);
  const isModernIPad = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isMobileDevice || isModernIPad;
}

function isIOSDevice() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isRunningStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as NavigatorWithStandalone).standalone === true;
}

/** Mobile/tablet-only PWA install control. Desktop and laptop browsers never
 * render it, even when they support beforeinstallprompt. iOS shows its native
 * Share → Add to Home Screen guidance because Safari has no prompt API. */
export function PwaInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isEligibleDevice, setIsEligibleDevice] = useState(false);
  const [isInstalled, setIsInstalled] = useState(true);

  useEffect(() => {
    const eligible = isPhoneOrTablet();
    const ios = isIOSDevice();
    const installed = isRunningStandalone();

    setIsEligibleDevice(eligible);
    setIsIOS(ios);
    setIsInstalled(installed);

    if (!eligible || installed) return;

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowIOSHelp(false);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  if (!isEligibleDevice || isInstalled || (!installPrompt && !isIOS)) return null;

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSHelp((visible) => !visible);
      return;
    }

    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  return (
    <aside className="sf-pwa-install-wrap">
      {showIOSHelp && (
        <div className="sf-pwa-ios-help" role="status">
          Tap <strong>Share</strong>, then choose <strong>Add to Home Screen</strong>.
        </div>
      )}
      <button
        type="button"
        className="sf-pwa-install"
        onClick={handleInstall}
        aria-expanded={isIOS ? showIOSHelp : undefined}
        aria-label="Install SnapFrame app"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
        </svg>
        <span>Install app</span>
      </button>
    </aside>
  );
}
