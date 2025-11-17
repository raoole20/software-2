"use client"

"use client"

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'

interface Props {
  id?: string
  /** optional token to authenticate the request; if not provided will try localStorage.getItem('token') */
  token?: string
  /** optional server action passed from a parent server component. If provided it will be used to create the registro. */
  onCreate?: (data: { actividad?: number; descripcion_manual?: string; horas_reportadas: string | number }) => Promise<any>
  /** máximo permitido de horas para la actividad */
  maxHours?: number
}

export default function SidebarAsignHours({ id, token, onCreate, maxHours }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  type FormValues = {
    horas_reportadas: string
    descripcion_manual: string
    actividad?: number
  }

  const form = useForm<FormValues>({
    mode: 'onChange',
    defaultValues: {
      actividad: id ? Number(id) : undefined,
      horas_reportadas: '',
      descripcion_manual: '',
    }
  })


  const submit = async (data: FormValues) => {
    setServerError(null)
    setLoading(true)
    try {

      const payload = {
        actividad:  (id ? Number(id) : undefined),
        descripcion_manual: data.descripcion_manual,
        horas_reportadas: data.horas_reportadas,
      }

      if (onCreate) {
        await onCreate(payload)
      } 

      router.back()
    } catch (err: any) {
      console.error(err)
      setServerError(err?.message ?? String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex h-full flex-col justify-between">
        {/* Content area */}
        <div className="flex-1 space-y-4 p-4">
          {/* Activity Info */}
          <div className="flex items-center justify-between rounded-lg border bg-muted/20 p-3">
            <span className="text-sm font-medium text-muted-foreground">ID Actividad</span>
            <span className="rounded-md bg-primary/10 px-2 py-1 text-sm font-mono text-primary">
              {id ?? 'N/A'}
            </span>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="horas_reportadas"
              rules={{
                required: 'Las horas son requeridas',
                validate: v => {
                  const n = Number(v)
                  if (isNaN(n) || n < 0) return 'Ingresa un número válido (≥ 0)'
                  if (typeof maxHours === 'number' && n > maxHours) return `No puede exceder ${maxHours} hora(s)`
                  return true
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Horas trabajadas</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.25"
                      max={typeof maxHours === 'number' ? maxHours : undefined}
                      placeholder="Ej. 2.5"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  {typeof maxHours === 'number' && (
                    <p className="text-xs text-muted-foreground">Máximo permitido: {maxHours} hora(s)</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion_manual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Descripción del trabajo realizado</FormLabel>
                  <FormControl>
                    <textarea 
                      {...field} 
                      rows={4} 
                      placeholder="Describe brevemente las actividades realizadas..."
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Error Message */}
          {serverError && (
            <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{serverError}</p>
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="border-t bg-muted/20 p-4">
          <div className="flex items-center gap-2">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={loading || !form.formState.isValid}
            >
              {loading ? 'Guardando...' : 'Registrar horas'}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
