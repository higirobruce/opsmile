'use client'
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Program, ProgramEditSheet } from '../components/program-edit-sheet';
import { useAuth } from '@/app/context/AuthContext';
import ProgramDetailsPage from '../components/program-detail-page';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, Edit2Icon } from 'lucide-react';
import { ProgramSkeleton } from '../components/program-skeleton';


export default function ProgramPage() {
  const params = useParams();
  const id = params.id;
  const [program, setProgram] = useState<Program>()
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  let router = useRouter()

  useEffect(() => {
    getProgramDetail()
  }, [id, token])

  function getProgramDetail() {
    setLoading(true)
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    fetch(`${API_URL}/programs/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(response => response.json())
      .then(data => {
        setProgram(data)
        setLoading(false)
      })
  }


  return (
    <>
      <div className='flex flex-col space-y-5'>

        {program && !loading && <div>

          <div className='w-full flex flex-row items-center justify-between'>
            <Button variant="link" onClick={() => router.back()}>
              <ArrowLeftIcon className="mr-2" size={16} aria-hidden="true" />
              Back
            </Button>
            <div className=''>
              <ProgramEditSheet program={program} onSave={() => { }} children={
                <Button variant="outline">
                  <Edit2Icon className="" size={10} aria-hidden="true" />
                  Edit
                </Button>
              } />
            </div>
          </div>

          <div className='w-full'>
            <ProgramDetailsPage program={program} />
          </div>
        </div>}


        <div className='flex flex-col space-y-5'>
          {loading && (
            <ProgramSkeleton />
          )}
        </div>

      </div>
    </>
  )
}
