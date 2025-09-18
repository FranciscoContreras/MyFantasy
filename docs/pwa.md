# Progressive Web App Features

MyFantasy now ships with a first-class PWA experience so league insights stay available even when the network drops.

## What’s enabled

- **Service worker (`public/service-worker.js`)** precaches the app shell, serves an `/offline` fallback, and hydrates cached dashboards while refreshing assets in the background.
- **App manifest (`public/manifest.webmanifest`)** declares icons, colours, and the standalone launch surface so browsers and mobile OSes can install the app.
- **Push notification hooks** surface through the service worker `push` handler and the `PWAProvider`. Users are prompted to enable alerts after the worker is ready.
- **Install prompts** leverage the `beforeinstallprompt` event and Sonner actions to offer 1-tap home screen installation.
- **Connectivity awareness**: online/offline events trigger lightweight toasts so users know when data is being served from cache.

## Local testing

1. Run `npm run dev`.
2. Visit `http://localhost:3000` and open DevTools → Application → Service Workers to confirm registration.
3. Toggle "Offline" in DevTools to verify the `/offline` route renders and cached dashboards remain accessible.
4. Use the "Show install prompt" command in DevTools or reload with the Application tab open to test install and push permission flows.

> Set `NEXT_PUBLIC_SITE_URL` before building to ensure the manifest and metadata use the correct canonical origin.
