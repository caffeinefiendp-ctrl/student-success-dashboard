import type { Book } from "@/data/sample-library";

export function filterBooks(catalogue: Book[], filters: { q?: string; category?: string; availability?: string }) {
  const terms = (filters.q ?? "").trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return catalogue.filter((book) => {
    const searchable = [book.title, book.author, book.category, book.description, ...book.keywords].join(" ").toLocaleLowerCase();
    return (!filters.category || book.category === filters.category) &&
      (!filters.availability || book.availability === filters.availability) &&
      terms.every((term) => searchable.includes(term));
  });
}

export function floorLabel(floor: number) {
  return floor === 0 ? "Ground floor" : `Floor ${floor}`;
}