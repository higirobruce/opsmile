'use client'
import React, { useState } from 'react'
import SearchInput from '../components/searchInput'
import SmallSearchInput from '../components/small-search-input'
import ComplextTable from './components/complex-table'
import PatientTabs from './components/patient-tabs'
import PatientSnapshot from './components/patientSnapshot'

export default function Patients() {
  const [patientData, setPatientData] = useState<any>([])
  return (
    <>
      <SearchInput setPatientData={(data) => setPatientData(data)} />
      {/* {
        patientData?.length ==0 && (<div>
          <ComplextTable />
        </div>)
      } */}
      
      {
        patientData?.length>=1 && (
          <div className='flex flex-col space-y-2'>
            {patientData?.map((patient: any, index: number) => <PatientSnapshot isHeaderSection={false} key={index} patientData={patient} />)}
          </div>
        )
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
              <PatientTabs patientData={patientData} refresh={()=>{}} />
            </div>


          </>
        )}
      </div>
    </>
  )
}
