import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";

// ─── STATIC DATA ──────────────────────────────────────────────
const USERS = [
  {
    id: "u1",
    name: "Ana Caroline",
    nick: "@anacaroline",
    avatar: "/avatars/anacaroline.jpeg",
  },
  {
    id: "u2",
    name: "Ana Flávia",
    nick: "@anaflavia",
    avatar: "/avatars/anaflavia.jpeg",
  },
];

// Covers (locais)
const COVERS = {
  "estrela-sorte": "/covers/estrela-sorte.jpg",
  pressagios: "/covers/pressagios.jpg",
  astrid: "/covers/astrid.jpg",
  delilah: "/covers/delilah.jpg",
  "pink-lemonade": "/covers/pink-lemonade.jpg",
  diario: "/covers/diario.jpg",
  princesa: "/covers/princesa.jpg",
  pitada: "/covers/pitada.jpg",
  "amor-fati": "/covers/amor-fati.jpg",
  crepusculo: "/covers/crepusculo.jpg",
};

const FALLBACK = (title) =>
  `https://via.placeholder.com/200x300/C13B75/FFFFFF?text=${encodeURIComponent(
    (title || "Livro").slice(0, 12),
  )}`;

/**
 * ✅ CATALOG (banco interno do app)
 * Campos:
 * obrigatórios: title, author, publisher, released(boolean), release_year(if released), category(ebook|livro_fisico|fanfic)
 * opcionais: subtitle, isbn, synopsis, synopsis_short, genre, total_pages, tropes[]
 */
const CATALOG_DATA = [
  {
    id: "c1",
    title: "Estrela da Sorte",
    subtitle: "",
    author: "Alexandria Bellefleur",
    publisher: "—",
    cover_url: COVERS["estrela-sorte"] || FALLBACK("Estrela"),
    category: "livro_fisico",
    released: true,
    release_year: 2024,
    genre: "Romance",
    total_pages: 368,
    tropes: [],
    synopsis: "",
    synopsis_short: "",
    isbn: "",
  },
  {
    id: "c2",
    title: "Presságios do Amor",
    author: "Alexandria Bellefleur",
    publisher: "—",
    cover_url: COVERS["pressagios"] || FALLBACK("Presságios"),
    category: "livro_fisico",
    released: true,
    release_year: 2024,
    genre: "Romance",
    total_pages: 352,
    tropes: [],
  },
  {
    id: "c3",
    title: "Astrid Parker Nunca Falha",
    author: "Ashley Herring Blake",
    publisher: "—",
    cover_url: COVERS["astrid"] || FALLBACK("Astrid"),
    category: "livro_fisico",
    released: true,
    release_year: 2024,
    genre: "Romance",
    total_pages: 384,
    tropes: [],
  },
  {
    id: "c4",
    title: "Delilah Green Não Está Nem Aí",
    author: "Ashley Herring Blake",
    publisher: "—",
    cover_url: COVERS["delilah"] || FALLBACK("Delilah"),
    category: "livro_fisico",
    released: true,
    release_year: 2024,
    genre: "Romance",
    total_pages: 368,
    tropes: [],
  },
  {
    id: "c5",
    title: "Pink Lemonade",
    author: "G. B. Baldassari",
    publisher: "—",
    cover_url: COVERS["pink-lemonade"] || FALLBACK("Pink"),
    category: "livro_fisico",
    released: true,
    release_year: 2024,
    genre: "Romance",
    total_pages: 280,
    tropes: [],
  },
  {
    id: "c6",
    title: "Diário de Bordo de uma Impostora",
    author: "G. B. Baldassari",
    publisher: "—",
    cover_url: COVERS["diario"] || FALLBACK("Diário"),
    category: "livro_fisico",
    released: true,
    release_year: 2024,
    genre: "Romance",
    total_pages: 264,
    tropes: [],
  },
  {
    id: "c7",
    title: "A Princesa e o Cappuccino",
    author: "G. B. Baldassari",
    publisher: "—",
    cover_url: COVERS["princesa"] || FALLBACK("Princesa"),
    category: "livro_fisico",
    released: true,
    release_year: 2024,
    genre: "Romance",
    total_pages: 256,
    tropes: [],
  },
  {
    id: "c8",
    title: "Uma Pitada de Sorte",
    author: "G. B. Baldassari",
    publisher: "—",
    cover_url: COVERS["pitada"] || FALLBACK("Pitada"),
    category: "livro_fisico",
    released: true,
    release_year: 2024,
    genre: "Romance",
    total_pages: 272,
    tropes: [],
  },
  {
    id: "c9",
    title: "Amor Fati",
    author: "G. B. Baldassari",
    publisher: "—",
    cover_url: COVERS["amor-fati"] || FALLBACK("Amor"),
    category: "livro_fisico",
    released: true,
    release_year: 2024,
    genre: "Romance",
    total_pages: 288,
    tropes: [],
  },
  {
    id: "c10",
    title: "Crepúsculo",
    author: "Stephenie Meyer",
    publisher: "—",
    cover_url: COVERS["crepusculo"] || FALLBACK("Crepúsculo"),
    category: "livro_fisico",
    released: true,
    release_year: 2005,
    genre: "Fantasia",
    total_pages: 498,
    tropes: ["vampiros"],
  },
];

