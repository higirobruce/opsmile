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
import moment from "moment"

export type Note = {
    _id: string
    notes: string
    title: string
    notesDate: string
    createdAt: string
    doneBy: {
        _id: string
        firstName: string
        lastName: string
    }
}

const items = [
    {
        id: 1,
        date: "Mar 15, 2024",
        title: "Project Kickoff",
        description:
            "Initial team meeting and project scope definition. Established key milestones and resource allocation.",
    },
    {
        id: 2,
        date: "Mar 22, 2024",
        title: "Design Phase",
        description:
            "Completed wireframes and user interface mockups. Stakeholder review and feedback incorporated.",
    },
    {
        id: 3,
        date: "Apr 5, 2024",
        title: "Development Sprint",
        description:
            "Backend API implementation and frontend component development in progress.",
    },
    {
        id: 4,
        date: "Apr 19, 2024",
        title: "Testing & Deployment",
        description:
            "Quality assurance testing, performance optimization, and production deployment preparation.",
    },
]

export default function ProgressiveNotesTimeline({ notes }: { notes: Note[] }) {
    return (
        <Timeline defaultValue={notes.length -1}>
            {notes.map((item, index) => (
                <TimelineItem key={item._id} step={index}>
                    <TimelineHeader>
                        <TimelineSeparator />
                        <TimelineDate className="text-xs">{moment(item.notesDate).format('MMM DD, YYYY')}</TimelineDate>
                        <TimelineTitle className="font-semibold">{item.title || ''}</TimelineTitle>
                        <TimelineIndicator />
                    </TimelineHeader>
                    <TimelineContent className="text-xs text-foreground">{item.notes}</TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    )
}
