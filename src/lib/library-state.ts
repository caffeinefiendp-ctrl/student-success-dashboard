import { books, student, type Book } from '@/data/sample-library';

export interface Loan { id: string; studentId: string; bookId: string; issueDate: string; dueDate: string; returnedOn?: string; reminder?: boolean }
export interface LibraryRequest { id: string; studentId: string; bookId: string; type: 'Borrow' | 'Renewal'; loanId?: string; requestedOn: string; status: 'Pending' | 'Approved' | 'Rejected'; reason?: string }
export interface Activity { id: string; date: string; text: string }
export interface LibraryState { books: Book[]; loans: Loan[]; requests: LibraryRequest[]; activity: Activity[]; saved: string[] }
export const students = [student, ...Array.from({ length: 23 }, (_, i) => ({ name: ['Maya Patel', 'Liam Chen', 'Aisha Khan', 'Noah Williams', 'Sofia Roy', 'Arjun Sharma', 'Emma Wilson', 'Ethan Das', 'Olivia Brown', 'Rohan Gupta', 'Isabella Lee', 'Daniel Singh', 'Zara Ahmed', 'Lucas Martin', 'Ananya Rao', 'Leo Thomas', 'Nina Bose', 'Oscar Jones', 'Meera Sen', 'Adam Clark', 'Sara Ali', 'James Park', 'Isha Verma'][i] ?? 'Sample Student', first: 'Student', id: `STU-${20482 + i}`, program: ['B.Sc. Computer Science, Year 2', 'B.Sc. Physics, Year 3', 'B.Com., Year 1', 'B.Sc. Mathematics, Year 2'][i % 4] ?? 'Undergraduate', email: `student${i + 2}@example.edu` }))];
export const day = () => new Date().toISOString().slice(0, 10);
export function addDays(date: string, count: number) { return new Date(Date.parse(date + 'T00:00:00Z') + count * 86400000).toISOString().slice(0, 10); }
export function daysRemaining(date: string, today = day()) { return Math.ceil((Date.parse(date + 'T00:00:00Z') - Date.parse(today + 'T00:00:00Z')) / 86400000); }
export function availability(copies: number): Book['availability'] { return copies === 0 ? 'Waitlist' : copies === 1 ? 'Limited' : 'Available'; }
export function initialLibrary(): LibraryState {
  const loans: Loan[] = [
    { id: 'LOAN-1001', studentId: student.id, bookId: 'clean-code', issueDate: '2026-10-17', dueDate: '2026-11-03' },
    { id: 'LOAN-1002', studentId: student.id, bookId: 'ai-modern-approach', issueDate: '2026-10-24', dueDate: '2026-11-14' },
    { id: 'LOAN-1003', studentId: student.id, bookId: 'python-crash-course', issueDate: '2026-10-28', dueDate: '2026-11-18' },
  ];
  let n = 0;
  for (const book of books) {
    const existing = loans.filter(l => l.bookId === book.id).length;
    for (let i = existing; i < book.totalCopies - book.availableCopies; i++) {
      const s = students[1 + n % (students.length - 1)];
      if (!s) continue;
      loans.push({ id: `LOAN-${1100 + n}`, studentId: s.id, bookId: book.id, issueDate: '2026-10-18', dueDate: n % 9 === 0 ? '2026-10-30' : '2026-11-15' }); n++;
    }
  }
  return { books: books.map(b => ({ ...b })), loans, requests: [
    { id: 'REQ-1042', studentId: student.id, bookId: 'deep-learning', type: 'Borrow', requestedOn: '2026-10-29', status: 'Pending' },
    { id: 'REQ-1039', studentId: student.id, bookId: 'introduction-algorithms', type: 'Borrow', requestedOn: '2026-10-26', status: 'Pending' },
    { id: 'REQ-1038', studentId: 'STU-20482', bookId: 'clean-code', type: 'Borrow', requestedOn: '2026-10-25', status: 'Rejected', reason: 'Please return overdue books before requesting another title.' },
  ], activity: [{ id: 'ACT-1', date: '2026-10-29', text: 'Alex Morgan requested Deep Learning.' }, { id: 'ACT-2', date: '2026-10-28', text: 'Python Crash Course issued to Alex Morgan.' }], saved: [] };
}
export type Action =
 | { type: 'saveBook'; book: Book }
 | { type: 'deleteBook'; bookId: string }
 | { type: 'issue'; bookId: string; studentId: string; issueDate: string; dueDate: string }
 | { type: 'return'; loanId: string }
 | { type: 'request'; bookId: string; studentId: string; loanId?: string }
 | { type: 'decide'; requestId: string; approved: boolean; reason?: string }
 | { type: 'cancel'; requestId: string }
 | { type: 'save'; bookId: string }
 | { type: 'remind'; loanId: string };
