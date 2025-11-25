"use client";

import { useEffect, useState } from "react";

import { ChartPieDonutActive } from "./program-status-pie";
import { ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartCardSkeleton } from "./chart-skeleton-pie";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string; // Added gender property (assumed API returns this)
  // Add other patient properties as needed
}

interface PieSectorDataItem {
  labels: string;
  counts: number;
  fill: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const chartConfig = {
  visitors: {
    label: "Patients",
  },
  Male: {
    label: "Male",
    color: "var(--chart-4)",
  },
  Female: {
    label: "Female",
    color: "var(--chart-2)",
  },
  Other: {
    label: "Other",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function PatientByGenderPieChart() {
  const [patientGenderData, setPatientGenderData] = useState<PieSectorDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Removed localStorage token usage (HTTP-only cookie is auto-sent by browser)
        const response = await fetch(`${API_URL}/patients`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: { patients: Patient[] } = await response.json();

        console.log('Patients', data)
        if (!Array.isArray(data.patients)) {
          console.error("API response is not an array:", data);
          setPatientGenderData([]);
          setLoading(false);
          return;
        }

        // Replace age counts with gender counts
        const genderCounts: { [key: string]: number } = {
          Male: 0,
          Female: 0,
          Other: 0,
        };

        data.patients.forEach((patient) => {
          // Categorize patients by gender (normalized to uppercase for consistency)
          const normalizedGender = patient.gender?.trim().toUpperCase() || 'OTHER';
          switch (normalizedGender) {
            case 'M':
              genderCounts.Male++;
              break;
            case 'F':
              genderCounts.Female++;
              break;
            default:
              genderCounts.Other++;
              break;
          }
        });

        const formattedData: PieSectorDataItem[] = Object.entries(genderCounts).map(
          ([gender, count], index) => ({
            labels: gender,
            counts: count,
            fill: `var(--chart-${index + 2})`,
          })
        );

        setPatientGenderData(formattedData);
        console.log("Gender distribution data:", formattedData);
      } catch (err) {

        console.error("Failed to fetch patients:", err);
        setError("Failed to load patient gender data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // if (loading) {
  //   return <Card className="flex flex-col"><CardHeader><CardTitle>Loading Patient Gender Data...</CardTitle></CardHeader><CardContent>Loading...</CardContent></Card>;
  // }

  // if (error) {
  //   return <Card className="flex flex-col"><CardHeader><CardTitle>Error</CardTitle></CardHeader><CardContent>{error}</CardContent></Card>;
  // }

  return (
    <>
      {loading && <ChartCardSkeleton />}
      {!loading && !error && <ChartPieDonutActive
        title="Patient Gender Distribution"
        description="Gender breakdown of all patients"
        data={patientGenderData}
        chartConfig={chartConfig}
      />}
    </>
  );
}