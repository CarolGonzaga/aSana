import React, { useState, useEffect, useCallback } from 'react';
import { useMockData } from '../components/data/MockDataContext';
import BookCard from '../components/shared/BookCard';
import BookModal from '../components/shelves/BookModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

function useResponsivePageSize() {
  const get = () => {
    const w = window.innerWidth;
    if (w < 640)  return 4;
    if (w < 1024) return 6;
    return 8;
  };
  const [size, setSize] = useState(get);
  useEffect(() => {
    const h = () => setSize(get());
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return size;
}

function ShelfCard({ shelf, books, pageSize, myShelves, onBookClick, onEdit, onDelete }) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(books.length / pageSize);
  const paginated  = books.slice(page * pageSize, (page + 1) * pageSize);

  // Reset page if books change
  useEffect(() => { setPage(0); }, [books.length, pageSize]);

  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ background:'var(--bg-card)' }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-sm leading-tight" style={{ color:'var(--text-header)' }}>
            {shelf.name}
          </h3>
          <p style={{ fontSize:10, color:'var(--text-muted)', marginTop:2 }}>
            Criada em {shelf.created_date} · {books.length} {books.length === 1 ? 'livro' : 'livros'}
          </p>
        </div>
        <div className="flex gap-0.5 flex-shrink-0">
          <Button
            variant="ghost" size="icon" className="h-8 w-8"
            onClick={() => onEdit(shelf)}
          >
            <Pencil size={13} style={{ color:'var(--accent-deep)' }} />
          </Button>
          <Button
            variant="ghost" size="icon" className="h-8 w-8"
            onClick={() => onDelete(shelf.id)}
          >
            <Trash2 size={13} className="text-red-400" />
          </Button>
        </div>
      </div>

      {/* Books grid */}
      {books.length === 0 ? (
        <p style={{ fontSize:11, color:'var(--text-muted)', textAlign:'center', padding:'12px 0' }}>
          Nenhum livro nesta estante.
        </p>
      ) : (
        <div className="grid gap-2.5" style={{ gridTemplateColumns:`repeat(${Math.min(pageSize, paginated.length)}, minmax(0, 1fr))` }}>
          {paginated.map(book => (
            <BookCard key={book.id} book={book} size="sm" onClick={() => onBookClick(book)} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-1">
          <Button
            variant="ghost" size="sm"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="h-8 rounded-xl gap-1"
            style={{ fontSize:11 }}
          >
            <ChevronLeft size={13} /> Anterior
          </Button>
          <span style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600 }}>
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="ghost" size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
            className="h-8 rounded-xl gap-1"
            style={{ fontSize:11 }}
          >
            Próxima <ChevronRight size={13} />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function Shelves() {
  const {
    currentUser, getUserBooks, getUserShelves,
    updateBookProgress, updateBookStatus, moveBookToShelf, removeBook,
    createShelf, renameShelf, deleteShelf,
  } = useMockData();

  const myShelves  = getUserShelves(currentUser.id);
  const myBooks    = getUserBooks(currentUser.id);
  const pageSize   = useResponsivePageSize();

  const [selectedBook,   setSelectedBook]   = useState(null);
  const [showNewShelf,   setShowNewShelf]   = useState(false);
  const [editingShelf,   setEditingShelf]   = useState(null);
  const [newShelfName,   setNewShelfName]   = useState('');
  const [editName,       setEditName]       = useState('');

  const handleCreateShelf = () => {
    if (newShelfName.trim()) {
      createShelf(newShelfName.trim());
      setNewShelfName('');
      setShowNewShelf(false);
    }
  };

  const handleRenameShelf = () => {
    if (editName.trim() && editingShelf) {
      renameShelf(editingShelf.id, editName.trim());
      setEditingShelf(null);
    }
  };

  return (
    <div className="space-y-6 pb-4">
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-2xl font-bold" style={{ color:'var(--text-header)' }}>Estantes</h1>
        <Button
          size="sm"
          className="rounded-xl gap-1.5 font-bold text-white"
          style={{ background:'var(--accent-hex)' }}
          onClick={() => setShowNewShelf(true)}
        >
          <Plus size={14} /> Nova
        </Button>
      </div>

      {myShelves.map(shelf => (
        <ShelfCard
          key={shelf.id}
          shelf={shelf}
          books={myBooks.filter(b => b.shelf_id === shelf.id)}
          pageSize={pageSize}
          myShelves={myShelves}
          onBookClick={setSelectedBook}
          onEdit={s => { setEditingShelf(s); setEditName(s.name); }}
          onDelete={deleteShelf}
        />
      ))}

      {myShelves.length === 0 && (
        <div className="text-center py-12">
          <p style={{ color:'var(--text-muted)', fontSize:13 }}>Nenhuma estante criada ainda.</p>
        </div>
      )}

      {/* Book modal */}
      <BookModal
        open={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        book={selectedBook}
        shelves={myShelves}
        onUpdateStatus={updateBookStatus}
        onUpdateProgress={updateBookProgress}
        onMoveToShelf={moveBookToShelf}
        onRemove={removeBook}
      />

      {/* New shelf dialog */}
      <Dialog open={showNewShelf} onOpenChange={setShowNewShelf}>
        <DialogContent className="rounded-2xl border-0 w-[calc(100vw-32px)] max-w-sm" style={{ background:'var(--bg-card)' }}>
          <DialogHeader>
            <DialogTitle className="font-bold" style={{ color:'var(--text-header)' }}>Nova Estante</DialogTitle>
          </DialogHeader>
          <Input
            value={newShelfName}
            onChange={e => setNewShelfName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateShelf()}
            placeholder="Nome da estante"
            className="rounded-xl border-0 h-10"
            style={{ background:'var(--bg-main)' }}
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowNewShelf(false)} className="rounded-xl">Cancelar</Button>
            <Button onClick={handleCreateShelf} className="rounded-xl font-bold text-white" style={{ background:'var(--accent-hex)' }}>
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit shelf dialog */}
      <Dialog open={!!editingShelf} onOpenChange={() => setEditingShelf(null)}>
        <DialogContent className="rounded-2xl border-0 w-[calc(100vw-32px)] max-w-sm" style={{ background:'var(--bg-card)' }}>
          <DialogHeader>
            <DialogTitle className="font-bold" style={{ color:'var(--text-header)' }}>Editar Estante</DialogTitle>
          </DialogHeader>
          <Input
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleRenameShelf()}
            className="rounded-xl border-0 h-10"
            style={{ background:'var(--bg-main)' }}
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditingShelf(null)} className="rounded-xl">Cancelar</Button>
            <Button onClick={handleRenameShelf} className="rounded-xl font-bold text-white" style={{ background:'var(--accent-hex)' }}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}