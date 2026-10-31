import type { Book } from "@/data/sample-library";
import { cn } from "@/lib/utils";

/** Renders the cover image, or a typographic cover when no image exists. */
export function BookCover({ book, className }: { book: Book; className?: string }) {
  if (book.cover) {
    return (
      <img
        src={book.cover}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        width={672}
        height={992}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return (
    <div className={cn("relative flex h-full w-full flex-col justify-between overflow-hidden bg-navy p-5 text-navy-foreground", className)}>
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-brand opacity-80 blur-sm" />
      <div className="absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-warning/80" />
      <span className="relative text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">3rd Edition</span>
      <div className="relative">
        <p className="text-2xl font-extrabold leading-tight">{book.title}</p>
        <p className="mt-3 text-xs font-medium uppercase tracking-widest opacity-80">{book.author}</p>
      </div>
    </div>
  );
}
