import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { CARDS_DATA, CARD_DUR, GAP, OUTRO_DUR } from './constants';
import { Card } from './Card';
import { Outro } from './Outro';

export const ThreePillars: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0A0A0A' }}>
      {/* Load Bebas Neue from Google Fonts — works instantly in preview */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anton&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {CARDS_DATA.map((card, i) => (
        <Sequence
          key={card.label}
          from={i * (CARD_DUR + GAP)}
          durationInFrames={CARD_DUR}
        >
          <Card
            line1={card.line1}
            line2={card.line2}
            accent={card.accent}
            duration={CARD_DUR}
          />
        </Sequence>
      ))}

      <Sequence
        from={CARDS_DATA.length * (CARD_DUR + GAP)}
        durationInFrames={OUTRO_DUR}
      >
        <Outro cards={CARDS_DATA} duration={OUTRO_DUR} />
      </Sequence>
    </AbsoluteFill>
  );
};
