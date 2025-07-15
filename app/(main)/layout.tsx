import React from 'react'
import { AppSidebar } from './components/sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full'>
        <SidebarTrigger />
        <div className='px-16 py-5 bg-gray-50 min-h-[100vh]'>
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
