'use client'
import { useAuth } from '@/app/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowBigLeft, Loader2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import ConfirmPasswordUpdate from './components/confirm-password-update'
import { toast, Toaster } from 'sonner'

export default function Profile() {
    let params = useParams()
    let id = params.id
    const [profile, setProfile] = useState()
    const [loadingProfile, setLoadingProfile] = useState(false)
    const { token, user } = useAuth()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    useEffect(() => {
        fetch(`${API_URL}/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => response.json())
            .then(data => {
                setProfile(data)
                setLoadingProfile(false)
            })

    }, [id])

    function confirm() {
        setSubmitting(true)
        fetch(`${API_URL}/users/${id}/password`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ userId: id, oldPassword: currentPassword, newPassword })
        })
            .then(response => response.json())
            .then(data => {

                
                if (data.error) {
                    toast.error(data.message)
                    setSubmitting(false)
                    console.log(data)
                    throw new Error(`HTTP error! status: ${data.status}`)
                }

                setSubmitting(false)
                toast.success('Password successfully changed!')
            }).catch(err => {

                // toast.error('Failed to change password!')
            })
    }

    return (
        <div className='max-w-6xl mx-auto flex flex-col lg:grid lg:grid-cols-[minmax(0,2.1fr),minmax(0,0.9fr)] gap-6 items-start'>
            <Toaster />
            <div>
                <Button variant='outline'><ArrowBigLeft /> Go back to Dashboard</Button>
            </div>

            <div className='grid grid-cols-3 gap-5'>

                <div className='bg-white rounded p-10 shadow-sm border border-slate-200'>
                    <h1 className="text-sm font-semibold tracking-wide uppercase text-slate-700 mb-5">Overview</h1>
                    <div className='mb-3'>
                        <h2 className='text-sm tracking-normal font-semibold'>Names</h2>
                        <h2 className='text-sm tracking-normal'>{user?.firstName} {user?.lastName}</h2>
                    </div>

                    <div className='mb-3'>
                        <h2 className='text-sm tracking-normal font-semibold'>Role</h2>
                        <h2 className='text-sm tracking-normal'>{user?.role}</h2>
                    </div>
                </div>


                <div className='bg-white rounded p-10 col-span-2 shadow-sm border border-slate-200'>
                    <h1 className="text-sm font-semibold tracking-wide uppercase text-slate-700">Change password</h1>
                    <div className='mx-auto items-center flex flex-col space-y-4 w-full'>
                        <div className='w-full'>
                            <Label>Current password</Label>
                            <Input placeholder='Current password' type='password' value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                        </div>

                        <div className='w-full'>
                            <Label>New password</Label>
                            <Input placeholder='New password' type='password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                        </div>

                        <div className='w-full'>
                            <Label>Confirm password</Label>
                            <Input placeholder='Confirm password' type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                        </div>

                        <div className='w-full'>
                            {!submitting && <ConfirmPasswordUpdate disabled={newPassword !== confirmPassword || !currentPassword || !newPassword || !confirmPassword} confirm={confirm} />}
                            {submitting && <Loader2 className='animate-spin' />}
                        </div>
                    </div>
                </div>

            </div>


        </div>
    )
}
