import React from 'react';
import { Composition } from 'remotion';
import { ThreePillars } from './ThreePillars';
import { FPS, WIDTH, HEIGHT, TOTAL_FRAMES } from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ThreePillars"
      component={ThreePillars}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
