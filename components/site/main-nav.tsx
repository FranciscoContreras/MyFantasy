"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, ArrowRight } from "lucide-react"

import { AnimatedButton } from "@/components/ui/animated-button"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/site/theme-toggle"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#", label: "Docs" },
]

const quickLinks = [
  {
    title: "Optimizer",
    description: "Stack-aware lineups with AI projections.",
    href: "#pricing",
  },
  {
    title: "Imports",
    description: "Playwright automation for ESPN, Yahoo, Sleeper, CBS.",
    href: "#features",
  },
]

export function MainNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/70 bg-white/90 backdrop-blur-md shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-colors dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-12 lg:px-20">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-semibold text-slate-900 dark:text-white">
            GlassGrid
          </Link>
          <DesktopNav />
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <NavigationActions />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle className="rounded-full border border-white/40 bg-white/70 dark:border-white/10 dark:bg-slate-900/60" />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

function DesktopNav() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            Platform
          </NavigationMenuTrigger>
          <NavigationMenuContent className="min-w-[320px]">
            <div className="grid gap-4 p-6 md:w-[360px]">
              {quickLinks.map((link) => (
                <NavigationMenuLink key={link.title} asChild>
                  <Link
                    href={link.href}
                    className="flex flex-col gap-2 rounded-2xl border border-white/40 bg-white/70 p-4 text-left shadow-sm transition-transform hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900/60"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {link.title}
                      </span>
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{link.description}</p>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
          <NavigationMenuIndicator />
        </NavigationMenuItem>
        {navLinks.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink asChild>
              <Link
                href={item.href}
                className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
              >
                {item.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
      <NavigationMenuViewport />
    </NavigationMenu>
  )
}

function NavigationActions() {
  return (
    <React.Fragment>
      <ThemeToggle className="rounded-full border border-white/80 bg-white/90 shadow-sm dark:border-white/10 dark:bg-slate-900/60" />
      <Link href="/optimize">
        <AnimatedButton>Launch app</AnimatedButton>
      </Link>
    </React.Fragment>
  )
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full border border-white/40 bg-white/70 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px] border-white/10 bg-white/80 backdrop-blur dark:bg-slate-950/80">
        <SheetHeader className="text-left">
          <SheetTitle className="text-lg font-semibold text-slate-900 dark:text-white">Navigation</SheetTitle>
          <SheetDescription className="text-sm text-slate-500 dark:text-slate-300">
            Explore the optimizer tools and glass dashboards.
          </SheetDescription>
        </SheetHeader>
        <nav className="mt-8 flex flex-col gap-6">
          {navLinks.map((item) => (
            <Link key={item.href} href={item.href} className="text-base font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-10 space-y-4 rounded-3xl border border-white/40 bg-white/70 p-6 shadow-inner dark:border-white/10 dark:bg-slate-900/60">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Quick links</p>
          <div className="grid gap-3">
            {quickLinks.map((link) => (
              <Link key={link.title} href={link.href} className="rounded-2xl border border-white/40 bg-white/70 p-3 text-sm text-slate-700 shadow-sm hover:-translate-y-0.5 hover:shadow dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200">
                {link.title}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/optimize">
            <AnimatedButton className="w-full">Launch app</AnimatedButton>
          </Link>
          <Link href="#pricing" className="text-sm text-slate-600 underline-offset-4 hover:underline dark:text-slate-300">
            View Pricing
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
