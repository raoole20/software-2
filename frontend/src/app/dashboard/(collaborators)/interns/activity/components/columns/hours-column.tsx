'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Hours } from '@/types/activiy'
import { Badge } from '@/components/ui/badge'

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
    cell: ({ row }) => <div className="font-medium">{row.getValue('becario_nombre')}</div>,
  },
  {
    accessorKey: 'actividad_detalle.titulo',
    header: 'Actividad',
    cell: ({ row }) => {
      const actividad = row.original.actividad_detalle
      return (
        <div className="max-w-[200px]">
          <div className="font-medium truncate">{actividad?.titulo || '-'}</div>
          <div className="text-xs text-muted-foreground capitalize">{actividad?.tipo || ''}</div>
        </div>
      )
    },
  },
  {
    accessorKey: 'horas_reportadas',
    header: 'Horas',
    cell: ({ row }) => {
      const horas = row.getValue('horas_reportadas') as string
      return <div className="font-mono text-center">{horas}h</div>
    },
  },
  {
    accessorKey: 'descripcion_manual',
    header: 'Descripción',
    cell: ({ row }) => {
      const descripcion = row.getValue('descripcion_manual') as string
      return (
        <div className="max-w-[250px] truncate" title={descripcion}>
          {descripcion || '-'}
        </div>
      )
    },
  },
  {
    accessorKey: 'fecha_registro',
    header: 'Fecha Registro',
    cell: ({ row }) => {
      const fecha = row.getValue('fecha_registro') as string | Date
      if (!fecha) return <div>-</div>
      const fechaStr = typeof fecha === 'string' ? fecha : fecha.toISOString()
      const fechaLocal = new Date(fechaStr).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      return <div className="text-sm">{fechaLocal}</div>
    },
  },
  {
    accessorKey: 'estado_aprobacion',
    header: 'Estado',
    cell: ({ row }) => {
      const estado = row.getValue('estado_aprobacion') as string
      
      const getEstadoBadge = (estado: string) => {
        switch (estado?.toLowerCase()) {
          case 'aprobado':
            return <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">Aprobado</Badge>
          case 'rechazado':
            return <Badge variant="destructive">Rechazado</Badge>
          case 'pendiente':
            return <Badge variant="secondary">Pendiente</Badge>
          default:
            return <Badge variant="outline">{estado || 'Sin revisar'}</Badge>
        }
      }

      return getEstadoBadge(estado)
    },
  },
  {
    accessorKey: 'fecha_aprobacion',
    header: 'F. Aprobación',
    cell: ({ row }) => {
      const fecha = row.getValue('fecha_aprobacion') as string | Date | null
      if (!fecha) return <div className="text-muted-foreground">-</div>
      const fechaStr = typeof fecha === 'string' ? fecha : fecha.toISOString()
      const fechaLocal = new Date(fechaStr).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
      return <div className="text-sm">{fechaLocal}</div>
    },
  },
]

// Versión extendida con acciones para administradores
export const hoursColumnsWithActions: ColumnDef<Hours>[] = [
  ...hoursColumns,
  {
    id: 'actions',
    header: 'Acciones',
    cell: ({ row }) => {
      const registro = row.original
      const isPendiente = registro.estado_aprobacion?.toLowerCase() === 'pendiente' || !registro.estado_aprobacion

      if (!isPendiente) {
        return <div className="text-muted-foreground text-xs">Sin acciones</div>
      }

      return (
        <div className="flex gap-1">
          <button 
            className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
            onClick={() => {
              // TODO: Implementar aprobación
              console.log('Aprobar registro:', registro.id)
            }}
          >
            Aprobar
          </button>
          <button 
            className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
            onClick={() => {
              // TODO: Implementar rechazo
              console.log('Rechazar registro:', registro.id)
            }}
          >
            Rechazar
          </button>
        </div>
      )
    },
  },
]