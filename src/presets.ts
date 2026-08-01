import type { FilterStyle, StripStyle } from './types';

// Strip/frame styles (PRD Screen 4 — Strips selector: Black, White, Lucky Star, Neko, Love, Wanted)
export const STRIP_STYLES: StripStyle[] = [
  { id: 'black', label: 'Black', frameColor: '#1c1a1d', dividerColor: '#1c1a1d', captionColor: '#fdf3ec' },
  { id: 'white', label: 'White', frameColor: '#fdf3ec', dividerColor: '#fdf3ec', captionColor: '#341924' },
  { id: 'lucky-star', label: 'Lucky Star', frameColor: '#2b3a67', dividerColor: '#2b3a67', motif: '✦', captionColor: '#f7d774' },
  { id: 'neko', label: 'Neko', frameColor: '#f3c8d6', dividerColor: '#f3c8d6', motif: '🐾', captionColor: '#8c2f3a' },
  { id: 'love', label: 'Love', frameColor: '#c8395e', dividerColor: '#c8395e', motif: '♥', captionColor: '#fdf3ec' },
  { id: 'wanted', label: 'Wanted', frameColor: '#d8b276', dividerColor: '#6b3f24', motif: '★', captionColor: '#3d2b13' },
];

// Filters (PRD Screen 4 — Filters selector: None, Aden, Inkwell, Perpetua, Crema, Sutro)
// Implemented with standard CSS filter functions (no third-party filter library),
// tuned to approximate the mood of each named Instagram-style preset.
export const FILTER_STYLES: FilterStyle[] = [
  { id: 'none', label: 'None', cssFilter: 'none' },
  { id: 'aden', label: 'Aden', cssFilter: 'hue-rotate(-15deg) contrast(90%) saturate(85%) brightness(1.15)' },
  { id: 'inkwell', label: 'Inkwell', cssFilter: 'grayscale(100%) contrast(110%) brightness(1.05)' },
  { id: 'perpetua', label: 'Perpetua', cssFilter: 'saturate(110%) contrast(105%) sepia(15%) hue-rotate(-6deg)' },
  { id: 'crema', label: 'Crema', cssFilter: 'sepia(30%) saturate(120%) contrast(95%) brightness(1.08)' },
  { id: 'sutro', label: 'Sutro', cssFilter: 'saturate(140%) contrast(115%) brightness(0.9) sepia(20%)' },
];

export const DEFAULT_STRIP = STRIP_STYLES[1]; // "White" matches the PRD mock default
export const DEFAULT_FILTER = FILTER_STYLES[0]; // "None"
