'use client'
import React, { useEffect, useState, useCallback } from 'react'
import ProgramTable from './components/programTables'
import ProgramCreateSheet from './components/program-create-sheet'
import { useAuth } from '@/app/context/AuthContext'

export default function Programs() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const {token} = useAuth()

  const fetchPrograms = useCallback(async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${API_URL}/programs`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setPrograms(data)
      console.log(data[0])
    } catch (error: any) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchPrograms()
  }, [fetchPrograms])

  if (loading) return <div>Loading programs...</div>

  return (
    <>
      <div className='flex flex-col space-y-5'>
        <div className='flex justify-between items-center'>
          <div className='text-2xl font-bold'>Programs</div>
        <ProgramCreateSheet refreshPrograms={fetchPrograms} />
        </div>
        <ProgramTable programs={programs} onProgramUpdated={fetchPrograms} />
      </div>
    </>
  )
}
