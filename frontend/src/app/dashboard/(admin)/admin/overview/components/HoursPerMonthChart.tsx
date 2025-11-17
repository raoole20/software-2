'use client'
import React from 'react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { AreaChart, Area, CartesianGrid, XAxis, YAxis } from "recharts"

export interface HoursPerMonthPoint {
  month: string
  hours: number
}

interface HoursPerMonthChartProps {
  data: HoursPerMonthPoint[]
  config: Record<string, { label: string; color: string }>
  heightClassName?: string
}
export function HoursPerMonthChart({ data, config, heightClassName = "h-56" }: HoursPerMonthChartProps) {
  const hasData = data && data.length > 0

  console.log('HoursPerMonthChart data:', data);
  return (
    <ChartContainer id="hours-per-month" config={config} className={heightClassName}>
      {hasData ? (
        <AreaChart
          data={data}
          margin={{ top: 12, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            width={40}
            tickLine={false}
            axisLine={false}
            tickMargin={4}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}>
          </ChartTooltip>
          <Area
            type="monotone"
            dataKey="hours"
            stroke={config.hours?.color || "var(--color-chart-3)"}
            fill={config.hours?.color || "var(--color-chart-3)"}
            fillOpacity={0.18}
            strokeWidth={2}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
          Sin datos de horas pendientes
        </div>
      )}
    </ChartContainer>
  )
}
