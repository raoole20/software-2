import SidebarAsignHours from './SidebarAsignHours'
import { createRegistroHoras, RegistroHorasDTO } from '@/server/activities'

interface Props {
  id?: string
}

export default function SidebarAsignHoursServer({ id }: Props) {
  // server action that will be serialized and callable from the client component
  async function handleCreate(data: RegistroHorasDTO) {
    'use server'
    // delegate to server helper which will attach the session token
    await createRegistroHoras(data)
  }

  return <SidebarAsignHours id={id} onCreate={handleCreate} />
}
