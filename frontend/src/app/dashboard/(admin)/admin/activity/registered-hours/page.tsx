import { DataTable } from '@/components/tables/data-table'
import { getAllPendingHours } from '@/server/activities';
import React from 'react'

export default async function Page() {
    const data = await getAllPendingHours();

    if (data.error)
        return <div>Error loading registered hours: {data.error}</div>

    return (
        <div>
            <DataTable data={data.data!} columns={[]} />
        </div>
    )
}
