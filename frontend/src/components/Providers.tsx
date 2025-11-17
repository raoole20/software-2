'use client'
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/contexts'
import { Toaster } from '@/components/ui/sonner'

interface Props {
  children: React.ReactNode
}

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <ThemeProvider attribute={'class'} defaultTheme={'system'} enableSystem>
        <Toaster />
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}
