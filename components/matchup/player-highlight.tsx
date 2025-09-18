"use client"

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"

interface PlayerHighlightProps {
  name: string
  team: string
  position: string
  projection: number
  matchup: string
  snippet: string
}

export function PlayerHighlight({ name, team, position, projection, matchup, snippet }: PlayerHighlightProps) {
  return (
    <HoverCard>
      <HoverCardTrigger className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/85 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-white dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200">
        <span>{name}</span>
        <Badge className="border-transparent bg-indigo-100 text-indigo-600">{projection.toFixed(1)} pts</Badge>
      </HoverCardTrigger>
      <HoverCardContent className="w-72 space-y-3 rounded-[20px] border border-white/40 bg-white/90 p-4 shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-slate-900/70">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{name}</p>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{team} • {position}</p>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-300">Matchup: {matchup}</p>
        <p className="text-sm text-slate-600 dark:text-slate-300">{snippet}</p>
      </HoverCardContent>
    </HoverCard>
  )
}
