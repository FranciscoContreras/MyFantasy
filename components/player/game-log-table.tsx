"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { SwipePanels } from "@/components/ui/swipe-panels"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { PlayerGameLogEntry } from "@/lib/analysis/player-dashboard"

interface GameLogTableProps {
  data: PlayerGameLogEntry[]
}

export function GameLogTable({ data }: GameLogTableProps) {
  return (
    <GlassCard tone="muted" className="space-y-4">
      <GlassCard.Header className="space-y-1">
        <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Game log</GlassCard.Title>
        <p className="text-sm text-slate-600 dark:text-slate-300">Recent performance values with usage context.</p>
      </GlassCard.Header>
      <GlassCard.Content className="hidden md:block">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Week</TableHead>
                <TableHead>Opponent</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead className="text-right">Usage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((entry) => (
                <TableRow key={entry.week} className="hover:bg-white/60 dark:hover:bg-slate-900/40">
                  <TableCell className="font-medium text-slate-900 dark:text-white">{entry.week}</TableCell>
                  <TableCell>{entry.opponent}</TableCell>
                  <TableCell>
                    <span className={entry.result === "W" ? "text-emerald-500" : "text-rose-500"}>{entry.result}</span>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{entry.points.toFixed(1)}</TableCell>
                  <TableCell className="text-right text-sm text-slate-500 dark:text-slate-400">
                    {entry.targets ? `${entry.targets} targets` : entry.touches ? `${entry.touches} touches` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </GlassCard.Content>
      <GlassCard.Content className="md:hidden">
        <SwipePanels
          aria-label="Recent game log cards"
          className="md:grid-cols-1"
          panelClassName="min-w-[250px] sm:min-w-[300px] md:min-w-0"
        >
          {data.map((entry) => (
            <div
              key={entry.week}
              className="flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/85 p-4 text-sm text-slate-600 shadow-inner dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Week</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{entry.week}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Result</p>
                  <p className={entry.result === "W" ? "font-semibold text-emerald-500" : "font-semibold text-rose-500"}>{entry.result}</p>
                </div>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Opponent</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{entry.opponent}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Points</p>
                  <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-300">{entry.points.toFixed(1)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Usage</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {entry.targets ? `${entry.targets} targets` : entry.touches ? `${entry.touches} touches` : "—"}
                </p>
              </div>
            </div>
          ))}
        </SwipePanels>
      </GlassCard.Content>
    </GlassCard>
  )
}
