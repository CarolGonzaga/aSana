import React, { useMemo, useState } from "react";

/**
 * Renders a book cover at exactly 2:3 aspect ratio.
 * - Accepts: src, cover, cover_url (compat)
 * - Falls back to a styled placeholder if image fails.
 */
export default function BookCover({
  src,
  cover,
  cover_url,
  title = "Livro",
  className = "",
  style = {},
}) {
  const [error, setError] = useState(false);

  const finalSrc = useMemo(() => {
    return src || cover || cover_url || "";
  }, [src, cover, cover_url]);

  const fallbackText = useMemo(() => {
    return (title || "Livro").slice(0, 24);
  }, [title]);

  return (
    <div
      className={`overflow-hidden flex-shrink-0 ${className}`}
      style={{
        aspectRatio: "2/3",
        position: "relative",
        borderRadius: 12,
        ...style,
      }}
    >
      {finalSrc && !error ? (
        <img
          src={finalSrc}
          alt={title}
          onError={() => setError(true)}
          className="cover-2-3"
          loading="lazy"
          draggable={false}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center p-2"
          style={{
            background:
              "linear-gradient(180deg, rgba(142,58,89,0.95), rgba(193,59,117,0.75))",
          }}
        >
          <span
            className="text-white font-bold text-center leading-tight"
            style={{ fontSize: 10 }}
          >
            {fallbackText}
          </span>
        </div>
      )}
    </div>
  );
}
