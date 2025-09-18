"use client"

import * as React from "react"
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedButton } from "@/components/ui/animated-button"
import { PlayerCard } from "@/components/team/player-card"
import { RosterTable } from "@/components/team/roster-table"
import { PlayerDialog } from "@/components/team/player-dialog"
import { ConfirmDialog } from "@/components/team/confirm-dialog"
import { SearchCommand } from "@/components/team/search-command"
import type { RosterSection, TeamPlayer } from "@/components/team/types"

const initialSections: RosterSection[] = [
  {
    id: "starters",
    title: "Starters",
    subtitle: "Locked in for kickoff",
    players: [
      { id: "qb1", name: "Josh Allen", position: "QB", team: "BUF", opponent: "@KC", projection: 24.3, floor: 18.1, ceiling: 33.8, status: "active" },
      { id: "rb1", name: "Christian McCaffrey", position: "RB", team: "SF", opponent: "vs SEA", projection: 23.5, floor: 17.2, ceiling: 32.4, status: "active" },
      { id: "rb2", name: "Bijan Robinson", position: "RB", team: "ATL", opponent: "vs NO", projection: 18.8, floor: 13.4, ceiling: 27.6, status: "active" },
      { id: "wr1", name: "Justin Jefferson", position: "WR", team: "MIN", opponent: "vs GB", projection: 21.4, floor: 15.6, ceiling: 30.9, status: "questionable" },
      { id: "wr2", name: "CeeDee Lamb", position: "WR", team: "DAL", opponent: "@PHI", projection: 19.1, floor: 13.5, ceiling: 27.2, status: "active" },
      { id: "wr3", name: "Chris Olave", position: "WR", team: "NO", opponent: "@ATL", projection: 17.6, floor: 12.2, ceiling: 25.1, status: "active" },
      { id: "te1", name: "Sam LaPorta", position: "TE", team: "DET", opponent: "vs CHI", projection: 14.4, floor: 9.1, ceiling: 21.8, status: "active" },
      { id: "flex1", name: "Puka Nacua", position: "WR", team: "LAR", opponent: "@SEA", projection: 16.7, floor: 11.8, ceiling: 24.3, status: "active" },
    ],
  },
  {
    id: "bench",
    title: "Bench",
    subtitle: "Ready to swap in",
    players: [
      { id: "rb3", name: "Alvin Kamara", position: "RB", team: "NO", opponent: "@ATL", projection: 17.1, floor: 11.9, ceiling: 23.5, status: "active" },
      { id: "wr4", name: "Deebo Samuel", position: "WR", team: "SF", opponent: "vs SEA", projection: 16.9, floor: 11.3, ceiling: 24.8, status: "active" },
      { id: "te2", name: "Evan Engram", position: "TE", team: "JAX", opponent: "@HOU", projection: 12.2, floor: 8.4, ceiling: 18.3, status: "active" },
      { id: "dst1", name: "Cowboys DST", position: "DST", team: "DAL", opponent: "@PHI", projection: 9.8, floor: 5.5, ceiling: 15.2, status: "active" },
    ],
  },
]

const freeAgents: TeamPlayer[] = [
  { id: "wr5", name: "Tank Dell", position: "WR", team: "HOU", opponent: "vs JAX", projection: 15.2, floor: 10.2, ceiling: 22.5, status: "active" },
  { id: "rb4", name: "Jaylen Warren", position: "RB", team: "PIT", opponent: "@CIN", projection: 13.9, floor: 9.1, ceiling: 20.3, status: "active" },
  { id: "qb2", name: "CJ Stroud", position: "QB", team: "HOU", opponent: "vs JAX", projection: 20.4, floor: 15.0, ceiling: 28.1, status: "active" },
]

