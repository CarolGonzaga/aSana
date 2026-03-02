import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
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
    title.slice(0, 12),
  )}`;

const BOOKS_DATA = [
  // Ana Caroline
  {
    id: "b1",
    title: "Estrela da Sorte",
    author: "Alexandria Bellefleur",
    cover_url: COVERS["estrela-sorte"] || FALLBACK("Estrela"),
    total_pages: 368,
    pages_read: 368,
    status: "lido",
    rating: 5,
    shelf_id: "s1",
    owner: "u1",
    month_read: "Jan",
  },
  {
    id: "b2",
    title: "Presságios do Amor",
    author: "Alexandria Bellefleur",
    cover_url: COVERS["pressagios"] || FALLBACK("Presságios"),
    total_pages: 352,
    pages_read: 180,
    status: "lendo",
    rating: 0,
    shelf_id: "s1",
    owner: "u1",
    month_read: null,
  },
  {
    id: "b3",
    title: "Astrid Parker Nunca Falha",
    author: "Ashley Herring Blake",
    cover_url: COVERS["astrid"] || FALLBACK("Astrid"),
    total_pages: 384,
    pages_read: 384,
    status: "lido",
    rating: 4,
    shelf_id: "s1",
    owner: "u1",
    month_read: "Fev",
  },
  {
    id: "b4",
    title: "Delilah Green Não Está Nem Aí",
    author: "Ashley Herring Blake",
    cover_url: COVERS["delilah"] || FALLBACK("Delilah"),
    total_pages: 368,
    pages_read: 0,
    status: "quero_ler",
    rating: 0,
    shelf_id: "s2",
    owner: "u1",
    month_read: null,
  },
  {
    id: "b5",
    title: "Pink Lemonade",
    author: "G. B. Baldassari",
    cover_url: COVERS["pink-lemonade"] || FALLBACK("Pink"),
    total_pages: 280,
    pages_read: 280,
    status: "lido",
    rating: 5,
    shelf_id: "s1",
    owner: "u1",
    month_read: "Jan",
  },
  {
    id: "b6",
    title: "Diário de Bordo de uma Impostora",
    author: "G. B. Baldassari",
    cover_url: COVERS["diario"] || FALLBACK("Diário"),
    total_pages: 264,
    pages_read: 264,
    status: "lido",
    rating: 4,
    shelf_id: "s1",
    owner: "u1",
    month_read: "Mar",
  },
  {
    id: "b7",
    title: "A Princesa e o Cappuccino",
    author: "G. B. Baldassari",
    cover_url: COVERS["princesa"] || FALLBACK("Princesa"),
    total_pages: 256,
    pages_read: 120,
    status: "lendo",
    rating: 0,
    shelf_id: "s2",
    owner: "u1",
    month_read: null,
  },
  {
    id: "b8",
    title: "Uma Pitada de Sorte",
    author: "G. B. Baldassari",
    cover_url: COVERS["pitada"] || FALLBACK("Pitada"),
    total_pages: 272,
    pages_read: 0,
    status: "quero_ler",
    rating: 0,
    shelf_id: "s2",
    owner: "u1",
    month_read: null,
  },
  {
    id: "b9",
    title: "Amor Fati",
    author: "G. B. Baldassari",
    cover_url: COVERS["amor-fati"] || FALLBACK("Amor"),
    total_pages: 288,
    pages_read: 288,
    status: "lido",
    rating: 5,
    shelf_id: "s1",
    owner: "u1",
    month_read: "Fev",
  },
  {
    id: "b10",
    title: "Crepúsculo",
    author: "Stephenie Meyer",
    cover_url: COVERS["crepusculo"] || FALLBACK("Crepúsculo"),
    total_pages: 498,
    pages_read: 498,
    status: "lido",
    rating: 5,
    shelf_id: "s1",
    owner: "u1",
    month_read: "Mar",
  },

  // Ana Flávia
  {
    id: "b11",
    title: "Crepúsculo",
    author: "Stephenie Meyer",
    cover_url: COVERS["crepusculo"] || FALLBACK("Crepúsculo"),
    total_pages: 498,
    pages_read: 498,
    status: "lido",
    rating: 5,
    shelf_id: "s3",
    owner: "u2",
    month_read: "Jan",
  },
  {
    id: "b12",
    title: "Estrela da Sorte",
    author: "Alexandria Bellefleur",
    cover_url: COVERS["estrela-sorte"] || FALLBACK("Estrela"),
    total_pages: 368,
    pages_read: 368,
    status: "lido",
    rating: 4,
    shelf_id: "s3",
    owner: "u2",
    month_read: "Jan",
  },
  {
    id: "b13",
    title: "Pink Lemonade",
    author: "G. B. Baldassari",
    cover_url: COVERS["pink-lemonade"] || FALLBACK("Pink"),
    total_pages: 280,
    pages_read: 140,
    status: "lendo",
    rating: 0,
    shelf_id: "s3",
    owner: "u2",
    month_read: null,
  },
  {
    id: "b14",
    title: "Amor Fati",
    author: "G. B. Baldassari",
    cover_url: COVERS["amor-fati"] || FALLBACK("Amor"),
    total_pages: 288,
    pages_read: 288,
    status: "lido",
    rating: 5,
    shelf_id: "s3",
    owner: "u2",
    month_read: "Fev",
  },
  {
    id: "b15",
    title: "Presságios do Amor",
    author: "Alexandria Bellefleur",
    cover_url: COVERS["pressagios"] || FALLBACK("Presságios"),
    total_pages: 352,
    pages_read: 352,
    status: "lido",
    rating: 4,
    shelf_id: "s3",
    owner: "u2",
    month_read: "Mar",
  },
];

const SHELVES_DATA = [
  { id: "s1", name: "Favoritos", owner: "u1", created_date: "2024-01-15" },
  { id: "s2", name: "Para Ler", owner: "u1", created_date: "2024-02-20" },
  { id: "s3", name: "Meus Livros", owner: "u2", created_date: "2024-01-10" },
];

/**
 * NOVO MODELO (correto):
 * - book_ids: lista de livros da maratona (compartilhados)
 * - participants[].book_progress: { [bookId]: pagesRead }
 * - participants[].trophies: troféus acumulados
 * - creator_id: quem criou (pode editar livros se status active)
 * - winner_id: vencedor (ou null quando prazo acaba sem vencedor)
 *
 * Mantemos compatibilidade com "winner" (antigo) para não quebrar telas.
 */
const MARATHONS_DATA = [
  {
    id: "m1",
    name: "Maratona de Verão",
    status: "active",
    created_at: "2026-02-01",
    deadline: "2026-04-30",
    total_pages_goal: 1200, // pode manter como "meta declarada", mas progresso real vem dos livros
    creator_id: "u1",
    book_ids: ["b2", "b7", "b13"],

    participants: [
      {
        user_id: "u1",
        trophies: 0,
        book_progress: {
          b2: 180,
          b7: 120,
          b13: 0,
        },
      },
      {
        user_id: "u2",
        trophies: 0,
        book_progress: {
          b2: 352,
          b7: 0,
          b13: 140,
        },
      },
    ],

    winner_id: null,
    winner: null,
  },
  {
    id: "m2",
    name: "Desafio Romance",
    status: "finished",
    created_at: "2025-10-01",
    deadline: "2025-12-31",
    total_pages_goal: 1146,
    creator_id: "u1",
    book_ids: ["b1", "b5", "b11"],

    participants: [
      {
        user_id: "u1",
        trophies: 1,
        book_progress: {
          b1: 368,
          b5: 280,
          b11: 498,
        },
      },
      {
        user_id: "u2",
        trophies: 0,
        book_progress: {
          b1: 368,
          b5: 140,
          b11: 498,
        },
      },
    ],

    winner_id: "u1",
    winner: "u1",
  },
];

const BADGES_DATA = [
  {
    id: "bg1",
    name: "Primeira Leitura",
    symbol: "I",
    description: "Completou seu primeiro livro",
  },
  {
    id: "bg2",
    name: "Devoradora",
    symbol: "II",
    description: "Leu 5 livros em sequência",
  },
  {
    id: "bg3",
    name: "Maratonista",
    symbol: "III",
    description: "Participou de uma maratona",
  },
  {
    id: "bg4",
    name: "Crítica Literária",
    symbol: "IV",
    description: "Avaliou 5 livros",
  },
  {
    id: "bg5",
    name: "Vencedora",
    symbol: "V",
    description: "Venceu uma maratona",
  },
];

const CHAT_MESSAGES_DATA = [
  {
    id: "c1",
    from: "u1",
    to: "u2",
    content: "Bom dia, amor",
    timestamp: "2026-02-27T10:30:00",
  },
  {
    id: "c2",
    from: "u2",
    to: "u1",
    content: "bom dia gatinha",
    timestamp: "2026-02-27T10:32:00",
  },
  {
    id: "c3",
    from: "u1",
    to: "u2",
    content: "Te aaaamoo",
    timestamp: "2026-02-27T10:35:00",
  },
  {
    id: "c4",
    from: "u2",
    to: "u1",
    content: "te amo",
    timestamp: "2026-02-27T10:36:00",
  },
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
  // vencedor = primeiro que chegar a 100%.
  // Sem histórico temporal, pegamos quem tem maior leitura e >=100.
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

// ─── CONTEXT ──────────────────────────────────────────────────
const MockDataContext = createContext(null);

export function MockDataProvider({ children }) {
  const [currentUser] = useState(USERS[0]);
  const [users] = useState(USERS);
  const [books, setBooks] = useState(BOOKS_DATA);
  const [shelves, setShelves] = useState(SHELVES_DATA);
  const [marathons, setMarathons] = useState(MARATHONS_DATA);
  const [badges] = useState(BADGES_DATA);
  const [messages, setMessages] = useState(CHAT_MESSAGES_DATA);

  // ─────────────────────────────────────────────────────────────
  // AUTO-FINISH (correto)
  // - se alguém completar 100% -> finaliza com winner_id
  // - se prazo passar e ninguém completou -> finaliza sem vencedor (winner_id = null)
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
            winner: winnerId, // compat
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

  // ── Book operations ──────────────────────────────────────────
  const updateBookProgress = useCallback((bookId, pagesRead) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const clamped = Math.min(Math.max(0, pagesRead), b.total_pages);
        const newStatus =
          clamped >= b.total_pages ? "lido" : clamped > 0 ? "lendo" : b.status;
        return { ...b, pages_read: clamped, status: newStatus };
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

  // ── Marathon operations ──────────────────────────────────────
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
            {
              user_id: currentUser.id,
              trophies: 0,
              book_progress: {},
            },
            // Fase 1: já deixa Ana Flávia participando (como você pediu)
            {
              user_id: "u2",
              trophies: 0,
              book_progress: {},
            },
          ],

          winner_id: null,
          winner: null, // compat
        },
      ]);
    },
    [currentUser.id],
  );

  /**
   * finishMarathon(marathonId, winnerIdOrNull)
   * - winnerIdOrNull pode ser null (prazo acabou sem vencedor)
   */
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
          winner: winnerId, // compat
          participants: (m.participants || []).map((p) =>
            winnerId && p.user_id === winnerId
              ? { ...p, trophies: (p.trophies || 0) + 1 }
              : p,
          ),
        };
      }),
    );
  }, []);

  /**
   * Adiciona um livro à maratona (livro compartilhado).
   * - só faz sentido em maratona ativa (você controla na UI)
   * - adiciona em book_ids (sem duplicar)
   * - inicializa progresso 0 para todos os participantes
   */
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
            book_progress: {
              ...(p.book_progress || {}),
              [bookId]: 0,
            },
          })),
        };
      }),
    );
  }, []);

  /**
   * Remove um livro da maratona (livro compartilhado).
   * - remove de book_ids
   * - remove também de book_progress de todos
   */
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

  /**
   * Atualiza progresso de um participante em um livro específico da maratona.
   * (Útil depois quando você quiser interface de atualizar leitura dentro da maratona)
   */
  const updateMarathonBookProgress = useCallback(
    (marathonId, userId, bookId, pagesRead) => {
      setMarathons((prev) =>
        prev.map((m) => {
          if (m.id !== marathonId) return m;

          const b = getBookById(books, bookId);
          const total = b?.total_pages || 0;
          const clamped = clamp(Number(pagesRead || 0), 0, total);

          return {
            ...m,
            participants: (m.participants || []).map((p) => {
              if (p.user_id !== userId) return p;
              return {
                ...p,
                book_progress: {
                  ...(p.book_progress || {}),
                  [bookId]: clamped,
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
    const rated = lidos.filter((b) => b.rating > 0);
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

    // ✅ novos/ajustados (maratona correta)
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
