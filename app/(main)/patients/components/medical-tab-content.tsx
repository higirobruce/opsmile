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
import { Timeline, TimelineContent, TimelineDate, TimelineHeader, TimelineIndicator, TimelineItem, TimelineSeparator, TimelineTitle } from "@/components/ui/timeline";
import SimpleTextArea from "../../components/text-area";
import MedicalAssessmentCard from "./medical-asswssment-card";

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
  const [uploadedLabExams, setUploadedLabExams] = useState<UploadedFile[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedFile[]>([]);
  const [reasonForPending, setReasonForPending] = useState("");
  const [labExamsFindings, setLabExamsFindings] = useState<any>('');
  const [physicalExamsFindings, setPhysicalExamsFindings] = useState<any>('');
  const [consultativeNotes, setConsultativeNotes] = useState<any>('');
  const [destinationForTransferred, setDestinationForTransferred] = useState<any>('');
  const [surgicalDecision, setSurgicalDecision] = useState<any>('');
  const [surgicalDecisionOther, setSurgicalDecisionOther] = useState<any>('');

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

  const handleLabExamsFileUpload = async (files: FileWithPreview[]) => {
    try {
      const filePromises = files.map(async (file) => {
        const base64Url = await fileToBase64(file.file as File);
        return {
          name: file.file.name,
          base64Url,
        };
      });

      const processedFiles = await Promise.all(filePromises);
      setUploadedLabExams((prev) => [...prev, ...processedFiles]);
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

  useEffect(() => {
    console.log(diagnosis, pastMedicalHistory)

  }, [diagnosis, pastMedicalHistory])

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
          patientId: patientData?.patient._id,
          patientFile: patientData?._id,
          pastMedicalHistory,
          diagnosis,
          labExams: labExamsFindings,
          physicalExams: physicalExamsFindings,
          uploadedFiles: uploadedFiles.map((item) => ({
            name: item.name,
            base64Url: item.base64Url,
          })),
          uploadedPhotos: uploadedPhotos.map((item) => ({
            name: item.name,
            base64Url: item.base64Url,
          })),
          uploadedLabExams: uploadedLabExams.map((item) => ({
            name: item.name,
            base64Url: item.base64Url,
          })),
          clearedForSurgery: clearedForSurgery == "Cleared for surgery" ? true : false,
          surgicalDecision: surgicalDecision,
          consultativeNotes,
          reasonForPending,
          destinationForTransferred,
          doneById: user?.id,
          status: 'In Anesthesiology'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error saving Consultation record");
        return;
      }

      toast.success("Consultation record saved");
      // Clear form fields
      setPastMedicalHistory("");
      setDiagnosis("");
      setLabExamsFindings([]);
      setUploadedFiles([]);
      setUploadedPhotos([]);
      setClearedForSurgery("");
      setReasonForPending("");
      refresh(); // Refresh patient data to show new assessment
    } catch (error) {
      console.error(error);
      toast.error("Failed to save Consultation record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Left Column: Form for new Consultation record */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Add New Consultation record</h2>
        <div className="grid grid-cols-2 gap-5 bg-white p-5 border rounded-xl space-y-3">
          <div>
            {/* <Label>Medical History</Label> */}
            <SimpleTextArea label='Medical history' limit={500} setValue={setPastMedicalHistory} value={pastMedicalHistory} />
            {/* <Textarea
              value={pastMedicalHistory}
              maxLength={500}
              onChange={(e) => setPastMedicalHistory(e.target.value)}
            /> */}
          </div>

          <div>
            {/* <Label>Diagnosis</Label> */}
            <SimpleTextArea label='Diagnosis' limit={200} setValue={setDiagnosis} value={diagnosis} />
            {/* <Textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            /> */}
          </div>

          <div>
            {/* <Label>Diagnosis</Label> */}
            <SimpleTextArea label='Physical Exams Findings' limit={500} setValue={setPhysicalExamsFindings} value={physicalExamsFindings} />
            {/* <Textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            /> */}
          </div>


          <div>
            {/* <Label>Diagnosis</Label> */}
            <SimpleTextArea label='Lab Exams findings' limit={500} setValue={setLabExamsFindings} value={labExamsFindings} />
            {/* <Textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            /> */}
          </div>

          {/* <div className="col-span-2">
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
                <Button size='icon' variant="destructive" onClick={() => setLabExams(labExams.filter((_, i) => i !== index))}><Trash /></Button>
              </div>
            ))}
            <Button size='icon' variant="outline" className="mt-2 ml-2" onClick={() => setLabExams([...labExams, { testName: '', result: '' }])}><Plus /></Button>
          </div> */}

          <div className="flex flex-col space-y-1">
            <Label>Labs results Upload</Label>
            <FileUpload
              bucketName="consents"
              onUploadComplete={(files: FileWithPreview[]) =>
                handleLabExamsFileUpload(files)
              }
              success={uploadedLabExams.length > 0}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label>Consent Upload</Label>
            <FileUpload
              bucketName="consents"
              onUploadComplete={(files: FileWithPreview[]) =>
                handleFileUpload(files)
              }
              success={uploadedFiles.length > 0}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label>Pre-Operative Photo Upload</Label>
            <FileUpload
              bucketName="photos"
              onUploadComplete={(files: FileWithPreview[]) =>
                handlePhotoUpload(files)
              }
              success={uploadedPhotos.length > 0}
            />
          </div>
          <div>
            {/* <Label>Diagnosis</Label> */}
            <SimpleTextArea label='Consultative Notes' limit={200} setValue={setConsultativeNotes} value={consultativeNotes} />
            {/* <Textarea
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            /> */}
          </div>

          <div>
            <SelectComponent
              _setValue={setSurgicalDecision}
              value={surgicalDecision}
              name="clearedForSurgery"
              label="Sergical Decision"
              options={[
                { value: "Cleared for surgery", label: "Cleared for surgery" },
                { value: "Pending", label: "Pending (with reason)" },
                { value: "Not Cleared", label: "Not Cleared (Case closed)" },
                { value: "Transferred", label: "Transfered" },
                { value: "Other", label: "Other - Specify" },
              ]}
            />
          </div>

          {surgicalDecision == "Pending" && (
            <div>
              <Label>Reason</Label>
              <Textarea
                value={reasonForPending}
                className="mt-2"
                onChange={(e) => setReasonForPending(e.target.value)}
              />
            </div>
          )}

          {surgicalDecision == "Transferred" && (
            <div>
              <Label>Transferred to? </Label>
              <Textarea
                value={destinationForTransferred}
                className="mt-2"
                onChange={(e) => setDestinationForTransferred(e.target.value)}
              />
            </div>
          )}
          {surgicalDecision == "Other" && (
            <div>
              <Label>Specify</Label>
              <Textarea
                value={surgicalDecisionOther}
                className="mt-2"
                onChange={(e) => setSurgicalDecisionOther(e.target.value)}
              />
            </div>
          )}

          <Button className="col-span-2" onClick={handleSubmit} disabled={submitting}>
            {submitting && <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />}
            Save Consultation record
          </Button>
        </div>
      </div>

      {/* Right Column: History of Consultation records */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Consultation record History</h2>
        {patientData?.medical_assessments?.length === 0 && <p>No Consultation records found for this patient.</p>}
        {patientData?.medical_assessments?.length > 0 && (
          <div className="h-[calc(100vh-200px)] overflow-scroll p-5 border rounded-xl bg-white">
            {patientData?.medical_assessments?.map((record: any, index: number) => (
              <MedicalAssessmentCard key={index} record={record} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
