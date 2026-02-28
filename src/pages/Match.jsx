import React, { useState, useRef } from 'react';
import { useMockData } from '../components/data/MockDataContext';
import { Button } from '@/components/ui/button';
import { Heart, ChevronLeft } from 'lucide-react';
import BookCover from '../components/shared/BookCover';

function HorizontalBookCarousel({ books }) {
  const ref = useRef(null);
  if (books.length === 0) return (
    <p style={{ fontSize:11, color:'var(--text-muted)', textAlign:'center', padding:'8px 0' }}>Nenhum livro</p>
  );
  return (
    <div
      ref={ref}
      className="flex gap-2.5 overflow-x-auto scroll-hide pb-1"
    >
      {books.map(book => (
        <div key={book.id} className="flex-shrink-0" style={{ width:76 }}>
          <div className="w-full rounded-xl overflow-hidden shadow-md" style={{ aspectRatio:'2/3' }}>
            <BookCover src={book.cover_url} title={book.title} className="rounded-xl" />
          </div>
          <p className="mt-1 text-center leading-tight line-clamp-2"
            style={{ fontSize:8, color:'var(--text-muted)', fontWeight:500 }}>
            {book.title}
          </p>
        </div>
      ))}
    </div>
  );
}

function MatchResult({ me, friend, myBooks, friendBooks, onBack }) {
  const myRead      = myBooks.filter(b => b.status === 'lido');
  const friendRead  = friendBooks.filter(b => b.status === 'lido');
  const myTitles    = new Set(myRead.map(b => b.title));
  const frTitles    = new Set(friendRead.map(b => b.title));
  const commonTitles = [...myTitles].filter(t => frTitles.has(t));
  const allUnique   = new Set([...myTitles, ...frTitles]);
  const compatibility = allUnique.size > 0 ? Math.round((commonTitles.length / allUnique.size) * 100) : 0;

  const commonBooks  = myRead.filter(b => commonTitles.includes(b.title));
  const myFavTitles  = new Set(myBooks.filter(b => b.rating >= 4).map(b => b.title));
  const frFavTitles  = new Set(friendBooks.filter(b => b.rating >= 4).map(b => b.title));
  const commonFavT   = [...myFavTitles].filter(t => frFavTitles.has(t));
  const commonFavs   = myBooks.filter(b => commonFavT.includes(b.title));

  return (
    <div className="space-y-5">
      <Button variant="ghost" size="sm" className="gap-1 -ml-1 rounded-xl h-8" onClick={onBack}>
        <ChevronLeft size={14} /> Voltar
      </Button>

      {/* Compatibility card */}
      <div className="rounded-2xl p-5 text-center" style={{ background:'var(--bg-card)' }}>
        <div className="flex items-center justify-center gap-5 mb-4">
          <div className="flex flex-col items-center gap-1.5">
            <img src={me.avatar} alt="" className="w-14 h-14 rounded-full object-cover"
              style={{ border:'2.5px solid var(--accent)' }} />
            <span style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600 }}>{me.name.split(' ')[0]}</span>
          </div>
          <Heart size={28} fill="var(--accent)" style={{ color:'var(--accent)', flexShrink:0 }} />
          <div className="flex flex-col items-center gap-1.5">
            <img src={friend.avatar} alt="" className="w-14 h-14 rounded-full object-cover"
              style={{ border:'2.5px solid var(--accent)' }} />
            <span style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600 }}>{friend.name.split(' ')[0]}</span>
          </div>
        </div>

        <div className="text-5xl font-bold mb-1" style={{ color:'var(--accent)' }}>
          {compatibility}%
        </div>
        <p style={{ fontSize:11, color:'var(--text-muted)' }}>compatibilidade literária</p>
        <p style={{ fontSize:10, color:'var(--text-muted)', marginTop:4 }}>
          {commonTitles.length} lidos em comum · {commonFavT.length} favoritos em comum
        </p>
      </div>

      {/* Common favs */}
      {commonFavs.length > 0 && (
        <div>
          <h3 className="text-xs font-bold mb-2" style={{ color:'var(--text-header)' }}>
            Favoritos em Comum
          </h3>
          <HorizontalBookCarousel books={commonFavs} />
        </div>
      )}

      {/* Common reads */}
      {commonBooks.length > 0 && (
        <div>
          <h3 className="text-xs font-bold mb-2" style={{ color:'var(--text-header)' }}>
            Lidos em Comum
          </h3>
          <HorizontalBookCarousel books={commonBooks} />
        </div>
      )}

      <Button variant="outline" className="w-full rounded-xl h-10 font-medium" onClick={onBack}>
        Comparar com outro amigo
      </Button>
    </div>
  );
}

export default function Match() {
  const { currentUser, getFriends, getUserBooks } = useMockData();
  const [selected, setSelected] = useState(null);
  const friends = getFriends();

  if (selected) {
    return (
      <div className="pb-4">
        <MatchResult
          me={currentUser}
          friend={selected}
          myBooks={getUserBooks(currentUser.id)}
          friendBooks={getUserBooks(selected.id)}
          onBack={() => setSelected(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <div className="pt-1">
        <h1 className="text-2xl font-bold" style={{ color:'var(--text-header)' }}>Match Literário</h1>
        <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>
          Selecione um amigo para ver a compatibilidade
        </p>
      </div>

      {friends.map(friend => (
        <button
          key={friend.id}
          className="w-full rounded-2xl p-4 flex items-center gap-3 text-left transition-all hover:shadow-md"
          style={{ background:'var(--bg-card)', border:'none', cursor:'pointer' }}
          onClick={() => setSelected(friend)}
        >
          <img src={friend.avatar} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-sm" style={{ color:'var(--text-header)' }}>{friend.name}</h3>
            <p style={{ fontSize:10, color:'var(--text-muted)' }}>{friend.nick}</p>
          </div>
          <Heart size={18} style={{ color:'var(--accent)', flexShrink:0 }} />
        </button>
      ))}
    </div>
  );
}