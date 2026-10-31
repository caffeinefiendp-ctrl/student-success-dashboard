import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardShell, PageHeader } from "@/components/shelf/DashboardShell";
import { BookCover } from "@/components/shelf/BookCover";
import { Button } from "@/components/ui/button";
import { borrowed, getBook } from "@/data/sample-library";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/my-books")({
  head: () => ({
    meta: [
      { title: "My Books · ShelfSense" },
      { name: "description", content: "Books you currently have on loan and their due dates." },
      { property: "og:title", content: "My Books · ShelfSense" },
      { property: "og:description", content: "Books you currently have on loan and their due dates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyBooks,
});

function MyBooks() {
  return (
    <DashboardShell>
      <PageHeader title="My Books" subtitle="3 books currently on loan" />
      <div className="grid gap-4">
        {borrowed.map((l) => {
          const b = getBook(l.bookId);
          const pct = Math.round(((l.totalDays - l.daysLeft) / l.totalDays) * 100);
          const soon = l.daysLeft <= 7;
          return (
            <div key={l.bookId} className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-card sm:flex-row sm:items-center">
              <div className="h-28 w-20 shrink-0 overflow-hidden rounded-lg shadow-card"><BookCover book={b} /></div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{b.title}</p>
                <p className="text-sm text-muted-foreground">{b.author}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full", soon ? "bg-warning" : "bg-gradient-brand")} style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Borrowed {l.borrowedOn} · Due <span className="font-semibold text-foreground">{l.due}</span> · {l.daysLeft} days left</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => toast.success("Renewal requested (demo)", { description: b.title })}>Renew</Button>
                <Button variant="secondary" onClick={() => toast("Return reminder set for the day before it’s due")}>Remind me</Button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}
