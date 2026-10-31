import { useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, BookMarked, Compass, LayoutDashboard, LibraryBig, LogOut, Menu, Search, Settings, Sparkles, User, Inbox } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { student } from "@/data/sample-library";
import { cn } from "@/lib/utils";

const main = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/discover", label: "Discover Books", icon: Compass },
  { to: "/my-books", label: "My Books", icon: BookMarked },
  { to: "/requests", label: "My Requests", icon: Inbox },
  { to: "/assistant", label: "AI Library Assistant", icon: Sparkles },
] as const;
const bottom = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const item = (n: (typeof main)[number] | (typeof bottom)[number]) => {
    const active = path === n.to;
    return (
      <Link
        key={n.to}
        to={n.to}
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
          active ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lift" : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        )}
      >
        <n.icon className="h-[18px] w-[18px]" />
        {n.label}
      </Link>
    );
  };
  return (
    <div className="flex h-full flex-col bg-sidebar p-4">
      <Link to="/" onClick={onNavigate} className="mb-8 flex items-center gap-2.5 px-2 pt-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground shadow-lift">
          <LibraryBig className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-lg font-bold tracking-tight text-sidebar-accent-foreground">ShelfSense</span>
          <span className="block text-[11px] text-sidebar-foreground">AI Library Companion</span>
        </span>
      </Link>
      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/60">Menu</p>
      <nav className="flex flex-col gap-1">{main.map(item)}</nav>
      <div className="mt-auto rounded-2xl bg-sidebar-accent p-4 text-sm">
        <Sparkles className="mb-2 h-5 w-5 text-accent" />
        <p className="font-semibold text-sidebar-accent-foreground">Ask the AI assistant</p>
        <p className="mt-1 text-xs text-sidebar-foreground">Get reading suggestions for any subject.</p>
      </div>
      <nav className="mt-4 flex flex-col gap-1 border-t border-sidebar-border pt-4">{bottom.map(item)}</nav>
    </div>
  );
}

const notifications = [
  { t: "“Clean Code” is due in 3 days", s: "Return by Nov 3" },
  { t: "Your request REQ-1039 is being reviewed", s: "2 hours ago" },
  { t: "New arrivals in Artificial Intelligence", s: "Yesterday" },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [unread, setUnread] = useState(true);
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">
        <NavList />
      </aside>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72 border-0 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <NavList onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur md:px-8">
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl border bg-card lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-bold md:text-lg" suppressHydrationWarning>{greet}, {student.first}!</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">Saturday, October 31 · Here’s your reading at a glance</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/discover", search: { q } });
            }}
            className="ml-auto hidden w-72 items-center gap-2 rounded-xl border bg-card px-3 py-2 md:flex"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Quick search…" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </form>
          <Link to="/discover" aria-label="Search" className="ml-auto grid h-10 w-10 place-items-center rounded-xl border bg-card md:hidden">
            <Search className="h-4 w-4" />
          </Link>
          <Popover onOpenChange={(o) => o && setUnread(false)}>
            <PopoverTrigger aria-label="Notifications" className="relative grid h-10 w-10 place-items-center rounded-xl border bg-card transition hover:bg-muted">
              <Bell className="h-4 w-4" />
              {unread && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
              <p className="border-b px-4 py-3 text-sm font-semibold">Notifications</p>
              {notifications.map((n) => (
                <div key={n.t} className="border-b px-4 py-3 last:border-0">
                  <p className="text-sm font-medium">{n.t}</p>
                  <p className="text-xs text-muted-foreground">{n.s}</p>
                </div>
              ))}
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="Account" className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-brand text-sm font-bold text-primary-foreground">
              AM
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {student.name}
                <span className="block text-xs font-normal text-muted-foreground">{student.id}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast("Sign-in isn’t set up yet — this is a demo dashboard.")}><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
        <footer className="px-8 pb-6 text-center text-xs text-muted-foreground">ShelfSense demo · All books, loans and availability shown are sample data.</footer>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
