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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { editUser, getUserById } from '@/server/users'
import { Users } from '@/types/user'
import { z } from 'zod'

const adminProfileSchema = z.object({
  username: z.string().min(1, 'Usuario es requerido'),
  email: z.string().email('Email inválido'),
  first_name: z.string().min(1, 'Nombre es requerido'),
  last_name: z.string().min(1, 'Apellidos son requeridos'),
  sexo: z.string().min(1, 'Sexo es requerido'),
  fecha_nacimiento: z.string().min(1, 'Fecha de nacimiento es requerida'),
})

type AdminProfileFormValues = z.infer<typeof adminProfileSchema>

interface AdminUserProfileFormProps {
  userId: string
  isOwnProfile: boolean
}

export default function AdminUserProfileForm({ userId, isOwnProfile }: AdminUserProfileFormProps) {
  const router = useRouter()
  const [user, setUser] = React.useState<Users | null>(null)
  const [loading, setLoading] = React.useState(true)

  const form = useForm<AdminProfileFormValues>({
    resolver: zodResolver(adminProfileSchema),
    defaultValues: {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      sexo: '',
      fecha_nacimiento: '',
    },
    mode: 'onTouched',
  })

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserById(parseInt(userId))
        setUser(userData)
        form.reset({
          username: userData.username,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          sexo: userData.sexo,
          fecha_nacimiento: userData.fecha_nacimiento || '',
        })
      } catch (error) {
        console.error('Error fetching user:', error)
        toast.error('Error al cargar el perfil')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId, form])

  const handleSubmit = React.useCallback(
    async (values: AdminProfileFormValues) => {
      if (!user) return

      try {
        const response = await editUser({ id: user.id, ...values })
        if (response.error) {
          throw response
        }
        setUser(prev => prev ? { ...prev, ...values } : null)
        toast.success('Perfil actualizado correctamente')
      } catch (error: any) {
        console.error('Error updating profile:', error)
        if (error.status === 400) {
          const fieldErrors = error.data;
          Object.keys(fieldErrors).forEach((field) => {
            form.setError(field as keyof AdminProfileFormValues, {
              type: 'server',
              message: fieldErrors[field].join(' '),
            })
          });
          toast.error('Por favor corrige los errores en el formulario.')
          return;
        }

        toast.error(error.message || 'Error al actualizar el perfil')
      }
    },
    [user]
  )

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!user) {
    return <div>Error al cargar el perfil</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">Visualiza y edita tu información personal</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Rol</label>
              <p className="text-sm text-muted-foreground">{user.rol}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Estado</label>
              <p className="text-sm text-muted-foreground">Activo</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre(s)" {...field} />
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
                        <Input placeholder="Apellidos" {...field} />
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
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una opción" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="M">Masculino</SelectItem>
                            <SelectItem value="F">Femenino</SelectItem>
                            <SelectItem value="O">Otro</SelectItem>
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
    </div>
  )
}