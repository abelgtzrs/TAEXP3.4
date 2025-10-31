# Developer Notes — client_public (Terminal Viewer)

This is the lightweight public viewer with a retro terminal vibe. It reads published content from the same API used by admin.

## Stack

- React + Vite
- Minimal routing; small component surface

## How it talks to the API

Same pattern as admin: set `VITE_API_BASE_URL` and use the helper to construct absolute image URLs from relative paths.

## What to look at

- `src/App.jsx` — shell and main routes
- `src/components/` — terminal UI bits, typewriter effects, etc.

## Scripts

- `npm run dev` — HMR dev
- `npm run build` — static build
- `npm run preview` — preview build

If you extend commands (catalogue/random/view), keep the parsing simple and deterministic.
