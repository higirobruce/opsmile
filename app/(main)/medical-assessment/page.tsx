'use client'
import React, { useState } from 'react'
import SearchInput from '../components/searchInput'
import SmallSearchInput from '../components/small-search-input'
import PatientTabs from './components/medical-assessment-tabs'

export default function NursingAssess() {
  const [patientData, setPatientData] = useState<any>(null)
  return (
    <>
      {
        !patientData?._id && (<div>
          <SearchInput setLoadingPatients={(loading) => { }} setPatientData={(data) => setPatientData(data)} />
        </div>)
      }
      <div className='flex flex-col space-y-5'>

        {patientData?._id && (
          <>
            <div className='flex flex-row justify-center'>
              <div className='self-end w-1/3'>
                <SmallSearchInput setShowModal={(show) => setPatientData(false)} />
              </div>
            </div>
            <div className='w-full'>
              <PatientTabs patientData={patientData} />
            </div>

            
          </>
        )}
      </div>
    </>
  )
}
