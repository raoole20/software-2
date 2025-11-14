import { actividadesColumn } from '@/app/dashboard/(admin)/admin/activity/components/columns/activity-column';
import { DataTable } from '@/components/tables/data-table'
import { SidebarProvider } from '@/components/ui/sidebar';
import { getAllActivities } from '@/server/activities'
import React from 'react'

export default async function Page() {
  const actividad = await getAllActivities(); // by user id in a real scenario

  return (
    <div className='w-full'>
      Mis actividades - Asignar horas
      <DataTable data={actividad.data} columns={actividadesColumn} searchKey='facilitador' />
    </div>
  )
}
