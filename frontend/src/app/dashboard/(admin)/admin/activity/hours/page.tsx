import { DataTable } from '@/components/tables/data-table';
import { getAllPendingHours } from '@/server/activities';
import React from 'react'
import { hoursColumns } from '@/app/dashboard/(admin)/admin/activity/components/columns/hours-columns'

export default async function Page() {
    const pendingHours = await getAllPendingHours();

    if (pendingHours.error) {
        return (
            <div>Error cargando las horas pendientes: {String(pendingHours
                .originalError)}</div>
        )
    }

    return (
        <DataTable data={pendingHours.data ?? []} columns={hoursColumns} toolbarOptions={{ btnText: 'Exportar', redirect: '/dashboard/admin/activity' }} searchKey="becario_nombre" />
    )
}
