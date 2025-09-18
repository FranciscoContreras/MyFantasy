import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

import type { TeamPlayer } from "@/components/team/types"

interface PlayerDialogProps {
  player: TeamPlayer | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlayerDialog({ player, open, onOpenChange }: PlayerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border-white/40 bg-white/90 shadow-[0_35px_75px_-30px_rgba(15,23,42,0.55)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/70">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl text-slate-900 dark:text-white">
            {player?.name}
            {player ? (
              <Badge variant="secondary" className="uppercase tracking-[0.2em]">
                {player.position}
              </Badge>
            ) : null}
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-300">
            Weekly projection summary, matchup intel, and floor/ceiling spans.
          </DialogDescription>
        </DialogHeader>
        {player ? (
          <div className="grid gap-6 text-sm text-slate-600 dark:text-slate-200">
            <div className="grid gap-2">
              <p className="font-semibold text-slate-900 dark:text-white">Projection</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="rounded-2xl bg-slate-100/70 p-4 shadow-inner dark:bg-slate-800/60">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Mean</p>
                  <p className="text-xl font-semibold text-slate-900 dark:text-white">{player.projection.toFixed(1)}</p>
                </div>
                <div className="rounded-2xl bg-emerald-100/70 p-4 shadow-inner dark:bg-emerald-500/20">
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-200">Floor</p>
                  <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-200">{player.floor.toFixed(1)}</p>
                </div>
                <div className="rounded-2xl bg-indigo-100/70 p-4 shadow-inner dark:bg-indigo-500/20">
                  <p className="text-xs uppercase tracking-[0.25em] text-indigo-700 dark:text-indigo-200">Ceiling</p>
                  <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-200">{player.ceiling.toFixed(1)}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <p className="font-semibold text-slate-900 dark:text-white">Matchup</p>
              <p>
                {player.team} vs {player.opponent} • Status {player.status ?? "active"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                Pull detailed matchup trends from the analytics engine to enhance this preview.
              </p>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
