'use client'
import React, { useEffect } from 'react'
import { AppSidebar } from './components/sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }: { children: React.ReactNode }) {

  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full'>
        <SidebarTrigger />
        <div className='px-5 md:px-16 py-5 bg-gray-50 min-h-[100vh]'>
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
