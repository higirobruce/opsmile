import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { LoaderCircleIcon, Plus, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SelectComponent from "../../components/select-component";
import MultiSelect from "../../components/multi-select";
import FileUpload from "../../components/file-upload";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { fileToBase64, UploadedFile } from "./surgery-input-sheet";
import { Option } from "@/components/ui/multiselect";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import moment from "moment";
import MedicalHistoryCard from "./medical-history-card";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function MedicalTabContent({
  patientData,
  refresh,
}: {
  patientData: any;
  refresh: () => void;
}) {
  const { token, user } = useAuth();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [clearedForSurgery, setClearedForSurgery] = useState<any>("");
  const [pastMedicalHistory, setPastMedicalHistory] = useState("");
  const [diagnosis, setDiagnosis] = useState<any>();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedFile[]>([]);
  const [reasonForCancellation, setReasonForCancellation] = useState("");
  const [labExams, setLabExams] = useState<{ testName: string; result: string }[]>([]);

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

  const handlePhotoUpload = async (files: FileWithPreview[]) => {
    try {
      const filePromises = files.map(async (file) => {
        const base64Url = await fileToBase64(file.file as File);
        return {
          name: file.file.name,
          base64Url,
        };
      });

      const processedPhotos = await Promise.all(filePromises);
      setUploadedPhotos((prev) => [...prev, ...processedPhotos]);
    } catch (error) {
      console.error("Error processing files:", error);
      toast.error("Error processing files");
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/medical-assessment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: patientData?._id,
          pastMedicalHistory,
          diagnosis,
          labExams,
          uploadedFiles: uploadedFiles.map((item) => ({
            name: item.name,
            base64Url: item.base64Url,
          })),
          uploadedPhotos: uploadedPhotos.map((item) => ({
            name: item.name,
            base64Url: item.base64Url,
          })),
          clearedForSurgery: clearedForSurgery == "Yes" ? true : false,
          reasonForCancellation,
          doneById: user?.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error saving medical assessment");
        return;
      }

      toast.success("Medical assessment saved");
      // Clear form fields
      setPastMedicalHistory("");
      setDiagnosis("");
      setLabExams([]);
      setUploadedFiles([]);
      setUploadedPhotos([]);
      setClearedForSurgery("");
      setReasonForCancellation("");
      refresh(); // Refresh patient data to show new assessment
    } catch (error) {
      console.error(error);
      toast.error("Failed to save medical assessment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Left Column: Form for new Medical Assessment */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Add New Medical Assessment</h2>
        <div className="grid grid-cols-2 gap-5 bg-white p-5 border rounded-md space-y-3">
          <div>
            <Label>Medical History</Label>
            <Textarea
              value={pastMedicalHistory}
              onChange={(e) => setPastMedicalHistory(e.target.value)}
            />
          </div>

          <div>
            <Label>Diagnosis</Label>
            <Textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label>Lab Exams</Label>
            {labExams.map((exam, index) => (
              <div key={index} className="flex items-center space-x-2 mt-2">
                <Input
                  placeholder="Test Name"
                  value={exam.testName}
                  onChange={(e) => {
                    const newExams = [...labExams];
                    newExams[index].testName = e.target.value;
                    setLabExams(newExams);
                  }}
                />
                <Input
                  placeholder="Result"
                  value={exam.result}
                  onChange={(e) => {
                    const newExams = [...labExams];
                    newExams[index].result = e.target.value;
                    setLabExams(newExams);
                  }}
                />
                <Button size='icon' variant="destructive" onClick={() => setLabExams(labExams.filter((_, i) => i !== index))}><Trash/></Button>
              </div>
            ))}
            <Button size='icon' variant="outline" className="mt-2 ml-2" onClick={() => setLabExams([...labExams, { testName: '', result: '' }])}><Plus/></Button>
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
            <Label>Photo Upload</Label>
            <FileUpload
              bucketName="photos"
              onUploadComplete={(files: FileWithPreview[]) =>
                handlePhotoUpload(files)
              }
            />
          </div>

          <div>
            <SelectComponent
              _setValue={setClearedForSurgery}
              value={clearedForSurgery}
              name="clearedForSurgery"
              label="Cleared for surgery"
              options={[
                { value: "Yes", label: "Yes" },
                { value: "No", label: "No" },
              ]}
            />
          </div>

          {clearedForSurgery == "No" && (
            <div>
              <Label>Reason for Cancellation</Label>
              <Textarea
                value={reasonForCancellation}
                onChange={(e) => setReasonForCancellation(e.target.value)}
              />
            </div>
          )}

          <Button className="col-span-2" onClick={handleSubmit} disabled={submitting}>
            {submitting && <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />}
            Save Medical Assessment
          </Button>
        </div>
      </div>

      {/* Right Column: History of Medical Assessments */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Medical Assessment History</h2>
        {patientData?.medical_assessments?.length === 0 && <p>No medical assessments found for this patient.</p>}
        {patientData?.medical_assessments?.length > 0 && (
          <div className="grid grid-cols-1 gap-3">
            {patientData?.medical_assessments?.map(
              (mh: any, index: number) => (
                <MedicalHistoryCard
                  requests={true}
                  labRequests={mh?.labRequests}
                  key={index}
                  label={mh.diagnosis}
                  sublabel={[mh.pastMedicalHistory]}
                  description={mh.reasonForCancellation}
                  date={moment(mh.createdAt).fromNow()}
                  consentFileUrls={mh.uploadedFiles}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
