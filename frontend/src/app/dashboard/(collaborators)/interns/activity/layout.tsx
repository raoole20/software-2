import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'

export default function Layout({ children, sidebar }: { children: React.ReactNode, sidebar: React.ReactNode }) {
  return (
    <section className='relative'>
      <SidebarProvider className='relative'>
        {children}
        {sidebar}
      </SidebarProvider>
    </section>
  )
}
