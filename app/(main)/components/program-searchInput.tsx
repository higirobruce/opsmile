"use client";
import { FormEvent, useCallback, useContext, useEffect, useId, useState } from "react";
import { AtSignIcon, Search, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import NewPatient from "../patients/components/new-patient-modal";
import { useAuth } from "@/app/context/AuthContext";
import ProgramCreateSheet from "../programs/components/program-create-sheet";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
export default function ProgramSearchInput({
  setData: setData,
  setLoading: setLoading,
  setCurrentPage,
  setTotalPages,
  currentPage,
  pageSize,
  setTotalCount,
}: {
  setData: (data:[]) => void;
  setLoading: (loading: boolean) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setTotalCount: (count: number) => void;
  currentPage: number;
  pageSize: number;

}) {
  const id = useId();
  const [search, setSearch] = useState("");
  const router = useRouter();
  const { token } = useAuth();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/programs/search?search=${encodeURIComponent(search)}&page=${currentPage}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data)

      if (!response.ok) {
        toast.error(data.message || "Error fetching patients");
        return;
      }

      setData(data?.programs || []);
      setTotalPages(data?.totalPages || 0);
      setTotalCount(data?.totalCount || 0);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);

      toast.error("Failed to fetch patients");
    }
  }, [currentPage, search, setLoading, setData, setTotalPages, token, pageSize, setTotalCount]);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const handleSearchSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    // You can perform any form-specific logic here before fetching
    console.log('Form submitted, initiating patient fetch.');
    await fetchData(); // Call your fetchPatients function
  };
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center px-4 sm:pt-5 md:pt-10 pb-10 w-full">
        <h1 className="text-2xl md:text-5xl font-extrabold tracking-tight text-center">
          Program List
        </h1>
        {/* <p className="mt-4 text-sm md:text-lg text-center text-muted-foreground max-w-xl">
          Use this page to quickly find a patient Names or phone numbers
        </p> */}

        {/* Search input */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative mt-5 w-full max-w-3xl"
        >
          {/* Icon */}
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 md:h-6 md:w-6 text-muted-foreground" />

          {/* Giant input */}
          <Input
            type="text"
            placeholder="Search using: Name"
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
        <ProgramCreateSheet refreshPrograms={fetchData} />
      </div>
    </div>
  );
}