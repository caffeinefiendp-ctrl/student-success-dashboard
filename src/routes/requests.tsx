import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Inbox } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, PageHeader } from "@/components/shelf/DashboardShell";
import { Button } from "@/components/ui/button";
import { getBook, requests as initial } from "@/data/sample-library";

export const Route = createFileRoute("/requests")({
  head: () => ({
    meta: [
      { title: "My Requests · ShelfSense" },
      { name: "description", content: "Track your borrow requests and waitlist positions." },
      { property: "og:title", content: "My Requests · ShelfSense" },
      { property: "og:description", content: "Track your borrow requests and waitlist positions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Requests,
});

function Requests() {
  const [list, setList] = useState(initial);
  return (
    <DashboardShell>
      <PageHeader title="My Requests" subtitle={`${list.length} pending request${list.length === 1 ? "" : "s"}`}>
        <Button asChild><Link to="/discover">New request</Link></Button>
      </PageHeader>
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
          <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No pending requests</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          {list.map((r) => {
            const b = "bookId" in r && r.bookId ? getBook(r.bookId) : null;
            return (
              <div key={r.id} className="flex flex-col gap-3 border-b p-5 last:border-0 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-primary">{r.id}</p>
                  <p className="font-semibold">{b?.title ?? ("title" in r ? r.title : "")}</p>
                  <p className="text-sm text-muted-foreground">{b?.author ?? ("author" in r ? r.author : "")} · Requested {r.requested}</p>
                </div>
                <span className="w-fit rounded-full bg-accent/12 px-3 py-1 text-xs font-semibold text-accent">{r.status}</span>
                <Button variant="ghost" onClick={() => { setList((l) => l.filter((x) => x.id !== r.id)); toast("Request cancelled"); }}>Cancel</Button>
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
