import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => {
  return (
    <div
      style={{
        background: "#1E3D2C",
        borderRadius: 20,
        padding: "28px 24px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
