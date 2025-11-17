import { actividadesColumn } from '@/app/dashboard/(admin)/admin/activity/components/columns/activity-column';
import { DataTable } from '@/components/tables/data-table'
import { SidebarProvider } from '@/components/ui/sidebar';
import { getAllActivities } from '@/server/activities'
import React from 'react'
import TablePdfExportButton from '@/components/export/TablePdfExportButton'

export default async function Page() {
  const actividad = await getAllActivities(); // by user id in a real scenario

  return (
    <div className='w-full space-y-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Mis actividades - Asignar horas</h1>
        <TablePdfExportButton columns={actividadesColumn} data={actividad.data || []} filename='actividades.pdf' label='Descargar PDF' />
      </div>
      <DataTable data={actividad.data} columns={actividadesColumn} searchKey='facilitador' />
    </div>
  )
}
