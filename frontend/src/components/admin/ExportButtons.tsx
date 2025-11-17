"use client"
import React from 'react'
import { Button } from '@/components/ui/button'

async function downloadFile(url: string, filename: string) {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
    const blob = await res.blob()
    const urlBlob = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = urlBlob
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(urlBlob)
  } catch (err) {
    // Minimal client-side error handling
    // eslint-disable-next-line no-console
    console.error('Download failed', err)
    alert('Error al descargar el archivo. Revisa la consola.')
  }
}

export function ExportButtons() {
  const handleCsv = async () => {
    await downloadFile('/api/export/csv', 'informe.csv')
  }

  const handlePdf = async () => {
    await downloadFile('/api/export/pdf', 'informe.pdf')
  }

  return (
    <div>
      <Button onClick={handleCsv}>Exportar CSV</Button>
      <Button variant="outline" className="ml-2" onClick={handlePdf}>
        Exportar PDF
      </Button>
    </div>
  )
}

export default ExportButtons
