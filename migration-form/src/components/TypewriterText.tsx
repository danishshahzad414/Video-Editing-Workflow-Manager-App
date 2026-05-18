import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface TypewriterTextProps {
  text: string;
  startFrame: number;
  endFrame: number;
  style?: React.CSSProperties;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame,
  endFrame,
  style,
}) => {
  const frame = useCurrentFrame();

  const charCount = Math.floor(
    interpolate(frame, [startFrame, endFrame], [0, text.length], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  return (
    <span style={style}>
      {text.slice(0, charCount)}
      {charCount < text.length && frame >= startFrame && (
        <span
          style={{
            opacity: Math.floor(frame / 6) % 2 === 0 ? 1 : 0,
            borderRight: "2px solid rgba(255,255,255,0.8)",
            marginLeft: 1,
          }}
        />
      )}
    </span>
  );
};
