'use client'
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Program } from '../components/program-edit-sheet';
import { useAuth } from '@/app/context/AuthContext';
import ProgramDetailsPage from '../components/program-detail-page';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';


export default function ProgramPage() {
  const params = useParams();
  const id = params.id;
  const [program, setProgram] = useState<Program>()
  const { token } = useAuth()
  let router  = useRouter()

  useEffect(() => {
    getProgramDetail()
  }, [id, token])

  function getProgramDetail() {
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
        console.log('------------',data)
        setProgram(data)
      })
  }


  return (
    <>
      <div className='flex flex-col space-y-5'>

        {program && <div>
          <Button variant="link" onClick={() => router.back()}>
            <ArrowLeftIcon className="mr-2" size={16} aria-hidden="true" />
            Back</Button>
          <ProgramDetailsPage program={program} />
          </div>}

      </div>
    </>
  )
}