/**
 * ✅ MEU ACERVO (por usuário) – mantém compat com o que você já usa no app
 * Além do que já existe, adicionamos:
 * - catalog_id (liga no banco)
 * - category / genre / released / release_year / publisher (pra filtros)
 */
const BOOKS_DATA = [
  // Ana Caroline (u1)
  {
    id: "b1",
    catalog_id: "c1",
    title: "Estrela da Sorte",
    author: "Alexandria Bellefleur",
    publisher: "—",
    cover_url: COVERS["estrela-sorte"] || FALLBACK("Estrela"),
    total_pages: 368,
    pages_read: 368,
    status: "lido",
    rating: 5,
    shelf_id: "s1",
    owner: "u1",
    month_read: "Jan",
    category: "livro_fisico",
    genre: "Romance",
    released: true,
    release_year: 2024,
    tropes: [],
  },
  {
    id: "b2",
    catalog_id: "c2",
    title: "Presságios do Amor",
    author: "Alexandria Bellefleur",
    publisher: "—",
    cover_url: COVERS["pressagios"] || FALLBACK("Presságios"),
    total_pages: 352,
    pages_read: 180,
    status: "lendo",
    rating: 0,
    shelf_id: "s1",
    owner: "u1",
    month_read: null,
    category: "livro_fisico",
    genre: "Romance",
    released: true,
    release_year: 2024,
    tropes: [],
  },
  {
    id: "b3",
    catalog_id: "c3",
    title: "Astrid Parker Nunca Falha",
    author: "Ashley Herring Blake",
    publisher: "—",
    cover_url: COVERS["astrid"] || FALLBACK("Astrid"),
    total_pages: 384,
    pages_read: 384,
    status: "lido",
    rating: 4,
    shelf_id: "s1",
    owner: "u1",
    month_read: "Fev",
    category: "livro_fisico",
    genre: "Romance",
    released: true,
    release_year: 2024,
    tropes: [],
  },
  {
    id: "b4",
    catalog_id: "c4",
    title: "Delilah Green Não Está Nem Aí",
    author: "Ashley Herring Blake",
    publisher: "—",
    cover_url: COVERS["delilah"] || FALLBACK("Delilah"),
    total_pages: 368,
    pages_read: 0,
    status: "quero_ler",
    rating: 0,
    shelf_id: "s2",
    owner: "u1",
    month_read: null,
    category: "livro_fisico",
    genre: "Romance",
    released: true,
    release_year: 2024,
    tropes: [],
  },
  {
    id: "b5",
    catalog_id: "c5",
    title: "Pink Lemonade",
    author: "G. B. Baldassari",
    publisher: "—",
    cover_url: COVERS["pink-lemonade"] || FALLBACK("Pink"),
    total_pages: 280,
    pages_read: 280,
    status: "lido",
    rating: 5,
    shelf_id: "s1",
    owner: "u1",
    month_read: "Jan",
    category: "livro_fisico",
    genre: "Romance",
    released: true,
    release_year: 2024,
    tropes: [],
  },

  // Ana Flávia (u2)
  {
    id: "b11",
    catalog_id: "c10",
    title: "Crepúsculo",
    author: "Stephenie Meyer",
    publisher: "—",
    cover_url: COVERS["crepusculo"] || FALLBACK("Crepúsculo"),
    total_pages: 498,
    pages_read: 498,
    status: "lido",
    rating: 5,
    shelf_id: "s3",
    owner: "u2",
    month_read: "Jan",
    category: "livro_fisico",
    genre: "Fantasia",
    released: true,
    release_year: 2005,
    tropes: ["vampiros"],
  },
];

