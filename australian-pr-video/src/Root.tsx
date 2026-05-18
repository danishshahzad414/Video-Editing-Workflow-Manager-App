import React from 'react';
import { Composition } from 'remotion';
import { AustralianPRComposition } from './Composition';

export const Root: React.FC = () => {
  return (
    <>
      {/*
        Google Fonts — Montserrat loaded via a style tag injected at runtime.
        Remotion supports this via the <style> tag in the component tree.
      */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: 'Montserrat', sans-serif;
          background: #0A0F2C;
        }
      `}</style>

      <Composition
        id="AustralianPR"
        component={AustralianPRComposition}
        durationInFrames={1440}
        fps={60}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
