import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { DashboardShell, PageHeader } from '@/components/shelf/DashboardShell';
import { useLibrary } from '@/components/shelf/LibraryProvider';
import { BookForm } from '@/components/shelf/BookForm';
import { BookCover } from '@/components/shelf/BookCover';
import { AvailabilityBadge } from '@/components/shelf/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Book } from '@/data/sample-library';
import { filterBooks, floorLabel } from '@/lib/catalogue';

export const Route = createFileRoute('/librarian/inventory')({
  head: () => ({
    meta: [
      { title: 'Inventory Management · ShelfSense' },
      { name: 'description', content: 'Manage fictional books, copies and shelf locations.' },
      { property: 'og:title', content: 'Inventory Management · ShelfSense' },
      { property: 'og:description', content: 'Manage fictional books, copies and shelf locations.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: Inventory,
});

function Inventory() {
  const { state, act } = useLibrary();
  const [q, setQ] = useState('');
  const [form, setForm] = useState(false);
  const [editing, setEditing] = useState<Book>();
  const [deleting, setDeleting] = useState<Book>();
  const result = filterBooks(state.books, { q });

  return (
    <DashboardShell>
      <PageHeader title="Inventory Management" subtitle={`${state.books.length} fictional titles · Shared student catalogue`}>
        <Button onClick={() => { setEditing(undefined); setForm(true); }}><Plus />Add Book</Button>
      </PageHeader>

      <div className="flex items-center gap-2 rounded-2xl border bg-card px-4 py-2 shadow-card">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          aria-label="Search inventory"
          placeholder="Search title, author, category or keyword…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border bg-card shadow-card">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
            <tr>{['Book', 'Category', 'Copies', 'Availability', 'Physical location', 'Actions'].map((h) => <th key={h} className="p-4 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {result.map((b) => (
              <tr key={b.id} className="border-t transition-colors hover:bg-muted/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="aspect-[2/3] w-12 shrink-0 overflow-hidden rounded-md shadow-card"><BookCover book={b} /></div>
                    <div className="max-w-64">
                      <p className="font-semibold">{b.title}</p>
                      <p className="text-xs text-muted-foreground">{b.author} · {b.edition} ed.</p>
                      <p className="text-xs text-muted-foreground">{b.id}{b.isbn ? ` · ISBN ${b.isbn}` : ''}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">{b.category}</td>
                <td className="p-4"><span className="font-semibold">{b.availableCopies}</span><span className="text-muted-foreground">/{b.totalCopies}</span></td>
                <td className="p-4"><AvailabilityBadge value={b.availability} /></td>
                <td className="p-4 text-xs">{floorLabel(b.floor)} · {b.section}<br />Rack {b.rack} · Shelf {b.shelf}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" aria-label={`Edit ${b.title}`} title="Edit book" onClick={() => { setEditing(b); setForm(true); }}><Pencil /></Button>
                    <Button variant="ghost" size="icon" aria-label={`Delete ${b.title}`} title="Delete book" onClick={() => setDeleting(b)}><Trash2 className="text-destructive" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!result.length && <p className="p-8 text-center text-muted-foreground">No matching books.</p>}
      </div>

      <Dialog open={form} onOpenChange={setForm}>
        <DialogContent className="max-h-[90dvh] max-w-2xl overflow-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Book' : 'Add Book'}</DialogTitle>
            <DialogDescription>Changes update both demo views in this session.</DialogDescription>
          </DialogHeader>
          <BookForm key={editing?.id ?? 'new'} book={editing} onDone={() => setForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(deleting)} onOpenChange={(o) => { if (!o) setDeleting(undefined); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this book?</DialogTitle>
            <DialogDescription>{deleting?.title} will be removed from the demo catalogue. Active loans and pending requests must be resolved first.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleting(undefined)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { if (deleting && act({ type: 'deleteBook', bookId: deleting.id }, 'Book deleted')) setDeleting(undefined); }}>Delete Book</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
