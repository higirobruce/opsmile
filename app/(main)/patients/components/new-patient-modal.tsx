import { useCallback, useEffect, useId, useState } from "react";

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
import Select2 from "../../components/select2";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function NewPatient({
  appendNewPatient, refresh }: React.ComponentProps<any>) {
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
  const [programs, setPrograms] = useState<any[]>([])
  const [patientProgram, setPatientProgram] = useState('')
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [sectors, setSectors] = useState<any[]>([])
  const [cells, setCells] = useState<any[]>([])
  const [villages, setVillages] = useState<any[]>([])
  const [selectedVillage, setSelectedVillage] = useState()
  const [selectedCell, setSelectedCell] = useState()
  const [selectedSector, setSelectedSector] = useState()
  const [selectedProvince, setSelectedProvince] = useState()
  const [selectedDistrict, setSelectedDistrict] = useState()


  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${API_URL}/programs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setPrograms(
          data
            .filter((program: any) =>
              (program.status !== 'inactive' && program.status !== 'completed')
              // && moment(program.startDate).isSameOrBefore(moment())
              && moment(program.endDate).isSameOrAfter(moment())
            )
            .map((program: any) => ({ value: program._id, label: program.name })))
      } catch (error) {
        console.error("Failed to fetch programs:", error)
        toast.error("Failed to load programs")
      }
    }

    const fetchProvinces = async () => {
      try {
        const response = await fetch(`${API_URL}/provinces`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setProvinces(
          data
            .map((province: any) => ({ value: province._id, label: province.name })))
      } catch (error) {
        console.error("Failed to fetch provinces:", error)
        toast.error("Failed to load provinces")
      }
    }
    fetchProvinces()
    fetchPrograms()
  }, [])

  useEffect(() => {
    setSelectedDistrict(undefined)
    setSelectedSector(undefined)
    setSelectedCell(undefined)
    setSelectedVillage(undefined)
    setDistricts([])
    setSectors([])
    setCells([])
    setVillages([])

    const fetchDistricts = async () => {
      try {
        const response = await fetch(`${API_URL}/districts/province/${selectedProvince}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setDistricts(
          data
            .map((district: any) => ({ value: district._id, label: district.name })))
        
      } catch (error) {
        console.error("Failed to fetch districts:", error)
        toast.error("Failed to load districts")
      }
    }
    if (selectedProvince) {
      fetchDistricts()
    }
  }, [selectedProvince])

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        const response = await fetch(`${API_URL}/sectors/district/${selectedDistrict}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setSectors(
          data
            .map((sector: any) => ({ value: sector._id, label: sector.name })))
      } catch (error) {
        console.error("Failed to fetch sectors:", error)
        toast.error("Failed to load sectors")
      }
    }
    if (selectedDistrict) {
      fetchSectors()
    }
  }, [selectedDistrict])

  useEffect(() => {
    const fetchCells = async () => {
      try {
        const response = await fetch(`${API_URL}/cells/sector/${selectedSector}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setCells(
          data
            .map((cell: any) => ({ value: cell._id, label: cell.name })))
      } catch (error) {
        console.error("Failed to fetch cells:", error)
        toast.error("Failed to load cells")
      }
    }
    if (selectedSector) {
      fetchCells()
    }
  }, [selectedSector])

   useEffect(() => {
    const fetchCells = async () => {
      try {
        const response = await fetch(`${API_URL}/villages/cell/${selectedCell}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setVillages(
          data
            .map((village: any) => ({ value: village._id, label: village.name })))
      } catch (error) {
        console.error("Failed to fetch villages:", error)
        toast.error("Failed to load villages")
      }
    }
    if (selectedCell) {
      fetchCells()
    }
  }, [selectedCell])
  
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
          programId: patientProgram,
          province: selectedProvince,
          district: selectedDistrict,
          sector: selectedSector,
          cell: selectedCell,
          village: selectedVillage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Error creating patient");
        return;
      }

      toast.success("Patient created successfully");
      refresh();
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
      setPatientProgram("");
      setSelectedProvince(undefined);
      setSelectedDistrict(undefined);
      setSelectedSector(undefined);
      setSelectedCell(undefined);
      setSelectedVillage(undefined);

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

  const handleCaluculateAge = useCallback(() => {
    if (dateOfBirth) {
      const age = new Date().getFullYear() - dateOfBirth.getFullYear();
      setAge(age);
    }
  }, [dateOfBirth]);

  useEffect(() => {
    handleCaluculateAge();
  }, [dateOfBirth, handleCaluculateAge]);


  return (
    <>
      <Dialog onOpenChange={setOpen} open={open}>
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
                _setValue={setSelectedProvince}
                value={selectedProvince || ''}
                name="province"
                label="Province"
                options={provinces}
              />
            </div>


            <div>
              <SelectComponent
                _setValue={setSelectedDistrict}
                value={selectedDistrict || ''}
                name="district"
                label="District"
                options={districts}
              />
            </div>


            <div>
              <SelectComponent
                _setValue={setSelectedSector}
                value={selectedSector || ''}
                name="sector"
                label="Sector"
                options={sectors}
              />
            </div>

            <div>
              <SelectComponent
                _setValue={setSelectedCell}
                value={selectedCell || ''}
                name="cell"
                label="Cell"
                options={cells}
              />
            </div>

            <div>
              <SelectComponent
                _setValue={setSelectedVillage}
                value={selectedVillage || ''}
                name="village"
                label="Village"
                options={villages}
              />
            </div>


            <div>
              <SelectComponent
                _setValue={setPatientProgram}
                value={patientProgram}
                name="patientProgram"
                label="Program"
                options={programs}
              />
            </div>
            <div></div>
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
                !dateOfBirth || !patientProgram
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