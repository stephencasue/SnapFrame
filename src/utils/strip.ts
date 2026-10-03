import type { FilterStyle, StripSticker, StripStyle } from '../types';

const PHOTO_WIDTH = 480;
const PHOTO_HEIGHT = 320;
const GUTTER = 16;
const FOOTER_HEIGHT = 84;

const imageCache = new Map<string, Promise<HTMLImageElement>>();

/** A composited strip plus its natural pixel dimensions, used to scale the
 * Pickup screen's print-out reveal to the strip's real aspect ratio. */
export interface RenderedStrip {
  dataUrl: string;
  width: number;
  height: number;
}

/** Composites captured photos, the selected filter, frame, and footer
 * stickers into the exact PNG shown by the pickup printer. */
export async function renderStrip(photos: string[], strip: StripStyle, filter: FilterStyle): Promise<RenderedStrip> {
  const images = await Promise.all(photos.map(loadImage));
  const stickerImages = await Promise.all((strip.stickers ?? []).map((item) => loadImage(item.src)));

  const width = PHOTO_WIDTH + GUTTER * 2;
  const height = GUTTER + images.length * (PHOTO_HEIGHT + GUTTER) + FOOTER_HEIGHT;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas rendering is not supported by this browser.');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = strip.frameColor;
  ctx.fillRect(0, 0, width, height);

  images.forEach((img, index) => {
    const y = GUTTER + index * (PHOTO_HEIGHT + GUTTER);
    ctx.save();
    ctx.filter = filter.cssFilter === 'none' ? 'none' : filter.cssFilter;
    drawCover(ctx, img, GUTTER, y, PHOTO_WIDTH, PHOTO_HEIGHT);
    ctx.restore();
  });

  ctx.strokeStyle = strip.dividerColor;
  ctx.lineWidth = 4;
  images.forEach((_img, index) => {
    const y = GUTTER + index * (PHOTO_HEIGHT + GUTTER);
    ctx.strokeRect(GUTTER + 1, y + 1, PHOTO_WIDTH - 2, PHOTO_HEIGHT - 2);
  });

  if (strip.motif) {
    ctx.fillStyle = strip.captionColor;
    ctx.font = '700 28px "Baloo 2", "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(strip.motif, width / 2, height - FOOTER_HEIGHT / 2);
  }

  (strip.stickers ?? []).forEach((item, index) => {
    drawFooterSticker(ctx, stickerImages[index], item, width, height);
  });

  try {
    return { dataUrl: canvas.toDataURL('image/png'), width, height };
  } catch {
    throw new Error('Your strip could not be exported. Please retry or choose another design.');
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached) return cached;

  const pending = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    if (!src.startsWith('data:') && !src.startsWith('blob:')) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load image: ${src}`));
    img.src = src;
  });

  imageCache.set(src, pending);
  return pending;
}

function drawFooterSticker(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  sticker: StripSticker,
  stripWidth: number,
  stripHeight: number,
) {
  const boxWidth = stripWidth * sticker.size;
  const boxHeight = FOOTER_HEIGHT - 10;

  ctx.save();
  ctx.translate(stripWidth * sticker.x, stripHeight - FOOTER_HEIGHT / 2);
  ctx.rotate(((sticker.rotation ?? 0) * Math.PI) / 180);
  drawContain(ctx, image, -boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight);
  ctx.restore();
}

/** Draws an image using contain-fit so a sticker is never cropped. */
function drawContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.min(w / img.width, h / img.height);
  const drawWidth = img.width * scale;
  const drawHeight = img.height * scale;
  ctx.drawImage(img, x + (w - drawWidth) / 2, y + (h - drawHeight) / 2, drawWidth, drawHeight);
}

/** Draws an image into the target rect using cover-fit cropping. */
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
