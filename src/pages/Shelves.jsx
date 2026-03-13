import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMockData } from "@/components/data/MockDataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  LibraryBig,
} from "lucide-react";

import BookCover from "@/components/shared/BookCover";

// --------------------------------------------------------------
// Helpers
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function normalizeStr(s) {
  return (s || "").toString().trim().toLowerCase();
}

function matchesQuery(book, q) {
  if (!q) return true;
  const qq = normalizeStr(q);
  const fields = [
    book.title,
    book.subtitle,
    book.author,
    book.publisher,
    book.isbn,
    book.genre,
    (book.tags || []).join(" "),
    (book.tropes || []).join(" "),
  ];
  return normalizeStr(fields.join(" ")).includes(qq);
}

function safeNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// --------------------------------------------------------------
// UI: Chrome-like tabs with arrows
function ShelfTabsChrome({
  shelves,
  activeId,
  onChange,
  onCreateShelf,
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
  listRef,
  onScroll,
}) {
  return (
    <div className="flex items-center gap-2">
      {/* Left arrow */}
      <button
        type="button"
        onClick={onScrollLeft}
        disabled={!canScrollLeft}
        className="w-9 h-9 rounded-xl flex items-center justify-center border disabled:opacity-40"
        style={{
          background: "rgba(255,255,255,.45)",
          borderColor: "var(--border-hex)",
        }}
        title="Voltar abas"
      >
        <ChevronLeft size={18} style={{ color: "var(--accent-hex)" }} />
      </button>

      {/* Tabs container */}
      <div
        ref={listRef}
        onScroll={onScroll}
        className="flex-1 overflow-x-auto scroll-hide"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div className="flex items-end gap-2 min-w-max pb-1">
          {shelves.map((s) => {
            const isActive = s.id === activeId;

            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onChange(s.id)}
                className="relative px-4 transition"
                style={{
                  scrollSnapAlign: "start",
                  paddingTop: isActive ? 10 : 8,
                  paddingBottom: isActive ? 10 : 8,
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    borderRadius: "14px 14px 10px 10px",
                    background: isActive
                      ? "rgba(255,255,255,.68)"
                      : "rgba(255,255,255,.28)",
                    border: `1px solid ${
                      isActive ? "var(--border-hex)" : "rgba(0,0,0,0.06)"
                    }`,
                    boxShadow: isActive
                      ? "0 8px 18px rgba(0,0,0,0.08)"
                      : "none",
                  }}
                />

                <span
                  className="relative z-10 font-extrabold"
                  style={{
                    color: isActive
                      ? "var(--text-header)"
                      : "var(--text-muted)",
                    fontSize: isActive ? 15 : 13,
                  }}
                >
                  {s.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right arrow */}
      <button
        type="button"
        onClick={onScrollRight}
        disabled={!canScrollRight}
        className="w-9 h-9 rounded-xl flex items-center justify-center border disabled:opacity-40"
        style={{
          background: "rgba(255,255,255,.45)",
          borderColor: "var(--border-hex)",
        }}
        title="Avançar abas"
      >
        <ChevronRight size={18} style={{ color: "var(--accent-hex)" }} />
      </button>

      {/* Create shelf */}
      <button
        type="button"
        onClick={onCreateShelf}
        className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm"
        style={{
          background: "rgba(255,255,255,.55)",
          borderColor: "var(--border-hex)",
        }}
        title="Criar estante"
      >
        <Plus size={18} style={{ color: "var(--accent-hex)" }} />
      </button>
    </div>
  );
}

// --------------------------------------------------------------
// Main page
export default function Shelves() {
  const { currentUser, books, shelves, createShelf } = useMockData();

  // Aba "Todos" + estantes do usuário
  const myShelves = useMemo(() => {
    const mine = (shelves || []).filter((s) => s.owner === currentUser.id);
    return [{ id: "__all__", name: "Todos" }, ...mine];
  }, [shelves, currentUser.id]);

  const [activeShelfId, setActiveShelfId] = useState("__all__");

  // ✅ se a estante ativa deixar de existir (renomeou/deletou), volta para "Todos"
  useEffect(() => {
    const exists = myShelves.some((s) => s.id === activeShelfId);
    if (!exists) setActiveShelfId("__all__");
  }, [myShelves, activeShelfId]);

  // Filtros recolhíveis
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("ALL"); // LIDO | LENDO | NAO_LIDO
  const [type, setType] = useState("ALL"); // EBOOK | FISICO | FANFIC
  const [released, setReleased] = useState("ALL"); // SIM | NAO
  const [genre, setGenre] = useState("ALL");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [pagesMin, setPagesMin] = useState("");
  const [pagesMax, setPagesMax] = useState("");

  // Criar estante (MVP simples)
  const handleCreateShelf = () => {
    const name = window.prompt("Nome da nova estante:");
    if (!name || !name.trim()) return;
    createShelf?.(name.trim());
  };

  // Scroll arrows for tabs
  const listRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    canLeft: false,
    canRight: false,
  });

  const syncScrollState = () => {
    const el = listRef.current;
    if (!el) return;
    setScrollState({
      canLeft: el.scrollLeft > 0,
      canRight: el.scrollLeft + el.clientWidth < el.scrollWidth - 2,
    });
  };

  useEffect(() => {
    syncScrollState();
    const onResize = () => syncScrollState();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollByTabs = (dir) => {
    const el = listRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 260, behavior: "smooth" });
    setTimeout(syncScrollState, 220);
  };

  // Acervo do usuário (somente)
  const myBooks = useMemo(
    () => (books || []).filter((b) => b.owner === currentUser.id),
    [books, currentUser.id],
  );

  // Gêneros disponíveis no acervo
  const genres = useMemo(() => {
    const set = new Set();
    myBooks.forEach((b) => {
      if (b.genre) set.add(b.genre);
    });
    return ["ALL", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [myBooks]);

  const bookType = (b) =>
    b.type || b.category || b.formato || b.book_type || "UNKNOWN";
  const bookStatus = (b) => b.status || "UNKNOWN";

  const filteredBooks = useMemo(() => {
    const yMin = safeNum(yearMin);
    const yMax = safeNum(yearMax);
    const pMin = safeNum(pagesMin);
    const pMax = safeNum(pagesMax);

    return myBooks
      .filter((b) => {
        if (activeShelfId !== "__all__" && b.shelf_id !== activeShelfId) {
          return false;
        }

        if (!matchesQuery(b, q)) return false;

        if (status !== "ALL") {
          if (status === "LIDO" && bookStatus(b) !== "lido") return false;
          if (status === "LENDO" && bookStatus(b) !== "lendo") return false;
          if (status === "NAO_LIDO") {
            const st = bookStatus(b);
            if (!(st === "quero_ler" || st === "nao_lido" || st === "não lido"))
              return false;
          }
        }

        if (type !== "ALL") {
          const t = normalizeStr(bookType(b));
          if (type === "EBOOK" && t !== "ebook") return false;
          if (type === "FISICO" && !(t === "fisico" || t === "físico"))
            return false;
          if (type === "FANFIC" && t !== "fanfic") return false;
        }

        if (released !== "ALL") {
          const isRel = !!b.is_released || b.released === true;
          if (released === "SIM" && !isRel) return false;
          if (released === "NAO" && isRel) return false;
        }

        if (genre !== "ALL") {
          if ((b.genre || "") !== genre) return false;
        }

        const year = safeNum(b.release_year || b.year);
        if (yMin != null && year != null && year < yMin) return false;
        if (yMax != null && year != null && year > yMax) return false;

        const pages = safeNum(b.total_pages);
        if (pMin != null && pages != null && pages < pMin) return false;
        if (pMax != null && pages != null && pages > pMax) return false;

        return true;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [
    myBooks,
    activeShelfId,
    q,
    status,
    type,
    released,
    genre,
    yearMin,
    yearMax,
    pagesMin,
    pagesMax,
  ]);

  const totalInTab = useMemo(() => {
    if (activeShelfId === "__all__") return myBooks.length;
    return myBooks.filter((b) => b.shelf_id === activeShelfId).length;
  }, [activeShelfId, myBooks]);

  const clearFilters = () => {
    setQ("");
    setStatus("ALL");
    setType("ALL");
    setReleased("ALL");
    setGenre("ALL");
    setYearMin("");
    setYearMax("");
    setPagesMin("");
    setPagesMax("");
  };

  const hasActiveFilters =
    q ||
    status !== "ALL" ||
    type !== "ALL" ||
    released !== "ALL" ||
    genre !== "ALL" ||
    yearMin ||
    yearMax ||
    pagesMin ||
    pagesMax;

  // Se tiver filtros ativos, deixa aberto automaticamente (melhor UX)
  useEffect(() => {
    if (hasActiveFilters) setFiltersOpen(true);
  }, [hasActiveFilters]);

  const handleAddBook = () => {
    alert("Depois vamos ligar isso à página de Busca (catálogo global).");
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Header (sem botão rosa grande) */}
      <div className="pt-1">
        <h1
          className="text-3xl font-extrabold"
          style={{ color: "var(--text-header)" }}
        >
          Estante
        </h1>
        <p className="mt-1" style={{ color: "var(--text-muted)" }}>
          Seu acervo pessoal. Filtros aplicam automaticamente.
        </p>
      </div>

      {/* Chrome tabs */}
      <ShelfTabsChrome
        shelves={myShelves}
        activeId={activeShelfId}
        onChange={(id) => setActiveShelfId(id)}
        onCreateShelf={handleCreateShelf}
        canScrollLeft={scrollState.canLeft}
        canScrollRight={scrollState.canRight}
        onScrollLeft={() => scrollByTabs(-1)}
        onScrollRight={() => scrollByTabs(1)}
        listRef={listRef}
        onScroll={syncScrollState}
      />

      {/* Filters (recolhível) */}
      <div
        className="rounded-2xl border"
        style={{
          background: "rgba(255,255,255,.40)",
          borderColor: "var(--border-hex)",
        }}
      >
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className="w-full p-4 flex items-center justify-between gap-3"
          title="Abrir/fechar filtros"
        >
          <div className="flex items-center gap-2">
            <Filter size={16} style={{ color: "var(--accent-hex)" }} />
            <div
              className="text-sm font-extrabold"
              style={{ color: "var(--text-header)" }}
            >
              Filtros
            </div>
            <div
              className="text-xs rounded-full px-2 py-0.5"
              style={{
                background: "rgba(193,59,117,.10)",
                color: "var(--accent-deep)",
                border: "1px solid rgba(193,59,117,.18)",
              }}
              title="Resultados / Total nesta estante"
            >
              {filteredBooks.length}/{totalInTab}
            </div>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              clearFilters();
            }}
            className="text-xs font-bold inline-flex items-center gap-1 rounded-full px-3 py-1 border"
            style={{
              background: "rgba(255,255,255,.55)",
              borderColor: "var(--border-hex)",
              color: "var(--text-muted)",
            }}
            title="Limpar todos os filtros"
          >
            <X size={14} />
            Limpar
          </button>
        </button>

        {filtersOpen && (
          <div className="px-4 pb-4 space-y-3">
            {/* Search */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Search size={16} style={{ color: "var(--text-muted)" }} />
                </div>
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar no seu acervo (título, autor, gênero, tags...)"
                  className="pl-10 rounded-xl"
                />
              </div>

              <Button
                variant="outline"
                className="rounded-xl"
                onClick={handleAddBook}
                title="Ir para busca no catálogo"
              >
                <LibraryBig size={16} className="mr-2" />
                Buscar
              </Button>
            </div>

            {/* Controls (não corta no desktop) */}
            <div className="flex flex-wrap gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-10 rounded-xl px-3 text-sm outline-none min-w-[170px]"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid var(--border-hex)",
                  color: "var(--text-main)",
                }}
              >
                <option value="ALL">Status: Todos</option>
                <option value="LIDO">Lido</option>
                <option value="LENDO">Lendo</option>
                <option value="NAO_LIDO">Não lido</option>
              </select>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-10 rounded-xl px-3 text-sm outline-none min-w-[170px]"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid var(--border-hex)",
                  color: "var(--text-main)",
                }}
              >
                <option value="ALL">Tipo: Todos</option>
                <option value="EBOOK">Ebook</option>
                <option value="FISICO">Livro físico</option>
                <option value="FANFIC">Fanfic</option>
              </select>

              <select
                value={released}
                onChange={(e) => setReleased(e.target.value)}
                className="h-10 rounded-xl px-3 text-sm outline-none min-w-[170px]"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid var(--border-hex)",
                  color: "var(--text-main)",
                }}
              >
                <option value="ALL">Lançado: Todos</option>
                <option value="SIM">Lançado</option>
                <option value="NAO">Não lançado</option>
              </select>

              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="h-10 rounded-xl px-3 text-sm outline-none min-w-[170px]"
                style={{
                  background: "rgba(255,255,255,0.55)",
                  border: "1px solid var(--border-hex)",
                  color: "var(--text-main)",
                }}
              >
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g === "ALL" ? "Gênero: Todos" : g}
                  </option>
                ))}
              </select>

              <Input
                inputMode="numeric"
                value={pagesMin}
                onChange={(e) => setPagesMin(e.target.value)}
                placeholder="Pág. mín"
                className="rounded-xl min-w-[120px]"
              />
              <Input
                inputMode="numeric"
                value={pagesMax}
                onChange={(e) => setPagesMax(e.target.value)}
                placeholder="Pág. máx"
                className="rounded-xl min-w-[120px]"
              />

              <Input
                inputMode="numeric"
                value={yearMin}
                onChange={(e) => setYearMin(e.target.value)}
                placeholder="Ano mín"
                className="rounded-xl min-w-[120px]"
              />
              <Input
                inputMode="numeric"
                value={yearMax}
                onChange={(e) => setYearMax(e.target.value)}
                placeholder="Ano máx"
                className="rounded-xl min-w-[120px]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Books grid */}
      {filteredBooks.length === 0 ? (
        <div
          className="rounded-2xl border p-6 text-sm"
          style={{
            background: "rgba(255,255,255,.35)",
            borderColor: "var(--border-hex)",
            color: "var(--text-muted)",
          }}
        >
          Nenhum livro encontrado com esses filtros.
          <div className="mt-3">
            <Button
              className="rounded-xl text-white font-bold"
              style={{ background: "var(--accent-hex)" }}
              onClick={handleAddBook}
            >
              <Plus size={16} className="mr-2" />
              Adicionar livro ao acervo
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {filteredBooks.map((b) => {
            const cover =
              b.cover_url ||
              b.coverUrl ||
              b.cover ||
              b.image ||
              "/covers/placeholder.jpg";

            return (
              <button
                key={b.id}
                type="button"
                className="rounded-2xl border p-3 text-left transition hover:shadow-sm"
                style={{
                  background: "var(--bg-card)",
                  borderColor: "var(--border-hex)",
                }}
                title={b.title}
                onClick={() => alert("Depois: abrir modal/detalhe do livro")}
              >
                <div
                  className="rounded-xl overflow-hidden border"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <BookCover
                    src={cover}
                    title={b.title}
                    className="rounded-xl"
                  />
                </div>

                <div className="mt-2">
                  <div
                    className="text-sm font-extrabold leading-tight line-clamp-2"
                    style={{ color: "var(--text-header)" }}
                  >
                    {b.title}
                  </div>
                  <div
                    className="text-xs mt-1 line-clamp-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {b.author || "—"}
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(193,59,117,.10)",
                        color: "var(--accent-deep)",
                        border: "1px solid rgba(193,59,117,.18)",
                      }}
                    >
                      {bookStatus(b) === "lido"
                        ? "LIDO"
                        : bookStatus(b) === "lendo"
                          ? "LENDO"
                          : "NÃO LIDO"}
                    </span>

                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(0,0,0,.04)",
                        color: "var(--text-muted)",
                        border: "1px solid rgba(0,0,0,.06)",
                      }}
                    >
                      {normalizeStr(bookType(b)) === "ebook"
                        ? "EBOOK"
                        : normalizeStr(bookType(b)) === "fanfic"
                          ? "FANFIC"
                          : "FÍSICO"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
