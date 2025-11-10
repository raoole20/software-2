"use client"

import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartLegend } from '@/components/ui/chart'
import * as Recharts from 'recharts'

export default function Page() {
  // Mock KPI values
  const kpis = {
    users: 128,
    pending: 14,
    completed: 342,
    hoursThisMonth: 256,
  }

  // Mock data: hours per month
  const hoursPerMonth = [
    { month: 'Jun', hours: 120 },
    { month: 'Jul', hours: 180 },
    { month: 'Aug', hours: 150 },
    { month: 'Sep', hours: 200 },
    { month: 'Oct', hours: 220 },
    { month: 'Nov', hours: 256 },
  ]

  // Mock data: activity status distribution
  const statusData = [
    { name: 'Pendientes', value: 14, key: 'pending' },
    { name: 'Completadas', value: 342, key: 'completed' },
    { name: 'Canceladas', value: 8, key: 'cancelled' },
  ]

  // Mock data: activities by type
  const activitiesByType = [
    { type: 'Interna', count: 120 },
    { type: 'Externa', count: 80 },
    { type: 'Taller', count: 90 },
    { type: 'Chat', count: 14 },
  ]

  const chartConfig = {
    hours: { label: 'Horas', color: 'var(--color-chart-3)' },
    pending: { label: 'Pendientes', color: 'var(--color-chart-1)' },
    completed: { label: 'Completadas', color: 'var(--color-chart-2)' },
  }

  const pieColors = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-4)']

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-sm text-muted-foreground">Resumen de actividad y métricas del sistema.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Usuarios</CardTitle>
            <CardDescription>Usuarios registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{kpis.users}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pendientes</CardTitle>
            <CardDescription>Actividades sin completar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{kpis.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completadas</CardTitle>
            <CardDescription>Actividades completadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{kpis.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horas (mes)</CardTitle>
            <CardDescription>Horas asignadas este mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{kpis.hoursThisMonth}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Horas por mes</CardTitle>
            <CardDescription>Comparativa de horas asignadas por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer id="hours" config={chartConfig} className="h-56">
              <Recharts.AreaChart data={hoursPerMonth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <Recharts.CartesianGrid strokeDasharray="3 3" />
                <Recharts.XAxis dataKey="month" />
                <Recharts.YAxis />
                <ChartTooltip />
                <Recharts.Area type="monotone" dataKey="hours" stroke="var(--color-chart-3)" fill="var(--color-chart-3)" />
              </Recharts.AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estado de actividades</CardTitle>
            <CardDescription>Distribución por estado</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer id="status" config={chartConfig} className="h-56">
              <Recharts.PieChart>
                <Recharts.Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="var(--color-chart-1)" label>
                  {statusData.map((entry, index) => (
                    <Recharts.Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Recharts.Pie>
                <ChartLegend />
                <ChartTooltip />
              </Recharts.PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividades por tipo</CardTitle>
          <CardDescription>Conteo de actividades por tipo</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer id="by-type" config={chartConfig} className="h-56">
            <Recharts.BarChart data={activitiesByType} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <Recharts.CartesianGrid strokeDasharray="3 3" />
              <Recharts.XAxis dataKey="type" />
              <Recharts.YAxis />
              <ChartTooltip />
              <Recharts.Bar dataKey="count" fill="var(--color-chart-2)" />
            </Recharts.BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
