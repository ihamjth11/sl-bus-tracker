import React, { useState, useEffect } from 'react';
import './RouteMapAnimation.css';

// A lightweight, hand-drawn animated map: a simplified Sri Lanka outline
// laid horizontally in the upper-right of the hero (clear of the text
// overlay). Cycles through several real route journeys — each one draws
// itself in with a live "data flow" overlay, radar-ring markers, label
// pills, and a glossy, pseudo-3D bus (side depth panel, spinning spoked
// wheels, roof highlight, windshield shine sweep) with a moving shadow.
// A field of slow-drifting ambient particles runs underneath throughout,
// independent of route cycling, for extra depth. Pure SVG + CSS — no
// image/video/3D-engine assets.

const ROUTES = [
  {
    id: 'colombo-jaffna',
    path: 'M280,120 L350,90 L420,65 L490,40',
    dashLength: 260,
    duration: '9s',
    markers: [
      { name: 'Colombo', x: 280, y: 120, delay: '0s', side: 'below' },
      { name: 'Kandy', x: 350, y: 90, delay: '0.5s', side: 'above' },
      { name: 'Anuradhapura', x: 420, y: 65, delay: '1s', side: 'below' },
      { name: 'Jaffna', x: 490, y: 40, delay: '1.5s', side: 'above' },
    ],
  },
  {
    id: 'colombo-matara',
    path: 'M280,150 L330,180 L390,205 L460,225',
    dashLength: 225,
    duration: '8s',
    markers: [
      { name: 'Colombo', x: 280, y: 150, delay: '0s', side: 'above' },
      { name: 'Galle', x: 330, y: 180, delay: '0.5s', side: 'below' },
      { name: 'Matara', x: 390, y: 205, delay: '1s', side: 'above' },
      { name: 'Tangalle', x: 460, y: 225, delay: '1.5s', side: 'below' },
    ],
  },
  {
    id: 'kandy-badulla',
    path: 'M350,90 L400,130 L440,170 L480,200',
    dashLength: 195,
    duration: '7s',
    markers: [
      { name: 'Kandy', x: 350, y: 90, delay: '0s', side: 'above' },
      { name: 'Nuwara Eliya', x: 400, y: 130, delay: '0.5s', side: 'below' },
      { name: 'Ella', x: 440, y: 170, delay: '1s', side: 'above' },
      { name: 'Badulla', x: 480, y: 200, delay: '1.5s', side: 'below' },
    ],
  },
];

// How long each route journey stays on screen before cycling to the next.
const CYCLE_MS = 9500;
const FADE_MS = 500;

// Elongated, landscape-native island silhouette, shifted to sit behind
// the upper-right route cluster (artistic/decorative, not geographically
// precise) — sized to fill that zone without cropping.
const ISLAND_OUTLINE =
  'M220,150 C210,130 215,100 240,90 C270,60 320,50 360,60 ' +
  'C410,40 460,45 495,65 C520,72 535,82 530,102 ' +
  'C538,122 533,145 515,158 C505,180 488,198 460,206 ' +
  'C432,222 398,225 370,212 C335,225 300,218 275,202 ' +
  'C255,210 235,200 225,182 C215,175 210,165 220,150 Z';

// Fixed, hand-placed positions across the whole 520x300 canvas — kept
// deterministic (not random) so the layout never shifts between renders.
const PARTICLES = [
  { x: 30, y: 60, r: 1.1, delay: '0s', dur: '9s' },
  { x: 90, y: 230, r: 0.9, delay: '1.4s', dur: '11s' },
  { x: 150, y: 40, r: 1.3, delay: '2.6s', dur: '8s' },
  { x: 210, y: 260, r: 0.8, delay: '0.8s', dur: '10s' },
  { x: 60, y: 150, r: 1, delay: '3.5s', dur: '9.5s' },
  { x: 250, y: 30, r: 0.9, delay: '1.9s', dur: '12s' },
  { x: 340, y: 250, r: 1.2, delay: '0.4s', dur: '9s' },
  { x: 400, y: 20, r: 0.8, delay: '2.2s', dur: '10.5s' },
  { x: 460, y: 270, r: 1.1, delay: '3s', dur: '8.5s' },
  { x: 500, y: 120, r: 0.9, delay: '1.1s', dur: '11.5s' },
  { x: 170, y: 180, r: 1, delay: '2.9s', dur: '9s' },
  { x: 20, y: 200, r: 0.8, delay: '0.2s', dur: '10s' },
  { x: 300, y: 100, r: 1.2, delay: '1.6s', dur: '8s' },
  { x: 440, y: 160, r: 0.9, delay: '3.3s', dur: '11s' },
];

