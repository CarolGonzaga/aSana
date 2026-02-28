import React from 'react';
import { useMockData } from '../components/data/MockDataContext';
import { BookOpen, BookCheck, Star, Trophy, Flame, CalendarDays } from 'lucide-react';
import BookCover from '../components/shared/BookCover';

export default function Profile() {
  const { currentUser, getStats, getUserBooks, marathons, badges } = useMockData();
  const stats  = getStats();
  const books  = getUserBooks(currentUser.id);
  const favs   = books.filter(b => b.rating >= 4).sort((a, b) => b.rating - a.rating).slice(0, 6);

  return (
    <div className="space-y-6 pb-4">
      {/* Header card */}
      <div className="rounded-2xl p-6 text-center pt-1" style={{ background:'var(--bg-card)' }}>
        <img
          src={currentUser.avatar} alt={currentUser.name}
          className="w-20 h-20 rounded-full mx-auto object-cover glow-accent"
          style={{ border:'3px solid var(--accent)' }}
        />
        <h1 className="font-bold text-lg mt-3" style={{ color:'var(--text-header)' }}>{currentUser.name}</h1>
        <p style={{ fontSize:11, color:'var(--text-muted)' }}>{currentUser.nick}</p>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-sm font-bold mb-3" style={{ color:'var(--text-header)' }}>Estatísticas</h2>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon:BookOpen,    label:'Páginas',      val:stats.totalPages },
            { icon:BookCheck,   label:'Lidos',        val:stats.totalLidos },
            { icon:Flame,       label:'Pág/dia',      val:stats.ritmoPagDia },
            { icon:Star,        label:'Avaliação',    val:stats.avgRating },
            { icon:Trophy,      label:'Troféus',      val:stats.totalTrofeus },
            { icon:CalendarDays,label:'Maratonas',    val:stats.totalMaratonas },
          ].map(({ icon:Icon, label, val }) => (
            <div key={label} className="rounded-2xl p-3 flex flex-col items-center gap-1" style={{ background:'var(--bg-card)' }}>
              <Icon size={15} style={{ color:'var(--accent)' }} />
              <span className="text-xl font-bold leading-none" style={{ color:'var(--text-header)' }}>{val}</span>
              <span className="font-medium text-center" style={{ fontSize:9, color:'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges preview */}
      {badges.length > 0 && (
        <div>
          <h2 className="text-sm font-bold mb-3" style={{ color:'var(--text-header)' }}>
            Badges <span style={{ color:'var(--accent)' }}>({badges.length})</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {badges.map(b => (
              <div
                key={b.id}
                className="rounded-xl px-2.5 py-1.5 flex items-center gap-1.5"
                style={{ background:'var(--bg-card)', border:'1px solid var(--border)' }}
              >
                <span
                  className="rounded-full flex items-center justify-center font-bold text-white"
                  style={{
                    width:18, height:18, fontSize:7,
                    background:'linear-gradient(135deg, var(--accent) 0%, var(--accent-deep) 100%)',
                  }}
                >
                  {b.symbol}
                </span>
                <span style={{ fontSize:10, fontWeight:600, color:'var(--text-main)' }}>{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorites */}
      {favs.length > 0 && (
        <div>
          <h2 className="text-sm font-bold mb-3" style={{ color:'var(--text-header)' }}>Livros Favoritos</h2>
          <div className="flex flex-wrap gap-3">
            {favs.map(book => (
              <div key={book.id} className="flex flex-col items-center" style={{ width:68 }}>
                <div className="w-full rounded-xl overflow-hidden shadow-md" style={{ aspectRatio:'2/3' }}>
                  <BookCover src={book.cover_url} title={book.title} className="rounded-xl" />
                </div>
                <div className="flex gap-px mt-1">
                  {Array.from({ length:5 }).map((_,i) => (
                    <span key={i} style={{ fontSize:8, color: i < book.rating ? '#C13B75' : '#EADDE3' }}>★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}