const SHELVES_DATA = [
  { id: "s1", name: "Favoritos", owner: "u1", created_date: "2024-01-15" },
  { id: "s2", name: "Para Ler", owner: "u1", created_date: "2024-02-20" },
  { id: "s3", name: "Meus Livros", owner: "u2", created_date: "2024-01-10" },
];

// ─── INTERNAL HELPERS ─────────────────────────────────────────
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function deadlinePassed(deadline) {
  try {
    return new Date() >= new Date(deadline);
  } catch {
    return false;
  }
}

function getBookById(books, id) {
  return books.find((b) => b.id === id);
}

function getMarathonTotalPagesFromBooks(marathon, books) {
  const ids = marathon.book_ids || [];
  return ids.reduce((sum, bid) => {
    const b = getBookById(books, bid);
    return sum + (b?.total_pages || 0);
  }, 0);
}

function getParticipantReadPages(marathon, participant, books) {
  const ids = marathon.book_ids || [];
  let read = 0;

  for (const bid of ids) {
    const b = getBookById(books, bid);
    const total = b?.total_pages || 0;
    const raw = participant.book_progress?.[bid] ?? 0;
    read += clamp(raw, 0, total);
  }
  return read;
}

function getParticipantPercent(marathon, participant, books) {
  const total = getMarathonTotalPagesFromBooks(marathon, books);
  const read = getParticipantReadPages(marathon, participant, books);
  const pct = total > 0 ? Math.round((read / total) * 100) : 0;
  return clamp(pct, 0, 100);
}

function determineWinnerId(marathon, books) {
  const total = getMarathonTotalPagesFromBooks(marathon, books);
  if (total <= 0) return null;

  const done = (marathon.participants || [])
    .map((p) => ({
      user_id: p.user_id,
      read: getParticipantReadPages(marathon, p, books),
      pct: getParticipantPercent(marathon, p, books),
    }))
    .filter((x) => x.pct >= 100);

  if (done.length === 0) return null;
  done.sort((a, b) => b.read - a.read);
  return done[0].user_id || null;
}

/**
 * Seus dados de maratona (mantidos)
 * Obs: seguem usando book_ids do "meu acervo", como você já estava fazendo.
 */
const MARATHONS_DATA = [
  {
    id: "m1",
    name: "Maratona de Verão",
    status: "active",
    created_at: "2026-02-01",
    deadline: "2026-04-30",
    total_pages_goal: 1200,
    creator_id: "u1",
    book_ids: ["b2", "b5"],

    participants: [
      {
        user_id: "u1",
        trophies: 0,
        book_progress: {
          b2: 180,
          b5: 0,
        },
      },
      {
        user_id: "u2",
        trophies: 0,
        book_progress: {
          b2: 352,
          b5: 140,
        },
      },
    ],

    winner_id: null,
    winner: null,
  },
];

const BADGES_DATA = [
  { id: "bg1", name: "Primeira Leitura", symbol: "I", description: "..." },
];

const CHAT_MESSAGES_DATA = [
  {
    id: "c1",
    from: "u1",
    to: "u2",
    content: "Bom dia, amor",
    timestamp: "2026-02-27T10:30:00",
  },
];

// ─── CONTEXT ──────────────────────────────────────────────────
const MockDataContext = createContext(null);

