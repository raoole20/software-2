"use client"
import React, { useState } from 'react'
import { Users } from "@/types/user"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { deleteUser } from '@/server/users'
import { Loader2, Trash2 } from 'lucide-react'

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
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const router = useRouter()
      const [loading, setLoading] = useState(false)
      const user = row.original as Users

      const handleDelete = async () => {
        const ok = confirm(`¿Eliminar usuario ${user.username}? Esta acción es irreversible.`)
        if (!ok) return
        try {
          setLoading(true)
          await deleteUser(user.id)

          router.refresh()
        } catch (err: any) {
          console.error('Delete user error', err)
          alert(err?.message || 'No se pudo eliminar el usuario')
        } finally {
          setLoading(false)
        }
      }

      return (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={handleDelete} disabled={loading}>
            {loading ? <Loader2 className='animate-spin' /> :
              <Trash2 />}
          </Button>
        </div>
      )
    }
  },
]
