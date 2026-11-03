import { useState } from 'react';
import { type Book, catalogueCategories } from '@/data/sample-library';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLibrary } from './LibraryProvider';
import { BookCover } from './BookCover';

export function BookForm({ book, onDone }: { book?: Book | undefined; onDone: () => void }) {
  const { act, state } = useLibrary();
  const [value, setValue] = useState<Book>(book ?? { id: `book-${crypto.randomUUID().slice(0,8)}`, title: '', author: '', isbn: '', category: 'Computer Science', edition: '1st', description: '', cover: '', availableCopies: 1, totalCopies: 1, floor: 1, section: '', rack: '', shelf: '', year: 2026, pages: 1, rating: 0, keywords: [], availability: 'Limited' });
  const update = (key: keyof Book, input: string) => setValue(v => ({ ...v, [key]: ['totalCopies','availableCopies','floor'].includes(key) ? Number(input) : input }));
  const fields = [['title','Title'],['author','Author'],['isbn','ISBN'],['edition','Edition'],['totalCopies','Total Copies'],['availableCopies','Available Copies'],['floor','Floor'],['section','Section'],['rack','Rack'],['shelf','Shelf']] as const;
  const active = state.loans.filter(l => l.bookId === value.id && !l.returnedOn).length;
  return <form className="space-y-4" onSubmit={e => { e.preventDefault(); if (act({ type: 'saveBook', book: { ...value, keywords: [value.title, value.category, value.author] } }, book ? 'Book updated in both demo views' : 'Book added to the demo catalogue')) onDone(); }}>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{fields.map(([key,label]) => <div key={key}><Label htmlFor={`book-${key}`}>{label}</Label><Input id={`book-${key}`} type={['totalCopies','availableCopies','floor'].includes(key) ? 'number' : 'text'} required={key !== 'isbn'} min={key==='totalCopies' ? 1 : 0} step={1} value={value[key] ?? ''} onChange={e => update(key,e.target.value)} /></div>)}
      <div><Label htmlFor="book-category">Category</Label><Input id="book-category" list="categories" required value={value.category} onChange={e => update('category',e.target.value)} /><datalist id="categories">{catalogueCategories.map(c => <option key={c} value={c} />)}</datalist></div>
      <div><Label htmlFor="book-cover">Cover Image URL</Label><Input id="book-cover" type="url" value={value.cover} onChange={e => update('cover',e.target.value)} placeholder="https://…" /></div>
    </div>
    <div><Label htmlFor="book-description">Description</Label><Textarea id="book-description" required value={value.description} onChange={e => update('description',e.target.value)} /></div>
    <div className="flex items-center gap-4"><div className="aspect-[2/3] w-20 shrink-0 overflow-hidden rounded-md bg-muted"><BookCover book={value} /></div><p className="text-xs text-muted-foreground">{active} active loans · Available copies must equal total copies minus active loans. A title-specific cover appears when no image loads.</p></div>
    <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onDone}>Cancel</Button><Button type="submit">Save Book</Button></div>
  </form>;
}