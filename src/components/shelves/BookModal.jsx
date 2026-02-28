import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import BookCover from '../shared/BookCover';
import ProgressBar from '../shared/ProgressBar';

export default function BookModal({ open, onClose, book, shelves, onUpdateStatus, onUpdateProgress, onMoveToShelf, onRemove }) {
  const [status,  setStatus]  = useState('quero_ler');
  const [shelfId, setShelfId] = useState('');
  const [pages,   setPages]   = useState('0');

  useEffect(() => {
    if (book) {
      setStatus(book.status);
      setShelfId(book.shelf_id || '');
      setPages(String(book.pages_read));
    }
  }, [book]);

  if (!book) return null;

  const percent = Math.min(100, Math.round((Number(pages) / book.total_pages) * 100));

  const handleSave = () => {
    const clampedPages = Math.min(Math.max(0, Number(pages)), book.total_pages);
    onUpdateProgress(book.id, clampedPages);
    onUpdateStatus(book.id, status);
    if (shelfId && shelfId !== book.shelf_id) onMoveToShelf(book.id, shelfId);
    onClose();
  };

  const handleRemove = () => {
    onRemove(book.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="rounded-2xl border-0 shadow-xl w-[calc(100vw-32px)] max-w-sm"
        style={{ background:'var(--bg-card)' }}
        onInteractOutside={e => e.preventDefault()}
        onEscapeKeyDown={onClose}
      >
        <DialogHeader>
          <DialogTitle className="font-bold text-sm leading-snug pr-6" style={{ color:'var(--text-header)' }}>
            {book.title}
          </DialogTitle>
        </DialogHeader>

        {/* Book summary row */}
        <div className="flex gap-3 items-start">
          <div className="flex-shrink-0 rounded-xl overflow-hidden shadow-md" style={{ width:64 }}>
            <BookCover src={book.cover_url} title={book.title} className="rounded-xl" />
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <p className="text-xs" style={{ color:'var(--text-muted)' }}>{book.author}</p>
            <p className="text-xs font-medium" style={{ color:'var(--text-muted)' }}>{book.total_pages} páginas</p>
            <ProgressBar percent={percent} height={5} />
            <p className="text-xs font-bold" style={{ color:'var(--accent)' }}>{percent}%</p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color:'var(--text-muted)' }}>Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="rounded-xl border-0 h-10" style={{ background:'var(--bg-main)' }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lendo">Lendo</SelectItem>
                <SelectItem value="lido">Lido</SelectItem>
                <SelectItem value="quero_ler">Quero ler</SelectItem>
                <SelectItem value="abandonado">Abandonado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color:'var(--text-muted)' }}>
              Progresso (páginas, máx {book.total_pages})
            </label>
            <Input
              type="number" min={0} max={book.total_pages}
              value={pages}
              onChange={e => setPages(e.target.value)}
              className="rounded-xl border-0 h-10"
              style={{ background:'var(--bg-main)' }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium" style={{ color:'var(--text-muted)' }}>Estante</label>
            <Select value={shelfId} onValueChange={setShelfId}>
              <SelectTrigger className="rounded-xl border-0 h-10" style={{ background:'var(--bg-main)' }}>
                <SelectValue placeholder="Selecionar estante" />
              </SelectTrigger>
              <SelectContent>
                {shelves.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-row items-center">
          <Button
            variant="ghost" size="sm"
            onClick={handleRemove}
            className="text-red-400 hover:text-red-500 gap-1 px-2 h-9"
          >
            <Trash2 size={14} />
            Excluir
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-xl h-9">
            Cancelar
          </Button>
          <Button
            size="sm" onClick={handleSave}
            className="rounded-xl h-9 font-bold text-white"
            style={{ background:'var(--accent)' }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}