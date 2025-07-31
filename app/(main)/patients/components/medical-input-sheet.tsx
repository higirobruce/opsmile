import { useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Stepper,
    StepperIndicator,
    StepperItem,
    StepperSeparator,
    StepperTrigger,
} from "@/components/ui/stepper"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { LoaderCircleIcon, PlusIcon } from "lucide-react"
import { Select } from "@/components/ui/select"
import SelectComponent from "../../components/select-component"
import { stat } from "fs"
import { json } from "stream/consumers"
import { supabase } from "@/lib/supabase-client"
import DOBPicker from "./date-of-birth-picker"
import WebCapture from "./web-capture"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Tag } from "emblor"
import { Textarea } from "@/components/ui/textarea"
import InputTags from "../../components/input-tags"

const steps = [1, 2, 3]
export default function MedicalInputSheet({ className,
    appendNewPatient,
    patientData,
    refresh,
    ...props
}: React.ComponentProps<any>
) {
    const id = useId()
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState<boolean>(false)

    const [chiefComplaint, setChiefComplaint] = useState<any>('')
    const [pastMedicalHistory, setPastMedicalHistory] = useState<Tag[]>([])
    const [currentMedication, setCurrentMedication] = useState<Tag[]>([])
    const [allergies, setAllergies] = useState<Tag[]>([])
    const [provisionalDiagnosis, setProvisionalDiagnosis] = useState<Tag[]>([])
    const [clinicalNotes, setClinicalNotes] = useState<any>()

    const handleSubmit = async () => {
        const { error } = await supabase.from('medical_assessments').insert({
            patient_id: patientData?.id,
            chief_complaint: chiefComplaint,
            past_medical_history: pastMedicalHistory?.map((tag: any) => tag?.text),
            current_medication: currentMedication?.map((tag: any) => tag?.text),
            allergies: allergies?.map((tag: any) => tag?.text),
            provisional_diagnosis: provisionalDiagnosis?.map((tag: any) => tag?.text),
            clinical_notes: clinicalNotes

        })
        if (error) {
            console.log(error)
        }
        toast.success('Medical assessment saved')
        refresh()
    }

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <div>
                        <Button variant="outline" onClick={() => setOpen(true)}>
                            Add new medical assessment</Button>
                    </div>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Capture patient's medical assessment</SheetTitle>
                        <SheetDescription>
                            Enter the patient's medical assessment
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-6 px-4 overflow-scroll">

                        <div>
                            <Label>Chief complaint</Label>
                            <Input
                                type="text"
                                value={chiefComplaint?.toString()}
                                onChange={(e) => setChiefComplaint(e.target.value)}
                            />
                        </div>

                        <div>
                            {/* <Label>Past Medical History</Label> */}
                            <div>
                                <InputTags label="Past Medical History" inputTags={pastMedicalHistory} setInputTags={setPastMedicalHistory} />
                            </div>
                        </div>

                        <div>
                            {/* <Label>Current Medication</Label> */}
                            <div>
                                <InputTags label="Current Medication" inputTags={currentMedication} setInputTags={setCurrentMedication} />
                            </div>
                        </div>

                        <div>
                            {/* <Label>Allergies</Label> */}
                            <div>
                                <InputTags label="Allergies" inputTags={allergies} setInputTags={setAllergies} />
                            </div>
                        </div>

                        <div>
                            <Label>Clinical Notes</Label>
                            <Textarea
                                value={clinicalNotes}
                                onChange={(e) => setClinicalNotes(e.target.value)}
                            />
                        </div>

                        <div>
                            {/* <Label>Provisional Diagnosis</Label> */}
                            <div>
                                <InputTags label="Provisional Diagnosis" inputTags={provisionalDiagnosis} setInputTags={setProvisionalDiagnosis} />
                            </div>
                        </div>


                    </div>
                    <SheetFooter>
                        <Button onClick={handleSubmit} type="submit" disabled={submitting}>
                            {submitting && <LoaderCircleIcon
                                className="-ms-1 animate-spin"
                                size={16}
                                aria-hidden="true"
                            />}
                            Save
                        </Button>
                        <SheetClose asChild>
                            <Button variant="outline">Close</Button>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

        </>
    )
}
