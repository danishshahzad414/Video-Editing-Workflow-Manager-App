import React from 'react';
import {
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from 'remotion';

const GOLD = '#C9A84C';
const WHITE = '#F5F5F0';

// Golden Key SVG
const KeySVG: React.FC<{ frame: number }> = ({ frame }) => {
  const idleRotation = Math.sin(frame * 0.05) * 3;

  return (
    <div
      style={{
        transform: `rotate(${idleRotation}deg)`,
        transformOrigin: 'center center',
        width: 240,
        height: 420,
        filter: 'drop-shadow(0 0 30px rgba(201,168,76,0.9))',
      }}
    >
      <svg
        width={240}
        height={420}
        viewBox="0 0 240 420"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="keyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EFD080" />
            <stop offset="100%" stopColor="#A8751A" />
          </linearGradient>
          <filter id="keyInnerGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Key bow (circular ring at top) */}
        <circle
          cx={120}
          cy={100}
          r={78}
          fill="url(#keyGrad)"
          stroke={WHITE}
          strokeWidth={1}
        />
        {/* Cutout in bow */}
        <circle cx={120} cy={100} r={42} fill="#0A0F2C" />

        {/* Key shaft */}
        <rect
          x={106}
          y={165}
          width={28}
          height={220}
          rx={8}
          fill="url(#keyGrad)"
          stroke={WHITE}
          strokeWidth={1}
        />

        {/* Tooth 1 */}
        <rect
          x={134}
          y={295}
          width={32}
          height={18}
          rx={5}
          fill="url(#keyGrad)"
          stroke={WHITE}
          strokeWidth={1}
        />

        {/* Tooth 2 */}
        <rect
          x={134}
          y={340}
          width={24}
          height={18}
          rx={5}
          fill="url(#keyGrad)"
          stroke={WHITE}
          strokeWidth={1}
        />

        {/* Highlight glint on bow */}
        <ellipse
          cx={100}
          cy={75}
          rx={18}
          ry={10}
          fill={WHITE}
          fillOpacity={0.2}
          transform="rotate(-30, 100, 75)"
        />
      </svg>
    </div>
  );
};

// Shockwave ring
const ShockwaveRing: React.FC<{ frame: number; startFrame: number }> = ({
  frame,
  startFrame,
}) => {
  const progress = interpolate(frame, [startFrame, startFrame + 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const radius = progress * 900;
  const opacity = interpolate(progress, [0, 0.1, 1], [0, 1, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    >
      <svg
        width={radius * 2}
        height={radius * 2}
        viewBox={`${-radius} ${-radius} ${radius * 2} ${radius * 2}`}
        style={{ overflow: 'visible', position: 'absolute', left: 0, top: 0, transform: 'translate(-50%, -50%)' }}
      >
        <circle
          cx={0}
          cy={0}
          r={radius}
          fill="none"
          stroke={GOLD}
          strokeWidth={3}
          strokeOpacity={opacity}
        />
      </svg>
    </div>
  );
};

interface Scene5Props {
  globalFrame: number;
}

export const Scene5Decision: React.FC<Scene5Props> = ({ globalFrame }) => {
  const { fps } = useVideoConfig();
  const frame = globalFrame - 1080;

  // Key spring entrance
  const keySc = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 10, stiffness: 200 },
  });

  const keyRotateIn = interpolate(keySc, [0, 1], [-15, 0]);

  // Hero text spring
  const textSc = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  // Gold underline width
  const lineWidth = interpolate(frame, [145, 175], [0, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Fade to black at the end
  const fadeOpacity = interpolate(frame, [300, 360], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Ghost elements scaling when shockwave passes (~frame 0-60)
  const globeGhostBoost = interpolate(frame, [8, 15, 22], [1, 1.08, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ausGhostBoost = interpolate(frame, [20, 28, 35], [1, 1.08, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const familyGhostBoost = interpolate(frame, [28, 36, 44], [1, 1.08, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: 'transparent', opacity: fadeOpacity }}>
      {/* Shockwave ring */}
      <ShockwaveRing frame={frame} startFrame={0} />

      {/* Globe ghost — top-left */}
      <div
        style={{
          position: 'absolute',
          left: '8%',
          top: '6%',
          width: 110,
          height: 110,
          transform: `scale(${globeGhostBoost})`,
          transformOrigin: 'center center',
          filter: 'blur(4px)',
          opacity: 0.35,
        }}
      >
        <svg width={110} height={110} viewBox="-55 -55 110 110">
          <circle cx={0} cy={0} r={50} fill="#0A0F2C" stroke={GOLD} strokeWidth={1.5} />
          <ellipse cx={-10} cy={-10} rx={25} ry={18} fill={GOLD} fillOpacity={0.4} />
          <ellipse cx={15} cy={5} rx={18} ry={12} fill={GOLD} fillOpacity={0.3} />
        </svg>
      </div>

      {/* Australia ghost — mid-left */}
      <div
        style={{
          position: 'absolute',
          left: '4%',
          top: '38%',
          width: 100,
          height: 80,
          transform: `scale(${ausGhostBoost})`,
          transformOrigin: 'center center',
          filter: 'blur(4px)',
          opacity: 0.35,
        }}
      >
        <svg width={100} height={80} viewBox="-50 -40 100 80">
          <path
            d="M -38 -15 C -38 -28 -28 -34 -15 -34 C 2 -34 15 -24 22 -14 C 30 -4 32 8 28 18 C 24 28 12 32 0 30 C -12 28 -25 20 -33 8 C -40 -2 -38 -15 -38 -15 Z"
            fill={GOLD}
            fillOpacity={0.7}
          />
        </svg>
      </div>

      {/* Family ghost — center */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '28%',
          transform: `translate(-50%, -50%) scale(${familyGhostBoost})`,
          transformOrigin: 'center center',
          filter: 'blur(4px)',
          opacity: 0.3,
          display: 'flex',
          gap: 8,
          alignItems: 'flex-end',
        }}
      >
        {[40, 28, 28, 40].map((h, i) => (
          <div
            key={i}
            style={{
              width: h * 0.4,
              height: h,
              background: WHITE,
              borderRadius: 4,
              opacity: 0.8,
            }}
          />
        ))}
      </div>

      {/* KEY — hero visual */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '44%',
          transform: `translate(-50%, -50%) scale(${keySc}) rotate(${keyRotateIn}deg)`,
          transformOrigin: 'center center',
        }}
      >
        <KeySVG frame={frame} />
      </div>

      {/* "one right decision away" text */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '72%',
          textAlign: 'center',
          opacity: textSc,
          transform: `scale(${textSc})`,
          transformOrigin: 'center center',
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 700,
          fontSize: 32,
          color: WHITE,
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}
      >
        one right decision away
      </div>

      {/* Gold underline */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '79%',
          transform: 'translateX(-50%)',
          height: 2,
          width: lineWidth,
          background: GOLD,
          borderRadius: 2,
          boxShadow: `0 0 8px ${GOLD}`,
        }}
      />
    </AbsoluteFill>
  );
};
