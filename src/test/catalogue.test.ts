import { describe, expect, it } from "vitest";
import { books, catalogueCategories, recommendedBooks } from "@/data/sample-library";
import { filterBooks } from "@/lib/catalogue";

describe("fictional library catalogue", () => {
  it("contains at least 35 unique, complete inventory records", () => {
    expect(books.length).toBeGreaterThanOrEqual(35);
    expect(new Set(books.map((book) => book.id)).size).toBe(books.length);
    for (const book of books) {
      for (const field of [book.id, book.title, book.author, book.category, book.edition, book.description, book.cover, book.section, book.rack, book.shelf]) expect(field.length).toBeGreaterThan(0);
      expect(Number.isInteger(book.floor)).toBe(true);
      expect(book.floor).toBeGreaterThanOrEqual(0);
      expect(book.totalCopies).toBeGreaterThan(0);
      expect(book.availableCopies).toBeGreaterThanOrEqual(0);
      expect(book.availableCopies).toBeLessThanOrEqual(book.totalCopies);
      expect(book.availability).toBe(book.availableCopies === 0 ? "Waitlist" : book.availableCopies === 1 ? "Limited" : "Available");
    }
  });
  it("covers all eight requested subjects", () => {
    expect(catalogueCategories).toEqual(expect.arrayContaining(["Computer Science", "Programming", "Artificial Intelligence", "Mathematics", "Physics", "Science", "Business", "General Knowledge"]));
  });
  it("shows the full catalogue without filters", () => {
    expect(filterBooks(books, {})).toEqual(books);
  });
  it("searches title, author, subject and keywords without case sensitivity", () => {
    expect(filterBooks(books, { q: "  PYTHON crash " }).map((b) => b.id)).toEqual(["python-crash-course"]);
    expect(filterBooks(books, { q: "Kleppmann" }).map((b) => b.id)).toEqual(["design-data-applications"]);
    expect(filterBooks(books, { q: "Mathematics" })).toHaveLength(5);
    expect(filterBooks(books, { q: "ml" }).some((b) => b.id === "hands-on-ml")).toBe(true);
  });
  it("combines search with category and availability filters", () => {
    expect(filterBooks(books, { q: "python", category: "Computer Science", availability: "Available" }).map((b) => b.id)).toEqual(["python-crash-course"]);
    expect(filterBooks(books, { q: "python", category: "Computer Science", availability: "Waitlist" })).toEqual([]);
    expect(filterBooks(books, { category: "Physics", availability: "Available" }).every((b) => b.category === "Physics" && b.availableCopies > 1)).toBe(true);
  });
  it("preserves the existing four overview recommendations and loan IDs", () => {
    expect(recommendedBooks.map((book) => book.id)).toEqual(["python-crash-course", "ai-modern-approach", "clean-code", "deep-learning"]);
  });
});