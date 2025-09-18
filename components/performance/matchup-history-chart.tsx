"use client"

import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
} from "recharts"

import type { MatchupHistoryEntry } from "@/lib/analysis/performance-dashboard"

interface MatchupHistoryChartProps {
  data: MatchupHistoryEntry[]
}

export function MatchupHistoryChart({ data }: MatchupHistoryChartProps) {
  const enriched = data.map((entry) => ({
    ...entry,
    resultColor: entry.result === "W" ? "#22c55e" : "#ef4444",
  }))

  return (
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={enriched} margin={{ top: 12, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.2)" />
          <XAxis dataKey="week" stroke="rgba(148,163,184,0.8)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(148,163,184,0.7)" fontSize={12} tickLine={false} axisLine={false} width={32} />
          <Tooltip
            cursor={{ stroke: "rgba(59,130,246,0.2)", strokeWidth: 1 }}
            contentStyle={{
              borderRadius: 14,
              border: "1px solid rgba(148,163,184,0.3)",
              background: "rgba(255,255,255,0.95)",
              padding: "10px 12px",
            }}
            formatter={(value: number, key: string, { payload }) => {
              if (key === "result") {
                return [payload.result, "Result"]
              }
              return [`${value.toFixed(1)} pts`, key === "pointsFor" ? "You" : "Opponent"]
            }}
            labelFormatter={(label, payload) => {
              const opponent = payload?.[0]?.payload?.opponent
              const result = payload?.[0]?.payload?.result
              return `${label} • ${opponent ?? ""} • ${result ?? ""}`
            }}
          />
          <Bar dataKey="pointsFor" name="You" radius={[6, 6, 0, 0]} fill="#6366f1" />
          <Line type="monotone" dataKey="pointsAgainst" name="Opponent" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
