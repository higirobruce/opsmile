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
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('')
  const [coordinators, setCoordinators] = useState<User[]>([])
  const [selectedCoordinatorId, setSelectedCoordinatorId] = useState<string>('')

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
    }
  }, [open, fetchCoordinators])

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      if (!name || !startDate || !location || !status || !selectedCoordinatorId) {
        toast.error("Please fill in all required fields (Name, Start Date, Location, Status, Coordinator)")
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
          location,
          status,
          createdById: user?.id,
          coordinatorId: selectedCoordinatorId
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
      setStartDate('')
      setEndDate('')
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
        <div className="grid sm:grid-cols-2 gap-6 px-4 mt-4">
          {/* Required fields */}
          <div>
            <Label>Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Program name"
            />
          </div>

          <div>
            <Label>Start Date *</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <Label>Location *</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Program location"
            />
          </div>

          <div>
            {/* <Label>Status *</Label> */}
            <SelectComponent
            label="Status *"
              _setValue={setStatus}
              value={status}
              name="programStatus"
              options={[
                { value: "active", label: "Active" },
                { value: "upcoming", label: "Upcoming" },
                { value: "completed", label: "Completed" }
              ]}
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