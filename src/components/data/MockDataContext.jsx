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
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    id: "u2",
    name: "Ana Flávia",
    nick: "@anaflavia",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
];

// Cover art via Open Library covers (reliable) - all 2:3 proportion enforced via CSS
const COVERS = {
  "estrela-sorte": "https://covers.openlibrary.org/b/isbn/9786550430528-L.jpg",
  pressagios: "https://covers.openlibrary.org/b/isbn/9786550433512-L.jpg",
  astrid: "https://covers.openlibrary.org/b/isbn/9786555876239-L.jpg",
  delilah: "https://covers.openlibrary.org/b/isbn/9786555876215-L.jpg",
  "pink-lemonade": "https://covers.openlibrary.org/b/isbn/9788542222754-L.jpg",
  diario: "https://covers.openlibrary.org/b/isbn/9788542215220-L.jpg",
  princesa: "https://covers.openlibrary.org/b/isbn/9788542211115-L.jpg",
  pitada: "https://covers.openlibrary.org/b/isbn/9788542221306-L.jpg",
  "amor-fati": "https://covers.openlibrary.org/b/isbn/9788542220026-L.jpg",
  crepusculo: "https://covers.openlibrary.org/b/isbn/9788599296097-L.jpg",
};

// Fallback covers using a consistent book-cover placeholder with unique color per book
const FALLBACK = (title) =>
  `https://via.placeholder.com/200x300/C13B75/FFFFFF?text=${encodeURIComponent(title.slice(0, 12))}`;

const BOOKS_DATA = [
  {
    id: "b1",
    title: "Estrela da Sorte",
    author: "Alexandria Bellefleur",
    cover_url: COVERS["estrela-sorte"],
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
    cover_url: COVERS["pressagios"],
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
    cover_url: COVERS["astrid"],
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
    cover_url: COVERS["delilah"],
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
    cover_url: COVERS["pink-lemonade"],
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
    cover_url: COVERS["diario"],
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
    cover_url: COVERS["princesa"],
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
    cover_url: COVERS["pitada"],
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
    cover_url: COVERS["amor-fati"],
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
    cover_url: COVERS["crepusculo"],
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
    cover_url: COVERS["crepusculo"],
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
    cover_url: COVERS["estrela-sorte"],
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
    cover_url: COVERS["pink-lemonade"],
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
    cover_url: COVERS["amor-fati"],
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
    cover_url: COVERS["pressagios"],
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

const MARATHONS_DATA = [
  {
    id: "m1",
    name: "Maratona de Verão",
    status: "active",
    deadline: "2026-04-30",
    total_pages_goal: 1200,
    participants: [
      { user_id: "u1", books: ["b2", "b7"], trophies: 0 },
      { user_id: "u2", books: ["b13"], trophies: 0 },
    ],
    winner: null,
  },
  {
    id: "m2",
    name: "Desafio Romance",
    status: "finished",
    deadline: "2025-12-31",
    total_pages_goal: 800,
    participants: [
      { user_id: "u1", books: ["b1", "b5"], trophies: 1 },
      { user_id: "u2", books: ["b11"], trophies: 0 },
    ],
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
    content: "Oi! Já começou Crepúsculo?",
    timestamp: "2026-02-27T10:30:00",
  },
  {
    id: "c2",
    from: "u2",
    to: "u1",
    content: "Sim! Estou amando demais!",
    timestamp: "2026-02-27T10:32:00",
  },
  {
    id: "c3",
    from: "u1",
    to: "u2",
    content: "É incrível né? O Edward...",
    timestamp: "2026-02-27T10:35:00",
  },
  {
    id: "c4",
    from: "u2",
    to: "u1",
    content: "Nem me fala! Estou apaixonada haha",
    timestamp: "2026-02-27T10:36:00",
  },
];

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

  // ── Auto-finish marathon when a participant hits 100% ──
  useEffect(() => {
    marathons.forEach((m) => {
      if (m.status !== "active") return;
      for (const p of m.participants) {
        const pagesRead = p.books.reduce((s, bid) => {
          const b = books.find((bk) => bk.id === bid);
          return s + (b?.pages_read || 0);
        }, 0);
        const pct = (pagesRead / m.total_pages_goal) * 100;
        if (pct >= 100) {
          setMarathons((prev) =>
            prev.map((mm) => {
              if (mm.id !== m.id || mm.status === "finished") return mm;
              return {
                ...mm,
                status: "finished",
                winner: p.user_id,
                participants: mm.participants.map((pp) =>
                  pp.user_id === p.user_id
                    ? { ...pp, trophies: pp.trophies + 1 }
                    : pp,
                ),
              };
            }),
          );
          break;
        }
      }
    });
  }, [books, marathons]);

  // ── Book operations ──
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
  }, []);

  // ── Shelf operations ──
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

  // ── Marathon operations ──
  const createMarathon = useCallback(
    (data) => {
      setMarathons((prev) => [
        ...prev,
        {
          id: "m" + Date.now(),
          status: "active",
          winner: null,
          participants: [{ user_id: currentUser.id, books: [], trophies: 0 }],
          ...data,
        },
      ]);
    },
    [currentUser.id],
  );

  const finishMarathon = useCallback((marathonId, winnerId) => {
    setMarathons((prev) =>
      prev.map((m) => {
        if (m.id !== marathonId) return m;
        return {
          ...m,
          status: "finished",
          winner: winnerId,
          participants: m.participants.map((p) =>
            p.user_id === winnerId ? { ...p, trophies: p.trophies + 1 } : p,
          ),
        };
      }),
    );
  }, []);

  const removeBookFromMarathon = useCallback((marathonId, bookId) => {
    setMarathons((prev) =>
      prev.map((m) => {
        if (m.id !== marathonId) return m;
        return {
          ...m,
          participants: m.participants.map((p) => ({
            ...p,
            books: p.books.filter((bid) => bid !== bookId),
          })),
        };
      }),
    );
  }, []);

  // ── Chat ──
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

  // ── Derived helpers ──
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
      m.participants.some((p) => p.user_id === currentUser.id),
    );
    const trophies = myMarathons.reduce((s, m) => {
      const p = m.participants.find((p) => p.user_id === currentUser.id);
      return s + (p?.trophies || 0);
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
    removeBookFromMarathon,
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
