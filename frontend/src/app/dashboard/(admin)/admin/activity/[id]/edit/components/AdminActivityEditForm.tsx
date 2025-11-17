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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Activity, ActivityDTO } from '@/types/activiy'
import { Users } from '@/types/user'
import { Roles } from '@/types/roles'
import { updateActivity } from '@/server/activities'
import { ChevronDown, Users as UsersIcon } from 'lucide-react'
import { z } from 'zod'

const activitySchema = z.object({
  titulo: z.string().min(1, 'Título es requerido'),
  descripcion: z.string().optional(),
  tipo: z.string().min(1, 'Tipo es requerido'),
  fecha: z.string().min(1, 'Fecha es requerida'),
  duracion_horas: z.string().min(1, 'Duración es requerida'),
  competencia_desarrollada: z.string().optional(),
  modalidad: z.string().min(1, 'Modalidad es requerida'),
  organizacion: z.string().optional(),
  facilitador: z.string().optional(),
  en_catalogo: z.boolean(),
})

type ActivityFormValues = z.infer<typeof activitySchema>

interface AdminActivityEditFormProps {
  activity: Activity
  allUsers: Users[]
}

export default function AdminActivityEditForm({ activity, allUsers }: AdminActivityEditFormProps) {
  const router = useRouter()

  // Estado para becarios seleccionados
  const [selectedInterns, setSelectedInterns] = React.useState<number[]>([])
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  // Inicializar becarios seleccionados con los ya asignados
  React.useEffect(() => {
    const actividadDetalle = activity as any
    if (actividadDetalle.becarios_asignados_info) {
      const assignedIds = actividadDetalle.becarios_asignados_info.map((becario: any) => becario.id)
      setSelectedInterns(assignedIds)
    }
  }, [activity])

  const interns = allUsers.filter(user => user.rol === Roles.USER)

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

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      titulo: activity.titulo,
      descripcion: activity.descripcion || '',
      tipo: activity.tipo,
      fecha: activity.fecha instanceof Date ? activity.fecha.toISOString().slice(0, 10) : String(activity.fecha).slice(0, 10),
      duracion_horas: String(activity.duracion_horas),
      competencia_desarrollada: activity.competencia_desarrollada || '',
      modalidad: activity.modalidad,
      organizacion: activity.organizacion || '',
      facilitador: activity.facilitador || '',
      en_catalogo: activity.en_catalogo,
    },
    mode: 'onTouched',
  })

  const handleSubmit = React.useCallback(
    async (values: ActivityFormValues) => {
      try {
        const payload: any = {
          ...values,
          duracion_horas: values.duracion_horas,
          becarios_asignados: selectedInterns,
        }

        await updateActivity(activity.id, payload)
        toast.success('Actividad actualizada correctamente')
        router.push('/dashboard/admin/activity')
      } catch (error: any) {
        console.error('Error updating activity:', error)
        toast.error(error.message || 'Error al actualizar la actividad')
      }
    },
    [activity.id, router, selectedInterns]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar Actividad</h1>
        <p className="text-muted-foreground">Modifica los datos de la actividad</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Interna">Interna</SelectItem>
                          <SelectItem value="Externa">Externa</SelectItem>
                          <SelectItem value="Taller">Taller</SelectItem>
                          <SelectItem value="Chat">Chat de Inglés</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar modalidad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="P">Presencial</SelectItem>
                          <SelectItem value="V">Virtual</SelectItem>
                        </SelectContent>
                      </Select>
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
                        <Input type="date" {...field} />
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
                        <Input type="number" step="0.25" {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="competencia_desarrollada"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competencia Desarrollada</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="en_catalogo"
                render={({ field }) => (
                  <FormItem>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Boolean(field.value)}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <span>En catálogo</span>
                    </label>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
        </CardContent>
      </Card>
    </div>
  )
}