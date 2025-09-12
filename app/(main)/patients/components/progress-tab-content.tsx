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

export default function ProgressTabContent({
  patientData,
  refresh,
}: {
  patientData: any;
  refresh: () => void;
}) {
  const { token, user } = useAuth();
  const [progressNotes, setProgressNotes] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const fetchProgressNotes = useCallback(async () => {
    setFetching(true);
    try {
      const response = await fetch(`${API_URL}/progress/patient/${patientData?._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error fetching progress notes");
        return;
      }

      setProgressNotes(data);
      setFetching(false);
    } catch (error) {
      setFetching(false);
      console.error(error);
      toast.error("Failed to fetch progress notes");
    }
  }, [patientData?._id, token]);

  useEffect(() => {
    fetchProgressNotes();
  }, [fetchProgressNotes]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/progress`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: patientData?._id,
          doctorId: user?.id,
          date,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error saving progress note");
        return;
      }

      toast.success("Progress note saved successfully");
      setNotes("");
      setDate(new Date());
      fetchProgressNotes();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save progress note");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h2 className="text-xl font-semibold mb-3">Add New Progress Note</h2>
          <div className="space-y-3">
            <div>
              <Label>Date</Label>
              <SimpletDatePicker setDate={setDate} date={date} label="" />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter progress notes here..."
              />
            </div>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <LoaderCircleIcon className="-ms-1 animate-spin" size={16} aria-hidden="true" />}
              Save Progress Note
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Progress History</h2>
          {fetching && <p>Loading progress notes...</p>}
          {!fetching && progressNotes.length === 0 && <p>No progress notes found for this patient.</p>}
          {!fetching && progressNotes.length > 0 && (
            <Timeline defaultValue={progressNotes.length}>
              {progressNotes.map((item: any) => (
                <TimelineItem
                  key={item._id}
                  step={item._id}
                  className="group-data-[orientation=vertical]/timeline:sm:ms-32"
                >
                  <TimelineHeader>
                    <TimelineSeparator />
                    <TimelineDate className="group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-32 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">
                      {moment(item.date).format("MMM D, YYYY")}
                    </TimelineDate>
                    <TimelineTitle className="sm:-mt-0.5">{item.notes}</TimelineTitle>
                    <TimelineIndicator />
                  </TimelineHeader>
                  <TimelineContent>
                    <p className="text-sm text-muted-foreground">Doctor: {item.doctor.firstName} {item.doctor.lastName}</p>
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
