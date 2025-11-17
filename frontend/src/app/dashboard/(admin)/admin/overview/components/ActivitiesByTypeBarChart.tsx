'use client'
import React from 'react'
import { ChartContainer, ChartTooltip } from '@/components/ui/chart'
import * as Recharts from 'recharts'

export interface ActivityTypeDatum {
  type: string
  count: number
}

interface ActivitiesByTypeBarChartProps {
  data: ActivityTypeDatum[]
  config: Record<string, { label: string; color: string }>
}

export function ActivitiesByTypeBarChart({ data, config }: ActivitiesByTypeBarChartProps) {
  return (
    <ChartContainer id="by-type" config={config} className="h-56">
      <Recharts.BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <Recharts.CartesianGrid strokeDasharray="3 3" />
        <Recharts.XAxis dataKey="type" />
        <Recharts.YAxis />
        <ChartTooltip />
        <Recharts.Bar dataKey="count" fill="var(--color-chart-2)" />
      </Recharts.BarChart>
    </ChartContainer>
  )
}
