import { useState } from "react";
import { Bookmark, BookmarkCheck, Star } from "lucide-react";
import { toast } from "sonner";
import type { Book } from "@/data/sample-library";
import { BookCover } from "./BookCover";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function AvailabilityBadge({ value }: { value: Book["availability"] }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        value === "Available" && "bg-accent/12 text-accent",
        value === "Limited" && "bg-warning/15 text-foreground",
        value === "Waitlist" && "bg-muted text-muted-foreground",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", value === "Available" ? "bg-accent" : value === "Limited" ? "bg-warning" : "bg-muted-foreground")} />
      {value}
    </span>
  );
}

export function BookCard({ book }: { book: Book }) {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const request = () => {
    toast.success(book.availability === "Waitlist" ? "Added to waitlist (demo)" : "Borrow request sent (demo)", {
      description: book.title,
    });
    setOpen(false);
  };

  return (
    <>
      <article className="card-lift group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
            <BookCover book={book} />
          </div>
          <button
            aria-label={saved ? "Remove from saved" : "Save book"}
            onClick={() => {
              setSaved(!saved);
              toast(saved ? "Removed from saved" : "Saved to your reading list");
            }}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground shadow-card backdrop-blur transition hover:bg-card"
          >
            {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">{book.category}</span>
          <h3 className="line-clamp-2 font-semibold leading-snug">{book.title}</h3>
          <p className="line-clamp-1 text-sm text-muted-foreground">{book.author}</p>
          <div className="mt-auto flex items-center justify-between pt-3">
            <AvailabilityBadge value={book.availability} />
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>View Details</Button>
          </div>
        </div>
      </article>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
            <div className="mx-auto aspect-[3/4] w-40 overflow-hidden rounded-xl shadow-lift sm:w-full">
              <BookCover book={book} />
            </div>
            <div className="flex flex-col gap-3">
              <DialogHeader className="text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">{book.category}</span>
                <DialogTitle className="text-xl">{book.title}</DialogTitle>
                <DialogDescription>{book.author}</DialogDescription>
              </DialogHeader>
              <p className="text-sm leading-relaxed text-muted-foreground">{book.description}</p>
              <dl className="grid grid-cols-2 gap-3 rounded-xl bg-muted p-3 text-sm">
                <div><dt className="text-muted-foreground">Published</dt><dd className="font-medium">{book.year}</dd></div>
                <div><dt className="text-muted-foreground">Pages</dt><dd className="font-medium">{book.pages}</dd></div>
                <div><dt className="text-muted-foreground">Shelf</dt><dd className="font-medium">{book.shelf}</dd></div>
                <div><dt className="text-muted-foreground">Rating</dt><dd className="flex items-center gap-1 font-medium"><Star className="h-3.5 w-3.5 fill-warning text-warning" />{book.rating}</dd></div>
              </dl>
              <div className="flex items-center justify-between gap-3">
                <AvailabilityBadge value={book.availability} />
                <Button onClick={request}>{book.availability === "Waitlist" ? "Join Waitlist" : "Request to Borrow"}</Button>
              </div>
              <p className="text-xs text-muted-foreground">Sample data — availability is illustrative, not live.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
