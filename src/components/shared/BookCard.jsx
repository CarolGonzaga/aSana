import React from 'react';
import BookCover from './BookCover';
import ProgressBar from './ProgressBar';

const STATUS_LABEL = { lendo:'Lendo', lido:'Lido', quero_ler:'Quero ler', abandonado:'Abandonado' };
const STATUS_COLOR = {
  lendo:     'var(--accent-hex)',
  lido:      '#3d9a6a',
  quero_ler: 'var(--accent-deep)',
  abandonado:'#94a3b8',
};

export default function BookCard({ book, size = 'md', onClick }) {
  const percent = book.total_pages > 0
    ? Math.min(100, Math.round((book.pages_read / book.total_pages) * 100))
    : 0;

  const widths = { sm: 72, md: 96, lg: 120 };
  const w = widths[size] ?? 96;

  return (
    <div
      className="flex flex-col items-center cursor-pointer group"
      style={{ width: w }}
      onClick={onClick}
    >
      {/* Cover */}
      <div
        className="w-full rounded-xl overflow-hidden shadow-md transition-transform duration-200 group-hover:scale-[1.03] group-hover:shadow-lg relative"
        style={{ aspectRatio: '2/3' }}
      >
        <BookCover src={book.cover_url} title={book.title} className="rounded-xl" />

        {/* Status badge */}
        {book.status && (
          <span
            className="absolute top-1.5 left-1.5 text-white font-bold"
            style={{
              fontSize: 8,
              background: STATUS_COLOR[book.status],
              padding: '2px 5px',
              borderRadius: 6,
            }}
          >
            {STATUS_LABEL[book.status]}
          </span>
        )}
      </div>

      {/* Progress */}
      <div className="w-full mt-1.5 space-y-0.5">
        <ProgressBar percent={percent} height={4} />
        <p
          className="text-center font-bold"
          style={{ fontSize: 9, color: 'var(--accent-hex)' }}
        >
          {percent}%
        </p>
      </div>
    </div>
  );
}