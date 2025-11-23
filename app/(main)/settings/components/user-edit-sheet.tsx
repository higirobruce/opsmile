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
import { toast } from 'sonner';
import { useAuth } from '@/app/context/AuthContext';
import { Toaster } from '@/components/ui/sonner';
import SelectComponent from '@/app/(main)/components/select-component';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface UserEditSheetProps {
  user: User;
  onUserUpdated: () => void;
  children: React.ReactNode;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function UserEditSheet({ user, onUserUpdated, children }: UserEditSheetProps) {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  useEffect(() => {
    if (open) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [open, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/users/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, email, role }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('User updated successfully!');
        onUserUpdated();
        setOpen(false);
      } else {
        toast.error(data.message || 'Failed to update user.');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user.');
    } finally {
      setSubmitting(false);
    }
  };

  const roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Coordinator', value: 'coordinator' },
    { label: 'Patient', value: 'patient' },
    { label: 'Nurse', value: 'nurse' },
    { label: 'Doctor', value: 'doctor' },
    { label: 'Anesthesiologist', value: 'anesthesiologist' },
    { label: 'Surgeon', value: 'surgeon' },
    { label: 'Medical Record', value: 'medical_record' },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <SheetHeader>
          <SheetTitle>Edit User</SheetTitle>
          <SheetDescription>
            Make changes to the user profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSave} className="grid gap-4 p-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="firstName" className="text-right">
              First Name
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastName" className="text-right">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <div className="col-span-3">
              <SelectComponent
                name="role"
                label=""
                options={roles}
                value={role}
                _setValue={setRole}
              />
            </div>
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
        <Toaster />
      </SheetContent>
    </Sheet>
  );
}