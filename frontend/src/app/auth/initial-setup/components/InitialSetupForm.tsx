'use client'

import * as React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PasswordInput from '@/components/common/password-input'
import { z } from 'zod'

const initialSetupSchema = z.object({
  nueva_password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmar_password: z.string(),
  pregunta_seguridad: z.string().min(10, 'La pregunta debe tener al menos 10 caracteres'),
  respuesta_seguridad: z.string().min(3, 'La respuesta debe tener al menos 3 caracteres'),
}).refine((data) => data.nueva_password === data.confirmar_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirmar_password"],
})

type InitialSetupFormValues = z.infer<typeof initialSetupSchema>

export default function InitialSetupForm() {
  const router = useRouter()

  const form = useForm<InitialSetupFormValues>({
    resolver: zodResolver(initialSetupSchema),
    defaultValues: {
      nueva_password: '',
      confirmar_password: '',
      pregunta_seguridad: '',
      respuesta_seguridad: '',
    },
    mode: 'onTouched',
  })

  const handleSubmit = React.useCallback(
    async (values: InitialSetupFormValues) => {
      try {
        const response = await fetch('/api/users/configuracion-inicial/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nueva_password: values.nueva_password,
            confirmar_password: values.confirmar_password,
            pregunta_seguridad: values.pregunta_seguridad,
            respuesta_seguridad: values.respuesta_seguridad,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          if (response.status === 400 && data) {
            // Handle field errors
            Object.keys(data).forEach((field) => {
              form.setError(field as keyof InitialSetupFormValues, {
                type: 'server',
                message: Array.isArray(data[field]) ? data[field].join(' ') : data[field],
              })
            })
            toast.error('Por favor corrige los errores en el formulario.')
            return
          }
          throw new Error(data.message || 'Error en la configuración inicial')
        }

        toast.success('Configuración inicial completada exitosamente! Ahora puedes iniciar sesión con tu nueva contraseña.')
        router.push('/auth/login')
      } catch (error: any) {
        console.error('Error in initial setup:', error)
        toast.error(error.message || 'Error al completar la configuración inicial')
      }
    },
    [form, router]
  )

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Configuración Inicial</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cambiar Contraseña</h3>

              <FormField
                control={form.control}
                name="nueva_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} placeholder="Nueva contraseña" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmar_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} placeholder="Confirmar contraseña" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Pregunta de Seguridad</h3>

              <FormField
                control={form.control}
                name="pregunta_seguridad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pregunta de Seguridad</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: ¿Cuál es el nombre de tu primera mascota?" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="respuesta_seguridad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Respuesta</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Tu respuesta" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={form.formState.isSubmitting} className="flex-1">
                {form.formState.isSubmitting ? 'Guardando...' : 'Completar Configuración'}
              </Button>
              <Button type="button" variant="outline" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}