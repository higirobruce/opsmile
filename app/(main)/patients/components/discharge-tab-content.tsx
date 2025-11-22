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
import DischargeCard from "./discharge-card";

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
  const [customerStatus, setCustomerStatus] = useState('')
  const [reviewLocation, setRevieLocation] = useState('')
  const [referralDate, setReferralDate] = useState<Date | undefined>(moment().add('1M').toDate())
  const [referralLocation, setReferralLocation] = useState('')
  const [followUpAction, setFollowUpAction] = useState('')


  const fetchDischargeRecords = useCallback(async () => {
    setFetching(true);
    try {
      const response = await fetch(`${API_URL}/discharge/patient/${patientData?.patient?._id}`, {
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
  }, [patientData?.patient?._id, token]);



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
          patientId: patientData?.patient?._id,
          patientFile: patientData?._id,
          doctorId: user?.id,
          dischargeDate,
          dischargeSummary,
          // medicationsAtDischarge: medicationsAtDischarge.split(',').map(item => item.trim()),
          diagnosis,
          procedure,
          patientDisposition,
          reviewDate: patientDisposition === 'Subject for review' ? reviewDate : '',
          reviewLocation: patientDisposition === 'Subject for review' ? reviewLocation : '',
          referralDate: patientDisposition === 'Counter-referred' ? referralDate : '',
          referralLocation: patientDisposition === 'Counter-referred' ? referralLocation : '',
          followUpDate: patientDisposition == 'Follow up' ? followUpDate : '',
          followUpAction: patientDisposition == 'Follow up' ? followUpAction : '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error saving discharge record");
        return;
      }

      toast.success("Discharge record saved successfully");

      let userUpdated = await updatingUser();

      if (!user)
        return

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

  const updatingUser = async () => {
    const responsePatient = await fetch(`${API_URL}/patients/${patientData?.patient?._id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: customerStatus }),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const dataUser = await responsePatient.json();


    if (!responsePatient.ok) {
      toast.error(dataUser.message || "Error updating patient!");
      return;
    }

    return dataUser
  }

  return (
    <div className="flex flex-col space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h2 className="font-semibold mb-3 text-xs uppercase tracking-wide text-slate-500">Add New Discharge Record</h2>
          <div className="bg-white p-5 border rounded-xl space-y-3">
            <div className="grid grid-cols-2 gap-5 ">
              <div className="flex flex-col justify-items-start">
                {/* <Label>Discharge Date</Label> */}
                <SimpletDatePicker setDate={setDischargeDate} date={dischargeDate} label="Discharge Date" />
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
                <Label>Procedure Done</Label>
                <Textarea
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  placeholder="Enter procedure here..."
                />
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
                <SelectComponent
                  name="patientDisposition"
                  label="Patient disposition"
                  options={[
                    { value: "Care Completed", label: "Care Completed" },
                    { value: "Subject for review", label: "Subject for review" },
                    { value: "Counter-referred", label: "Counter-referred" },
                    { value: "Follow up", label: "Follow up" },
                  ]}
                  value={patientDisposition}
                  _setValue={(v: any) => {
                    if (v == 'Care Completed') {
                      setCustomerStatus('Care Completed')
                    }
                    if (v == 'Subject for review') {
                      setCustomerStatus('Subject for review')
                    }
                    if (v == 'Counter-referred') {
                      setCustomerStatus('Counter-referred')
                    }
                    if (v == 'Follow up') {
                      setCustomerStatus('Follow up')
                    }

                    setPatientDisposition(v)
                  }}
                />
              </div>

              <div>
                {/* <Label>Review date</Label> */}
                {patientDisposition === "Subject for review" && (
                  <SimpletDatePicker setDate={setReviewDate} date={reviewDate} label="Review Date" />
                )}
              </div>

              {/* <Label>Review date</Label> */}
              {patientDisposition === "Subject for review" && (
                <div>
                  <Label>Review Location</Label>
                  <Input placeholder="Enter review location here" value={reviewLocation} onChange={(e) => setRevieLocation(e.target.value)} />
                </div>
              )}

              {/* <Label>Review date</Label> */}
              {patientDisposition === "Counter-referred" && (
                <div>
                  <SimpletDatePicker setDate={setReferralDate} date={referralDate} label="Referral Date" />
                </div>
              )}

              {/* <Label>Review date</Label> */}
              {patientDisposition === "Counter-referred" && (
                <div>
                  <Label>Referral ocation</Label>
                  <Input placeholder="Enter referral location here" value={referralLocation} onChange={(e) => setReferralLocation(e.target.value)} />
                </div>
              )}

              {/* <Label>Review date</Label> */}
              {patientDisposition === "Follow up" && (
                <div>
                  <SimpletDatePicker setDate={setFollowUpDate} date={followUpDate} label="Referral Date" />
                </div>
              )}

              {patientDisposition === "Follow up" && (
                <div>
                  <SelectComponent
                    name="followUpAction"
                    label="Follow up Action"
                    options={[
                      { value: "Physical Evaluation", label: "Physical Evaluation" },
                      { value: "Care completed", label: "Care completed" },
                      { value: "Next Appointment", label: "Next Appointment" },
                    ]}
                    value={followUpAction}
                    _setValue={(v: any) => {
                      setFollowUpAction(v)
                    }}
                  />
                </div>
              )}

              {/* 
              <SwitchFollowUp
                isFollowUp={isFollowUp}
                setIsFollowUp={setIsFollowUp}
                label="Follow Up"
                sublabel="Is this a follow up discharge?"
                description="If checked, this discharge record will be marked as a follow up."
              /> */}

              {/* <div>
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
              </div> */}

            </div>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />}
              Save Discharge Record
            </Button>
          </div>
        </div>
        <div>
          <h2 className="font-semibold mb-3 text-xs uppercase tracking-wide text-slate-500">Discharge History</h2>
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
          {/* {!fetching && dischargeRecords.length === 0 && <p>No discharge records found for this patient.</p>}
          {!fetching && dischargeRecords.length > 0 && (
            <>
              {dischargeRecords?.map((d, index) => {
                return <DischargeCard data={d} key={index}/>
              })}</>
          )} */}
        </div>
      </div>
    </div>
  );
}
