"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ActivitySchema } from '@/lib/validators/activity'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import { createActivity } from '@/server/activities'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Users } from '@/types/user'
import { Roles } from '@/types/roles'
import { ChevronDown, X, Users as UsersIcon } from 'lucide-react'

export default function ActivityFormClient({ allUsers }: { allUsers: Users[] }) {
    const router = useRouter()

    const form = useForm<any>({
        resolver: yupResolver(ActivitySchema) as any,
        defaultValues: {
            titulo: '',
            descripcion: '',
            tipo: 'Interna',
            fecha: new Date().toISOString().slice(0, 10),
            duracion_horas: 1,
            competencia_desarrollada: '',
            modalidad: 'P',
            organizacion: '',
            facilitador: '',
            en_catalogo: false,
        },
    })

    const { handleSubmit, formState: { isSubmitting } } = form

    const [selectedInterns, setSelectedInterns] = useState<number[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    const interns = allUsers.filter(user => user.rol === Roles.USER)
    const facilitador = allUsers.filter(user => user.rol == Roles.ADMIN)

    const filteredInterns = interns.filter(intern =>
        `${intern.first_name} ${intern.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        intern.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleInternSelection = (internId: number, checked: boolean) => {
        if (checked) {
            setSelectedInterns(prev => [...prev, internId])
        } else {
            setSelectedInterns(prev => prev.filter(id => id !== internId))
        }
    }

    const handleSelectAllInterns = () => {
        setSelectedInterns(interns.map(intern => intern.id))
        setIsSheetOpen(false)
    }

    const selectedInternNames = selectedInterns.map(id => {
        const intern = interns.find(i => i.id === id)
        return intern ? `${intern.first_name} ${intern.last_name}` : ''
    }).filter(Boolean)

    async function onSubmit(values: any) {
        try {
            const payload: any = { ...values }
            if (values?.fecha instanceof Date) {
                const d = values.fecha as Date
                payload.fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
            }

            // Add selected interns to payload
            payload.becarios_asignados = selectedInterns

            await createActivity(payload)
            toast.success('Actividad creada')
            router.push('/dashboard/admin/activity')
        } catch (err: any) {
            console.error(err)
            toast.error(err?.message || 'Error creando actividad')
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                                <Input {...(field as any)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="descripcion"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Input {...(field as any)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="tipo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Seleccionar tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Interna">Interna</SelectItem>
                                            <SelectItem value="Externa">Externa</SelectItem>
                                            <SelectItem value="Taller">Taller</SelectItem>
                                            <SelectItem value="Chat">Chat de Inglés</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="modalidad"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Modalidad</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecciona modalidad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="P">Presencial</SelectItem>
                                            <SelectItem value="V">Virtual</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="fecha"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha</FormLabel>
                                <FormControl>
                                    <Input type="date" {...(field as any)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="duracion_horas"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duración (horas)</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.25" {...(field as any)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="organizacion"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Organización</FormLabel>
                                <FormControl>
                                    <Input {...(field as any)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="facilitador"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Facilitador</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nombre del facilitador" {...(field as any)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <FormField
                        control={form.control}
                        name="en_catalogo"
                        render={({ field }) => (
                            <FormItem>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" checked={Boolean(field.value)} onChange={(e) => field.onChange(e.target.checked)} />
                                    <span>En catálogo</span>
                                </label>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    <FormLabel>Becarios asignados</FormLabel>
                    <div className="mt-2">
                        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" className="w-full justify-start">
                                    <UsersIcon className="mr-2 h-4 w-4" />
                                    {selectedInterns.length === 0
                                        ? "Seleccionar becarios..."
                                        : `${selectedInterns.length} becario${selectedInterns.length !== 1 ? 's' : ''} seleccionado${selectedInterns.length !== 1 ? 's' : ''}`
                                    }
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="w-[400px] sm:w-[540px]">
                                <SheetHeader>
                                    <SheetTitle>Seleccionar becarios</SheetTitle>
                                </SheetHeader>
                                <div className="mt-4 space-y-4">
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Buscar por nombre o email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="flex-1"
                                        />
                                        <Button onClick={handleSelectAllInterns} variant="outline">
                                            Todos los becarios
                                        </Button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto space-y-2">
                                        {filteredInterns.map((intern) => (
                                            <div key={intern.id} className="flex items-center space-x-2 p-2 border rounded">
                                                <Checkbox
                                                    id={`intern-${intern.id}`}
                                                    checked={selectedInterns.includes(intern.id)}
                                                    onCheckedChange={(checked) => handleInternSelection(intern.id, checked as boolean)}
                                                />
                                                <label
                                                    htmlFor={`intern-${intern.id}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1 cursor-pointer"
                                                >
                                                    {intern.first_name} {intern.last_name}
                                                    <div className="text-xs text-muted-foreground">{intern.email}</div>
                                                </label>
                                            </div>
                                        ))}
                                        {filteredInterns.length === 0 && (
                                            <div className="text-center text-muted-foreground py-4">
                                                No se encontraron becarios
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end gap-2 pt-4 border-t">
                                        <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
                                            Cerrar
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                        {selectedInternNames.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {selectedInternNames.slice(0, 3).map((name, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
                                        {name}
                                    </span>
                                ))}
                                {selectedInternNames.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
                                        +{selectedInternNames.length - 3} más
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Crear actividad'}</Button>
                </div>
            </form>
        </Form>
    )
}
