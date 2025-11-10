'use client'
import { Users } from "@/types/user"
import { ColumnDef } from "@tanstack/react-table"

export const usersColumns: ColumnDef<Users>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'username',
    header: 'Usuario',
    cell: ({ row }) => <div className="font-medium">{row.getValue('username')}</div>,
  },
  {
    accessorKey: 'email',
    header: 'Correo',
    cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'rol',
    header: 'Rol',
    cell: ({ row }) => <div className="capitalize">{row.getValue('rol')}</div>,
  },
  {
    accessorKey: 'fecha_nacimiento',
    header: 'Nacimiento',
    cell: ({ row }) => {
      const v = row.getValue('fecha_nacimiento') as unknown as string | null
      return <div>{v ? String(v).slice(0, 10) : '-'}</div>
    },
  },
]
      