'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreateInternFormValues, createInternSchema } from '@/lib/validators/user'
import { createUser } from '@/server/users'
import { Roles } from '@/types/roles'
import { useRouter } from 'next/navigation'


const defaultValues: CreateInternFormValues = {
    username: '',
    email: '',
    password: '',
    rol: Roles.USER,
    first_name: '',
    last_name: '',
    sexo: 'M',
    fecha_nacimiento: new Date(),
    carrera: '',
    universidad: '',
    semestre: '',
}

type CreateInterFormProps = {
    formId?: string
    showFooter?: boolean
}

export default function CreateInterForm({
    formId = 'create-intern-form',
    showFooter = true,
}: CreateInterFormProps) {
    const router = useRouter()
    const form = useForm<CreateInternFormValues>({
        resolver: zodResolver(createInternSchema),
        defaultValues,
        mode: 'onTouched',
    })

    const handleSubmit = React.useCallback(
        async (values: CreateInternFormValues) => {
            console.log({values})
            await createUser(values)
                .then((response) => {
                    toast.success('Usuario creado con exito')
                    router.push('/dashboard/admin/interns')
                })
                .catch((error: { data: any; status: number; code: string; message: string; internalCode: string; }) => {
                    console.log(error)
                    if (error.status === 401)
                        toast.info("Revisa los datos del formulario")
                    
                    if (error.status === 500)
                        toast.error('Error desconocido, intenta mas tarde')

                    toast.error('No se pudo crear el usuario')
                })
        },
        []
    )

    return (
        <Form {...form}>
            <form
                id={formId}
                className="space-y-8"
                onSubmit={form.handleSubmit(handleSubmit)}
                onReset={() => form.reset(defaultValues)}
            >
                <section className="space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                            Credenciales de acceso
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Define el acceso y el rol dentro de la plataforma administrativa.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Usuario</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Usuario unico" autoComplete="off" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Correo</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="nombre@correo.com"
                                            autoComplete="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Usa el correo institucional si esta disponible.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contrasena temporal</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Minimo 8 caracteres" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Cambiala al compartir el acceso con el nuevo usuario.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rol"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rol</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Selecciona un rol" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value='becario'>Becario</SelectItem>
                                                    <SelectItem value='administrador'>Administrador</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>
                                        Controla los permisos y modulos disponibles segun el rol.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </section>

                <Separator />

                <section className="space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                            Informacion personal
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Datos basicos para identificar al usuario dentro del programa.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre(s)" autoComplete="given-name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Apellidos</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Apellidos" autoComplete="family-name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="sexo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sexo</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Selecciona una opcion" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value='M'>Masculino</SelectItem>
                                                    <SelectItem value='F'>Femenino</SelectItem>
                                                    <SelectItem value='O'>Otro</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fecha_nacimiento"
                            render={({ field: { onChange,  ...field} }) => (
                                <FormItem>
                                    <FormLabel>Fecha de nacimiento</FormLabel>
                                    <FormControl>
                                        <Input type="date" onChange={(e) => onChange(new Date(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </section>

                <Separator />

                <section className="space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                            Formacion academica
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Estos campos ayudan a organizar cohortes y asignar acompanamiento.
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="universidad"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Universidad</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nombre de la universidad" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="carrera"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Carrera</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Programa academico" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="semestre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Semestre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. 5" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </section>

                <Button type='submit'>Guardar</Button>
                {showFooter ? (
                    <div className="flex flex-col gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-muted-foreground">
                            Revisa los datos antes de guardar para mantener la base actualizada.
                        </p>
                        <div className="flex flex-col gap-2 sm:flex-row">
                            <Button type="reset" variant="outline">
                                Limpiar
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Guardando...' : 'Guardar registro'}
                            </Button>
                        </div>
                    </div>
                ) : null}
            </form>
        </Form>
    )
}
