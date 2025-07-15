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

export default function SimpleTimeline() {
  return (
    <Timeline defaultValue={4}>
      {items.map((item) => (
        <TimelineItem
          key={item.id}
          step={item.id}
          className="group-data-[orientation=vertical]/timeline:sm:ms-32"
        >
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineDate className="group-data-[orientation=vertical]/timeline:sm:absolute group-data-[orientation=vertical]/timeline:sm:-left-32 group-data-[orientation=vertical]/timeline:sm:w-20 group-data-[orientation=vertical]/timeline:sm:text-right">
              {item.date}
            </TimelineDate>
            <TimelineTitle className="sm:-mt-0.5">{item.title}</TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent>{item.description}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
