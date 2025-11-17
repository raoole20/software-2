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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getMyProfile, editUser } from '@/server/users'
import { Users } from '@/types/user'
import { z } from 'zod'

const semesterSchema = z.object({
  semestre: z.string().min(1, 'Semestre es requerido'),
})

type SemesterFormValues = z.infer<typeof semesterSchema>

export default function ProfilePage() {
  const [profile, setProfile] = React.useState<Users | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [editingSemester, setEditingSemester] = React.useState(false)

  const form = useForm<SemesterFormValues>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      semestre: '',
    },
    mode: 'onTouched',
  })

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile()
        setProfile(data)
        form.setValue('semestre', data.semestre)
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Error al cargar el perfil')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [form])

  const handleSemesterSubmit = React.useCallback(
    async (values: SemesterFormValues) => {
      if (!profile) return

      try {
        const response = await editUser({ id: profile.id, semestre: values.semestre })
        if (response.error) {
          throw response
        }
        setProfile(prev => prev ? { ...prev, semestre: values.semestre } : null)
        setEditingSemester(false)
        toast.success('Semestre actualizado correctamente')
      } catch (error: any) {
        console.error('Error updating semester:', error)
        toast.error(error.message || 'Error al actualizar el semestre')
      }
    },
    [profile]
  )

  if (loading) {
    return <div>Cargando...</div>
  }

  if (!profile) {
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
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <p className="text-sm text-muted-foreground">{profile.first_name} {profile.last_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Usuario</label>
              <p className="text-sm text-muted-foreground">{profile.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Correo</label>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Rol</label>
              <p className="text-sm text-muted-foreground">{profile.rol}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Sexo</label>
              <p className="text-sm text-muted-foreground">
                {profile.sexo === 'M' ? 'Masculino' : profile.sexo === 'F' ? 'Femenino' : 'Otro'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Fecha de Nacimiento</label>
              <p className="text-sm text-muted-foreground">{profile.fecha_nacimiento}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formación Académica</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Universidad</label>
              <p className="text-sm text-muted-foreground">{profile.universidad}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Carrera</label>
              <p className="text-sm text-muted-foreground">{profile.carrera}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Semestre</label>
              {editingSemester ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSemesterSubmit)} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="semestre"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Ej. 5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="sm">Guardar</Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditingSemester(false)}>Cancelar</Button>
                  </form>
                </Form>
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{profile.semestre}</p>
                  <Button variant="outline" size="sm" onClick={() => setEditingSemester(true)}>Editar</Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metas de Horas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Voluntariado Interno</label>
              <p className="text-sm text-muted-foreground">{profile.meta_horas_voluntariado_interno} horas</p>
            </div>
            <div>
              <label className="text-sm font-medium">Voluntariado Externo</label>
              <p className="text-sm text-muted-foreground">{profile.meta_horas_voluntariado_externo} horas</p>
            </div>
            <div>
              <label className="text-sm font-medium">Chat Inglés</label>
              <p className="text-sm text-muted-foreground">{profile.meta_horas_chat_ingles} horas</p>
            </div>
            <div>
              <label className="text-sm font-medium">Talleres</label>
              <p className="text-sm text-muted-foreground">{profile.meta_horas_talleres} horas</p>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}