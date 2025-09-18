"use client"

import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Ellipsis, MoveHorizontal } from "lucide-react"

import { GlassCard } from "@/components/ui/glass-card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import type { TeamPlayer } from "@/components/team/types"

interface PlayerCardProps {
  player: TeamPlayer
  onView?: (player: TeamPlayer) => void
  onDropPlayer?: (player: TeamPlayer) => void
}

export function PlayerCard({ player, onView, onDropPlayer }: PlayerCardProps) {
  const [hovered, setHovered] = useState(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: player.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <GlassCard
      ref={setNodeRef}
      style={style as React.CSSProperties}
      className={cn(
        "relative flex cursor-grab select-none items-center justify-between gap-4 rounded-3xl border border-white/40 bg-white/70 p-4 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.5)] transition-all",
        "dark:border-white/10 dark:bg-slate-900/60",
        hovered ? "scale-[1.02]" : "",
        isDragging ? "z-20 border-sky-200/70 shadow-[0_25px_70px_-25px_rgba(37,99,235,0.45)]" : "",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-player-id={player.id}
    >
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/80 text-slate-500 transition-colors hover:bg-white dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-200"
        {...attributes}
        {...listeners}
      >
        <MoveHorizontal className="h-4 w-4" />
        <span className="sr-only">Drag player</span>
      </button>
      <div className="flex flex-1 flex-col gap-1 text-left">
        <div className="flex items-center gap-2">
          <p className="text-base font-semibold text-slate-900 dark:text-white">{player.name}</p>
          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-600 dark:bg-sky-500/20 dark:text-sky-200">
            {player.position}
          </span>
          {player.status && player.status !== "active" ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
              {player.status}
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-300">
          <span>{player.team} vs {player.opponent}</span>
          <span className="flex items-center gap-1">
            <span className="font-semibold text-slate-900 dark:text-white">{player.projection.toFixed(1)}</span>
            pts
          </span>
          <span className="flex items-center gap-1 text-emerald-500">
            Floor {player.floor.toFixed(1)}
          </span>
          <span className="flex items-center gap-1 text-indigo-500">
            Ceiling {player.ceiling.toFixed(1)}
          </span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/80 text-slate-500 transition-colors hover:bg-white dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-200">
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">Open player actions</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onView?.(player)}>View breakdown</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDropPlayer?.(player)}>Drop player</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </GlassCard>
  )
}
