"use client"
import { ColumnDef } from '@tanstack/react-table'
import { ActivityDTO } from '@/types/activiy'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Eye } from 'lucide-react'
import { useSession } from 'next-auth/react'

export const activitiesColumns: ColumnDef<ActivityDTO>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div className="text-sm text-muted-foreground">{row?.getValue('id')}</div>,
    },
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
        cell: ({ row }) => <div className="font-medium">{row?.getValue('titulo')}</div>,
    },
    {
        accessorKey: 'tipo',
        header: 'Tipo',
        cell: ({ row }) => <div className="capitalize">{row?.getValue('tipo')}</div>,
    },
    {
        accessorKey: 'fecha',
        header: 'Fecha',
        cell: ({ row }) => {
            const v = row?.getValue('fecha') as unknown as string | Date | null
            if (!v) return <div>-</div>
            const s = typeof v === 'string' ? v : (v instanceof Date ? v.toISOString() : String(v))
            return <div>{String(s).slice(0, 10)}</div>
        },
    },
    {
        accessorKey: 'duracion_horas',
        header: 'Duración (h)',
        cell: ({ row }) => <div>{row?.getValue('duracion_horas') ?? '-'}</div>,
    },
    {
        accessorKey: 'modalidad',
        header: 'Modalidad',
        cell: ({ row }) => <div>{row?.getValue('modalidad') ?? '-'}</div>,
    },
    {
        accessorKey: 'organizacion',
        header: 'Organización',
        cell: ({ row }) => <div>{row?.getValue('organizacion') ?? '-'}</div>,
    },
    {
        accessorKey: 'facilitador',
        header: 'Facilitador',
        cell: ({ row }) => <div>{row?.getValue('facilitador') ?? '-'}</div>,
    },
    {
        id: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
            const router = useRouter()
            const { data: session } = useSession()
            const id = row.getValue('id') as number
            const isAdmin = session?.user?.rol === 'administrador'

            const handleView = () => {
                router.push(`/dashboard/admin/activity/${id}/edit`)
            }

            return (
                <div className="flex gap-2">
                    {isAdmin && (
                        <Button size="sm" variant="ghost" onClick={handleView}>
                            <Eye />
                        </Button>
                    )}
                </div>
            )
        }
    },
]


export const actividadesColumn: ColumnDef<ActivityDTO>[] = [
    ...activitiesColumns,
    {
        accessorKey: 'assigned_hours',
        header: 'Asignar horas',
        cell: ({ row }) => {
            const actividad = row.original;
            const router = useRouter()
            const id = (row?.getValue('id') ?? (actividad as any)?.id) as string | number
            const openSidebar = () => {
                // navigate to the parallel route that renders the sidebar for assigning hours
                // the project uses a named parallel route `@sidebar` under the activity route,
                // so we push a URL that opens that parallel outlet. Include the (collaborators)
                // route group so the app-router resolves the same tree.
                router.push(`/dashboard/interns/activity/sidebar/${id}`)
            }

            return <Button onClick={openSidebar}>Asignar</Button>
        }
    }
]

