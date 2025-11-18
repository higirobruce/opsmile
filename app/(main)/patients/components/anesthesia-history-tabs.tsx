import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import AnesthesiaRecordCard from "./anesthesia-card"
import { SimpletDatePicker } from "@/app/componets/simple-date-picker"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import FileUpload from "../../components/file-upload"
import { FileWithPreview } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
import { LoaderCircleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import moment from "moment"
import { toast, Toaster } from "sonner"
import { useAuth } from "@/app/context/AuthContext"
import ProgressiveNotesTimeline, { Note } from "./progressive-note-timeline"
import { Input } from "@/components/ui/input"
import SelectComponent from "../../components/select-component"


let API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

export default function AnesthesiaHistoryTabs({ patientData }: { patientData: any }) {
    const [submitting, setSubmitting] = useState(false)
    const [date, setDate] = useState<Date | undefined>(moment().toDate())
    const [notes, setNotes] = useState("")
    const [title, setTitle] = useState("")
    const { user } = useAuth()
    const [progressiveNotes, setProgressiveNotes] = useState<Note[]>([])
    const [noteType, setNoteType] = useState('')


    useEffect(() => {
        getProgressiveNotes()
    }, [patientData?.id])

    async function getProgressiveNotes() {
        const res = await fetch(`${API_URL}/progressive-notes/patient/${patientData?._id}/type/ANESTHESIA_NOTES`)
        const data = await res.json()
        setProgressiveNotes(data)

        console.log('progressiveNotes', progressiveNotes)
        return data
    }

    async function handleSubmit() {
        setSubmitting(true)
        fetch(`${API_URL}/progressive-notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                patient: patientData?.id,
                doneBy: user?.id,
                type: "ANESTHESIA_NOTES",
                date: date?.toISOString(),
                notes,
                title
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data._id) {
                    console.log('------', data)
                    toast.error(data.message || "Error adding anesthesia notes");
                    return;
                }
                getProgressiveNotes()
                toast.success("Anesthesia notes added successfully");
            })
            .finally(() => setSubmitting(false))
    }

    return (
        <Tabs defaultValue="tab-1" className="items-start w-full">
            <Toaster />
            <TabsList className="h-auto rounded-none border-b bg-transparent p-0">
                <TabsTrigger
                    value="tab-1"
                    className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                >
                    Anesthesia History
                </TabsTrigger>
                <TabsTrigger
                    value="tab-2"
                    className="relative rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
                >
                    Anesthesia Notes
                </TabsTrigger>

            </TabsList>
            <TabsContent value="tab-1">
                {patientData?.anesthesia_records?.length === 0 && <p>No anesthesia records found for this patient.</p>}
                {patientData?.anesthesia_records?.length > 0 && (
                    <div className="h-[calc(100vh-200px)] overflow-scroll p-5 border rounded-xl bg-white">
                        {patientData?.anesthesia_records?.map(
                            (an: any, index: any) => (
                                <AnesthesiaRecordCard
                                    key={index}
                                    record={an}
                                />
                            )
                        )}
                    </div>
                )}
            </TabsContent>
            <TabsContent value="tab-2">
                <div className="overflow-scroll p-5 border rounded-xl bg-white space-y-3 w-xl flex-1">
                    <div>
                        <SimpletDatePicker setDate={setDate} date={date} label="Date" />
                    </div>

                    <div>
                        <Label>Title</Label>
                        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div>
                        <SelectComponent
                            _setValue={setNoteType}
                            label="Note type"
                            name="noteType"
                            options={[
                                {value:'ANESTHESIA_NOTES', label:'Anesthesia note'},
                                // {value:'SURGICAL_NOTES', label:'Surgical note'},
                                // {value:'NURSING_NOTES', label:'Nursing note'}
                            ]}
                            value={noteType}
                        />
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

                <div className="mt-2 p-4">
                    <ProgressiveNotesTimeline notes={progressiveNotes} />
                </div>
            </TabsContent>

        </Tabs>
    )
}
