import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { DashboardShell, PageHeader } from "@/components/shelf/DashboardShell";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from 'react';

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · ShelfSense" },
      { name: "description", content: "Manage notifications and reading preferences." },
      { property: "og:title", content: "Settings · ShelfSense" },
      { property: "og:description", content: "Manage notifications and reading preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

const options = [
  { k: "Due date reminders", d: "Get notified 3 days before a book is due", on: true },
  { k: "Request updates", d: "When a request is approved or your waitlist moves", on: true },
  { k: "Weekly recommendations", d: "A weekly digest of AI-picked books", on: false },
];

function SettingsPage() {
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});
  useEffect(() => { try { setPreferences(JSON.parse(sessionStorage.getItem('shelfsense-preferences') ?? '{}')); } catch { toast('Demo preferences could not be restored.'); } }, []);
  return (
    <DashboardShell>
      <PageHeader title="Settings" subtitle="Notification and reading preferences" />
      <div className="divide-y rounded-2xl border bg-card shadow-card">
        {options.map((o) => (
          <label key={o.k} className="flex cursor-pointer items-center justify-between gap-4 p-5">
            <span><span className="block font-medium">{o.k}</span><span className="text-sm text-muted-foreground">{o.d}</span></span>
            <Switch checked={preferences[o.k] ?? o.on} onCheckedChange={(v) => { const next = { ...preferences, [o.k]: v }; setPreferences(next); try { sessionStorage.setItem('shelfsense-preferences', JSON.stringify(next)); } catch { toast('Preference will only last until this page closes.'); } toast(`${o.k} ${v ? 'on' : 'off'} (demo preference)`); }} />
          </label>
        ))}
      </div>
    </DashboardShell>
  );
}
