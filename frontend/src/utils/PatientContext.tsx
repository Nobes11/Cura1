import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Patient } from '../utils/mockData';

type PatientContextType = {
  selectedPatient: Patient | null;
  patientDetailOpen: boolean;
  setSelectedPatient: (patient: Patient | null) => void;
  setPatientDetailOpen: (open: boolean) => void;
};

const PatientContext = createContext<PatientContextType | undefined>(undefined);

type PatientProviderProps = {
  children: ReactNode;
};

export function PatientProvider({ children }: PatientProviderProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientDetailOpen, setPatientDetailOpen] = useState(false);

  return (
    <PatientContext.Provider 
      value={{
        selectedPatient,
        patientDetailOpen,
        setSelectedPatient,
        setPatientDetailOpen,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export function usePatientContext() {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatientContext must be used within a PatientProvider');
  }
  return context;
}
