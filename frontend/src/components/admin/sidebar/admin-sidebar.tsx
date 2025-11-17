"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { User } from "next-auth"
import { signOut } from "next-auth/react"
import {
  CalendarClock,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

type DashboardSection = {
  title: string
  icon: LucideIcon
  items: Array<{
    title: string
    href: string
  }>
}

type AdminSidebarProps = {
  user?: User | null
}

const adminNavigation: DashboardSection[] = [
  {
    title: "Vision general",
    icon: LayoutDashboard,
    items: [
      {
        title: "Resumen",
        href: "/dashboard/admin/overview",
      },
      {
        title: "Mi perfil",
        href: "/dashboard/admin/profile",
      },
    ],
  },
  {
    title: "Internos",
    icon: Users,
    items: [
      {
        title: "Listado",
        href: "/dashboard/admin/interns",
      },
      {
        title: "Nuevo interno",
        href: "/dashboard/admin/interns/new",
      },
    ],
  },
  {
    title: "Actividades",
    icon: CalendarClock,
    items: [
      {
        title: "Listado",
        href: "/dashboard/admin/activity",
      },
      {
        title: "Crear actividad",
        href: "/dashboard/admin/activity/create",
      },
      {
        title: "Listado de horas Pendientes",
        href: "/dashboard/admin/activity/hours", 
      },
      {
        title: "Listado de horas",
        href: "/dashboard/admin/activity/hours/list",
      }
    ],
  }, 
  {
    title: "Información",
    icon: CalendarClock,
    items: [
      {
        title: "Nosotros",
        href: "/dashboard/admin/nosotros",
      },
      {
        title: "Contactos",
        href: "/dashboard/admin/contactos",
      }
    ],
  },
]

const collaboratorNavigation: DashboardSection[] = [
  {
    title: "Internos",
    icon: Users,
    items: [
      {
        title: "Resumen",
        href: "/dashboard/interns/overview",
      },
      {
        title: "Mi perfil",
        href: "/dashboard/interns/profile",
      },
    ],
  },
  {
    title: "Actividades",
    icon: CalendarClock,
    items: [
      {
        title: "Listado",
        href: "/dashboard/interns/activity",
      },
      {
        title: "Asignar horas",
        href: "/dashboard/interns/activity/assign",
      }
    ],
  }
]

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const role = user?.rol
  const navigation = role === "administrador" ? adminNavigation : collaboratorNavigation
  const groupLabel = role === "administrador" ? "Panel administrativo" : "Panel de colaboradores"

  const displayName = getDisplayName(user)
  const email = user?.email ?? ""
  const roleLabel = formatRole(role)
  const initials = getInitials(displayName, email)

  const [accountMenuOpen, setAccountMenuOpen] = React.useState(false)

  const handleSignOut = React.useCallback(() => {
    void signOut({ callbackUrl: "/auth/login" })
  }, [])

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-md px-2 py-1.5"
        >
          <img
            src="/img/logo/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="size-8 rounded"
          />
          <span className="text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            Fundacion JB Opportunity
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{groupLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((section) => (
                <NavSection key={section.title} section={section} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <DropdownMenu open={accountMenuOpen} onOpenChange={setAccountMenuOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              variant="outline"
              size="lg"
              className="gap-3"
              data-state={accountMenuOpen ? "open" : "closed"}
            >
              <Avatar className="size-9">
                <AvatarImage src={user?.image ?? undefined} alt={displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 text-left group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-medium">{displayName}</p>
                <p className="truncate text-xs text-muted-foreground">{roleLabel}</p>
              </div>
              <ChevronRight
                className={cn(
                  "ml-auto size-4 text-muted-foreground transition-transform group-data-[collapsible=icon]:hidden",
                  accountMenuOpen && "rotate-90"
                )}
              />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-60">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{displayName}</span>
                {email ? (
                  <span className="text-xs text-muted-foreground">{email}</span>
                ) : null}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleSignOut} variant="destructive">
              <LogOut className="size-4" />
              Cerrar sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function NavSection({
  section,
  pathname,
}: {
  section: DashboardSection
  pathname: string
}) {
  const isActive = React.useMemo(
    () => section.items.some((item) => isPathActive(item.href, pathname)),
    [section.items, pathname]
  )
  const [open, setOpen] = React.useState(isActive)

  React.useEffect(() => {
    if (isActive) {
      setOpen(true)
    }
  }, [isActive])

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        type="button"
        className="group"
        isActive={isActive}
        onClick={() => setOpen((prev) => !prev)}
        data-state={open ? "open" : "closed"}
      >
        <section.icon className="size-4" />
        <span className="flex-1">{section.title}</span>
        <ChevronRight
          className={cn(
            "ml-auto size-4 text-muted-foreground transition-transform group-data-[collapsible=icon]:hidden",
            open && "rotate-90"
          )}
        />
      </SidebarMenuButton>
      {open ? (
        <SidebarMenuSub>
          {section.items.map((item) => {
            const itemActive = isPathActive(item.href, pathname)
            return (
              <SidebarMenuSubItem key={item.href}>
                <SidebarMenuSubButton asChild isActive={itemActive}>
                  <Link href={item.href}>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )
          })}
        </SidebarMenuSub>
      ) : null}
    </SidebarMenuItem>
  )
}

function isPathActive(href: string, pathname: string) {
  const normalizedHref = href.replace(/\/$/, "")
  const normalizedPath = pathname.replace(/\/$/, "")
  return (
    normalizedPath === normalizedHref || normalizedPath.startsWith(`${normalizedHref}/`)
  )
}

function getDisplayName(user?: User | null) {
  if (!user) {
    return "Invitado"
  }

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ")
  return (
    fullName ||
    user.username ||
    user.name ||
    user.email ||
    "Invitado"
  )
}

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.trim() || ""
  if (!source) {
    return "?"
  }

  const matches = source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .filter(Boolean)

  if (matches.length === 0 && email) {
    return email[0]?.toUpperCase() ?? "?"
  }

  return matches.join("") || "?"
}

function formatRole(role?: string | null) {
  if (!role) {
    return "Invitado"
  }

  if (role.toLowerCase() === "administrador") {
    return "Administrador"
  }

  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
}
