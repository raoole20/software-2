'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { editUser } from '@/server/users'
import { Users } from '@/types/user'
import { z } from 'zod'

const userSchema = z.object({
  username: z.string().min(1, 'Usuario es requerido'),
  email: z.string().email('Email inválido'),
  carrera: z.string().min(1, 'Carrera es requerida'),
  universidad: z.string().min(1, 'Universidad es requerida'),
  semestre: z.string().min(1, 'Semestre es requerido'),
  meta_horas_voluntariado_interno: z.string().min(1, 'Meta voluntariado interno es requerida'),
  meta_horas_voluntariado_externo: z.string().min(1, 'Meta voluntariado externo es requerida'),
  meta_horas_chat_ingles: z.string().min(1, 'Meta chat inglés es requerida'),
  meta_horas_talleres: z.string().min(1, 'Meta talleres es requerida'),
})

type UserFormValues = z.infer<typeof userSchema>

interface AdminUserProfileFormProps {
  user: Users
}

export default function AdminUserProfileForm({ user }: AdminUserProfileFormProps) {
  const router = useRouter()

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      carrera: user.carrera,
      universidad: user.universidad,
      semestre: user.semestre,
      meta_horas_voluntariado_interno: user.meta_horas_voluntariado_interno,
      meta_horas_voluntariado_externo: user.meta_horas_voluntariado_externo,
      meta_horas_chat_ingles: user.meta_horas_chat_ingles,
      meta_horas_talleres: user.meta_horas_talleres,
    },
    mode: 'onTouched',
  })

  const handleSubmit = React.useCallback(
    async (values: UserFormValues) => {
      try {
        const response = await editUser({ id: user.id, ...values })
        if (response.error) {
          throw response
        }
        toast.success('Usuario actualizado correctamente')
        router.push('/dashboard/admin/interns')
      } catch (error: any) {
        console.error('Error updating user:', error)
        toast.error(error.message || 'Error al actualizar el usuario')
      }
    },
    [user.id, router]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {user.rol === 'becario' ? 'Editar Perfil de Usuario' : 'Perfil de Usuario'}
        </h1>
        <p className="text-muted-foreground">
          {user.rol === 'becario' ? 'Modifica la información del usuario' : 'Visualiza la información del usuario'}
        </p>
      </div>

      <div className="space-y-6">
        {/* Personal info - always visible */}
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <p className="text-sm text-muted-foreground">{user.first_name} {user.last_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Rol</label>
                <p className="text-sm text-muted-foreground">{user.rol}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Sexo</label>
                <p className="text-sm text-muted-foreground">
                  {user.sexo === 'M' ? 'Masculino' : user.sexo === 'F' ? 'Femenino' : 'Otro'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Fecha de Nacimiento</label>
                <p className="text-sm text-muted-foreground">{user.fecha_nacimiento}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Only show editable form for interns */}
        {user.rol === 'becario' ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Información de Acceso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Usuario</FormLabel>
                          <FormControl>
                            <Input placeholder="Usuario único" {...field} />
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
                            <Input type="email" placeholder="nombre@correo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Formación Académica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
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
                            <Input placeholder="Programa académico" {...field} />
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Metas de Horas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="meta_horas_voluntariado_interno"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voluntariado Interno</FormLabel>
                          <FormControl>
                            <Input placeholder="Horas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="meta_horas_voluntariado_externo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voluntariado Externo</FormLabel>
                          <FormControl>
                            <Input placeholder="Horas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="meta_horas_chat_ingles"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chat Inglés</FormLabel>
                          <FormControl>
                            <Input placeholder="Horas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="meta_horas_talleres"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Talleres</FormLabel>
                          <FormControl>
                            <Input placeholder="Horas" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Solo puedes visualizar la información personal de administradores.</p>
          </div>
        )}
      </div>
    </div>
  )
}