"use client"

import { Fragment } from "react"

import { scaleSequential } from "d3-scale"
import { interpolateCool } from "d3-scale-chromatic"

import type { HeatmapDataSet } from "@/lib/analysis/heatmap-dashboard"

interface HeatmapGridProps {
  dataset: HeatmapDataSet
  min?: number
  max?: number
}

export function HeatmapGrid({ dataset, min, max }: HeatmapGridProps) {
  const values = dataset.values.map((cell) => cell.value)
  const domainMin = Math.min(min ?? Math.min(...values), Math.min(...values))
  const domainMax = Math.max(max ?? Math.max(...values), Math.max(...values))
  const colorScale = scaleSequential(interpolateCool).domain([domainMax, domainMin])

  const minContentWidth = Math.max(420, dataset.columns.length * 120 + 120)

  return (
    <div className="space-y-3">
      <div className="rounded-[20px] border border-white/60 bg-white/80 p-4 shadow-inner dark:border-white/10 dark:bg-slate-900/60">
        <div
          className="relative -mx-1 overflow-x-auto pb-2 pl-1 touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          role="table"
          aria-label="Heatmap grid"
        >
          <div
            className="grid grid-cols-[auto_1fr] gap-3 pr-1"
            style={{ minWidth: `${minContentWidth}px` }}
          >
            <div />
            <div className="grid" style={{ gridTemplateColumns: `repeat(${dataset.columns.length}, minmax(0, 1fr))` }}>
              {dataset.columns.map((column) => (
                <div key={column} className="text-center text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
                  {column}
                </div>
              ))}
            </div>
            {dataset.rows.map((row) => (
              <Fragment key={row}>
                <div className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{row}</div>
                <div className="grid" style={{ gridTemplateColumns: `repeat(${dataset.columns.length}, minmax(0, 1fr))` }}>
                  {dataset.columns.map((column) => {
                    const cell = dataset.values.find((item) => item.row === row && item.column === column)
                    const value = cell?.value ?? 0
                    const color = colorScale(value)
                    return (
                      <div
                        key={`${row}-${column}`}
                        className="flex h-14 items-center justify-center rounded-[12px] border border-white/40 text-sm font-medium text-slate-900 shadow-sm dark:border-white/10 dark:text-white"
                        style={{ background: color }}
                        title={cell?.note ?? `${value}`}
                      >
                        {value}
                      </div>
                    )
                  })}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
