// SAMPLE DATA ONLY — not connected to any real library catalogue or database.
import coverAi from "@/assets/cover-ai.jpg";
import coverClean from "@/assets/cover-cleancode.jpg";
import coverDeep from "@/assets/cover-deeplearning.jpg";

export type Availability = "Available" | "Limited" | "Waitlist";

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  availability: Availability;
  cover?: string;
  year: number;
  pages: number;
  shelf: string;
  rating: number;
  description: string;
}

export const books: Book[] = [
  {
    id: "python-crash-course",
    title: "Python Crash Course",
    author: "Eric Matthes",
    category: "Computer Science",
    availability: "Available",
    year: 2023,
    pages: 552,
    shelf: "CS · 005.133 MAT",
    rating: 4.7,
    description:
      "A hands-on, project-based introduction to programming with Python — from basics to building games, data visualisations and web apps.",
  },
  {
    id: "ai-modern-approach",
    title: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell and Peter Norvig",
    category: "Artificial Intelligence",
    availability: "Limited",
    cover: coverAi,
    year: 2020,
    pages: 1136,
    shelf: "AI · 006.3 RUS",
    rating: 4.8,
    description:
      "The definitive textbook on AI covering search, reasoning, planning, machine learning, perception and the ethics of intelligent systems.",
  },
  {
    id: "clean-code",
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Computer Science",
    availability: "Available",
    cover: coverClean,
    year: 2008,
    pages: 464,
    shelf: "CS · 005.1 MAR",
    rating: 4.6,
    description:
      "A handbook of agile software craftsmanship: principles, patterns and practices for writing readable, maintainable code.",
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    author: "Ian Goodfellow, Yoshua Bengio and Aaron Courville",
    category: "Artificial Intelligence",
    availability: "Waitlist",
    cover: coverDeep,
    year: 2016,
    pages: 800,
    shelf: "AI · 006.31 GOO",
    rating: 4.5,
    description:
      "A comprehensive introduction to deep learning — the mathematical foundations, modern architectures and research perspectives.",
  },
];

export const categories = [
  { name: "Computer Science", count: 1240, icon: "Code2", tone: "primary" },
  { name: "Artificial Intelligence", count: 486, icon: "BrainCircuit", tone: "accent" },
  { name: "Mathematics", count: 912, icon: "Sigma", tone: "navy" },
  { name: "Science", count: 1580, icon: "FlaskConical", tone: "accent" },
  { name: "Business", count: 734, icon: "Briefcase", tone: "primary" },
] as const;

export const borrowed = [
  { bookId: "clean-code", borrowedOn: "Oct 17, 2026", due: "Nov 3, 2026", daysLeft: 3, totalDays: 17 },
  { bookId: "ai-modern-approach", borrowedOn: "Oct 24, 2026", due: "Nov 14, 2026", daysLeft: 14, totalDays: 21 },
  { bookId: "python-crash-course", borrowedOn: "Oct 28, 2026", due: "Nov 18, 2026", daysLeft: 18, totalDays: 21 },
];

export const requests = [
  { id: "REQ-1042", bookId: "deep-learning", requested: "Oct 29, 2026", status: "Waitlisted · #2 in queue" },
  { id: "REQ-1039", title: "Introduction to Algorithms", author: "Cormen et al.", requested: "Oct 26, 2026", status: "Pending approval" },
];

export const student = { name: "Alex Morgan", first: "Alex", id: "STU-20481", program: "B.Sc. Computer Science, Year 2", email: "alex.morgan@university.edu" };

export const getBook = (id: string) => books.find((b) => b.id === id)!;
