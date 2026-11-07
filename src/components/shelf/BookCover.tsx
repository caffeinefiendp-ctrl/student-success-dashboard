
import type { Book } from "@/data/sample-library";
import { cn } from "@/lib/utils";
import { useState } from "react";

const LOVABLE_ASSET_HOST =
  "https://id-preview--4a032c43-fdcc-406a-8dc8-0543c65c43b5.lovable.app";

/** Renders the cover image, or a typographic cover when no image exists. */
export function BookCover({
  book,
  className,
}: {
  book: Book;
  className?: string;
}) {
  const [failed, setFailed] = useState("");

  const coverSrc = book.cover?.startsWith("/__l5e/assets-v1/")
    ? `${LOVABLE_ASSET_HOST}${book.cover}`
    : book.cover;

  if (coverSrc && failed !== coverSrc) {
    return (
      <div className={cn("relative h-full w-full overflow-hidden bg-navy", className)}>
        <img
          src={coverSrc}
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full scale-125 object-cover opacity-45 blur-md"
        />
        <img
          src={coverSrc}
          onError={() => setFailed(coverSrc)}
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
        <span className="relative border-b border-navy-foreground/30 pb-4 text-[10px] font-semibold uppercase opacity-80 @max-[120px]:pb-1 @max-[120px]:text-[6px]">
          {book.category} · {book.edition}
        </span>
        <div className="relative min-h-0">
          <p className="break-words text-lg font-extrabold leading-tight @max-[120px]:text-[9px]">
            {book.title}
          </p>
          <p className="mt-3 text-xs font-medium opacity-80 @max-[120px]:mt-1 @max-[120px]:text-[6px]">
            {book.author}
          </p>
        </div>
        <span className="break-all text-[10px] opacity-70 @max-[120px]:hidden">
          ShelfSense · {book.id}
        </span>
      </div>
    </div>
  );
}
