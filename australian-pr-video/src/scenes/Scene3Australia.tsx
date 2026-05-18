import React from 'react';
import {
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from 'remotion';

const GOLD = '#C9A84C';
const WHITE = '#F5F5F0';

// Simplified Australia SVG path — centered at 0,0, ~500×420px bounding box
// Queensland bump visible, Gulf of Carpentaria indentation, southern coast, Cape York
const AUSTRALIA_PATH = `
  M -200 -80
  C -200 -120 -180 -150 -140 -160
  C -100 -170 -60 -165 -20 -155
  C 20 -145 50 -130 80 -110
  C 110 -90 130 -80 150 -90
  C 170 -100 185 -110 195 -100
  C 205 -90 200 -70 195 -55
  C 190 -40 185 -30 195 -15
  C 205 0 210 20 200 40
  C 190 60 170 70 150 65
  C 130 60 110 50 90 55
  C 70 60 55 75 40 90
  C 25 105 10 115 -10 118
  C -30 121 -55 115 -80 105
  C -105 95 -130 80 -155 75
  C -180 70 -205 75 -215 65
  C -225 55 -220 35 -215 15
  C -210 -5 -210 -30 -210 -55
  C -210 -70 -205 -80 -200 -80 Z
`;

// Tasmania (separate island, small)
const TASMANIA_PATH = `
  M -60 140
  C -60 130 -50 122 -38 122
  C -26 122 -18 130 -18 140
  C -18 155 -30 165 -40 165
  C -50 165 -60 155 -60 140 Z
`;

// Location pin SVG (teardrop with circle cutout)
const LocationPin: React.FC<{ frame: number; fps: number; startFrame: number }> = ({
  frame,
  fps,
  startFrame,
}) => {
  const sc = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 12, stiffness: 180 },
  });

  const dropY = interpolate(sc, [0, 1], [-80, 0]);

  return (
    <g transform={`translate(80, -20) translateY(${dropY}) scale(${sc})`}>
      <defs>
        <radialGradient id="pinGrad" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#EFD080" />
          <stop offset="100%" stopColor="#A8751A" />
        </radialGradient>
      </defs>
      <path
        d="M 0 -45 C -22 -45 -38 -28 -38 -10 C -38 12 0 45 0 45 C 0 45 38 12 38 -10 C 38 -28 22 -45 0 -45 Z"
        fill="url(#pinGrad)"
        style={{ filter: 'drop-shadow(0 0 12px rgba(201,168,76,0.9))' }}
      />
      <circle cx={0} cy={-10} r={13} fill={WHITE} fillOpacity={0.3} />
    </g>
  );
};

// Radial burst lines
const RadialBurst: React.FC<{ frame: number; startFrame: number }> = ({ frame, startFrame }) => {
  return (
    <>
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const lineStart = startFrame + i * 3;
        const scaleX = interpolate(frame, [lineStart, lineStart + 25], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const opacity = interpolate(frame, [lineStart + 20, lineStart + 50], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const len = 140;
        const x2 = Math.cos(angle) * len;
        const y2 = Math.sin(angle) * len;

        return (
          <line
            key={i}
            x1={0}
            y1={0}
            x2={x2 * scaleX}
            y2={y2 * scaleX}
            stroke={GOLD}
            strokeWidth={2}
            strokeOpacity={opacity}
            strokeLinecap="round"
          />
        );
      })}
    </>
  );
};

interface Scene3Props {
  globalFrame: number;
}

export const Scene3Australia: React.FC<Scene3Props> = ({ globalFrame }) => {
  const { fps } = useVideoConfig();
  const frame = globalFrame - 480;

  // Flash effect (gold flash at frame 0)
  const flashOpacity = interpolate(frame, [0, 3, 6], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Australia zoom-in spring
  const ausScale = spring({
    frame: Math.max(0, frame),
    fps,
    config: { damping: 18, stiffness: 80 },
  });
  const ausScaleValue = interpolate(ausScale, [0, 1], [3, 1]);
  const ausOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Coastline trace animation
  const COAST_LENGTH = 1400;
  const coastProgress = interpolate(frame, [20, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const coastDashOffset = COAST_LENGTH * (1 - coastProgress);

  // Tasmania spring (20 frames later)
  const tasSc = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 16, stiffness: 90 },
  });

  // Text animations
  const textSc = spring({
    frame: Math.max(0, frame - 100),
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  const prScale = spring({
    frame: Math.max(0, frame - 115),
    fps,
    config: { damping: 16, stiffness: 100 },
  });
  const prScaleValue = interpolate(prScale, [0, 1], [0.5, 1]);

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* Gold camera-flash overlay */}
      <AbsoluteFill
        style={{
          background: GOLD,
          opacity: flashOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Australia SVG */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '40%',
          transform: `translate(-50%, -50%) scale(${ausScaleValue})`,
          opacity: ausOpacity,
          width: 540,
          height: 460,
        }}
      >
        <svg
          width={540}
          height={460}
          viewBox="-270 -230 540 460"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="ausGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EFD080" />
              <stop offset="100%" stopColor={GOLD} />
            </linearGradient>
          </defs>

          {/* Radial burst from center */}
          <RadialBurst frame={frame} startFrame={65} />

          {/* Australia fill */}
          <path d={AUSTRALIA_PATH} fill="url(#ausGrad)" />

          {/* Coastline trace */}
          <path
            d={AUSTRALIA_PATH}
            fill="none"
            stroke={WHITE}
            strokeWidth={2.5}
            strokeDasharray={COAST_LENGTH}
            strokeDashoffset={coastDashOffset}
            strokeLinecap="round"
          />

          {/* Tasmania */}
          <g opacity={tasSc}>
            <path d={TASMANIA_PATH} fill="url(#ausGrad)" />
            <path
              d={TASMANIA_PATH}
              fill="none"
              stroke={WHITE}
              strokeWidth={2}
              strokeDasharray={200}
              strokeDashoffset={200 * (1 - tasSc)}
            />
          </g>

          {/* Location pin (Sydney/Melbourne area) */}
          {frame >= 0 && <LocationPin frame={frame} fps={fps} startFrame={30} />}
        </svg>
      </div>

      {/* Text: "australian permanent residency" */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '72%',
          textAlign: 'center',
          opacity: textSc,
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 300,
          fontSize: 24,
          color: WHITE,
          letterSpacing: '5px',
          textTransform: 'uppercase',
        }}
      >
        australian permanent residency
      </div>

      {/* "PR" hero text */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: '78%',
          textAlign: 'center',
          transform: `scale(${prScaleValue})`,
          transformOrigin: 'center center',
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 800,
          fontSize: 100,
          color: GOLD,
          lineHeight: 1,
          filter: 'drop-shadow(0 0 24px rgba(201,168,76,0.6))',
        }}
      >
        PR
      </div>
    </AbsoluteFill>
  );
};
