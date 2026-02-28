import React, { useState } from 'react';
import { useMockData } from '../components/data/MockDataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Trophy, Flame, CheckCircle2, Plus, CalendarDays, Trash2, Crown } from 'lucide-react';
import BookCover from '../components/shared/BookCover';
import ProgressBar from '../components/shared/ProgressBar';

// ── Helpers ──────────────────────────────────────────────────
function calcMarathonProgress(marathon, books) {
  const totalRead = marathon.participants.reduce((sum, p) =>
    sum + p.books.reduce((s, bid) => {
      const b = books.find(bk => bk.id === bid);
      return s + (b?.pages_read || 0);
    }, 0)
  , 0);
  return {
    totalRead,
    percent: Math.min(100, Math.round((totalRead / marathon.total_pages_goal) * 100)),
  };
}

function calcParticipantProgress(participant, books, goal) {
  const read = participant.books.reduce((s, bid) => {
    const b = books.find(bk => bk.id === bid);
    return s + (b?.pages_read || 0);
  }, 0);
  return { read, percent: Math.min(100, Math.round((read / goal) * 100)) };
}

function daysLeft(deadline) {
  return Math.max(0, Math.ceil((new Date(deadline) - new Date()) / 86400000));
}

// ── MarathonSummaryCard ───────────────────────────────────────
function MarathonSummaryCard({ marathon, books, users, onOpen }) {
  const { percent } = calcMarathonProgress(marathon, books);
  const isFinished  = marathon.status === 'finished';
  const leader = marathon.participants.reduce((best, p) => {
    const { percent: pp } = calcParticipantProgress(p, books, marathon.total_pages_goal);
    return pp > (best?.pp || -1) ? { ...p, pp } : best;
  }, null);
  const leaderUser = leader ? users.find(u => u.id === leader.user_id) : null;

  return (
    <div
      className="rounded-2xl p-4 cursor-pointer transition-all hover:shadow-md"
      style={{ background:'var(--bg-card)' }}
      onClick={() => onOpen(marathon)}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-bold text-sm leading-tight" style={{ color:'var(--text-header)' }}>
          {marathon.name}
        </h3>
        <span
          className="flex-shrink-0 font-bold text-white"
          style={{
            fontSize:9, padding:'3px 8px', borderRadius:99,
            background: isFinished ? '#3d9a6a' : 'var(--accent)',
          }}
        >
          {isFinished ? 'Finalizada' : 'Ativa'}
        </span>
      </div>

      {/* Participants + leader */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex -space-x-2">
          {marathon.participants.map(p => {
            const u = users.find(u => u.id === p.user_id);
            return u ? (
              <img key={p.user_id} src={u.avatar} alt={u.name}
                className="w-7 h-7 rounded-full object-cover border-2"
                style={{ borderColor:'var(--bg-main)' }}
              />
            ) : null;
          })}
        </div>
        {leaderUser && !isFinished && (
          <div className="flex items-center gap-1 ml-1">
            <Crown size={11} style={{ color:'#f59e0b' }} />
            <span style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600 }}>
              {leaderUser.name.split(' ')[0]}
            </span>
          </div>
        )}
      </div>

      <ProgressBar
        percent={percent}
        height={6}
        color={isFinished ? '#3d9a6a' : 'var(--accent)'}
      />
      <div className="flex items-center justify-between mt-1.5">
        <span style={{ fontSize:10, color:'var(--text-muted)' }}>
          {isFinished ? 'Concluída' : `${daysLeft(marathon.deadline)} dias restantes`}
        </span>
        <span style={{ fontSize:11, fontWeight:700, color: isFinished ? '#3d9a6a' : 'var(--accent)' }}>
          {percent}%
        </span>
      </div>
    </div>
  );
}

