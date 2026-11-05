import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { DashboardShell, PageHeader } from "@/components/shelf/DashboardShell";
import { BookCard } from "@/components/shelf/BookCard";
import { books, catalogueCategories, availabilityOptions } from "@/data/sample-library";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { filterBooks } from "@/lib/catalogue";
import { cn } from "@/lib/utils";
import { useLibrary } from '@/components/shelf/LibraryProvider';

const searchSchema = z.object({
  q: fallback(z.string(), "").optional(),
  category: fallback(z.string(), "").optional(),
  availability: fallback(z.string(), "").optional(),
});

export const Route = createFileRoute("/discover")({
  validateSearch: zodValidator(searchSchema),
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
  const { state } = useLibrary();
  const books = state.books;
  const catalogueCategories = [...new Set(books.map(b => b.category))];
  const { q = "", category, availability } = Route.useSearch();
  const navigate = useNavigate({ from: "/discover" });
  const [text, setText] = useState(q);
  useEffect(() => setText(q), [q]);
  const results = filterBooks(books, { q, category, availability });
  const clearFilters = () => {
    setText("");
    navigate({ search: { q: undefined, category: undefined, availability: undefined } });
  };

  return (
    <DashboardShell>
      <PageHeader title="Discover Books" subtitle="Browse the sample catalogue by subject, author or keyword." />
      <form
        onSubmit={(e) => { e.preventDefault(); navigate({ search: (p) => ({ ...p, q: text.trim() || undefined }) }); }}
        className="flex items-center gap-2 rounded-2xl border bg-card p-2 shadow-card"
      >
        <Search className="ml-2 h-5 w-5 shrink-0 text-muted-foreground" />
        <input aria-label="Search catalogue" value={text} onChange={(e) => setText(e.target.value)} placeholder="Search books, authors, subjects or keywords..." className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" />
        <Button type="submit" className="rounded-xl px-5">Search</Button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {[undefined, ...catalogueCategories].map((c) => {
          const count = c ? books.filter((b) => b.category === c).length : books.length;
          return (
            <Button
              variant={category === c ? "default" : "outline"}
              aria-pressed={category === c}
              key={c ?? "all"}
              onClick={() => navigate({ search: (p) => ({ ...p, category: c }) })}
              className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition", category === c ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted")}
            >
              {c ?? "All"}
              <span className={cn("ml-1.5 rounded-full px-1.5 text-xs", category === c ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground")}>{count}</span>
            </Button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Select value={availability || "all"} onValueChange={(value) => navigate({ search: (p) => ({ ...p, availability: value === "all" ? undefined : value }) })}>
          <SelectTrigger aria-label="Availability" className="w-48 bg-card"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All availability</SelectItem>
            {availabilityOptions.map((value) => <SelectItem key={value} value={value}>{value}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="ghost" onClick={clearFilters} disabled={!q && !category && !availability && !text}><X />Clear filters</Button>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Fictional demonstration inventory — availability, copy counts and shelf locations are not real-time library information.</p>
      <p aria-live="polite" className="mt-6 text-sm text-muted-foreground">
        {results.length} result{results.length === 1 ? "" : "s"}{q && <> for “<span className="font-semibold text-foreground">{q}</span>”</>}
      </p>
      {results.length ? (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{results.map((b) => <BookCard key={b.id} book={b} />)}</div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed bg-card p-12 text-center">
          <p className="font-semibold">No matches in the sample catalogue</p>
          <Button variant="outline" className="mt-3" onClick={clearFilters}><X />Clear filters</Button>
        </div>
      )}
    </DashboardShell>
  );
}
