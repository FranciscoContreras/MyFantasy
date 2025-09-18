"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Crosshair, Gauge, LogOut, Menu, Scale, Settings, Sparkles, Users2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import { ThemeToggle } from "@/components/site/theme-toggle"

interface DashboardShellProps extends React.PropsWithChildren {
  title?: string
  description?: string
}

const navItems = [
  { label: "Overview", href: "/dashboard", icon: Gauge },
  { label: "Matchup", href: "/dashboard/matchup", icon: Crosshair },
  { label: "Recommendations", href: "/dashboard/recommendations", icon: Sparkles },
  { label: "Trades", href: "/dashboard/trades", icon: Scale },
  { label: "Team", href: "/dashboard/team", icon: Users2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function DashboardShell({ title, description, children }: DashboardShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:px-10 lg:flex-row lg:py-16">
      <aside className="hidden w-[240px] flex-shrink-0 lg:block">
        <div className="sticky top-10 space-y-8">
          <Link href="/dashboard" className="block text-lg font-semibold text-slate-900 dark:text-white">
            Lineup HQ
          </Link>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <DesktopNavItem key={item.href} item={item} />
            ))}
          </nav>
          <div className="rounded-[20px] border border-white/50 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/60">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Need help importing?</p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Kick off a Playwright import or review docs in one click.
            </p>
            <Link href="/import" className="mt-3 inline-flex w-full">
              <AnimatedButton variant="secondary" className="w-full justify-center">
                Import a league
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </aside>
      <div className="flex w-full flex-1 flex-col gap-8">
        <MobileHeader />
        {(title || description) && (
          <header className="space-y-2">
            {title ? (
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{title}</h1>
            ) : null}
            {description ? <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p> : null}
          </header>
        )}
        <main className="flex-1 space-y-8 pb-12">{children}</main>
      </div>
    </div>
  )
}

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

function DesktopNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const Icon = item.icon
  const isActive = pathname === item.href

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-[14px] px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-indigo-100/80 text-indigo-700 shadow-[0_12px_30px_rgba(79,70,229,0.18)] dark:bg-indigo-500/10 dark:text-indigo-200"
          : "text-slate-600 hover:bg-white/80 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/60 dark:hover:text-white",
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  )
}

function MobileHeader() {
  return (
    <div className="flex items-center justify-between gap-4 lg:hidden">
      <div className="flex items-center gap-3">
        <MobileNav />
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">Dashboard</p>
          <p className="text-base font-semibold text-slate-900 dark:text-white">Lineup HQ</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle className="rounded-full border border-white/70 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/60" />
        <Button variant="ghost" size="icon" className="rounded-full border border-white/60 bg-white/85 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full border border-white/60 bg-white/85 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[260px] border-white/10 bg-white/90 backdrop-blur-md dark:bg-slate-950/80">
        <div className="mt-6 flex flex-col gap-5">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Navigate</p>
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <MobileNavItem key={item.href} item={item} />
            ))}
          </nav>
          <div className="rounded-2xl border border-white/60 bg-white/85 p-4 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
            <p className="text-xs text-slate-600 dark:text-slate-300">Run an import or review lineup history any time.</p>
            <Link href="/import" className="mt-3 inline-flex">
              <AnimatedButton className="w-full justify-center">Import a league</AnimatedButton>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function MobileNavItem({ item }: { item: NavItem }) {
  const pathname = usePathname()
  const Icon = item.icon
  const isActive = pathname === item.href

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-3 py-2 text-sm font-medium",
        isActive
          ? "border-indigo-200 bg-indigo-50 text-indigo-700"
          : "border-white/60 bg-white/70 text-slate-600 hover:border-slate-200 hover:bg-white/80 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200",
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  )
}
