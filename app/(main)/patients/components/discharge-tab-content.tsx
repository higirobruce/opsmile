import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function DischargeTabContent({
  patientData,
  refresh,
}: {
  patientData: any;
  refresh: () => void;
}) {
  const { token, user } = useAuth();
  const [dischargeRecords, setDischargeRecords] = useState<any[]>([]);
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


  const fetchDischargeRecords = useCallback(async () => {
    setFetching(true);
    try {
      const response = await fetch(`${API_URL}/discharge/patient/${patientData?._id}`, {
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

      setDischargeRecords(data);
      setFetching(false);
    } catch (error) {
      setFetching(false);
      console.error(error);
      toast.error("Failed to fetch discharge records");
    }
  }, [patientData?._id, token]);

  useEffect(() => {
    fetchDischargeRecords();
  }, [fetchDischargeRecords]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setFetching(true)
    try {
      const response = await fetch(`${API_URL}/discharge`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: patientData?._id,
          doctorId: user?.id,
          dischargeDate,
          dischargeSummary,
          // medicationsAtDischarge: medicationsAtDischarge.split(',').map(item => item.trim()),
          diagnosis,
          procedure,
          patientDisposition,
          reviewDate: patientDisposition === 'Planned review' ? reviewDate : '',
          isFollowUp,
          followUpInstructions: isFollowUp ? followUpInstructions : '',
          followUpDate: isFollowUp ? followUpDate : '',
          followUpDuration: isFollowUp ? Number(followUpDuration) : ''
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
      fetchDischargeRecords();
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
          <h2 className="text-xl font-semibold mb-3">Add New Discharge Record</h2>
          <div className="bg-white p-5 border rounded-xl space-y-3">
            <div className="grid grid-cols-2 gap-5 ">
              <div className="flex flex-col justify-items-start">
                {/* <Label>Discharge Date</Label> */}
                <SimpletDatePicker setDate={setDischargeDate} date={dischargeDate} label="Discharge Date" />
              </div>
              <div>
                <Label>Discharge recommendations</Label>
                <Textarea
                  value={dischargeSummary}
                  onChange={(e) => setDischargeSummary(e.target.value)}
                  placeholder="Enter discharge recommendations here..."
                />
              </div>

              <div>
                <Label>Diagnosis</Label>
                <Textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis here..."
                />
              </div>

              <div>
                <Label>Procedure</Label>
                <Textarea
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  placeholder="Enter procedure here..."
                />
              </div>

              <div>
                <SelectComponent
                  name="patientDisposition"
                  label="Patient disposition"
                  options={[
                    { value: "Home", label: "Home" },
                    { value: "Counter-referred", label: "Counter-referred" },
                    { value: "Planned review", label: "Planned review" },
                  ]}
                  value={patientDisposition}
                  _setValue={setPatientDisposition}
                />
              </div>


              <div>
                {/* <Label>Review date</Label> */}
                {patientDisposition === "Planned review" && (
                  <SimpletDatePicker setDate={setReviewDate} date={reviewDate} label="Review Date" />
                )}
              </div>


              <SwitchFollowUp
                isFollowUp={isFollowUp}
                setIsFollowUp={setIsFollowUp}
                label="Follow Up"
                sublabel="Is this a follow up discharge?"
                description="If checked, this discharge record will be marked as a follow up."
              />


              <div>
                {isFollowUp && (
                  <SimpletDatePicker setDate={setFollowUpDate} date={followUpDate} label="Follow Up Date" />
                )}
              </div>
              <div>
                {isFollowUp && (
                  <div>
                    <Label>Follow Up Instructions</Label>
                    <Textarea
                      value={followUpInstructions}
                      onChange={(e) => setFollowUpInstructions(e.target.value)}
                      placeholder="Enter follow up instructions here..."
                    />
                  </div>
                )}
              </div>

              <div>
                {isFollowUp && (
                  <div>
                    <Label>Duration (minutes)s</Label>
                    <Input
                      type="number"
                      value={followUpDuration}
                      onChange={(e) => setFollowUpDuration(e.target.value)}
                      placeholder="Enter follow up duration here..."
                    />
                  </div>
                )}
              </div>



            </div>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />}
              Save Discharge Record
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Discharge History</h2>
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
          {!fetching && dischargeRecords.length === 0 && <p>No discharge records found for this patient.</p>}
          {!fetching && dischargeRecords.length > 0 && (
            <div className="h-[calc(100vh-200px)] overflow-scroll p-5 border rounded-xl bg-white">
              <Timeline defaultValue={dischargeRecords.length}>
                {dischargeRecords.map((item: any) => (
                  <TimelineItem
                    key={item._id}
                    step={item._id}
                    className="group-data-[orientation=vertical]/timeline:sm:ms-32"
                  >
                    <TimelineHeader>
                      <TimelineSeparator />
                      <TimelineDate className="group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-32 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">
                        {moment(item.dischargeDate).format("MMM D, YYYY")}
                      </TimelineDate>
                      <TimelineTitle className="sm:-mt-0.5">Discharge Summary: {item.dischargeSummary}</TimelineTitle>
                      <TimelineIndicator />
                    </TimelineHeader>
                    <TimelineContent>
                      <p className="text-sm text-muted-foreground">Doctor: {item.doctor.firstName} {item.doctor.lastName}</p>
                      {item.medicationsAtDischarge && item.medicationsAtDischarge.length > 0 && (
                        <p className="text-sm text-muted-foreground">Medications: {item.medicationsAtDischarge.join(", ")}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Follow-up: {item.followUpInstructions}</p>
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
