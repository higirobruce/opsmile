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
          medicationsAtDischarge: medicationsAtDischarge.split(',').map(item => item.trim()),
          followUpInstructions,
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
    }
  };

  return (
    <div className="flex flex-col space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h2 className="text-xl font-semibold mb-3">Add New Discharge Record</h2>
          <div className="grid grid-cols-2 gap-5 bg-white p-5 border rounded-md space-y-3">
            <div>
              <Label>Discharge Date</Label>
              <SimpletDatePicker setDate={setDischargeDate} date={dischargeDate} label="" />
            </div>
            <div>
              <Label>Discharge Summary</Label>
              <Textarea
                value={dischargeSummary}
                onChange={(e) => setDischargeSummary(e.target.value)}
                placeholder="Enter discharge summary here..."
              />
            </div>
            <div>
              <Label>Medications at Discharge (comma-separated)</Label>
              <Input
                value={medicationsAtDischarge}
                onChange={(e) => setMedicationsAtDischarge(e.target.value)}
                placeholder="e.g., Paracetamol, Amoxicillin"
              />
            </div>
            <div>
              <Label>Follow-up Instructions</Label>
              <Textarea
                value={followUpInstructions}
                onChange={(e) => setFollowUpInstructions(e.target.value)}
                placeholder="Enter follow-up instructions here..."
              />
            </div>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />}
              Save Discharge Record
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Discharge History</h2>
          {fetching && <p>Loading discharge records...</p>}
          {!fetching && dischargeRecords.length === 0 && <p>No discharge records found for this patient.</p>}
          {!fetching && dischargeRecords.length > 0 && (
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
          )}
        </div>
      </div>
    </div>
  );
}
