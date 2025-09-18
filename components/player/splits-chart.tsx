"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { PlayerSplitEntry } from "@/lib/analysis/player-dashboard"

interface SplitsChartProps {
  data: PlayerSplitEntry[]
}

export function SplitsChart({ data }: SplitsChartProps) {
  return (
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
          <XAxis dataKey="label" stroke="rgba(148,163,184,0.8)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(148,163,184,0.7)" fontSize={12} tickLine={false} axisLine={false} width={32} />
          <Tooltip
            cursor={{ fill: "rgba(59,130,246,0.08)" }}
            contentStyle={{ borderRadius: 14, border: "1px solid rgba(148,163,184,0.3)", background: "rgba(255,255,255,0.95)", padding: "10px 12px" }}
            formatter={(value: number, key: string) => [`${value.toFixed(1)} pts`, key === "secondary" ? "Opponent" : "You"]}
          />
          <Bar dataKey="value" name="You" radius={[8, 8, 0, 0]} fill="#6366f1" />
          <Bar dataKey="secondary" name="Opponent" radius={[8, 8, 0, 0]} fill="#cbd5f5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