export function MockDataProvider({ children }) {
  const [currentUser] = useState(USERS[0]);
  const [users] = useState(USERS);

  // ✅ Banco interno (global)
  const [catalogBooks, setCatalogBooks] = useState(CATALOG_DATA);

  // ✅ Acervo do usuário (compat com o app)
  const [books, setBooks] = useState(BOOKS_DATA);

  const [shelves, setShelves] = useState(SHELVES_DATA);
  const [marathons, setMarathons] = useState(MARATHONS_DATA);
  const [badges] = useState(BADGES_DATA);
  const [messages, setMessages] = useState(CHAT_MESSAGES_DATA);

  // ─────────────────────────────────────────────────────────────
  // AUTO-FINISH (mantido)
  useEffect(() => {
    setMarathons((prev) =>
      prev.map((m) => {
        if (m.status !== "active") return m;

        const winnerId = determineWinnerId(m, books);
        const deadlineIsOver = deadlinePassed(m.deadline);

        if (winnerId) {
          return {
            ...m,
            status: "finished",
            winner_id: winnerId,
            winner: winnerId,
            participants: (m.participants || []).map((p) =>
              p.user_id === winnerId
                ? { ...p, trophies: (p.trophies || 0) + 1 }
                : p,
            ),
          };
        }

        if (deadlineIsOver) {
          return {
            ...m,
            status: "finished",
            winner_id: null,
            winner: null,
          };
        }

        return m;
      }),
    );
  }, [books]);

  // ── Book operations (meu acervo) ──────────────────────────────
  const updateBookProgress = useCallback((bookId, pagesRead) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const clampedPages = Math.min(
          Math.max(0, pagesRead),
          b.total_pages || 0,
        );
        const newStatus =
          clampedPages >= (b.total_pages || 0)
            ? "lido"
            : clampedPages > 0
              ? "lendo"
              : b.status;

        return { ...b, pages_read: clampedPages, status: newStatus };
      }),
    );
  }, []);

  const updateBookStatus = useCallback((bookId, status) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, status } : b)),
    );
  }, []);

  const moveBookToShelf = useCallback((bookId, shelfId) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, shelf_id: shelfId } : b)),
    );
  }, []);

  /**
   * removeBook = remove do MEU ACERVO (não apaga do banco global)
   */
  const removeBook = useCallback((bookId) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));

    // também remove o livro de maratonas (da lista book_ids e do progresso)
    setMarathons((prev) =>
      prev.map((m) => {
        const has = (m.book_ids || []).includes(bookId);
        if (!has) return m;

        const nextBookIds = (m.book_ids || []).filter((id) => id !== bookId);

        return {
          ...m,
          book_ids: nextBookIds,
          participants: (m.participants || []).map((p) => {
            const next = { ...(p.book_progress || {}) };
            delete next[bookId];
            return { ...p, book_progress: next };
          }),
        };
      }),
    );
  }, []);

  // ── Shelf operations ─────────────────────────────────────────
  const createShelf = useCallback(
    (name) => {
      setShelves((prev) => [
        ...prev,
        {
          id: "s" + Date.now(),
          name,
          owner: currentUser.id,
          created_date: new Date().toISOString().split("T")[0],
        },
      ]);
    },
    [currentUser.id],
  );

  const renameShelf = useCallback((shelfId, name) => {
    setShelves((prev) =>
      prev.map((s) => (s.id === shelfId ? { ...s, name } : s)),
    );
  }, []);

  const deleteShelf = useCallback((shelfId) => {
    setShelves((prev) => prev.filter((s) => s.id !== shelfId));
    setBooks((prev) => prev.filter((b) => b.shelf_id !== shelfId));
  }, []);

  // ── Catalog operations ───────────────────────────────────────
  /**
   * Cria um livro no BANCO INTERNO (global).
   * Se addToLibrary = true, adiciona também no acervo do usuário.
   */
  const createCatalogBook = useCallback(
    (data, { addToLibrary = true } = {}) => {
      const id = "c" + Date.now();

      const catalogItem = {
        id,
        title: data.title,
        subtitle: data.subtitle || "",
        author: data.author,
        publisher: data.publisher,
        cover_url: data.cover_url || FALLBACK(data.title),
        category: data.category, // ebook | livro_fisico | fanfic
        released: Boolean(data.released),
        release_year: data.released
          ? Number(data.release_year || new Date().getFullYear())
          : null,
        genre: data.genre || "",
        total_pages: data.total_pages ? Number(data.total_pages) : null,
        isbn: data.isbn || "",
        synopsis: data.synopsis || "",
        synopsis_short: data.synopsis_short || "",
        tropes: Array.isArray(data.tropes) ? data.tropes : [],
        created_by: currentUser.id,
        created_at: new Date().toISOString(),
      };

      setCatalogBooks((prev) => [catalogItem, ...prev]);

      if (addToLibrary) {
        // adiciona no meu acervo
        setBooks((prev) => {
          const already = prev.some(
            (b) => b.owner === currentUser.id && b.catalog_id === id,
          );
          if (already) return prev;

          const libBookId = "b" + Date.now();
          return [
            {
              id: libBookId,
              catalog_id: id,
              owner: currentUser.id,
              shelf_id: "",
              status: "quero_ler",
              rating: 0,
              pages_read: 0,
              month_read: null,

              // espelha dados do catálogo
              title: catalogItem.title,
              author: catalogItem.author,
              publisher: catalogItem.publisher,
              cover_url: catalogItem.cover_url,
              total_pages: catalogItem.total_pages || 0,
              category: catalogItem.category,
              genre: catalogItem.genre || "",
              released: catalogItem.released,
              release_year: catalogItem.release_year,
              tropes: catalogItem.tropes || [],
            },
            ...prev,
          ];
        });
      }

      return id;
    },
    [currentUser.id],
  );

  /**
   * Adiciona um item do catálogo ao acervo do usuário (sem duplicar).
   */
  const addCatalogBookToLibrary = useCallback(
    (catalogId) => {
      const item = catalogBooks.find((c) => c.id === catalogId);
      if (!item) return;

      setBooks((prev) => {
        const already = prev.some(
          (b) => b.owner === currentUser.id && b.catalog_id === catalogId,
        );
        if (already) return prev;

        const libBookId = "b" + Date.now();

        return [
          {
            id: libBookId,
            catalog_id: catalogId,
            owner: currentUser.id,
            shelf_id: "",
            status: "quero_ler",
            rating: 0,
            pages_read: 0,
            month_read: null,

            title: item.title,
            author: item.author,
            publisher: item.publisher,
            cover_url: item.cover_url,
            total_pages: item.total_pages || 0,
            category: item.category,
            genre: item.genre || "",
            released: item.released,
            release_year: item.release_year,
            tropes: item.tropes || [],
          },
          ...prev,
        ];
      });
    },
    [catalogBooks, currentUser.id],
  );

  // ── Marathon operations (mantidas) ────────────────────────────
  const createMarathon = useCallback(
    (data) => {
      setMarathons((prev) => [
        ...prev,
        {
          id: "m" + Date.now(),
          name: data.name,
          status: "active",
          created_at: new Date().toISOString().split("T")[0],
          deadline: data.deadline,
          total_pages_goal: Number(data.total_pages_goal || 0),
          creator_id: currentUser.id,
          book_ids: [],
          participants: [
            { user_id: currentUser.id, trophies: 0, book_progress: {} },
            { user_id: "u2", trophies: 0, book_progress: {} },
          ],
          winner_id: null,
          winner: null,
        },
      ]);
    },
    [currentUser.id],
  );

  const finishMarathon = useCallback((marathonId, winnerIdOrNull) => {
    setMarathons((prev) =>
      prev.map((m) => {
        if (m.id !== marathonId) return m;
        if (m.status === "finished") return m;

        const winnerId = winnerIdOrNull ?? null;

        return {
          ...m,
          status: "finished",
          winner_id: winnerId,
          winner: winnerId,
          participants: (m.participants || []).map((p) =>
            winnerId && p.user_id === winnerId
              ? { ...p, trophies: (p.trophies || 0) + 1 }
              : p,
          ),
        };
      }),
    );
  }, []);

  const addBookToMarathon = useCallback((marathonId, bookId) => {
    setMarathons((prev) =>
      prev.map((m) => {
        if (m.id !== marathonId) return m;
        if (m.status !== "active") return m;

        const exists = (m.book_ids || []).includes(bookId);
        if (exists) return m;

        return {
          ...m,
          book_ids: [...(m.book_ids || []), bookId],
          participants: (m.participants || []).map((p) => ({
            ...p,
            book_progress: { ...(p.book_progress || {}), [bookId]: 0 },
          })),
        };
      }),
    );
  }, []);

  const removeBookFromMarathon = useCallback((marathonId, bookId) => {
    setMarathons((prev) =>
      prev.map((m) => {
        if (m.id !== marathonId) return m;
        if (m.status !== "active") return m;

        const nextBookIds = (m.book_ids || []).filter((id) => id !== bookId);

        return {
          ...m,
          book_ids: nextBookIds,
          participants: (m.participants || []).map((p) => {
            const next = { ...(p.book_progress || {}) };
            delete next[bookId];
            return { ...p, book_progress: next };
          }),
        };
      }),
    );
  }, []);

  const updateMarathonBookProgress = useCallback(
    (marathonId, userId, bookId, pagesRead) => {
      setMarathons((prev) =>
        prev.map((m) => {
          if (m.id !== marathonId) return m;

          const b = getBookById(books, bookId);
          const total = b?.total_pages || 0;
          const clampedPages = clamp(Number(pagesRead || 0), 0, total);

          return {
            ...m,
            participants: (m.participants || []).map((p) => {
              if (p.user_id !== userId) return p;
              return {
                ...p,
                book_progress: {
                  ...(p.book_progress || {}),
                  [bookId]: clampedPages,
                },
              };
            }),
          };
        }),
      );
    },
    [books],
  );

  // ── Chat ─────────────────────────────────────────────────────
  const sendMessage = useCallback(
    (to, content) => {
      setMessages((prev) => [
        ...prev,
        {
          id: "c" + Date.now(),
          from: currentUser.id,
          to,
          content,
          timestamp: new Date().toISOString(),
        },
      ]);
    },
    [currentUser.id],
  );

  // ── Derived helpers ──────────────────────────────────────────
  const getUserBooks = useCallback(
    (uid) => books.filter((b) => b.owner === uid),
    [books],
  );
  const getUserShelves = useCallback(
    (uid) => shelves.filter((s) => s.owner === uid),
    [shelves],
  );
  const getUser = useCallback(
    (uid) => users.find((u) => u.id === uid),
    [users],
  );
  const getFriends = useCallback(
    () => users.filter((u) => u.id !== currentUser.id),
    [users, currentUser.id],
  );

  const getStats = useCallback(() => {
    const my = books.filter((b) => b.owner === currentUser.id);
    const lidos = my.filter((b) => b.status === "lido");
    const lendo = my.filter((b) => b.status === "lendo");
    const queroLer = my.filter((b) => b.status === "quero_ler");
    const totalPages = my.reduce((s, b) => s + (b.pages_read || 0), 0);
    const rated = lidos.filter((b) => (b.rating || 0) > 0);
    const avgRating =
      rated.length > 0
        ? (rated.reduce((s, b) => s + b.rating, 0) / rated.length).toFixed(1)
        : "—";

    const myMarathons = marathons.filter((m) =>
      (m.participants || []).some((p) => p.user_id === currentUser.id),
    );

    const trophies = myMarathons.reduce((s, m) => {
      const p = (m.participants || []).find(
        (pp) => pp.user_id === currentUser.id,
      );
      return s + (p?.trophies || 0);
    }, 0);

    const wins = myMarathons.reduce((s, m) => {
      const winnerId = m.winner_id ?? m.winner ?? null;
      return s + (winnerId === currentUser.id ? 1 : 0);
    }, 0);

    return {
      totalPages,
      totalLidos: lidos.length,
      totalLendo: lendo.length,
      totalQueroLer: queroLer.length,
      ritmoPagDia: Math.round(totalPages / 59),
      diasSeguidos: 12,
      avgRating,
      totalMaratonas: myMarathons.length,
      totalTrofeus: trophies,
      totalVitorias: wins,
    };
  }, [books, marathons, currentUser.id]);

  const value = {
    currentUser,
    users,

    // ✅ banco interno
    catalogBooks,
    createCatalogBook,
    addCatalogBookToLibrary,

    // ✅ meu acervo (compat)
    books,
    shelves,
    marathons,
    badges,
    messages,

    updateBookProgress,
    updateBookStatus,
    moveBookToShelf,
    removeBook,

    createShelf,
    renameShelf,
    deleteShelf,

    createMarathon,
    finishMarathon,
    addBookToMarathon,
    removeBookFromMarathon,
    updateMarathonBookProgress,

    sendMessage,

    getUserBooks,
    getUserShelves,
    getUser,
    getFriends,
    getStats,
  };

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const ctx = useContext(MockDataContext);
  if (!ctx) throw new Error("useMockData must be used within MockDataProvider");
  return ctx;
}
