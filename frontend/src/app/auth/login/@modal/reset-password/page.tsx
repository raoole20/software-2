'use client'
import React, { useEffect, useRef, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function page() {
  const [open, setOpen] = useState(true)
  const [email, setEmail] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open) {
      // small timeout to ensure dialog is mounted
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  function isValidEmail(v: string) {
    return /\S+@\S+\.\S+/.test(v)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidEmail(email)) {
      // simple inline feedback; you can replace with toast if desired
      alert('Ingresa un correo válido')
      return
    }

    setSending(true)
    try {
      // Replace this with a real API call if you have one.
      await new Promise((res) => setTimeout(res, 800))
      setSent(true)
    } catch (err) {
      console.error(err)
      alert('Ocurrió un error, intenta nuevamente')
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog defaultOpen open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Recuperar contraseña</DialogTitle>
          <DialogDescription>
            Ingresa el correo asociado a tu cuenta y un administrador te enviará una nueva contraseña.
          </DialogDescription>
        </DialogHeader>

        {!sent ? (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="reset-email">Correo electrónico</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={inputRef}
                required
                className="mt-2"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} type="button">Cancelar</Button>
              <Button type="submit" disabled={sending || !isValidEmail(email)}>
                {sending ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="mt-4">
            <p>Un administrador te enviará un correo con tu nueva password.</p>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setOpen(false)}>Aceptar</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
