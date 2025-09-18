"use client"

import * as React from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { TeamPlayer } from "@/components/team/types"

interface RosterTableProps {
  players: TeamPlayer[]
}

const sortOptions = [
  { label: "Projection", value: "projection" },
  { label: "Floor", value: "floor" },
  { label: "Ceiling", value: "ceiling" },
  { label: "Name", value: "name" },
]

export function RosterTable({ players }: RosterTableProps) {
  const [positionFilter, setPositionFilter] = React.useState<string>("all")
  const [sortBy, setSortBy] = React.useState<string>("projection")
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc")

  const positions = React.useMemo(() => {
    const unique = new Set<string>()
    players.forEach((player) => unique.add(player.position))
    return Array.from(unique)
  }, [players])

  const filteredPlayers = React.useMemo(() => {
    const base = positionFilter === "all" ? players : players.filter((player) => player.position === positionFilter)
    const sorted = [...base].sort((a, b) => {
      if (sortBy === "name") {
        const compare = a.name.localeCompare(b.name)
        return sortDir === "asc" ? compare : -compare
      }
      const key = sortBy as keyof Pick<TeamPlayer, "projection" | "floor" | "ceiling">
      const diff = a[key] - b[key]
      return sortDir === "asc" ? diff : -diff
    })
    return sorted
  }, [players, positionFilter, sortBy, sortDir])

  const handleToggleSortDir = () => {
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Select value={positionFilter} onValueChange={setPositionFilter}>
            <SelectTrigger className="w-[140px] rounded-full border-white/50 bg-white/85 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
              <SelectValue placeholder="Position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All positions</SelectItem>
              {positions.map((pos) => (
                <SelectItem key={pos} value={pos}>
                  {pos}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] rounded-full border-white/50 bg-white/85 shadow-sm dark:border-white/10 dark:bg-slate-900/60">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleSortDir}
            className="rounded-full border border-white/50 bg-white/85 text-xs font-semibold text-slate-600 shadow-sm hover:bg-white dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-200"
          >
            {sortDir === "asc" ? "Asc" : "Desc"}
          </Button>
        </div>
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
          {filteredPlayers.length} players
        </p>
      </div>
      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/80 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.6)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60">
        <Table>
        <TableHeader>
          <TableRow className="border-white/20 text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            <TableHead className="font-semibold text-slate-500">Player</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Opp</TableHead>
            <TableHead className="text-right">Proj</TableHead>
            <TableHead className="text-right">Floor</TableHead>
            <TableHead className="text-right">Ceiling</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlayers.map((player) => (
            <TableRow key={player.id} className="border-white/10 text-sm text-slate-700 dark:text-slate-200">
              <TableCell className="font-semibold text-slate-900 dark:text-white">{player.name}</TableCell>
              <TableCell>{player.team}</TableCell>
              <TableCell>{player.opponent}</TableCell>
              <TableCell className="text-right">{player.projection.toFixed(1)}</TableCell>
              <TableCell className="text-right text-emerald-500">{player.floor.toFixed(1)}</TableCell>
              <TableCell className="text-right text-indigo-500">{player.ceiling.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}
