import { useLibrary } from './LibraryProvider';
import { daysRemaining, students } from '@/lib/library-state';
import { Progress } from '@/components/ui/progress';

export function LibraryReports({ compact = false }: { compact?: boolean }) {
  const { state } = useLibrary();
  const total = state.books.reduce((s,b) => s+b.totalCopies,0);
  const available = state.books.reduce((s,b) => s+b.availableCopies,0);
  const categories = [...new Set(state.books.map(b => b.category))];
  const popular = state.books.map(b => ({ ...b, count: state.loans.filter(l => l.bookId === b.id).length })).sort((a,b) => b.count-a.count).slice(0,5);
  const overdue = state.loans.filter(l => !l.returnedOn && daysRemaining(l.dueDate)<0);
  return <div className="space-y-8">
    <div className="grid gap-8 md:grid-cols-2">
      <section><h3 className="mb-4 text-lg font-bold">Category-wise inventory</h3><div className="space-y-3">{categories.map((c,i) => { const count = state.books.filter(b => b.category===c).reduce((s,b) => s+b.totalCopies,0); return <div key={c}><div className="mb-1 flex justify-between text-sm"><span>{c}</span><span>{count} copies</span></div><Progress value={total ? count/total*100 : 0} className={i%2 ? '[&>div]:bg-accent' : ''} /></div>; })}</div></section>
      <section><h3 className="mb-4 text-lg font-bold">Available versus issued</h3><div className="mb-3 flex items-baseline gap-3"><strong className="text-4xl text-accent">{available}</strong><span className="text-muted-foreground">available / {total} total copies</span></div><Progress value={total ? available/total*100 : 0} className="h-5 [&>div]:bg-accent" /><div className="mt-3 flex justify-between text-sm"><span className="text-accent">Available {available}</span><span className="text-primary">Issued {total-available}</span></div><h3 className="mb-3 mt-8 text-lg font-bold">Most borrowed books</h3>{popular.map((b,i) => <div key={b.id} className="flex justify-between gap-3 border-b py-3 text-sm"><span><span className="mr-2 text-muted-foreground">{i+1}.</span>{b.title}</span><strong className="shrink-0">{b.count} loans</strong></div>)}</section>
    </div>
    {!compact && <section><h3 className="mb-3 text-lg font-bold">Overdue books · {overdue.length}</h3><div className="max-h-96 overflow-auto">{overdue.map(l => <div key={l.id} className="flex flex-wrap justify-between gap-2 border-b py-3 text-sm"><span>{state.books.find(b => b.id===l.bookId)?.title} · {students.find(s => s.id===l.studentId)?.name}</span><span className="text-destructive">Due {l.dueDate} · {-daysRemaining(l.dueDate)} days overdue</span></div>)}{!overdue.length && <p className="text-muted-foreground">No overdue loans.</p>}</div></section>}
    <section><h3 className="mb-3 text-lg font-bold">Recent library activity</h3>{state.activity.slice(0,compact ? 5 : 20).map(a => <div key={a.id} className="flex flex-wrap gap-x-4 gap-y-1 border-b py-3 text-sm"><time className="text-muted-foreground">{a.date}</time><span>{a.text}</span></div>)}</section>
  </div>;
}