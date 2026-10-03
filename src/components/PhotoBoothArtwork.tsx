/**
 * Shared photobooth illustration used on both the Landing and Settings screens.
 * Wrapped in a white/cream rounded card whose size is fixed via the
 * --sf-illustration-card-* tokens, so both screens match exactly.
 */
export function PhotoBoothArtwork() {
  return (
    <div className="sf-illustration-card">
      <img
        src="/snap-cat.gif"
        alt="Animated cat taking a photo"
        className="sf-illustration-img"
        role="img"
      />
    </div>
  );
}
