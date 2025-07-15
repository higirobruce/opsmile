'use client'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import PatientTabs from '../components/patient-tabs'
import { useState } from 'react'
import SmallSearchInput from '../../components/small-search-input'
import { supabase } from '@/lib/supabase-client'

export default function Patient() {
  const params = useParams()
  const id = params.id
  const [patient, setPatient] = useState<any>({})

  useEffect(() => {
    supabase.from('patients').select("*, vital_signs(*)").eq('id', id)
      .then(({ data, error }) => {
        if (error) {
          console.log(error)
        }
        setPatient(data?.[0])
      })
  }, [id])

  const fetchPatientInfo = () => {
    supabase.from('patients').select("*, vital_signs(*)").eq('id', id)
      .then(({ data, error }) => {
        if (error) {
          console.log(error)
        }
        setPatient(data?.[0])
      })
  }

  return (

    <div className='flex flex-col space-y-5'>

      {patient?.id && (
        <>
          <div className='flex flex-row justify-center'>
            <div className='self-end w-1/3'>
              <SmallSearchInput setShowModal={(show) => { }} />
            </div>
          </div>
          <div className='w-full'>
            <PatientTabs patientData={patient} refresh={fetchPatientInfo} />
          </div>


        </>
      )}
    </div>
  )
}
