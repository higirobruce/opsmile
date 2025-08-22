import { useState } from "react";

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
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import SelectComponent from "../../components/select-component";
import RadioButtons from "../../components/radio-group";
import FileUpload from "../../components/file-upload";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { useAuth } from "@/app/context/AuthContext";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SelectWithDescription from "../../components/select-wit-desc";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

interface UploadedFile {
  name: string;
  base64Url: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AnesthesiaInputSheet({
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
          doneById: user?.id // Array of {name, base64Url}
        }),
      });

      console.log({
        patientId: patientData?._id,
        pastAnestheticNotes: pastAnesteticHistory,
        knownComplicationsNotes: knownComplications,
        asaScore: asaScore,
        anesthesiaType: typeAnesthesia,
        anesthesiaPlan: anesthesiaPlan,
        consentFileUrl: uploadedFiles, // Array of {name, base64Url}
      })

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
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <div>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Add new anesthesia info
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto ">
          <DialogHeader>
            <DialogTitle>Capture anesthesia info</DialogTitle>
            <DialogDescription>
              Enter the patient's medical assessment
            </DialogDescription>
          </DialogHeader>
          <div className="grid sm:grid-cols-2 flex-1 auto-rows-min gap-6 px-4 overflow-scroll">
            <div>
              <Label>Past Anestetic History</Label>
              <SelectComponent
                name="pastAnesteticHistoryBool"
                _setValue={setPastMedicalHistoryBool}
                value={pastAnesteticHistoryBool}
                label=""
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
              ></SelectComponent>

              {pastAnesteticHistoryBool == "Yes" && (
                <Textarea
                  className="mt-2"
                  onChange={(e) => setPastMedicalHistory(e.target.value)}
                  value={pastAnesteticHistory}
                />
              )}
            </div>

            <div>
              <Label>Known complications</Label>
              <SelectComponent
                name="knownComplicationsBool"
                _setValue={setKnownComplicationsBool}
                value={knownComplicationsBool}
                label=""
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
              ></SelectComponent>

              {knownComplicationsBool == "Yes" && (
                <Textarea
                  className="mt-2"
                  onChange={(e) => setKnownComplications(e.target.value)}
                  value={knownComplications}
                />
              )}
            </div>

            <div>
              {/* <Label>ASA Score</Label> */}

              <SelectWithDescription
                setValue={setASAScore}
                label="ASA Scores"
                options={[
                  {
                    label: "ASA I: Healthy patient",
                    description:
                      "Normal healthy patient with no systemic disease",
                    value: "I",
                  },
                  {
                    label: "ASA II: Mild systemic disease",
                    description: "Does not limit daily activities",
                    value: "II",
                  },
                  {
                    label: "ASA III: Severe systemic disease",
                    description: " Limits activity but is not incapacitating",
                    value: "III",
                  },
                  {
                    label: "ASA IV: Severe systemic disease",
                    description: "Desease that is a constant threat to life",
                    value: "IV",
                  },
                  {
                    label: "ASA V: Moribund patient",
                    description:
                      "Patient is not expected to survive without the operation",
                    value: "V",
                  },
                ]}
              />
              
            </div>

            <div>
              <Label>Type of Anesthesia</Label>
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
              <Label>Decision</Label>
              <SelectComponent
                name="typeAnesthesia"
                _setValue={setDecision}
                value={decision}
                label=""
                options={[
                  { value: "PROCEED", label: "Proceed" },
                  { value: "DEFER", label: "Defer" },
                  { value: "CANCEL", label: "cancel" },
                ]}
              ></SelectComponent>
            </div>

            <div>
              <Label>Anesthesia plan</Label>
              <Textarea
                className="mt-2"
                onChange={(e) => setAnesthesiaPlan(e.target.value)}
                value={anesthesiaPlan}
              />
            </div>

            <div className="mb-4">
              <Label>Consent Upload</Label>
              <FileUpload
                bucketName="consents"
                onUploadComplete={(files: FileWithPreview[]) =>
                  handleFileUpload(files)
                }
              />
            </div>
          </div>
          <DialogFooter className=" px-4 pb-4 sm:justify-start">
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
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
