'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartPie } from '@/components/common/piechart'
import { ChartLinesHours } from '@/components/common/linesHours'
import { ChartRadar } from '@/components/common/racharHour'

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

export default function page() {
  // Mock user info
  const userName = 'Becario'

  // Mock activities for the user
  const activities = [
    { id: 1, titulo: 'Taller de Alfabetización', fecha: '2025-10-12', duracion: 2, estado: 'Completada', horas_trabajadas: 2 },
    { id: 2, titulo: 'Visita Comunitaria', fecha: '2025-10-20', duracion: 3, estado: 'Pendiente', horas_trabajadas: 0 },
    { id: 3, titulo: 'Sesión de Chat', fecha: '2025-11-03', duracion: 1, estado: 'Completada', horas_trabajadas: 1 },
    { id: 4, titulo: 'Capacitación', fecha: '2025-11-12', duracion: 4, estado: 'Pendiente', horas_trabajadas: 0 },
  ]

  // KPIs
  const kpis = {
    assigned: activities.length,
    completed: activities.filter((a) => a.estado === 'Completada').length,
    pending: activities.filter((a) => a.estado === 'Pendiente').length,
    hoursThisMonth: activities.reduce((sum, a) => sum + (a.horas_trabajadas || 0), 0),
  }

  const progressData = [
    { day: 'Mon', progress: 20 },
    { day: 'Tue', progress: 40 },
    { day: 'Wed', progress: 60 },
    { day: 'Thu', progress: 80 },
    { day: 'Fri', progress: 100 },
  ]

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Hola, {userName}!</h1>
        <p className="text-sm text-muted-foreground">Este es tu panel personal. Aquí verás tus actividades y progreso.</p>
      </header>

      {/* KPI row (small summary cards) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Actividades asignadas</CardTitle>
            <CardDescription>Resumen de tus tareas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{kpis.assigned}</div>
            <div className="flex gap-4 mt-3 text-sm">
              <div className="text-muted-foreground">Completadas: <strong className="text-foreground">{kpis.completed}</strong></div>
              <div className="text-muted-foreground">Pendientes: <strong className="text-foreground">{kpis.pending}</strong></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horas este mes</CardTitle>
            <CardDescription>Total de horas trabajadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{kpis.hoursThisMonth}</div>
            <div className="mt-2 text-sm text-muted-foreground">Suma de horas registradas en actividades asignadas</div>
          </CardContent>
        </Card>

        {/* keep this small card as a summary, the full-width chart is below */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso semanal</CardTitle>
            <CardDescription>Resumen rápido</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{Math.round((kpis.completed / Math.max(1, kpis.assigned)) * 100)}%</div>
            <div className="mt-2 text-sm text-muted-foreground">Completadas / Asignadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Full width weekly progress chart */}
      <div>
        {/* ChartLinesHours returns its own Card so render it directly to occupy full width */}
        <ChartLinesHours id="progress-full" />
      </div>

      {/* Charts + list: left column stacks main chart + activity table; right column shows pie */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {/* ChartRadar is a Card already */}
          <ChartRadar id="main-radar" />

          {/* Activities table as its own Card */}
          <Card>
            <CardHeader>
              <CardTitle>Actividades recientes</CardTitle>
              <CardDescription>Lista de actividades asignadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                      <th className="py-2">Título</th>
                      <th className="py-2">Fecha</th>
                      <th className="py-2">Duración (h)</th>
                      <th className="py-2">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((a) => (
                      <tr key={a.id} className="border-t">
                        <td className="py-3">{a.titulo}</td>
                        <td className="py-3">{new Date(a.fecha).toLocaleDateString()}</td>
                        <td className="py-3">{a.duracion}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${a.estado === 'Completada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {a.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <ChartPie />
          <div className="mt-4 text-xs text-muted-foreground">{kpis.completed} completadas • {kpis.pending} pendientes</div>
        </div>
      </div>
    </div>
  )
}
