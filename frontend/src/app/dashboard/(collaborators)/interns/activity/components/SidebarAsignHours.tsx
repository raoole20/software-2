"use client"

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface Props {
  id?: string
}

export default function SidebarAsignHours({ id }: Props) {
  const router = useRouter()
  const [hours, setHours] = useState<number | ''>('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // simple client-side validation before submit
      if (hours === '' || Number.isNaN(hours) || (typeof hours === 'number' && hours < 0)) {
        setError('Ingresa un número válido (≥ 0)')
        setLoading(false)
        return
      }

      // TODO: call server action / API to save assigned hours
      // For now we log, wait a bit and navigate back
      console.log('Assigning hours', { id, hours, notes })
      await new Promise((r) => setTimeout(r, 500))

      // navigate back to previous route (close sidebar)
      router.back()
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Asignar horas</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label className="text-sm">Actividad</Label>
          <div className="text-sm text-muted-foreground">{id ?? 'N/A'}</div>
        </div>

        <div>
          <Label className="text-sm">Horas</Label>
          <Input
            type="number"
            value={hours as any}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const v = e.target.value
              const num = v === '' ? '' : Number(v)
              setHours(num)
              // validate lightly on change
              if (v === '' || Number.isNaN(num) || (typeof num === 'number' && num < 0)) {
                setError('Ingresa un número válido (≥ 0)')
              } else {
                setError(null)
              }
            }}
            min={0}
            aria-invalid={!!error}
            className={cn('w-full', error ? 'border-red-500' : '')}
            aria-describedby={error ? 'hours-error' : undefined}
          />
          {error ? <p id="hours-error" className="text-xs text-red-500 mt-1">{error}</p> : <p className="text-xs text-muted-foreground mt-1">Ingresa las horas asignadas</p>}
        </div>

        <div>
          <Label className="text-sm">Notas (opcional)</Label>
          <textarea value={notes} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-md border px-2 py-1" />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading || hours === '' || !!error}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