export function transition(state: LibraryState, action: Action): LibraryState {
  const now = day();
  const uid = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  const log = (s: LibraryState, text: string): LibraryState => ({ ...s, activity: [{ id: uid('ACT'), date: now, text }, ...s.activity].slice(0, 100) });
  if (action.type === 'saveBook') {
    const b = action.book;
    const active = state.loans.filter(l => l.bookId === b.id && !l.returnedOn).length;
    if (!b.title.trim() || !b.author.trim() || !b.category.trim() || !b.edition.trim() || !b.description.trim() || !b.section.trim() || !b.rack.trim() || !b.shelf.trim()) throw new Error('Complete all required book details.');
    if (!Number.isInteger(b.totalCopies) || !Number.isInteger(b.availableCopies) || b.totalCopies < 1 || b.availableCopies < 0 || b.availableCopies > b.totalCopies || !Number.isInteger(b.floor) || b.floor < 0) throw new Error('Use valid whole-number copy counts and floor.');
    if (b.totalCopies - b.availableCopies !== active) throw new Error(`This title has ${active} active loans. Available copies must equal total copies minus ${active}.`);
    const value = { ...b, availability: availability(b.availableCopies) };
    return log({ ...state, books: state.books.some(x => x.id === b.id) ? state.books.map(x => x.id === b.id ? value : x) : [...state.books, value] }, `Inventory updated: ${b.title}.`);
  }
  if (action.type === 'deleteBook') {
    if (state.loans.some(l => l.bookId === action.bookId && !l.returnedOn) || state.requests.some(r => r.bookId === action.bookId && r.status === 'Pending')) throw new Error('Return active loans and resolve pending requests before deleting this book.');
    const book = state.books.find(b => b.id === action.bookId);
    return log({ ...state, books: state.books.filter(b => b.id !== action.bookId), saved: state.saved.filter(id => id !== action.bookId) }, `Book removed: ${book?.title ?? action.bookId}.`);
  }
  if (action.type === 'issue') {
    const book = state.books.find(b => b.id === action.bookId);
    if (!book || book.availableCopies < 1) throw new Error('No copies available to issue.');
    if (!students.some(s => s.id === action.studentId)) throw new Error('Select a registered demo student.');
    if (!action.issueDate || !action.dueDate || action.dueDate <= action.issueDate) throw new Error('Due date must be after issue date.');
    if (action.issueDate > now) throw new Error('Issue date cannot be in the future.');
    if (state.loans.some(l => l.bookId === book.id && l.studentId === action.studentId && !l.returnedOn)) throw new Error('This student already has this book on loan.');
    return log({ ...state, books: state.books.map(b => b.id === book.id ? { ...b, availableCopies: b.availableCopies - 1, availability: availability(b.availableCopies - 1) } : b), loans: [...state.loans, { id: uid('LOAN'), bookId: book.id, studentId: action.studentId, issueDate: action.issueDate, dueDate: action.dueDate }] }, `${book.title} issued to ${students.find(s => s.id === action.studentId)?.name}.`);
  }
  if (action.type === 'return') {
    const loan = state.loans.find(l => l.id === action.loanId);
    if (!loan || loan.returnedOn) throw new Error('This loan has already been returned.');
    return log({ ...state, loans: state.loans.map(l => l.id === loan.id ? { ...l, returnedOn: now } : l), books: state.books.map(b => b.id === loan.bookId ? { ...b, availableCopies: b.availableCopies + 1, availability: availability(b.availableCopies + 1) } : b) }, `Return recorded for ${state.books.find(b => b.id === loan.bookId)?.title}.`);
  }
  if (action.type === 'request') {
    const book = state.books.find(b => b.id === action.bookId);
    if (!book) throw new Error('Book is no longer in the catalogue.');
    const type = action.loanId ? 'Renewal' : 'Borrow';
    if (action.loanId && !state.loans.some(l => l.id === action.loanId && l.studentId === action.studentId && l.bookId === book.id && !l.returnedOn)) throw new Error('A renewal requires an active loan.');
    if (type === 'Borrow' && state.loans.some(l => l.bookId === book.id && l.studentId === action.studentId && !l.returnedOn)) throw new Error('You already have this book on loan.');
    if (state.requests.some(r => r.studentId === action.studentId && r.bookId === book.id && r.type === type && r.status === 'Pending')) throw new Error('A matching request is already pending.');
    return log({ ...state, requests: [{ id: uid('REQ'), bookId: book.id, studentId: action.studentId, type, loanId: action.loanId, requestedOn: now, status: 'Pending' }, ...state.requests] }, `${type} request received for ${book.title}.`);
  }
  if (action.type === 'decide') {
    const request = state.requests.find(r => r.id === action.requestId);
    if (!request || request.status !== 'Pending') throw new Error('This request has already been resolved.');
    if (!action.approved && !action.reason?.trim()) throw new Error('Provide a reason for rejection.');
    let next = state;
    if (action.approved && request.type === 'Borrow') next = transition(state, { type: 'issue', bookId: request.bookId, studentId: request.studentId, issueDate: now, dueDate: addDays(now, 21) });
    if (action.approved && request.type === 'Renewal') {
      const loan = state.loans.find(l => l.id === request.loanId && !l.returnedOn);
      if (!loan) throw new Error('The original loan is no longer active.');
      next = { ...state, loans: state.loans.map(l => l.id === loan.id ? { ...l, dueDate: addDays(loan.dueDate > now ? loan.dueDate : now, 21) } : l) };
    }
    return log({ ...next, requests: next.requests.map(r => r.id === request.id ? { ...r, status: action.approved ? 'Approved' : 'Rejected', reason: action.approved ? undefined : action.reason?.trim() } : r) }, `${request.type} request ${request.id} ${action.approved ? 'approved' : 'rejected'}.`);
  }
  if (action.type === 'cancel') return { ...state, requests: state.requests.filter(r => !(r.id === action.requestId && r.status === 'Pending')) };
  if (action.type === 'save') return { ...state, saved: state.saved.includes(action.bookId) ? state.saved.filter(id => id !== action.bookId) : [...state.saved, action.bookId] };
  if (action.type === 'remind') return { ...state, loans: state.loans.map(l => l.id === action.loanId ? { ...l, reminder: !l.reminder } : l) };
  return state;
}