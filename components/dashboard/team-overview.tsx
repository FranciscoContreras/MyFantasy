import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TeamOverviewPlayer {
  id: string
  name: string
  position: string
  team: string
  opponent: string
  projection: number
  status: "locked" | "flex" | "questionable"
}

const samplePlayers: TeamOverviewPlayer[] = [
  { id: "1", name: "Josh Allen", position: "QB", team: "BUF", opponent: "@ KC", projection: 24.3, status: "locked" },
  { id: "2", name: "Christian McCaffrey", position: "RB", team: "SF", opponent: "vs DAL", projection: 23.8, status: "locked" },
  { id: "3", name: "Bijan Robinson", position: "RB", team: "ATL", opponent: "@ TB", projection: 18.9, status: "flex" },
  { id: "4", name: "Justin Jefferson", position: "WR", team: "MIN", opponent: "vs DET", projection: 21.8, status: "questionable" },
  { id: "5", name: "Puka Nacua", position: "WR", team: "LAR", opponent: "@ SEA", projection: 17.6, status: "locked" },
]

export function TeamOverviewTable({ players = samplePlayers }: { players?: TeamOverviewPlayer[] }) {
  return (
    <ScrollArea className="max-h-[320px] rounded-[20px] border border-white/40 bg-white/85 p-0 shadow-inner dark:border-white/10 dark:bg-slate-900/60">
      <Table>
        <TableHeader className="sticky top-0 bg-white/90 backdrop-blur-md dark:bg-slate-900/80">
          <TableRow>
            <TableHead className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Player</TableHead>
            <TableHead className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Team</TableHead>
            <TableHead className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Opponent</TableHead>
            <TableHead className="text-right text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Proj</TableHead>
            <TableHead className="text-right text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id} className="border-white/30 dark:border-white/10">
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">{player.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-300">{player.position}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm font-medium text-slate-700 dark:text-slate-200">{player.team}</TableCell>
              <TableCell className="text-sm text-slate-600 dark:text-slate-200">{player.opponent}</TableCell>
              <TableCell className="text-right text-sm font-semibold text-slate-900 dark:text-white">
                {player.projection.toFixed(1)}
              </TableCell>
              <TableCell className="text-right">
                <StatusBadge status={player.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

function StatusBadge({ status }: { status: TeamOverviewPlayer["status"] }) {
  if (status === "locked") {
    return <Badge className="border-transparent bg-emerald-100 text-emerald-600">Locked</Badge>
  }
  if (status === "flex") {
    return <Badge className="border-transparent bg-indigo-100 text-indigo-600">Flex ready</Badge>
  }
  return <Badge className="border-transparent bg-amber-100 text-amber-600">Questionable</Badge>
}
