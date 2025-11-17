import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import { getAllUsers } from '@/server/users'
import { getAllPendingHours } from '@/server/activities'

export async function GET() {
  const users = await getAllUsers()
  const hoursResp = await getAllPendingHours()
  const hours = Array.isArray(hoursResp) ? hoursResp : (hoursResp && (hoursResp as any).data) ? (hoursResp as any).data : []

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89]) // A4 in points
  const { width, height } = page.getSize()
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Try to embed project logo if exists
  try {
    const logoPath = path.join(process.cwd(), 'public', 'img', 'logo', 'logo.png')
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath)
      const pngImage = await pdfDoc.embedPng(logoBytes)
      const pngDims = pngImage.scale(0.5)
      page.drawImage(pngImage, { x: 50, y: height - 80, width: pngDims.width, height: pngDims.height })
    }
  } catch (e) {
    // ignore if logo can't be embedded
  }

  // Title + date
  page.drawText('Informe - Overview', {
    x: 200,
    y: height - 50,
    size: 18,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.1),
  })
  const generatedAt = new Date().toLocaleString('es-ES')
  page.drawText(`Generado: ${generatedAt}`, { x: 200, y: height - 70, size: 9, font })

  // Prepare arrays
  const usersArray = Array.isArray(users) ? users : (users && (users as any).data) ? (users as any).data : []
  const hoursArray = Array.isArray(hours) ? hours : (hours && (hours as any).data) ? (hours as any).data : []

  // build user lookup map to find sexo and display name for becarios
  const usersMap: Record<string | number, any> = {}
  for (const u of usersArray) {
    usersMap[(u as any).id] = u
  }

  // KPIs
  const totalUsers = usersArray.length
  const totalPending = hoursArray.length
  const totalHours = hoursArray.reduce((acc: number, h: any) => {
    const v = (h.horas_reportadas ?? h.horas ?? h.hours ?? '0')
    const n = parseFloat(String(v).replace(',', '.'))
    return acc + (isNaN(n) ? 0 : n)
  }, 0)

  // Counts by estado
  const byEstado: Record<string, number> = {}
  for (const h of hoursArray) {
    const key = (h.estado_aprobacion ?? h.estado ?? h.status ?? 'PENDIENTE')
    byEstado[key] = (byEstado[key] || 0) + 1
  }

  // Activities by type
  const byType: Record<string, number> = {}
  for (const h of hoursArray) {
    const tipo = (h.actividad_detalle?.tipo ?? h.actividad_detalle?.titulo ?? h.activity_type ?? 'Otros')
    byType[tipo] = (byType[tipo] || 0) + 1
  }

  // Draw KPI boxes
  const kpiX = 50
  let kpiY = height - 120
  const boxW = 150
  const boxH = 40

  function drawBox(x: number, y: number, title: string, value: string) {
    page.drawRectangle({ x, y: y - boxH, width: boxW, height: boxH, color: rgb(0.96, 0.96, 0.96) })
    page.drawText(title, { x: x + 8, y: y - 18, size: 9, font })
    page.drawText(value, { x: x + 8, y: y - 30, size: 12, font: fontBold })
  }

  drawBox(kpiX, kpiY, 'Usuarios totales', String(totalUsers))
  drawBox(kpiX + boxW + 12, kpiY, 'Registros pendientes', String(totalPending))
  drawBox(kpiX + (boxW + 12) * 2, kpiY, 'Horas totales', String(totalHours))

  // Small lists: byEstado and byType
  let listX = 50
  let listY = kpiY - 70
  page.drawText('Por estado (conteo):', { x: listX, y: listY, size: 11, font: fontBold })
  listY -= 14
  for (const [k, v] of Object.entries(byEstado)) {
    page.drawText(`${k}: ${v}`, { x: listX + 6, y: listY, size: 10, font })
    listY -= 12
  }

  listX = 300
  listY = kpiY - 70
  page.drawText('Por tipo (conteo):', { x: listX, y: listY, size: 11, font: fontBold })
  listY -= 14
  for (const [k, v] of Object.entries(byType)) {
    page.drawText(`${k}: ${v}`, { x: listX + 6, y: listY, size: 10, font })
    listY -= 12
  }

  // Add a page with detailed table of pending hours
  let tablePage = pdfDoc.addPage([595.28, 841.89])
  const margin = 40
  const startY = tablePage.getSize().height - 50
  let y = startY
  const colX = [margin, 90, 220, 350, 420, 480]
  const headers = ['ID', 'Becario', 'Sexo', 'Actividad', 'Horas', 'Fecha', 'Estado']
  // header
  tablePage.drawText('Detalle - Horas pendientes', { x: margin, y, size: 14, font: fontBold })
  y -= 20
  // draw table headers
  // expand colX to accommodate extra column (Sexo)
  const colXExtended = [margin, 90, 160, 260, 360, 430, 500]
  headers.forEach((h, i) => {
    tablePage.drawText(h, { x: colXExtended[i], y, size: 10, font: fontBold })
  })
  y -= 14

  for (const row of hoursArray) {
    const actividad = row.actividad_detalle?.titulo ?? row.actividad_detalle?.tipo ?? ''
    const becario = row.becario_nombre ?? row.becario ?? row.becario_nombre ?? ''
    const becarioId = row.becario ?? row.user_id ?? row.user ?? null
    const becarioSexo = becarioId && usersMap[becarioId] ? (usersMap[becarioId].sexo ?? '') : ''
    const horasVal = String(row.horas_reportadas ?? row.horas ?? row.hours ?? '')
    const fecha = row.fecha_registro ? new Date(row.fecha_registro).toLocaleDateString('es-ES') : (row.date ?? '')
    const estado = row.estado_aprobacion ?? row.estado ?? ''

    const vals = [String(row.id ?? ''), String(becario), String(becarioSexo), String(actividad), horasVal, String(fecha), String(estado)]
    for (let i = 0; i < vals.length; i++) {
      tablePage.drawText(vals[i], { x: colXExtended[i], y, size: 9, font })
    }
    y -= 14
    if (y < 60) {
      // new page for table continuation
      const np = pdfDoc.addPage([595.28, 841.89])
      y = np.getSize().height - 50
      // draw headers again
      headers.forEach((h, i) => {
        np.drawText(h, { x: colXExtended[i], y, size: 10, font: fontBold })
      })
      y -= 14
      tablePage = np
    }
  }

  const pdfBytes = await pdfDoc.save()

  return new Response(pdfBytes as any, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="informe.pdf"',
    },
  })
}

