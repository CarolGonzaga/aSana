import React from 'react';

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
const DATA    = [2, 3, 2, 0, 1, 1, 0, 0, 0, 0, 0, 0];
const MAX     = Math.max(...DATA, 1);

export default function MonthlyChart() {
  return (
    <div>
      <h2 className="text-sm font-bold mb-3" style={{ color:'var(--text-header)' }}>Lidos por Mês</h2>
      <div className="rounded-2xl p-4" style={{ background:'var(--bg-card)' }}>
        <div
          className="w-full overflow-hidden"
          style={{ display:'flex', alignItems:'flex-end', gap:4, height:130 }}
        >
          {DATA.map((val, i) => {
            const barH = MAX > 0 ? Math.round((val / MAX) * 90) : 0;
            const isActive = val > 0;
            return (
              <div
                key={i}
                className="flex flex-col items-center"
                style={{ flex:1, minWidth:0 }}
              >
                {/* Value label */}
                <span
                  style={{
                    fontSize:9,
                    fontWeight:700,
                    color: isActive ? 'var(--accent)' : 'transparent',
                    marginBottom:3,
                    userSelect:'none',
                  }}
                >
                  {val}
                </span>
                {/* Bar */}
                <div
                  style={{
                    width:'100%',
                    maxWidth:22,
                    height: barH || 4,
                    borderRadius:'6px 6px 3px 3px',
                    background: isActive
                      ? 'linear-gradient(180deg, var(--accent) 0%, var(--accent-deep) 100%)'
                      : 'rgba(193,59,117,0.12)',
                    transition:'height 0.3s ease',
                  }}
                />
                {/* Month label */}
                <span
                  style={{ fontSize:8, color:'var(--text-muted)', marginTop:4, fontWeight:500 }}
                >
                  {MONTHS[i]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}