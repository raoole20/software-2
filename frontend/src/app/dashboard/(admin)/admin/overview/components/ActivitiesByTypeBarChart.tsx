'use client'
import React from 'react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
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
    const barColor = config?.tipos?.color || 'var(--color-chart-2)'

    return (
        <ChartContainer id="by-type" config={config} className="h-56 w-full">
            <Recharts.BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="type" tickLine={false} axisLine={false} />
                <Recharts.YAxis />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Recharts.Bar dataKey="count" fill={barColor} radius={6} />
            </Recharts.BarChart>
        </ChartContainer>
    )
}
