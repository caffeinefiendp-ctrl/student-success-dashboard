import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, PageHeader } from "@/components/shelf/DashboardShell";
import { student } from "@/data/sample-library";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile · ShelfSense" },
      { name: "description", content: "Your student profile and reading history." },
      { property: "og:title", content: "Profile · ShelfSense" },
      { property: "og:description", content: "Your student profile and reading history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const rows = [["Student ID", student.id], ["Programme", student.program], ["Email", student.email], ["Books read", "12 this year"]];
  return (
    <DashboardShell>
      <PageHeader title="Profile" subtitle="Your student account (sample)" />
      <div className="overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="h-28 bg-gradient-brand" />
        <div className="px-6 pb-6">
          <div className="-mt-10 grid h-20 w-20 place-items-center rounded-2xl border-4 border-card bg-navy text-2xl font-bold text-navy-foreground">AM</div>
          <p className="mt-3 text-xl font-bold">{student.name}</p>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k} className="rounded-xl bg-muted p-4"><dt className="text-xs text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </DashboardShell>
  );
}
