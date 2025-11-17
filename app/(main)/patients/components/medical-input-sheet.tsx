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
import { LoaderCircleIcon, Plus, Trash } from "lucide-react"
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

    const [clearedForSurgery, setClearedForSurgery] = useState<any>('')
    const [pastMedicalHistory, setPastMedicalHistory] = useState('')
    const [diagnosis, setDiagnosis] = useState<any>()
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [uploadedPhotos, setUploadedPhotos] = useState<UploadedFile[]>([]);
    const [reasonForCancellation, setReasonForCancellation] = useState('')
    const [labExams, setLabExams] = useState<{ testName: string, result: string }[]>([]);


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
                    pastMedicalHistory,
                    diagnosis,
                    labExams,
                    uploadedFiles: uploadedFiles.map((item) => ({
                        name: item.name,
                        base64Url: item.base64Url
                    })),
                    uploadedPhotos: uploadedPhotos.map((item) => ({
                        name: item.name,
                        base64Url: item.base64Url
                    })),
                    clearedForSurgery: clearedForSurgery == 'Yes' ? true : false,
                    reasonForCancellation,
                    doneById: user?.id
                })
            })

            const data = await response.json()

            if (!response.ok) {
                toast.error(data.message || 'Error saving Consultation record')
                return
            }

            toast.success('Consultation record saved')
            setOpen(false)
            refresh()
        } catch (error) {
            console.error(error)
            toast.error('Failed to save Consultation record')
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
                            Add new Consultation record</Button>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto ">
                    <DialogHeader>
                        <DialogTitle>Capture patient's Consultation record</DialogTitle>
                        <DialogDescription>
                            Enter the patient's Consultation record
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
                            <Label>Lab Exams</Label>
                            {labExams.map((exam, index) => (
                                <div key={index} className="flex items-center space-x-2 mt-2">
                                    <Input
                                        placeholder="Test Name"
                                        value={exam.testName}
                                        onChange={(e) => {
                                            const newExams = [...labExams];
                                            newExams[index].testName = e.target.value;
                                            setLabExams(newExams);
                                        }}
                                    />
                                    <Input
                                        placeholder="Result"
                                        value={exam.result}
                                        onChange={(e) => {
                                            const newExams = [...labExams];
                                            newExams[index].result = e.target.value;
                                            setLabExams(newExams);
                                        }}
                                    />
                                    <Button size='icon' variant="destructive" onClick={() => setLabExams(labExams.filter((_, i) => i !== index))}><Trash/></Button>
                                </div>
                            ))}
                            <Button size='icon' variant="outline" className="mt-2 ml-2" onClick={() => setLabExams([...labExams, { testName: '', result: '' }])}><Plus/></Button>
                        </div>

                        <div>
                            <Label>Consent Upload</Label>
                            <FileUpload
                                bucketName="consents"
                                onUploadComplete={(files: FileWithPreview[]) =>
                                    handleFileUpload(files)
                                }
                                success={uploadedFiles.length > 0}
                            />
                        </div>

                        <div>
                            <Label>Photo Upload</Label>
                            <FileUpload
                                bucketName="photos"
                                onUploadComplete={(files: FileWithPreview[]) =>
                                    handlePhotoUpload(files)
                                }
                                success={uploadedPhotos.length > 0}
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