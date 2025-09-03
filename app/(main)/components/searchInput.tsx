"use client";
import { FormEvent, useContext, useEffect, useId, useState } from "react";
import { AtSignIcon, Search, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import NewPatient from "../patients/components/new-patient-modal";
import { useAuth } from "@/app/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
export default function SearchInput({
  setPatientData,
  setLoadingPatients,
  setCurrentPage,
  setTotalPages,
  currentPage
}: {
  setPatientData: (patientId: null | {}) => void;
  setLoadingPatients: (loading: boolean) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  currentPage: number;
}) {
  const id = useId();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { token } = useAuth();

  useEffect(() => {
    fetchPatients();
  }, [currentPage,]);

  const fetchPatients = async () => {

    setLoadingPatients(true);
    try {
      const response = await fetch(
        `${API_URL}/patients/search?search=${encodeURIComponent(search)}&page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error fetching patients");
        return;
      }

      setPatientData(data?.patients || {});
      setTotalPages(data?.totalPages || 0);
      setLoadingPatients(false);
    } catch (error) {
      console.error(error);
      setLoadingPatients(false);

      toast.error("Failed to fetch patients");
    }
  };
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center px-4 sm:pt-5 md:pt-10 pb-10 w-full">
        <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight text-center">
          Patient List
        </h1>
        {/* <p className="mt-4 text-sm md:text-lg text-center text-muted-foreground max-w-xl">
          Use this page to quickly find a patient Names or phone numbers
        </p> */}

        {/* Search input */}
        <form
          onSubmit={fetchPatients}
          className="relative mt-5 w-full max-w-3xl"
        >
          {/* Icon */}
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-6 md:w-6 text-muted-foreground" />

          {/* Giant input */}
          <Input
            type="text"
            placeholder="Search using: Patient ID, Name, or Phone Number"
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
        <NewPatient />
      </div>
    </div>
  );
}
