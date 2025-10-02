# TAE Mobile (React Native / Expo)

First-pass mobile app consuming the existing TAE backend API.

## Tech Stack

- Expo SDK 51
- React Native 0.74
- React Navigation (Stack + Bottom Tabs)
- Axios for API
- AsyncStorage for token persistence

## Directory Structure

```
mobile/
  App.js               # App root with AuthProvider + navigation
  app.json             # Expo config
  package.json
  babel.config.js
  .env.example         # Environment variable sample
  src/
    api/client.js
    context/AuthContext.jsx
    navigation/RootNavigator.jsx
    screens/

      LoginScreen.jsx
      DashboardScreen.jsx
      CollectionsScreen.jsx
      FinanceScreen.jsx
      MoreScreen.jsx
      VolumeListScreen.jsx
      VolumeDetailScreen.jsx
    components/
      LoadingView.jsx
      ErrorView.jsx
```

## Environment Variables

Copy `.env.example` to `.env` and set:

```
EXPO_PUBLIC_API_BASE_URL=https://your-server.example.com/api
```

Expo automatically exposes `EXPO_PUBLIC_` vars at build time.

## Running

```bash
# From repository root
cd mobile
npm install
npm run start
```

Select a platform (press `a` for Android emulator or scan the QR with Expo Go).

## Authentication Flow

1. User logs in with email/password via `/auth/login`.
2. JWT token stored in `AsyncStorage` under `auth_token`.
3. On app start, `/auth/me` is fetched to restore the session.
4. Logout clears token and user state.

## Placeholder Screens

Current screens show structural placeholders. Replace with real data widgets incrementally:

- Dashboard: KPIs + quick actions
- Finance: Transactions list, add transaction form (future)
- Collections: Aggregate + drill down (future filtering)
- Volumes: Basic list + detail (first 50 lines preview)

## Next Steps (Suggested)

- Add React Query for caching + retries.
- Implement transaction creation form.
- Add Pokédex list & detail screen (reuse existing API endpoints).
- Global toast system (errors, success notices).
- Offline cache (AsyncStorage persist) for read-only views.
- Biometric auth gate (expo-local-authentication).
- Push notifications (expo-notifications) for tasks/habits.
- Theming (light/dark) + dynamic color tokens.

## License

Internal project – licensing TBD.
