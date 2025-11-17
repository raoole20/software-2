import { NextResponse } from 'next/server'
import { getAllUsers } from '@/server/users'
import { getAllPendingHours } from '@/server/activities'

function escapeCsv(s: any) {
  if (s === null || s === undefined) return ''
  const str = String(s)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"'
  }
  return str
}

export async function GET() {
  const users = await getAllUsers()
  const hoursResp = await getAllPendingHours()
  const hours = Array.isArray(hoursResp) ? hoursResp : (hoursResp && (hoursResp as any).data) ? (hoursResp as any).data : []

  let csv = ''
  csv += 'section,id,name,email,sexo,user_id,hours,date,activity_type,estado_aprobacion\n'

  const usersArray = Array.isArray(users) ? users : (users && (users as any).data) ? (users as any).data : []
  // map users by id for lookups
  const usersMap: Record<string | number, any> = {}
  for (const u of usersArray) {
    usersMap[(u as any).id] = u
    const name = (u as any).first_name || (u as any).name || (u as any).username || ''
    csv += ['users', escapeCsv((u as any).id), escapeCsv(name), escapeCsv((u as any).email), escapeCsv((u as any).sexo ?? ''), '', '', '', '', ''].join(',') + '\n'
  }

  for (const h of hours) {
    const becarioId = (h as any).becario ?? (h as any).user_id ?? (h as any).user ?? ''
    const becarioSexo = usersMap[becarioId] ? (usersMap[becarioId].sexo ?? '') : ''
    const horasVal = (h as any).horas_reportadas ?? (h as any).horas ?? (h as any).hours ?? ''
    csv += [
      'pending_hour',
      escapeCsv((h as any).id ?? ''),
      '',
      '',
      escapeCsv(becarioId ?? ''),
      escapeCsv(horasVal ?? ''),
      escapeCsv((h as any).fecha_registro ?? (h as any).date ?? ''),
      escapeCsv((h as any).actividad_detalle?.titulo ?? (h as any).activity_type ?? ''),
      escapeCsv((h as any).estado_aprobacion ?? ''),
      escapeCsv(becarioSexo),
    ].join(',') + '\n'
  }

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="informe.csv"',
    },
  })
}
