import React from "react";

export default function ProgressBar({
  percent,
  value, // ✅ compat: alguns lugares podem usar value
  height = 6,
  color = "var(--accent-hex)",
  bg = "rgba(193,59,117,0.12)",
}) {
  const raw = percent ?? value ?? 0;
  const num = Number(raw);
  const safe = Number.isFinite(num) ? num : 0;
  const clamped = Math.min(100, Math.max(0, safe));

  return (
    <div
      style={{
        width: "100%",
        height,
        borderRadius: 999,
        background: bg,
        overflow: "hidden",
      }}
      aria-label="Progresso"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clamped}
      role="progressbar"
    >
      <div
        style={{
          width: `${clamped}%`,
          height: "100%",
          background: color,
          borderRadius: 999,
          transition: "width 0.4s ease",
        }}
      />
    </div>
  );
}
