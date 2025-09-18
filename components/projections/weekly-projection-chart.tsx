"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { ProjectionWeeklyPoint } from "@/lib/analysis/projections-dashboard"

interface WeeklyProjectionChartProps {
  data: ProjectionWeeklyPoint[]
}

export function WeeklyProjectionChart({ data }: WeeklyProjectionChartProps) {
  const processed = data.map((point) => ({
    ...point,
    range: Number((point.ceiling - point.floor).toFixed(2)),
  }))

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={processed} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="ceilingGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.2)" />
          <XAxis dataKey="week" stroke="rgba(148,163,184,0.8)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(148,163,184,0.7)" fontSize={12} tickLine={false} axisLine={false} width={30} />
          <Tooltip
            cursor={{ stroke: "rgba(79,70,229,0.25)", strokeWidth: 1 }}
            formatter={(value: number, key) => {
              if (key === "range") return []
              return [`${value.toFixed(1)} pts`, key.charAt(0).toUpperCase() + key.slice(1)]
            }}
            labelFormatter={(label, payload) => {
              const opponent = payload?.[0]?.payload?.opponent
              return `${label} • ${opponent ?? ""}`
            }}
            contentStyle={{
              borderRadius: 16,
              border: "1px solid rgba(148,163,184,0.3)",
              background: "rgba(255,255,255,0.95)",
              padding: "10px 12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="floor"
            stackId="projection"
            stroke="transparent"
            fill="transparent"
          />
          <Area
            type="monotone"
            dataKey="range"
            stackId="projection"
            stroke="transparent"
            fill="url(#ceilingGradient)"
          />
          <Line type="monotone" dataKey="projection" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
