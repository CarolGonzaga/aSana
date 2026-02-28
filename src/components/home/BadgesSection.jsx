import React from 'react';

export default function BadgesSection({ badges }) {
  return (
    <div>
      <h2 className="text-sm font-bold mb-3" style={{ color:'var(--text-header)' }}>
        Badges Conquistadas <span style={{ color:'var(--accent-hex)' }}>({badges.length}/50)</span>
      </h2>
      <div className="grid grid-cols-5 gap-2">
        {badges.map(b => (
          <div
            key={b.id}
            className="rounded-2xl flex flex-col items-center justify-center gap-1 group relative"
            style={{ background:'var(--bg-card)', padding:'10px 6px', aspectRatio:'1/1' }}
          >
            {/* Roman numeral symbol as a visual badge */}
            <div
              className="font-bold flex items-center justify-center rounded-full"
              style={{
                width:30, height:30,
                background:'linear-gradient(135deg, var(--accent-hex) 0%, var(--accent-deep) 100%)',
                color:'#fff', fontSize:10, letterSpacing:1,
              }}
            >
              {b.symbol}
            </div>
            <span
              className="text-center leading-tight font-medium"
              style={{ fontSize:8, color:'var(--text-muted)' }}
            >
              {b.name}
            </span>

            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-2 py-1 rounded-lg text-white"
              style={{ fontSize:9, background:'rgba(27,15,24,0.88)' }}>
              {b.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}