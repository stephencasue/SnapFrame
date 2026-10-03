/** A decorative miniature photo-booth scene for the landing page.
 * The cat poses, the booth flashes, and a tiny photo prints in a timed loop.
 * Motion is CSS-only and disabled when reduced motion is preferred. */
export function CatPhotoBoothScene() {
  return (
    <div className="sf-cat-booth-scene" aria-hidden="true">
      <svg className="sf-cat-booth-art" viewBox="0 0 520 230">
        <ellipse className="sf-scene-shadow" cx="282" cy="213" rx="216" ry="12" />

        <g className="sf-scene-polaroid sf-scene-polaroid-left">
          <rect x="18" y="157" width="49" height="59" rx="5" />
          <rect className="sf-scene-photo-fill" x="24" y="163" width="37" height="35" rx="2" />
          <path d="M31 192c5-12 18-12 23 0" />
          <circle cx="37" cy="176" r="3" />
          <circle cx="49" cy="176" r="3" />
        </g>

        <g className="sf-scene-polaroid sf-scene-polaroid-right">
          <rect x="463" y="164" width="42" height="51" rx="5" />
          <rect className="sf-scene-photo-fill" x="469" y="170" width="30" height="29" rx="2" />
          <path d="m477 190 7-9 8 9" />
        </g>

        {/* Posing cat */}
        <g className="sf-scene-cat">
          <path className="sf-scene-tail" d="M169 162c30 8 48-2 48-24 0-14-10-21-22-17-10 3-10 16-1 19" />
          <ellipse className="sf-cat-body-fill" cx="132" cy="163" rx="47" ry="43" />
          <path className="sf-cat-leg" d="M102 184c-10 7-13 19-5 25h29l2-24m35-1c10 8 12 20 4 25h-30l-1-24" />
          <path className="sf-cat-head-fill" d="m92 71 8-32 24 20c8-3 18-3 27 0l25-20 6 35c8 9 13 21 13 35 0 31-27 51-59 51s-59-20-59-51c0-15 5-28 15-38Z" />
          <path className="sf-cat-ear-inner" d="m101 58 3-13 12 11m50 2 9-13 1 17" />
          <path className="sf-scene-eye sf-scene-eye-left" d="M103 102c5-6 11-6 16 0" />
          <path className="sf-scene-eye sf-scene-eye-right" d="M150 102c5-6 11-6 16 0" />
          <path className="sf-cat-face" d="m132 111 6 4 6-4m-6 4v7c-7 7-14 7-21 1m21-1c7 7 14 7 21 1" />
          <circle className="sf-cat-cheek" cx="105" cy="120" r="6" />
          <circle className="sf-cat-cheek" cx="169" cy="120" r="6" />
          <path className="sf-cat-whisker" d="m109 116-28-6m29 17-29 5m84-16 27-6m-28 17 28 5" />

          <g className="sf-cat-wave">
            <path className="sf-cat-paw-fill" d="M88 150c-16-3-25-17-20-29 3-8 10-8 14-1-1-11 9-14 14-5 2-10 13-8 14 2 11-5 17 5 10 13-7 13-18 21-32 20Z" />
            <path className="sf-cat-paw-line" d="m79 121 8 9m9-15-2 13m16-11-8 13" />
          </g>
        </g>

        {/* Miniature photo booth */}
        <g className="sf-scene-booth">
          <path className="sf-booth-roof" d="M280 48c0-19 16-35 35-35h116c19 0 35 16 35 35v5H280Z" />
          <rect className="sf-booth-body" x="274" y="47" width="198" height="164" rx="25" />
          <rect className="sf-booth-inner-line" x="286" y="59" width="174" height="140" rx="17" />

          <g className="sf-booth-sign">
            <rect x="316" y="25" width="114" height="39" rx="15" />
            <text x="373" y="42">SnapFrame</text>
            <text className="sf-booth-sign-small" x="373" y="54">PHOTO BOOTH</text>
          </g>

          <g className="sf-booth-flash">
            <circle cx="296" cy="35" r="13" />
            <circle className="sf-booth-flash-core" cx="296" cy="35" r="6" />
            <path className="sf-booth-flash-rays" d="M296 12V3m0 64v-9m-23-23h-9m64 0h-9m-39-16-7-7m46 46-7-7m0-32 7-7m-46 46 7-7" />
          </g>

          <rect className="sf-booth-window" x="300" y="74" width="146" height="78" rx="13" />
          <path className="sf-booth-curtain sf-booth-curtain-left" d="M304 78h55c-15 21-17 45-4 70h-51Z" />
          <path className="sf-booth-curtain sf-booth-curtain-right" d="M442 78h-55c15 21 17 45 4 70h51Z" />
          <circle className="sf-booth-lens" cx="373" cy="109" r="21" />
          <circle className="sf-booth-lens-core" cx="373" cy="109" r="9" />
          <circle className="sf-booth-lens-shine" cx="367" cy="103" r="3" />

          <g className="sf-booth-controls">
            <circle cx="308" cy="170" r="6" />
            <circle cx="326" cy="170" r="6" />
            <rect x="347" y="165" width="91" height="10" rx="5" />
          </g>

          <g className="sf-booth-slot">
            <text x="373" y="188">YOUR PHOTO</text>
            <rect x="330" y="193" width="86" height="11" rx="5" />
          </g>
        </g>

        {/* Photo repeatedly feeds from behind the booth slot. */}
        <g className="sf-scene-print">
          <rect x="347" y="187" width="52" height="40" rx="3" />
          <rect className="sf-scene-photo-fill" x="352" y="192" width="42" height="24" rx="2" />
          <path d="M360 211c4-9 14-9 19 0" />
          <circle cx="365" cy="201" r="2" />
          <circle cx="380" cy="201" r="2" />
        </g>

        <g className="sf-scene-flash-burst">
          <circle cx="296" cy="35" r="20" />
          <circle cx="296" cy="35" r="31" />
        </g>

        <g className="sf-scene-sparkles">
          <path d="m239 53 5 11 11 5-11 5-5 11-5-11-11-5 11-5Z" />
          <path d="m484 84 4 8 8 4-8 4-4 8-4-8-8-4 8-4Z" />
          <path d="m233 132 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />
        </g>
      </svg>
      <span className="sf-scene-caption">Pose. Flash. Purr.</span>
    </div>
  );
}
