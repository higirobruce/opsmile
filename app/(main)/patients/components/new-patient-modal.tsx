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
    const [fistName, setFirstName] = useState('')
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
    const [profilePicture, setProfilePicture] = useState<any>()
    const [submitting, setSubmitting] = useState<boolean>(false)


    const postPatient = async () => {
       setSubmitting(true)
        supabase.from('patients').insert({
            "firstName": fistName,
            "lastName": lastName,
            "gender": gender,
            "phoneNumber": phoneNumber,
            "email": email,
            "countryOfBirth": countryOfOrigin,
            "status": "Active",
            "dateOfBirth": date,
            "profilePicture": profilePicture
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
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogTrigger asChild>
                <Button variant="gradient" onClick={() => setOpen(true)}>
                    {/* <PlusIcon
                        className="-ms-1 opacity-60"
                        size={16}
                        aria-hidden="true"
                    /> */}
                    Add new Patient</Button>
            </DialogTrigger>
            <DialogContent>
                <div className="flex flex-col items-center gap-2 overflow-scroll">
                    {/* <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div> */}
                    <DialogHeader>
                        <DialogTitle className="sm:text-center">Register a Patient</DialogTitle>
                        <DialogDescription className="sm:text-center">
                            Enter the patients details.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className=" space-y-8 text-center">
                    <Stepper value={currentStep} onValueChange={setCurrentStep}>
                        {steps.map((step) => (
                            <StepperItem key={step} step={step} className="not-last:flex-1">
                                <StepperTrigger asChild>
                                    <StepperIndicator
                                        asChild
                                    >
                                        <span>{step}</span>
                                    </StepperIndicator>
                                </StepperTrigger>
                                {step < steps.length && <StepperSeparator />}
                            </StepperItem>
                        ))}
                    </Stepper>
                    <div className="text-sm font-medium tabular-nums">
                        {currentStep == 1 && (
                            <div className="flex flex-col text-start space-y-5">
                                <div className="*:not-first:mt-2">
                                    <Label htmlFor={`${id}-firstName`}>First Name</Label>
                                    <Input
                                        id={`${id}-firstName`}
                                        name="firstName"
                                        // placeholder="John"
                                        type="text"
                                        required
                                        value={fistName}
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
                                    <Label htmlFor={`${id}-DateOfBirth`}>Date of Birth</Label>
                                    <DOBPicker onChange={(value) => { setDate(value) }} value={date} />
                                </div>

                            </div>
                        )}

                        {currentStep == 2 && (
                            <div className="flex flex-col text-start space-y-5">

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
                                </div></div>
                        )}

                        {currentStep == 3 && (
                            <div className="flex flex-col text-start space-y-5">
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
                                    <SelectComponent _setValue={setCountryOfOrigin} value={countryOfOrigin} name="contryOfBirth" label='Country of birth' options={[
                                        { value: 'RWA', label: 'Rwanda' },
                                        { value: 'UGA', label: 'Uganda' },
                                        { value: 'BUR', label: 'Burundi' }
                                    ]} />
                                </div>

                                <div>
                                    <SelectComponent _setValue={setStatus} value={status} name="status" label='Status' options={[
                                        { value: 'Active', label: 'Active' },
                                        { value: 'Inactive', label: 'Inactive' }
                                    ]} />
                                </div>

                                <div>
                                    <WebCapture onCapture={setProfilePicture} />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-center space-x-4">
                        <Button
                            variant="outline"
                            className="w-32"
                            onClick={() => setCurrentStep((prev) => prev - 1)}
                            disabled={currentStep === 1}
                        >
                            Prev step
                        </Button>
                        <Button
                            variant="outline"
                            className="w-32"
                            onClick={() => setCurrentStep((prev) => prev + 1)}
                            disabled={currentStep == steps.length}
                        >
                            Next step
                        </Button>
                    </div>

                </div>

                <Button onClick={postPatient} className="w-full" disabled={currentStep < steps.length || submitting}>
                    {submitting && <LoaderCircleIcon
                        className="-ms-1 animate-spin"
                        size={16}
                        aria-hidden="true"
                    />}
                    Register
                </Button>

                <form className="space-y-5"
                // onSubmit={async (e) => {
                //     e.preventDefault()
                //     var myHeaders = new Headers();
                //     myHeaders.append("Content-Type", "application/json");

                //     fetch("http://localhost:9999/patients", {
                //         method: 'POST',
                //         headers: myHeaders,
                //         body: raw,
                //         redirect: 'follow'
                //     })
                //         .then(response => response.json())
                //         .then(result => {
                //             console.log(result)
                //             setOpen(false)
                //             appendNewPatient(result)
                //         })
                //         .catch(error => console.log('error', error));
                // }}

                >
                    {/* 
                    <div className="space-y-4">
                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-firstName`}>First Name</Label>
                            <Input
                                id={`${id}-firstName`}
                                name="firstName"
                                placeholder="John"
                                type="text"
                                required
                                value={fistName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>

                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-lastName`}>Last Name</Label>
                            <Input
                                id={`${id}-lastName`}
                                name="lastName"
                                placeholder="Doe"
                                type="text"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="*:not-first:mt-2">
                            <SelectComponent _setValue={setGender} name="gender" label='Gender' options={[
                                { value: 'M', label: 'Male' },
                                { value: 'F', label: 'Female' }
                            ]} />
                        </div>

                        <div className="*:not-first:mt-2">
                            <Label htmlFor={`${id}-phoneNumber`}>Phone number</Label>
                            <Input
                                id={`${id}-phoneNumber`}
                                placeholder="078xxx..."
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
                                placeholder="email@example.com"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </div>
                        <div className="*:not-first:mt-2">
                            <SelectComponent _setValue={setCountryOfOrigin} name="contryOfBirth" label='Country of birth' options={[
                                { value: 'RWA', label: 'Rwanda' },
                                { value: 'UGA', label: 'Uganda' },
                                { value: 'BUR', label: 'Burundi' }
                            ]} />
                        </div>

                        <div>
                            <SelectComponent _setValue={setStatus} name="status" label='Status' options={[
                                { value: 'Active', label: 'Active' },
                                { value: 'Inactive', label: 'Inactive' }
                            ]} />
                        </div>
                    </div> */}




                </form>

                {/* <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
          <span className="text-muted-foreground text-xs">Or</span>
        </div>

        <Button variant="outline">Login with Google</Button> */}
            </DialogContent>
        </Dialog>
    )
}
