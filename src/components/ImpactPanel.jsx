import React from 'react';

// Anime-style "impact frame": a red glove punches out at the viewer through manga focus lines,
// with a burst, a white flash and a shake on contact. Inline SVG + CSS keyframes (.impact-* in style.css),
// no images or libraries. With reduced motion it shows the frozen impact frame instead.
const C = 200;

// Manga focus lines: thin ink wedges pointing at the centre, with a clear ring around the glove.
const focusLines = Array.from({ length: 64 }, (_, i) => {
  const jitter = ((i * 37) % 11) / 11;
  const a = (i / 64) * Math.PI * 2 + jitter * 0.05;
  const r1 = 128 + jitter * 46;
  const w = 0.012 + (((i * 53) % 7) / 7) * 0.022;
  const p = (r, t) => `${(C + Math.cos(t) * r).toFixed(1)},${(C + Math.sin(t) * r).toFixed(1)}`;
  return `${p(r1, a)} ${p(330, a - w)} ${p(330, a + w)}`;
});

// Jagged impact burst behind the glove.
const burst = Array.from({ length: 28 }, (_, i) => {
  const a = (i / 28) * Math.PI * 2;
  const r = i % 2 ? 92 : 150 + ((i * 29) % 5) * 9;
  return `${(C + Math.cos(a) * r).toFixed(1)},${(C + Math.sin(a) * r).toFixed(1)}`;
}).join(' ');

export function ImpactPanel() {
  return <figure className="impact" aria-hidden="true">
    <div className="impact-frame">
      <svg viewBox="0 0 400 400" role="presentation" focusable="false">
        <defs>
          <pattern id="impact-dots" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
            <circle cx="4.5" cy="4.5" r="1.6" fill="#161412" opacity=".22"/>
          </pattern>
        </defs>
        <rect width="400" height="400" fill="var(--yellow)"/>
        <rect width="400" height="400" fill="url(#impact-dots)"/>
        <g className="impact-lines" fill="#161412">
          {focusLines.map((pts, i) => <polygon key={i} points={pts}/>)}
        </g>
        <polygon className="impact-burst" points={burst} fill="#fbfaf5" stroke="#161412" strokeWidth="5" strokeLinejoin="round"/>
        <g className="impact-glove" strokeLinecap="round" strokeLinejoin="round">
          {/* cuff and its white band */}
          <path d="M172 258 L170 314 C190 326 232 326 252 314 L248 254 Z" fill="var(--red-dark)" stroke="#161412" strokeWidth="7"/>
          <path d="M171 284 C192 293 228 293 249 283" fill="none" stroke="#fbfaf5" strokeWidth="9"/>
          {/* fist, cel shadow, thumb, knuckle creases, highlight */}
          <path d="M140 200 C130 150 160 112 205 112 C252 112 280 145 276 190 C273 232 250 262 210 266 C168 270 146 245 140 200 Z" fill="var(--red)" stroke="#161412" strokeWidth="7"/>
          <path d="M232 120 C262 132 280 160 276 196 C272 232 250 262 210 266 C238 244 254 210 250 176 C247 150 241 132 232 120 Z" fill="var(--red-dark)"/>
          <path d="M150 208 C124 204 118 238 140 252 C160 264 188 256 194 240 C178 236 160 226 150 208 Z" fill="var(--red)" stroke="#161412" strokeWidth="6"/>
          <path d="M170 172 C192 162 222 162 246 172" fill="none" stroke="#161412" strokeWidth="5"/>
          <path d="M162 134 C176 120 196 116 214 118" fill="none" stroke="#fbfaf5" strokeWidth="9"/>
          <ellipse cx="236" cy="128" rx="7" ry="4" fill="#fbfaf5" transform="rotate(25 236 128)"/>
        </g>
        <rect className="impact-flash" width="400" height="400" fill="#fff"/>
        <text className="impact-word" x="292" y="92" textAnchor="middle" transform="rotate(-12 292 92)">BAM!</text>
      </svg>
    </div>
  </figure>;
}
