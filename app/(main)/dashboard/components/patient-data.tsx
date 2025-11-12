"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import moment from 'moment';
import { LoaderIcon } from 'lucide-react';

interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  status: string; // Assuming status indicates treatment status
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const PatientData = () => {
  const { token } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/patients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: { patients: Patient[] } = await response.json();
      if (Array.isArray(data.patients)) {
        console.log("Fetched patients:", data.patients);
        setPatients(data.patients);
      } else {
        console.error("API returned non-array data for patients:", data);
        setPatients([]);
      }
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to fetch patient data.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  if (loading) return <div className="p-4 border rounded-lg"><LoaderIcon className="animate-spin" /></div>;
  if (error) return <div className="p-4 border rounded-lg text-red-500">Error: {error}</div>;

  const totalPatients = patients.length;


  const patientsByAgeGroup = patients?.reduce((acc, patient) => {
    const age = moment().diff(moment(patient.dateOfBirth), 'years');
    if (age <= 18) acc['0-18'] = (acc['0-18'] || 0) + 1;
    else if (age >= 19 && age <= 64) acc['19-64'] = (acc['19-64'] || 0) + 1;
    else acc['65+'] = (acc['65+'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const patientsByTreatmentStatus = patients?.reduce((acc, patient) => {
    acc[patient.status] = (acc[patient.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Placeholder for average treatment duration - requires more detailed data
  const averageTreatmentDuration = "N/A";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Total Patients</h3>
        <p className="text-2xl">{totalPatients}</p>
      </div>
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Patients by Age Group</h3>
        <p className="text-2xl">
          0-18: {patientsByAgeGroup['0-18'] || 0}, 19-64: {patientsByAgeGroup['19-64'] || 0}, 65+: {patientsByAgeGroup['65+'] || 0}
        </p>
      </div>
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Patients by Treatment Status</h3>
        <p className="text-2xl">
          Active: {patientsByTreatmentStatus.Active || 0}, Completed: {patientsByTreatmentStatus.Completed || 0}, On Hold: {patientsByTreatmentStatus['On Hold'] || 0}
        </p>
      </div>
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Average Treatment Duration</h3>
        <p className="text-2xl">{averageTreatmentDuration}</p>
      </div>
    </div>
  );
};

export default PatientData;