"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import type { TeamRadarMetric } from "@/lib/analysis/performance-dashboard"

interface TeamComparisonRadarProps {
  data: TeamRadarMetric[]
}

export function TeamComparisonRadar({ data }: TeamComparisonRadarProps) {
  return (
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius={110} margin={{ top: 16, right: 16, bottom: 16, left: 16 }}>
          <PolarGrid stroke="rgba(148,163,184,0.25)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "rgba(30,41,59,0.7)", fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "rgba(148,163,184,0.7)", fontSize: 10 }} />
          <Tooltip
            contentStyle={{ borderRadius: 14, border: "1px solid rgba(148,163,184,0.3)", background: "rgba(255,255,255,0.95)", padding: "10px 12px" }}
            formatter={(value: number, key: string) => [`${value.toFixed(0)} score`, key === "you" ? "You" : "Opponent"]}
          />
          <Radar name="You" dataKey="you" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.25} />
          <Radar name="Opponent" dataKey="opponent" stroke="#f97316" fill="#f97316" fillOpacity={0.15} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
