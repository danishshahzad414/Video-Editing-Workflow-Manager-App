import React from 'react';
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

interface CardProps {
  line1: string;
  line2: string;
  accent: string;
  duration: number;
}

export const Card: React.FC<CardProps> = ({ line1, line2, accent, duration }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Spring scale: 1.5 → overshoot → settle at 1.0 ──
  // Low damping (6) = strong overshoot = "stamped" feel
  const scale = spring({
    frame,
    fps,
    from: 1.55,
    to: 1.0,
    config: { damping: 6, stiffness: 70, mass: 0.8 },
  });

  // ── Y slam: drops from above, micro-overshoot ──
  const ySlam = spring({
    frame,
    fps,
    from: -110,
    to: 0,
    config: { damping: 7, stiffness: 95, mass: 0.55 },
  });

  // ── Slight horizontal drift (cinematic micro-movement) ──
  const xDrift = spring({
    frame,
    fps,
    from: 18,
    to: 0,
    config: { damping: 9, stiffness: 80, mass: 0.6 },
  });

  // ── Impact flash: accent bloom on cut point (0→4 frames) ──
  const flashOpacity = interpolate(frame, [0, 6], [0.65, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Light leak: sweeps left→right ──
  const leakX = interpolate(frame, [0, duration], [-25, 125], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const leakOpacity = interpolate(
    frame,
    [0, 4, duration - 8, duration],
    [0, 0.75, 0.55, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── Text opacity: snap in on frame 1 ──
  const textOpacity = interpolate(frame, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A', overflow: 'hidden' }}>

      {/* ── Cinematic vignette ── */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 82% 78% at 50% 50%, transparent 30%, rgba(0,0,0,0.82) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* ── Subtle accent glow behind text ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 45% at 50% 50%, ${accent}22, transparent 68%)`,
          zIndex: 1,
          pointerEvents: 'none',
          opacity: leakOpacity,
        }}
      />

      {/* ── Light leak — core streak (sharp-gradient + blur) ── */}
      <div
        style={{
          position: 'absolute',
          top: '34%',
          left: `${leakX}%`,
          transform: 'translateX(-50%)',
          width: '58%',
          height: '160px',
          background: `linear-gradient(to right,
            transparent 0%,
            ${accent}55 20%,
            ${accent}CC 50%,
            ${accent}55 80%,
            transparent 100%)`,
          filter: 'blur(14px)',
          opacity: leakOpacity,
          mixBlendMode: 'screen',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* ── Light leak — wide soft halo ── */}
      <div
        style={{
          position: 'absolute',
          top: '18%',
          left: `${leakX}%`,
          transform: 'translateX(-50%)',
          width: '70%',
          height: '480px',
          background: `radial-gradient(ellipse 100% 100% at 50% 50%, ${accent}38, transparent 62%)`,
          filter: 'blur(48px)',
          opacity: leakOpacity * 0.5,
          mixBlendMode: 'screen',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* ── Impact flash ── */}
      <AbsoluteFill
        style={{
          backgroundColor: accent,
          opacity: flashOpacity,
          mixBlendMode: 'screen',
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />

      {/* ── Headline text ── */}
      <AbsoluteFill
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          opacity: textOpacity,
        }}
      >
        <div
          style={{
            transform: `scale(${scale}) translate(${xDrift}px, ${ySlam}px)`,
            transformOrigin: 'center center',
            textAlign: 'center',
            fontFamily: "'Bebas Neue', Anton, Impact, 'Arial Black', sans-serif",
            fontSize: '164px',
            fontWeight: 400,
            lineHeight: 0.9,
            color: '#FFFFFF',
            letterSpacing: '0.06em',
            // Accent-color stroke behind white fill = clean bold outline
            WebkitTextStroke: `5px ${accent}`,
            // @ts-ignore — CSS paint-order is valid in Chromium
            paintOrder: 'stroke fill',
            // Multi-layer shadow: hard shadow + soft glow
            textShadow: `
              0 6px 0 rgba(0,0,0,0.6),
              0 12px 40px rgba(0,0,0,0.95),
              0 0 80px ${accent}50
            `,
            userSelect: 'none',
          }}
        >
          <div>{line1}</div>
          <div>{line2}</div>
        </div>
      </AbsoluteFill>

      {/* ── Bottom accent line (thin rule fades in) ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${interpolate(frame, [8, 20], [0, 420], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px`,
          height: '3px',
          backgroundColor: accent,
          boxShadow: `0 0 16px ${accent}`,
          borderRadius: '2px',
          zIndex: 5,
        }}
      />
    </AbsoluteFill>
  );
};
