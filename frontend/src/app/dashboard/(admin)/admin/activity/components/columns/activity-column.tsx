'use client'
import { ColumnDef } from '@tanstack/react-table'
import { ActivityDTO } from '@/types/activiy'

export const activitiesColumns: ColumnDef<ActivityDTO>[] = [
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
    accessorKey: 'titulo',
    header: 'Título',
    cell: ({ row }) => <div className="font-medium">{row.getValue('titulo')}</div>,
  },
  {
    accessorKey: 'tipo',
    header: 'Tipo',
    cell: ({ row }) => <div className="capitalize">{row.getValue('tipo')}</div>,
  },
  {
    accessorKey: 'fecha',
    header: 'Fecha',
    cell: ({ row }) => {
      const v = row.getValue('fecha') as unknown as string | Date | null
      if (!v) return <div>-</div>
      const s = typeof v === 'string' ? v : (v instanceof Date ? v.toISOString() : String(v))
      return <div>{String(s).slice(0, 10)}</div>
    },
  },
  {
    accessorKey: 'duracion_horas',
    header: 'Duración (h)',
    cell: ({ row }) => <div>{row.getValue('duracion_horas') ?? '-'}</div>,
  },
  {
    accessorKey: 'modalidad',
    header: 'Modalidad',
    cell: ({ row }) => <div>{row.getValue('modalidad') ?? '-'}</div>,
  },
  {
    accessorKey: 'organizacion',
    header: 'Organización',
    cell: ({ row }) => <div>{row.getValue('organizacion') ?? '-'}</div>,
  },
  {
    accessorKey: 'facilitador',
    header: 'Facilitador',
    cell: ({ row }) => <div>{row.getValue('facilitador') ?? '-'}</div>,
  },
]
