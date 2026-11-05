<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the fictional catalogue in the shared sample-library module, with inventory fields on every book; all pages use the same records to prevent conflicting demo availability.
- Keep overview recommendations as a curated four-book subset of the catalogue so catalogue growth does not change the dashboard layout.
- Keep catalogue filtering in a browser-safe pure helper and URL-validated search state so search, filters and browser navigation remain consistent and testable.
- Use LibraryProvider and the pure library-state transitions for all demo inventory, circulation, requests and activity; session storage preserves frontend-only changes without claiming hosted persistence.
- Keep librarian screens in dedicated /librarian routes using the existing DashboardShell with a separate menu; demo switching is not authentication or a permission boundary.
- Derive availability from copy counts and keep total minus available equal to active loans; validate transitions atomically to prevent contradictory demo records.
- Book covers are CDN asset pointers in src/assets/catalogue/covers fetched from Open Library by verified ISBN; BookCover renders them object-contain over a blurred self-backdrop with a typographic fallback, so new books need only a cover URL or none.
