"use client"

import { useEffect } from "react"
import { toast } from "sonner"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
  prompt: () => Promise<void>
}

export function PWAProvider() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return
    }

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/service-worker.js", { scope: "/" })
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("[PWA] Failed to register service worker", error)
        }
      }
    }

    register()
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    const handler = (event: BeforeInstallPromptEvent) => {
      event.preventDefault()

      toast("Install MyFantasy?", {
        description: "Add the dashboard to your home screen for 1-tap access.",
        action: {
          label: "Install",
          onClick: async () => {
            await event.prompt()
            const { outcome } = await event.userChoice
            if (outcome === "accepted") {
              toast.success("MyFantasy installed")
            }
          },
        },
        cancel: {
          label: "Later",
        },
      })
    }

    window.addEventListener("beforeinstallprompt", handler as EventListener)
    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return
    }

    const promptForPush = async () => {
      if (Notification.permission !== "default") {
        return
      }

      toast("Enable live alerts?", {
        description: "Turn on injury, trade, and score notifications.",
        action: {
          label: "Enable",
          onClick: async () => {
            const permission = await Notification.requestPermission()
            if (permission === "granted") {
              toast.success("Push notifications enabled")
            } else if (permission === "denied") {
              toast.error("Notifications blocked in browser settings")
            }
          },
        },
        cancel: {
          label: "Not now",
        },
        duration: 8000,
      })
    }

    navigator.serviceWorker?.ready.then(() => {
      window.setTimeout(promptForPush, 2000)
    })
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const handleOffline = () => {
      toast("You are offline", {
        description: "Serving cached lineups until the connection returns.",
        duration: 6000,
      })
    }

    const handleOnline = () => {
      toast.success("Back online", {
        description: "Refreshing projections and league data.",
      })
    }

    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  return null
}
