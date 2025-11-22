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


export default function ProgressiveNotesTimeline({ notes }: { notes: Note[] }) {
    return (
        <Timeline defaultValue={notes.length - 1}>
            {notes.map((item, index) => (
                <TimelineItem key={item._id} step={index}>
                    <TimelineHeader>
                        <TimelineSeparator />
                        <TimelineDate className="text-xs flex flex-row justify-between items-baseline">
                            <div>
                                {moment(item.notesDate).format('MMM DD, YYYY')}
                            </div>

                            <div>
                                {item.doneBy?.firstName} {item.doneBy?.lastName}
                            </div>

                        </TimelineDate>
                        <TimelineTitle className="font-semibold">{item.title || ''}</TimelineTitle>
                        <TimelineIndicator />
                    </TimelineHeader>
                    <TimelineContent className="text-xs text-foreground">{item.notes}</TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    )
}
