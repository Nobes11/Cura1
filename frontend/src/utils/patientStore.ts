import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Patient, mockPatients } from './mockData';
import { db, collection, addDoc, getDocs, doc, serverTimestamp } from './firebase';

interface PatientState {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<void>;
  fetchPatients: () => Promise<void>;
  updatePatients: (patients: Patient[]) => void;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  removePatient: (patientId: string) => void;
}

export const usePatientStore = create<PatientState>(
  persist(
    (set, get) => ({
      patients: [], // Will be initialized with mockPatients on first load if empty
      loading: false,
      error: null,
      
      addPatient: async (patientData) => {
        set({ loading: true, error: null });
        try {
          // Try to save to Firestore if available
          const newPatient = {
            id: `pat-${Date.now()}`,
            ...patientData,
            createdAt: new Date().toISOString()
          };
          
          set(state => ({
            patients: [...state.patients, newPatient],
            loading: false
          }));
        } catch (error) {
          console.error('Error adding patient:', error);
          set({ 
            error: typeof error === 'string' ? error : 'Failed to add patient', 
            loading: false 
          });
        }
      },
      
      fetchPatients: async () => {
        set({ loading: true, error: null });
        try {
          // Check if we need to initialize the store with mock data
          // Only do this if patients array is completely empty
          const currentPatients = get().patients;
          if (currentPatients.length === 0) {
            // Ensure all mock patients have the lastUpdated field
            const enrichedMockPatients = mockPatients.map(patient => ({
              ...patient,
              lastUpdated: patient.lastUpdated || new Date().toISOString()
            }));
            set({ patients: enrichedMockPatients, loading: false });
          } else {
            // We already have data, just finish loading
            set({ loading: false });
          }
        } catch (error) {
          console.error('Error fetching patients:', error);
          set({ 
            error: typeof error === 'string' ? error : 'Failed to fetch patients', 
            loading: false 
          });
        }
      },

      // Update a single patient
      updatePatient: (patientId: string, updates: Partial<Patient>) => {
        set(state => ({
          patients: state.patients.map(patient => 
            patient.id === patientId 
              ? { ...patient, ...updates, lastUpdated: new Date().toISOString() }
              : patient
          )
        }));
      },

      // Remove a patient (used for permanent discharge)
      removePatient: (patientId: string) => {
        set(state => ({
          patients: state.patients.filter(patient => patient.id !== patientId)
        }));
      },

      updatePatients: (updatedPatients) => {
        set({ patients: updatedPatients });
      }
    }),
    {
      name: 'patient-store',
      storage: createJSONStorage(() => sessionStorage) // Use session storage to preserve during page navigation
    }
  )
);
