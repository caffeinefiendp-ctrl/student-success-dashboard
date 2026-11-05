import { createFileRoute, Link } from '@tanstack/react-router';
import { LibraryBig, BookOpen, BookMarked, CheckCircle2, Inbox, CalendarClock } from 'lucide-react';
import { DashboardShell, PageHeader } from '@/components/shelf/DashboardShell';
import { useLibrary } from '@/components/shelf/LibraryProvider';
import { LibraryReports } from '@/components/shelf/LibraryReports';
import { daysRemaining } from '@/lib/library-state';
import { cn } from '@/lib/utils';

export const Route = createFileRoute('/librarian/')({
  head: () => ({
    meta: [
      { title: 'Librarian Overview · ShelfSense' },
      { name: 'description', content: 'Sample library operations, inventory and activity.' },
      { property: 'og:title', content: 'Librarian Overview · ShelfSense' },
      { property: 'og:description', content: 'Sample library operations, inventory and activity.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  component: LibrarianOverview,
});

const tones = ['bg-primary/10 text-primary', 'bg-accent/12 text-accent', 'bg-navy/10 text-navy', 'bg-warning/15 text-warning'] as const;

function LibrarianOverview() {
  const { state } = useLibrary();
  const loans = state.loans.filter((l) => !l.returnedOn);
  const stats = [
    { label: 'Total titles', value: state.books.length, icon: LibraryBig, to: '/librarian/inventory' },
    { label: 'Total copies', value: state.books.reduce((s, b) => s + b.totalCopies, 0), icon: BookOpen, to: '/librarian/inventory' },
    { label: 'Currently issued', value: loans.length, icon: BookMarked, to: '/librarian/circulation' },
    { label: 'Available titles', value: state.books.filter((b) => b.availableCopies > 0).length, icon: CheckCircle2, to: '/librarian/inventory' },
    { label: 'Pending requests', value: state.requests.filter((r) => r.status === 'Pending').length, icon: Inbox, to: '/librarian/requests' },
    { label: 'Overdue loans', value: loans.filter((l) => daysRemaining(l.dueDate) < 0).length, icon: CalendarClock, to: '/librarian/circulation' },
  ] as const;

  return (
    <DashboardShell>
      <PageHeader title="Library Overview" subtitle="Fictional inventory and activity · Librarian demo" />
      <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-3">
        {stats.map((s, i) => (
          <Link key={s.label} to={s.to} className="card-lift rounded-2xl border bg-card p-5 shadow-card hover:border-primary/40">
            <div className={cn('grid h-11 w-11 place-items-center rounded-xl', tones[i % tones.length])}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-3xl font-extrabold tracking-tight">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>
      <LibraryReports compact />
    </DashboardShell>
  );
}
