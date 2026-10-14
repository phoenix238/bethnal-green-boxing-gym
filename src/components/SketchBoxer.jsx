import React from 'react';

// Hand-drawn boxer in a guard stance. Each stroke "draws itself" in order (CSS in style.css, .sketch-*),
// a second, slightly offset pass gives the pencil-sketch look, and an SVG turbulence filter roughens the lines.
// Pure SVG + CSS: no images or libraries. With reduced motion it simply appears finished.
const strokes = [
  // head, ear, jaw
  'M150 44 C168 42 180 56 179 74 C178 92 165 102 150 101 C134 100 122 88 123 71 C124 55 135 45 150 44 Z',
  'M131 66 C126 66 125 76 131 78',
  // neck and shoulders
  'M140 99 L137 112 M162 99 L166 112',
  'M137 112 C120 113 110 120 106 132 M166 112 C184 113 196 121 199 134',
  // torso
  'M112 128 C116 160 122 196 130 228 M196 130 C190 164 184 198 178 228',
  'M134 150 C146 156 160 156 172 150',
  'M142 176 C150 179 158 179 166 176 M144 196 C151 198 157 198 164 196',
  // lead arm: shoulder, elbow down, glove at the chin
  'M108 132 C96 148 90 164 98 176 C106 184 114 168 118 146',
  'M100 104 C96 86 110 74 126 78 C140 82 142 100 132 112 C122 122 104 120 100 104 Z',
  'M118 146 L114 120',
  // rear arm: tucked elbow, glove by the cheek
  'M198 134 C210 152 212 172 202 180 C192 186 186 168 184 146',
  'M170 96 C170 80 186 72 198 80 C210 88 206 108 192 114 C180 118 170 110 170 96 Z',
  'M184 146 L188 116',
  // shorts and waistband
  'M128 226 L180 226 M128 234 L180 234',
  'M128 234 C124 254 120 270 118 290 L148 292 L154 262 L160 292 L190 290 C188 270 184 252 180 234',
  // lead leg (forward) and rear leg (back)
  'M124 290 C118 312 110 334 104 360 C100 374 98 382 98 388 M146 292 C140 316 132 340 124 366 L120 388',
  'M94 388 C104 392 118 394 132 392',
  'M164 292 C174 316 186 338 198 360 L210 386 M188 290 C196 312 206 334 220 358 L232 384',
  'M204 388 C216 392 232 392 244 386',
  // floor scribble and hatching for shadow
  'M70 398 C120 394 190 396 262 400',
  'M86 404 C130 402 180 403 240 406',
  'M128 300 L120 318 M134 302 L126 324 M174 302 L182 320 M180 300 L190 318',
];

export function SketchBoxer({ className = '' }) {
  return <figure className={`sketch ${className}`} aria-hidden="true">
    <svg viewBox="60 30 220 390" role="presentation" focusable="false">
      <defs>
        <filter id="sketch-rough">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/>
          <feDisplacementMap in="SourceGraphic" scale="3.2"/>
        </filter>
      </defs>
      <g className="sketch-pass sketch-pass-1" filter="url(#sketch-rough)">
        {strokes.map((d, i) => <path key={i} d={d} pathLength="1" style={{ '--i': i }}/>)}
      </g>
      <g className="sketch-pass sketch-pass-2" transform="translate(1.4 -1.1) rotate(.6 160 220)">
        {strokes.map((d, i) => <path key={i} d={d} pathLength="1" style={{ '--i': i }}/>)}
      </g>
    </svg>
  </figure>;
}
