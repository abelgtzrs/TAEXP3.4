# Developer Notes — mobile (Expo)

This is the Expo client. It talks to the same API and shares mental models with the web clients.

## Stack

- React Native 0.74 + Expo 51
- React Navigation (stack + tabs)
- Axios for API calls
- AsyncStorage for local session

## Folder highlights

- `src/navigation/` — stacks/tabs wiring
- `src/context/` — auth/session context
- `src/api/` — Axios instance and API calls
- `src/screens/` — screen components
- `src/components/` — shared UI bits

## Scripts

- `npm start` — Expo dev
- `npm run android` / `npm run ios` — platform builds
- `npm run web` — web target if you need it

## Notes

Keep API shapes aligned with the server. If you add an endpoint for admin, decide if mobile needs a slice and document it here.
