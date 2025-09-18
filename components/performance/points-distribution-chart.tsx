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

import type { PointsDistributionBin } from "@/lib/analysis/performance-dashboard"

interface PointsDistributionChartProps {
  data: PointsDistributionBin[]
}

export function PointsDistributionChart({ data }: PointsDistributionChartProps) {
  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
          <XAxis dataKey="range" stroke="rgba(148,163,184,0.8)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(148,163,184,0.7)" fontSize={12} tickLine={false} axisLine={false} width={28} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: "rgba(79,70,229,0.08)" }}
            contentStyle={{ borderRadius: 14, border: "1px solid rgba(148,163,184,0.3)", background: "rgba(255,255,255,0.95)", padding: "10px 12px" }}
            formatter={(value: number) => [`${value} games`, "Frequency"]}
          />
          <Bar dataKey="games" name="Games" radius={[10, 10, 0, 0]} fill="#818cf8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
