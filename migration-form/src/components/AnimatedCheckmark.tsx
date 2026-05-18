import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface AnimatedCheckmarkProps {
  startFrame: number;
}

export const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({
  startFrame,
}) => {
  const frame = useCurrentFrame();

  // Circle draws in over 25 frames
  const circleProgress = interpolate(
    frame,
    [startFrame, startFrame + 25],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Check tick draws in 10 frames after circle starts
  const checkProgress = interpolate(
    frame,
    [startFrame + 20, startFrame + 38],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Circle: circumference = 2 * π * r = 2 * π * 36 ≈ 226
  const circleCircumference = 226;
  const circleDashOffset =
    circleCircumference - circleProgress * circleCircumference;

  // Check path length ≈ 55
  const checkLength = 55;
  const checkDashOffset = checkLength - checkProgress * checkLength;

  // Scale pop on completion
  const scaleProgress = interpolate(
    frame,
    [startFrame + 38, startFrame + 44, startFrame + 48],
    [1, 1.12, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
        transform: `scale(${scaleProgress})`,
      }}
    >
      <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
        {/* Glow background circle */}
        <circle
          cx="45"
          cy="45"
          r="40"
          fill="rgba(34,197,94,0.12)"
          opacity={circleProgress}
        />

        {/* Animated circle stroke */}
        <circle
          cx="45"
          cy="45"
          r="36"
          stroke="#22c55e"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circleCircumference}
          strokeDashoffset={circleDashOffset}
          transform="rotate(-90 45 45)"
        />

        {/* Animated checkmark */}
        <path
          d="M28 46 L40 58 L63 33"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={checkLength}
          strokeDashoffset={checkDashOffset}
        />
      </svg>
    </div>
  );
};
