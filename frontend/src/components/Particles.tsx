"use client"
import React, { useRef, useEffect } from 'react'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  alpha: number
  pulse: number
}

interface ParticlesProps {
  count?: number
  color?: string
  className?: string
}

export default function Particles({ count = 48, color = '#224E7D', className = '' }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio
      canvas.height = canvas.clientHeight * window.devicePixelRatio
    }
    resize()
    window.addEventListener('resize', resize)

    // Init particles
    const init = () => {
      const w = canvas.width
      const h = canvas.height
      particlesRef.current = Array.from({ length: count }).map(() => {
        const speed = 0.12 + Math.random() * 0.35
        return {
          x: Math.random() * w,
          y: Math.random() * h,
            vx: (Math.random() - 0.5) * speed,
            vy: (Math.random() - 0.5) * speed,
          r: 1 + Math.random() * 2.4,
          alpha: 0.25 + Math.random() * 0.5,
          pulse: Math.random() * Math.PI * 2,
        }
      })
    }
    init()

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      particlesRef.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.pulse += 0.01
        // Wrap edges
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
        const fade = (Math.sin(p.pulse) + 1) * 0.25
        ctx.beginPath()
        ctx.fillStyle = hexToRgba(color, p.alpha * (0.7 + fade))
        ctx.arc(p.x, p.y, p.r + fade, 0, Math.PI * 2)
        ctx.fill()
      })
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [count, color])

  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden pointer-events-none ${className}`}> 
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}

function hexToRgba(hex: string, alpha: number) {
  const raw = hex.replace('#', '')
  const bigint = parseInt(raw, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r},${g},${b},${alpha})`
}
