import React from 'react';
import './RouteMapAnimation.css';

// A lightweight, hand-drawn animated map: a simplified Sri Lanka outline
// laid horizontally in the upper-right of the hero (clear of the text
// overlay), a route line connecting Colombo → Kandy → Anuradhapura →
// Jaffna that draws itself in with a live "data flow" overlay, radar-
// ring markers, label pills, and a glossy, detailed bus with a moving
// shadow. Built entirely with SVG + CSS — no image/video/3D-engine
// assets — shading/gradients/motion approximate a premium, dimensional,
// "tech tracking" look while staying lightweight.

const ROUTE_PATH = "M280,120 L350,90 L420,65 L490,40";

const MARKERS = [
  { name: 'Colombo', x: 280, y: 120, delay: '0s', side: 'below' },
  { name: 'Kandy', x: 350, y: 90, delay: '0.5s', side: 'above' },
  { name: 'Anuradhapura', x: 420, y: 65, delay: '1s', side: 'below' },
  { name: 'Jaffna', x: 490, y: 40, delay: '1.5s', side: 'above' },
];

// Elongated, landscape-native island silhouette, shifted to sit behind
// the upper-right route cluster (artistic/decorative, not geographically
// precise) — sized to fill that zone without cropping.
const ISLAND_OUTLINE =
  "M220,150 C210,130 215,100 240,90 C270,60 320,50 360,60 " +
  "C410,40 460,45 495,65 C520,72 535,82 530,102 " +
  "C538,122 533,145 515,158 C505,180 488,198 460,206 " +
  "C432,222 398,225 370,212 C335,225 300,218 275,202 " +
  "C255,210 235,200 225,182 C215,175 210,165 220,150 Z";

export default function RouteMapAnimation() {
  return (
    <div className="route-map">
      <svg
        viewBox="0 0 520 300"
        className="route-map-svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="rm-bg-glow" cx="70%" cy="30%" r="70%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="rm-route-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-strong)" />
          </linearGradient>

          <linearGradient id="rm-bus-body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-strong)" />
            <stop offset="55%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="#b5690a" />
          </linearGradient>

          <linearGradient id="rm-bus-glass" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#eaf4ff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#9fc7e8" stopOpacity="0.85" />
          </linearGradient>

          <radialGradient id="rm-bus-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="rm-headlight" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff6d8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff6d8" stopOpacity="0" />
          </radialGradient>

          <pattern id="rm-grid" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="var(--accent)" opacity="0.08" />
          </pattern>
        </defs>

        <rect x="0" y="0" width="520" height="300" fill="url(#rm-bg-glow)" />
        <rect x="0" y="0" width="520" height="300" fill="url(#rm-grid)" />

        {/* Sri Lanka outline, positioned behind the route cluster */}
        <path d={ISLAND_OUTLINE} className="route-map-island" />

        {/* Base route line — draws itself in with a gradient stroke, then loops */}
        <path d={ROUTE_PATH} className="route-map-line" />

        {/* "Live" data-flow overlay — small dashes continuously travel the
            completed route for a tech-tracking feel */}
        <path d={ROUTE_PATH} className="route-map-flow" />

        {/* City markers — radar ring + pulse, in sequence, with label pills */}
        {MARKERS.map((m) => (
          <g key={m.name} className="route-map-marker" style={{ animationDelay: m.delay }}>
            <circle cx={m.x} cy={m.y} r="13" className="route-map-marker-ring" />
            <circle cx={m.x} cy={m.y} r="9" className="route-map-marker-pulse" />
            <circle cx={m.x} cy={m.y} r="4" className="route-map-marker-dot" />
            <g transform={`translate(${m.x}, ${m.y + (m.side === 'above' ? -20 : 24)})`}>
              <rect
                x={-(m.name.length * 3.4 + 8)}
                y="-10"
                width={m.name.length * 6.8 + 16}
                height="18"
                rx="9"
                className="route-map-label-bg"
              />
              <text textAnchor="middle" y="3" className="route-map-label">{m.name}</text>
            </g>
          </g>
        ))}

        {/* Moving shadow beneath the bus, synced to the same path/timing */}
        <ellipse cx="0" cy="9" rx="13" ry="4" fill="url(#rm-bus-shadow)">
          <animateMotion dur="9s" repeatCount="indefinite" rotate="auto" path={ROUTE_PATH} />
        </ellipse>

        {/* Glossy, detailed bus riding the route */}
        <g className="route-map-bus">
          <circle cx="14" cy="0" r="7" fill="url(#rm-headlight)" />
          <rect x="-13" y="-8.5" width="26" height="15" rx="4.5" fill="url(#rm-bus-body)" className="route-map-bus-body" />
          <rect x="-9" y="-5.5" width="18" height="7" rx="1.8" fill="url(#rm-bus-glass)" />
          <rect x="-13" y="3" width="26" height="2.2" fill="#1a1f28" opacity="0.28" />
          <rect x="-4" y="-11" width="8" height="2.4" rx="1" fill="#3a2408" opacity="0.5" />
          <circle cx="12.5" cy="-1" r="1.3" fill="#fff6d8" />
          <circle cx="-7" cy="8" r="2.7" fill="#161a21" />
          <circle cx="-7" cy="8" r="0.9" fill="#4a5260" />
          <circle cx="7" cy="8" r="2.7" fill="#161a21" />
          <circle cx="7" cy="8" r="0.9" fill="#4a5260" />
          <animateMotion dur="9s" repeatCount="indefinite" rotate="auto" path={ROUTE_PATH} />
        </g>
      </svg>
    </div>
  );
}