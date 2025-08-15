'use client'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import PatientTabs from '../components/patient-tabs'
import { useState } from 'react'
import SmallSearchInput from '../../components/small-search-input'
import { supabase } from '@/lib/supabase-client'
import { useAuth } from '@/app/context/AuthContext'
import { toast, Toaster } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function Patient() {
  const params = useParams()
  const id = params.id
  const [patient, setPatient] = useState<any>({})
  const { token } = useAuth()

  const fetchPatientData = async () => {
    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Error fetching patient')
        return
      }

      setPatient(data)
    } catch (error) {
      console.error(error)
      toast.error('Failed to fetch patient data')
    }
  }

  useEffect(() => {
    fetchPatientData()
  }, [id])

  const fetchPatientData_supabase = () => {
    supabase.from('patients').select("*, vital_signs (*), medical_assessments (*)").eq('id', id)
      .then(({ data, error }) => {
        if (error) {
          console.log(error)
        }
        setPatient(data?.[0])
      })
  }

  return (

    <div className='flex flex-col space-y-5'>

      {patient?._id && (
        <>
        <Toaster/>
          <div className='flex flex-row justify-center'>
            <div className='self-end md:w-1/3'>
              <SmallSearchInput setShowModal={(show) => { }} />
            </div>
          </div>
          <div className='w-full'>
            <PatientTabs patientData={patient} refresh={fetchPatientData} />
          </div>


        </>
      )}
    </div>
  )
}
