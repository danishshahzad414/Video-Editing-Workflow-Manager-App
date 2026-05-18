import React from 'react';
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

interface CardInfo {
  label: string;
  line1: string;
  line2: string;
  accent: string;
}

// Triptych segment as its own component so spring() hook is called at top level
const RuleSegment: React.FC<{ accent: string; delay: number }> = ({ accent, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scaleX = spring({
    frame: Math.max(0, frame - delay),
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, stiffness: 220, mass: 0.4 },
  });

  return (
    <div
      style={{
        width: `${190 * scaleX}px`,
        height: '5px',
        backgroundColor: accent,
        borderRadius: '3px',
        boxShadow: `0 0 18px ${accent}BB, 0 0 6px ${accent}`,
        transformOrigin: 'left center',
      }}
    />
  );
};

export const Outro: React.FC<{ cards: CardInfo[]; duration: number }> = ({
  cards,
  duration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring scale: same stamp-in as cards
  const scale = spring({
    frame,
    fps,
    from: 1.55,
    to: 1.0,
    config: { damping: 6, stiffness: 70, mass: 0.8 },
  });

  const ySlam = spring({
    frame,
    fps,
    from: -110,
    to: 0,
    config: { damping: 7, stiffness: 95, mass: 0.55 },
  });

  const textOpacity = interpolate(frame, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Flash per card color blending together
  const flashOpacity = interpolate(frame, [0, 7], [0.45, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Three horizontal leak bands (one per accent color), all sweep simultaneously
  const leakX = interpolate(frame, [0, duration], [-25, 125], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const leakOp = interpolate(
    frame,
    [0, 5, duration - 8, duration],
    [0, 0.6, 0.4, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const yBands = ['22%', '50%', '78%'];

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A', overflow: 'hidden' }}>

      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 80% 76% at 50% 50%, transparent 28%, rgba(0,0,0,0.82) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Three accent leaks bleeding in simultaneously */}
      {cards.map((card, i) => (
        <div
          key={card.label}
          style={{
            position: 'absolute',
            top: yBands[i],
            left: `${leakX}%`,
            transform: 'translateX(-50%) translateY(-50%)',
            width: '62%',
            height: '100px',
            background: `linear-gradient(to right,
              transparent 0%,
              ${card.accent}55 25%,
              ${card.accent}AA 50%,
              ${card.accent}55 75%,
              transparent 100%)`,
            filter: 'blur(20px)',
            opacity: leakOp,
            mixBlendMode: 'screen',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Tri-color impact flash */}
      {cards.map((card, i) => (
        <AbsoluteFill
          key={card.label}
          style={{
            backgroundColor: card.accent,
            opacity: flashOpacity * 0.33,
            mixBlendMode: 'screen',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Text + triptych rule */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          opacity: textOpacity,
          gap: '32px',
        }}
      >
        {/* Headline */}
        <div
          style={{
            transform: `scale(${scale}) translateY(${ySlam}px)`,
            transformOrigin: 'center center',
            textAlign: 'center',
            fontFamily: "'Bebas Neue', Anton, Impact, 'Arial Black', sans-serif",
            fontSize: '148px',
            fontWeight: 400,
            lineHeight: 0.9,
            color: '#FFFFFF',
            letterSpacing: '0.06em',
            WebkitTextStroke: `5px ${cards[0].accent}`,
            // @ts-ignore
            paintOrder: 'stroke fill',
            textShadow: `
              0 6px 0 rgba(0,0,0,0.6),
              0 12px 40px rgba(0,0,0,0.95),
              0 0 80px ${cards[0].accent}44
            `,
            userSelect: 'none',
          }}
        >
          <div>FOR YOUR</div>
          <div>ENTIRE FAMILY</div>
        </div>

        {/* Triptych rule — three color segments wipe in, staggered */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          {cards.map((card, i) => (
            <RuleSegment key={card.label} accent={card.accent} delay={14 + i * 3} />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
