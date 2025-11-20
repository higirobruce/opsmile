import { useCallback, useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircleIcon } from "lucide-react";
import SelectComponent from "../../components/select-component";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { SimpletDatePicker } from "@/app/componets/simple-date-picker";
import moment from "moment";
import Select2 from "../../components/select2";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function NewPatientFile({
  appendNewPatient, refresh, patientId }: React.ComponentProps<any>) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [programs, setPrograms] = useState<any[]>([])
  const [patientProgram, setPatientProgram] = useState('')

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${API_URL}/programs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setPrograms(
          data
            .filter((program: any) =>
              (program.status !== 'inactive' && program.status !== 'completed')
              // && moment(program.startDate).isSameOrBefore(moment())
              && moment(program.endDate).isSameOrAfter(moment())
            )
            .map((program: any) => ({ value: program._id, label: program.name })))
      } catch (error) {
        console.error("Failed to fetch programs:", error)
        toast.error("Failed to load programs")
      }
    }
    fetchPrograms()
  }, [])


  const postPatientFile = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/patient-files`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          program: patientProgram,
          patient: patientId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error creating patient file");
        return;
      }

      toast.success("Patient file created successfully");
      refresh();
      setOpen(false);
      setPatientProgram("");

    } catch (error) {
      console.error(error);
      toast.error("Failed to create patient file");
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <>
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>
            Add new Patient File
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto ">
          <DialogHeader>
            <DialogTitle>New Patient file</DialogTitle>
            {/* <DialogDescription>Enter the patients details.</DialogDescription> */}
          </DialogHeader>
          {/* <p className="text-sm font-semibold text-foreground/50">Patient's personal Info</p> */}
          <div className="flex-1 auto-rows-min gap-6 px-4 overflow-scroll">
            <div>
              <SelectComponent
                _setValue={setPatientProgram}
                value={patientProgram}
                name="patientProgram"
                label="Program"
                options={programs}
              />
            </div>
            <div></div>
          </div>


          <DialogFooter className="mt-2 px-4 pb-4 sm:justify-start">
            <Button
              onClick={postPatientFile}
              type="submit"
              disabled={
                !patientProgram
              }
            >
              {submitting && (
                <LoaderCircleIcon
                  className="-ms-1 animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              )}
              Save
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}