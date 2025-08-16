'use client'
import React, { useState } from 'react'
import SearchInput from '../components/searchInput'
import SmallSearchInput from '../components/small-search-input'
import ComplextTable from './components/complex-table'
import PatientTabs from './components/patient-tabs'
import PatientSnapshot from './components/patientSnapshot'

export default function Patients() {
  const [patientData, setPatientData] = useState<any>([])
  const [loadingPatients, setLoadingPatients] = useState<boolean>(false)
  return (
    <>
      <SearchInput setLoadingPatients={(loading) => setLoadingPatients(loading)}  setPatientData={(data) => setPatientData(data)} />
      {/* {
        patientData?.length ==0 && (<div>
          <ComplextTable />
        </div>)
      } */}
      
      {
        patientData?.length>=1 && !loadingPatients &&(
          <div className='flex flex-col space-y-2'>
            {patientData?.map((patient: any, index: number) => <PatientSnapshot isHeaderSection={false} key={index} patientData={patient} />)}
          </div>
        )
      }

      <div className='flex flex-col space-y-5'>
        {loadingPatients && (
          <div className='flex items-center justify-center h-96'>
            <div role="status" className="animate-pulse">
              <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
              <div className="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700"></div>
              <div className="flex items-center justify-center mt-4">
                <svg className="w-8 h-8 text-gray-200 dark:text-gray-700 me-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
                <div className='w-40 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3'></div>
                <div className='w-40 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3'></div>
                <div className='w-40 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3'></div>
                <div className='w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
                <div className='w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
              </div>
              <div className="flex items-center justify-center mt-4">
                <svg className="w-8 h-8 text-gray-200 dark:text-gray-700 me-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
                <div className='w-40 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3'></div>
                <div className='w-40 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3'></div>
                <div className='w-40 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3'></div>
                <div className='w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>
                <div className='w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700'></div>

                
              </div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
