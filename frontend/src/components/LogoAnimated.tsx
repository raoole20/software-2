"use client"

import React from "react"
// Se corrige la importación. 'framer-motion' es la librería correcta.
import { motion } from "framer-motion"

// CAMBIO: Se ajusta el 'size' por defecto a 500px
export default function LogoAnimated({ size = 500 }: { size?: number }) {
  const blue = "#224E7D"
  // const green = "#7ec04a" // No se usa en este componente
  // const darkGreen = "#5aa036" // No se usa en este componente

  return (
    <motion.svg
      width={size}
      height={size}
      // Se ajusta el viewBox (lienzo) para que el texto no se corte.
      viewBox="-14 0 228 245"
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      // Se añade 'overflow="visible"' para asegurar que no se corte.
      overflow="visible"
      className="block"
      aria-hidden={false}
      role="img"
    >
      {/* Anillo del círculo exterior */}
      <motion.circle
        cx="100"
        cy="100"
        r="82"
        fill="none"
        stroke={blue}
        strokeWidth={6}
        strokeLinecap="round"
        initial={{ strokeDasharray: 2 * Math.PI * 82, strokeDashoffset: 2 * Math.PI * 82 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.0, ease: "easeInOut" }}
      />

      {/* Definición del camino para el texto */}
      <defs>
        {/* El radio es 112 para moverlo más abajo */}
        <path id="bottomArc" d="M -12,100 A 112,112 0 0 0 212,100" fill="transparent" />
      </defs>
      
      <motion.text
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        textAnchor="middle" // Centra el texto en el 'startOffset'
        className="fill-[#224E7D] font-bold"
        // Aumentado el tamaño de la fuente a 32
        style={{ fontSize: 32 }}
      >
        <textPath href="#bottomArc" xlinkHref="#bottomArc" startOffset="50%">
          A V A A
        </textPath>
      </motion.text>
    </motion.svg>
  )
}