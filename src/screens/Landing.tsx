import { CatPhotoBoothScene } from '../components/CatPhotoBoothScene';
import { Logo } from '../components/Logo';
import { PhotoBoothArtwork } from '../components/PhotoBoothArtwork';

interface LandingProps {
  onStart: () => void;
}

/** Screen 1 — Landing / Splash. Logo top-left, content centered left, illustration right. */
export function Landing({ onStart }: LandingProps) {
  return (
    <div className="sf-screen sf-landing">
      <div className="sf-topbar">
        <Logo />
      </div>
      <div className="sf-landing-grid">
        <div className="sf-landing-left">
          <p className="sf-landing-sub">
            Your photobooth, anywhere.
            <br />
            Snap four shots, pick a strip, and take home a keepsake.
          </p>
          <button type="button" className="sf-btn sf-btn-primary" onClick={onStart}>
            Start
          </button>
        </div>
        <PhotoBoothArtwork />
      </div>
      <CatPhotoBoothScene />
    </div>
  );
}
