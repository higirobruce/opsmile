import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { FileText, LoaderCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SimpletDatePicker } from "@/app/componets/simple-date-picker";
import moment from "moment";
import { Timeline, TimelineContent, TimelineDate, TimelineHeader, TimelineIndicator, TimelineItem, TimelineSeparator, TimelineTitle } from "@/components/ui/timeline";
import { Button } from "@/components/ui/button";
import SelectComponent from "../../components/select-component";
import { Switch } from "@/components/ui/switch";
import SwitchFollowUp from "./switch-follow-up";
import FileUpload from "../../components/file-upload";
import { FileWithPreview } from "@/hooks/use-file-upload";

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

export default function FollowUpTabContent({
  patientData,
  refresh,
}: {
  patientData: any;
  refresh: () => void;
}) {
  const { token, user } = useAuth();
  const [followUpRecords, setFollowUpRecords] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [dischargeDate, setDischargeDate] = useState<Date | undefined>(new Date());
  const [dischargeSummary, setDischargeSummary] = useState("");
  const [medicationsAtDischarge, setMedicationsAtDischarge] = useState<string>("");
  const [followUpInstructions, setFollowUpInstructions] = useState("");
  const [diagnosis, setDiagnosis] = useState("")
  const [procedure, setProcedure] = useState("")
  const [patientDisposition, setPatientDisposition] = useState("")
  const [reviewDate, setReviewDate] = useState<Date | undefined>(new Date());
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(new Date());
  const [followUpDuration, setFollowUpDuration] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentStatus, setCurrentStatus] = useState('')
  const [recommendations, setRecommendations] = useState('')
  const [nextActions, setNextActions] = useState('')


  const fetchFollowUpRecords = useCallback(async () => {
    setFetching(true);
    try {
      const response = await fetch(`${API_URL}/follow-ups/patient/${patientData?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error fetching discharge records");
        return;
      }

      setFollowUpRecords(data);
      setFetching(false);
    } catch (error) {
      setFetching(false);
      console.error(error);
      toast.error("Failed to fetch discharge records");
    }
  }, [patientData?._id, token]);

  useEffect(() => {
    fetchFollowUpRecords();
  }, [fetchFollowUpRecords]);

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
    setFetching(true)
    try {
      const response = await fetch(`${API_URL}/follow-ups`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient: patientData?._id,
          postOperativePictures: uploadedFiles?.length > 0 ? uploadedFiles : [],
          currentStatus,
          recommendations,
          nextActions
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error saving discharge record");
        return;
      }

      toast.success("Discharge record saved successfully");
      setDischargeSummary("");
      setMedicationsAtDischarge("");
      setFollowUpInstructions("");
      setDischargeDate(new Date());
      fetchFollowUpRecords();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save discharge record");
    } finally {
      setSubmitting(false);
      setFetching(false)
    }
  };

  return (
    <div className="flex flex-col space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h2 className="text-xl font-semibold mb-3">Add New Follow-up Record</h2>
          <div className="bg-white p-5 border rounded-xl space-y-3">
            <div className="grid grid-cols-2 gap-5 ">
              {/* <div className="flex flex-col justify-items-start"> */}
              {/* <Label>Discharge Date</Label> */}
              {/* <SimpletDatePicker setDate={setDischargeDate} date={dischargeDate} label="Discharge Date" /> */}
              {/* </div> */}

              <div>
                <Label>Post-Operative pictures</Label>
                <FileUpload
                  success={uploadedFiles?.length > 0}
                  bucketName=""
                  onUploadComplete={handleFileUpload}
                />
              </div>

              <div>
                <Label>Current status</Label>
                <Textarea
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  placeholder="Enter current status here..."
                />
              </div>

              <div>
                <Label>Follow-up recommendations</Label>
                <Textarea
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  placeholder="Enter recommendations here..."
                />
              </div>

              <div>
                <Label>Next Actions</Label>
                <Textarea
                  value={nextActions}
                  onChange={(e) => setNextActions(e.target.value)}
                  placeholder="Enter next actions here..."
                />
              </div>

            </div>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />}
              Save Follow-up Record
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Follow-up History</h2>
          {fetching && (
            <div className="flex h-96">
              <div role="status" className="animate-pulse">
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[640px] mb-2.5 mx-auto"></div>
                <div className="h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700"></div>
                <div className="flex items-center justify-center mt-4">
                  <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {!fetching && followUpRecords.length === 0 && <p>No discharge records found for this patient.</p>}
          {!fetching && followUpRecords.length > 0 && (
            <div className="h-[calc(100vh-200px)] overflow-scroll p-5 border rounded-xl bg-white">
              <Timeline defaultValue={followUpRecords.length}>
                {followUpRecords.map((item: any) => (
                  <TimelineItem
                    key={item._id}
                    step={item._id}
                    className="group-data-[orientation=vertical]/timeline:sm:ms-32"
                  >
                    <TimelineHeader>
                      <TimelineSeparator />
                      <TimelineDate className="group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-32 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">
                        {moment(item.createdAt).format("MMM D, YYYY")}
                      </TimelineDate>
                      <TimelineTitle className="sm:-mt-0.5">Follow-up recommendations: {item.dischargeSummary}</TimelineTitle>
                      <TimelineIndicator />
                    </TimelineHeader>
                    <TimelineContent>
                      <p className="text-sm text-muted-foreground">Status: {item.currentStatus}</p>

                      <p className="text-sm text-muted-foreground">Next Actions: {item.nextActions}</p>

                      {item.postOperativePictures?.length > 0 && (
                        <div>
                          <h3 className="font-medium text-gray-700">Intra-operative Picture</h3>
                          <div className="mt-2 grid grid-cols-3 gap-3">
                            {item.postOperativePictures.map((img: any, i: number) => (
                              <a key={i} href={img.base64Url} target="_blank" rel="noopener noreferrer">
                                <img
                                  src={img.base64Url}
                                  alt={img.name}
                                  className="rounded-lg border h-24 w-full object-cover"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
