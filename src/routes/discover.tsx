import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { DashboardShell, PageHeader } from "@/components/shelf/DashboardShell";
import { BookCard } from "@/components/shelf/BookCard";
import { books, categories } from "@/data/sample-library";
import { cn } from "@/lib/utils";

type S = { q?: string; category?: string };

export const Route = createFileRoute("/discover")({
  validateSearch: (s: Record<string, unknown>): S => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Discover Books · ShelfSense" },
      { name: "description", content: "Search and browse books by title, author and subject." },
      { property: "og:title", content: "Discover Books · ShelfSense" },
      { property: "og:description", content: "Search and browse books by title, author and subject." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Discover,
});

function Discover() {
  const { q = "", category } = Route.useSearch();
  const navigate = useNavigate({ from: "/discover" });
  const [text, setText] = useState(q);
  const term = q.toLowerCase();
  const results = books.filter(
    (b) =>
      (!category || b.category === category) &&
      (!term || [b.title, b.author, b.category, b.description].some((f) => f.toLowerCase().includes(term))),
  );

  return (
    <DashboardShell>
      <PageHeader title="Discover Books" subtitle="Browse the sample catalogue by subject, author or keyword." />
      <form
        onSubmit={(e) => { e.preventDefault(); navigate({ search: (p) => ({ ...p, q: text || undefined }) }); }}
        className="flex items-center gap-2 rounded-2xl border bg-card p-2 shadow-card"
      >
        <Search className="ml-2 h-5 w-5 text-muted-foreground" />
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search books, authors, subjects or ask a question..." className="flex-1 bg-transparent py-2 text-sm outline-none" />
        <button className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Search</button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {[undefined, ...categories.map((c) => c.name)].map((c) => (
          <button
            key={c ?? "all"}
            onClick={() => navigate({ search: (p) => ({ ...p, category: c }) })}
            className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition", category === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}
          >
            {c ?? "All"}
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        {results.length} result{results.length === 1 ? "" : "s"}{q && <> for “<span className="font-semibold text-foreground">{q}</span>”</>}
      </p>
      {results.length ? (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{results.map((b) => <BookCard key={b.id} book={b} />)}</div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed bg-card p-12 text-center">
          <p className="font-semibold">No matches in the sample catalogue</p>
          <p className="mt-1 text-sm text-muted-foreground">Try “Python”, “AI”, or clear the category filter.</p>
        </div>
      )}
    </DashboardShell>
  );
}
