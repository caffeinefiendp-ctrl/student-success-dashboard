import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { ArrowDownToLine, Search } from 'lucide-react';
import { DashboardShell, PageHeader } from '@/components/shelf/DashboardShell';
import { useLibrary } from '@/components/shelf/LibraryProvider';
import { students, day, addDays, daysRemaining } from '@/lib/library-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/librarian/circulation')({
  head: () => ({
    meta: [
      { title: 'Issue & Return · ShelfSense' },
      { name: 'description', content: 'Issue demo books, process returns and review overdue loans.' },
      { property: 'og:title', content: 'Issue & Return · ShelfSense' },
      { property: 'og:description', content: 'Issue demo books, process returns and review overdue loans.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: Circulation,
});

function Circulation() {
  const { state, act } = useLibrary();
  const [sq, setSq] = useState('');
  const [bq, setBq] = useState('');
  const [sid, setSid] = useState('');
  const [bid, setBid] = useState('');
  const [issued, setIssued] = useState(day());
  const [due, setDue] = useState(addDays(day(), 21));
  const [q, setQ] = useState('');
  const [overdue, setOverdue] = useState(false);

  const loans = state.loans
    .filter((l) => !l.returnedOn)
    .filter((l) => (!overdue || daysRemaining(l.dueDate) < 0) &&
      [l.studentId, students.find((s) => s.id === l.studentId)?.name, state.books.find((b) => b.id === l.bookId)?.title]
        .join(' ').toLowerCase().includes(q.toLowerCase()));

  return (
    <DashboardShell>
      <PageHeader title="Issue & Return" subtitle="Connected fictional loans · Copy counts update after every action" />

      <section className="rounded-2xl border bg-card p-6 shadow-card">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold"><ArrowDownToLine className="h-5 w-5 text-primary" />Issue a book</h3>
        <form
          onSubmit={(e) => { e.preventDefault(); if (act({ type: 'issue', bookId: bid, studentId: sid, issueDate: issued, dueDate: due }, 'Book issued and availability updated')) setBid(''); }}
          className="grid gap-4 md:grid-cols-2"
        >
          <div className="space-y-2">
            <Label htmlFor="student-search">Student</Label>
            <Input id="student-search" placeholder="Search name or roll number" value={sq} onChange={(e) => setSq(e.target.value)} />
            <Select value={sid} onValueChange={setSid}>
              <SelectTrigger aria-label="Select student"><SelectValue placeholder="Select student" /></SelectTrigger>
              <SelectContent>
                {students.filter((s) => `${s.name} ${s.id}`.toLowerCase().includes(sq.toLowerCase())).map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name} · {s.id}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="issue-book-search">Book</Label>
            <Input id="issue-book-search" placeholder="Search book title or author" value={bq} onChange={(e) => setBq(e.target.value)} />
            <Select value={bid} onValueChange={setBid}>
              <SelectTrigger aria-label="Select book"><SelectValue placeholder="Select available book" /></SelectTrigger>
              <SelectContent>
                {state.books.filter((b) => b.availableCopies > 0 && `${b.title} ${b.author}`.toLowerCase().includes(bq.toLowerCase())).map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.title} · {b.availableCopies} available</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="issue-date">Issue date</Label>
            <Input id="issue-date" type="date" required max={day()} value={issued} onChange={(e) => setIssued(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="due-date">Due date</Label>
            <Input id="due-date" type="date" required min={addDays(issued || day(), 1)} value={due} onChange={(e) => setDue(e.target.value)} />
          </div>
          <Button type="submit" disabled={!sid || !bid} className="w-fit">Issue Book</Button>
        </form>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-bold">Active loans · {loans.length}</h3>
          <Button variant={overdue ? 'default' : 'outline'} onClick={() => setOverdue(!overdue)}>{overdue ? 'Show all loans' : 'Overdue only'}</Button>
        </div>
        <div className="flex items-center gap-2 rounded-2xl border bg-card px-4 py-2 shadow-card">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            aria-label="Search active loans"
            placeholder="Search student, roll number or book to process a return…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="mt-4 overflow-x-auto rounded-2xl border bg-card shadow-card">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
              <tr>{['Student', 'Book', 'Issued', 'Due', 'Status', 'Return'].map((h) => <th key={h} className="p-4 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {loans.map((l) => (
                <tr key={l.id} className="border-t transition-colors hover:bg-muted/50">
                  <td className="p-4">{students.find((s) => s.id === l.studentId)?.name}<p className="text-xs text-muted-foreground">{l.studentId}</p></td>
                  <td className="max-w-64 p-4">{state.books.find((b) => b.id === l.bookId)?.title}</td>
                  <td className="p-4">{l.issueDate}</td>
                  <td className="p-4">{l.dueDate}</td>
                  <td className="p-4">
                    {daysRemaining(l.dueDate) < 0
                      ? <span className="inline-flex rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">{-daysRemaining(l.dueDate)} days overdue</span>
                      : <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', daysRemaining(l.dueDate) <= 7 ? 'bg-warning/15 text-foreground' : 'bg-accent/12 text-accent')}>{daysRemaining(l.dueDate)} days left</span>}
                  </td>
                  <td className="p-4"><Button variant="outline" size="sm" aria-label={`Return ${l.id}`} onClick={() => act({ type: 'return', loanId: l.id }, 'Return recorded; copy is available')}>Return</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loans.length && <p className="p-8 text-center text-muted-foreground">No matching active loans.</p>}
        </div>
      </section>
    </DashboardShell>
  );
}
