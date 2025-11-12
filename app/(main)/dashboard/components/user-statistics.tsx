"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import moment from 'moment';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const UserStatistics = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: User[] = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to fetch user statistics.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <div className="p-4 border rounded-lg">Loading user statistics...</div>;
  if (error) return <div className="p-4 border rounded-lg text-red-500">Error: {error}</div>;

  const activeUsers = users.length; // Assuming all fetched users are active
  const usersByRole = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const thirtyDaysAgo = moment().subtract(30, 'days');
  const newRegistrations = users.filter(user => moment(user.createdAt).isAfter(thirtyDaysAgo)).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Active Users</h3>
        <p className="text-2xl">{activeUsers}</p>
      </div>
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Users by Role</h3>
        <p className="text-2xl">
          Admin: {usersByRole.admin || 0}, Coordinator: {usersByRole.coordinator || 0}, Patient: {usersByRole.patient || 0}, Doctor: {usersByRole.doctor || 0}, Anesthesiologist: {usersByRole.anesthesiologist || 0}
        </p>
      </div>
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">New Registrations (Last 30 Days)</h3>
        <p className="text-2xl">{newRegistrations}</p>
      </div>
    </div>
  );
};

export default UserStatistics;