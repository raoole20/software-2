import React from "react"

import AdminSidebar from "@/components/admin/sidebar/admin-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getSession } from "@/lib"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const roleLabel = session?.user?.rol
    ? session.user.rol === "administrador"
      ? "Administrador"
      : session.user.rol.charAt(0).toUpperCase() + session.user.rol.slice(1).toLowerCase()
    : "Invitado"

  return (
    <SidebarProvider>
      <AdminSidebar user={session?.user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm font-medium text-muted-foreground">
              Panel de control
            </span>
          </div>
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {roleLabel}
          </span>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
