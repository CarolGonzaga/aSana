import React from 'react';

export default function ProgressBar({ percent, height = 6, color = 'var(--accent-hex)', bg = 'rgba(193,59,117,0.12)' }) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div style={{ width: '100%', height, borderRadius: 99, background: bg, overflow: 'hidden' }}>
      <div
        style={{
          width: `${clamped}%`,
          height: '100%',
          background: color,
          borderRadius: 99,
          transition: 'width 0.4s ease',
        }}
      />
    </div>
  );
}