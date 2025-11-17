"use client"

import * as React from 'react'
import { DataTable } from './data-table'
import type { ColumnDef } from '@tanstack/react-table'
import type { Users } from '@/types/user'

type Props = {
  data: Users[]
  columns: ColumnDef<Users>[]
}

export default function UsersTableClient({ data, columns }: Props) {
  return <DataTable<Users> data={data} columns={columns} toolbarOptions={{ btnText: "Nuevo usuario", redirect: "/dashboard/admin/interns/new/" }} roleFilterKey="rol" />
}
