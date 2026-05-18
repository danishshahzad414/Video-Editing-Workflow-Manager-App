import React from 'react';
import {
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from 'remotion';

const GOLD = '#C9A84C';
const WHITE = '#F5F5F0';
const NAVY = '#0A0F2C';

// ECG waveform as a polyline points string (normalized for viewBox 0 0 300 100)
const ECG_POINTS =
  '0,50 30,50 45,50 50,20 55,80 60,50 90,50 100,50 115,50 120,10 125,90 130,50 160,50 300,50';

interface Scene2Props {
  globalFrame: number;
}

const StethoscopeSVG: React.FC = () => (
  <svg width={70} height={70} viewBox="0 0 70 70">
    <circle cx={35} cy={55} r={12} fill="none" stroke={GOLD} strokeWidth={3} />
    <path
      d="M 20 15 Q 10 35 10 45 Q 10 55 20 55"
      fill="none"
      stroke={GOLD}
      strokeWidth={3}
      strokeLinecap="round"
    />
    <path
      d="M 50 15 Q 60 35 60 45 Q 60 55 50 55"
      fill="none"
      stroke={GOLD}
      strokeWidth={3}
      strokeLinecap="round"
    />
    <circle cx={20} cy={15} r={4} fill={GOLD} />
    <circle cx={50} cy={15} r={4} fill={GOLD} />
  </svg>
);

const CrossSVG: React.FC = () => (
  <svg width={60} height={60} viewBox="0 0 60 60">
    <rect x={22} y={5} width={16} height={50} rx={4} fill={GOLD} />
    <rect x={5} y={22} width={50} height={16} rx={4} fill={GOLD} />
  </svg>
);

const ShieldSVG: React.FC = () => (
  <svg width={65} height={70} viewBox="0 0 65 70">
    <path
      d="M 32.5 4 L 60 16 L 60 36 Q 60 56 32.5 66 Q 5 56 5 36 L 5 16 Z"
      fill="none"
      stroke={GOLD}
      strokeWidth={3}
    />
    <path
      d="M 20 35 L 28 43 L 45 26"
      fill="none"
      stroke={GOLD}
      strokeWidth={3.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DNAHelixSVG: React.FC<{ frame: number }> = ({ frame }) => {
  const points1 = Array.from({ length: 10 }, (_, i) => {
    const t = i / 9;
    const x = 20 + Math.sin(t * Math.PI * 2 + frame * 0.05) * 14;
    const y = 5 + t * 60;
    return `${x},${y}`;
  }).join(' ');

  const points2 = Array.from({ length: 10 }, (_, i) => {
    const t = i / 9;
    const x = 20 + Math.sin(t * Math.PI * 2 + frame * 0.05 + Math.PI) * 14;
    const y = 5 + t * 60;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={40} height={70} viewBox="0 0 40 70">
      <polyline points={points1} fill="none" stroke={GOLD} strokeWidth={2.5} strokeLinecap="round" />
      <polyline points={points2} fill="none" stroke={GOLD} strokeWidth={2.5} strokeLinecap="round" />
      {Array.from({ length: 5 }, (_, i) => {
        const t = (i / 4) * 0.8 + 0.1;
        const x1 = 20 + Math.sin(t * Math.PI * 2 + frame * 0.05) * 14;
        const x2 = 20 + Math.sin(t * Math.PI * 2 + frame * 0.05 + Math.PI) * 14;
        const y = 5 + t * 60;
        return <line key={i} x1={x1} y1={y} x2={x2} y2={y} stroke={GOLD} strokeWidth={1.5} strokeOpacity={0.6} />;
      })}
    </svg>
  );
};

const ICON_POSITIONS = [
  { x: '50%', y: '16%', tx: 0, ty: 0 },   // top
  { x: '78%', y: '42%', tx: 0, ty: 0 },   // right
  { x: '50%', y: '68%', tx: 0, ty: 0 },   // bottom
  { x: '22%', y: '42%', tx: 0, ty: 0 },   // left
];

const ICON_START_FRAMES = [60, 80, 100, 120]; // relative to scene start (240)

export const Scene2Healthcare: React.FC<Scene2Props> = ({ globalFrame }) => {
  const { fps } = useVideoConfig();
  // Frame relative to this scene's start (240)
  const frame = globalFrame - 240;

  // Heartbeat scale
  const heartScale = 1 + 0.06 * Math.sin(frame * 0.18);

  // ECG dash animation — total path length ~340 (approx)
  const ECG_LENGTH = 340;
  const ecgProgress = interpolate(frame, [20, 80], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const strokeDashoffset = ECG_LENGTH * (1 - ecgProgress);

  // Text opacity
  const textSc = spring({
    frame: Math.max(0, frame - 90),
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  const icons = [<StethoscopeSVG />, <CrossSVG />, <ShieldSVG />, <DNAHelixSVG frame={frame} />];

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* Heart + ECG */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '42%',
          transform: `translate(-50%, -50%) scale(${heartScale})`,
          width: 280,
          height: 280,
        }}
      >
        <svg width={280} height={280} viewBox="0 0 280 280" style={{ overflow: 'visible' }}>
          <defs>
            <filter id="heartGlow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <radialGradient id="heartGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#EFD080" />
              <stop offset="100%" stopColor={GOLD} />
            </radialGradient>
          </defs>

          {/* Glow layer */}
          <path
            d="M 140 230 C 140 230 20 150 20 85 C 20 50 48 28 80 28 C 100 28 118 38 140 60 C 162 38 180 28 200 28 C 232 28 260 50 260 85 C 260 150 140 230 140 230 Z"
            fill={GOLD}
            fillOpacity={0.25}
            style={{ filter: 'blur(18px)' }}
          />

          {/* Heart shape */}
          <path
            d="M 140 230 C 140 230 20 150 20 85 C 20 50 48 28 80 28 C 100 28 118 38 140 60 C 162 38 180 28 200 28 C 232 28 260 50 260 85 C 260 150 140 230 140 230 Z"
            fill="url(#heartGrad)"
          />

          {/* ECG line overlay */}
          <g transform="translate(50, 140)">
            <polyline
              points={ECG_POINTS}
              fill="none"
              stroke={WHITE}
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={ECG_LENGTH}
              strokeDashoffset={strokeDashoffset}
            />
          </g>
        </svg>
      </div>

      {/* Medical icons at cardinal positions */}
      {icons.map((Icon, i) => {
        const sc = spring({
          frame: Math.max(0, frame - ICON_START_FRAMES[i]),
          fps,
          config: { damping: 18, stiffness: 100 },
        });

        const positions = [
          { left: '50%', top: '16%', transform: `translate(-50%, -50%) scale(${sc})` },
          { left: '80%', top: '42%', transform: `translate(-50%, -50%) scale(${sc})` },
          { left: '50%', top: '68%', transform: `translate(-50%, -50%) scale(${sc})` },
          { left: '20%', top: '42%', transform: `translate(-50%, -50%) scale(${sc})` },
        ];

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...positions[i],
              filter: 'drop-shadow(0 0 16px rgba(201,168,76,0.7))',
            }}
          >
            {Icon}
          </div>
        );
      })}

      {/* Supporting text */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '74%',
          textAlign: 'center',
          opacity: textSc,
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
          fontSize: 28,
          color: WHITE,
          letterSpacing: '4px',
          textTransform: 'uppercase',
        }}
      >
        world-class healthcare
      </div>
    </AbsoluteFill>
  );
};
