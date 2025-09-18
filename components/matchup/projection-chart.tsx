"use client"

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { GlassCard } from "@/components/ui/glass-card"

type ChartDatum = {
  label: string
  team: number
  opponent: number
}

interface ProjectionChartProps {
  data: ChartDatum[]
}

export function ProjectionChart({ data }: ProjectionChartProps) {
  return (
    <GlassCard tone="default" className="space-y-4">
      <GlassCard.Header className="space-y-1">
        <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">Projection delta</GlassCard.Title>
        <p className="text-sm text-slate-600 dark:text-slate-300">Actual points vs opponent baseline by week.</p>
      </GlassCard.Header>
      <GlassCard.Content className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 16, right: 24, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="teamColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="opponentColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="label" stroke="rgba(148,163,184,0.8)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(148,163,184,0.7)" fontSize={12} tickLine={false} axisLine={false} width={34} />
            <Tooltip
              cursor={{ stroke: "rgba(79,70,229,0.35)", strokeWidth: 1 }}
              contentStyle={{
                borderRadius: 14,
                border: "1px solid rgba(148,163,184,0.25)",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(8px)",
                padding: "10px 12px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="team" stroke="#4f46e5" fill="url(#teamColor)" strokeWidth={2} name="Your team" />
            <Area type="monotone" dataKey="opponent" stroke="#f97316" fill="url(#opponentColor)" strokeWidth={2} name="Opponent" />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard.Content>
    </GlassCard>
  )
}
