import { describe, expect, it } from "vitest";
import { books } from "@/data/sample-library";
import { initialLibrary, transition } from "@/lib/library-state";
import { formatRoomRequestMessage } from "@/lib/request-message";

describe("Switch room request handoff", () => {
  it("creates a structured analysis request and keeps the human approval boundary clear", () => {
    const book = books[0];
    if (!book) throw new Error("Missing sample book");

    const message = formatRoomRequestMessage({
      request: {
        id: "REQ-DEMO-1",
        studentId: "STU-DEMO-1",
        bookId: book.id,
        type: "Borrow",
        requestedOn: "2026-11-07",
        status: "Pending",
      },
      book,
      studentName: "Demo Student",
    });

    expect(message).toContain("@switch-buddy-admin");
    expect(message).toContain("Request ID: REQ-DEMO-1");
    expect(message).toContain(`Book: ${book.title} by ${book.author}`);
    expect(message).toContain("fictional demo data");
    expect(message).toContain("Do not approve, reject");
    expect(message).toContain("human librarian");
  });

  it("carries a student request through room handoff to librarian approval", () => {
    const initial = initialLibrary();
    const book = initial.books.find((item) => item.id === "pride-prejudice");
    if (!book) throw new Error("Missing sample book");

    const requested = transition(initial, {
      type: "request",
      bookId: book.id,
      studentId: "STU-20481",
    });
    const request = requested.requests[0];
    if (!request) throw new Error("Request was not created");

    const message = formatRoomRequestMessage({
      request,
      book,
      studentName: "Maya Patel",
    });
    expect(message).toContain(`Request ID: ${request.id}`);
    expect(requested.requests.find((item) => item.id === request.id)?.status).toBe("Pending");

    const approved = transition(requested, {
      type: "decide",
      requestId: request.id,
      approved: true,
    });
    expect(approved.requests.find((item) => item.id === request.id)?.status).toBe("Approved");
    expect(
      approved.loans.some((loan) => loan.bookId === book.id && loan.studentId === "STU-20481"),
    ).toBe(true);
  });
});
