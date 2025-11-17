'use client'
import React from 'react'
import { ChartContainer, ChartTooltip, ChartLegend, ChartLegendContent, ChartConfig, ChartTooltipContent } from '@/components/ui/chart'
import { Pie, PieChart, Cell } from 'recharts'

export interface StatusDatum {
  name: string
  value: number
  key: string
}

interface StatusPieChartProps {
  data: StatusDatum[]
  config: Record<string, { label: string; color: string }>
  colors: string[]
}


export const description = "A pie chart with a label"

const sampleData: StatusDatum[] = [
  { name: 'Mujer', value: 50, key: 'Mujer' },
  { name: 'Hombre', value: 80, key: 'Hombre' },
  { name: 'Desconocido', value: 10, key: 'Desconocido' },
]

const sampleConfig = {
  Mujer: { label: 'Mujer', color: 'var(--chart-1)' },
  Hombre: { label: 'Hombre', color: 'var(--chart-2)' },
  Desconocido: { label: 'Desconocido', color: 'var(--chart-3)' },
} satisfies ChartConfig

export function StatusPieChart({ data, config, colors }: StatusPieChartProps) {
  const chartData = data && data.length ? data : sampleData
  const chartCfg = config && Object.keys(config).length ? config : sampleConfig

  return (
    <ChartContainer
      config={chartCfg}
      className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={48}
          outerRadius={80}
          label
        >
          {chartData.map((entry, idx) => (
            <Cell key={`cell-${entry.key}-${idx}`} fill={(chartCfg as any)[entry.key]?.color ?? colors?.[idx] ?? '#4f46e5'} />
          ))}
        </Pie>
        <ChartLegend verticalAlign="bottom" content={<ChartLegendContent nameKey="key" />} />
      </PieChart>
    </ChartContainer>
  )
}
