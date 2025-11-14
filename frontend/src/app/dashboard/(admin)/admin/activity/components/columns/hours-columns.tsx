"use client"

import { ColumnDef } from '@tanstack/react-table'
import { Hours } from '@/types/activiy'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const hoursColumns: ColumnDef<Hours>[] = [
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
    accessorKey: 'becario_nombre',
    header: 'Becario',
    cell: ({ row }) => <div className="font-medium">{row.getValue('becario_nombre') ?? '-'}</div>,
  },
  {
    id: 'actividad_titulo',
    header: 'Actividad',
    accessorFn: (row) => row.actividad_detalle?.titulo ?? String(row.actividad ?? '-'),
    cell: ({ getValue }) => <div>{getValue() as string}</div>,
  },
  {
    accessorKey: 'horas_reportadas',
    header: 'Horas reportadas',
    cell: ({ row }) => <div>{row.getValue('horas_reportadas') ?? '-'}</div>,
  },
  {
    accessorKey: 'descripcion_manual',
    header: 'Descripción',
    cell: ({ row }) => <div className="truncate max-w-sm">{row.getValue('descripcion_manual') ?? '-'}</div>,
  },
  {
    id: 'fecha_registro',
    header: 'Fecha registro',
    accessorFn: (row) => {
      const v = (row.fecha_registro as any)
      if (!v) return '-'
      const s = typeof v === 'string' ? v : (v instanceof Date ? v.toISOString() : String(v))
      return s.slice(0,10)
    },
    cell: ({ getValue }) => <div>{getValue() as string}</div>
  },
  {
    accessorKey: 'estado_aprobacion',
    header: 'Estado',
    cell: ({ row }) => <div className="capitalize">{row.getValue('estado_aprobacion') ?? '-'}</div>,
  },
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const actividadId = (row.original as Hours).actividad
      return (
        <div className="flex gap-2">
          <Link href={`/dashboard/admin/activity/${actividadId}`}>
            <Button size="sm" variant="ghost">Ver actividad</Button>
          </Link>
        </div>
      )
    }
  }
]

export default hoursColumns
