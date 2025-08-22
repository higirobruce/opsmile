import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Key, LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import SelectComponent from "../../components/select-component";
import RadioButtons from "../../components/radio-group";
import FileUpload from "../../components/file-upload";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { useAuth } from "@/app/context/AuthContext";
import { set } from "date-fns";

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export interface UploadedFile {
  name: string;
  base64Url: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function SurgeryInputSheet({
  patientData,
  refresh,
}: React.ComponentProps<any>) {
  const { token, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [pastAnesteticHistoryBool, setPastMedicalHistoryBool] =
    useState<string>("No");
  const [pastAnesteticHistory, setPastMedicalHistory] = useState<string>("");
  const [knownComplicationsBool, setKnownComplicationsBool] =
    useState<string>("No");
  const [knownComplications, setKnownComplications] = useState<string>("");
  const [asaScore, setASAScore] = useState("");
  const [decision, setDecision] = useState("");
  const [typeAnesthesia, setTypeAnesthesia] = useState("");
  const [anesthesiaPlan, setAnesthesiaPlan] = useState("");

  const [files, setFiles] = useState<FileWithPreview[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [surgeons, setSurgeons] = useState<any[]>([]);
  const [selectedSurgeon, setSelectedSurgeon] = useState<string>("");
  const [selectedAnesthesiologist, setSelectedAnesthesiologist] =
    useState<string>("");
  const [anesthesiologists, setAnesthesiologists] = useState<any[]>([]);

  useEffect(() => {
    fetchSurgeons();
    fetchAnesthesiologists();
  }, [patientData]);

  const fetchSurgeons = async () => {
    try {
      const response = await fetch(`${API_URL}/users/role/surgeon`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setSurgeons(data);
      if (!response.ok) {
        toast.error(data.message || "Error fetching surgeons");
        return;
      }
      return data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch surgeons");
    }
  };

  const fetchAnesthesiologists = async () => {
    try {
      const response = await fetch(`${API_URL}/users/role/anesthesiologist`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setAnesthesiologists(data);
      if (!response.ok) {
        toast.error(data.message || "Error fetching anesthesiologists");
        return;
      }
      return data;
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch anesthesiologists");
    }
  };

  const handleFileUpload = async (files: FileWithPreview[]) => {
    try {
      const filePromises = files.map(async (file) => {
        const base64Url = await fileToBase64(file.file as File);
        return {
          name: file.file.name,
          base64Url,
        };
      });

      const processedFiles = await Promise.all(filePromises);
      setUploadedFiles((prev) => [...prev, ...processedFiles]);
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("Error processing files");
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/anesthesia`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: patientData?._id,
          hasPastAnestheticHistory: pastAnesteticHistoryBool === "Yes",
          pastAnestheticNotes: pastAnesteticHistory,
          hasKnownComplications: knownComplicationsBool === "Yes",
          knownComplicationsNotes: knownComplications,
          asaScore: asaScore,
          anesthesiaType: typeAnesthesia,
          anesthesiaPlan: anesthesiaPlan,
          surgical_decision: decision,
          reviewedBy: user?.id,
          consentFileUrl: uploadedFiles,
          doneById: user?.id, // Array of {name, base64Url}
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error saving anesthesia record");
        return;
      }

      toast.success("Anesthesia record saved successfully");
      refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error saving anesthesia record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <div>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Add new surgery record
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Capture surgery info</SheetTitle>
            <SheetDescription>
              Enter the required information for the surgery input sheet.
            </SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4 overflow-scroll">
            <div>
              <Label>Sergeon</Label>
              <SelectComponent
                name="selectedSurgeon"
                _setValue={setSelectedSurgeon}
                value={selectedSurgeon}
                label=""
                options={
                  surgeons?.map((surgeon) => ({
                    key: surgeon._id,
                    value: surgeon._id,
                    label: surgeon.firstName + " " + surgeon.lastName,
                  })) || []
                }
              ></SelectComponent>
            </div>

            <div>
              <Label>Anesthesiologist</Label>
              <SelectComponent
                name="selectedAnesthesiologist"
                _setValue={setSelectedAnesthesiologist}
                value={selectedAnesthesiologist}
                label=""
                options={anesthesiologists?.map((anesthesiologist) => ({
                  key: anesthesiologist._id,
                  value: anesthesiologist._id,
                  label:
                    anesthesiologist.firstName +
                    " " +
                    anesthesiologist.lastName,
                }))}
              ></SelectComponent>
            </div>

            <div>
              <Label>Surgery Type</Label>
              <SelectComponent
                name="typeAnesthesia"
                _setValue={setTypeAnesthesia}
                value={typeAnesthesia}
                label=""
                options={[
                  { value: "GENERAL", label: "General" },
                  { value: "REGIONAL", label: "Regional" },
                  { value: "LOCAL", label: "Local" },
                ]}
              ></SelectComponent>
            </div>

            <div>
              <Label>Consent Upload</Label>
              <FileUpload
                bucketName="consents"
                onUploadComplete={(files: FileWithPreview[]) =>
                  handleFileUpload(files)
                }
              />
            </div>
          </div>
          <SheetFooter>
            <Button onClick={handleSubmit} type="submit" disabled={submitting}>
              {submitting && (
                <LoaderCircleIcon
                  className="-ms-1 animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              )}
              Save
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
