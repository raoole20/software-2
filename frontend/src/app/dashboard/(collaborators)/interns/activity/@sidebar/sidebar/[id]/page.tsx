import React from 'react'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import SidebarAsignHours from '@/app/dashboard/(collaborators)/interns/activity/components/SidebarAsignHoursServer'

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params

  return (
    <Sidebar variant="floating" side="right" className="absolute max-h-[80vh] w-96">
      <SidebarHeader>
        <h5 className="text-lg font-semibold">Registrar horas</h5>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Actividad</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarAsignHours id={id} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
