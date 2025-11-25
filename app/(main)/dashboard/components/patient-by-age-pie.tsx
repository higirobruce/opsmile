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
  "0-20 years": {
    label: "0-20 Years",
    color: "var(--chart-1)",
  },
  "21-40 years": {
    label: "21-40 Years",
    color: "var(--chart-2)",
  },
  "41+ years": {
    label: "41+ Years",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function PatientByAgePieChart() {
  const [patientAgeData, setPatientAgeData] = useState<PieSectorDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/patients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: { patients: Patient[] } = await response.json();

        if (!Array.isArray(data.patients)) {
          console.error("API response is not an array:", data);
          setPatientAgeData([]);
          setLoading(false);
          return;
        }

        const ageCounts: { [key: string]: number } = {
          "0-2 years": 0,
          "3-5 years": 0,
          "6-12 years": 0,
          "13-18 years": 0,
          "19-35 years": 0,
          "36+ years": 0,
        };

        data.patients.forEach((patient) => {
          const birthDate = new Date(patient.dateOfBirth);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }

          if (age >= 0 && age <= 2) {
            ageCounts["0-2 years"]++;
          } else if (age >= 3 && age <= 5) {
            ageCounts["3-5 years"]++;
          } else if (age >= 6 && age <= 12) {
            ageCounts["6-12 years"]++;
          } else if (age >= 13 && age <= 18) {
            ageCounts["13-18 years"]++;
          } else if (age >= 19 && age <= 35) {
            ageCounts["19-35 years"]++;
          } else if (age >= 36) {
            ageCounts["36+ years"]++;
          }
        });

        const formattedData: PieSectorDataItem[] = Object.entries(ageCounts).map(
          ([ageGroup, count], index) => ({
            labels: ageGroup,
            counts: count,
            fill: `var(--chart-${index + 1})`, // Assuming chart-1 to chart-3 are defined
          })
        );

        setPatientAgeData(formattedData);
        console.log("-------------", formattedData);
      } catch (err) {

        console.error("Failed to fetch patients:", err);
        setError("Failed to load patient data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // if (loading) {
  //   return <Card className="flex flex-col"><CardHeader><CardTitle>Loading Patient Age Data...</CardTitle></CardHeader><CardContent>Loading...</CardContent></Card>;
  // }

  // if (error) {
  //   return <Card className="flex flex-col"><CardHeader><CardTitle>Error</CardTitle></CardHeader><CardContent>{error}</CardContent></Card>;
  // }

  return (
    <>
      {loading && <ChartCardSkeleton />}
      {!loading && !error && <ChartPieDonutActive
        title="Patient Age Distribution"
        description="Age groups of all patients"
        data={patientAgeData}
        chartConfig={chartConfig}
      />}
    </>
  );
}