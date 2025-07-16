'use client'
import { FormEvent, useContext, useId, useState } from "react"
import { AtSignIcon, Search, SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast, Toaster } from "sonner"
import { useRouter } from "next/navigation"
import NewPatient from "../patients/components/new-patient-modal"
import { supabase } from "@/lib/supabase-client"

export default function SearchInput(
  { setPatientData }: { setPatientData: (patientId: null | {}) => void }
) {
  const id = useId()
  const [search, setSearch] = useState('')
  const router = useRouter();
  const fetchPatients = async (e: FormEvent) => {
    e.preventDefault()
    // if (search) {
    //   const response = await fetch('http://localhost:9999/patients/search/' + search)
    //   const data = await response.json()

    //   if (response.status != 200 || data?.length == 0) {
    //     setPatientData(null)
    //     toast.error("Patient not found!", {
    //       description: "Please check well the provided info!",
    //       // action: {
    //       //   label: "Undo",
    //       //   onClick: () => console.log("Undo"),
    //       // },
    //     })
    //   }

    //   setPatientData(data)
    //   // router.push('/patient/'+ data.id)
    // } else {
    //   setPatientData([])
    // }

    const { data, error } = await supabase
      .from('patients')
      .select(`*, vital_signs (*)`)
      .or(`firstName.ilike.%${search}%,phoneNumber.ilike.%${search}%,lastName.ilike.%${search}%`)
    // .contains('firstName', search)
    // .or(`phone_number.contains.${search}`)

    if (error) {
      console.log(error)
      toast.error(error.message)
    }

    console.log(data)

    if (data) {
      setPatientData(data)
    }
  }
  return (
    <div className='flex justify-center'>
      <div className="flex flex-col justify-center items-center px-4 sm:pt-5 md:pt-20 pb-10 w-full">
        <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight text-center">
          Search Patient
        </h1>
        <p className="mt-4 text-sm md:text-lg text-center text-muted-foreground max-w-xl">
          Use this page to quickly find a patient Names or phone numbers
        </p>

        {/* Search input */}
        <form
          onSubmit={fetchPatients}
          className="relative mt-12 w-full max-w-3xl"
        >
          {/* Icon */}
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-6 md:w-6 text-muted-foreground" />

          {/* Giant input */}
          <Input
            type="text"
            placeholder="Enter Names or phone number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="h-12 w-full rounded-2xl pl-10 pr-28 md:pl-16 text-sm md:text-md tracking-wide"
          />

          {/* Optional “Go” button */}
          <Button
            type="submit"
            size="lg"
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            Go
          </Button>

          <Toaster />
        </form>
        <p className="py-1 md:py-5">or</p>
        <NewPatient  />
      </div>
    </div>
  )
}
