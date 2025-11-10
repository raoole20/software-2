import ActivityFormClient from '@/components/forms/ActivityFormClient'
import { DataTable } from '@/components/tables/data-table'
import { getAllActivities } from '@/server/activities'
import React, { act } from 'react'
import { activitiesColumns } from './components/columns/activity-column'

export default async function Page() {
    const activities = await getAllActivities();

    return (
        <div>
            <DataTable data={activities} columns={activitiesColumns} toolbarOptions={{ btnText: 'Crear actividad', redirect: '/dashboard/admin/activity/create' }} />
        </div>
    )
}
