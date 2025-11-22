'use client'
import React, { useEffect, useState, useCallback } from 'react'
import ProgramSearchInput from '../components/program-searchInput'
import ProgramsTable from './components/programs-table'
import { TableSkeleton } from '../components/table-skeleton'
import { useAuth } from '@/app/context/AuthContext'

export default function Programs() {
  const [programs, setPrograms] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const { user, loading: loadingUser } = useAuth()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  return (
    <>
      {user?.role !== 'admin' && user?.role !== 'coordinator' && <div className='flex flex-col space-y-5 mx-auto justify-center items-center h-[80vh]'>
        <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight text-center">
         ✋🏽 Unauthorized 
        </h1>
      </div>}


      {(user?.role == 'admin' || user?.role == 'coordinator') && <div className='flex flex-col space-y-5'>
        <ProgramSearchInput
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setTotalPages={setTotalPages}
          setData={(data) => setPrograms(data)}
          setLoading={setLoading}
          setTotalCount={setTotalCount}

        />

        {!loading && programs && <ProgramsTable
          currentPage={currentPage}
          pageSize={pageSize}
          patientData={programs}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
          setTotalPages={setTotalPages}
          totalCount={totalCount}
          totalPages={totalPages}
        />}

        <div className='flex flex-col space-y-5'>
          {loading && (
            <TableSkeleton />
          )}
        </div>
        {/* <ProgramTable programs={programs} onProgramUpdated={fetchPrograms} /> */}
      </div>}
    </>
  )
}
