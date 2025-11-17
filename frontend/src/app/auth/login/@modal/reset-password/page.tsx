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
import PasswordInput from "@/components/common/password-input"
import { toast } from "sonner"

type Step = 'email' | 'security_question' | 'new_password'

export default function ResetPasswordPage() {
  const [open, setOpen] = useState(true)
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState("")
  const [securityQuestion, setSecurityQuestion] = useState("")
  const [userId, setUserId] = useState<number | null>(null)
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [modalKey, setModalKey] = useState(Date.now()) // Force remount

  // Reset state when component mounts (modal opens)
  useEffect(() => {
    setOpen(true)
    setStep('email')
    setEmail("")
    setSecurityQuestion("")
    setUserId(null)
    setSecurityAnswer("")
    setNewPassword("")
    setConfirmPassword("")
    setLoading(false)
    setModalKey(Date.now()) // Force remount
  }, [])

  useEffect(() => {
    if (open && step === 'email') {
      // small timeout to ensure dialog is mounted
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, step])

  function isValidEmail(v: string) {
    return /\S+@\S+\.\S+/.test(v)
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidEmail(email)) {
      toast.error('Ingresa un correo válido')
      return
    }

    setLoading(true)
    try {
      // Call backend directly to avoid Next.js middleware issues
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:8000'
      const response = await fetch(`${backendUrl}/api/users/usuarios/obtener_pregunta_seguridad/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Error al obtener la pregunta de seguridad')
        return
      }

      setSecurityQuestion(data.pregunta_seguridad)
      setUserId(data.user_id)
      setStep('security_question')
    } catch (err) {
      console.error('Network error:', err)
      toast.error('Error de conexión. Verifica que el servidor backend esté ejecutándose.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSecurityAnswerSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!securityAnswer.trim()) {
      toast.error('Ingresa la respuesta de seguridad')
      return
    }

    setLoading(true)
    try {
      // Call backend directly to avoid Next.js middleware issues
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:8000'
      const response = await fetch(`${backendUrl}/api/users/usuarios/resetear_password_seguridad/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          respuesta_seguridad: securityAnswer,
          nueva_password: 'temp' // We'll validate this in the next step
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 400 && data.error === 'La respuesta de seguridad es incorrecta') {
          toast.error('Respuesta incorrecta. Inténtalo de nuevo.')
          setSecurityAnswer('')
          return
        }
        toast.error(data.error || 'Error al verificar la respuesta')
        return
      }

      // Answer is correct, move to password reset
      setStep('new_password')
    } catch (err) {
      console.error('Network error:', err)
      toast.error('Ocurrió un error, intenta nuevamente')
    } finally {
      setLoading(false)
    }
  }

  async function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault()
    if (!newPassword || newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      // Call backend directly to avoid Next.js middleware issues
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://127.0.0.1:8000'
      const response = await fetch(`${backendUrl}/api/users/usuarios/resetear_password_seguridad/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          respuesta_seguridad: securityAnswer,
          nueva_password: newPassword
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Error al cambiar la contraseña')
        return
      }

      toast.success('Contraseña cambiada exitosamente')
      setOpen(false)
    } catch (err) {
      console.error('Network error:', err)
      toast.error('Ocurrió un error, intenta nuevamente')
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setStep('email')
    setEmail('')
    setSecurityQuestion('')
    setUserId(null)
    setSecurityAnswer('')
    setNewPassword('')
    setConfirmPassword('')
  }

  function handleBack() {
    if (step === 'security_question') {
      setStep('email')
      setSecurityQuestion('')
      setUserId(null)
      setSecurityAnswer('')
    } else if (step === 'new_password') {
      setStep('security_question')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <Dialog key={modalKey} defaultOpen open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen) {
        resetForm()
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Recuperar contraseña</DialogTitle>
          <DialogDescription>
            {step === 'email' && 'Ingresa el correo asociado a tu cuenta para recuperar tu contraseña.'}
            {step === 'security_question' && 'Responde la pregunta de seguridad para continuar.'}
            {step === 'new_password' && 'Ingresa tu nueva contraseña.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="mt-4 space-y-4">
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
              <Button type="submit" disabled={loading || !isValidEmail(email)}>
                {loading ? 'Verificando...' : 'Continuar'}
              </Button>
            </div>
          </form>
        )}

        {step === 'security_question' && (
          <form onSubmit={handleSecurityAnswerSubmit} className="mt-4 space-y-4">
            <div>
              <Label>Pregunta de seguridad</Label>
              <p className="text-sm text-muted-foreground mt-1 p-3 bg-gray-50 rounded-md">
                {securityQuestion}
              </p>
            </div>

            <div>
              <Label htmlFor="security-answer">Tu respuesta</Label>
              <Input
                id="security-answer"
                type="text"
                placeholder="Ingresa tu respuesta"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="mt-2"
                required
              />
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={handleBack} type="button">Atrás</Button>
              <Button type="submit" disabled={loading || !securityAnswer.trim()}>
                {loading ? 'Verificando...' : 'Verificar'}
              </Button>
            </div>
          </form>
        )}

        {step === 'new_password' && (
          <form onSubmit={handlePasswordReset} className="mt-4 space-y-4">
            <div>
              <Label htmlFor="new-password">Nueva contraseña</Label>
              <PasswordInput
                id="new-password"
                placeholder="Nueva contraseña (mínimo 8 caracteres)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirmar contraseña</Label>
              <PasswordInput
                id="confirm-password"
                placeholder="Confirma la nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-2"
                required
              />
            </div>

            <div className="flex justify-between gap-2">
              <Button variant="outline" onClick={handleBack} type="button">Atrás</Button>
              <Button type="submit" disabled={loading || !newPassword || !confirmPassword}>
                {loading ? 'Cambiando...' : 'Cambiar contraseña'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
