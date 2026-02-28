import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProgressBar from './ProgressBar';

export default function ProgressModal({ open, onClose, book, onSave }) {
  const [mode,  setMode]  = useState('pages');
  const [value, setValue] = useState('0');

  useEffect(() => {
    if (!book) return;
    setValue(mode === 'pages'
      ? String(book.pages_read)
      : String(Math.round((book.pages_read / book.total_pages) * 100))
    );
  }, [book, mode]);

  if (!book) return null;

  const percent = mode === 'pages'
    ? Math.min(100, Math.round((Number(value) / book.total_pages) * 100))
    : Math.min(100, Number(value));

  const handleSave = () => {
    let pages;
    if (mode === 'pages') {
      pages = Math.min(Number(value), book.total_pages);
    } else {
      pages = Math.min(Math.round((Number(value) / 100) * book.total_pages), book.total_pages);
    }
    onSave(book.id, Math.max(0, pages));
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="rounded-2xl border-0 shadow-xl w-[calc(100vw-32px)] max-w-sm"
        style={{ background: 'var(--bg-card)' }}
      >
        <DialogHeader>
          <DialogTitle className="font-bold text-base" style={{ color: 'var(--text-header)' }}>
            Atualizar Progresso
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-main)' }}>{book.title}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{book.total_pages} páginas no total</p>
          </div>

          <Select value={mode} onValueChange={v => { setMode(v); }}>
            <SelectTrigger className="rounded-xl border-0 h-10" style={{ background: 'var(--bg-main)' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pages">Inserir em páginas</SelectItem>
              <SelectItem value="percent">Inserir em percentual</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Input
              type="number"
              min={0}
              max={mode === 'pages' ? book.total_pages : 100}
              value={value}
              onChange={e => setValue(e.target.value)}
              className="rounded-xl border-0 text-center text-2xl font-bold h-14"
              style={{ background: 'var(--bg-main)', color: 'var(--accent-hex)' }}
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            >
              {mode === 'pages' ? 'págs' : '%'}
            </span>
          </div>

          <div className="space-y-1.5">
            <ProgressBar percent={percent} height={8} />
            <p className="text-xs text-right font-bold" style={{ color: 'var(--accent-hex)' }}>
              {percent}% concluído
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 flex-row justify-end">
          <Button
            variant="outline" onClick={onClose}
            className="rounded-xl h-10"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-xl h-10 text-white font-bold glow-accent"
            style={{ background: 'var(--accent-hex)' }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}