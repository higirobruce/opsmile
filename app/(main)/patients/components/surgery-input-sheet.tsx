import { useCallback, useEffect, useState } from "react";

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
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  const [surgeryDate, setSurgeryDate] = useState<Date | undefined>(new Date());
  const [procedure, setProcedure] = useState<string>("");
  const [surgeryType, setSurgeryType] = useState<string>("");
  const [estimatedDuration, setEstimatedDuration] = useState<number>(0);


  const [files, setFiles] = useState<FileWithPreview[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [beforeSurgeryImageUrls, setBeforeSurgeryImageUrls] = useState<UploadedFile[]>([]);

  const [surgeons, setSurgeons] = useState<any[]>([]);
  const [selectedSurgeon, setSelectedSurgeon] = useState<string>("");
  const [selectedAnesthesiologist, setSelectedAnesthesiologist] =
    useState<string>("");
  const [anesthesiologists, setAnesthesiologists] = useState<any[]>([]);

  const fetchSurgeons = useCallback(async () => {
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
  }, [token]);

  const fetchAnesthesiologists = useCallback(async () => {
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
  }, [token]);

  useEffect(() => {
    fetchSurgeons();
    fetchAnesthesiologists();
  }, [patientData, fetchSurgeons, fetchAnesthesiologists]);

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

  const handleBeforeSurgeryImageUpload = async (files: FileWithPreview[]) => {
    try {
      const filePromises = files.map(async (file) => {
        const base64Url = await fileToBase64(file.file as File);
        return {
          name: file.file.name,
          base64Url,
        };
      });

      const processedFiles = await Promise.all(filePromises);
      setBeforeSurgeryImageUrls((prev) => [...prev, ...processedFiles]);
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("Error processing files");
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/surgery-record`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: patientData?._id,
          surgeonId: selectedSurgeon,
          anesthesiologistId: selectedAnesthesiologist,
          surgeryDate,
          surgeryType,
          procedure,
          estimatedDuration,
          consentFileUrls: uploadedFiles,
          beforeSurgeryImageUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error saving surgery record");
        return;
      }

      toast.success("Surgery record saved successfully");
      refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Error saving surgery record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div>
            <Button variant="outline" onClick={() => setOpen(true)}>
              Add new surgery record
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto ">
          <DialogHeader>
            <DialogTitle>Capture surgery info</DialogTitle>
            <DialogDescription>
              Enter the required information for the surgery input Dialog.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 flex-1 auto-rows-min gap-6 px-4 overflow-scroll">
            <div>
              <Label>Surgeon</Label>
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
                name="surgeryType"
                _setValue={setSurgeryType}
                value={surgeryType}
                label=""
                options={[
                  { value: "PRIMARY_LIP_REPAIR", label: "Primary Lip Repair" },
                  { value: "PRIMARY_PALATE_REPAIR", label: "Primary Palate Repair" },
                  { value: "LIP_REVISION", label: "Lip Revision" },
                  { value: "PALATE_REVISION", label: "Palate Revision" },
                  { value: "FISTULA_REPAIR", label: "Fistula Repair" },
                  { value: "ALVEOLAR_BONE_GRAFTING", label: "Alveolar Bone Grafting" },
                  { value: "RHINOPLASTY", label: "Rhinoplasty" },
                  { value: "PHARYNGOPLASTY", label: "Pharyngoplasty" },
                  { value: "ORTHOGNATHIC_SURGERY", label: "Orthognathic Surgery" },
                  { value: "OTHER", label: "Other" },
                ]}
              ></SelectComponent>
            </div>
            <div>
              <Label>Procedure</Label>
              <Textarea
                className="mt-2"
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
              />
            </div>
            <div>
              <Label>Estimated Duration (minutes)</Label>
              <Input
                type="number"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Surgery Date</Label>
              <Input
                type="date"
                value={surgeryDate ? new Date(surgeryDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setSurgeryDate(new Date(e.target.value))}
              />
            </div>


            <div>
              <Label>Consent Upload</Label>
              <FileUpload
                success={uploadedFiles?.length > 0}
                bucketName="consents"
                onUploadComplete={(files: FileWithPreview[]) =>
                  handleFileUpload(files)
                }
              />
            </div>
            <div>
              <Label>Before Surgery Image Upload</Label>
              <FileUpload
                success={beforeSurgeryImageUrls?.length > 0}
                bucketName="before-surgery-images"
                onUploadComplete={(files: FileWithPreview[]) =>
                  handleBeforeSurgeryImageUpload(files)
                }
              />
            </div>
          </div>
          <DialogFooter>
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
