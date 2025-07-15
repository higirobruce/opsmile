// context/PatientDataContext.tsx
"use client"; // ✅ required if using App Router

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

const PatientDataContext = createContext<any | undefined>(undefined);

export function PatientDataProvider({ children }: { children: ReactNode }) {
  const [patient, setPatient] = useState<any | null>(null);

  useEffect(() => {
    alert(JSON.stringify(patient));
  }, [patient]);
  return (
    <PatientDataContext.Provider value={{ patient, setPatient }}>
      {children}
    </PatientDataContext.Provider>
  );
}

// Hook to use in components
export function usePatientData() {
  const context = useContext(PatientDataContext);
  if (!context) {
    throw new Error("usePatientData must be used within a PatientDataProvider");
  }
  return context;
}