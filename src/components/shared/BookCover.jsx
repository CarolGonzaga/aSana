import React, { useState } from 'react';

/**
 * Renders a book cover at exactly 2:3 aspect ratio.
 * Falls back to a styled placeholder if image fails.
 */
export default function BookCover({ src, title, className = '', style = {} }) {
  const [error, setError] = useState(false);

  return (
    <div
      className={`overflow-hidden flex-shrink-0 ${className}`}
      style={{ aspectRatio: '2/3', position: 'relative', ...style }}
    >
      {!error ? (
        <img
          src={src}
          alt={title}
          onError={() => setError(true)}
          className="cover-2-3"
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center p-1"
          style={{ background: 'var(--accent-deep)' }}
        >
          <span
            className="text-white font-bold text-center leading-tight"
            style={{ fontSize: 9 }}
          >
            {title}
          </span>
        </div>
      )}
    </div>
  );
}