"use client"

import React, { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark') {
        setIsDark(true)
        document.documentElement.classList.add('dark')
        return
      }
      if (stored === 'light') {
        setIsDark(false)
        document.documentElement.classList.remove('dark')
        return
      }

      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
      if (prefersDark) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
    } catch (e) {
      // SSR safety and localStorage errors
      setIsDark(false)
    }
  }, [])

  const onToggle = (checked: boolean) => {
    setIsDark(checked)
    try {
      if (checked) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    } catch (e) {
      // ignore
    }
  }

  if (isDark === null) return null

  return (
    <div className='w-full flex flex-col-reverse sm:flex-row justify-center sm:justify-end p-4'>
      <div className="flex items-center gap-5">
        <span className="text-xs text-muted-foreground">{isDark ? 'Dark' : 'Light'}</span>
        <Switch
          checked={!!isDark}
          className=''
          onCheckedChange={(v) => onToggle(Boolean(v))}
          aria-label="Toggle theme"
        />
      </div>
    </div>
  )
}
