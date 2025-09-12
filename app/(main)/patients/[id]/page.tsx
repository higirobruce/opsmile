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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Patient() {
  const params = useParams();
  const id = params.id;
  const [patient, setPatient] = useState<any>({});
  const [fetching, setFetching] = useState(true);
  const { token } = useAuth();

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

  useEffect(() => {
    fetchPatientData();
  }, [id, fetchPatientData]);


  return (
    <div className="flex flex-col space-y-5">
      {patient?._id && (
        <>
          <Toaster />
          <div className="flex flex-row justify-between">
            {/* Back button */}
            <Button onClick={() => window.history.back()} variant="outline" className="mr-2 place-self-start">
              <ArrowLeft />
              Back
            </Button>
            <div className="self-end md:w-1/3">
              <SmallSearchInput setShowModal={(show) => {}} />
            </div>
          </div>
          <div className="w-full">
            <PatientTabs patientData={patient} refresh={fetchPatientData} />
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
        <div className="flex items-center justify-center h-96">
          <div role="status" className="animate-pulse">
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
            <div className="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700"></div>
            <div className="flex items-center justify-center mt-4">
              <svg
                className="w-8 h-8 text-gray-200 dark:text-gray-700 me-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
              <div className="w-40 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3"></div>
              <div className="w-40 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3"></div>
              <div className="w-40 h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 me-3"></div>
              <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            </div>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}