import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BookOpen, BookOpenCheck, Briefcase, BrainCircuit, CalendarClock, Code2, FlaskConical, Hourglass, Search, Sigma } from "lucide-react";
import { toast } from "sonner";
import hero from "@/assets/hero-library.jpg";
import { DashboardShell } from "@/components/shelf/DashboardShell";
import { BookCard } from "@/components/shelf/BookCard";
import { BookCover } from "@/components/shelf/BookCover";
import { Button } from "@/components/ui/button";
import { recommendedBooks as curated, categories, student } from "@/data/sample-library";
import { useLibrary } from "@/components/shelf/LibraryProvider";
import { daysRemaining } from "@/lib/library-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview · ShelfSense Student Dashboard" },
      { name: "description", content: "Your ShelfSense student dashboard: borrowed books, due dates, requests and AI-powered recommendations." },
      { property: "og:title", content: "ShelfSense Student Dashboard" },
      { property: "og:description", content: "Find books, explore knowledge, and stay ahead of your reading journey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});

export const categoryIcons = { Code2, BrainCircuit, Sigma, FlaskConical, Briefcase };

const stats = [
  { label: "Currently Borrowed", value: 3, icon: BookOpen, tone: "bg-primary/10 text-primary", to: "/my-books" },
  { label: "Due This Week", value: 1, icon: CalendarClock, tone: "bg-warning/15 text-warning", to: "/my-books" },
  { label: "Pending Requests", value: 2, icon: Hourglass, tone: "bg-accent/12 text-accent", to: "/requests" },
  { label: "Books Read", value: 12, icon: BookOpenCheck, tone: "bg-navy/10 text-navy", to: "/profile" },
] as const;

const toneTile = {
  primary: "from-primary/15 to-primary/5 text-primary",
  accent: "from-accent/15 to-accent/5 text-accent",
  navy: "from-navy/15 to-navy/5 text-navy",
} as const;

function Overview() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { state, act } = useLibrary();
  const borrowed = state.loans.filter(l => l.studentId === student.id && !l.returnedOn);
  const loan = [...borrowed].sort((a,b) => a.dueDate.localeCompare(b.dueDate))[0];
  const loanBook = state.books.find(b => b.id === loan?.bookId);
  const remaining = loan ? daysRemaining(loan.dueDate) : 0;
  const totalDays = loan ? Math.max(1, (Date.parse(loan.dueDate) - Date.parse(loan.issueDate))/86400000) : 1;
  const pct = Math.min(100, Math.max(0, Math.round((totalDays - remaining)/totalDays*100)));
  const recommendedBooks = curated.flatMap(b => { const live = state.books.find(x => x.id === b.id); return live ? [live] : []; });
  const statValues = [borrowed.length, borrowed.filter(l => daysRemaining(l.dueDate) <= 7).length, state.requests.filter(r => r.studentId === student.id && r.status === "Pending").length, 12];

  return (
    <DashboardShell>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl shadow-lift">
        <img src={hero} alt="Modern university library with students studying" width={1920} height={800} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative max-w-2xl px-6 py-12 text-navy-foreground md:px-12 md:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-card/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> AI-powered discovery
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">Your next great discovery starts here.</h2>
          <p className="mt-3 max-w-lg text-base opacity-85 md:text-lg">Find books, explore knowledge, and stay ahead of your reading journey.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!q.trim()) { toast("Type a book, author, subject or question first."); return; }
              navigate({ to: "/discover", search: { q: q.trim() } });
            }}
            className="mt-7 flex flex-col gap-2 rounded-2xl bg-card p-2 shadow-lift sm:flex-row"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search books, authors, subjects or ask a question..."
                className="w-full bg-transparent py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 rounded-xl px-7">Search</Button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Link key={s.label} to={s.to} className="card-lift group rounded-2xl border bg-card p-5 shadow-card hover:border-primary/40">
            <div className="flex items-start justify-between">
              <div className={cn("grid h-11 w-11 place-items-center rounded-xl", s.tone)}>
                <s.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 -rotate-45 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
            </div>
            <p className="mt-4 text-3xl font-extrabold tracking-tight">{statValues[i]}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </section>

      {/* Recommended */}
      <section className="mt-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">Recommended For You</h3>
            <p className="text-sm text-muted-foreground">Picked from your recent reading in CS and AI</p>
          </div>
          <Link to="/discover" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">See all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {recommendedBooks.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      </section>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Categories */}
        <section>
          <h3 className="mb-5 text-xl font-bold tracking-tight">Explore Categories</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {categories.map((c, i) => {
              const Icon = categoryIcons[c.icon];
              return (
                <Link
                  key={c.name}
                  to="/discover"
                  search={{ category: c.name }}
                  className={cn("card-lift group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-card", toneTile[c.tone], i === 0 && "sm:col-span-2 sm:row-span-1")}
                >
                  <Icon className="h-7 w-7" />
                  <p className="mt-8 font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{state.books.filter(b => b.category === c.name).length} titles</p>
                  <Icon className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10 transition-transform group-hover:scale-110" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* Upcoming return */}
        <section>
          <h3 className="mb-5 text-xl font-bold tracking-tight">Upcoming Returns</h3>
          {loan && loanBook ? <div className="rounded-2xl border bg-card p-5 shadow-card">
            <div className="flex gap-4">
              <div className="h-28 w-20 shrink-0 overflow-hidden rounded-lg shadow-card"><BookCover book={loanBook} /></div>
              <div className="min-w-0">
                <p className="font-semibold">{loanBook.title}</p>
                <p className="text-sm text-muted-foreground">{loanBook.author}</p>
                <span className="mt-2 inline-flex rounded-full bg-warning/15 px-2.5 py-1 text-xs font-semibold">{remaining < 0 ? `${-remaining} days overdue` : `Due in ${remaining} days`}</span>
              </div>
            </div>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                <span>Borrowed {loan.issueDate}</span>
                <span className="font-semibold text-foreground">Due {loan.dueDate}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-brand" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{pct}% of loan period used</p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button variant="outline" disabled={state.requests.some(r => r.loanId === loan.id && r.status === "Pending")} onClick={() => act({ type: "request", bookId: loan.bookId, studentId: student.id, loanId: loan.id }, "Demo renewal saved. Copy its room message from My Requests for manual AI review.")}>Renew</Button>
              <Button onClick={() => navigate({ to: "/my-books" })}>View loans</Button>
            </div>
          </div> : <p className="py-8 text-muted-foreground">No upcoming returns.</p>}
        </section>
      </div>
    </DashboardShell>
  );
}
