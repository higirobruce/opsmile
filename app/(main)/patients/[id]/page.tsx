"use client";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import PatientTabs from "../components/patient-tabs";
import { useState } from "react";
import SmallSearchInput from "../../components/small-search-input";
import { useAuth } from "@/app/context/AuthContext";
import { toast, Toaster } from "sonner";
import { set } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PatientPageSkeleton } from "../components/patient-page-skeleton";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import NewPatientFile from "../components/new-patient-file.modal";
import moment from "moment";
import SimpleStepper from "../components/stepper";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Patient() {
  const params = useParams();
  const id = params.id;
  const [patient, setPatient] = useState<any>({});
  const [fetching, setFetching] = useState(true);
  const { token } = useAuth();
  const [programs, setPrograms] = useState<any[]>([])
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
  const [patientFileId, setPatientFileId] = useState(null)
  const [patientFile, setPatientFile] = useState<any>({})
   const [tab, setTab] = useState<String>("tab-2");

  const fetchPatientData = useCallback(async () => {
    setFetching(true);
    try {
      const response = await fetch(`${API_URL}/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error fetching patient");
        return;
      }

      setPatient(data);
      setFetching(false);
    } catch (error) {
      setFetching(false);
      console.error(error);
      toast.error("Failed to fetch patient data");
    }
  }, [id, token]);

  const fetchPatientFilesData = async () => {
    setFetching(true);
    try {
      const response = await fetch(`${API_URL}/patient-files/${patientFileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error fetching patient file");
        return;
      }
      setPatientFile(data);
      setPatientFileId(data?._id)
      setFetching(false);
    } catch (error) {
      setFetching(false);
      console.error(error);
      toast.error("Failed to fetch patient file data");
    }
  }

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        const data = await response.json()
        // Filter out completed programs
        console.log("programs:", data)
        setPrograms(data.filter((program: any) => program.status !== 'completed'))
      } catch (error) {
        console.error('Error fetching programs:', error)
      }
    }
    fetchPrograms()
    fetchPatientData();
  }, [id, fetchPatientData, token]);


  useEffect(() => {
    if (patientFileId)
      fetchPatientFilesData()
  }, [patientFileId])

  const handleProgramChange = async (programId: string) => {
    setSelectedProgram(programId)
    try {
      let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/${programId}/patients/${patient._id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      let data = await res.json()

      let res2 = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/patients/${patient._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ programId }),
      })

      fetchPatientData()

      toast.success('Patient successfully tagged to program!')
      // alert('Patient successfully tagged to program!')
    } catch (error) {
      console.error('Error tagging patient to program:', error)
      toast.error('Failed to tag patient to program.')
      // alert('Failed to tag patient to program.')
    }
  }


  return (
    <div className="flex flex-col space-y-5">
      {patient?._id && (
        <>
          <Toaster />
          <div className="flex flex-row justify-between">
            {/* Back button */}
            <Button onClick={() => window.history.back()} variant="link" className="mr-2 place-self-start cursor-pointer">
              <ArrowLeft />
              Back
            </Button>
            <div className="self-end flex flex-row justify-between items-center space-x-2">
              <div className='flex flex-row space-x-5 '>
                <NewPatientFile patientId={id} refresh={fetchPatientData} />
              </div>
              <SmallSearchInput setShowModal={(show) => { }} />
            </div>
          </div>
          <div className="w-full">
            <div className="grid grid-cols-4 gap-2 mb-4">
              {patient?.patient_files.map((pFile: any, index: number) => {
                return <Card key={index} onClick={() => setPatientFileId(pFile._id)} className="w-full max-w-sm hover:shadow-2xl hover:bg-gray-100 cursor-pointer">
                  <CardHeader>
                    <CardTitle>
                      {pFile.program?.name}
                    </CardTitle>
                    <CardDescription>
                      {pFile.status}
                    </CardDescription>
                    {/* <SimpleStepper/> */}
                    <p className="text-xs text-foreground/50">{moment(pFile.createdAt).format('YYYY-MMM-DD HH:mm A')}</p>

                  </CardHeader>
                </Card>
              })}
            </div>
            {
              patientFileId && !fetching &&
              <PatientTabs patientFileData={patientFile} refresh={fetchPatientFilesData} currentTab={tab} setCurrentTab={setTab} />
            }
          </div>
        </>
      )}

      {!patient?._id && !fetching && (
        <div className="flex flex-col items-center justify-center h-96">
          <h1 className="text-2xl font-bold">No patient found</h1>
          <p className="text-gray-500">
            Please check the patient ID or search for a patient.
          </p>
        </div>
      )}

      {fetching && (
        <PatientPageSkeleton />
      )}
    </div>
  );
}