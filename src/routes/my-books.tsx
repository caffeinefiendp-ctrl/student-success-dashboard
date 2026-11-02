import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardShell, PageHeader } from "@/components/shelf/DashboardShell";
import { BookCover } from "@/components/shelf/BookCover";
import { Button } from "@/components/ui/button";
import { student } from "@/data/sample-library";
import { useLibrary } from "@/components/shelf/LibraryProvider";
import { daysRemaining } from "@/lib/library-state";
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
  const { state, act } = useLibrary();
  const borrowed = state.loans.filter(l => l.studentId === student.id && !l.returnedOn);
  return (
    <DashboardShell>
      <PageHeader title="My Books" subtitle={`${borrowed.length} books currently on loan`} />
      {borrowed.length === 0 && <p className="py-10 text-center text-muted-foreground">No books currently on loan.</p>}
      <div className="grid gap-4">
        {borrowed.map((l) => {
          const b = state.books.find(b => b.id === l.bookId);
          if (!b) return null;
          const daysLeft = daysRemaining(l.dueDate);
          const totalDays = Math.max(1, Math.round((Date.parse(l.dueDate) - Date.parse(l.issueDate)) / 86400000));
          const renewal = state.requests.some(r => r.loanId === l.id && r.status === "Pending");
          const pct = Math.min(100, Math.max(0, Math.round(((totalDays - daysLeft) / totalDays) * 100)));
          const soon = daysLeft <= 7;
          return (
            <div key={l.id} className="flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-card sm:flex-row sm:items-center">
              <div className="h-28 w-20 shrink-0 overflow-hidden rounded-lg shadow-card"><BookCover book={b} /></div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{b.title}</p>
                <p className="text-sm text-muted-foreground">{b.author}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <div className={cn("h-full rounded-full", soon ? "bg-warning" : "bg-gradient-brand")} style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Borrowed {l.issueDate} · Due <span className="font-semibold text-foreground">{l.dueDate}</span> · {daysLeft < 0 ? `${-daysLeft} days overdue` : `${daysLeft} days left`}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={renewal} onClick={() => act({ type: "request", bookId: b.id, studentId: student.id, loanId: l.id }, "Renewal sent to the demo librarian")}>{renewal ? "Renewal pending" : "Renew"}</Button>
                <Button variant="secondary" onClick={() => act({ type: "remind", loanId: l.id }, l.reminder ? "Demo reminder removed" : "Demo return reminder saved")}>{l.reminder ? "Reminder set" : "Remind me"}</Button>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardShell>
  );
}
