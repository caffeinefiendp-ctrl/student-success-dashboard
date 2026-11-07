import type { Book } from "@/data/sample-library";
import type { LibraryRequest } from "@/lib/library-state";

function oneLine(value: string | undefined) {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

export function formatRoomRequestMessage({
  request,
  book,
  studentName,
}: {
  request: LibraryRequest;
  book: Book;
  studentName: string;
}) {
  return [
    "@switch-buddy-admin Please analyze this ShelfSense library request for the human librarian.",
    "This is a demo request. Do not approve, reject, change its status, or claim that any action was taken. A human librarian makes the decision in the app.",
    `Request ID: ${oneLine(request.id)}`,
    `Request type: ${request.type}`,
    `Student: ${oneLine(studentName)} (${oneLine(request.studentId)})`,
    `Book: ${oneLine(book.title)} by ${oneLine(book.author)} (catalogue ID: ${oneLine(book.id)})`,
    `Sample inventory: ${book.availableCopies} of ${book.totalCopies} copies currently shown available; ${book.availability}. This is fictional demo data, not live library inventory.`,
    `Requested on: ${oneLine(request.requestedOn)}`,
    "Please summarize relevant details, flag availability or policy concerns, and leave the decision to the librarian.",
  ].join("\n");
}