export default function RouteMapAnimation() {
  const [routeIndex, setRouteIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setRouteIndex((i) => (i + 1) % ROUTES.length);
        setVisible(true);
      }, FADE_MS);
    }, CYCLE_MS);
    return () => clearInterval(interval);
  }, []);

  const route = ROUTES[routeIndex];

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

          <clipPath id="rm-glass-clip">
            <rect x="-9" y="-5.5" width="18" height="7" rx="1.8" />
          </clipPath>
        </defs>

        <rect x="0" y="0" width="520" height="300" fill="url(#rm-bg-glow)" />
        <rect x="0" y="0" width="520" height="300" fill="url(#rm-grid)" />

        {/* Ambient drifting particles — independent of route cycling,
            always present for depth */}
        <g className="route-map-particles">
          {PARTICLES.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={p.r}
              className="route-map-particle"
              style={{ '--delay': p.delay, '--dur': p.dur }}
            />
          ))}
        </g>

        {/* Sri Lanka outline, positioned behind the route cluster */}
        <path d={ISLAND_OUTLINE} className="route-map-island" />

        {/* Per-route content — keyed so every field (line length, marker
            set, bus timing) restarts cleanly on each cycle */}
        <g
          key={route.id}
          className={`route-map-content ${visible ? 'is-visible' : 'is-fading'}`}
        >
          {/* Base route line — draws itself in with a gradient stroke, then loops */}
          <path
            d={route.path}
            className="route-map-line"
            style={{ '--dash-length': route.dashLength }}
          />

          {/* "Live" data-flow overlay — small dashes continuously travel the
              completed route for a tech-tracking feel */}
          <path d={route.path} className="route-map-flow" />

          {/* City markers — radar ring + pulse, in sequence, with label pills */}
          {route.markers.map((m) => (
            <g key={m.name} className="route-map-marker" style={{ animationDelay: m.delay }}>
              <circle cx={m.x} cy={m.y} r="13" className="route-map-marker-ring" />
              <circle cx={m.x} cy={m.y} r="9" className="route-map-marker-pulse" style={{ animationDelay: m.delay }} />
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
            <animateMotion dur={route.duration} repeatCount="indefinite" rotate="auto" path={route.path} />
          </ellipse>

          {/* Glossy, pseudo-3D bus riding the route */}
          <g className="route-map-bus">
            <circle cx="14" cy="0" r="7" fill="url(#rm-headlight)" />

            <g className="route-map-bus-bounce">
              {/* side depth panels — suggest the bus's visible side face */}
              <polygon points="-13,-6.5 13,-6.5 15,-3.5 -11,-3.5" fill="#7a4b08" opacity="0.55" />
              <polygon points="-13,6.5 13,6.5 15,9.5 -11,9.5" fill="#5c3806" opacity="0.5" />

              {/* main body */}
              <rect x="-13" y="-8.5" width="26" height="15" rx="4.5" fill="url(#rm-bus-body)" className="route-map-bus-body" />

              {/* roof highlight strip */}
              <rect x="-11.5" y="-8.5" width="23" height="2.2" rx="1.1" fill="#ffe9bc" opacity="0.55" />

              {/* windshield with clipped shine sweep */}
              <rect x="-9" y="-5.5" width="18" height="7" rx="1.8" fill="url(#rm-bus-glass)" />
              <g clipPath="url(#rm-glass-clip)">
                <g transform="skewX(-20)">
                  <rect x="-20" y="-6" width="6" height="8" fill="#ffffff" className="route-map-bus-shine" />
                </g>
              </g>

              <rect x="-13" y="3" width="26" height="2.2" fill="#1a1f28" opacity="0.28" />
              <rect x="-4" y="-11" width="8" height="2.4" rx="1" fill="#3a2408" opacity="0.5" />
              <circle cx="12.5" cy="-1" r="1.3" fill="#fff6d8" />

              {/* spinning, spoked wheels */}
              <g transform="translate(-7,8)">
                <g className="route-map-wheel-spin">
                  <circle r="2.7" fill="#161a21" />
                  <circle r="1" fill="#4a5260" />
                  <line x1="-2.2" y1="0" x2="2.2" y2="0" stroke="#3a4250" strokeWidth="0.6" />
                  <line x1="0" y1="-2.2" x2="0" y2="2.2" stroke="#3a4250" strokeWidth="0.6" />
                </g>
              </g>
              <g transform="translate(7,8)">
                <g className="route-map-wheel-spin">
                  <circle r="2.7" fill="#161a21" />
                  <circle r="1" fill="#4a5260" />
                  <line x1="-2.2" y1="0" x2="2.2" y2="0" stroke="#3a4250" strokeWidth="0.6" />
                  <line x1="0" y1="-2.2" x2="0" y2="2.2" stroke="#3a4250" strokeWidth="0.6" />
                </g>
              </g>
            </g>

            <animateMotion dur={route.duration} repeatCount="indefinite" rotate="auto" path={route.path} />
          </g>
        </g>
      </svg>
    </div>
  );
}