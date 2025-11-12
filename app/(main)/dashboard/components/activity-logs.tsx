"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import moment from 'moment';

interface ActivityLog {
  _id: string;
  action: string;
  description?: string;
  createdAt: string;
  user?: { firstName: string; lastName: string; };
  patient?: { firstName: string; lastName: string; };
  program?: { name: string; };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const ActivityLogs = () => {
  const { token } = useAuth();
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/activity-log`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ActivityLog[] = await response.json();
      setActivityLogs(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to fetch activity logs.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchActivityLogs();
  }, [fetchActivityLogs]);

  if (loading) return <div className="p-4 border rounded-lg">Loading activity logs...</div>;
  if (error) return <div className="p-4 border rounded-lg text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Recent Activities</h3>
      <ul className="list-disc pl-5">
        {activityLogs.length > 0 ? (
          activityLogs.map((log) => (
            <li key={log._id}>
              {log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Unknown User'} {log.action} {log.patient ? `for patient ${log.patient.firstName} ${log.patient.lastName}` : ''} {log.program ? `program ${log.program.name}` : ''} ({moment(log.createdAt).fromNow()})
            </li>
          ))
        ) : (
          <li>No recent activities.</li>
        )}
      </ul>
    </div>
  );
};

export default ActivityLogs;