import React from 'react'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import Menu from '@/app/componets/menu'

export default function layout({ children }: { children: React.ReactNode }) {
    return (

        <main className='w-full'>
            <Menu />
            <div className='p-10'>
                {children}
            </div>
        </main>
    )
}
