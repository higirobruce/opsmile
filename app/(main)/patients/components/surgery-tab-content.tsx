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

  const [surgeryDate, setSurgeryDate] = useState<Date | undefined>(new Date());
  const [procedure, setProcedure] = useState<string>("");
  const [surgeryType, setSurgeryType] = useState<string>("");
  const [estimatedDuration, setEstimatedDuration] = useState<number>(0);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [beforeSurgeryImageUrls, setBeforeSurgeryImageUrls] = useState<UploadedFile[]>([]);

  const [surgeons, setSurgeons] = useState<any[]>([]);
  const [selectedSurgeon, setSelectedSurgeon] = useState<string>("");
  const [selectedAnesthesiologist, setSelectedAnesthesiologist] = useState<string>("");
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
      // Clear form fields
      setSurgeryDate(new Date());
      setProcedure("");
      setSurgeryType("");
      setEstimatedDuration(0);
      setUploadedFiles([]);
      setBeforeSurgeryImageUrls([]);
      setSelectedSurgeon("");
      setSelectedAnesthesiologist("");
      refresh(); // Refresh patient data to show new record
    } catch (error) {
      console.error(error);
      toast.error("Failed to save surgery record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Left Column: Form for new Surgery Record */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Add New Surgery Record</h2>
        <div className="grid grid-cols-2 gap-5 bg-white p-5 border rounded-md space-y-3">
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
              bucketName="consents"
              onUploadComplete={(files: FileWithPreview[]) =>
                handleFileUpload(files)
              }
            />
          </div>
          <div>
            <Label>Before Surgery Image Upload</Label>
            <FileUpload
              bucketName="before-surgery-images"
              onUploadComplete={(files: FileWithPreview[]) =>
                handleBeforeSurgeryImageUpload(files)
              }
            />
          </div>

          <Button onClick={handleSubmit} disabled={submitting}>
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
          <>

            <Timeline defaultValue={patientData?.surgeries.length}>
              {patientData?.surgeries.map((item: any) => (
                <TimelineItem
                  key={item._id}
                  step={item._id}
                  className="group-data-[orientation=vertical]/timeline:sm:ms-32"
                >
                  <TimelineHeader>
                    <TimelineSeparator />
                    <TimelineDate className="group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-32 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">
                      {moment(item.surgeryDate).format("MMM D, YYYY")}
                    </TimelineDate>
                    <TimelineTitle className="sm:-mt-0.5">{item.surgeryType}</TimelineTitle>
                    <TimelineIndicator />
                  </TimelineHeader>
                  <TimelineContent>
                    <p className="text-sm text-muted-foreground">Procedure: {item.procedure}</p>
                    <p className="text-sm text-muted-foreground">Duration (minutes): {item.estimatedDuration}</p>
                    <p className="text-sm text-muted-foreground">Surgeon: {item.surgeon.firstName}</p>
                    {item.consentFileUrls?.map((consent: any, index:number) => {
                      return <div key={index} className="text-sm text-muted-foreground">Consent: <Link className="text-blue-500" href={consent?.base64Url} target="_blank" rel="noopener noreferrer">{consent?.name}</Link></div>
                    })}
                   
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>

            {/* <div className="grid grid-cols-1 gap-3">
            {patientData?.surgeries?.map((surgery: any, index: any) => (
              <MedicalHistoryCard
                requests={false}
                labRequests={[]}
                key={index}
                label={surgery.surgeryType}
                sublabel={[surgery.status]}
                description={surgery.surgicalNotes}
                date={moment(surgery.surgeryDate).fromNow()}
                consentFileUrls={surgery.consentFileUrls}
              />
            ))}
          </div> */}
          </>

        )}
      </div>
    </div>
  );
}
