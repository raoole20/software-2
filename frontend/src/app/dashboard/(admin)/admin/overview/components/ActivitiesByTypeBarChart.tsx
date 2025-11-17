'use client'
import React from 'react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

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
        <ChartContainer config={config}>
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
            </BarChart>
        </ChartContainer>
    )
}
