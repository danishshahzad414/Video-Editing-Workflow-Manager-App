import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { TypewriterText } from "./TypewriterText";

interface FormFieldProps {
  label: string;
  value: string;
  required?: boolean;
  type?: "dropdown" | "text" | "upload";
  fillStartFrame: number;
  fillEndFrame: number;
  isUpload?: boolean;
}

const ChevronIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <path
      d="M4 6L8 10L12 6"
      stroke="rgba(255,255,255,0.7)"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UploadIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"
      stroke={filled ? "#22c55e" : "rgba(255,255,255,0.5)"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="17 8 12 3 7 8"
      stroke={filled ? "#22c55e" : "rgba(255,255,255,0.5)"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="12" y1="3" x2="12" y2="15"
      stroke={filled ? "#22c55e" : "rgba(255,255,255,0.5)"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  required = false,
  type = "dropdown",
  fillStartFrame,
  fillEndFrame,
  isUpload = false,
}) => {
  const frame = useCurrentFrame();

  // Focus flash: highlight border briefly when field fills
  const focusProgress = interpolate(
    frame,
    [fillStartFrame - 3, fillStartFrame + 5, fillStartFrame + 18],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const borderColor =
    focusProgress > 0.05
      ? `rgba(255,255,255,${0.08 + focusProgress * 0.35})`
      : "transparent";

  const valueOpacity =
    type === "dropdown" || isUpload
      ? interpolate(frame, [fillStartFrame, fillStartFrame + 10], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const isFilled = frame >= fillStartFrame;

  return (
    <div style={{ marginBottom: 12 }}>
      {/* Label */}
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#ffffff",
          marginBottom: 5,
          fontFamily: "'Plus Jakarta Sans', 'SF Pro Display', sans-serif",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "#ff4444", marginLeft: 3, fontWeight: 700 }}>*</span>
        )}
      </div>

      {/* Field box */}
      <div
        style={{
          background: "#162E22",
          border: `1px solid ${borderColor}`,
          borderRadius: 10,
          padding: "11px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 44,
        }}
      >
        {isUpload ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
            <UploadIcon filled={isFilled} />
            <span
              style={{
                fontSize: 13,
                color: isFilled ? "#22c55e" : "rgba(255,255,255,0.4)",
                fontFamily: "'Plus Jakarta Sans', 'SF Pro Display', sans-serif",
                fontWeight: isFilled ? 600 : 400,
                opacity: isFilled ? valueOpacity : 1,
                flex: 1,
              }}
            >
              {isFilled ? value : "Upload your CV (PDF, DOC)"}
            </span>
          </div>
        ) : (
          <>
            <span
              style={{
                fontSize: 13,
                color: isFilled ? "#ffffff" : "rgba(255,255,255,0.25)",
                fontFamily: "'Plus Jakarta Sans', 'SF Pro Display', sans-serif",
                opacity: type === "dropdown" ? valueOpacity : 1,
                flex: 1,
              }}
            >
              {isFilled ? (
                type === "text" ? (
                  <TypewriterText
                    text={value}
                    startFrame={fillStartFrame}
                    endFrame={fillEndFrame}
                  />
                ) : (
                  value
                )
              ) : (
                "Select an option"
              )}
            </span>
            {type === "dropdown" && <ChevronIcon />}
          </>
        )}
      </div>
    </div>
  );
};