// ── MarathonDetail ────────────────────────────────────────────
function MarathonDetail({ marathon, books, users, currentUser, onFinish, onRemoveBook, onClose }) {
  const { totalRead, percent } = calcMarathonProgress(marathon, books);
  const days = daysLeft(marathon.deadline);
  const isFinished = marathon.status === 'finished';

  const handleManualFinish = () => {
    if (!isFinished) onFinish(marathon.id, currentUser.id);
  };

  return (
    <div className="space-y-5">
      {/* Title + status */}
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-bold text-lg leading-tight" style={{ color:'var(--text-header)' }}>
          {marathon.name}
        </h2>
        <span
          className="font-bold text-white flex-shrink-0"
          style={{
            fontSize:9, padding:'3px 8px', borderRadius:99,
            background: isFinished ? '#3d9a6a' : 'var(--accent)',
          }}
        >
          {isFinished ? 'Finalizada' : 'Ativa'}
        </span>
      </div>

      {/* Participant avatars */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {marathon.participants.map(p => {
            const u = users.find(u => u.id === p.user_id);
            return u ? (
              <img key={p.user_id} src={u.avatar} alt=""
                className="w-9 h-9 rounded-full object-cover border-2"
                style={{ borderColor:'var(--bg-card)' }}
              />
            ) : null;
          })}
        </div>
        <div className="text-xs" style={{ color:'var(--text-muted)' }}>
          {marathon.participants.length} participantes
        </div>
      </div>

      {/* Overall progress card */}
      <div className="rounded-xl p-3.5 space-y-2.5" style={{ background:'var(--bg-main)' }}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold" style={{ color:'var(--text-header)' }}>Progresso Geral</span>
          <span className="text-sm font-bold" style={{ color: isFinished ? '#3d9a6a' : 'var(--accent)' }}>
            {percent}%
          </span>
        </div>
        <ProgressBar
          percent={percent}
          height={8}
          color={isFinished ? '#3d9a6a' : 'var(--accent)'}
        />
        <div className="flex items-center justify-between" style={{ fontSize:10, color:'var(--text-muted)' }}>
          <span>{totalRead} / {marathon.total_pages_goal} páginas</span>
          <span className="flex items-center gap-1">
            <CalendarDays size={10} />
            {isFinished ? 'Encerrada' : `${days} dias restantes`}
          </span>
        </div>
      </div>

      {/* Winner banner */}
      {marathon.winner && (
        <div
          className="rounded-xl p-3 flex items-center gap-2.5"
          style={{ background:'rgba(61,154,106,0.1)', border:'1px solid rgba(61,154,106,0.2)' }}
        >
          <Trophy size={18} className="text-yellow-500 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold" style={{ color:'#3d9a6a' }}>
              {users.find(u => u.id === marathon.winner)?.name} venceu!
            </p>
            <p style={{ fontSize:9, color:'var(--text-muted)' }}>Troféu adicionado ao perfil</p>
          </div>
        </div>
      )}

      {/* Per-participant sections */}
      {marathon.participants.map(p => {
        const user = users.find(u => u.id === p.user_id);
        const { read, percent: pp } = calcParticipantProgress(p, books, marathon.total_pages_goal);
        const pBooks = p.books.map(bid => books.find(b => b.id === bid)).filter(Boolean);

        return (
          <div key={p.user_id} className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <img src={user?.avatar} alt="" className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold truncate" style={{ color:'var(--text-header)' }}>
                    {user?.name}
                  </span>
                  <span style={{ fontSize:10, color:'var(--accent)', fontWeight:700, flexShrink:0 }}>
                    {pp}%
                  </span>
                </div>
                <ProgressBar percent={pp} height={4} />
              </div>
              <div className="flex items-center gap-0.5 flex-shrink-0">
                <Trophy size={10} style={{ color:'#f59e0b' }} />
                <span style={{ fontSize:9, color:'var(--text-muted)', fontWeight:600 }}>{p.trophies}</span>
              </div>
            </div>

            {/* Books in marathon */}
            {pBooks.length > 0 && (
              <div className="flex gap-2 flex-wrap pl-9">
                {pBooks.map(book => (
                  <div key={book.id} className="relative group">
                    <div
                      className="rounded-lg overflow-hidden shadow-sm"
                      style={{ width:48 }}
                    >
                      <BookCover src={book.cover_url} title={book.title} className="rounded-lg" />
                    </div>
                    {!isFinished && (
                      <button
                        className="absolute -top-1.5 -right-1.5 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ width:16, height:16, background:'#ef4444' }}
                        onClick={() => onRemoveBook(marathon.id, book.id)}
                      >
                        <Trash2 size={8} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Manual finish button */}
      {!isFinished && (
        <Button
          className="w-full rounded-xl h-10 font-bold text-white mt-2"
          style={{ background:'var(--accent)' }}
          onClick={handleManualFinish}
        >
          Declarar minha vitória
        </Button>
      )}

      <Button variant="outline" className="w-full rounded-xl h-10" onClick={onClose}>
        Fechar
      </Button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function Marathons() {
  const { marathons, books, users, currentUser, createMarathon, finishMarathon, removeBookFromMarathon } = useMockData();

  const [selected,    setSelected]    = useState(null);
  const [showCreate,  setShowCreate]  = useState(false);
  const [newName,     setNewName]     = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newGoal,     setNewGoal]     = useState('');

  const active   = marathons.filter(m => m.status === 'active');
  const finished = marathons.filter(m => m.status === 'finished');
  const myTrophies = marathons.reduce((s, m) => {
    const p = m.participants.find(p => p.user_id === currentUser.id);
    return s + (p?.trophies || 0);
  }, 0);

  const handleCreate = () => {
    if (newName.trim() && newDeadline && Number(newGoal) > 0) {
      createMarathon({ name: newName.trim(), deadline: newDeadline, total_pages_goal: Number(newGoal) });
      setNewName(''); setNewDeadline(''); setNewGoal('');
      setShowCreate(false);
    }
  };

  // Sync selected with live marathon state
  const liveSelected = selected ? marathons.find(m => m.id === selected.id) || null : null;

  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-2xl font-bold" style={{ color:'var(--text-header)' }}>Maratonas</h1>
        <Button
          size="sm"
          className="rounded-xl gap-1.5 font-bold text-white"
          style={{ background:'var(--accent)' }}
          onClick={() => setShowCreate(true)}
        >
          <Plus size={14} /> Nova
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { icon:Flame,       label:'Total',      val: marathons.length },
          { icon:Flame,       label:'Ativas',     val: active.length },
          { icon:CheckCircle2,label:'Finalizadas',val: finished.length },
          { icon:Trophy,      label:'Troféus',    val: myTrophies },
        ].map(({ icon:Icon, label, val }) => (
          <div key={label} className="rounded-2xl p-2.5 flex flex-col items-center gap-1" style={{ background:'var(--bg-card)' }}>
            <Icon size={15} style={{ color:'var(--accent)' }} />
            <span className="text-lg font-bold leading-none" style={{ color:'var(--text-header)' }}>{val}</span>
            <span className="text-center font-medium" style={{ fontSize:8, color:'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>

      {active.length > 0 && (
        <div>
          <h2 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color:'var(--text-muted)' }}>Ativas</h2>
          <div className="space-y-2.5">
            {active.map(m => (
              <MarathonSummaryCard key={m.id} marathon={m} books={books} users={users} onOpen={setSelected} />
            ))}
          </div>
        </div>
      )}

      {finished.length > 0 && (
        <div>
          <h2 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color:'var(--text-muted)' }}>Finalizadas</h2>
          <div className="space-y-2.5">
            {finished.map(m => (
              <MarathonSummaryCard key={m.id} marathon={m} books={books} users={users} onOpen={setSelected} />
            ))}
          </div>
        </div>
      )}

      {/* Marathon detail dialog */}
      <Dialog open={!!liveSelected} onOpenChange={() => setSelected(null)}>
        <DialogContent
          className="rounded-2xl border-0 shadow-xl w-[calc(100vw-32px)] max-w-sm overflow-y-auto"
          style={{ background:'var(--bg-card)', maxHeight:'88vh' }}
        >
          {liveSelected && (
            <MarathonDetail
              marathon={liveSelected}
              books={books}
              users={users}
              currentUser={currentUser}
              onFinish={finishMarathon}
              onRemoveBook={removeBookFromMarathon}
              onClose={() => setSelected(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="rounded-2xl border-0 w-[calc(100vw-32px)] max-w-sm" style={{ background:'var(--bg-card)' }}>
          <DialogHeader>
            <DialogTitle className="font-bold" style={{ color:'var(--text-header)' }}>Nova Maratona</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={newName} onChange={e => setNewName(e.target.value)}
              placeholder="Nome da maratona"
              className="rounded-xl border-0 h-10" style={{ background:'var(--bg-main)' }}
            />
            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color:'var(--text-muted)' }}>Data limite</label>
              <Input
                type="date" value={newDeadline} onChange={e => setNewDeadline(e.target.value)}
                className="rounded-xl border-0 h-10" style={{ background:'var(--bg-main)' }}
              />
            </div>
            <Input
              type="number" value={newGoal} onChange={e => setNewGoal(e.target.value)}
              placeholder="Meta de páginas"
              className="rounded-xl border-0 h-10" style={{ background:'var(--bg-main)' }}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowCreate(false)} className="rounded-xl">Cancelar</Button>
            <Button onClick={handleCreate} className="rounded-xl font-bold text-white" style={{ background:'var(--accent)' }}>
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}