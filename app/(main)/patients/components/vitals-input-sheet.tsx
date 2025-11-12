import { useCallback, useEffect, useId, useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { Tag } from "emblor"
import { Textarea } from "@/components/ui/textarea"
import InputTags from "../../components/input-tags"
import { useAuth } from "@/app/context/AuthContext"
import { DialogClose } from "@radix-ui/react-dialog"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'


const steps = [1, 2, 3]
export default function VitalsInput({
    patientData,
    refresh,
}: React.ComponentProps<any>
) {
    const id = useId()
    const { token, user } = useAuth()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [gender, setGender] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [countryOfOrigin, setCountryOfOrigin] = useState('')
    const [status, setStatus] = useState('Active')
    const [currentStep, setCurrentStep] = useState(1)
    const [date, setDate] = useState<Date | undefined>(new Date())
    // const [profilePicture, setProfilePicture] = useState<any>()
    const [submitting, setSubmitting] = useState<boolean>(false)

    const [bloodPressureSystolic, setBloodPressureSystolic] = useState<any>('')
    const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState<any>('')
    const [ownDiagnosisTags, setOwnDiagnosisTags] = useState<Tag[]>([])
    const [healthBarriersTags, setHealthBarriersTags] = useState<Tag[]>([])
    const [height, setHeight] = useState<any>('')
    const [weight, setWeight] = useState<any>('')
    const [temperature, setTemperature] = useState<any>('')
    const [respiratoryRate, setRespiratoryRate] = useState<any>('')
    const [pulseRate, setPulerRate] = useState<any>('')
    const [oxygenSaturation, setOxygenSaturation] = useState<any>('')
    const [nurseNotes, setNurseNotes] = useState<any>('')
    const [bmi, setBmi] = useState<any>('')
    const [addingVitals, setAddingVitals] = useState(false)

    const handleCalculateBMI = useCallback(() => {
        if (height && weight) {
            const bmi = weight / ((height * height) / 10000)
            if (bmi) {
                setBmi(bmi.toFixed(2))
            }
        }
    }, [height, weight])

    useEffect(() => {
        handleCalculateBMI()
    }, [height, weight, handleCalculateBMI])

    const handleSubmit = async () => {
        setSubmitting(true)
        try {
            const response = await fetch(`${API_URL}/vital_signs`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    patientId: patientData?._id,
                    bloodPressureSystolic,
                    bloodPressureDiastolic,
                    height,
                    weight,
                    temperature,
                    respirationRate: respiratoryRate,
                    pulseRate,
                    oxygenSaturation,
                    bmi: weight / (height * height),
                    nurseId: user?.id
                })
            })

            const data = await response.json()
            setSubmitting(false)
            if (!response.ok) {
                toast.error(data.message || 'Error submitting vital signs')
                return
            }

            toast.success('Vital Signs Submitted')
            refresh()
        } catch (error) {
            console.error(error)
            toast.error('Failed to submit vital signs')
        }
    }



    return (
        <div className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto ">
            {/* <h2 className="text-lg font-semibold">Capture patient's vital sigxns</h2> */}
            <div className="grid grid-cols-2 gap-5 bg-white p-5 border rounded-xl space-y-3">
                <div>
                    <Label>Blood Pressure (Systolic)</Label>
                    <Input
                        type="number"
                        value={bloodPressureSystolic?.toString()}
                        onChange={(e) => setBloodPressureSystolic(Number(e.target.value))}
                    />
                </div>

                <div>
                    <Label>Blood Pressure (Diastolic)</Label>
                    <Input
                        type="number"
                        value={bloodPressureDiastolic?.toString()}
                        onChange={(e) => setBloodPressureDiastolic(Number(e.target.value))}
                    />
                </div>

                <div>
                    <Label>Pulse rate</Label>
                    <Input
                        type="number"
                        value={pulseRate?.toString()}
                        onChange={(e) => setPulerRate(Number(e.target.value))}
                    /></div>

                <div>
                    <Label>Respiration rate</Label>
                    <Input
                        type="number"
                        value={respiratoryRate?.toString()}
                        onChange={(e) => setRespiratoryRate(Number(e.target.value))}
                    /></div>

                <div>
                    <Label>Oxygen saturation</Label>
                    <Input
                        type="number"
                        value={oxygenSaturation?.toString()}
                        onChange={(e) => setOxygenSaturation(Number(e.target.value))}
                    /></div>

                <div>
                    <Label>Temperature (°C)</Label>
                    <Input
                        type="number"
                        value={temperature?.toString()}
                        onChange={(e) => setTemperature(Number(e.target.value))}
                    /></div>

                <div>
                    <Label>Height (cm)</Label>
                    <Input
                        type="number"
                        value={height?.toString()}
                        onChange={(e) => setHeight(Number(e.target.value))}
                    /></div>

                <div className="">
                    <Label>Weight (kg)</Label>
                    <Input
                        type="number"
                        value={weight?.toString()}
                        onChange={(e) => setWeight(Number(e.target.value))}
                    />
                </div>
                <div className="mb-4">
                    <Label>BMI</Label>
                    <Input
                        type="number"
                        disabled
                        value={bmi?.toString()}
                    />
                </div>

                <Button onClick={handleSubmit} type="submit" disabled={submitting}>
                    {submitting && <LoaderCircleIcon
                        className="-ms-1 animate-spin"
                        size={16}
                        aria-hidden="true"
                    />}
                    Save vitals
                </Button>



            </div>

        </div>
    )
}