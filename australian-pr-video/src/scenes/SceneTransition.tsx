import React from 'react';
import { interpolate, AbsoluteFill } from 'remotion';

const GOLD = '#C9A84C';

interface WipeTransitionProps {
  frame: number;
  startFrame: number;
  duration?: number;
}

// Vertical gold wipe bar sweeping top to bottom
export const GoldWipeTransition: React.FC<WipeTransitionProps> = ({
  frame,
  startFrame,
  duration = 20,
}) => {
  const progress = interpolate(
    frame,
    [startFrame, startFrame + duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // The wipe bar: a 4px wide gold line sweeping across via translateX
  const sweepX = interpolate(progress, [0, 1], [-8, 1088]);
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + 4, startFrame + duration - 4, startFrame + duration],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: sweepX,
          top: 0,
          width: 4,
          height: '100%',
          background: GOLD,
          opacity,
          boxShadow: `0 0 20px 6px ${GOLD}`,
        }}
      />
    </AbsoluteFill>
  );
};
