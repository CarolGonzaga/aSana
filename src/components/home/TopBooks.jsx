import React from 'react';
import BookCover from '../shared/BookCover';

export default function TopBooks({ books }) {
  const top = [...books.filter(b => b.status === 'lido')]
    .sort((a, b) => b.rating - a.rating || 0)
    .slice(0, 10);

  if (top.length === 0) return null;

  return (
    <div>
      <h2 className="text-sm font-bold mb-3" style={{ color:'var(--text-header)' }}>Top 10 Lidos</h2>
      <div className="flex flex-wrap gap-3">
        {top.map((book, i) => (
          <div key={book.id} className="flex flex-col items-center" style={{ width:60 }}>
            <div className="relative w-full" style={{ aspectRatio:'2/3' }}>
              <div className="w-full h-full rounded-xl overflow-hidden shadow-md">
                <BookCover src={book.cover_url} title={book.title} className="rounded-xl" />
              </div>
              <span
                className="absolute -top-1.5 -left-1.5 flex items-center justify-center rounded-full font-bold text-white"
                style={{
                  width:18, height:18, fontSize:8,
                  background:'var(--accent-hex)',
                  boxShadow:'0 1px 4px rgba(193,59,117,0.4)',
                }}
              >
                {i+1}
              </span>
            </div>
            {book.rating > 0 && (
              <div className="flex gap-px mt-1">
                {Array.from({ length:5 }).map((_,si) => (
                  <span key={si} style={{ fontSize:7, color: si < book.rating ? '#C13B75' : '#EADDE3' }}>★</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}