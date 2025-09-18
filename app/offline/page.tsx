export const metadata = {
  title: "Offline – MyFantasy",
}

export default function OfflinePage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">You are offline</h1>
      <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">
        MyFantasy is running in offline mode. Recent pages, dashboards, and settings cached on your device remain available. We will resync game data as soon as you reconnect.
      </p>
      <p className="text-xs uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">
        Last synced data only
      </p>
    </div>
  )
}
