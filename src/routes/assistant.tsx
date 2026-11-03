import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Send, Sparkles } from "lucide-react";
import { DashboardShell, PageHeader } from "@/components/shelf/DashboardShell";
import { Button } from "@/components/ui/button";
import { books } from "@/data/sample-library";
import { cn } from "@/lib/utils";
import { useLibrary } from '@/components/shelf/LibraryProvider';
import { assistantReply } from '@/lib/assistant';

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Library Assistant · ShelfSense" },
      { name: "description", content: "Ask for reading suggestions and study help." },
      { property: "og:title", content: "AI Library Assistant · ShelfSense" },
      { property: "og:description", content: "Ask for reading suggestions and study help." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Assistant,
});

type Msg = { role: "user" | "ai"; text: string };
const prompts = ["Best book to start learning Python?", "Suggest something on neural networks", "How do I write better code?"];

// Demo responder: keyword-matches the sample catalogue. Not a real AI model yet.
function reply(q: string): string {
  const t = q.toLowerCase();
  const hit = books.find((b) => [b.title, b.category, b.description].some((f) => t.split(/\W+/).some((w) => w.length > 3 && f.toLowerCase().includes(w))));
  return hit
    ? `From the sample catalogue, I’d suggest “${hit.title}” by ${hit.author}. ${hit.description}`
    : "I couldn’t find a match in the sample catalogue. Try asking about Python, AI, deep learning or clean code.";
}

function Assistant() {
  const { state } = useLibrary();
  const end = useRef<HTMLDivElement>(null);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "ai", text: "Hi Alex! I’m your library assistant (demo). Ask me for book suggestions on any topic." }]);
  const [text, setText] = useState("");
  useEffect(() => end.current?.scrollIntoView({ block: 'nearest' }), [msgs]);
  const send = (q: string) => {
    if (!q.trim()) return;
    const previous = state.books.find(b => msgs.slice().reverse().some(m => m.role === 'ai' && m.text.includes(`“${b.title}”`)));
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "ai", text: assistantReply(q, state, previous?.id) }]);
    setText("");
  };
  return (
    <DashboardShell>
      <PageHeader title="AI Library Assistant" subtitle="Demo preview — answers come from sample data, not a live AI model." />
      <div className="flex h-[60vh] flex-col overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {msgs.map((m, i) => (
            <div key={i} className={cn("flex gap-3", m.role === "user" && "justify-end")}>
              {m.role === "ai" && <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-brand text-primary-foreground"><Sparkles className="h-4 w-4" /></span>}
              <p className={cn("max-w-[80%] whitespace-pre-line break-words rounded-2xl px-4 py-2.5 text-sm", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted")}>{m.text}</p>
            </div>
          ))}
          <div ref={end}/>
        </div>
        <div className="border-t p-3">
          <div className="mb-2 flex flex-wrap gap-2">
            {[...prompts, 'Where is Deep Learning?', 'Library rules', 'How do I renew?'].map((p) => <Button variant="outline" size="sm" key={p} onClick={() => send(p)} className="h-auto whitespace-normal rounded-full px-3 py-1 text-xs">{p}</Button>)}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex gap-2">
            <input aria-label="Ask the library assistant" value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask a question…" className="min-w-0 flex-1 rounded-xl border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <Button type="submit" size="icon" aria-label="Send"><Send className="h-4 w-4" /></Button>
          </form>
        </div>
      </div>
    </DashboardShell>
  );
}
