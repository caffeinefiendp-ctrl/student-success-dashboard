import { createFileRoute } from '@tanstack/react-router';
import { LibraryBig, BookOpen, BookMarked, CheckCircle2, Inbox, CalendarClock } from 'lucide-react';
import { DashboardShell, PageHeader } from '@/components/shelf/DashboardShell';
import { useLibrary } from '@/components/shelf/LibraryProvider';
import { LibraryReports } from '@/components/shelf/LibraryReports';
import { daysRemaining } from '@/lib/library-state';
export const Route = createFileRoute('/librarian/')({ head: () => ({ meta: [{ title: 'Librarian Overview · ShelfSense' },{ name:'description', content:'Sample library operations, inventory and activity.' },{ property:'og:title',content:'Librarian Overview · ShelfSense' },{ property:'og:description',content:'Sample library operations, inventory and activity.' },{ property:'og:type',content:'website' },{ name:'twitter:card',content:'summary' }] }), component: LibrarianOverview });
function LibrarianOverview() {
 const { state } = useLibrary();
 const loans = state.loans.filter(l=>!l.returnedOn);
 const stats = [{ label:'Total titles',value:state.books.length,icon:LibraryBig },{ label:'Total copies',value:state.books.reduce((s,b)=>s+b.totalCopies,0),icon:BookOpen },{ label:'Currently issued',value:loans.length,icon:BookMarked },{ label:'Available titles',value:state.books.filter(b=>b.availableCopies>0).length,icon:CheckCircle2 },{ label:'Pending requests',value:state.requests.filter(r=>r.status==='Pending').length,icon:Inbox },{ label:'Overdue loans',value:loans.filter(l=>daysRemaining(l.dueDate)<0).length,icon:CalendarClock }];
 return <DashboardShell><PageHeader title="Library Overview" subtitle="Fictional inventory and activity · Librarian demo" /><div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-3">{stats.map((s,i)=><article key={s.label} className="rounded-2xl border bg-card p-5 shadow-card"><s.icon className={i%2 ? 'mb-3 h-6 w-6 text-accent' : 'mb-3 h-6 w-6 text-primary'} /><strong className="text-3xl">{s.value}</strong><p className="text-sm text-muted-foreground">{s.label}</p></article>)}</div><LibraryReports compact /></DashboardShell>;
}