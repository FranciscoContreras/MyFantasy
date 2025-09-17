import type { PropsWithChildren } from "react"
import Link from "next/link"

import "../globals.css"

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(51,209,204,0.12),_transparent_60%),radial-gradient(circle_at_20%_20%,_rgba(126,170,255,0.18),_transparent_55%),linear-gradient(135deg,_#020617,_#0b1120)] px-4 py-12">
      <Link href="/" className="mb-10 text-sm font-semibold text-primary">
        ⬅ Back to home
      </Link>
      {children}
    </div>
  )
}
