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

  const fetchCoordinators = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
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
    }
  }, [open, fetchCoordinators]);

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
          location,
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
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Program</SheetTitle>
          <SheetDescription>
            Make changes to the program here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 px-4 mt-4">
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
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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