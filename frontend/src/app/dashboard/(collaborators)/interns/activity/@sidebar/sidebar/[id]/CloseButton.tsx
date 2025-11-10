"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function CloseButton() {
  const router = useRouter()

  return (
    <Button variant="outline" onClick={() => router.back()}>
      Cerrar
    </Button>
  )
}

