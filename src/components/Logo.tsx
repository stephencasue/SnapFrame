interface LogoProps {
  /** Visual size of the mark. "sm" is used in in-page headers, "lg" on the Landing hero. */
  size?: 'sm' | 'lg';
}

/**
 * SnapFrame brand mark (Logo v2): uses the actual `logo-v2.png` asset.
 * No chip/background wrapper — sits directly on the page background.
 */
export function Logo({ size = 'sm' }: LogoProps) {
  return (
    <img
      src="/logo-v2.png"
      alt="SnapFrame"
      className={`sf-logo-img sf-logo-${size}`}
    />
  );
}
