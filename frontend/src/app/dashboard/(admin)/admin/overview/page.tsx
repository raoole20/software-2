
import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import ExportButtons from '@/components/admin/ExportButtons'
import { getAllUsers } from '@/server/users'
import { getAllActivities, getAllPendingHours } from '@/server/activities'
import { KpiGrid } from './components/KpiGrid'
import { HoursPerMonthChart } from './components/HoursPerMonthChart'
import { StatusPieChart } from './components/StatusPieChart'
import { ActivitiesByTypeBarChart } from './components/ActivitiesByTypeBarChart'
import { Users } from '@/types/user'
import { Activity, Hours } from '@/types/activiy'


export default async function Page() {
  // Fetch base datasets
  let users: Users[] = []
  try { users = await getAllUsers() } catch (_) { /* ignore, show 0 */ }
  const pendingResp = await getAllPendingHours()
  const pendingHoursData: Hours[] = !pendingResp.error && Array.isArray(pendingResp.data) ? pendingResp.data : []
  const activitiesResp = await getAllActivities()
  const activitiesData: Activity[] = !activitiesResp.error && Array.isArray(activitiesResp.data) ? activitiesResp.data : []

  // KPI calculations
  const pendingEntries = pendingHoursData.length
  const pendingHoursTotal = pendingHoursData.reduce((sum, h) => {
    const n = Number(h.horas_reportadas)
    return sum + (Number.isFinite(n) ? n : 0)
  }, 0)
  const distinctTypes = new Set(activitiesData.map(a => a.tipo)).size

  const kpis = {
    users: users.length,
    pendingEntries,
    pendingHours: pendingHoursTotal,
    distinctTypes,
  }

  // Sexo distribution from users
  const sexo = users.reduce((acc, user) => {
    const s = user?.sexo === 'M' ? 'Hombre' : user?.sexo === 'F' ? 'Mujer' : 'Desconocido'
    const idx = acc.findIndex((x) => x.key === s)
    if (idx >= 0) acc[idx].value += 1
    else acc.push({ name: s, value: 1, key: s })
    return acc
  }, [] as { name: string; value: number; key: string }[])

  // Hours per month from pending hours (fecha_registro)
  const monthMap: Record<string, number> = {}
  pendingHoursData.forEach(h => {
    const raw = h.fecha_registro as unknown as string
    const d = new Date(raw)
    if (!isNaN(d.getTime())) {
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
      monthMap[key] = (monthMap[key] || 0) + Number(h.horas_reportadas) || 0
    }
  })
  const hoursPerMonth = Object.entries(monthMap)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([key, hours]) => {
      const [y, m] = key.split('-')
      const date = new Date(Number(y), Number(m)-1, 1)
      return { month: new Intl.DateTimeFormat('es', { month: 'short' }).format(date), hours }
    })

  // Activity type counts (all activities)
  const typeCounts: Record<string, number> = {}
  activitiesData.forEach(a => { typeCounts[a.tipo] = (typeCounts[a.tipo] || 0) + 1 })
  const activitiesByType = Object.entries(typeCounts).map(([type, count]) => ({ type, count }))

  // Chart config (shared mapping)
  const chartConfig = {
    hours: { label: 'Horas', color: 'var(--color-chart-3)' },
    Hombre: { label: 'Hombre', color: 'var(--color-chart-1)' },
    Mujer: { label: 'Mujer', color: 'var(--color-chart-2)' },
    Desconocido: { label: 'Desconocido', color: 'var(--color-chart-4)' },
    tipos: { label: 'Tipos', color: 'var(--color-chart-5)' },
  }
  const sexoColors = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-4)']

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Overview</h1>
          <p className="text-sm text-muted-foreground">Resumen global basado en horas pendientes y usuarios.</p>
        </div>

        <div>
          <ExportButtons />
        </div>
      </header>

      <KpiGrid kpis={kpis} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Horas por mes</CardTitle>
            <CardDescription>Agregadas desde registros pendientes</CardDescription>
          </CardHeader>
          <CardContent>
            <HoursPerMonthChart data={hoursPerMonth} config={chartConfig} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sexo</CardTitle>
            <CardDescription>Distribución de Sexo</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusPieChart data={sexo} config={chartConfig} colors={sexoColors} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Actividades por tipo</CardTitle>
          <CardDescription>Conteo de tipos (todas las actividades)</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivitiesByTypeBarChart data={activitiesByType} config={chartConfig} />
        </CardContent>
      </Card>
    </div>
  )
}
