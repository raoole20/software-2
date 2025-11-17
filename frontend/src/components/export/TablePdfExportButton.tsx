'use client'
import React, { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import { ColumnDef } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'

interface TablePdfExportButtonProps<T> {
  columns: ColumnDef<T, any>[]
  data: T[]
  filename?: string
  label?: string
  maxRowsPerPage?: number
}

// Extract accessor columns only (skip selection/actions without accessorKey)
function getAccessorColumns<T>(columns: ColumnDef<T, any>[]) {
  return columns.filter((c: any) => c.accessorKey)
}

export function TablePdfExportButton<T>({
  columns,
  data,
  filename = 'tabla.pdf',
  label = 'Exportar PDF',
  maxRowsPerPage = 40,
}: TablePdfExportButtonProps<T>) {
  const [loading, setLoading] = useState(false)

  const handleExport = useCallback(async () => {
    try {
      setLoading(true)
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const accessorCols = getAccessorColumns(columns) as any[]

      // Basic layout constants
      const pageWidth = 612
      const pageHeight = 792
      const margin = 40
      const lineHeight = 14
      const usableWidth = pageWidth - margin * 2
      const colWidth = accessorCols.length ? usableWidth / accessorCols.length : usableWidth

      let currentPage = pdfDoc.addPage([pageWidth, pageHeight])
      let y = pageHeight - margin

      const drawText = (text: string, x: number, yPos: number, size = 10) => {
        currentPage.drawText(text, { x, y: yPos, size, font })
      }

      // Header row
      accessorCols.forEach((col, idx) => {
        const headerLabel = typeof col.header === 'string' ? col.header : (col.accessorKey as string)
        drawText(headerLabel, margin + idx * colWidth, y, 11)
      })
      y -= lineHeight

      // Divider line
      currentPage.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1 })
      y -= lineHeight

      // Rows
      for (let i = 0; i < data.length; i++) {
        const row = data[i] as any
        // Page break check
        if (y < margin + lineHeight) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight])
          y = pageHeight - margin
          // Re-draw header on new page
          accessorCols.forEach((col, idx) => {
            const headerLabel = typeof col.header === 'string' ? col.header : (col.accessorKey as string)
            drawText(headerLabel, margin + idx * colWidth, y, 11)
          })
          y -= lineHeight
          currentPage.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1 })
          y -= lineHeight
        }

        accessorCols.forEach((col, idx) => {
          const key = col.accessorKey as string
          let value = row[key]
          if (value === null || value === undefined) value = ''
          if (value instanceof Date) value = value.toISOString().slice(0, 10)
          const text = String(value).slice(0, 30) // truncate
          drawText(text, margin + idx * colWidth, y)
        })
        y -= lineHeight

        // Optional manual page limit safeguard
        if ((i + 1) % maxRowsPerPage === 0 && i < data.length - 1) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight])
          y = pageHeight - margin
          accessorCols.forEach((col, idx) => {
            const headerLabel = typeof col.header === 'string' ? col.header : (col.accessorKey as string)
            drawText(headerLabel, margin + idx * colWidth, y, 11)
          })
          y -= lineHeight
          currentPage.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1 })
          y -= lineHeight
        }
      }

      const pdfBytes = await pdfDoc.save() // Uint8Array
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Error al exportar PDF:', e)
    } finally {
      setLoading(false)
    }
  }, [columns, data, filename, maxRowsPerPage])

  return (
    <Button variant="outline" size="sm" onClick={handleExport} disabled={loading} aria-label={label}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {label}
    </Button>
  )
}

export default TablePdfExportButton
