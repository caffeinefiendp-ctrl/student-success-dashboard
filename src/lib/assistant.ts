import type { LibraryState } from './library-state';
import { floorLabel } from './catalogue';
export function assistantReply(question: string, state: LibraryState, previousBook?: string) {
  const q = question.toLowerCase();
  if (/renew/.test(q)) return 'Demo renewal guidance: open My Books and choose Renew beside an active loan. Track it in My Requests. The demo librarian can approve or reject it; approval extends the due date by 21 days. No renewal happens until approval.';
  if (/rules|policy|policies|fine|how long|loan period/.test(q)) return 'Sample library rules: new loans last 21 days. Renewal requests require librarian approval and add 21 days. Return overdue books promptly. Borrowing depends on available copies. These are fictional demo rules, not university policy.';
  const tokens = q.split(/\W+/).filter(w => w.length > 2 && !['the','book','books','find','where','shelf','available','availability','please','can','you','suggest','something','about','best','start','learning','location','what','does','have'].includes(w));
  const scored = state.books.map(book => ({ book, score: tokens.reduce((sum,w) => sum + (book.title.toLowerCase().includes(w) ? 4 : [...book.keywords, book.category, book.author, book.description].join(' ').toLowerCase().includes(w) ? 1 : 0), 0) })).sort((a,b) => b.score-a.score);
  const hit = scored[0]?.score ? scored[0].book : state.books.find(b => b.id === previousBook);
  if (!hit) return 'I could not match that question to the demo catalogue. Try a title, author or subject such as electronics, Python or literature, or ask about renewals and sample library rules.';
  const alternatives = state.books.filter(b => b.id !== hit.id && b.category === hit.category && b.availableCopies > 0).slice(0,3);
  return `From the fictional catalogue: “${hit.title}” by ${hit.author}. ${hit.description}\n\n${hit.availability}: ${hit.availableCopies} of ${hit.totalCopies} copies available. ${floorLabel(hit.floor)}, ${hit.section}, rack ${hit.rack}, shelf ${hit.shelf}.${hit.availableCopies === 0 || /alternative|similar/.test(q) ? `\n\nAvailable alternatives: ${alternatives.map(b => `${b.title} (${b.availableCopies} copies, rack ${b.rack})`).join('; ') || 'none in this category'}.` : ''}`;
}