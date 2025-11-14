import ActivityFormClient from '@/components/forms/ActivityFormClient'
import { DataTable } from '@/components/tables/data-table'
import { getAllActivities } from '@/server/activities'
import React, { act } from 'react'
import { activitiesColumns } from './components/columns/activity-column'

export default async function Page() {
    const activities = await getAllActivities();

    if(activities.error) {
        return (
            <div>Error cargando las actividades: {activities.error}</div>
        )   
    }
    return (
        <div>
            <DataTable data={activities.data} columns={activitiesColumns} toolbarOptions={{ btnText: 'Crear actividad', redirect: '/dashboard/admin/activity/create' }} />
        </div>
    )
}
