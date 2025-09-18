"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { PositionPerformanceEntry } from "@/lib/analysis/performance-dashboard"

interface PositionPerformanceChartProps {
  data: PositionPerformanceEntry[]
}

export function PositionPerformanceChart({ data }: PositionPerformanceChartProps) {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
          <XAxis dataKey="position" stroke="rgba(148,163,184,0.8)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(148,163,184,0.7)" fontSize={12} tickLine={false} axisLine={false} width={34} />
          <Tooltip
            cursor={{ fill: "rgba(99,102,241,0.08)" }}
            contentStyle={{ borderRadius: 14, border: "1px solid rgba(148,163,184,0.3)", background: "rgba(255,255,255,0.95)", padding: "10px 12px" }}
            formatter={(value: number, key: string) => [`${value.toFixed(1)} pts`, key === "projected" ? "Projected" : "Actual"]}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="projected" name="Projected" radius={[8, 8, 0, 0]} fill="#38bdf8" />
          <Bar dataKey="actual" name="Actual" radius={[8, 8, 0, 0]} fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
