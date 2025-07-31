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

const steps = [1, 2, 3]
export default function NewPatient({ className,
    appendNewPatient,
    ...props
}: React.ComponentProps<any>
) {
    const id = useId()
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [middleName, setMiddleName] = useState('')
    const [gender, setGender] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [countryOfOrigin, setCountryOfOrigin] = useState('')
    const [status, setStatus] = useState('Active')
    const [open, setOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [date, setDate] = useState<Date | undefined>(new Date())
    // const [profilePicture, setProfilePicture] = useState<any>()
    const [submitting, setSubmitting] = useState<boolean>(false)


    const postPatient = async () => {
        setSubmitting(true)
        supabase.from('patients').insert({
            "firstName": firstName,
            "lastName": lastName,
            "gender": gender,
            "phoneNumber": phoneNumber,
            "email": email,
            "countryOfBirth": "",
            "status": "Active",
            "dateOfBirth": date,
            "profilePicture": ""
        }).single().then((data) => {
            console.log(data)
            setOpen(false)
            setCurrentStep(1)
            setFirstName('')
            setLastName('')
            setGender('')
            setPhoneNumber('')
            setEmail('')
            setCountryOfOrigin('')
            setStatus('Active')
            setSubmitting(false)
            // appendNewPatient(data)
        })
    }
    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="gradient" onClick={() => setOpen(true)}>
                        Add new Patient</Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Register a Patient</SheetTitle>
                        <SheetDescription>
                            Enter the patients details.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid flex-1 auto-rows-min gap-6 px-4 overflow-scroll">

                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-firstName`}>First Name</Label>
                            <Input
                                id={`${id}-firstName`}
                                name="firstName"
                                // placeholder="John"
                                type="text"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-lastName`}>Last Name</Label>
                            <Input
                                id={`${id}-lastName`}
                                name="lastName"
                                // placeholder="Doe"
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-MiddleName`}>Middle Name</Label>
                            <Input
                                id={`${id}-MiddleName`}
                                name="MiddleName"
                                // placeholder="Doe"
                                type="text"
                                required
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                            />
                        </div>


                        <div className="*:not-first:mt-2">
                            <SelectComponent _setValue={setGender} value={gender} name="gender" label='Gender' options={[
                                { value: 'M', label: 'Male' },
                                { value: 'F', label: 'Female' }
                            ]} />
                        </div>

                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-phoneNumber`}>Phone number</Label>
                            <Input
                                id={`${id}-phoneNumber`}
                                // placeholder="078xxx..."
                                name="phoneNumber"
                                type="tel"
                                required
                                value={phoneNumber}
                                onChange={(e) => { setPhoneNumber(e.target.value) }}
                            />
                        </div>

                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-email`}>Email</Label>
                            <Input
                                id={`${id}-email`}
                                name="email"
                                // placeholder="email@example.com"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </div>

                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-DateOfBirth`}>Date of Birth</Label>
                            <DOBPicker onChange={(value) => { setDate(value) }} value={date} />
                        </div>

                        {/* <div>
                            <WebCapture onCapture={setProfilePicture} />
                        </div> */}


                    </div>
                    <SheetFooter>
                        <Button onClick={postPatient} type="submit" disabled={submitting || !firstName || !lastName || !gender || !phoneNumber || !email || !date}>
                            {submitting && <LoaderCircleIcon
                                className="-ms-1 animate-spin"
                                size={16}
                                aria-hidden="true"
                            />}
                            Register
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
