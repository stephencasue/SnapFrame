interface BackButtonProps {
  onClick: () => void;
}

/**
 * Universal "go to previous step" control, shown top-left on every screen
 * except Landing (PRD supplement Section 2). Distinct from screen-specific
 * Retake/Reset actions.
 */
export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button type="button" className="sf-back-btn" onClick={onClick} aria-label="Go back">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="sf-back-btn-label">Back</span>
    </button>
  );
}
