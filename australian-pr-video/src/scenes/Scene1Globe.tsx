import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from 'remotion';

const GOLD = '#C9A84C';
const WHITE = '#F5F5F0';

// Simplified continent SVG paths offset so globe center is at (0,0), radius ~220
const CONTINENTS = [
  // North America
  'M -200 -80 C -200 -80 -220 -60 -210 -30 C -200 0 -190 10 -170 20 C -150 30 -140 40 -130 30 C -120 20 -110 0 -100 -10 C -90 -20 -80 -40 -90 -60 C -100 -80 -120 -100 -150 -100 C -180 -100 -200 -80 -200 -80 Z',
  // South America
  'M -120 30 C -120 30 -130 50 -120 80 C -110 110 -100 130 -90 150 C -80 170 -80 180 -90 190 C -100 195 -110 185 -115 175 C -120 160 -115 140 -120 120 C -125 100 -130 80 -125 60 C -120 40 -120 30 -120 30 Z',
  // Europe
  'M -30 -100 C -30 -100 -20 -110 0 -105 C 20 -100 30 -90 25 -75 C 20 -60 10 -55 -5 -55 C -20 -55 -30 -65 -35 -80 C -40 -90 -30 -100 -30 -100 Z',
  // Africa
  'M -10 -50 C -10 -50 10 -45 20 -30 C 30 -15 35 10 30 40 C 25 70 10 90 0 100 C -10 110 -20 100 -25 80 C -30 60 -25 30 -25 10 C -25 -10 -30 -30 -20 -45 C -15 -50 -10 -50 -10 -50 Z',
  // Asia
  'M 30 -110 C 30 -110 60 -120 100 -110 C 140 -100 160 -80 170 -60 C 180 -40 175 -20 160 -10 C 145 0 120 5 100 0 C 80 -5 60 -15 40 -30 C 20 -45 15 -70 20 -90 C 25 -105 30 -110 30 -110 Z',
  // Australia
  'M 140 40 C 140 40 160 30 180 40 C 200 50 210 70 200 90 C 190 110 170 115 155 110 C 140 105 130 90 130 70 C 130 55 140 40 140 40 Z',
  // Greenland
  'M -130 -130 C -130 -130 -110 -140 -95 -135 C -80 -130 -80 -115 -90 -108 C -100 -100 -115 -100 -125 -108 C -135 -115 -130 -130 -130 -130 Z',
];

// Particle component
const Particle: React.FC<{
  index: number;
  frame: number;
  totalParticles: number;
}> = ({ index, frame, totalParticles }) => {
  const angle = (index / totalParticles) * Math.PI * 2;
  const progress = interpolate(frame, [60, 200], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const radius = progress * 300;
  const opacity = interpolate(progress, [0, 0.3, 1], [0, 1, 0]);
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  const size = 4 + (index % 3) * 2;

  return (
    <circle
      cx={x}
      cy={y}
      r={size / 2}
      fill={GOLD}
      opacity={opacity}
    />
  );
};

// Currency orbit icon
const CurrencyOrbit: React.FC<{
  index: number;
  frame: number;
  symbol: string;
  fps: number;
}> = ({ index, frame, symbol, fps }) => {
  const startFrame = index * 15;
  const sc = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 18, stiffness: 80 },
  });

  const angle = (index / 4) * Math.PI * 2 + frame * 0.012;
  const radius = 265;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '40%',
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${sc})`,
        fontSize: 42,
        filter: 'drop-shadow(0 0 12px #C9A84C)',
        transformOrigin: 'center center',
        userSelect: 'none',
        lineHeight: 1,
      }}
    >
      {symbol}
    </div>
  );
};

export const Scene1Globe: React.FC<{ globalFrame: number }> = ({
  globalFrame,
}) => {
  const { fps } = useVideoConfig();
  const frame = globalFrame;

  const globeScale = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 80 },
  });

  const textOpacity = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  // Rotation offset for continent paths
  const rotOffset = frame * 0.35;

  const currencies = ['💵', '💷', '💶', '🪙'];

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* Globe SVG */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '37%',
          transform: `translate(-50%, -50%) scale(${globeScale})`,
          width: 460,
          height: 460,
        }}
      >
        <svg
          width={460}
          height={460}
          viewBox="-230 -230 460 460"
          style={{ overflow: 'visible' }}
        >
          {/* Glow behind globe */}
          <defs>
            <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.18" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </radialGradient>
            <clipPath id="globeClip">
              <circle cx={0} cy={0} r={220} />
            </clipPath>
          </defs>

          <circle cx={0} cy={0} r={260} fill="url(#globeGlow)" />

          {/* Globe base */}
          <circle cx={0} cy={0} r={220} fill="#0A0F2C" stroke={GOLD} strokeWidth={1.5} strokeOpacity={0.5} />

          {/* Latitude lines */}
          {[-150, -110, -66, -23, 0, 23, 45, 66, 80].map((lat) => {
            const y = (lat / 90) * 200;
            const halfWidth = Math.sqrt(Math.max(0, 220 * 220 - y * y));
            return (
              <line
                key={lat}
                x1={-halfWidth}
                x2={halfWidth}
                y1={y}
                y2={y}
                stroke={WHITE}
                strokeWidth={0.6}
                strokeOpacity={0.08}
              />
            );
          })}

          {/* Longitude lines */}
          {[0, 30, 60, 90, 120, 150].map((lon) => {
            const x = (lon / 180) * 220;
            const halfHeight = Math.sqrt(Math.max(0, 220 * 220 - x * x));
            return (
              <line
                key={lon}
                x1={x}
                x2={x}
                y1={-halfHeight}
                y2={halfHeight}
                stroke={WHITE}
                strokeWidth={0.6}
                strokeOpacity={0.08}
              />
            );
          })}

          {/* Continent paths — animated rotation via translateX */}
          <g clipPath="url(#globeClip)">
            {CONTINENTS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill={GOLD}
                fillOpacity={0.35}
                transform={`translateX(${(rotOffset % 440) - 220})`}
              />
            ))}
            {/* Second copy for seamless loop */}
            {CONTINENTS.map((d, i) => (
              <path
                key={`b${i}`}
                d={d}
                fill={GOLD}
                fillOpacity={0.35}
                transform={`translateX(${(rotOffset % 440) - 220 + 440})`}
              />
            ))}
          </g>

          {/* Globe rim highlight */}
          <circle
            cx={0}
            cy={0}
            r={220}
            fill="none"
            stroke={WHITE}
            strokeWidth={1}
            strokeOpacity={0.12}
          />

          {/* Particle system */}
          {frame >= 60 &&
            Array.from({ length: 30 }).map((_, i) => (
              <Particle key={i} index={i} frame={frame} totalParticles={30} />
            ))}
        </svg>
      </div>

      {/* Orbiting currency icons */}
      {currencies.map((sym, i) => (
        <CurrencyOrbit key={i} index={i} frame={frame} symbol={sym} fps={fps} />
      ))}

      {/* Supporting text */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '66%',
          textAlign: 'center',
          opacity: textOpacity,
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
          fontSize: 28,
          color: WHITE,
          letterSpacing: '6px',
          textTransform: 'uppercase',
        }}
      >
        premium global salary
      </div>
    </AbsoluteFill>
  );
};
