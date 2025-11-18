'use client'
import React, { useState } from 'react'
import SearchInput from '../components/searchInput'
import PatientSnapshot from './components/patientSnapshot'
import SimplePagination from '../components/simple-pagination'
import PatientsTable from './components/patients-table'
import { TableSkeleton } from '../components/table-skeleton'

export default function Patients() {
  const [patientData, setPatientData] = useState<any>([])
  const [loadingPatients, setLoadingPatients] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(10)
  const [pageSize, setPageSize] = useState<number>(5)
  const [totalCount, setTotalCount] = useState<number>(0)
  return (
    <>
      <SearchInput 
      setTotalCount={(count) => setTotalCount(count)} 
      pageSize={pageSize} 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage} 
      setTotalPages={setTotalPages} 
      setLoadingPatients={(loading) => setLoadingPatients(loading)} 
      setPatientData={(data) => setPatientData(data)} />
      {/* {
        patientData?.length ==0 && (<div>
          <ComplextTable />
        </div>)
      } */}
      {/* <div className='self-end mb-5'>
        <SimplePagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div> */}
      {/* {
        patientData?.length >= 1 && !loadingPatients && (
          <div className='flex flex-col space-y-2'>
            {patientData?.map((patient: any, index: number) => <PatientSnapshot isHeaderSection={false} key={index} patientData={patient} />)}
          </div>
        )
      } */}

      {(patientData && !loadingPatients) 
      && <PatientsTable 
        totalCount={totalCount}
        totalPages={totalPages} 
        patientData={patientData} 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        setTotalPages={setTotalPages} 
        setPageSize={setPageSize} 
        pageSize={pageSize} />}

      <div className='flex flex-col space-y-5'>
        {loadingPatients && (
          <TableSkeleton/>
        )}
      </div>
    </>
  )
}
