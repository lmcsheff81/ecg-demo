import React, { createContext, useEffect, useState } from "react";
import { PatientInterface } from "../components/PatientBanner";

export interface PatientContextProps {
  patient: PatientInterface | null;
  isLoadingPatientData: boolean;
}

export const PatientContext = createContext<PatientContextProps | undefined>(
  undefined
);

interface PatientProviderProps {
  children: React.ReactNode;
  apiUrl: string;
}

export function PatientProvider({ children, apiUrl }: PatientProviderProps) {
  const [patient, setPatient] = useState<PatientInterface | null>(null);
  const [isLoadingPatientData, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setPatient(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [apiUrl]);

  const contextValue: PatientContextProps = {
    patient,
    isLoadingPatientData,
  };

  return (
    <PatientContext.Provider value={contextValue}>
      {children}
    </PatientContext.Provider>
  );
}
