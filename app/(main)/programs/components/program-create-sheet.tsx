import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { useAuth } from "@/app/context/AuthContext"
import SelectComponent from "../../components/select-component"
import { SimpletDatePicker } from "@/app/componets/simple-date-picker"
import moment from "moment"
import { Toaster } from "@/components/ui/sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

interface ProgramCreateSheetProps {
  refreshPrograms: () => void;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
}

export default function ProgramCreateSheet({ refreshPrograms }: ProgramCreateSheetProps) {
  const { token, user } = useAuth()
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState<boolean>(false)

  // Program props from programTables.tsx
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(moment().toDate())
  const [endDate, setEndDate] = useState<Date | undefined>(moment().toDate())
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('')
  const [coordinators, setCoordinators] = useState<User[]>([])
  const [selectedCoordinatorId, setSelectedCoordinatorId] = useState<string>('')
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [sectors, setSectors] = useState<any[]>([])
  const [cells, setCells] = useState<any[]>([])
  const [villages, setVillages] = useState<any[]>([])
  const [selectedVillage, setSelectedVillage] = useState('')
  const [selectedCell, setSelectedCell] = useState('')
  const [selectedSector, setSelectedSector] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  const fetchCoordinators = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (response.ok) {
        setCoordinators(data)
      } else {
        toast.error(data.message || 'Failed to fetch coordinators')
      }
    } catch (error) {
      console.error('Error fetching coordinators:', error)
      toast.error('Failed to fetch coordinators')
    }
  }, [token])

  useEffect(() => {
    if (open) {
      fetchCoordinators()

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
    }
  }, [open, fetchCoordinators])


  useEffect(() => {
    setSelectedDistrict('')
    setSelectedSector('')
    setSelectedCell('')
    setSelectedVillage('')
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

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      if (!name || !startDate || !selectedProvince || !selectedDistrict || !selectedSector || !selectedCell || !selectedVillage || !selectedCoordinatorId) {
        toast.error("Please fill in all required fields (Name, Start Date, Province, District, Sector, Cell, Village, Coordinator)")
        return
      }

      const response = await fetch(`${API_URL}/programs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          description,
          startDate,
          endDate,
          createdById: user?.id,
          coordinatorId: selectedCoordinatorId,
          province: selectedProvince,
          district: selectedDistrict,
          sector: selectedSector,
          cell: selectedCell,
          village: selectedVillage,
        })
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Error creating program')
        return
      }

      toast.success('Program created successfully')
      setOpen(false)
      // Reset form fields
      setName('')
      setDescription('')
      setStartDate(moment().toDate())
      setEndDate(moment().toDate())
      setLocation('')
      setStatus('')
      setSelectedCoordinatorId('')
      // Refresh programs list
      refreshPrograms()
    } catch (error) {
      console.error(error)
      toast.error('Failed to create program')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <Toaster />
      <SheetTrigger asChild>
        <Button variant="default">Add New Program</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create New Program</SheetTitle>
          <SheetDescription>
            Enter details for the new program
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col space-y-2 gap-6 px-4 mt-4">
          {/* Required fields */}
          <div className="flex flex-col space-y-4">
            <Label>Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Program name"
            />
          </div>

          <div className="flex flex-col">
            {/* <Label>Start Date *</Label> */}

            <SimpletDatePicker
              label="Start Date"
              date={startDate}
              setDate={setStartDate}
            />
          </div>

          <div>
            {/* <Label>End Date</Label> */}
            <SimpletDatePicker
              label="End Date"
              date={endDate}
              setDate={setEndDate}
            />

          </div>


          <div>
            <SelectComponent
              _setValue={setSelectedProvince}
              value={selectedProvince}
              name="province"
              label="Province"
              options={provinces}
            />
          </div>


          <div>
            <SelectComponent
              _setValue={setSelectedDistrict}
              value={selectedDistrict}
              name="district"
              label="District"
              options={districts}
            />
          </div>


          <div>
            <SelectComponent
              _setValue={setSelectedSector}
              value={selectedSector}
              name="sector"
              label="Sector"
              options={sectors}
            />
          </div>

          <div>
            <SelectComponent
              _setValue={setSelectedCell}
              value={selectedCell}
              name="cell"
              label="Cell"
              options={cells}
            />
          </div>

          <div>
            <SelectComponent
              _setValue={setSelectedVillage}
              value={selectedVillage}
              name="village"
              label="Village"
              options={villages}
            />
          </div>



          <div>
            <SelectComponent
              label="Coordinator *"
              _setValue={setSelectedCoordinatorId}
              value={selectedCoordinatorId}
              name="coordinator"
              options={coordinators.map(coordinator => ({
                value: coordinator._id,
                label: `${coordinator.firstName} ${coordinator.lastName}`
              }))}
            />
          </div>

          <div className="sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Program description"
              rows={4}
            />
          </div>
        </div>
        <SheetFooter className="px-4 pb-4 sm:justify-start mt-6">
          <Button onClick={handleSubmit} type="submit" disabled={submitting}>
            {submitting && <LoaderCircleIcon
              className="-ms-1 animate-spin"
              size={16}
              aria-hidden="true"
            />}
            Create Program
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}