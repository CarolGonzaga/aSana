import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import BookCover from '../shared/BookCover';

function BookDisplay({ book, label, arrow }) {
  if (!book) return null;
  const ArrowIcon = arrow === 'up' ? ArrowUp : ArrowDown;
  return (
    <div className="flex gap-3 items-center rounded-2xl p-3 flex-1 min-w-0" style={{ background:'var(--bg-card)' }}>
      <div className="flex-shrink-0 rounded-lg overflow-hidden shadow-md" style={{ width:56 }}>
        <BookCover src={book.cover_url} title={book.title} className="rounded-lg" />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className="rounded-full px-2 py-0.5 inline-flex items-center gap-1 mb-1"
          style={{ background:'rgba(193,59,117,0.1)' }}
        >
          <ArrowIcon size={10} style={{ color:'var(--accent-hex)' }} />
          <span style={{ fontSize:8, fontWeight:700, color:'var(--accent-hex)' }}>{label}</span>
        </div>
        <h4 className="font-bold leading-tight line-clamp-2" style={{ fontSize:11, color:'var(--text-header)' }}>
          {book.title}
        </h4>
        <p style={{ fontSize:10, color:'var(--accent-hex)', fontWeight:700, marginTop:2 }}>
          {book.total_pages} págs
        </p>
      </div>
    </div>
  );
}

export default function BigSmallBook({ books }) {
  const finished = books.filter(b => b.status === 'lido' && b.total_pages > 0);
  if (finished.length < 2) return null;
  const sorted   = [...finished].sort((a, b) => b.total_pages - a.total_pages);
  const biggest  = sorted[0];
  const smallest = sorted[sorted.length - 1];

  return (
    <div>
      <h2 className="text-sm font-bold mb-3" style={{ color:'var(--text-header)' }}>Maior e Menor Livro</h2>
      <div className="flex gap-2.5">
        <BookDisplay book={biggest}  label="Maior" arrow="up" />
        <BookDisplay book={smallest} label="Menor" arrow="down" />
      </div>
    </div>
  );
}