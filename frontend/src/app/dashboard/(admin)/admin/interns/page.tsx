import { usersColumns } from './components/columns/user-column';
import UsersTableClient from '@/components/tables/UsersTableClient'
import { getAllUsers } from '@/server/users';
import React from 'react'
import TablePdfExportButton from '@/components/export/TablePdfExportButton'
  

export default async function Page() {
  const users = await getAllUsers();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Usuarios</h1>
        <TablePdfExportButton columns={usersColumns} data={users} filename="usuarios.pdf" label="Descargar PDF" />
      </div>
      <UsersTableClient data={users} columns={usersColumns} />
    </div>
  )
}
