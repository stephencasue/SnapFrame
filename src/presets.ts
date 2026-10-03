import type { FilterStyle, StripStyle } from './types';

const sticker = (src: string, alt: string, x: number, size: number, rotation = 0) => ({
  src: `/stickers/${src}`,
  alt,
  x,
  size,
  rotation,
});

// Classic frames stay clean; themed frames use transparent stickers extracted
// from the artwork sheets in /stickers so preview and export remain identical.
export const STRIP_STYLES: StripStyle[] = [
  {
    id: 'black',
    label: 'Black',
    description: 'Bold gallery frame',
    frameColor: '#1c1a1d',
    dividerColor: '#363138',
    captionColor: '#fdf3ec',
  },
  {
    id: 'white',
    label: 'White',
    description: 'Clean and timeless',
    frameColor: '#fdf3ec',
    dividerColor: '#ead8cd',
    captionColor: '#341924',
  },
  {
    id: 'lucky-star',
    label: 'Purple Cat',
    description: 'Dreamy sleeping cat',
    frameColor: '#ccb7e5',
    dividerColor: '#8f77c8',
    stickers: [sticker('purple1.png', 'Sleeping purple cat', 0.5, 0.28)],
    captionColor: '#6f58aa',
  },
  {
    id: 'neko',
    label: 'Lion',
    description: 'Cheerful little lion',
    frameColor: '#f3c8d6',
    dividerColor: '#fff2e8',
    stickers: [sticker('lion.png', 'Smiling lion', 0.5, 0.17, 2)],
    captionColor: '#8c2f3a',
  },
  {
    id: 'love',
    label: 'Cherries',
    description: 'Sweet cherry trio',
    frameColor: '#c8395e',
    dividerColor: '#ffd3dd',
    stickers: [sticker('cherries.png', 'Smiling cherries', 0.5, 0.17)],
    captionColor: '#fdf3ec',
  },
  {
    id: 'wanted',
    label: 'Hat Bear',
    description: 'Playful bear in a hat',
    frameColor: '#d8b276',
    dividerColor: '#6b3f24',
    stickers: [sticker('bear-hat.png', 'Bear wearing a hat', 0.5, 0.17)],
    captionColor: '#3d2b13',
  },
];

// Distinct, portrait-friendly moods. IDs remain stable for existing app state.
export const FILTER_STYLES: FilterStyle[] = [
  { id: 'none', label: 'Original', description: 'True to camera', cssFilter: 'none' },
  {
    id: 'aden',
    label: 'Soft Glow',
    description: 'Light and warm',
    cssFilter: 'brightness(1.08) contrast(0.92) saturate(0.88) sepia(0.08)',
  },
  {
    id: 'inkwell',
    label: 'Mono',
    description: 'Crisp black & white',
    cssFilter: 'grayscale(1) contrast(1.16) brightness(1.02)',
  },
  {
    id: 'perpetua',
    label: 'Fresh',
    description: 'Bright natural color',
    cssFilter: 'brightness(1.04) contrast(1.03) saturate(1.14) hue-rotate(-4deg)',
  },
  {
    id: 'crema',
    label: 'Creamy',
    description: 'Soft vintage fade',
    cssFilter: 'brightness(1.08) contrast(0.92) saturate(0.9) sepia(0.18)',
  },
  {
    id: 'sutro',
    label: 'Cinema',
    description: 'Deep moody contrast',
    cssFilter: 'brightness(0.9) contrast(1.2) saturate(0.84) sepia(0.12)',
  },
];

export const DEFAULT_STRIP = STRIP_STYLES[1];
export const DEFAULT_FILTER = FILTER_STYLES[0];
