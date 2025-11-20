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
import { Input } from "@/components/ui/input";

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
  const [pastAnestheticHistory, setPastAnestheticHistory] = useState<string>("");
  const [asaScore, setAsaScore] = useState("");
  const [mallampatiScore, setMallampatiScore] = useState("");
  const [anesthesiaType, setAnesthesiaType] = useState("");
  const [proposedPlan, setProposedPlan] = useState<string>('')
  const [clearedForAnesthesiaBool, setClearedForAnesthesiaBool] = useState<string>('')
  const [preanesthesiaChecklistDone, setPreanesthesiaChecklistDone] = useState<boolean>(false);
  const [surgicalSafetyChecklistDone, setSurgicalSafetyChecklistDone] = useState<boolean>(false);
  const [medications, setMedications] = useState<{ name: string, dosage: string }[]>([]);

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
          pastAnestheticHistory,
          proposedPlan,
          consentFileUrl: uploadedFiles,
          clearedForAnesthesiaBool: clearedForAnesthesiaBool == 'Yes' ? true : false,
          doneById: user?.id,
          anesthesiaType,
          asaScore,
          mallampatiScore,
          preanesthesiaChecklistDone,
          surgicalSafetyChecklistDone,
          medications,
          
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
            {/* <DialogDescription>
              Enter the patient's medical assessment
            </DialogDescription> */}
          </DialogHeader>
          <div className="grid sm:grid-cols-2 flex-1 auto-rows-min gap-6 px-4 overflow-scroll">
            <div>
              <Label>Anesthesia History</Label>
              <Textarea
                className="mt-2"
                onChange={(e) => setPastAnestheticHistory(e.target.value)}
                value={pastAnestheticHistory}
              />
            </div>

            <div>
              <Label>Proposed plan</Label>
              <Textarea
                className="mt-2"
                onChange={(e) => setProposedPlan(e.target.value)}
                value={proposedPlan}
              />
            </div>

            <div>
              <Label>Cleared for Anesthesia</Label>
              <SelectComponent
                name="clearedForAnesthesiaBool"
                _setValue={setClearedForAnesthesiaBool}
                value={clearedForAnesthesiaBool}
                label=""
                options={[
                  { value: "Yes", label: "Yes" },
                  { value: "No", label: "No" },
                ]}
              ></SelectComponent>
            </div>
            <div>
              <Label>Anesthesia Type</Label>
              <SelectComponent
                name="anesthesiaType"
                _setValue={setAnesthesiaType}
                value={anesthesiaType}
                label=""
                options={[
                  { value: "GENERAL", label: "General" },
                  { value: "REGIONAL", label: "Regional" },
                  { value: "LOCAL", label: "Local" },
                ]}
              ></SelectComponent>
            </div>
            <div>
              <Label>ASA Score</Label>
              <SelectComponent
                name="asaScore"
                _setValue={setAsaScore}
                value={asaScore}
                label=""
                options={[
                  { value: "I", label: "I" },
                  { value: "II", label: "II" },
                  { value: "III", label: "III" },
                  { value: "IV", label: "IV" },
                  { value: "V", label: "V" },
                  { value: "VI", label: "VI" },
                ]}
              ></SelectComponent>
            </div>
            <div>
              <Label>Mallampati Score</Label>
              <SelectComponent
                name="mallampatiScore"
                _setValue={setMallampatiScore}
                value={mallampatiScore}
                label=""
                options={[
                  { value: "I", label: "I" },
                  { value: "II", label: "II" },
                  { value: "III", label: "III" },
                  { value: "IV", label: "IV" },
                ]}
              ></SelectComponent>
            </div>
            <div className="flex items-center space-x-2">
              <Input type="checkbox" id="preanesthesiaChecklistDone" checked={preanesthesiaChecklistDone} onChange={(e) => setPreanesthesiaChecklistDone(e.target.checked)} />
              <Label htmlFor="preanesthesiaChecklistDone">Preanesthesia Checklist Done</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Input type="checkbox" id="surgicalSafetyChecklistDone" checked={surgicalSafetyChecklistDone} onChange={(e) => setSurgicalSafetyChecklistDone(e.target.checked)} />
              <Label htmlFor="surgicalSafetyChecklistDone">Surgical Safety Checklist Done</Label>
            </div>
            <div>
              <Label>Medications</Label>
              {medications.map((med, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    placeholder="Name" 
                    value={med.name}
                    onChange={(e) => {
                      const newMeds = [...medications];
                      newMeds[index].name = e.target.value;
                      setMedications(newMeds);
                    }}
                  />
                  <Input
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) => {
                      const newMeds = [...medications];
                      newMeds[index].dosage = e.target.value;
                      setMedications(newMeds);
                    }}
                  />
                  <Button variant="outline" onClick={() => setMedications(medications.filter((_, i) => i !== index))}>Remove</Button>
                </div>
              ))}
              <Button variant="outline" className="mt-2" onClick={() => setMedications([...medications, { name: '', dosage: '' }])}>Add Medication</Button>
            </div>


            <div className="mb-4">
              <Label>Anesthesia Consent Upload</Label>
              <FileUpload
                bucketName="consents"
                onUploadComplete={(files: FileWithPreview[]) =>
                  handleFileUpload(files)
                }
                success={uploadedFiles.length > 0}
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