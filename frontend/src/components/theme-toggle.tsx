"use client"

import React, { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const onToggle = (checked: boolean) => setTheme(checked ? "dark" : "light")
  const isDark = mounted ? resolvedTheme === "dark" : false


  return (
    <div className='w-full flex flex-col-reverse sm:flex-row justify-center sm:justify-end p-4'>
      <div className="flex items-center gap-5">
        <Switch
          checked={isDark}
          className=""
          aria-checked={isDark}
          onCheckedChange={(v) => onToggle(Boolean(v))}
          aria-label="Toggle theme"
        />
      </div>
    </div>
  )
}
