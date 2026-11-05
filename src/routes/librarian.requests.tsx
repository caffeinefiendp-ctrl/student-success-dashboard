import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Check, Search, X } from 'lucide-react';
import { DashboardShell, PageHeader } from '@/components/shelf/DashboardShell';
import { useLibrary } from '@/components/shelf/LibraryProvider';
import { students, type LibraryRequest } from '@/lib/library-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/librarian/requests')({
  head: () => ({
    meta: [
      { title: 'Request Management · ShelfSense' },
      { name: 'description', content: 'Approve or reject sample borrow and renewal requests.' },
      { property: 'og:title', content: 'Request Management · ShelfSense' },
      { property: 'og:description', content: 'Approve or reject sample borrow and renewal requests.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: LibrarianRequests,
});

const statusTone: Record<string, string> = {
  Pending: 'bg-warning/15 text-foreground',
  Approved: 'bg-accent/12 text-accent',
  Rejected: 'bg-destructive/10 text-destructive',
};

function LibrarianRequests() {
  const { state, act } = useLibrary();
  const [filter, setFilter] = useState('Pending');
  const [q, setQ] = useState('');
  const [reject, setReject] = useState<LibraryRequest>();
  const [reason, setReason] = useState('');

  const list = state.requests.filter((r) =>
    (filter === 'All' || r.status === filter) &&
    [r.id, r.studentId, students.find((s) => s.id === r.studentId)?.name, state.books.find((b) => b.id === r.bookId)?.title, r.type]
      .join(' ').toLowerCase().includes(q.toLowerCase()));

  return (
    <DashboardShell>
      <PageHeader title="Request Management" subtitle="Approvals issue a book or extend a renewal by 21 days · Demo" />

      <div className="mb-4 flex flex-wrap gap-2">
        {['Pending', 'Approved', 'Rejected', 'All'].map((f) => (
          <Button key={f} variant={f === filter ? 'default' : 'outline'} onClick={() => setFilter(f)} className="rounded-full">
            {f}
            <span className={cn('ml-1.5 rounded-full px-1.5 text-xs', f === filter ? 'bg-primary-foreground/20' : 'bg-muted text-muted-foreground')}>
              {state.requests.filter((r) => f === 'All' || r.status === f).length}
            </span>
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-2xl border bg-card px-4 py-2 shadow-card">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <Input
          aria-label="Search requests"
          placeholder="Search student, book, request ID or type…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
      </div>

      <div className="mt-5 divide-y rounded-2xl border bg-card shadow-card">
        {list.map((r) => {
          const b = state.books.find((b) => b.id === r.bookId);
          return (
            <article key={r.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-primary">{r.id} · {r.type}</p>
                <p className="font-semibold">{b?.title ?? 'Removed title'}</p>
                <p className="text-sm text-muted-foreground">{students.find((s) => s.id === r.studentId)?.name} · {r.studentId} · {r.requestedOn}</p>
                <p className="text-xs text-muted-foreground">{b?.availableCopies ?? 0} available copies{r.loanId && ` · Current due date: ${state.loans.find((l) => l.id === r.loanId)?.dueDate}`}</p>
                {r.reason && <p className="mt-2 text-sm text-destructive">Reason: {r.reason}</p>}
              </div>
              <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', statusTone[r.status] ?? 'bg-muted')}>{r.status}</span>
              {r.status === 'Pending' && (
                <div className="flex gap-2">
                  <Button size="sm" disabled={r.type === 'Borrow' && (!b || b.availableCopies === 0)} onClick={() => act({ type: 'decide', requestId: r.id, approved: true }, 'Request approved; student view updated')}><Check />Approve</Button>
                  <Button size="sm" variant="outline" onClick={() => { setReject(r); setReason(''); }}><X />Reject</Button>
                </div>
              )}
            </article>
          );
        })}
        {!list.length && <p className="p-10 text-center text-muted-foreground">No matching requests.</p>}
      </div>

      <Dialog open={Boolean(reject)} onOpenChange={(o) => { if (!o) setReject(undefined); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject request</DialogTitle>
            <DialogDescription>The student will see your reason in My Requests.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); if (reject && act({ type: 'decide', requestId: reject.id, approved: false, reason }, 'Request rejected; student notified in demo')) setReject(undefined); }}>
            <Textarea required aria-label="Rejection reason" placeholder="Reason for rejection…" value={reason} onChange={(e) => setReason(e.target.value)} />
            <div className="mt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setReject(undefined)}>Cancel</Button>
              <Button type="submit" variant="destructive" disabled={!reason.trim()}>Reject Request</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}
