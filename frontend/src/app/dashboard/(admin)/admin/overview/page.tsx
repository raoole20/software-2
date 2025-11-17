
import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { getAllUsers } from '@/server/users'
import { KpiGrid } from './components/KpiGrid'
import { HoursPerMonthChart } from './components/HoursPerMonthChart'
import { Button } from '@/components/ui/button'
import ExportButtons from '@/components/admin/ExportButtons'
import { getAllActivities, getAllPendingHours } from '@/server/activities'
import { StatusPieChart } from './components/StatusPieChart'


export default async function Page() {
  const users = await getAllUsers();
  const pendingHours = await getAllPendingHours();
  const allActivity  = await getAllActivities();
  
  const sexo = users.reduce((acc, user) => {
    const s = user?.sexo === 'M' ? 'Hombre' : user?.sexo === 'F' ? 'Mujer' : 'Desconocido'
    const idx = acc.findIndex((x) => x.key === s)
    if (idx >= 0) acc[idx].value += 1
    else acc.push({ name: s, value: 1, key: s })
    return acc
  }, [] as { name: string; value: number; key: string }[])
  
  const kpis = {
    users: users.length,
    pendingEntries: 0,
    pendingHours: 0,
    distinctTypes: 0,
  }

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
            <HoursPerMonthChart data={[]} config={{}} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sexo</CardTitle>
            <CardDescription>Distribución de Sexo</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusPieChart data={sexo} config={{}} colors={[]} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
