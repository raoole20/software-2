import ThemeToggle from '@/components/theme-toggle'
import React from 'react'

export default function AuthNav() {
    return (
        <div className='w-full p-4 flex flex-col-reverse'>
            <div className='flex justify-end gap-2 items-center'>
                <span className='text-sm text-muted-foreground'>mode</span>
                <ThemeToggle />
            </div>
        </div>
    )
}
