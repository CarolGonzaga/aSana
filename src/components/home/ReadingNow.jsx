import React from 'react';
import { Button } from '@/components/ui/button';
import BookCover from '../shared/BookCover';
import ProgressBar from '../shared/ProgressBar';

export default function ReadingNow({ book, onUpdateProgress }) {
  if (!book) return null;
  const percent = Math.min(100, Math.round((book.pages_read / book.total_pages) * 100));

  return (
    <div>
      <h2 className="text-sm font-bold mb-3" style={{ color:'var(--text-header)' }}>Lendo Agora</h2>
      <div className="rounded-2xl p-4 flex gap-4" style={{ background:'var(--bg-card)' }}>
        {/* Cover */}
        <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-lg glow-accent" style={{ width:96 }}>
          <BookCover src={book.cover_url} title={book.title} className="rounded-xl" />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
          <div className="min-w-0">
            <h3 className="font-bold text-sm leading-snug" style={{ color:'var(--text-header)' }}>
              {book.title}
            </h3>
            <p className="text-xs mt-0.5 truncate" style={{ color:'var(--text-muted)' }}>
              {book.author}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ProgressBar percent={percent} height={6} />
              <span className="text-xs font-bold flex-shrink-0" style={{ color:'var(--accent-hex)' }}>
                {percent}%
              </span>
            </div>
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>
              {book.pages_read} / {book.total_pages} páginas
            </p>
            <Button
              size="sm"
              onClick={() => onUpdateProgress(book)}
              className="w-full rounded-xl h-9 font-bold text-white text-xs"
              style={{ background:'var(--accent-hex)' }}
            >
              Atualizar progresso
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}