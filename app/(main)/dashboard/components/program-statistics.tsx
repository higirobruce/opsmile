"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import { ChartPieDonutActive } from './program-status-pie';

interface Program {
  _id: string;
  name: string;
  status: 'ongoing' | 'completed';
  startDate: string;
  endDate: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const ProgramStatistics = () => {
  const { token } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/programs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Program[] = await response.json();
      console.log("Fetched programs:", data);
      setPrograms(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to fetch program statistics.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  if (loading) return <div className="p-4 border rounded-lg">Loading program statistics...</div>;
  if (error) return <div className="p-4 border rounded-lg text-red-500">Error: {error}</div>;

  const ongoingPrograms = programs?.filter(p => p.status === 'ongoing').length || 0;
  const programsByStatus = programs?.reduce((acc, program) => {
    acc[program.status] = (acc[program.status] || 0) + 1;
    return acc;
  }, {} as Record<Program['status'], number>);

  const completedPrograms = programsByStatus?.completed || 0;
  const totalPrograms = programs?.length || 0;
  const completionRate = totalPrograms > 0 ? ((completedPrograms / totalPrograms) * 100).toFixed(2) : 0;

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="px-4 py-3 border rounded-lg flex flex-col justify-between">
          <h3 className="text-xs font-medium">Ongoing Programs</h3>
          <p className="text-2xl mt-5">{ongoingPrograms}</p>
        </div>

        {/* <div className="px-4 py-3 border rounded-lg flex flex-col justify-between">
        <ChartPieDonutActive/>
        <h3 className="text-xs font-medium">Programs by Status</h3>
        <div className='flex items-center justify-between'>
          <div className='flex items-baseline'>
            <div className="text-2xl mr-1">{ongoingPrograms}</div>
            <p className="text-xs font-medium">Ongoing</p>
          </div>

          <div className='flex items-baseline'>
            <div className="text-2xl mr-1">{completedPrograms}</div>
            <p className="text-xs font-medium">Completed</p>
          </div>
        </div>
      </div> */}

        <div className="px-4 py-3 border rounded-lg flex flex-col justify-between">
          <h3 className="text-xs font-medium">Program Completion Rate</h3>
          <p className="text-2xl">{completionRate}%</p>
        </div>
      </div>
    </div>
  );
};

export default ProgramStatistics;