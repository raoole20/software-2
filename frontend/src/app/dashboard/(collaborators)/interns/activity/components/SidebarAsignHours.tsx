"use client"

import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  id?: string
}

export default function SidebarAsignHours({ id }: Props) {
  const router = useRouter()
  const [hours, setHours] = useState<number | ''>('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // TODO: call server action / API to save assigned hours
      // For now we just log and navigate back
      console.log('Assigning hours', { id, hours, notes })
      // small delay to mimic network
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Actividad ID</Label>
          <div className="text-sm text-muted-foreground">{id ?? 'N/A'}</div>
        </div>

        <div>
          <Label>Horas</Label>
          <Input type="number" value={hours as any} onChange={(e) => setHours(e.target.value === '' ? '' : Number(e.target.value))} min={0} />
        </div>

        <div>
          <Label>Notas (opcional)</Label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-md border px-2 py-1" rows={3} />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={loading || hours === ''}>
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
