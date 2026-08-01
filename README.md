# SnapFrame

Your photobooth, anywhere. Snap a few shots, pick a strip, and take home a keepsake.

SnapFrame is a browser-based virtual photobooth that works on any device with a camera. Configure a quick capture session, snap your photos, customize the strip with frames and filters, and download the final result — no app install or physical hardware needed.

## Features

- Configurable timer (3s / 5s / 10s) and shot count (3 or 4 photos)
- Live webcam capture with per-shot countdown
- 6 strip frame styles (Black, White, Lucky Star, Neko, Love, Wanted)
- 6 photo filters (None, Aden, Inkwell, Perpetua, Crema, Sutro)
- Print-slot dispenser animation on the final screen
- Smooth directional page transitions between screens
- Download the final composited strip as a PNG
- Fully client-side — no images are uploaded or stored on a server
- Responsive layout for desktop and mobile

## Tech Stack

- React 18
- TypeScript
- Vite
- Canvas API for strip compositing
- CSS animations (no animation libraries)

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

Open `http://localhost:5173` after running `npm run dev`.

## Project Structure

```
src/
  App.tsx             — Root state machine + screen transitions
  main.tsx            — Entry point
  index.css           — Global design system (tokens, components, layouts)
  types.ts            — Shared TypeScript types
  presets.ts          — Strip frame styles + filter definitions
  components/
    BackButton.tsx    — Universal back navigation button
    Logo.tsx          — Brand mark (logo v2)
    PhotoBoothArtwork.tsx — Shared illustration component
    Pill.tsx          — Selection pill button
  screens/
    Landing.tsx       — Screen 1: splash + Start
    Settings.tsx      — Screen 2: timer & shots config
    Capture.tsx       — Screen 3: live camera capture loop
    Customize.tsx     — Screen 4: strip & filter picker
    Pickup.tsx        — Screen 5: print slot animation + download
  hooks/
    useCamera.ts      — getUserMedia hook with error handling
  utils/
    strip.ts          — Canvas compositing for the final strip
public/
  favicon.svg         — Browser tab icon
  logo-v2.png         — Brand logo asset
  photo.png           — Illustration asset
```

## Browser Support

Modern evergreen browsers with `getUserMedia` support (Chrome, Safari, Edge, Firefox).

## License

MIT

## Author

Developed by Stephen
