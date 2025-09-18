"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import type { ProjectionDistributionBucket } from "@/lib/analysis/projections-dashboard"

interface ProbabilityDistributionChartProps {
  data: ProjectionDistributionBucket[]
}

export function ProbabilityDistributionChart({ data }: ProbabilityDistributionChartProps) {
  const colors: Record<string, string> = {
    Bust: "#f97316",
    Solid: "#6366f1",
    Boom: "#22c55e",
  }

  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="rgba(148,163,184,0.2)" />
          <XAxis type="number" domain={[0, 1]} hide />
          <YAxis type="category" dataKey="label" width={60} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value: number, key, payload) => {
              if (key === "probability") {
                return [`${Math.round(value * 100)}%`, payload?.payload?.label]
              }
              return value
            }}
            labelFormatter={(label, payload) => {
              const range = payload?.[0]?.payload
              return `${label} • ${range ? `${range.floor.toFixed(1)}-${range.ceiling.toFixed(1)} pts` : ""}`
            }}
            contentStyle={{
              borderRadius: 14,
              border: "1px solid rgba(148,163,184,0.3)",
              background: "rgba(255,255,255,0.95)",
              padding: "10px 12px",
            }}
          />
          <Bar dataKey="probability" radius={[12, 12, 12, 12]}>
            {data.map((entry) => (
              <Cell key={entry.label} fill={colors[entry.label] ?? "#4f46e5"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
