// Shared types for the SnapFrame session flow (see PRD Section 5 & 7).

export type Step = 'landing' | 'settings' | 'capture' | 'customize' | 'pickup';

export type TimerOption = 3 | 5 | 10;
export type ShotOption = 3 | 4;

export interface SessionSettings {
  timer: TimerOption;
  shots: ShotOption;
}

/** A decorative image placed safely in the strip footer. Values are
 * normalized so the DOM preview and exported canvas use the same layout. */
export interface StripSticker {
  src: string;
  alt: string;
  /** Horizontal center from 0 (left) to 1 (right). */
  x: number;
  /** Sticker width as a fraction of the full strip width. */
  size: number;
  rotation?: number;
}

export interface StripStyle {
  id: 'black' | 'white' | 'lucky-star' | 'neko' | 'love' | 'wanted';
  label: string;
  description: string;
  /** Background color of the strip frame/mat around the photos. */
  frameColor: string;
  /** Color of the thin border hugging each photo. */
  dividerColor: string;
  /** Optional decorative motif rendered at the bottom of the strip. */
  motif?: string;
  /** Decorative assets rendered in the footer of previews and exports. */
  stickers?: readonly StripSticker[];
  /** Text color for any caption baked into the strip. */
  captionColor: string;
}

export interface FilterStyle {
  id: 'none' | 'aden' | 'inkwell' | 'perpetua' | 'crema' | 'sutro';
  label: string;
  description: string;
  /** CSS `filter` value used for live preview AND canvas baking. */
  cssFilter: string;
}
