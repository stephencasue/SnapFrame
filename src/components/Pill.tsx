interface PillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

/** Shared selection pill used for Timer, Shots, Strips, and Filters groups. */
export function Pill({ label, selected, onClick }: PillProps) {
  return (
    <button
      type="button"
      className={`sf-pill${selected ? ' is-selected' : ''}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
