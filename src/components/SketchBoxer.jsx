import React from 'react';

// Hand-drawn boxer in a guard stance. Each stroke "draws itself" in order (CSS in style.css, .sketch-*),
// a second, slightly offset pass gives the pencil-sketch look, and an SVG turbulence filter roughens the lines.
// Pure SVG + CSS: no images or libraries. With reduced motion it simply appears finished.
const strokes = [
  // head in profile, facing left: skull, ear, hair line
  'M168 38 C182 38 190 50 189 64 C188 78 180 88 168 88 C158 88 152 80 150 72 L146 68 L150 62 C150 48 156 38 168 38 Z',
  'M176 58 C182 58 182 68 176 68',
  'M156 46 C164 40 176 40 184 46',
  // neck, shoulders, torso, a little muscle shading
  'M160 86 L158 100 M178 86 L180 100',
  'M140 104 C152 98 176 98 192 104',
  'M192 104 C196 140 192 172 188 200',
  'M142 120 C144 150 148 176 150 200',
  'M156 150 C164 154 172 154 180 150 M158 172 C165 175 172 175 178 172',
  // rear arm: elbow tucked, glove guarding the chin
  'M188 108 C186 126 180 140 170 150 M178 104 C176 120 170 132 160 140',
  'M170 150 C160 138 150 124 144 108 M160 140 C154 130 146 120 136 108',
  'M124 96 C122 82 136 76 146 82 C156 88 154 104 144 108 C134 112 126 106 124 96 Z',
  // lead arm: glove up and out in front
  'M142 106 C128 116 116 126 112 140 M152 118 C140 126 130 134 124 146',
  'M112 140 C104 128 98 116 94 106 M124 146 C118 132 112 120 108 108',
  'M84 94 C80 78 94 70 106 74 C118 78 120 92 112 102 C104 110 88 108 84 94 Z',
  // shorts
  'M148 200 L188 200 M148 208 L190 208',
  'M148 208 C144 226 142 240 140 252 L166 254 L170 236 L174 254 L198 250 C196 236 192 222 190 208',
  // legs: lead foot forward, rear foot back, knees soft
  'M144 252 C134 276 122 300 114 326 L104 354 M160 254 C150 280 138 306 126 354',
  'M182 252 C190 280 200 306 212 352 M196 250 C206 276 214 300 228 350',
  'M98 356 C108 360 122 361 134 358',
  'M208 354 C220 357 236 356 248 350',
  // floor, shading and a couple of speed lines off the jab
  'M70 364 C120 361 190 362 262 366',
  'M86 370 C130 368 180 369 240 372',
  'M196 262 L204 278 M202 258 L212 276 M184 150 L176 162 M188 160 L182 170',
  'M62 82 L76 84 M58 94 L74 94 M64 106 L76 104',
];

export function SketchBoxer({ className = '' }) {
  return <figure className={`sketch ${className}`} aria-hidden="true">
    <svg viewBox="50 30 220 350" role="presentation" focusable="false">
      <defs>
        <filter id="sketch-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/>
          <feDisplacementMap in="SourceGraphic" scale="3.2"/>
        </filter>
      </defs>
      <g className="sketch-pass sketch-pass-1" filter="url(#sketch-rough)">
        {strokes.map((d, i) => <path key={i} d={d} pathLength="1" style={{ '--i': i }}/>)}
      </g>
      <g className="sketch-pass sketch-pass-2" transform="translate(1.4 -1.1) rotate(.6 160 200)">
        {strokes.map((d, i) => <path key={i} d={d} pathLength="1" style={{ '--i': i }}/>)}
      </g>
    </svg>
  </figure>;
}