export default function TeamManagementPage() {
  const [sections, setSections] = React.useState(initialSections)
  const [dialogPlayer, setDialogPlayer] = React.useState<TeamPlayer | null>(null)
  const [confirmPlayer, setConfirmPlayer] = React.useState<TeamPlayer | null>(null)
  const [isCommandOpen, setIsCommandOpen] = React.useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const allPlayers = React.useMemo(
    () => sections.flatMap((section) => section.players),
    [sections],
  )

  const cloneSections = (prev: RosterSection[]) =>
    prev.map((section) => ({ ...section, players: [...section.players] }))

  const handleDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const sourceSection = sections.find((section) => section.players.some((p) => p.id === active.id))
      const targetSection = sections.find((section) => section.players.some((p) => p.id === over.id))

      if (!sourceSection || !targetSection) return

      const sourceIndex = sections.indexOf(sourceSection)
      const targetIndex = sections.indexOf(targetSection)

      const sourcePlayerIndex = sourceSection.players.findIndex((p) => p.id === active.id)
      const targetPlayerIndex = targetSection.players.findIndex((p) => p.id === over.id)

      if (sourceIndex === -1 || targetIndex === -1 || sourcePlayerIndex === -1 || targetPlayerIndex === -1) {
        return
      }

      setSections((prev) => {
        const next = cloneSections(prev)
        const movingPlayer = next[sourceIndex].players.splice(sourcePlayerIndex, 1)[0]
        next[targetIndex].players.splice(targetPlayerIndex, 0, movingPlayer)
        return next
      })
    },
    [sections],
  )

  const handleAddPlayer = (player: TeamPlayer) => {
    const exists = sections.some((section) => section.players.some((p) => p.id === player.id))
    if (exists) {
      return
    }
    setSections((prev) => {
      const next = cloneSections(prev)
      next[1]?.players.push(player)
      return next
    })
  }

  const handleDropPlayer = (player: TeamPlayer) => {
    setConfirmPlayer(player)
  }

  const confirmDrop = () => {
    if (!confirmPlayer) return
    setSections((prev) =>
      prev.map((section) => ({
        ...section,
        players: section.players.filter((p) => p.id !== confirmPlayer.id),
      })),
    )
    setConfirmPlayer(null)
  }

  return (
    <div className="space-y-12">
      <section className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Team management</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Drag-and-drop starters, explore matchups, and keep your roster optimized with real-time projections.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <AnimatedButton onClick={() => setIsCommandOpen(true)}>Add player</AnimatedButton>
          <AnimatedButton variant="secondary" onClick={() => setDialogPlayer(allPlayers[0])}>
            View summary
          </AnimatedButton>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          {sections.map((section) => (
            <RosterColumn key={section.id} section={section} onViewPlayer={setDialogPlayer} onDropPlayer={handleDropPlayer} />
          ))}
        </DndContext>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Roster analytics</h2>
          <p className="text-sm text-slate-500 dark:text-slate-300">Mean vs floor/ceiling across active lineup.</p>
        </div>
        <Tabs defaultValue="starters" className="space-y-6">
          <TabsList className="bg-white/70 shadow-sm dark:bg-slate-900/60">
            {sections.map((section) => (
              <TabsTrigger key={section.id} value={section.id}>
                {section.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {sections.map((section) => (
            <TabsContent key={section.id} value={section.id} className="space-y-4">
              <RosterTable players={section.players} />
            </TabsContent>
          ))}
        </Tabs>
      </section>

      <PlayerDialog player={dialogPlayer} open={Boolean(dialogPlayer)} onOpenChange={(open) => !open && setDialogPlayer(null)} />
      <ConfirmDialog
        open={Boolean(confirmPlayer)}
        onOpenChange={(open) => !open && setConfirmPlayer(null)}
        title="Drop player?"
        description="Dropping a player removes them from all saved lineups. You can re-add them via the command palette."
        confirmLabel="Drop"
        onConfirm={confirmDrop}
      />
      <SearchCommand
        open={isCommandOpen}
        onOpenChange={setIsCommandOpen}
        players={[...freeAgents, ...allPlayers]}
        onSelect={handleAddPlayer}
      />
    </div>
  )
}

interface RosterColumnProps {
  section: RosterSection
  onViewPlayer: (player: TeamPlayer) => void
  onDropPlayer: (player: TeamPlayer) => void
}

function RosterColumn({ section, onViewPlayer, onDropPlayer }: RosterColumnProps) {
  return (
    <div className="space-y-4">
      <header>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{section.title}</h3>
        {section.subtitle ? <p className="text-sm text-slate-500 dark:text-slate-300">{section.subtitle}</p> : null}
      </header>
      <div className="grid gap-4">
        <SortableContext items={section.players.map((player) => player.id)} strategy={verticalListSortingStrategy}>
          {section.players.map((player) => (
            <PlayerCard key={player.id} player={player} onView={onViewPlayer} onDropPlayer={onDropPlayer} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
