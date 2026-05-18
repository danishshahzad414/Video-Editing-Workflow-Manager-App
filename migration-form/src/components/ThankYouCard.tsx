import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { GlassCard } from "./GlassCard";
import { AnimatedCheckmark } from "./AnimatedCheckmark";

interface ThankYouCardProps {
  startFrame: number;
}

export const ThankYouCard: React.FC<ThankYouCardProps> = ({ startFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, stiffness: 120, mass: 1 },
    durationInFrames: 35,
  });

  const translateY = interpolate(entrance, [0, 1], [-60, 0]);
  const opacity = interpolate(frame, [startFrame, startFrame + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textOpacity = interpolate(
    frame,
    [startFrame + 20, startFrame + 34],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const subtextOpacity = interpolate(
    frame,
    [startFrame + 30, startFrame + 46],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const btnOpacity = interpolate(
    frame,
    [startFrame + 40, startFrame + 54],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity,
        width: "100%",
      }}
    >
      <GlassCard>
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 8,
            fontFamily: "'Plus Jakarta Sans', 'SF Pro Display', sans-serif",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255,255,255,0.55)",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            Step 2 of 2
          </div>
          <div
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.35)",
              marginBottom: 20,
            }}
          >
            ━━━━━━━━━━━━━━━━━━━━
          </div>
        </div>

        {/* Animated Checkmark */}
        <AnimatedCheckmark startFrame={startFrame + 8} />

        {/* Thank You Text */}
        <div
          style={{
            textAlign: "center",
            opacity: textOpacity,
            fontFamily: "'Plus Jakarta Sans', 'SF Pro Display', sans-serif",
          }}
        >
          <h2
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: "#ffffff",
              margin: 0,
              marginBottom: 14,
              letterSpacing: -0.5,
            }}
          >
            Thank You!
          </h2>
        </div>

        {/* Subtext */}
        <div
          style={{
            textAlign: "center",
            opacity: subtextOpacity,
            fontFamily: "'Plus Jakarta Sans', 'SF Pro Display', sans-serif",
          }}
        >
          <p
            style={{
              fontSize: 15,
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.65,
              margin: 0,
              marginBottom: 10,
              padding: "0 4px",
            }}
          >
            Your application details have been submitted successfully. We will
            review your information and get back to you shortly.
          </p>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              margin: 0,
              marginBottom: 28,
            }}
          >
            A confirmation email will be sent to you soon.
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "rgba(255,255,255,0.12)",
            marginBottom: 22,
            opacity: subtextOpacity,
          }}
        />

        {/* PREV Button */}
        <div style={{ opacity: btnOpacity }}>
          <button
            style={{
              width: "50%",
              background: "#2B5FBF",
              border: "none",
              borderRadius: 10,
              padding: "14px 0",
              color: "#ffffff",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', 'SF Pro Display', sans-serif",
              letterSpacing: 0.5,
              cursor: "pointer",
            }}
          >
            ← PREV
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
