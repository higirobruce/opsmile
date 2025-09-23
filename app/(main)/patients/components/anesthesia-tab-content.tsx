import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { LoaderCircleIcon, Plus, Trash } from "lucide-react";
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
import Checkbox2 from "../../components/checkbox2";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AnesthesiaTabContent({
  patientData,
  refresh,
}: {
  patientData: any;
  refresh: () => void;
}) {
  const { token, user } = useAuth();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [pastAnestheticHistory, setPastAnestheticHistory] = useState<string>("");
  const [asaScore, setAsaScore] = useState("");
  const [mallampatiScore, setMallampatiScore] = useState("");
  const [anesthesiaType, setAnesthesiaType] = useState("");
  const [proposedPlan, setProposedPlan] = useState<string>('');
  const [clearedForAnesthesiaBool, setClearedForAnesthesiaBool] = useState<string>('');
  const [preanesthesiaChecklistDone, setPreanesthesiaChecklistDone] = useState<boolean>(false);
  const [surgicalSafetyChecklistDone, setSurgicalSafetyChecklistDone] = useState<boolean>(false);
  const [medications, setMedications] = useState<{ name: string, dosage: string }[]>([]);

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
          medications
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error saving anesthesia record");
        return;
      }

      toast.success("Anesthesia record saved successfully");
      // Clear form fields
      setPastAnestheticHistory("");
      setAsaScore("");
      setMallampatiScore("");
      setAnesthesiaType("");
      setProposedPlan("");
      setClearedForAnesthesiaBool("");
      setPreanesthesiaChecklistDone(false);
      setSurgicalSafetyChecklistDone(false);
      setMedications([]);
      setUploadedFiles([]);
      refresh(); // Refresh patient data to show new record
    } catch (error) {
      console.error(error);
      toast.error("Failed to save anesthesia record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Left Column: Form for new Anesthesia Record */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Add New Anesthesia Record</h2>
        <div className="grid grid-cols-2 gap-5 bg-white p-5 border rounded-md space-y-3">
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
           
            <Input type="checkbox" className="h-4 w-4" id="preanesthesiaChecklistDone" checked={preanesthesiaChecklistDone} onChange={(e) => setPreanesthesiaChecklistDone(e.target.checked)} />
            <Label htmlFor="preanesthesiaChecklistDone">Preanesthesia Checklist Done</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Input type="checkbox" className="h-4 w-4" id="surgicalSafetyChecklistDone" checked={surgicalSafetyChecklistDone} onChange={(e) => setSurgicalSafetyChecklistDone(e.target.checked)} />
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
            />
          </div>

          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting && <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />}
            Save Anesthesia Record
          </Button>
        </div>
      </div>

      {/* Right Column: History of Anesthesia Records */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Anesthesia History</h2>
        {patientData?.anesthesia_records?.length === 0 && <p>No anesthesia records found for this patient.</p>}
        {patientData?.anesthesia_records?.length > 0 && (
          <div className="h-[calc(100vh-200px)] overflow-scroll p-5 border rounded-xl bg-white">
            {patientData?.anesthesia_records?.map(
              (an: any, index: any) => (
                <MedicalHistoryCard
                  requests={false}
                  labRequests={[]}
                  key={index}
                  label={an.clearedForAnesthesiaBool ? 'Cleared for Anesthesia' : 'Not cleared for Anesthesia'}
                  sublabel={[an.pastAnesteticHistory]}
                  description={an.proposedPlan}
                  date={moment(an.createdAt).fromNow()}
                  consentFileUrls={an.consentFileUrl}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
