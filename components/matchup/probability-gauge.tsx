"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const CENTER_X = 100
const CENTER_Y = 100
const ARC_RADIUS = 90
const POINTER_RADIUS = 76
const FULL_ARC_LENGTH = Math.PI * ARC_RADIUS

interface ProbabilityGaugeProps {
  value: number
  label?: string
  className?: string
}

export function ProbabilityGauge({ value, label = "Win probability", className }: ProbabilityGaugeProps) {
  const clamped = Math.min(Math.max(value, 0), 100)
  const angleRadians = (clamped / 100) * Math.PI
  const pointer = React.useMemo(() => {
    return {
      x: CENTER_X + POINTER_RADIUS * Math.cos(Math.PI - angleRadians),
      y: CENTER_Y - POINTER_RADIUS * Math.sin(angleRadians),
    }
  }, [angleRadians])

  const arcLength = (FULL_ARC_LENGTH * clamped) / 100
  const gradientId = React.useId()

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative h-36 w-36" role="img" aria-label={`${clamped.toFixed(0)}% ${label}`}>
        <svg viewBox="0 0 200 110" className="h-full w-full">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#6366f1" />
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
            strokeDasharray={`${arcLength} ${FULL_ARC_LENGTH}`}
            strokeDashoffset={FULL_ARC_LENGTH - arcLength}
            className="transition-[stroke-dashoffset] duration-300 ease-out"
          />
          <circle cx={CENTER_X} cy={CENTER_Y} r="6" fill="#0f172a" opacity={0.6} />
          <line
            x1={CENTER_X}
            y1={CENTER_Y}
            x2={pointer.x}
            y2={pointer.y}
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
