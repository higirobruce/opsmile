import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SelectComponent from "../../components/select-component";
import FileUpload from "../../components/file-upload";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { fileToBase64, UploadedFile } from "./surgery-input-sheet";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import moment from "moment";
import MedicalHistoryCard from "./medical-history-card";
import { Button } from "@/components/ui/button";
import { Timeline, TimelineContent, TimelineDate, TimelineHeader, TimelineIndicator, TimelineItem, TimelineSeparator, TimelineTitle } from "@/components/ui/timeline";
import Link from "next/link";
import SurgeryRecordCard from "./surgery-card";
import { DateAndTimePicker } from "@/components/ui/date-and-time";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProgressTabContent from "./progress-tab-content";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function SurgeryTabContent({
  patientData,
  refresh,
}: {
  patientData: any;
  refresh: () => void;
}) {
  const { token, user } = useAuth();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [surgeryStartDate, setSurgeryStartDate] = useState<Date | undefined>(new Date());
  const [surgeryEndDate, setSurgeryEndDate] = useState<Date | undefined>(new Date());
  const [procedure, setProcedure] = useState<string>("");
  const [surgeryType, setSurgeryType] = useState<string>("");
  const [estimatedDuration, setEstimatedDuration] = useState<number>(0);
  const [actualDuration, setActualDuration] = useState<number>(0);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [beforeSurgeryImageUrls, setBeforeSurgeryImageUrls] = useState<UploadedFile[]>([]);

  const [surgeons, setSurgeons] = useState<any[]>([]);
  const [selectedSurgeon, setSelectedSurgeon] = useState<string>("");
  const [selectedAnesthesiologist, setSelectedAnesthesiologist] = useState<string>("");
  const [anesthesiologists, setAnesthesiologists] = useState<any[]>([]);
  const [selectedSurgicalAssistant, setSelectedSurgicalAssistant] = useState<string>("");



  const [observers, setObservers] = useState<string>("");



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
          patientId: patientData?.patient._id,
          patientFile: patientData?._id,
          surgeonId: selectedSurgeon,
          anesthesiologistId: selectedAnesthesiologist,
          surgeryDate: surgeryStartDate,
          surgeryEndDate,
          surgeryType,
          procedure,
          estimatedDuration,
          actualDuration: surgeryEndDate && surgeryStartDate ? (surgeryEndDate.getTime() - surgeryStartDate.getTime()) / (1000 * 60) : 0,
          consentFileUrls: uploadedFiles,
          beforeSurgeryImageUrls,
          surgicalAssistantId: selectedSurgicalAssistant,
          observers
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error saving surgery record");
        return;
      }

      toast.success("Surgery record saved successfully");
      // Clear form fields
      setSurgeryStartDate(new Date());
      setProcedure("");
      setSurgeryType("");
      setEstimatedDuration(0);
      setUploadedFiles([]);
      setBeforeSurgeryImageUrls([]);
      setSelectedSurgeon("");
      setSelectedAnesthesiologist("");
      setSelectedSurgicalAssistant("");
      setObservers("");
      setSurgeryEndDate(new Date());
      setSurgeryStartDate(new Date());
      refresh(); // Refresh patient data to show new record
    } catch (error) {
      console.error(error);
      toast.error("Failed to save surgery record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Tabs defaultValue="tab-1" className="items-start w-full">
      <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
        <TabsTrigger value="tab-1" className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary">Pre-Operative</TabsTrigger>
        <TabsTrigger value="tab-2" className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary">Intra-Operative</TabsTrigger>
        <TabsTrigger value="tab-3" className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary">Post-Operative</TabsTrigger>
        <TabsTrigger value="tab-4" className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary">PACU</TabsTrigger>
      </TabsList>
      <TabsContent value="tab-1" className="w-full">
        <ProgressTabContent patientData={patientData} refresh={refresh} />
      </TabsContent>

      <TabsContent value="tab-2" className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left Column: Form for new Surgery Record */}


          <div>
            <h2 className="text-xl font-semibold mb-3">Add New Surgery Record</h2>
            <div className="bg-white p-5 border rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-5 ">
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
                  <Label>Surgical assistant</Label>
                  <SelectComponent
                    name="selectedSurgicalAssistant"
                    _setValue={setSelectedSurgicalAssistant}
                    value={selectedSurgicalAssistant}
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
                  <Label>Observers</Label>
                  <Textarea
                    className="mt-2"
                    value={observers}
                    onChange={(e) => setObservers(e.target.value)}
                  />
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
                  <Label>Surgery Notes</Label>
                  <Textarea
                    className="mt-2"
                    value={procedure}
                    onChange={(e) => setProcedure(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Consent Upload</Label>
                  <FileUpload
                    bucketName="consents"
                    onUploadComplete={(files: FileWithPreview[]) =>
                      handleFileUpload(files)
                    }
                    success={uploadedFiles.length > 0}
                  />
                </div>
                <div>
                  <Label>Intra-operative Photo Upload</Label>
                  <FileUpload
                    bucketName="before-surgery-images"
                    onUploadComplete={(files: FileWithPreview[]) =>
                      handleBeforeSurgeryImageUpload(files)
                    }
                    success={beforeSurgeryImageUrls.length > 0}
                  />
                </div>



                {/* <div>
              <Label>Surgery Date</Label>
              <Input
                type="date"
                className="mt-2"
                value={surgeryDate ? new Date(surgeryDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setSurgeryDate(new Date(e.target.value))}
              />
            </div> */}

                <div className="rounded-md border border-gray-300 p-4">
                  <Label className="font-semibold text-gray-700">Surgery Start Time</Label>
                  <DateAndTimePicker key="surgeryDate" date={surgeryStartDate} setDate={setSurgeryStartDate} />
                </div>

                <div className="rounded-md border border-gray-300 p-4">
                  <Label className="font-semibold text-gray-700">Surgery End Time</Label>
                  <DateAndTimePicker key="surgeryEndDate" date={surgeryEndDate} setDate={setSurgeryEndDate} />
                </div>

                <div>
                  <Label>Estimated Duration (minutes)</Label>
                  <Input
                    type="number"
                    className="mt-2"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Actual Duration (minutes)</Label>
                  <Input
                    type="number"
                    className="mt-2"
                    value={surgeryEndDate && surgeryStartDate ? (moment(surgeryEndDate).diff(moment(surgeryStartDate), 'minutes')) : 0}
                    disabled={true}
                  // onChange={(e) => setActualDuration(Number(e.target.value))}
                  />
                </div>
              </div>
              <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
                {submitting && <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />}
                Save Surgery Record
              </Button>
            </div>

          </div>

          {/* Right Column: History of Surgery Records */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Surgery History</h2>
            {patientData?.surgeries?.length === 0 && <p>No surgery records found for this patient.</p>}
            {patientData?.surgeries?.length > 0 && (
              <div className="h-[calc(100vh-200px)] overflow-scroll p-5 border rounded-xl bg-white">

                {patientData?.surgeries?.map((s: any) => (
                  <SurgeryRecordCard key={s._id} record={s} />
                ))}
              </div>

            )}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="tab-3" className="w-full">
        <ProgressTabContent patientData={patientData} refresh={refresh} />
      </TabsContent>
      <TabsContent value="tab-4" className="w-full">
        <ProgressTabContent patientData={patientData} refresh={refresh} />
      </TabsContent>

    </Tabs>


  );
}
