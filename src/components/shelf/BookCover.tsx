import type { Book } from "@/data/sample-library";
import { cn } from "@/lib/utils";
import { useState } from 'react';

/** Renders the cover image, or a typographic cover when no image exists. */
export function BookCover({ book, className }: { book: Book; className?: string }) {
  const [failed, setFailed] = useState('');
  if (book.cover && failed !== book.cover) {
    return (
      <img
        src={book.cover}
        onError={() => setFailed(book.cover)}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        width={672}
        height={992}
        className={cn("h-full w-full object-contain", className)}
      />
    );
  }
  return (
    <div className={cn("relative flex h-full w-full flex-col justify-between overflow-hidden bg-navy p-5 text-navy-foreground", className)}>
      <span className="relative border-b border-navy-foreground/30 pb-4 text-[10px] font-semibold uppercase opacity-80">{book.category} · {book.edition}</span>
      <div className="relative">
        <p className="break-words text-lg font-extrabold leading-tight">{book.title}</p>
        <p className="mt-3 text-xs font-medium opacity-80">{book.author}</p>
      </div>
      <span className="text-[10px] opacity-70">ShelfSense · {book.id}</span>
    </div>
  );
}
