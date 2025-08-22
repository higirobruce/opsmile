import { useId, useState } from "react"

import { Button } from "@/components/ui/button"

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
import { LoaderCircleIcon } from "lucide-react"
import { toast } from "sonner"
import { Tag } from "emblor"
import { Textarea } from "@/components/ui/textarea"
import InputTags from "../../components/input-tags"
import { useAuth } from "@/app/context/AuthContext"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DialogClose } from "@radix-ui/react-dialog"
import SelectComponent from "../../components/select-component"
import MultiSelect from "../../components/multi-select"
import FileUpload from "../../components/file-upload"
import { FileWithPreview } from "@/hooks/use-file-upload"
import { fileToBase64, UploadedFile } from "./surgery-input-sheet"
import { Option } from "@/components/ui/multiselect"
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'


export default function MedicalInputSheet({ className,
    appendNewPatient,
    patientData,
    refresh }: React.ComponentProps<any>
) {
    const { token, user } = useAuth()
    const [open, setOpen] = useState(false)
    const [submitting, setSubmitting] = useState<boolean>(false)

    const [chiefComplaint, setChiefComplaint] = useState<any>('')
    const [clearedForSurgery, setClearedForSurgery] = useState<any>('')
    const [pastMedicalHistory, setPastMedicalHistory] = useState('')
    const [currentMedication, setCurrentMedication] = useState<string>('')
    const [allergies, setAllergies] = useState<Tag[]>([])
    const [provisionalDiagnosis, setProvisionalDiagnosis] = useState<Tag[]>([])
    const [diagnosis, setDiagnosis] = useState<any>()
    const [proposedProcedure, setProposedProcedure] = useState<any>()
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [uploadedPhotos, setUploadedPhotos] = useState<UploadedFile[]>([]);
    const [reasonForCancellation, setReasonForCancellation] = useState('')
    const [labRequests, setLabRequests] = useState<Option[]>([])


    const handleFileUpload = async (files: FileWithPreview[]) => {
        try {
            const filePromises = files.map(async (file) => {
                const base64Url = await fileToBase64(file.file as File);
                return {
                    name: file.file.name,
                    base64Url,
                };
            });

            const processedFiles = await Promise.all(filePromises);
            setUploadedFiles((prev) => [...prev, ...processedFiles]);
        } catch (error) {
            console.error("Error processing files:", error);
            toast.error("Error processing files");
        }
    };

    const handlePhotoUpload = async (files: FileWithPreview[]) => {
        try {
            const filePromises = files.map(async (file) => {
                const base64Url = await fileToBase64(file.file as File);
                return {
                    name: file.file.name,
                    base64Url,
                };
            });

            const processedPhotos = await Promise.all(filePromises);
            setUploadedPhotos((prev) => [...prev, ...processedPhotos]);
        } catch (error) {
            console.error("Error processing files:", error);
            toast.error("Error processing files");
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true)
        try {
            const response = await fetch(`${API_URL}/medical-assessment`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    patientId: patientData?._id,
                    chief_complaint: chiefComplaint,
                    past_medical_history: pastMedicalHistory,
                    allergies: allergies?.map((tag: Tag) => tag?.text),
                    provisional_diagnosis: provisionalDiagnosis?.map((tag: Tag) => tag?.text),

                    doneById: user?.id
                })
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.message || 'Error saving medical assessment')
                return
            }

            toast.success('Medical assessment saved')
            setOpen(false)
            refresh()
        } catch (error) {
            console.error(error)
            toast.error('Failed to save medical assessment')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <Dialog onOpenChange={setOpen} open={open}>
                <DialogTrigger asChild>
                    <div>
                        <Button variant="outline" onClick={() => setOpen(true)}>
                            Add new medical assessment</Button>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                    <DialogHeader>
                        <DialogTitle>Capture patient's medical assessment</DialogTitle>
                        <DialogDescription>
                            Enter the patient's medical assessment
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid sm:grid-cols-2 flex-1 auto-rows-min gap-6 px-4 overflow-scroll">

                        <div>
                            <Label>Medical History</Label>
                            <Textarea
                                value={pastMedicalHistory}
                                onChange={(e) => setPastMedicalHistory(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Diagnosis</Label>
                            <Textarea
                                value={diagnosis}
                                onChange={(e) => setDiagnosis(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Proposed procedure</Label>
                            <Textarea
                                value={proposedProcedure}
                                onChange={(e) => setProposedProcedure(e.target.value)}
                            />
                        </div>

                        <div>
                            <MultiSelect setOptions={setLabRequests} label="Lab requests" options={[
                                {
                                    value: 'HEMATOLOGY',
                                    label: 'Hematology'
                                },
                                {
                                    value: 'BIOCHEMISTRY',
                                    label: 'Biochemistry'
                                },
                                {
                                    value: 'INFECTION-SCREENING',
                                    label: 'Infection screening'
                                },
                                {
                                    value: 'URINALYSIS',
                                    label: 'Urinalysis'
                                },
                                {
                                    value: 'CHEST-XRAY',
                                    label: 'Chest X-Ray'
                                },
                                {
                                    value: 'ECG',
                                    label: 'Ecg'
                                },
                                {
                                    value: 'ECHOCARDIOGRAM',
                                    label: 'Echocardiogram'
                                }

                            ]} />
                        </div>

                        <div>
                            <Label>Consent Upload</Label>
                            <FileUpload
                                bucketName="consents"
                                onUploadComplete={(files: FileWithPreview[]) =>
                                    handleFileUpload(files)
                                }
                            />
                        </div>

                        <div>
                            <Label>Photo Upload</Label>
                            <FileUpload
                                bucketName="photos"
                                onUploadComplete={(files: FileWithPreview[]) =>
                                    handlePhotoUpload(files)
                                }
                            />
                        </div>


                        <div>
                            <SelectComponent
                                _setValue={setClearedForSurgery}
                                value={clearedForSurgery}
                                name="clearedForSurgery"
                                label="Cleared for surgery"
                                options={[
                                    { value: "Yes", label: "Yes" },
                                    { value: "No", label: "No" },

                                ]}
                            />
                        </div>

                        {clearedForSurgery == 'No' &&
                            <div>
                                <Label>Reason for Cancellation</Label>
                                <Textarea
                                    value={reasonForCancellation}
                                    onChange={(e) => setReasonForCancellation(e.target.value)}
                                />
                            </div>}

                    </div>
                    <DialogFooter className=" px-4 pb-4 sm:justify-start">
                        <Button onClick={handleSubmit} type="submit" disabled={submitting}>
                            {submitting && <LoaderCircleIcon
                                className="-ms-1 animate-spin"
                                size={16}
                                aria-hidden="true"
                            />}
                            Save
                        </Button>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    )
}
