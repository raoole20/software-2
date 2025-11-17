import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export interface Kpis {
  users: number
  pendingEntries: number
  pendingHours: number
  distinctTypes: number
}

interface KpiGridProps {
  kpis: Kpis
}

export function KpiGrid({ kpis }: KpiGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>Total registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{kpis.users}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Entradas pendientes</CardTitle>
          <CardDescription>Registros sin aprobar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{kpis.pendingEntries}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Horas pendientes</CardTitle>
          <CardDescription>Suma reportada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{kpis.pendingHours}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tipos de actividad</CardTitle>
          <CardDescription>Distintos tipos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold">{kpis.distinctTypes}</div>
        </CardContent>
      </Card>
    </div>
  )
}
