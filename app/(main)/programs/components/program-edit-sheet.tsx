'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import SelectComponent from '@/app/(main)/components/select-component';
// import { Program, User } from '@/lib/types'; // Assuming Program and User types are defined here or similar
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import { SimpletDatePicker } from '@/app/componets/simple-date-picker';
import moment from 'moment';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  name: string; // Assuming a name property for display in SelectComponent
  id: string; // Assuming an id property for value in SelectComponent
}

export interface Program {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  province: { name: string; code: string, _id:string };
  district: { name: string; code: string, _id:string };
  sector: { name: string; code: string, _id:string };
  cell: { name: string; code: string, _id:string };
  village: { name: string; code: string, _id:string };
  status: string;
  coordinator: {
    _id: string,
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  patients: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string;
    nid: string;
  }[];
}

interface ProgramEditSheetProps {
  program: Program;
  onSave: () => void;
  children: React.ReactNode;
}


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export function ProgramEditSheet({ program, onSave, children }: ProgramEditSheetProps) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(program.name);
  const [description, setDescription] = useState(program.description || '');
  const [startDate, setStartDate] = useState<Date | undefined>(
    moment(program.startDate).toDate() || moment().toDate(),
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    moment(program.endDate).toDate() || moment().toDate(),
  );
  const [location, setLocation] = useState(program.location || '');
  const [status, setStatus] = useState(program.status);
  const [coordinators, setCoordinators] = useState<User[]>([]);
  const [selectedCoordinatorId, setSelectedCoordinatorId] = useState<string>(
    program.coordinator?._id || '',
  );
  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [sectors, setSectors] = useState<any[]>([])
  const [cells, setCells] = useState<any[]>([])
  const [villages, setVillages] = useState<any[]>([])
  const [selectedVillage, setSelectedVillage] = useState(program.village?._id || '')
  const [selectedCell, setSelectedCell] = useState(program.cell?._id || '')
  const [selectedSector, setSelectedSector] = useState(program.sector?._id || '')
  const [selectedProvince, setSelectedProvince] = useState(program.province?._id || '')
  const [selectedDistrict, setSelectedDistrict] = useState(program.district?._id || '')

  const fetchCoordinators = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }); // Adjust API endpoint as needed
      if (!response.ok) {
        throw new Error('Failed to fetch coordinators');
      }
      const data: User[] = await response.json();
      setCoordinators(data);
    } catch (error) {
      console.error('Error fetching coordinators:', error);
      toast.error('Failed to load coordinators.');
    }
  }, []);

  useEffect(() => {
    if (open) {
      fetchCoordinators();

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
  }, [open, fetchCoordinators]);

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

  useEffect(() => {
    setName(program.name);
    setDescription(program.description || '');
    setStartDate(moment(program.startDate).toDate() || moment().toDate());
    setEndDate(moment(program.endDate).toDate() || moment().toDate());
    setLocation(program.location || '');
    setStatus(program.status);
    setSelectedCoordinatorId(program.coordinator?._id || '');
  }, [program]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/programs/${program._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          startDate,
          endDate,
          province: selectedProvince || program.province?._id,
          district: selectedDistrict || program.district?._id,
          sector: selectedSector || program.sector?._id,
          cell: selectedCell || program.cell?._id,
          village: selectedVillage || program.village?._id,
          status,
          coordinator: selectedCoordinatorId || program.coordinator?._id,
        }),
      });

      if (!response.ok) {
        console.log(response)
        throw new Error('Failed to update program');
      }

      toast.success('Program updated successfully!');
      setOpen(false);
      onSave();
    } catch (error) {
      console.error('Error updating program:', error);
      toast.error('Failed to update program.');
    }
  };

  const coordinatorOptions = coordinators.map((coordinator) => ({
    label: coordinator.firstName + ' ' + coordinator.lastName, // Assuming user has firstName and lastName
    value: coordinator._id,
  }));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Toaster />
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Program</SheetTitle>
          <SheetDescription>
            Make changes to the program here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 px-4 mt-4 mb-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Program Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            {/* <Label htmlFor="startDate">Start Date</Label> */}
            <SimpletDatePicker
              date={startDate}
              label='Start Date'
              setDate={setStartDate}

            />

          </div>
          <div className="grid gap-2">
            {/* <Label htmlFor="endDate">End Date</Label> */}
            <SimpletDatePicker
              date={endDate}
              label='End Date'
              setDate={setEndDate}

            />
            {/* <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            /> */}
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

          <div className="grid gap-2">
            {/* <Label htmlFor="coordinator">Coordinator</Label> */}
            <SelectComponent
              label='Coordinator'
              name='coordinator'
              options={coordinatorOptions}
              value={selectedCoordinatorId}
              _setValue={setSelectedCoordinatorId}
            />
          </div>
          <Button type="submit">Save changes</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}