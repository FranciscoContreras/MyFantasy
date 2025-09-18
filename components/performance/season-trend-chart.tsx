"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"

import type { SeasonTrendPoint } from "@/lib/analysis/performance-dashboard"

interface SeasonTrendChartProps {
  data: SeasonTrendPoint[]
}

export function SeasonTrendChart({ data }: SeasonTrendChartProps) {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 16, right: 24, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="projectedColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="actualColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(148,163,184,0.25)" />
          <XAxis dataKey="week" stroke="rgba(148,163,184,0.8)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(148,163,184,0.7)" fontSize={12} tickLine={false} axisLine={false} width={32} />
          <Tooltip
            cursor={{ stroke: "rgba(79,70,229,0.25)", strokeWidth: 1 }}
            contentStyle={{
              borderRadius: 16,
              border: "1px solid rgba(148,163,184,0.3)",
              background: "rgba(255,255,255,0.95)",
              padding: "12px 14px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="projected" name="Projected" stroke="#38bdf8" fill="url(#projectedColor)" strokeWidth={2} />
          <Area type="monotone" dataKey="actual" name="Actual" stroke="#4f46e5" fill="url(#actualColor)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
