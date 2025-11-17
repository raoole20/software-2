import React from 'react'
import { getAllHorasRegistros } from '@/server/activities'
import { DataTable } from '@/components/tables/data-table'
import { hoursColumns } from '@/app/dashboard/(admin)/admin/activity/components/columns/hours-columns'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const allHours = await getAllHorasRegistros();

  console.log(JSON.stringify({ allHours }))

  if (allHours.error) {
    return (
      <Card className='max-w-2xl'>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>No se pudieron cargar los registros de horas.</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className='text-xs text-red-600 whitespace-pre-wrap'>{JSON.stringify(allHours.data || allHours.message, null, 2)}</pre>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='space-y-1'>
        <h1 className='text-2xl font-semibold tracking-tight'>Todos los registros de horas</h1>
        <p className='text-sm text-muted-foreground'>Incluye pendientes, aprobados y rechazados.</p>
      </div>
      <DataTable
        data={allHours.data ?? []}
        columns={hoursColumns}
        toolbarOptions={{ btnText: 'Ver actividades', redirect: '/dashboard/admin/activity' }}
        searchKey='becario_nombre'
      />
    </div>
  )
}
