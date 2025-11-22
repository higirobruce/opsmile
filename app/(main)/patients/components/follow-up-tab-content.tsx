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
import ClinicalSummaryTab from "./clinical-summary-card";
import { DatePicker, TabList } from "react-aria-components";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const [discharges, setDischarges] = useState<any>()
  const [reviewDate, setReviewDate] = useState<Date | undefined>(new Date());
  const [reviewOutcome, setReviewOutcome] = useState('');
  const [callOutcome, setCallOutcome] = useState('');
  const [followUpDate, setFollowUpDate] = useState<Date | undefined>(new Date());
  const [nextStep, setNextStep] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [currentStatus, setCurrentStatus] = useState('')
  const [recommendations, setRecommendations] = useState('')
  const [nextActions, setNextActions] = useState('')
  const [callDate, setCallDate] = useState<Date | undefined>(new Date());
  const [followUpNotes, setFollowUpNotes] = useState('')

  const fetchFollowUpRecords = useCallback(async () => {
    setDischarges(patientData?.discharges?.length > 0
      ? patientData?.discharges[patientData?.discharges?.length - 1]
      : '-')
    setFetching(true);
    try {
      const response = await fetch(`${API_URL}/follow-ups/patient/${patientData?.patient?._id}`, {
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
          patient: patientData?.patient?._id,
          patientFile: patientData?._id,
          nextStep,
          reviewOutcome,
          callOutcome,
          callDate,
          followUpDate

        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error saving follow up record");
        return;
      }

      toast.success("Follow up record saved successfully");
      setDischargeSummary("");
      setMedicationsAtDischarge("");
      setFollowUpInstructions("");
      setDischargeDate(new Date());
      fetchFollowUpRecords();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save follow up record");
    } finally {
      setSubmitting(false);
      setFetching(false)
    }
  };

  return (
    <div className="flex flex-col space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h2 className="font-semibold mb-3 text-xs uppercase tracking-wide text-slate-500">Patient disposition: {discharges?.patientDisposition}</h2>
          {discharges?.patientDisposition === 'Subject for review' &&
            <div className="bg-white p-5 border rounded-xl space-y-3">
              <div>
                <p className="font-semibold text-sm text-">Subject for review</p>
                <p className="text-xs">{discharges.reviewLocation}, {moment(discharges.reviewDate).format('YYYY-MMM-DD HH:MM A')}</p>

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm text-">Diagnosis</p>
                  <p className="text-xs text-foreground">{discharges.diagnosis}</p>
                </div>

                <div>
                  <p className="font-semibold">Procedure</p>
                  <p className="text-xs text-foreground">{discharges.procedure}</p>
                </div>

                <div>
                  <p className="font-semibold">Discharge Recommendations</p>
                  <p className="text-xs text-foreground">{discharges.dischargeSummary}</p>
                </div>
              </div>
              <Label>Review outcome</Label>
              <Textarea
                value={reviewOutcome}
                onChange={(e) => setReviewOutcome(e.target.value)}
                placeholder="Enter review outcome here..."
              />
              <Button className="mt-3" disabled={submitting} onClick={handleSubmit} variant='default'>Save</Button>
            </div>
          }

          {discharges?.patientDisposition === 'Counter-referred' &&
            <div className="bg-white p-5 border rounded-xl space-y-3">

              <div>
                <p className="font-semibold text-sm text-">Counter Reffered</p>
                <p className="text-xs">{discharges.referralLocation}, {moment(discharges.referralDate).format('YYYY-MMM-DD HH:MM A')}</p>

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm text-">Diagnosis</p>
                  <p className="text-xs text-foreground">{discharges.diagnosis}</p>
                </div>

                <div>
                  <p className="font-semibold text-sm text-">Procedure</p>
                  <p className="text-xs text-foreground">{discharges.procedure}</p>
                </div>

                <div>
                  <p className="font-semibold text-sm text-">Discharge Recommendations</p>
                  <p className="text-xs text-foreground">{discharges.dischargeSummary}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm text-">Follow up call recording</p>
                <div className="grid grid-cols-2 gap-4">
                  <SimpletDatePicker date={callDate} label="Call date" setDate={setCallDate} />
                  <div>
                    <Label>Call outcome</Label>
                    <Textarea
                      value={callOutcome}
                      onChange={(e) => setCallOutcome(e.target.value)}
                      placeholder="Enter call outcome here..."
                    />
                  </div>
                  <div>
                    <SelectComponent
                      name="nextStep"
                      label="Next step"
                      options={[
                        { value: "Next call", label: "Next call" },
                        { value: "Review needed", label: "Review needed" },
                        { value: "Care completed", label: "Care completed" },
                      ]}
                      value={nextStep}
                      _setValue={(v: any) => {
                        setNextStep(v)
                      }}
                    />
                  </div>
                </div>

                <Button className="mt-3" disabled={submitting} onClick={handleSubmit} variant='default'>Save</Button>

              </div>
            </div>
          }

          {discharges?.patientDisposition === 'Follow up' &&
            <div className="bg-white p-5 border rounded-xl space-y-3">
              <div>
                <p className="font-semibold text-sm text-">Follow up action</p>
                <p className="text-xs">{discharges.followUpAction}, {moment(discharges.followUpDate).format('YYYY-MMM-DD HH:MM A')}</p>

              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-sm text-">Diagnosis</p>
                  <p className="text-xs text-foreground">{discharges.diagnosis}</p>
                </div>

                <div>
                  <p className="font-semibold text-sm text-">Procedure</p>
                  <p className="text-xs text-foreground">{discharges.procedure}</p>
                </div>

                <div>
                  <p className="font-semibold text-sm text-">Discharge Recommendations</p>
                  <p className="text-xs text-foreground">{discharges.dischargeSummary}</p>
                </div>
              </div>

              <div >
                <Label>Phyisical follow up notes</Label>
                <Textarea
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  placeholder="Enter Physical follow notes here..."
                />
              </div>


              <Button className="mt-3" disabled={submitting} onClick={handleSubmit} variant='default'>Save</Button>
            </div>
          }


          {/* <div className="bg-white p-5 border rounded-xl space-y-3">
            <div className="grid grid-cols-2 gap-5 ">

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
            <Button className="mt-3" onClick={handleSubmit} disabled={submitting}>
              {submitting && <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />}
              Save Follow-up Record
            </Button>
          </div> */}
        </div>
        <div>


          <Tabs defaultValue="tab-1">
            <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
              <TabsTrigger value="tab-1" className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary">Clinical summary</TabsTrigger>
              <TabsTrigger value="tab-2" className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary">Follow up History</TabsTrigger>

            </TabsList>
            <TabsContent value="tab-2">
              {/* <h2 className="text-xl font-semibold mb-3">Follow-up History</h2> */}
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
                  {/* <ClinicalSummaryTab patientData={patientData} /> */}
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

            </TabsContent>

            <TabsContent value="tab-1">
              <ClinicalSummaryTab patientData={patientData} />
            </TabsContent>
          </Tabs>


        </div>
      </div>
    </div>
  );
}
