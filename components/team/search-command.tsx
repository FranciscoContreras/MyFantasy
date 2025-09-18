"use client"

import * as React from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { TeamPlayer } from "@/components/team/types"

interface SearchCommandProps {
  players: TeamPlayer[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (player: TeamPlayer) => void
}

export function SearchCommand({ players, open, onOpenChange, onSelect }: SearchCommandProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        onOpenChange(true)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onOpenChange])

  React.useEffect(() => {
    if (open) {
      const timeout = window.setTimeout(() => inputRef.current?.focus(), 150)
      return () => window.clearTimeout(timeout)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-white/20 bg-white/90 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.55)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/60">
        <Command>
          <CommandInput ref={inputRef} placeholder="Search player..." />
          <CommandList>
            <CommandEmpty>No players found.</CommandEmpty>
            <CommandGroup heading="All Players">
              {players.map((player) => (
                <CommandItem
                  key={player.id}
                  value={`${player.name} ${player.position}`}
                  onSelect={() => {
                    onSelect(player)
                    onOpenChange(false)
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-white">{player.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-300">
                      {player.position} • {player.team} vs {player.opponent}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
