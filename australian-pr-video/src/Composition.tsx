import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { Scene1Globe } from './scenes/Scene1Globe';
import { Scene2Healthcare } from './scenes/Scene2Healthcare';
import { Scene3Australia } from './scenes/Scene3Australia';
import { Scene4Family } from './scenes/Scene4Family';
import { Scene5Decision } from './scenes/Scene5Decision';
import { GoldWipeTransition } from './scenes/SceneTransition';

const NAVY = '#0A0F2C';
const GOLD = '#C9A84C';

// Ghost versions of earlier scenes that persist into later scenes
const GlobeGhost: React.FC<{ frame: number }> = ({ frame }) => {
  const sceneStart = 240;
  const fadeOut = interpolate(frame, [sceneStart, sceneStart + 40], [1, 0.15], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: '6%',
        top: '3%',
        width: 120,
        height: 120,
        opacity: fadeOut,
        filter: 'blur(6px)',
        transform: 'scale(0.15)',
        transformOrigin: 'top left',
        pointerEvents: 'none',
      }}
    >
      <svg width={800} height={800} viewBox="-230 -230 460 460">
        <circle cx={0} cy={0} r={220} fill={NAVY} stroke={GOLD} strokeWidth={1.5} />
        <ellipse cx={-60} cy={-30} rx={80} ry={55} fill={GOLD} fillOpacity={0.35} />
        <ellipse cx={60} cy={20} rx={60} ry={40} fill={GOLD} fillOpacity={0.3} />
        <ellipse cx={150} cy={50} rx={45} ry={30} fill={GOLD} fillOpacity={0.25} />
      </svg>
    </div>
  );
};

export const AustralianPRComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Breathing animation on entire composition (scene 5+)
  const breathingScale =
    frame >= 1080 ? 1 + 0.008 * Math.sin(frame * 0.08) : 1;

  // Fade to black for last 60 frames
  const finalFade = interpolate(frame, [1380, 1440], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: NAVY,
        fontFamily: "'Montserrat', sans-serif",
        transform: `scale(${breathingScale})`,
        transformOrigin: 'center center',
        opacity: finalFade,
      }}
    >
      {/* Subtle noise texture overlay */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* ---- SCENE 1: Globe + Salary (0–240) ---- */}
      <Sequence from={0} durationInFrames={280}>
        <Scene1Globe globalFrame={frame} />
      </Sequence>

      {/* ---- WIPE TRANSITION 1→2 (around frame 240) ---- */}
      <GoldWipeTransition frame={frame} startFrame={232} duration={20} />

      {/* ---- SCENE 2: Healthcare (240–480) ---- */}
      <Sequence from={240} durationInFrames={280}>
        <Scene2Healthcare globalFrame={frame} />
      </Sequence>

      {/* ---- WIPE TRANSITION 2→3 (around frame 480) ---- */}
      <GoldWipeTransition frame={frame} startFrame={472} duration={20} />

      {/* ---- SCENE 3: Australia PR (480–840) ---- */}
      <Sequence from={480} durationInFrames={400}>
        <Scene3Australia globalFrame={frame} />
      </Sequence>

      {/* ---- SCENE 4: Family (840–1080) ---- */}
      <Sequence from={840} durationInFrames={280}>
        <Scene4Family globalFrame={frame} />
      </Sequence>

      {/* ---- SCENE 5: One Decision — Climax (1080–1440) ---- */}
      <Sequence from={1080} durationInFrames={360}>
        <Scene5Decision globalFrame={frame} />
      </Sequence>

      {/* ---- GHOST ELEMENTS persist across later scenes ---- */}
      {/* Globe ghost visible in scenes 2–5 */}
      {frame >= 240 && frame < 1080 && <GlobeGhost frame={frame} />}
    </AbsoluteFill>
  );
};
