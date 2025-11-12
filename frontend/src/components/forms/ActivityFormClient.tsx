"use client"

import React from 'react'
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
import { Users } from '@/types/user'
import { Roles } from '@/types/roles'

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

    const facilitador = allUsers.filter(user => user.rol == Roles.ADMIN);

    async function onSubmit(values: any) {
        try {
            const payload: any = { ...values }
            if (values?.fecha instanceof Date) {
                const d = values.fecha as Date
                payload.fecha = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
            }

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
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Selecciona facilitador" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {facilitador.map((user) => (
                                                <SelectItem key={user.id} value={user.username}>
                                                    {user.username}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
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
                    <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Guardando...' : 'Crear actividad'}</Button>
                </div>
            </form>
        </Form>
    )
}
