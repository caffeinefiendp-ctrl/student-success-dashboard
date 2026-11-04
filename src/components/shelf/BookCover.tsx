import type { Book } from "@/data/sample-library";
import { cn } from "@/lib/utils";
import { useState } from 'react';

/** Renders the cover image, or a typographic cover when no image exists. */
export function BookCover({ book, className }: { book: Book; className?: string }) {
  const [failed, setFailed] = useState('');
  if (book.cover && failed !== book.cover) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden bg-navy", className)}>
        <img src={book.cover} alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full scale-125 object-cover opacity-45 blur-md" />
        <img
          src={book.cover}
          onError={() => setFailed(book.cover)}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          width={672}
          height={992}
          className="relative h-full w-full object-contain drop-shadow-lg"
        />
      </div>
    );
  }
  return (
    <div className={cn("@container relative h-full w-full overflow-hidden bg-navy text-navy-foreground", className)}>
      <div className="flex h-full flex-col justify-between gap-2 p-5 @max-[120px]:gap-1 @max-[120px]:p-2">
      <span className="relative border-b border-navy-foreground/30 pb-4 text-[10px] font-semibold uppercase opacity-80 @max-[120px]:pb-1 @max-[120px]:text-[6px]">{book.category} · {book.edition}</span>
      <div className="relative min-h-0">
        <p className="break-words text-lg font-extrabold leading-tight @max-[120px]:text-[9px]">{book.title}</p>
        <p className="mt-3 text-xs font-medium opacity-80 @max-[120px]:mt-1 @max-[120px]:text-[6px]">{book.author}</p>
      </div>
      <span className="break-all text-[10px] opacity-70 @max-[120px]:hidden">ShelfSense · {book.id}</span>
      </div>
    </div>
  );
}
