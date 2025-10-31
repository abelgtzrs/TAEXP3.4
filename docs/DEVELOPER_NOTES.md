# Developer Notes — The Abel Experience (v3.5)

These are my developer notes for how this repo works end-to-end. If you’re poking around the codebase or wiring new features, start here. I keep this practical and skimmable.

## TL;DR map

- Monorepo with 4 apps:
  - server (Express + MongoDB): single API for everything + static asset host
  - client_admin (React + Vite + Tailwind): my dark HUD dashboard
  - client_public (React + Vite): retro terminal viewer for published lore
  - mobile (React Native + Expo): WIP mobile client
- One source of truth: MongoDB via the server.
- Static assets are under `/public` in this repo and served by the server at `/` (e.g., `/pokemon/...`, `/habborares/...`, `/uploads/...`).

## How things talk to each other

- Clients call the API via `VITE_API_BASE_URL` (defaults to `http://localhost:5000/api`); I derive the server base from that for images.
- Auth is JWT-based. The admin panel stores auth state via `AuthContext` and attaches the bearer token to API calls in `services/api.js`.
- Persona theming flows from the active persona on the user; CSS variables update the UI live.

## Data model (one paragraph version)

I separate “base” definitions (e.g., PokemonBase, HabboRareBase, exercise definitions) from user-owned collections (userPokemon, userHabboRares, etc.). That lets the same base be referenced by many users, while I track ownership, quantities, and metadata per user separately. Finance has its own set of models (categories, transactions, budgets, debts, goals). You’ll see that reflected in `server/models/**`.

## Running locally

- Terminal A: server
  - cd server
  - npm run dev
- Terminal B: admin UI
  - cd client_admin
  - npm run dev
- Terminal C: public UI (optional)
  - cd client_public
  - npm run dev

Mobile (optional):
- cd mobile; npm start (Expo), then run the platform you care about.

## Environment variables (server)

Put these in `server/.env` (see `.env.example` too):
- MONGO_URI
- JWT_SECRET
- PORT (default 5000)
- SPOTIFY_CLIENT_ID/SECRET/REDIRECT_URI (optional)
- FRONTEND_URL (for redirects)

Frontend env (client_admin and client_public):
- VITE_API_BASE_URL=http://localhost:5000/api

## Conventions I stick to

- Image paths in DB are relative (e.g., `/pokemon/gen5ani/001.gif`). I prepend the server base URL at runtime.
- UI components use Tailwind. Shared look-and-feel comes from CSS variables that personas tweak live.
- Dashboard widgets should be small, focused, and stateless where possible; side-effects live in hooks and services.

## Where to start reading code

- Admin: `client_admin/src/App.jsx` and `components/layout/AdminLayout.jsx` to see routing and shell; `context/AuthContext.jsx` for auth. Widgets live in `components/dashboard/`.
- Server: `server/server.js` for bootstrapping, `routes/**` for endpoints, `controllers/**` for logic, `models/**` for schemas.
- Public viewer: `client_public/src/App.jsx` is a slim shell.

## Notes on assets

- Server serves `public/` and `public/uploads`. I keep mirrored folders under the built client `dist/` in deployments so static paths work there too.
- If an image doesn’t load: confirm the relative path and that the physical file exists under `public/`.

## Deployment tips

- Run `node server/comprehensive-deployment-test.js` to sanity check prod configs.
- Ensure all upload directories exist in prod (`public/uploads/avatars/`, etc.). See `DEPLOYMENT_FIXES_SUMMARY.md`.

## See also

- client_admin/DEVELOPER_NOTES.md — how the dashboard is wired
- client_public/DEVELOPER_NOTES.md — public viewer shape
- server/DEVELOPER_NOTES.md — API layout and scripts
- mobile/DEVELOPER_NOTES.md — RN app layout
