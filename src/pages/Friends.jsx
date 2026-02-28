import React, { useState } from 'react';
import { useMockData } from '../components/data/MockDataContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, BookOpen, Trophy, Flame, Heart, BookMarked } from 'lucide-react';
import BookCover from '../components/shared/BookCover';

function FriendProfile({ friend, onBack, getUserBooks, marathons, currentUser }) {
  const friendBooks = getUserBooks(friend.id);
  const myBooks     = getUserBooks(currentUser.id);
  const lendo  = friendBooks.filter(b => b.status === 'lendo');
  const lidos  = friendBooks.filter(b => b.status === 'lido');

  const friendMarathons = marathons.filter(m => m.participants.some(p => p.user_id === friend.id));
  const trophies = friendMarathons.reduce((s, m) => {
    const p = m.participants.find(p => p.user_id === friend.id);
    return s + (p?.trophies || 0);
  }, 0);

  // Compatibility calc
  const myTitles = new Set(myBooks.filter(b => b.status === 'lido').map(b => b.title));
  const frTitles = new Set(friendBooks.filter(b => b.status === 'lido').map(b => b.title));
  const common   = [...myTitles].filter(t => frTitles.has(t));
  const allU     = new Set([...myTitles, ...frTitles]);
  const compat   = allU.size > 0 ? Math.round((common.length / allU.size) * 100) : 0;

  return (
    <div className="space-y-5 pb-4">
      <Button variant="ghost" size="sm" className="-ml-1 gap-1 rounded-xl h-8" onClick={onBack}>
        <ChevronLeft size={14} /> Voltar
      </Button>

      {/* Profile header */}
      <div className="rounded-2xl p-5 text-center" style={{ background:'var(--bg-card)' }}>
        <img
          src={friend.avatar} alt=""
          className="w-16 h-16 rounded-full mx-auto object-cover"
          style={{ border:'2.5px solid var(--accent-hex)' }}
        />
        <h2 className="font-bold text-base mt-2.5" style={{ color:'var(--text-header)' }}>{friend.name}</h2>
        <p style={{ fontSize:11, color:'var(--text-muted)' }}>{friend.nick}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { icon:Heart,      label:'Compatibilidade', val:`${compat}%` },
          { icon:BookMarked, label:'Lendo agora',      val:lendo.length },
          { icon:BookOpen,   label:'Total lidos',      val:lidos.length },
          { icon:Flame,      label:'Maratonas',        val:friendMarathons.length },
          { icon:Trophy,     label:'Troféus',          val:trophies },
        ].map(({ icon:Icon, label, val }) => (
          <div key={label} className="rounded-2xl p-3.5 flex items-center gap-2.5" style={{ background:'var(--bg-card)' }}>
            <Icon size={16} style={{ color:'var(--accent-hex)', flexShrink:0 }} />
            <div className="min-w-0">
              <p className="font-bold text-sm leading-none" style={{ color:'var(--text-header)' }}>{val}</p>
              <p style={{ fontSize:9, color:'var(--text-muted)', marginTop:2 }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Currently reading */}
      {lendo.length > 0 && (
        <div>
          <h3 className="text-xs font-bold mb-2.5" style={{ color:'var(--text-header)' }}>Lendo Agora</h3>
          <div className="flex gap-2.5 flex-wrap">
            {lendo.map(book => (
              <div key={book.id} className="rounded-xl overflow-hidden shadow-md" style={{ width:60 }}>
                <BookCover src={book.cover_url} title={book.title} className="rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Friends() {
  const { getFriends, getUserBooks, marathons, currentUser } = useMockData();
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState(null);
  const friends = getFriends();

  const filtered = friends.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.nick.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    return (
      <FriendProfile
        friend={selected}
        onBack={() => setSelected(null)}
        getUserBooks={getUserBooks}
        marathons={marathons}
        currentUser={currentUser}
      />
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <div className="pt-1">
        <h1 className="text-2xl font-bold" style={{ color:'var(--text-header)' }}>Amigos</h1>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:'var(--text-muted)' }} />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por nome ou nick..."
          className="rounded-xl border-0 h-10 pl-9"
          style={{ background:'var(--bg-card)' }}
        />
      </div>

      {/* Friends list */}
      <div className="space-y-2.5">
        {filtered.map(friend => (
          <button
            key={friend.id}
            className="w-full rounded-2xl p-3.5 flex items-center gap-3 text-left transition-all hover:shadow-md"
            style={{ background:'var(--bg-card)', border:'none', cursor:'pointer' }}
            onClick={() => setSelected(friend)}
          >
            <img src={friend.avatar} alt="" className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-sm" style={{ color:'var(--text-header)' }}>{friend.name}</p>
              <p style={{ fontSize:10, color:'var(--text-muted)' }}>{friend.nick}</p>
            </div>
          </button>
        ))}
        {filtered.length === 0 && (
          <p style={{ fontSize:12, color:'var(--text-muted)', textAlign:'center', padding:'20px 0' }}>
            Nenhum amigo encontrado.
          </p>
        )}
      </div>
    </div>
  );
}