const CACHE_VERSION = "myfantasy-cache-v1"
const OFFLINE_URL = "/offline"
const PRECACHE_URLS = [
  OFFLINE_URL,
  "/",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/window.svg",
  "/globe.svg"
]

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_VERSION)
      await cache.addAll(PRECACHE_URLS)
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_VERSION)
          .map((cacheName) => caches.delete(cacheName)),
      )
      await self.clients.claim()
    })(),
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event

  if (request.method !== "GET") {
    return
  }

  const url = new URL(request.url)

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request)
          const cache = await caches.open(CACHE_VERSION)
          cache.put(request, networkResponse.clone())
          return networkResponse
        } catch {
          const cached = await caches.match(request)
          if (cached) {
            return cached
          }
          const offlinePage = await caches.match(OFFLINE_URL)
          return offlinePage ?? new Response("Offline", { status: 503 })
        }
      })(),
    )
    return
  }

  if (url.origin !== self.location.origin) {
    event.respondWith(fetch(request))
    return
  }

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_VERSION)
      const cached = await cache.match(request)
      if (cached) {
        fetch(request)
          .then((response) => cache.put(request, response.clone()))
          .catch(() => {})
        return cached
      }

      try {
        const networkResponse = await fetch(request)
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone())
        }
        return networkResponse
      } catch {
        return new Response("", { status: 204 })
      }
    })(),
  )
})

self.addEventListener("push", (event) => {
  const data = event.data?.json?.() ?? { title: "MyFantasy", body: "New update available." }
  const title = data.title ?? "MyFantasy"
  const options = {
    body: data.body ?? "Stay ahead with fresh projections and alerts.",
    icon: "/window.svg",
    badge: "/window.svg",
    data: data.url ? { url: data.url } : undefined,
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener("notificationclick", (event) => {
  const targetUrl = event.notification?.data?.url ?? "/dashboard"
  event.notification.close()
  event.waitUntil(
    (async () => {
      const allClients = await clients.matchAll({ type: "window", includeUncontrolled: true })
      const matchingClient = allClients.find((client) => client.url.includes(targetUrl))
      if (matchingClient) {
        matchingClient.focus()
        return
      }
      await clients.openWindow(targetUrl)
    })(),
  )
})
