"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface ProbabilityGaugeProps {
  value: number
  label?: string
  className?: string
}

export function ProbabilityGauge({ value, label = "Win probability", className }: ProbabilityGaugeProps) {
  const clamped = Math.min(Math.max(value, 0), 100)
  const angle = (clamped / 100) * 180
  const gradientId = React.useId()

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 200 110" className="h-full w-full">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
          </defs>
          <path
            d="M10,100 A90,90 0 0,1 190,100"
            fill="none"
            stroke="rgba(148,163,184,0.25)"
            strokeWidth={14}
            strokeLinecap="round"
          />
          <path
            d="M10,100 A90,90 0 0,1 190,100"
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={`${Math.max(angle, 0) * 2.83} 1000`}
          />
          <circle cx="100" cy="100" r="6" fill="#0f172a" opacity={0.6} />
          <line
            x1="100"
            y1="100"
            x2={100 + 80 * Math.cos((Math.PI * (180 - angle)) / 180)}
            y2={100 - 80 * Math.sin((Math.PI * (angle)) / 180)}
            stroke="#1d4ed8"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{label}</span>
          <span className="text-3xl font-semibold text-slate-900 dark:text-white">{clamped.toFixed(0)}%</span>
        </div>
      </div>
      <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-300">
        <div className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-slate-300" />
          Opponent
        </div>
        <div className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-500" />
          You
        </div>
      </div>
    </div>
  )
}
