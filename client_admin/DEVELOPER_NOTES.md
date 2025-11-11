# Developer Notes — client_admin (Admin Dashboard)

This is my admin HUD: React + Vite + Tailwind with a modular widget system, persona theming, and a bunch of editors.

## Stack and shape

- React 18 + Vite
- Tailwind for styling; CSS variables for persona theming
- React Router v6 for pages; `ProtectedRoute`/`AdminRoute` wrappers
- `AuthContext` manages auth (user + token) and exposes login/logout
- `services/api.js` wraps Axios with auth header + base URL

Folder highlights:

- `src/components/layout/` — shell pieces (Header, Sidebar, layout frames)
- `src/components/dashboard/` — widgets for the main dashboard
- `src/pages/` — route-level screens
- `src/context/` — AuthContext, theme, etc.
- `src/services/` — API layer
- `src/utils/` — helpers

## Environment

Create `.env.local` here as needed:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

I derive the server base with `split('/api')[0]` to build image URLs.

## Theming (Personas)

The active persona on the user toggles a set of CSS variables. The UI reads those variables for colors, so switching personas is instant and global (charts included). See Persona selector in the Header dropdown.

## Header sprites — how they work (my quick mental model)

- Toggle: Click the Pokéball in the header. I persist that choice in `localStorage` under `tae.header.showTeamSprites`.
- Visibility & size: Sprites always render. They’re 72px tall when the header is expanded and 36px when it’s contracted.
- Movement: Horizontal-only, constant speed with a left/right bounce inside the header bounds. Y is assigned once per sprite into vertically spaced lanes with a tiny jitter so the group looks organic.
- Overlap: Allowed on purpose. No separation/avoidance so it feels lively.
- Mirroring: When moving right, I mirror the sprite via `scaleX(-1)` so it faces the direction of travel.
- Barrier: I place an invisible wall just to the left of the Mail icon (aligned to the icon, not the padded button). Sprites bounce off that wall so they don’t cover the action icons.
- Inputs: I use `requestAnimationFrame` and keep `pointer-events: none` on the field so the UI remains fully interactive.

This all lives in `components/layout/Header.jsx` with small, self-contained logic and proper cleanup in `useEffect`.

## Widgets — the rule of small

Widgets should fetch just what they need and render fast. Keep larger logic in hooks/services. Favor composition over config monsters. Use the `Widget` frame for consistency.

## Common flows I revisit

- Profile collections grid (DisplayedCollection): consistent image URL construction and responsive layout
- Workout editor + templates: 2x2 preset grid, clean CRUD flows
- Chart widgets: Recharts + persona colors via CSS vars

## Scripts

- `npm run dev` — local dev with HMR
- `npm run build` — static build
- `npm run preview` — preview the build locally

If you add a big feature, drop a sentence here so future-me knows where the brain is.

## Books — enhanced cover and notes workspace

- Book list items now show a larger cover. Hover/focus the cover to open a rich tooltip with details and a ⚙️ button.
- The ⚙️ links to `/books/:bookId/notes` (BookNotesPage): a focused workspace to update pages read and write long-form notes.
- For now, per-page/chapter notes are stored in the `Book.notes` string (free-form). Future work can introduce a dedicated notes model.
- Components touched:
  - `components/books/BookItem.jsx` — tooltip, larger cover, quick link.
  - `pages/BookNotesPage.jsx` — new route-level page for book interactions.
  - `App.jsx` — route added for `/books/:bookId/notes`.

### Structured notes (2025-11-10)

- Added model `server/models/userSpecific/BookNote.js` with fields: user, book, pageStart, pageEnd, chapter, content, tags.
- New endpoints (protected, nested under book):
  - `GET /api/books/:bookId/notes` — list notes.
  - `POST /api/books/:bookId/notes` — create note.
  - `PUT /api/books/:bookId/notes/:noteId` — update note.
  - `DELETE /api/books/:bookId/notes/:noteId` — delete note.
- Controllers: `server/controllers/bookNoteController.js` with ownership checks against the parent book.
- Routes: `server/routes/bookNoteRoutes.js`, mounted via `server/routes/bookRoutes.js`.
- Client service: `src/services/bookNotes.js`.
- UI: `components/books/BookNoteForm.jsx` and `components/books/BookNoteList.jsx` integrated into `BookNotesPage` under "Structured Notes".

### Immersive updates (2025-11-10 later)

- Extended `BookNote` with `kind` (`note|quote`) for differentiated rendering.
- Added visual styling for quotes (ring + decorative mark) in `BookNoteList.jsx`.
- Added `pdfUrl` field to `Book` model and upload endpoint `POST /api/books/:bookId/pdf` using multer (25MB limit, PDF only).
- Client: upload via `uploadBookPdf` in `bookNotes.js` and inline viewer (iframe) in `BookNotesPage` "Reader" widget.
- Future ideas: text highlight mapping to page ranges, inline quote extraction from PDF, AI semantic clustering of notes.
