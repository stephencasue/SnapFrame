import type { FilterStyle, StripStyle } from '../types';

const PHOTO_WIDTH = 480;
const PHOTO_HEIGHT = 320;
const GUTTER = 16; // gap between photos and frame border
const FOOTER_HEIGHT = 46; // room for the motif/caption strip at the bottom

/** A composited strip plus its natural pixel dimensions, used to scale the
 * Pickup screen's print-out reveal to the strip's real aspect ratio. */
export interface RenderedStrip {
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Composites the captured photos into a single vertical strip image on a
 * canvas, baking in the selected strip frame + filter (PRD F4/F5/F7).
 */
export async function renderStrip(photos: string[], strip: StripStyle, filter: FilterStyle): Promise<RenderedStrip> {
  const images = await Promise.all(photos.map(loadImage));

  const width = PHOTO_WIDTH + GUTTER * 2;
  const height = GUTTER + images.length * (PHOTO_HEIGHT + GUTTER) + FOOTER_HEIGHT;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // Frame background (the "mat" the photos sit on).
  ctx.fillStyle = strip.frameColor;
  ctx.fillRect(0, 0, width, height);

  ctx.filter = filter.cssFilter === 'none' ? 'none' : filter.cssFilter;

  images.forEach((img, i) => {
    const y = GUTTER + i * (PHOTO_HEIGHT + GUTTER);
    drawCover(ctx, img, GUTTER, y, PHOTO_WIDTH, PHOTO_HEIGHT);
  });

  ctx.filter = 'none';

  // Thin divider border around each photo.
  ctx.strokeStyle = strip.dividerColor;
  ctx.lineWidth = 3;
  images.forEach((_img, i) => {
    const y = GUTTER + i * (PHOTO_HEIGHT + GUTTER);
    ctx.strokeRect(GUTTER, y, PHOTO_WIDTH, PHOTO_HEIGHT);
  });

  // Footer motif/caption.
  if (strip.motif) {
    ctx.fillStyle = strip.captionColor;
    ctx.font = '28px "Baloo 2", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(strip.motif, width / 2, height - FOOTER_HEIGHT / 2);
  }

  return { dataUrl: canvas.toDataURL('image/png'), width, height };
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Draws `img` into the target rect using cover-fit cropping (like CSS `object-fit: cover`). */
function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;

  if (imgRatio > targetRatio) {
    sw = img.height * targetRatio;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / targetRatio;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}
