import React from 'react';
import { BookOpen, BookCheck, BookMarked, Flame, CalendarDays, Star, Trophy, Swords, Bookmark } from 'lucide-react';

const ITEMS = [
  { key:'totalPages',    label:'Páginas',         icon:BookOpen },
  { key:'totalLidos',    label:'Lidos',            icon:BookCheck },
  { key:'totalLendo',    label:'Lendo',            icon:BookMarked },
  { key:'totalQueroLer', label:'Quero ler',        icon:Bookmark },
  { key:'ritmoPagDia',   label:'Pág/dia',          icon:Flame },
  { key:'diasSeguidos',  label:'Dias seguidos',    icon:CalendarDays },
  { key:'avgRating',     label:'Avaliação média',  icon:Star },
  { key:'totalMaratonas',label:'Maratonas',        icon:Swords },
  { key:'totalTrofeus',  label:'Troféus',          icon:Trophy },
];

export default function StatsGrid({ stats }) {
  return (
    <div>
      <h2 className="text-sm font-bold mb-3" style={{ color:'var(--text-header)' }}>Seu Ano em Números</h2>
      <div className="grid grid-cols-3 gap-2">
        {ITEMS.map(({ key, label, icon:Icon }) => (
          <div
            key={key}
            className="rounded-2xl p-3 flex flex-col items-center gap-1"
            style={{ background:'var(--bg-card)' }}
          >
            <Icon size={16} style={{ color:'var(--accent)' }} />
            <span className="text-xl font-bold leading-none" style={{ color:'var(--text-header)' }}>
              {stats[key]}
            </span>
            <span className="text-center leading-tight font-medium" style={{ fontSize:9, color:'var(--text-muted)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}