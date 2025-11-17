'use client'
import React, { useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { ColumnDef } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'

interface TablePdfExportButtonProps<T> {
  columns: ColumnDef<T, any>[]
  data: T[]
  filename?: string
  label?: string
  maxRowsPerPage?: number
  title?: string
  subtitle?: string
  logoSrc?: string // path in public, e.g. '/img/logo/logo.png'
  accentColor?: { r: number; g: number; b: number }
  banding?: boolean
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
  title = 'Reporte',
  subtitle = 'Exportación de datos',
  logoSrc = '/img/logo/logo.png',
  accentColor = { r: 34, g: 123, b: 217 },
  banding = true,
}: TablePdfExportButtonProps<T>) {
  const [loading, setLoading] = useState(false)

  const handleExport = useCallback(async () => {
    try {
      setLoading(true)
      const pdfDoc = await PDFDocument.create()
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
      const accessorCols = getAccessorColumns(columns) as any[]

      // Try to fetch and embed logo (PNG or JPG)
      let logoImage: any = null
      try {
        const res = await fetch(logoSrc)
        const bytes = new Uint8Array(await res.arrayBuffer())
        // naive detect PNG vs JPG by signature
        const isPng = bytes[0] === 0x89 && bytes[1] === 0x50
        logoImage = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes)
      } catch (e) {
        // silently ignore logo errors
        console.warn('Logo no embebido:', e)
      }

      // Basic layout constants
      const pageWidth = 612
      const pageHeight = 792
      const margin = 40
      const headerHeight = 70
      const baseLineHeight = 14 // single line height for table text
      const usableWidth = pageWidth - margin * 2
      const colWidth = accessorCols.length ? usableWidth / accessorCols.length : usableWidth

      let currentPage = pdfDoc.addPage([pageWidth, pageHeight])
      let y = pageHeight - margin

      // Draw header background accent bar
      currentPage.drawRectangle({
        x: 0,
        y: pageHeight - headerHeight - 10,
        width: pageWidth,
        height: headerHeight + 10,
        color: rgb(accentColor.r / 255, accentColor.g / 255, accentColor.b / 255),
        opacity: 0.08,
      })

      // Logo placement & title
      const logoWidth = 50
      const logoHeight = 50
      if (logoImage) {
        currentPage.drawImage(logoImage, {
          x: margin,
          y: pageHeight - logoHeight - 20,
          width: logoWidth,
          height: logoHeight,
        })
      }

      const titleX = logoImage ? margin + logoWidth + 15 : margin
      const titleY = pageHeight - 40
      currentPage.drawText(title, { x: titleX, y: titleY, size: 18, font: fontBold, color: rgb(0,0,0) })
      currentPage.drawText(subtitle, { x: titleX, y: titleY - 18, size: 11, font, color: rgb(40/255,40/255,40/255) })
      const dateStr = new Date().toLocaleString('es-ES')
      currentPage.drawText(dateStr, { x: pageWidth - margin - 160, y: titleY, size: 10, font, color: rgb(60/255,60/255,60/255) })

      // Move y below header area
      y = pageHeight - headerHeight - 30

      const drawText = (text: string, x: number, yPos: number, size = 10) => {
        currentPage.drawText(text, { x, y: yPos, size, font })
      }

      // Helper: wrap text into lines with approximate max chars per line (depends on columns)
      const wrapText = (value: string, maxChars: number) => {
        const cleaned = value.replace(/\s+/g, ' ').trim()
        if (cleaned.length <= maxChars) return [cleaned]
        const words = cleaned.split(' ')
        const lines: string[] = []
        let current = ''
        for (const w of words) {
          if ((current + ' ' + w).trim().length <= maxChars) {
            current = (current ? current + ' ' : '') + w
          } else {
            if (current) lines.push(current)
            current = w
          }
        }
        if (current) lines.push(current)
        return lines
      }

      // Header row background
      currentPage.drawRectangle({
        x: margin - 4,
        y: y - 4,
        width: usableWidth + 8,
        height: baseLineHeight + 8,
        color: rgb(accentColor.r / 255, accentColor.g / 255, accentColor.b / 255),
        opacity: 0.12,
        borderColor: rgb(accentColor.r / 255, accentColor.g / 255, accentColor.b / 255),
        borderWidth: 1,
      })
      accessorCols.forEach((col, idx) => {
        const headerLabel = typeof col.header === 'string' ? col.header : (col.accessorKey as string)
        drawText(String(headerLabel).toUpperCase(), margin + idx * colWidth, y, 11)
      })
      y -= baseLineHeight + 12

      // Rows (with wrapping)
      for (let i = 0; i < data.length; i++) {
        const row = data[i] as any
        // Page break check
        if (y < margin + baseLineHeight * 3) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight])
          y = pageHeight - margin
          // Re-draw header on new page
          accessorCols.forEach((col, idx) => {
            const headerLabel = typeof col.header === 'string' ? col.header : (col.accessorKey as string)
            drawText(headerLabel, margin + idx * colWidth, y, 11)
          })
          y -= baseLineHeight
          currentPage.drawLine({ start: { x: margin, y }, end: { x: pageWidth - margin, y }, thickness: 1 })
          y -= baseLineHeight
        }

        // Row banding
        if (banding && i % 2 === 0) {
          // we will compute dynamic height after wrapping
        }
        // Prepare wrapped lines per cell
        const cellLinesPerColumn: string[][] = accessorCols.map(col => {
          const key = col.accessorKey as string
          let value = row[key]
          if (value === null || value === undefined) value = ''
          if (value instanceof Date) value = value.toISOString().slice(0, 10)
          const text = String(value)
          // heuristic: max chars based on column width (approx 6 px per char at size 10)
          const maxChars = Math.max(8, Math.floor(colWidth / 6))
          return wrapText(text, maxChars).slice(0, 4) // cap to 4 lines per cell
        })
        const rowLineCount = Math.max(...cellLinesPerColumn.map(lines => lines.length))
        const rowHeight = rowLineCount * baseLineHeight + 6
        // Draw band after computing height
        if (banding && i % 2 === 0) {
          currentPage.drawRectangle({
            x: margin - 4,
            y: y - 3,
            width: usableWidth + 8,
            height: rowHeight,
            color: rgb(245/255,245/255,245/255),
          })
        }
        // Render lines
        for (let lineIdx = 0; lineIdx < rowLineCount; lineIdx++) {
          accessorCols.forEach((col, colIdx) => {
            const lines = cellLinesPerColumn[colIdx]
            const lineText = lines[lineIdx] || ''
            drawText(lineText, margin + colIdx * colWidth, y - lineIdx * baseLineHeight, 10)
          })
        }
        y -= rowHeight + 2

        // Optional manual page limit safeguard
        if ((i + 1) % maxRowsPerPage === 0 && i < data.length - 1) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight])
          y = pageHeight - margin
          accessorCols.forEach((col, idx) => {
            const headerLabel = typeof col.header === 'string' ? col.header : (col.accessorKey as string)
            drawText(String(headerLabel).toUpperCase(), margin + idx * colWidth, y, 11)
          })
          y -= baseLineHeight + 10
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
