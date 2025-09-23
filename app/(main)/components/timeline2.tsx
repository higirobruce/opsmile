import { useAuth } from "@/app/context/AuthContext";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline"
import moment from "moment";
import { useCallback, useState } from "react"
import { useEffect } from "react"


const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";



export default function SimpleTimeline({ patientId }: { patientId: string }) {
  const [patientData, setPatientData] = useState<any>(null)
  const { token } = useAuth();

  const getActionLogsByPatientId = useCallback(async (patientId: string) => {
    const response = await fetch(`${API_URL}/activity-log/patient/${patientId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    if (!response.ok) {
      console.log(response.statusText)
      throw new Error("Failed to fetch action logs", {
        cause: response
      })
    }
    return response.json()
  }, [token]);

  useEffect(() => {
    getActionLogsByPatientId(patientId).then((data) => {
      setPatientData(data)
    })
  }, [patientId, getActionLogsByPatientId])

  if (!patientData) {
    return null
  }

  return (
    <Timeline defaultValue={4}>
      {patientData.map((item: any) => (
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
            <TimelineTitle className="sm:-mt-0.5">{item.action}</TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent>{item.description || ''}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}