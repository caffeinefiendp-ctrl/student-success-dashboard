import { useState } from "react";
import { Bookmark, BookmarkCheck, MapPin, Star } from "lucide-react";
import { toast } from "sonner";
import { student, type Book } from "@/data/sample-library";
import { BookCover } from "./BookCover";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { floorLabel } from "@/lib/catalogue";
import { useLibrary } from './LibraryProvider';

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
  const { state, act } = useLibrary();
  const saved = state.saved.includes(book.id);

  const request = () => {
    if (act({ type: 'request', bookId: book.id, studentId: student.id }, 'Borrow request sent to the demo librarian')) setOpen(false);
  };

  return (
    <>
      <article className="card-lift group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card">
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
            <BookCover book={book} />
          </div>
          <button
            onClick={() => setOpen(true)}
            aria-label={`View details of ${book.title}`}
            className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-navy/85 via-navy/20 to-transparent pb-5 opacity-0 transition-opacity duration-300 focus-visible:opacity-100 group-hover:opacity-100"
          >
            <span className="rounded-full bg-card px-4 py-1.5 text-xs font-semibold text-foreground shadow-lift">View Details</span>
          </button>
          <Button
            variant="ghost"
            size="icon"
            title={saved ? "Remove from saved" : "Save book"}
            aria-label={saved ? "Remove from saved" : "Save book"}
            onClick={() => {
              act({ type: 'save', bookId: book.id }, saved ? 'Removed from saved' : 'Saved to your reading list');
            }}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-card/90 text-foreground shadow-card backdrop-blur transition hover:bg-card"
          >
            {saved ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">{book.category}</span>
          <h3 className="line-clamp-2 font-semibold leading-snug">{book.title}</h3>
          <p className="line-clamp-1 text-sm text-muted-foreground">{book.author}</p>
          <p className="text-xs text-muted-foreground">{book.availableCopies} of {book.totalCopies} copies available</p>
          <p className="flex items-start gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5 shrink-0" />{floorLabel(book.floor)} · Rack {book.rack}</p>
          <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3">
            <AvailabilityBadge value={book.availability} />
            <Button size="sm" variant="outline" onClick={() => setOpen(true)}>View Details</Button>
          </div>
        </div>
      </article>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90dvh] max-w-2xl overflow-y-auto">
          <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
            <div className="mx-auto aspect-[2/3] w-40 overflow-hidden rounded-xl shadow-lift sm:w-full">
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
                <div><dt className="text-muted-foreground">Edition</dt><dd className="font-medium">{book.edition}</dd></div>
                <div><dt className="text-muted-foreground">Published</dt><dd className="font-medium">{book.year}</dd></div>
                <div><dt className="text-muted-foreground">Pages</dt><dd className="font-medium">{book.pages}</dd></div>
                <div><dt className="text-muted-foreground">Book ID</dt><dd className="break-words font-medium">{book.id}</dd></div>
                <div><dt className="text-muted-foreground">Rating</dt><dd className="flex items-center gap-1 font-medium"><Star className="h-3.5 w-3.5 fill-warning text-warning" />{book.rating}</dd></div>
              </dl>
              <div className="space-y-2 border-y py-3 text-sm">
                <p className="flex items-center gap-2 font-semibold"><MapPin className="h-4 w-4 text-primary" />Physical location</p>
                <dl className="grid grid-cols-2 gap-3">
                  <div><dt className="text-muted-foreground">Floor</dt><dd>{floorLabel(book.floor)}</dd></div>
                  <div><dt className="text-muted-foreground">Section</dt><dd>{book.section}</dd></div>
                  <div><dt className="text-muted-foreground">Rack</dt><dd>{book.rack}</dd></div>
                  <div><dt className="text-muted-foreground">Shelf</dt><dd>{book.shelf}</dd></div>
                </dl>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1"><AvailabilityBadge value={book.availability} /><p className="text-xs text-muted-foreground">{book.availableCopies} of {book.totalCopies} copies available</p></div>
                <Button onClick={request}>{book.availability === "Waitlist" ? "Join Waitlist" : "Request to Borrow"}</Button>
              </div>
              {book.availableCopies === 0 && <div className="border-t pt-3"><p className="text-sm font-semibold">Available alternatives</p>{state.books.filter(b => b.category === book.category && b.availableCopies > 0 && b.id !== book.id).slice(0, 3).map(b => <div key={b.id} className="mt-2 flex items-center justify-between gap-2 text-xs"><span>{b.title} · {b.availableCopies} available · Rack {b.rack}</span><Button size="sm" variant="outline" onClick={() => act({ type: 'request', bookId: b.id, studentId: student.id }, 'Alternative book requested')}>Request</Button></div>)}{!state.books.some(b => b.category === book.category && b.availableCopies > 0) && <p className="text-xs text-muted-foreground">No available alternatives in this category.</p>}</div>}
              <p className="text-xs text-muted-foreground">Fictional demonstration inventory — copies, availability and shelf locations are not real-time library information. Some cover artwork is illustrative.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
