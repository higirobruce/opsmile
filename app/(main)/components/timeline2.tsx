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

const items = [
  {
    id: 1,
    date: "Mar 15, 2024",
    title: "Patient Registered",
    description:
      "Patient ID: 23-000087",
  },
  {
    id: 2,
    date: "Mar 22, 2024",
    title: "Nursing Assessment",
    description:
      "Vitals recorded",
  },
  {
    id: 3,
    date: "Apr 5, 2024",
    title: "Medical Assessment",
    description:
      "Diagnosis: Acute appendicitis. Lab test ordered: CBC.",
  },
  {
    id: 4,
    date: "Apr 19, 2024",
    title: "Lab Result Received",
    description:
      "CBC shows elevated WBC (15.6).",
  }
]

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