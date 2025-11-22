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
    diagnosis: string
    procedure: string
    dischargeDate: string
    dischargeSummary: string
    followUpAction: string
    followUpDate: string
    referralDate: string
    referralLocation: string
    reviewDate: string
    reviewLocation: string
    patientDisposition: string
    doctor: {
        _id: string
        firstName: string
        lastName: string
    }
}


export default function DischargesTimeline({ notes }: { notes: Note[] }) {
    return (
        <Timeline defaultValue={notes.length - 1}>
            {notes.map((item, index) => (
                <TimelineItem key={item._id} step={index} className="bg-white rounded-xl p-2 mb-5">
                    <TimelineHeader>
                        <TimelineSeparator />
                        <TimelineDate className="text-xs flex flex-row justify-between items-baseline">
                            <div>
                                {moment(item.dischargeDate).format('MMM DD, YYYY')}
                            </div>

                            <div >
                                {item.doctor?.firstName} {item.doctor?.lastName}
                            </div>

                        </TimelineDate>
                        <TimelineTitle>
                            <div className="grid grid-cols-2 gap-2">
                                {item.diagnosis && <div>
                                    <p className="text-xs font-semibold">Diagnosis</p>
                                    <p className="text-xs">{item.diagnosis || '-'}</p>
                                </div>}
                                {item.procedure && <div className="mt-2">
                                    <p className="text-xs font-semibold">Procedure</p>
                                    <p className="text-xs">{item.procedure || '-'}</p>
                                </div>}
                                {item.dischargeSummary && <div className="mt-2">
                                    <p className="text-xs font-semibold">Discharge recommendations</p>
                                    <p className="text-xs">{item.dischargeSummary || '-'}</p>
                                </div>}
                                {item.patientDisposition && <div className="mt-2">
                                    <p className="text-xs font-semibold">Patient Disposition</p>
                                    <p className="text-xs">{item.patientDisposition || '-'}</p>
                                </div>}
                                {item.followUpDate && <div className="mt-2">
                                    <p className="text-xs font-semibold">Follow up date</p>
                                    <p className="text-xs">{moment(item.followUpDate).format('YYYY-MMM-DD') || '-'}</p>
                                </div>}

                                {item.followUpAction && <div className="mt-2">
                                    <p className="text-xs font-semibold">Follow up Action</p>
                                    <p className="text-xs">{item.followUpAction || '-'}</p>
                                </div>}
                                {item.reviewDate && <div className="mt-2">
                                    <p className="text-xs font-semibold">Review date</p>
                                    <p className="text-xs">{moment(item.reviewDate).format('YYYY-MMM-DD') || '-'}</p>
                                </div>}
                                {item.reviewLocation && <div className="mt-2">
                                    <p className="text-xs font-semibold">Review Location</p>
                                    <p className="text-xs">{item.reviewLocation || '-'}</p>
                                </div>}

                                {item.referralDate && <div className="mt-2">
                                    <p className="text-xs font-semibold">Review date</p>
                                    <p className="text-xs">{moment(item.referralDate).format('YYYY-MMM-DD') || '-'}</p>
                                </div>}
                                {item.referralLocation && <div className="mt-2">
                                    <p className="text-xs font-semibold">Follow up Action</p>
                                    <p className="text-xs">{item.referralLocation || '-'}</p>
                                </div>}
                            </div>
                        </TimelineTitle>
                        <TimelineIndicator />
                    </TimelineHeader>
                    {/* <TimelineContent className="text-xs text-foreground">{item.notes}</TimelineContent> */}
                </TimelineItem>
            ))}
        </Timeline>
    )
}
