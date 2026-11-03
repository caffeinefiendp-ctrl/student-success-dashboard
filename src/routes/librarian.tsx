import { createFileRoute, Outlet } from '@tanstack/react-router';
export const Route = createFileRoute('/librarian')({ component: LibrarianLayout });
function LibrarianLayout() { return <Outlet />; }