'use client'
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs'
import { TabsList } from '@radix-ui/react-tabs'
import React, { useMemo } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function TabAuth({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() || ''
    const router = useRouter()

    const active = useMemo(() => {
        if (pathname.endsWith('/register')) return 'register'
        // default to login for /auth, /auth/login, or others
        return 'login'
    }, [pathname])

    return (
        <div>
            <Tabs value={active} onValueChange={(v) => {
                if (v === 'login') router.push('/auth/login')
                else if (v === 'register') router.push('/auth/register')
            }} className="w-[400px]">
                <TabsList className='w-full mb-4'>
                    <TabsTrigger value="login">Login</TabsTrigger>
                </TabsList>
                <TabsContent value="login">{active === 'login' ? children : null}</TabsContent>
            </Tabs>
        </div>
    )
}
