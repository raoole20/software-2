"use client"

import React, { useEffect, useState } from 'react'
import InitialSetupForm from './components/InitialSetupForm'

export default function InitialSetupPage() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      if (typeof window === 'undefined') return false
      const stored = localStorage.getItem('theme')
      if (stored) return stored === 'dark'
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    } catch (e) {
      return false
    }
  })

  useEffect(() => {
    try {
      if (dark) document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    } catch (e) {
      // ignore
    }
  }, [dark])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <button
          type="button"
          aria-label="Toggle color mode"
          onClick={() => setDark(prev => !prev)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white/80 dark:bg-slate-800 text-sm shadow-sm ring-1 ring-gray-200 dark:ring-slate-700 hover:bg-white dark:hover:bg-slate-700"
        >
          <span className="aria-hidden">{dark ? '🌙' : '☀️'}</span>
          <span className="hidden sm:inline text-gray-700 dark:text-gray-200">{dark ? 'Oscuro' : 'Claro'}</span>
        </button>
      </div>

      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Configuración Inicial
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Bienvenido! Complete su configuración inicial para continuar.
          </p>
        </div>
        <InitialSetupForm />
      </div>
    </div>
  )
}