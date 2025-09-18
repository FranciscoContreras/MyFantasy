import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { MainNav } from "@/components/site/main-nav"
import { PWAProvider } from "@/components/site/pwa-provider"
import { cn } from "@/lib/utils"

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://myfantasy.app"

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MyFantasy",
    template: "%s – MyFantasy",
  },
  description: "Cross-platform fantasy football intelligence, matchup analysis, and automated league workflows.",
  manifest: "/manifest.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  icons: {
    icon: [{ url: "/window.svg", type: "image/svg+xml" }],
    apple: "/window.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background text-foreground antialiased", jakarta.variable)}>
        <ThemeProvider>
          <PWAProvider />
          <MainNav />
          <main>{children}</main>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
