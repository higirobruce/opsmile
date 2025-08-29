import { useEffect, useId, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircleIcon } from "lucide-react";
import SelectComponent from "../../components/select-component";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { SimpletDatePicker } from "@/app/componets/simple-date-picker";
import moment from "moment";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function NewPatient({
  appendNewPatient }: React.ComponentProps<any>) {
  const { token } = useAuth();
  const id = useId();
  const [firstName, setFirstName] = useState("");
  const [guardianFirstName, setGuardianFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [guardianLastName, setGuardianLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [guardianPhoneNumber, setGuardianPhoneNumber] = useState("");
  const [nid, setNID] = useState("");
  const [guardianNID, setGuardianNID] = useState("");
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(moment('01-01-1990').toDate());
  const [guardianDateOfBirth, setGuardianDateOfBirth] = useState<Date | undefined>(moment('01-01-1990').toDate());
  // const [profilePicture, setProfilePicture] = useState<any>()
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [age, setAge] = useState(0);
  const [guardianRelationship, setGuardianRelationship] = useState('')

  const postPatient = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/patients`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          gender,
          phoneNumber,
          nid: nid,
          status: "Active",
          dateOfBirth: dateOfBirth,
          profilePicture: "",
          guardianFirstName: age <= 18 ? guardianFirstName : null,
          guardianLastName: age <= 18 ? guardianLastName : null,
          guardianPhoneNumber: age <= 18 ? guardianPhoneNumber : null,
          guardianNID: age <= 18 ? guardianNID : null,
          guardianDateOfBirth: age <= 18 ? guardianDateOfBirth : null,
          guardianRelationship: age <= 18 ? guardianRelationship : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error creating patient");
        return;
      }

      toast.success("Patient created successfully");
      setOpen(false);
      setCurrentStep(1);
      setGuardianFirstName("");
      setGuardianLastName("");
      setGuardianPhoneNumber("");
      setGuardianNID("");
      setGuardianDateOfBirth(new Date());
      setGuardianRelationship("");
      // Reset form
      setFirstName("");
      setLastName("");
      setMiddleName("");
      setGender("");
      setPhoneNumber("");
      setNID("");

      // Optionally append new patient to list
      if (appendNewPatient) {
        appendNewPatient(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create patient");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCaluculateAge = () => {
    if (dateOfBirth) {
      const age = new Date().getFullYear() - dateOfBirth.getFullYear();
      setAge(age);
    }
  };

  useEffect(() => {
    handleCaluculateAge();
  }, [dateOfBirth]);


  return (
    <>
      <Dialog onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setOpen(true)}>
            Add new Patient
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto ">
          <DialogHeader>
            <DialogTitle>Register a Patient</DialogTitle>
            {/* <DialogDescription>Enter the patients details.</DialogDescription> */}
          </DialogHeader>
          <p className="text-sm font-semibold text-foreground/50">Patient's personal Info</p>
          <div className="grid sm:grid-cols-2 flex-1 auto-rows-min gap-6 px-4 overflow-scroll">

            <div>
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

            <div>
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

            <div>
              <Label htmlFor={`${id}-phoneNumber`}>Phone number</Label>
              <Input
                id={`${id}-phoneNumber`}
                // placeholder="078xxx..."
                name="phoneNumber"
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
              />
            </div>

            <div>
              <Label htmlFor={`${id}-nid`}>NID or Passport</Label>
              <Input
                id={`${id}-nid`}
                name="nid"
                // placeholder="email@example.com"
                type="text"
                required
                value={nid}
                onChange={(e) => {
                  setNID(e.target.value);
                }}
              />
            </div>

            <div>
              <SelectComponent
                _setValue={setGender}
                value={gender}
                name="gender"
                label="Gender"
                options={[
                  { value: "M", label: "Male" },
                  { value: "F", label: "Female" },
                ]}
              />
            </div>
            <div>

              <SimpletDatePicker setDate={setDateOfBirth} date={dateOfBirth} label="Date of Birth" />
            </div>

            <div>
              <SelectComponent
                _setValue={()=>{}}
                value={''}
                name="province"
                label="Province"
                options={[
                  { value: "PROVINCE 1", label: "Province 1" },
                  { value: "PROVINCE 2", label: "Province 2" },
                ]}
              />
            </div>


            <div>
              <SelectComponent
                _setValue={()=>{}}
                value={''}
                name="district"
                label="District"
                options={[
                  { value: "DISTRICT 1", label: "District 1" },
                  { value: "DISTRICT 2", label: "District 2" },
                ]}
              />
            </div>


            <div>
              <SelectComponent
                _setValue={()=>{}}
                value={''}
                name="sector"
                label="Sector"
                options={[
                  { value: "SECTOR 1", label: "Sector 1" },
                  { value: "SECTOR 2", label: "Sector 2" },
                ]}
              />
            </div>

            <div>
              <SelectComponent
                _setValue={()=>{}}
                value={''}
                name="cell"
                label="Cell"
                options={[
                  { value: "CELL 1", label: "Cell 1" },
                  { value: "CELL 2", label: "Cell 2" },
                ]}
              />
            </div>

            <div>
              <SelectComponent
                _setValue={()=>{}}
                value={''}
                name="village"
                label="Village"
                options={[
                  { value: "VILLAGE 1", label: "Village 1" },
                  { value: "VILLAGE 2", label: "Village 2" },
                ]}
              />
            </div>
          </div>

          {age <= 18 && (
            <>
              <p className="text-sm font-semibold mt-4 text-foreground/50">Guardian's Info</p>
              <div className="grid sm:grid-cols-2 flex-1 auto-rows-min gap-6 px-4 overflow-scroll">

                <div>
                  <Label htmlFor={`${id}-guardian-firstName`}>First Name</Label>
                  <Input
                    id={`${id}-guardian-firstName`}
                    name="girdianFirstName"
                    // placeholder="John"
                    type="text"
                    required
                    value={guardianFirstName}
                    onChange={(e) => setGuardianFirstName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor={`${id}-guardian-lastName`}>Last Name</Label>
                  <Input
                    id={`${id}-gurdian-lastName`}
                    name="guardianLastName"
                    // placeholder="Doe"
                    type="text"
                    required
                    value={guardianLastName}
                    onChange={(e) => setGuardianLastName(e.target.value)}
                  />
                </div>

                <div>
                  <SelectComponent
                    _setValue={setGuardianRelationship}
                    value={guardianRelationship}
                    name="guardianRelationship"
                    label="Guardian Relationship"
                    options={[
                      { value: "PARENT", label: "Parent" },
                      { value: "LEGAL GUARDIAN", label: "Legal guardian" },
                      { value: "NEXT OF KIN", label: "Next of kin" },
                      { value: "SPOUSE", label: "Spouse" },
                      { value: "SIBLING", label: "Sibling" },
                    ]}
                  />
                </div>

                <div>
                  {/* <Label htmlFor={`${id}-DateOfBirth`}>Date of Birth</Label>
              <DOBPicker
                onChange={(value) => {
                  setDate(value);
                }}
                value={date}
              /> */}
                  <SimpletDatePicker setDate={setGuardianDateOfBirth} date={guardianDateOfBirth} label="Date of Birth" />
                </div>

                <div>
                  <Label htmlFor={`${id}-guardian-phoneNumber`}>Phone number</Label>
                  <Input
                    id={`${id}-guardian-phoneNumber`}
                    // placeholder="078xxx..."
                    name="guardianPhoneNumber"
                    type="tel"
                    required
                    value={guardianPhoneNumber}
                    onChange={(e) => {
                      setGuardianPhoneNumber(e.target.value);
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor={`${id}-guardian-nid`}>NID or Passport</Label>
                  <Input
                    id={`${id}-guardian-nid`}
                    name="guardianNid"
                    // placeholder="email@example.com"
                    type="text"
                    required
                    value={guardianNID}
                    onChange={(e) => {
                      setGuardianNID(e.target.value);
                    }}
                  />
                </div>




              </div>
            </>


          )}
          <DialogFooter className="mt-2 px-4 pb-4 sm:justify-start">
            <Button
              onClick={postPatient}
              type="submit"
              disabled={
                submitting ||
                !firstName ||
                !lastName ||
                !gender ||
                !phoneNumber ||
                !nid ||
                !dateOfBirth
              }
            >
              {submitting && (
                <LoaderCircleIcon
                  className="-ms-1 animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              )}
              Register
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
