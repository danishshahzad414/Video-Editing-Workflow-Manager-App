import React from 'react';
import {
  useVideoConfig,
  interpolate,
  spring,
  AbsoluteFill,
} from 'remotion';

const GOLD = '#C9A84C';
const WHITE = '#F5F5F0';

// Human silhouette SVG — isAdult controls size
const HumanFigure: React.FC<{
  isAdult: boolean;
  frame: number;
  fps: number;
  startFrame: number;
}> = ({ isAdult, frame, fps, startFrame }) => {
  const height = isAdult ? 160 : 110;
  const width = isAdult ? 68 : 46;

  const progress = interpolate(frame, [startFrame, startFrame + 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(progress, [0, 1], [120, 0]);

  const opacitySc = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 18, stiffness: 80 },
  });

  const headR = isAdult ? 18 : 12;
  const bodyW = isAdult ? 36 : 24;
  const bodyH = isAdult ? 70 : 48;
  const bodyY = headR * 2 + 6;
  const legY = bodyY + bodyH;

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity: opacitySc,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width,
        height,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible' }}
      >
        {/* Head */}
        <circle cx={width / 2} cy={headR} r={headR} fill={WHITE} />
        {/* Body */}
        <rect
          x={(width - bodyW) / 2}
          y={bodyY}
          width={bodyW}
          height={bodyH}
          rx={bodyW / 4}
          fill={WHITE}
        />
        {/* Left leg */}
        <line
          x1={width / 2 - bodyW / 5}
          y1={legY}
          x2={width / 2 - bodyW / 4}
          y2={height}
          stroke={WHITE}
          strokeWidth={isAdult ? 7 : 5}
          strokeLinecap="round"
        />
        {/* Right leg */}
        <line
          x1={width / 2 + bodyW / 5}
          y1={legY}
          x2={width / 2 + bodyW / 4}
          y2={height}
          stroke={WHITE}
          strokeWidth={isAdult ? 7 : 5}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

// 4-point star sparkle
const Sparkle: React.FC<{
  index: number;
  frame: number;
  startFrame: number;
  originX: number;
  originY: number;
}> = ({ index, frame, startFrame, originX, originY }) => {
  const angle = (index / 32) * Math.PI * 2;
  const speed = 60 + (index % 5) * 20;

  const progress = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dist = progress * speed;
  const x = originX + Math.cos(angle) * dist;
  const y = originY + Math.sin(angle) * dist;
  const opacity = interpolate(progress, [0, 0.3, 1], [0, 1, 0]);
  const size = 6 + (index % 3) * 2;

  // 4-point star path
  const starPath = (s: number) =>
    `M 0 -${s} L ${s * 0.3} -${s * 0.3} L ${s} 0 L ${s * 0.3} ${s * 0.3} L 0 ${s} L -${s * 0.3} ${s * 0.3} L -${s} 0 L -${s * 0.3} -${s * 0.3} Z`;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        opacity,
        pointerEvents: 'none',
      }}
    >
      <svg width={size * 2} height={size * 2} viewBox={`${-size} ${-size} ${size * 2} ${size * 2}`}>
        <path d={starPath(size * 0.8)} fill={GOLD} />
      </svg>
    </div>
  );
};

interface Scene4Props {
  globalFrame: number;
}

export const Scene4Family: React.FC<Scene4Props> = ({ globalFrame }) => {
  const { fps } = useVideoConfig();
  const frame = globalFrame - 840;

  const figures = [
    { isAdult: true, startFrame: 0 },
    { isAdult: false, startFrame: 20 },
    { isAdult: false, startFrame: 40 },
    { isAdult: true, startFrame: 60 },
  ];

  // Golden arc draws itself after frame 80
  const ARC_LENGTH = 700;
  const arcProgress = interpolate(frame, [82, 122], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const arcDashOffset = ARC_LENGTH * (1 - arcProgress);

  // Text fade at frame 120
  const textSc = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: { damping: 20, stiffness: 60 },
  });

  // Sparkle origin (center top of family group)
  const sparkleOriginX = 540; // center of 1080px wide
  const sparkleOriginY = 720; // above family figures

  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      {/* Family figures */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '52%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 32,
        }}
      >
        {figures.map((fig, i) => (
          <HumanFigure
            key={i}
            isAdult={fig.isAdult}
            frame={frame}
            fps={fps}
            startFrame={fig.startFrame}
          />
        ))}
      </div>

      {/* Golden arc over family */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '46%',
          transform: 'translate(-50%, -50%)',
          width: 380,
          height: 180,
          pointerEvents: 'none',
        }}
      >
        <svg
          width={380}
          height={180}
          viewBox="0 0 380 180"
          style={{ overflow: 'visible' }}
        >
          <path
            d="M 10 170 Q 190 -40 370 170"
            fill="none"
            stroke={GOLD}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={ARC_LENGTH}
            strokeDashoffset={arcDashOffset}
            style={{ filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.8))' }}
          />
        </svg>
      </div>

      {/* Sparkles bursting from arc */}
      {frame >= 82 &&
        Array.from({ length: 32 }, (_, i) => (
          <Sparkle
            key={i}
            index={i}
            frame={frame}
            startFrame={82 + Math.floor(i / 6)}
            originX={sparkleOriginX}
            originY={sparkleOriginY}
          />
        ))}

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
          fontSize: 26,
          color: '#F5F5F0',
          letterSpacing: '4px',
          textTransform: 'uppercase',
        }}
      >
        for your entire family
      </div>
    </AbsoluteFill>
  );
};
