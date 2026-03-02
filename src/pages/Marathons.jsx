import React, { useEffect, useMemo, useState } from "react";
import { useMockData } from "@/components/data/MockDataContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Plus,
  Flag,
  Trophy,
  Users,
  CalendarDays,
  Trash2,
  Crown,
  BookPlus,
} from "lucide-react";

import BookCover from "@/components/shared/BookCover";
import ProgressBar from "@/components/shared/ProgressBar";

// ───────────────────────────────────────────────────────────────
// Helpers
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function daysLeft(deadline) {
  try {
    return Math.max(0, Math.ceil((new Date(deadline) - new Date()) / 86400000));
  } catch {
    return 0;
  }
}

function fmtDateBR(iso) {
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yy = d.getFullYear();
    return `${dd}/${mm}/${yy}`;
  } catch {
    return iso;
  }
}

function getUser(users, userId) {
  return users.find((u) => u.id === userId);
}

function getBook(books, bookId) {
  return books.find((b) => b.id === bookId);
}

// Normaliza cover (seu mock usa cover_url)
function getCoverFromBook(book) {
  return (
    book?.cover_url ||
    book?.coverUrl ||
    book?.cover ||
    book?.cover_image ||
    book?.image ||
    ""
  );
}

function coverFallback(title) {
  return `https://via.placeholder.com/200x300/C13B75/FFFFFF?text=${encodeURIComponent(
    (title || "Livro").slice(0, 12),
  )}`;
}

// Lista de livros da maratona (modelo novo: book_ids; fallback: inferir)
function getMarathonBookIds(marathon) {
  if (Array.isArray(marathon?.book_ids)) return marathon.book_ids;

  const inferred = Array.from(
    new Set((marathon?.participants || []).flatMap((p) => p.books || [])),
  );
  return inferred;
}

// progress de leitura por participante
function getParticipantPagesReadForBook(participant, book) {
  const fromMap = participant?.book_progress?.[book.id];
  if (typeof fromMap === "number") return fromMap;

  // compat legado
  if ((participant?.books || []).includes(book.id)) {
    return book?.pages_read || 0;
  }
  return 0;
}

function calcParticipantProgressShared(marathon, participant, books) {
  const bookIds = getMarathonBookIds(marathon);
  const bookObjs = bookIds.map((id) => getBook(books, id)).filter(Boolean);

  const total = bookObjs.reduce((sum, b) => sum + (b.total_pages || 0), 0);

  const read = bookObjs.reduce((sum, b) => {
    const raw = getParticipantPagesReadForBook(participant, b);
    const capped = clamp(raw, 0, b.total_pages || 0);
    return sum + capped;
  }, 0);

  const percent = total > 0 ? Math.round((read / total) * 100) : 0;

  return {
    totalPages: total,
    readPages: clamp(read, 0, total),
    percent: clamp(percent, 0, 100),
    bookObjs,
  };
}

function getLeaderShared(marathon, books) {
  const participants = marathon?.participants || [];
  if (participants.length === 0) return null;

  const scored = participants.map((p) => {
    const pr = calcParticipantProgressShared(marathon, p, books);
    return { user_id: p.user_id, percent: pr.percent, readPages: pr.readPages };
  });

  scored.sort((a, b) => b.percent - a.percent || b.readPages - a.readPages);
  return scored[0] || null;
}

function determineWinnerShared(marathon, books) {
  const participants = marathon?.participants || [];
  const done = participants
    .map((p) => {
      const pr = calcParticipantProgressShared(marathon, p, books);
      return {
        user_id: p.user_id,
        percent: pr.percent,
        readPages: pr.readPages,
      };
    })
    .filter((x) => x.percent >= 100);

  if (done.length === 0) return null;

  done.sort((a, b) => b.readPages - a.readPages);
  return done[0]?.user_id || null;
}

function isDeadlinePassed(deadline) {
  try {
    return new Date() >= new Date(deadline);
  } catch {
    return false;
  }
}

