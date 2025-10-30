import { getSession } from '@/lib';
import Image from 'next/image'
import React from 'react'
import ThemeToggle from '@/components/theme-toggle'

export default async function Navbar() {
    const session = await getSession();

    const user = session?.user ?? null
    const role = (user as any)?.rol ?? null
    const displayName = (user as any)?.username ?? (user as any)?.first_name ?? (user as any)?.email ?? 'Invitado'

    return (
        <nav className="w-full flex items-center justify-between px-4 py-2 bg-card border-b border-border">
            <div className="flex items-center gap-3">
                <img src={'/img/logo/logo.png'} alt="Logo" width={40} height={40} className="rounded" />
                <span className="text-sm font-medium">Admin</span>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <div className="hidden sm:flex flex-col items-end text-right">
                        <span className="text-sm font-medium">{displayName}</span>
                        <span className="text-xs text-muted-foreground">{role === 'administrador' ? 'Administrador' : 'Usuario'}</span>
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">Invitado</div>
                )}
                
               <ThemeToggle />
            </div>
        </nav>
    )
}
