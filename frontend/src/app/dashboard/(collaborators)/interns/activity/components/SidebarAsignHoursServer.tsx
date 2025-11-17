import SidebarAsignHours from './SidebarAsignHours'
import { createRegistroHoras, getActivityById } from '@/server/activities'

interface Props {
  id?: string
}

export default async function SidebarAsignHoursServer({ id }: Props) {
  // server action that will be serialized and callable from the client component
  async function handleCreate(data: any) {
    'use server'
    // delegate to server helper which will attach the session token
    await createRegistroHoras(data)
  }

  let maxHours: number | undefined
  if (id) {
    const res: any = await getActivityById(Number(id))
    if (!res.error && res.data) {
      const parsed = Number(res.data.duracion_horas as any)
      maxHours = Number.isFinite(parsed) ? parsed : undefined
    }
  }

  return <SidebarAsignHours id={id} onCreate={handleCreate} maxHours={maxHours} />
}
