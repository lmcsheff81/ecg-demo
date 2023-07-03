import React, { createContext, useEffect, useState } from "react";

interface Patient {
  title: string;
  surname: string;
  forename: string;
  hospitalID: number;
  nationalID: number;
  clinician: string;
  ward: string;
  bay: string;
  bed: string;
}

export interface PatientContextProps {
  patient: Patient | null;
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
  const [patient, setPatient] = useState<Patient | null>(null);
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