function marathonDurationDays(marathon) {
  const start = marathon.created_at || marathon.start_date;
  if (!start) return null;

  try {
    const a = new Date(start);
    const b = new Date(marathon.deadline);
    const days = Math.max(0, Math.ceil((b - a) / 86400000));
    return days;
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────────────────────────
// UI: Avatar do líder + coroa
function LeaderAvatar({ avatarUrl, alt }) {
  return (
    <div className="relative w-12 h-12 shrink-0">
      <div
        className="w-12 h-12 rounded-full overflow-hidden border shadow-sm"
        style={{
          borderColor: "rgba(255,255,255,.75)",
          background: "rgba(255,255,255,.35)",
        }}
      >
        <img
          src={avatarUrl || "/avatars/default.png"}
          alt={alt || "Líder"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/avatars/default.png";
          }}
        />
      </div>

      {/* coroa “14h” inclinada */}
      <div
        className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-sm"
        style={{
          background: "var(--accent-hex)",
          color: "white",
          transform: "rotate(18deg)",
          border: "2px solid rgba(255,255,255,.85)",
        }}
        title="Líder atual"
      >
        <Crown size={14} />
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
// Card (ATIVAS) — líder com avatar + coroa à direita
function MarathonActiveCard({ marathon, books, users, onOpen }) {
  const leader = getLeaderShared(marathon, books);
  const leaderUser = leader ? getUser(users, leader.user_id) : null;

  const bookCount = getMarathonBookIds(marathon).length;

  return (
    <button
      type="button"
      onClick={() => onOpen(marathon)}
      className="w-full text-left rounded-2xl overflow-hidden border transition hover:shadow-sm"
      style={{
        background: "var(--bg-card)",
        borderColor: "var(--border-hex)",
      }}
    >
      <div className="p-5 relative">
        {/* faixa lateral rosa (ativas) */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{ background: "var(--accent-hex)" }}
        />

        <div className="pl-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3
                className="text-lg font-extrabold leading-tight truncate"
                style={{ color: "var(--text-header)" }}
              >
                {marathon.name}
              </h3>

              <p
                className="text-sm mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                Fim: {fmtDateBR(marathon.deadline)} ·{" "}
                {daysLeft(marathon.deadline)} dias
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: "rgba(255,255,255,.55)",
                    border: "1px solid var(--border-hex)",
                    color: "var(--text-header)",
                  }}
                >
                  <Users size={14} style={{ color: "var(--accent-hex)" }} />
                  {marathon.participants.length} participantes
                </span>

                <span
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: "rgba(255,255,255,.55)",
                    border: "1px solid var(--border-hex)",
                    color: "var(--text-header)",
                  }}
                >
                  📚 {bookCount} livros
                </span>
              </div>
            </div>

            {/* avatar do líder no lado direito */}
            {leaderUser ? (
              <LeaderAvatar
                avatarUrl={leaderUser.avatar}
                alt={leaderUser.name || leaderUser.nick || "Líder"}
              />
            ) : null}
          </div>

          <div className="mt-4">
            <ProgressBar percent={leader?.percent ?? 0} />
            <div
              className="mt-1 text-xs"
              style={{ color: "var(--text-muted)" }}
            >
              Progresso líder: {leader?.percent ?? 0}%
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ───────────────────────────────────────────────────────────────
// Card (FINALIZADAS)
function FinishedMarathonCard({ marathon, books, users, onOpen }) {
  const participantsCount = marathon.participants?.length || 0;
  const bookIds = getMarathonBookIds(marathon);
  const booksCount = bookIds.length;

  const winnerId =
    marathon.winner_id ??
    marathon.winner ??
    determineWinnerShared(marathon, books);
  const winnerUser = winnerId ? getUser(users, winnerId) : null;

  const duration = marathonDurationDays(marathon);

  return (
    <button
      type="button"
      onClick={() => onOpen(marathon)}
      className="w-full text-left rounded-2xl p-5 transition hover:shadow-sm"
      style={{
        background: "rgba(255,255,255,0.22)",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            className="text-lg font-extrabold truncate"
            style={{ color: "var(--text-header)" }}
          >
            {marathon.name}
          </div>
          <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            Prazo final: {fmtDateBR(marathon.deadline)}
          </div>
        </div>

        <div
          className="rounded-full px-3 py-1 text-xs font-semibold"
          style={{
            background: "rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.08)",
            color: "var(--text-muted)",
          }}
        >
          Finalizada
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full overflow-hidden border"
          style={{ borderColor: "var(--border-hex)" }}
        >
          <img
            src={winnerUser?.avatar || "/avatars/default.png"}
            alt={winnerUser?.name || "Sem vencedor"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/avatars/default.png";
            }}
          />
        </div>

        <div className="min-w-0">
          <div
            className="text-[10px] font-bold tracking-widest"
            style={{ color: "var(--accent-deep)" }}
          >
            {winnerUser ? "VENCEDOR" : "RESULTADO"}
          </div>
          <div
            className="text-sm font-extrabold truncate"
            style={{ color: "var(--text-header)" }}
          >
            {winnerUser?.name || "Sem vencedor"}
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: "PARTICIPANTES", value: participantsCount },
          { label: "LIVROS", value: booksCount },
          { label: "PÁGINAS", value: marathon.total_pages_goal ?? "—" },
          { label: "DURAÇÃO", value: duration != null ? `${duration}d` : "—" },
        ].map((it) => (
          <div
            key={it.label}
            className="rounded-xl p-2.5"
            style={{
              background: "rgba(0,0,0,0.03)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="text-[10px] font-bold tracking-widest"
              style={{ color: "var(--text-muted)" }}
            >
              {it.label}
            </div>
            <div
              className="text-sm font-extrabold"
              style={{ color: "var(--text-header)" }}
            >
              {it.value}
            </div>
          </div>
        ))}
      </div>
    </button>
  );
}

// ───────────────────────────────────────────────────────────────
// Detail dialog
function MarathonDetailDialog({
  marathon,
  books,
  users,
  currentUser,
  onClose,
  onFinish,
  onAddBookToMarathon,
  onRemoveBookFromMarathon,
}) {
  const [selectedBookId, setSelectedBookId] = useState("");

  // auto-finaliza
  useEffect(() => {
    if (!marathon) return;
    if (marathon.status === "finished") return;

    const winnerId = determineWinnerShared(marathon, books);
    const deadlinePassed = isDeadlinePassed(marathon.deadline);

    if (winnerId) onFinish?.(marathon.id, winnerId);
    else if (deadlinePassed) onFinish?.(marathon.id, null);
  }, [marathon, books, onFinish]);

  if (!marathon) return null;

  const isFinished = marathon.status === "finished";

  const bookIds = getMarathonBookIds(marathon);
  const marathonBooks = bookIds.map((id) => getBook(books, id)).filter(Boolean);

  const creatorId =
    marathon.creator_id || marathon.owner_id || marathon.created_by;
  const isCreator = creatorId ? creatorId === currentUser.id : true;

  const canEditBooks = !isFinished && isCreator;

  const participants = marathon.participants || [];

  const participantsWithProgress = participants.map((p) => {
    const u = getUser(users, p.user_id);
    const pr = calcParticipantProgressShared(marathon, p, books);
    return { ...p, user: u, progress: pr };
  });

  const winnerId =
    marathon.winner_id ??
    marathon.winner ??
    determineWinnerShared(marathon, books);
  const winnerUser = winnerId ? getUser(users, winnerId) : null;

  // acervo interno do criador: livros dele
  const creatorLibrary = useMemo(() => {
    if (!isCreator) return [];
    return books.filter((b) => b.owner === currentUser.id);
  }, [books, currentUser.id, isCreator]);

  const handleAddBook = () => {
    if (!selectedBookId) return;
    onAddBookToMarathon?.(marathon.id, selectedBookId);
    setSelectedBookId("");
  };

  return (
    <Dialog open={!!marathon} onOpenChange={(v) => !v && onClose()}>
      {/* IMPORTANT: limitar altura e permitir rolagem */}
      <DialogContent className="max-w-3xl rounded-2xl max-h-[85vh] overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Trophy size={18} style={{ color: "var(--accent-hex)" }} />
              <span style={{ color: "var(--text-header)" }}>
                {marathon.name}
              </span>
            </div>

            <div
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: "var(--text-muted)" }}
            >
              {isFinished
                ? winnerUser
                  ? `Vencedor: ${winnerUser.name}`
                  : "Sem vencedor"
                : "Em andamento"}
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* corpo rolável */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-5">
          {/* Top info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              className="rounded-xl p-3 border"
              style={{
                background: "rgba(255,255,255,.55)",
                borderColor: "var(--border-hex)",
              }}
            >
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={14}
                  style={{ color: "var(--accent-hex)" }}
                />
                <span className="text-sm font-semibold">Fim</span>
              </div>
              <div
                className="mt-1 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                {fmtDateBR(marathon.deadline)} · {daysLeft(marathon.deadline)}{" "}
                dias
              </div>
            </div>

            <div
              className="rounded-xl p-3 border"
              style={{
                background: "rgba(255,255,255,.55)",
                borderColor: "var(--border-hex)",
              }}
            >
              <div className="flex items-center gap-2">
                <Flag size={14} style={{ color: "var(--accent-hex)" }} />
                <span className="text-sm font-semibold">Meta total</span>
              </div>
              <div
                className="mt-1 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                {marathon.total_pages_goal} páginas
              </div>
            </div>

            <div
              className="rounded-xl p-3 border"
              style={{
                background: "rgba(255,255,255,.55)",
                borderColor: "var(--border-hex)",
              }}
            >
              <div className="flex items-center gap-2">
                <Users size={14} style={{ color: "var(--accent-hex)" }} />
                <span className="text-sm font-semibold">Participantes</span>
              </div>
              <div
                className="mt-1 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                {participants.length}
              </div>
            </div>
          </div>

          {/* LIVROS DA MARATONA */}
          <div className="space-y-2">
            <div
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Livros da maratona ({marathonBooks.length})
            </div>

            {marathonBooks.length === 0 ? (
              <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                Nenhum livro adicionado ainda.
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto scroll-hide pb-1">
                {marathonBooks.map((b) => (
                  <div key={b.id} className="shrink-0 w-24">
                    <div className="relative">
                      <BookCover
                        cover={getCoverFromBook(b) || coverFallback(b.title)}
                        title={b.title}
                        className="rounded-xl"
                      />

                      {/* lixeira no livro (somente se puder editar) */}
                      {canEditBooks && (
                        <button
                          type="button"
                          onClick={() =>
                            onRemoveBookFromMarathon?.(marathon.id, b.id)
                          }
                          className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                          style={{
                            background: "#ef4444",
                            color: "white",
                            border: "2px solid rgba(255,255,255,.85)",
                          }}
                          title="Remover livro"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>

                    <div
                      className="mt-1 text-[11px] font-semibold line-clamp-2"
                      style={{ color: "var(--text-main)" }}
                      title={b.title}
                    >
                      {b.title}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Adicionar livro (somente criador e ativa) */}
            {canEditBooks && (
              <div
                className="mt-2 rounded-2xl p-3"
                style={{
                  background: "rgba(255,255,255,.35)",
                  border: "1px solid var(--border-hex)",
                }}
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedBookId}
                    onChange={(e) => setSelectedBookId(e.target.value)}
                    className="h-10 rounded-xl px-3 text-sm outline-none"
                    style={{
                      background: "rgba(255,255,255,0.55)",
                      border: "1px solid var(--border-hex)",
                      color: "var(--text-main)",
                    }}
                  >
                    <option value="">Selecione um livro do seu acervo…</option>
                    {creatorLibrary.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title}
                      </option>
                    ))}
                  </select>

                  <Button
                    className="rounded-xl h-10 font-bold text-white"
                    style={{ background: "var(--accent-hex)" }}
                    onClick={handleAddBook}
                  >
                    <BookPlus size={16} className="mr-2" />
                    Adicionar livro
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* PROGRESSO POR PARTICIPANTE */}
          <div className="space-y-3">
            <h4
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              Progresso por participante
            </h4>

            <div className="space-y-3">
              {participantsWithProgress.map((p) => {
                const u = p.user;
                const trophies = p.trophies || 0;

                return (
                  <div
                    key={p.user_id}
                    className="rounded-2xl p-4 border"
                    style={{
                      background: "var(--bg-card)",
                      borderColor: "var(--border-hex)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full overflow-hidden border"
                          style={{ borderColor: "rgba(255,255,255,.7)" }}
                        >
                          <img
                            src={u?.avatar || "/avatars/default.png"}
                            alt={u?.name || "Usuário"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/avatars/default.png";
                            }}
                          />
                        </div>

                        <div>
                          <div
                            className="font-bold leading-tight"
                            style={{ color: "var(--text-header)" }}
                          >
                            {u?.name || u?.nick || "Usuário"}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {p.progress.percent}% • {p.progress.readPages} /{" "}
                            {p.progress.totalPages} páginas
                          </div>
                        </div>
                      </div>

                      <div
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold"
                        style={{
                          background: "rgba(255,255,255,.55)",
                          border: "1px solid var(--border-hex)",
                          color: "var(--accent-hex)",
                        }}
                        title="Troféus"
                      >
                        <Crown size={12} />
                        {trophies}
                      </div>
                    </div>

                    <div className="mt-3">
                      <ProgressBar percent={p.progress.percent} />
                    </div>

                    {/* Grid por livro + barra pequena */}
                    {marathonBooks.length > 0 && (
                      <div className="mt-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {marathonBooks.map((b) => {
                            const raw = getParticipantPagesReadForBook(p, b);
                            const capped = clamp(raw, 0, b.total_pages || 0);
                            const bookPercent =
                              b.total_pages > 0
                                ? clamp(
                                    Math.round((capped / b.total_pages) * 100),
                                    0,
                                    100,
                                  )
                                : 0;

                            return (
                              <div
                                key={b.id}
                                className="rounded-2xl p-3"
                                style={{
                                  background: "rgba(255,255,255,.35)",
                                  border: "1px solid var(--border-hex)",
                                }}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-14 shrink-0">
                                    <BookCover
                                      cover={
                                        getCoverFromBook(b) ||
                                        coverFallback(b.title)
                                      }
                                      title={b.title}
                                      className="rounded-xl"
                                    />
                                  </div>

                                  <div className="min-w-0 flex-1">
                                    <div
                                      className="text-xs font-semibold line-clamp-2"
                                      style={{ color: "var(--text-main)" }}
                                      title={b.title}
                                    >
                                      {b.title}
                                    </div>

                                    <div className="mt-2 flex items-center gap-2">
                                      <div
                                        className="w-6 h-6 rounded-full overflow-hidden border shrink-0"
                                        style={{
                                          borderColor: "rgba(255,255,255,.7)",
                                        }}
                                      >
                                        <img
                                          src={
                                            u?.avatar || "/avatars/default.png"
                                          }
                                          alt={u?.name || "Usuário"}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.src =
                                              "/avatars/default.png";
                                          }}
                                        />
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <ProgressBar percent={bookPercent} />
                                      </div>

                                      <div
                                        className="text-xs font-bold w-10 text-right"
                                        style={{ color: "var(--text-muted)" }}
                                      >
                                        {bookPercent}%
                                      </div>
                                    </div>

                                    <div
                                      className="mt-1 text-[11px]"
                                      style={{ color: "var(--text-muted)" }}
                                    >
                                      {capped} / {b.total_pages || 0} páginas
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aviso de finalização sem vencedor */}
          {isFinished && !winnerUser && (
            <div
              className="rounded-2xl p-3 text-sm"
              style={{
                background: "rgba(255,255,255,.35)",
                border: "1px solid var(--border-hex)",
                color: "var(--text-muted)",
              }}
            >
              O prazo acabou e ninguém completou 100% dos livros. Esta maratona
              terminou <b>sem vencedor</b>.
            </div>
          )}
        </div>

        {/* footer fixo */}
        <DialogFooter className="mt-2 shrink-0">
          <Button variant="outline" className="rounded-xl" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ───────────────────────────────────────────────────────────────
// Main Page
export default function Marathons() {
  const {
    marathons,
    books,
    users,
    currentUser,
    createMarathon,
    finishMarathon,
    addBookToMarathon,
    removeBookFromMarathon,
  } = useMockData();

  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const [newName, setNewName] = useState("");
  const [newDeadline, setNewDeadline] = useState("");
  const [newGoal, setNewGoal] = useState("");

  const active = useMemo(
    () => marathons.filter((m) => m.status === "active"),
    [marathons],
  );
  const finished = useMemo(
    () => marathons.filter((m) => m.status === "finished"),
    [marathons],
  );

  const wins = useMemo(() => {
    return finished.reduce((acc, m) => {
      const winnerId =
        m.winner_id ?? m.winner ?? determineWinnerShared(m, books);
      return acc + (winnerId === currentUser.id ? 1 : 0);
    }, 0);
  }, [finished, books, currentUser.id]);

  const liveSelected = useMemo(() => {
    if (!selected) return null;
    return marathons.find((m) => m.id === selected.id) || null;
  }, [selected, marathons]);

  const handleCreate = () => {
    if (!newName.trim() || !newDeadline || Number(newGoal) <= 0) return;

    createMarathon({
      name: newName.trim(),
      deadline: newDeadline,
      total_pages_goal: Number(newGoal),
    });

    setNewName("");
    setNewDeadline("");
    setNewGoal("");
    setShowCreate(false);
  };

  const onFinish = (marathonId, winnerIdOrNull) => {
    finishMarathon(marathonId, winnerIdOrNull);
  };

  const onAddBook = (marathonId, bookId) => {
    addBookToMarathon(marathonId, bookId);
  };

  const onRemoveBook = (marathonId, bookId) => {
    removeBookFromMarathon(marathonId, bookId);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pt-1">
        <div>
          <h1
            className="text-3xl font-extrabold"
            style={{ color: "var(--text-header)" }}
          >
            Maratonas
          </h1>
          <p className="mt-1" style={{ color: "var(--text-muted)" }}>
            Competição literária saudável.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-md"
          style={{ background: "var(--accent-hex)", color: "white" }}
          title="Nova maratona"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div
          className="rounded-2xl p-5 flex flex-col items-center justify-center gap-2 border"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border-hex)",
          }}
        >
          <Flag size={20} style={{ color: "var(--accent-hex)" }} />
          <div
            className="text-4xl font-extrabold leading-none"
            style={{ color: "var(--text-header)" }}
          >
            {active.length}
          </div>
          <div
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Ativas
          </div>
        </div>

        <div
          className="rounded-2xl p-5 flex flex-col items-center justify-center gap-2 border"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border-hex)",
          }}
        >
          <Trophy size={20} style={{ color: "var(--accent-hex)" }} />
          <div
            className="text-4xl font-extrabold leading-none"
            style={{ color: "var(--text-header)" }}
          >
            {finished.length}
          </div>
          <div
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Finalizadas
          </div>
        </div>

        <div
          className="rounded-2xl p-5 flex flex-col items-center justify-center gap-2 border"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border-hex)",
          }}
        >
          <Crown size={20} style={{ color: "var(--accent-hex)" }} />
          <div
            className="text-4xl font-extrabold leading-none"
            style={{ color: "var(--text-header)" }}
          >
            {wins}
          </div>
          <div
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Vitórias
          </div>
        </div>
      </div>

      {/* ATIVAS */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-5 rounded-full"
            style={{ background: "var(--accent-hex)" }}
          />
          <h2
            className="text-lg font-extrabold"
            style={{ color: "var(--text-header)" }}
          >
            Ativas
          </h2>
        </div>

        {active.length === 0 ? (
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>
            Você ainda não tem maratonas ativas.
          </div>
        ) : (
          <div className="space-y-3">
            {active.map((m) => (
              <MarathonActiveCard
                key={m.id}
                marathon={m}
                books={books}
                users={users}
                onOpen={setSelected}
              />
            ))}
          </div>
        )}
      </div>

      {/* FINALIZADAS */}
      <div className="space-y-3 pt-2">
        <h2
          className="text-sm font-extrabold uppercase tracking-wider"
          style={{ color: "var(--text-muted)" }}
        >
          Finalizadas
        </h2>

        {finished.length === 0 ? (
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>
            Nenhuma maratona finalizada ainda.
          </div>
        ) : (
          <div className="space-y-3">
            {finished.map((m) => (
              <FinishedMarathonCard
                key={m.id}
                marathon={m}
                books={books}
                users={users}
                onOpen={setSelected}
              />
            ))}
          </div>
        )}
      </div>

      {/* Dialog: detalhes */}
      <MarathonDetailDialog
        marathon={liveSelected}
        books={books}
        users={users}
        currentUser={currentUser}
        onClose={() => setSelected(null)}
        onFinish={onFinish}
        onAddBookToMarathon={onAddBook}
        onRemoveBookFromMarathon={onRemoveBook}
      />

      {/* Dialog: criar */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle style={{ color: "var(--text-header)" }}>
              Nova maratona
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <div
                className="text-xs font-bold mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Nome
              </div>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Desafio Romance"
              />
            </div>

            <div>
              <div
                className="text-xs font-bold mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Data fim
              </div>
              <Input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
              />
            </div>

            <div>
              <div
                className="text-xs font-bold mb-1"
                style={{ color: "var(--text-muted)" }}
              >
                Meta total (páginas)
              </div>
              <Input
                inputMode="numeric"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Ex: 1146"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 mt-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setShowCreate(false)}
            >
              Cancelar
            </Button>
            <Button
              className="rounded-xl text-white font-bold"
              style={{ background: "var(--accent-hex)" }}
              onClick={handleCreate}
            >
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
