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
  const [pastAnesteticHistory, setPastAnesteticHistory] = useState<string>("");
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
  const [proposedPlan, setProposedPlan] = useState<string>('')
  const [clearedForAnesthesiaBool, setClearedForAnesthesiaBool] = useState<string>('')

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
          pastAnesteticHistory,
          proposedPlan,
          consentFileUrl: uploadedFiles,
          clearedForAnesthesiaBool: clearedForAnesthesiaBool == 'Yes' ? true : false,
          doneById: user?.id // Array of {name, base64Url}
        }),
      });

      console.log({
        patientId: patientData?._id,
        pastAnesteticHistory,
        proposedPlan,
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
            {/* <DialogDescription>
              Enter the patient's medical assessment
            </DialogDescription> */}
          </DialogHeader>
          <div className="grid sm:grid-cols-2 flex-1 auto-rows-min gap-6 px-4 overflow-scroll">
            <div>
              <Label>Anesthesia History</Label>
              <Textarea
                className="mt-2"
                onChange={(e) => setPastAnesteticHistory(e.target.value)}
                value={pastAnesteticHistory}
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


            <div className="mb-4">
              <Label>Anesthesia Consent Upload</Label>
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
