import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { GlassCard } from "../components/GlassCard";
import { FormField } from "../components/FormField";
import { ThankYouCard } from "../components/ThankYouCard";

const FIELDS = [
  {
    label: "What is your current age?",
    value: "18–24",
    type: "dropdown" as const,
    required: true,
    start: 30,
    end: 44,
  },
  {
    label: "Have you taken an English language test (like IELTS)?",
    value: "Yes – PTE",
    type: "dropdown" as const,
    required: true,
    start: 48,
    end: 62,
  },
  {
    label: "What is your Field of Study?",
    value: "Computer Science",
    type: "text" as const,
    required: true,
    start: 66,
    end: 96,
  },
  {
    label: "What is your highest educational qualification?",
    value: "PhD",
    type: "dropdown" as const,
    required: true,
    start: 100,
    end: 114,
  },
  {
    label: "Are you planning to apply with a spouse/partner?",
    value: "No",
    type: "dropdown" as const,
    required: true,
    start: 118,
    end: 130,
  },
  {
    label: "How many years of skilled work experience do you have outside Australia (in the past 10 years)?",
    value: "3–4 years",
    type: "dropdown" as const,
    required: true,
    start: 134,
    end: 148,
  },
  {
    label: "Which city you are from ?",
    value: "Lahore",
    type: "text" as const,
    required: true,
    start: 152,
    end: 176,
  },
  {
    label: "Upload Your CV",
    value: "CV_Uploaded ✓",
    type: "upload" as const,
    required: false,
    start: 185,
    end: 200,
    isUpload: true,
  },
];

const ActionButtons: React.FC<{ pressStart: number }> = ({ pressStart }) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [pressStart, pressStart + 6, pressStart + 16],
    [1, 0.94, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    }
  );

  const rippleProgress = interpolate(
    frame,
    [pressStart, pressStart + 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const rippleSize = rippleProgress * 140;
  const rippleOpacity = interpolate(rippleProgress, [0, 0.35, 1], [0, 0.28, 0]);

  return (
    <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
      {/* PREV */}
      <button
        style={{
          flex: 1,
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

      {/* NEXT with press + ripple */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden", borderRadius: 10 }}>
        {rippleProgress > 0 && rippleProgress < 1 && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: rippleSize,
              height: rippleSize,
              borderRadius: "50%",
              background: "#ffffff",
              opacity: rippleOpacity,
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
            }}
          />
        )}
        <button
          style={{
            width: "100%",
            background: "#C8922A",
            border: "none",
            borderRadius: 10,
            padding: "14px 0",
            color: "#ffffff",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', 'SF Pro Display', sans-serif",
            letterSpacing: 0.5,
            cursor: "pointer",
            transform: `scale(${scale})`,
            display: "block",
          }}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
};

export const MigrationForm: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // PHASE 1: Card entrance
  const cardEntrance = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 140, mass: 1 },
    durationInFrames: 30,
  });
  const cardY = interpolate(cardEntrance, [0, 1], [80, 0]);
  const cardOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const PRESS_FRAME = 220;
  const FORM_EXIT_START = 240;
  const THANKYOU_START = 248;

  const formExitY = interpolate(
    frame,
    [FORM_EXIT_START, FORM_EXIT_START + 15],
    [0, 60],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const formExitOpacity = interpolate(
    frame,
    [FORM_EXIT_START, FORM_EXIT_START + 15],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const showForm = frame < FORM_EXIT_START + 15;
  const showThankYou = frame >= THANKYOU_START;

  return (
    // Solid dark green background
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#1A3828",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 60,
        paddingLeft: 28,
        paddingRight: 28,
        boxSizing: "border-box",
        fontFamily: "'Plus Jakarta Sans', 'SF Pro Display', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* Form Card */}
      {showForm && (
        <div
          style={{
            transform: `translateY(${frame < FORM_EXIT_START ? cardY : formExitY}px)`,
            opacity: frame < FORM_EXIT_START ? cardOpacity : formExitOpacity,
            width: "100%",
            maxWidth: 680,
          }}
        >
          <GlassCard>
            {/* Form Fields */}
            {FIELDS.map((field) => (
              <FormField
                key={field.label}
                label={field.label}
                value={field.value}
                required={field.required}
                type={field.type}
                fillStartFrame={field.start}
                fillEndFrame={field.end}
                isUpload={field.isUpload}
              />
            ))}

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.08)",
                margin: "16px 0 14px",
              }}
            />

            {/* PREV / NEXT Buttons */}
            <ActionButtons pressStart={PRESS_FRAME} />
          </GlassCard>
        </div>
      )}

      {/* Thank You Card */}
      {showThankYou && (
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 28,
            right: 28,
            maxWidth: 680,
            margin: "0 auto",
            width: "calc(100% - 56px)",
          }}
        >
          <ThankYouCard startFrame={THANKYOU_START} />
        </div>
      )}
    </div>
  );
};
