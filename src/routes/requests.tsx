import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Inbox } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell, PageHeader } from "@/components/shelf/DashboardShell";
import { Button } from "@/components/ui/button";
import { student } from "@/data/sample-library";
import { useLibrary } from "@/components/shelf/LibraryProvider";
import { students } from "@/lib/library-state";
import { formatRoomRequestMessage } from "@/lib/request-message";
import { Textarea } from "@/components/ui/textarea";

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
  const { state, act } = useLibrary();
  const [copyFallback, setCopyFallback] = useState<{ requestId: string; message: string }>();
  const list = state.requests.filter(r => r.studentId === student.id);
  const copyRoomMessage = async (requestId: string, message: string) => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(message);
      setCopyFallback(undefined);
      toast.success('Copied. Paste the message into ShelfSense-Library and send it for AI analysis.');
    } catch {
      setCopyFallback({ requestId, message });
      toast.error('Clipboard access is unavailable. Select and copy the message shown below.');
    }
  };
  return (
    <DashboardShell>
      <PageHeader title="My Requests" subtitle={`${list.filter(r => r.status === "Pending").length} pending · ${list.length} total requests`}>
        <Button asChild><Link to="/discover">New request</Link></Button>
      </PageHeader>
      <div className="mb-5 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
        <p className="font-semibold">Manual AI review handoff · demo only</p>
        <p className="mt-1 text-muted-foreground">For a pending request, copy its structured room message and paste it into the ShelfSense-Library Switch room. It is not sent automatically. The AI can analyze it; only a librarian should approve or reject it.</p>
      </div>
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-card p-12 text-center">
          <Inbox className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No pending requests</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
          {list.map((r) => {
            const b = state.books.find(b => b.id === r.bookId);
            const roomMessage = b ? formatRoomRequestMessage({ request: r, book: b, studentName: students.find(s => s.id === r.studentId)?.name ?? r.studentId }) : '';
            return (
              <div key={r.id} className="flex flex-col gap-3 border-b p-5 last:border-0 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-primary">{r.id}</p>
                  <p className="font-semibold">{b?.title ?? "Removed title"}</p>
                  <p className="text-sm text-muted-foreground">{b?.author} · {r.type} · Requested {r.requestedOn}</p>
                </div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${r.status === 'Approved' ? 'bg-accent/12 text-accent' : r.status === 'Rejected' ? 'bg-destructive/10 text-destructive' : 'bg-warning/15 text-foreground'}`}>{r.status}</span>
                {r.reason && <p className="text-xs text-destructive">{r.reason}</p>}
                {r.status === 'Pending' && b && <Button variant="outline" onClick={() => void copyRoomMessage(r.id, roomMessage)}><Copy className="h-4 w-4" />Copy room message</Button>}
                {r.status === 'Pending' && copyFallback?.requestId === r.id && <Textarea aria-label={`Structured room message for ${r.id}`} readOnly value={copyFallback.message} onFocus={(event) => event.currentTarget.select()} className="basis-full" />}
                {r.status === "Pending" && <Button variant="ghost" onClick={() => act({ type: "cancel", requestId: r.id }, "Request cancelled")}>Cancel</Button>}
              </div>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
