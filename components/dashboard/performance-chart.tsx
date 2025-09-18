"use client"

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { GlassCard } from "@/components/ui/glass-card"

const sampleData = [
  { week: "W1", points: 118, projection: 112 },
  { week: "W2", points: 124, projection: 119 },
  { week: "W3", points: 131, projection: 128 },
  { week: "W4", points: 109, projection: 117 },
  { week: "W5", points: 142, projection: 129 },
  { week: "W6", points: 137, projection: 134 },
]

export function PerformanceChart({ data = sampleData }: { data?: typeof sampleData }) {
  return (
    <GlassCard tone="default" className="space-y-4">
      <GlassCard.Header className="space-y-1">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Performance trend</p>
        <GlassCard.Title className="text-lg font-semibold text-slate-900 dark:text-white">
          Actual vs projected points
        </GlassCard.Title>
      </GlassCard.Header>
      <GlassCard.Content className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProjection" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="week" stroke="rgba(148, 163, 184, 0.8)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="rgba(148, 163, 184, 0.7)" fontSize={12} tickLine={false} axisLine={false} width={32} />
            <Tooltip
              cursor={{ stroke: "rgba(79, 70, 229, 0.3)", strokeWidth: 1 }}
              contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,0.3)", background: "rgba(255,255,255,0.95)", padding: "10px 12px" }}
            />
            <Area type="monotone" dataKey="projection" stroke="#38bdf8" fill="url(#colorProjection)" strokeWidth={2} />
            <Area type="monotone" dataKey="points" stroke="#4f46e5" fill="url(#colorPoints)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard.Content>
    </GlassCard>
  )
}
