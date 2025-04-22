// Define the room types for the ED
export type RoomType = 'Lobby' | 'Room 1' | 'Room 2' | 'Room 3' | 'Room 4' | 'Room 5' | 'Room 6' | 'Room 7' | 'Room 8' | 'Room 9' | 'Room 10' | 'T-1' | 'T-2' | 'C-1' | 'C-2' | 'P-1' | 'P-2';

// Define room status types
export type RoomStatus = 'ready' | 'dirty' | 'cleaning';

export interface TriageData {
  // Vital Signs
  temperature?: number;
  temperatureRoute?: "oral" | "rectal" | "temporal" | "axillary" | "tympanic";
  heartRate?: number;
  respiratoryRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  bloodPressureSite?: "right arm" | "left arm" | "right leg" | "left leg";
  oxygenSaturation?: number;
  oxygenDeliveryMethod?: "room air" | "nasal cannula" | "mask" | "ventilator" | "other";
  painLevel?: number;
  weight?: number;
  height?: number;
  
  // Medical History
  allergies?: {
    allergen: string;
    reaction: string;
    severity: "mild" | "moderate" | "severe";
  }[];
  medicalConditions?: string[];
  surgicalHistory?: string[];
  familyHistory?: string;
  socialHistory?: string;
  immunizationStatus?: string;
  
  // Medication Reconciliation
  currentMedications?: {
    name: string;
    dosage: string;
    frequency: string;
    route: string;
    lastTaken: string;
  }[];
  medicationReconciliationStatus?: "pending" | "in-progress" | "completed";
  
  // Chief Complaint
  chiefComplaint?: string;
  onsetOfSymptoms?: string;
  symptomDescription?: string;
  triageImpression?: string;
  acuityLevel?: 1 | 2 | 3 | 4 | 5;
  
  // Social/Cultural Assessment
  preferredLanguage?: string;
  needsInterpreter?: boolean;
  culturalConsiderations?: string;
  religiousConsiderations?: string;
  mentalHealthStatus?: string;
  substanceUseHistory?: string;
  
  // Triage Info
  triageNurse?: string;
  triageTimestamp?: string;
  triageCompletedAt?: string;
}

// Room type descriptions
export const roomTypeDescriptions = {
  'Lobby': 'Waiting area for patients not yet assigned a bed',
  'Room': 'Standard treatment room for general patients',
  'T': 'Trauma room for severe injuries requiring immediate intervention',
  'C': 'Critical care room for unstable patients requiring intensive monitoring',
  'P': 'Psychiatric evaluation room for mental health assessments'
};

// Interface for tracking room status
export interface RoomInfo {
  id: RoomType;
  status: RoomStatus;
  lastCleaned?: string; // ISO timestamp
}

// Reconciliation status for medications
export type MedicationReconciliationStatus = 'continue' | 'stop' | 'modify';

// Interface for home medications
import { CodeStatus, CodeStatusHistoryEntry } from "../components/CodeStatusDialog";
import { EnhancedHipaaContact } from "../components/HipaaDialog";

export interface HomeMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  indication?: string;
  startDate?: string;
  prescriber?: string;
  reconciled?: boolean;
  reconciliationStatus?: MedicationReconciliationStatus;
  reconciliationNote?: string;
  reconciledAt?: string;
  reconciledBy?: string;
}

// This is a placeholder comment to avoid declaring duplicate interfaces

export interface Allergy {
  allergen: string;
  reaction: string;
  severity: "Mild" | "Moderate" | "Severe";
  noted: string;
}

export interface HipaaContact {
  name: string;
  relationship: string;
  phone: string;
  authorized: boolean;
  infoAccess?: "Full" | "Limited" | "None";
  id?: string;
  notes?: string;
}

export interface CodeStatusHistoryEntry {
  timestamp: string;
  status: string;
  provider: string;
  reason: string;
  decisionMaker: string;
  decisionMakerRelationship?: string;
  decisionMakerContact?: string;
}

export interface CodeStatus {
  status: "Full Code" | "DNR" | "DNR/DNI" | "Comfort Care Only";
  lastUpdated: string;
  updatedBy: string;
  reason?: string;
  decisionMaker?: string;
  decisionMakerRelationship?: string;
  decisionMakerContact?: string;
  history?: CodeStatusHistoryEntry[];
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  room: RoomType;
  chiefComplaint: string;
  triageImpression?: string;
  status: 'waiting' | 'in-progress' | 'discharge-ready' | 'discharged';
  registrationStatus?: 'pending' | 'checked-in' | 'triaged';
  triageStatus?: 'not-triaged' | 'in-triage' | 'triaged';
  triageData?: TriageData;
  allergies?: Allergy[];
  dnrStatus?: boolean; // Legacy field, kept for backward compatibility
  codeStatus?: CodeStatus;
  hipaaContacts?: HipaaContact[];
  restrictedContacts?: HipaaContact[];
  homeMedications?: HomeMedication[];
  dateOfBirth?: string;
  medicationReconciliation?: {
    status: 'pending' | 'in-progress' | 'completed';
    startedAt?: string;
    completedAt?: string;
    completedBy?: string;
  };
  holdStatus?: boolean; // Whether patient is on hold
  consulted?: boolean; // Whether patient has been consulted
  assignedProvider: string | null; // Changed to allow null for unassigned
  assignedNurse: string | null; // Nurse assigned to patient
  arrivalTime: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  mrn: string; // Medical Record Number
  lastUpdated: string;
  waitTime?: number; // Time patient has been waiting (in minutes)
  careArea?: 'Main ED' | 'Fast Track' | 'Trauma' | 'Peds';
  disposition?: 'To Be Admitted' | 'Discharge' | 'Transfer' | null;
  labsPending?: boolean;
  imagingPending?: boolean;
  consultPending?: boolean;
  acuity?: number; // 1-5 scale
  vitals?: {
    temperature: string;
    heartRate: number;
    bloodPressure: string;
    respiratoryRate: number;
    oxygenSaturation: number;
    weight: string;
    height?: string;
  };
  labResults?: {
    name: string;
    value: string;
    normal: boolean;
    timestamp: string;
  }[];
  protocols?: {
    strokeProtocol?: {
      ordered: string;
      orderedBy: string;
      status: 'Active' | 'Completed' | 'Discontinued';
    };
    sepsisProtocol?: {
      ordered: string;
      orderedBy: string;
      status: 'Active' | 'Completed' | 'Discontinued';
    };
    fallRiskProtocol?: {
      ordered: string;
      orderedBy: string;
      status: 'Active' | 'Completed' | 'Discontinued';
    };
    stemiProtocol?: {
      ordered: string;
      orderedBy: string;
      status: 'Active' | 'Completed' | 'Discontinued';
    };
    noAmaProtocol?: {
      ordered: string;
      orderedBy: string;
      status: 'Active' | 'Completed' | 'Discontinued';
    };
  };
  protocolOrders?: {
    stroke?: {
      ordered: string;
      orderedBy: string;
      status: 'Active' | 'Completed' | 'Discontinued';
      steps?: Array<{
        name: string;
        completed: boolean;
        timestamp?: string;
      }>;
    };
    sepsis?: {
      ordered: string;
      orderedBy: string;
      status: 'Active' | 'Completed' | 'Discontinued';
      steps?: Array<{
        name: string;
        completed: boolean;
        timestamp?: string;
      }>;
    };
    fallRisk?: {
      ordered: string;
      orderedBy: string;
      status: 'Active' | 'Completed' | 'Discontinued';
      steps?: Array<{
        name: string;
        completed: boolean;
        timestamp?: string;
      }>;
    };
    stemi?: {
      ordered: string;
      orderedBy: string;
      status: 'Active' | 'Completed' | 'Discontinued';
      steps?: Array<{
        name: string;
        completed: boolean;
        timestamp?: string;
      }>;
    };
  };
  // Used for backwards compatibility
  isStroke?: boolean;
  isSepsis?: boolean;
  isFallRisk?: boolean;
  comments?: Array<{text: string; author: string; timestamp: string}>;
  protocolOrders?: {
    stroke?: boolean;
    sepsis?: boolean;
    fallRisk?: boolean;
    stemi?: boolean;
  };
  isStemi?: boolean;
  nurseComments?: Array<{
    author?: string;
    text: string;
    timestamp: string;
  }>;
  providerComments?: Array<{
    author: string;
    text: string;
    timestamp: string;
  }>;
}

// Interface for order sets
export interface OrderSet {
  id: string;
  name: string;
  category: 'Cardiac' | 'Respiratory' | 'Neurological' | 'Gastrointestinal' | 'Infectious' | 'Trauma' | 'Other';
  items: Array<{
    id: string;
    name: string;
    type: 'Lab' | 'Imaging' | 'Medication' | 'Procedure' | 'Protocol';
    default: boolean;
  }>;
}

// Mock Order Sets
export const mockOrderSets: OrderSet[] = [
  {
    id: 'cardiac1',
    name: 'Cardiac Workup',
    category: 'Cardiac',
    items: [
      { id: 'card-lab1', name: 'Troponin', type: 'Lab', default: true },
      { id: 'card-lab2', name: 'BNP', type: 'Lab', default: true },
      { id: 'card-lab3', name: 'CK-MB', type: 'Lab', default: false },
      { id: 'card-lab4', name: 'Complete Metabolic Panel', type: 'Lab', default: true },
      { id: 'card-lab5', name: 'CBC with Differential', type: 'Lab', default: true },
      { id: 'card-img1', name: 'EKG', type: 'Imaging', default: true },
      { id: 'card-img2', name: 'Chest X-Ray', type: 'Imaging', default: true },
      { id: 'card-med1', name: 'Aspirin 325mg', type: 'Medication', default: true },
      { id: 'card-med2', name: 'Nitroglycerin 0.4mg SL PRN', type: 'Medication', default: false },
      { id: 'card-med3', name: 'Heparin Drip', type: 'Medication', default: false },
      { id: 'card-med4', name: 'Metoprolol 5mg IV', type: 'Medication', default: false }
    ]
  },
  {
    id: 'stroke1',
    name: 'Stroke Protocol',
    category: 'Neurological',
    items: [
      { id: 'stroke-lab1', name: 'CBC with Differential', type: 'Lab', default: true },
      { id: 'stroke-lab2', name: 'Coagulation Panel', type: 'Lab', default: true },
      { id: 'stroke-lab3', name: 'Basic Metabolic Panel', type: 'Lab', default: true },
      { id: 'stroke-img1', name: 'CT Head without Contrast', type: 'Imaging', default: true },
      { id: 'stroke-img2', name: 'CT Angiogram Head & Neck', type: 'Imaging', default: false },
      { id: 'stroke-med1', name: 'tPA (if eligible)', type: 'Medication', default: false },
      { id: 'stroke-med2', name: 'BP Management Protocol', type: 'Medication', default: true },
      { id: 'stroke-med3', name: 'Prothrombin Complex Concentrate', type: 'Medication', default: false },
      { id: 'stroke-proc1', name: 'Neurology Consultation', type: 'Procedure', default: true },
      { id: 'stroke-protocol', name: 'Stroke Protocol', type: 'Protocol', default: true }
    ]
  },
  {
    id: 'uti1',
    name: 'UTI/STD Workup',
    category: 'Infectious',
    items: [
      { id: 'uti-lab1', name: 'Urinalysis with Culture', type: 'Lab', default: true },
      { id: 'uti-lab2', name: 'Gonorrhea/Chlamydia PCR', type: 'Lab', default: false },
      { id: 'uti-lab3', name: 'HIV Screen', type: 'Lab', default: false },
      { id: 'uti-lab4', name: 'Syphilis Screen', type: 'Lab', default: false },
      { id: 'uti-lab5', name: 'CBC with Differential', type: 'Lab', default: true },
      { id: 'uti-lab6', name: 'Basic Metabolic Panel', type: 'Lab', default: false },
      { id: 'uti-med1', name: 'Ceftriaxone 250mg IM', type: 'Medication', default: false },
      { id: 'uti-med2', name: 'Azithromycin 1g PO', type: 'Medication', default: false },
      { id: 'uti-med3', name: 'Ciprofloxacin 500mg PO', type: 'Medication', default: false }
    ]
  },
  {
    id: 'resp1',
    name: 'Respiratory Panel',
    category: 'Respiratory',
    items: [
      { id: 'resp-lab1', name: 'COVID-19 PCR', type: 'Lab', default: true },
      { id: 'resp-lab2', name: 'Influenza A/B', type: 'Lab', default: true },
      { id: 'resp-lab3', name: 'RSV', type: 'Lab', default: true },
      { id: 'resp-lab4', name: 'Strep Screen', type: 'Lab', default: false },
      { id: 'resp-img1', name: 'Chest X-Ray', type: 'Imaging', default: true },
      { id: 'resp-med1', name: 'Albuterol Nebulizer', type: 'Medication', default: false },
      { id: 'resp-med2', name: 'Prednisone 60mg PO', type: 'Medication', default: false },
      { id: 'resp-med3', name: 'Azithromycin 500mg PO', type: 'Medication', default: false }
    ]
  },
  {
    id: 'common-meds',
    name: 'Common Medications',
    category: 'Other',
    items: [
      { id: 'med1', name: 'Acetaminophen 1000mg PO/IV', type: 'Medication', default: false },
      { id: 'med2', name: 'Ibuprofen 600mg PO', type: 'Medication', default: false },
      { id: 'med3', name: 'Ketorolac 30mg IV', type: 'Medication', default: false },
      { id: 'med4', name: 'Morphine 4mg IV', type: 'Medication', default: false },
      { id: 'med5', name: 'Ondansetron 4mg IV/PO', type: 'Medication', default: false },
      { id: 'med6', name: 'Methylprednisolone 125mg IV', type: 'Medication', default: false },
      { id: 'med7', name: 'Insulin Regular Drip', type: 'Medication', default: false },
      { id: 'med8', name: 'Ceftriaxone 1g IV', type: 'Medication', default: false },
      { id: 'med9', name: 'Vancomycin 1g IV', type: 'Medication', default: false },
      { id: 'med10', name: 'Metoprolol 5mg IV', type: 'Medication', default: false },
      { id: 'med11', name: 'Labetalol 10mg IV', type: 'Medication', default: false },
      { id: 'med12', name: 'Hydralazine 10mg IV', type: 'Medication', default: false }
    ]
  }
];

// Current user data
export const currentUser = {
  id: "user-1",
  name: "Dr. Charles Patterson",
  role: "Physician",
  department: "Emergency Medicine",
  specialty: "Emergency Medicine",
  preferences: {
    theme: "light",
    dashboardLayout: "compact"
  }
};

// Mock patient data
// Helper function to generate random arrival time
function getRandomArrivalTime() {
  const now = new Date();
  const hoursAgo = Math.floor(Math.random() * 12);
  const minutesAgo = Math.floor(Math.random() * 60);
  now.setHours(now.getHours() - hoursAgo);
  now.setMinutes(now.getMinutes() - minutesAgo);
  return now.toISOString();
}

// Track room status information
export const roomStatuses: Record<RoomType, RoomStatus> = {
  'Lobby': 'ready',
  'Room 1': 'ready',
  'Room 2': 'ready',
  'Room 3': 'dirty',
  'Room 4': 'ready',
  'Room 5': 'ready',
  'Room 6': 'cleaning',
  'Room 7': 'ready',
  'Room 8': 'dirty',
  'Room 9': 'ready',
  'Room 10': 'ready',
  'T-1': 'ready',
  'T-2': 'ready',
  'C-1': 'ready',
  'C-2': 'dirty',
  'P-1': 'ready',
  'P-2': 'cleaning',
};

// Helper to generate current timestamp
export function getCurrentTimestamp() {
  return new Date().toISOString();
}

// Adding medication orders to patients
export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "John Smith",
    age: 45,
    gender: "Male",
    dateOfBirth: "1980-01-15",
    allergies: [
      {
        allergen: "Penicillin",
        reaction: "Anaphylaxis",
        severity: "Severe",
        noted: "2023-05-10"
      },
      {
        allergen: "Sulfa Drugs",
        reaction: "Rash",
        severity: "Moderate",
        noted: "2022-11-15"
      }
    ],
    dnrStatus: true,
    codeStatus: {
      status: "DNR",
      lastUpdated: "2025-03-15T14:30:00",
      updatedBy: "Dr. Sarah Johnson",
      reason: "Patient request, terminal condition",
      decisionMaker: "John Smith",
      decisionMakerRelationship: "Self",
      history: [
        {
          timestamp: "2025-01-10T09:15:00",
          status: "Full Code",
          provider: "Dr. James Wilson",
          reason: "Initial admission",
          decisionMaker: "John Smith",
          decisionMakerRelationship: "Self"
        },
        {
          timestamp: "2025-03-15T14:30:00",
          status: "DNR",
          provider: "Dr. Sarah Johnson",
          reason: "Patient request, terminal condition",
          decisionMaker: "John Smith",
          decisionMakerRelationship: "Self"
        }
      ]
    },
    hipaaContacts: [
      {
        name: "Mary Smith",
        relationship: "Wife",
        phone: "(555) 123-4567",
        authorized: true
      },
      {
        name: "James Smith",
        relationship: "Son",
        phone: "(555) 987-6543",
        authorized: true
      }
    ],
    restrictedContacts: [
      {
        name: "Robert Johnson",
        relationship: "Ex-brother-in-law",
        phone: "(555) 222-3333",
        authorized: false
      }
    ],
    homeMedications: [
      {
        id: "home-med-1",
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        indication: "Hypertension",
        startDate: "2023-01-15",
        prescriber: "Dr. Wilson",
        reconciled: false
      },
      {
        id: "home-med-2",
        name: "Atorvastatin",
        dosage: "20mg",
        frequency: "Once daily at bedtime",
        indication: "Hyperlipidemia",
        startDate: "2022-09-10",
        prescriber: "Dr. Wilson",
        reconciled: false
      },
      {
        id: "home-med-3",
        name: "Aspirin",
        dosage: "81mg",
        frequency: "Once daily",
        indication: "Prophylaxis",
        startDate: "2023-03-22",
        prescriber: "Dr. Wilson",
        reconciled: false
      }
    ],
    medicationReconciliation: {
      status: 'pending'
    },
    medicationOrders: {
      oral: [
        {
          id: "med1",
          name: "Acetaminophen",
          dose: "650mg",
          route: "PO",
          ordered: "2025-04-08T07:45:00",
          orderedBy: "Dr. Johnson",
          status: "Ordered"
        },
        {
          id: "med2",
          name: "Ondansetron",
          dose: "4mg",
          route: "PO",
          ordered: "2025-04-08T08:15:00",
          orderedBy: "Dr. Johnson",
          status: "Administered",
          administeredAt: "2025-04-08T08:30:00",
          administeredBy: "Nurse Smith"
        }
      ],
      iv: [
        {
          id: "med3",
          name: "Normal Saline",
          dose: "1000mL",
          route: "IV",
          ordered: "2025-04-08T07:40:00",
          orderedBy: "Dr. Johnson",
          status: "Ordered"
        }
      ]
    },
    room: "Lobby",
    chiefComplaint: "Chest Pain",
    triageImpression: "Rule out ACS. ECG shows ST depression in V3-V5.",
    status: "waiting",
    assignedProvider: null, // Unassigned - will show in red
    assignedNurse: null,
    arrivalTime: "2025-04-08T07:30:00",
    priority: "high",
    mrn: "MRN7845632",
    lastUpdated: "2025-04-08T07:35:00",
    careArea: "Main ED",
    disposition: null,
    labsPending: true,
    imagingPending: true,
    protocols: {
      strokeProtocol: {
        ordered: "2025-04-08T07:45:00",
        orderedBy: "Dr. Adams",
        status: "Active"
      }
    },
    consultPending: false,
    acuity: 2,
    vitals: {
      temperature: "38.2°C",
      heartRate: 110,
      bloodPressure: "145/95",
      respiratoryRate: 18,
      oxygenSaturation: 97,
      weight: "78 kg"
    },
    labResults: [
      { name: "Troponin", value: "0.32 ng/mL", normal: false, timestamp: "2025-04-08T08:15:00" },
      { name: "CK-MB", value: "8.5 ng/mL", normal: false, timestamp: "2025-04-08T08:15:00" },
      { name: "WBC", value: "9,500/µL", normal: true, timestamp: "2025-04-08T08:15:00" }
    ],
    // No need to duplicate these properties as they are already defined above
  },
  {
    id: "2",
    name: "Emma Johnson",
    age: 72,
    gender: "Female",
    dateOfBirth: "1952-08-22",
    allergies: [
      {
        allergen: "Latex",
        reaction: "Contact dermatitis",
        severity: "Moderate",
        noted: "2021-08-22"
      }
    ],
    dnrStatus: true,
    hipaaContacts: [
      {
        name: "David Johnson",
        relationship: "Son",
        phone: "(555) 323-1123",
        authorized: true
      },
      {
        name: "Sarah Williams",
        relationship: "Daughter",
        phone: "(555) 444-7890",
        authorized: true
      }
    ],
    homeMedications: [
      {
        id: "home-med-4",
        name: "Levothyroxine",
        dosage: "50mcg",
        frequency: "Once daily on empty stomach",
        indication: "Hypothyroidism",
        startDate: "2021-05-15",
        prescriber: "Dr. Adams",
        reconciled: true,
        reconciliationStatus: 'continue',
        reconciledAt: "2025-04-08T07:05:00",
        reconciledBy: "Dr. Patterson"
      },
      {
        id: "home-med-5",
        name: "Sertraline",
        dosage: "50mg",
        frequency: "Once daily",
        indication: "Anxiety",
        startDate: "2023-01-10",
        prescriber: "Dr. Adams",
        reconciled: true,
        reconciliationStatus: 'continue',
        reconciledAt: "2025-04-08T07:05:00",
        reconciledBy: "Dr. Patterson"
      }
    ],
    medicationReconciliation: {
      status: 'completed',
      completedAt: "2025-04-08T07:10:00",
      completedBy: "Dr. Patterson"
    },
    room: "Room 2",
    chiefComplaint: "Abdominal Pain",
    triageImpression: "RLQ tenderness with guarding, possible appendicitis.",
    status: "in-progress",
    holdStatus: false,
    assignedProvider: "Dr. Patterson",
    assignedNurse: "RN Maria Smith",
    arrivalTime: "2025-04-08T06:45:00",
    priority: "medium",
    mrn: "MRN9856412",
    lastUpdated: "2025-04-08T07:00:00",
    careArea: "Main ED",
    disposition: null,
    labsPending: true,
    medicationOrders: {
      oral: [
        {
          id: "med-oral-1",
          name: "Acetaminophen",
          dose: "1000mg",
          route: "PO",
          ordered: getCurrentTimestamp(),
          orderedBy: "Dr. Patterson",
          status: "Ordered"
        },
        {
          id: "med-oral-2",
          name: "Ondansetron",
          dose: "4mg",
          route: "PO",
          ordered: "2025-04-08T07:45:00",
          orderedBy: "Dr. Patterson",
          status: "Administered",
          administeredAt: "2025-04-08T08:15:00",
          administeredBy: "RN Maria Smith"
        }
      ],
      iv: [
        {
          id: "med-iv-1",
          name: "Ceftriaxone",
          dose: "1g",
          route: "IV",
          ordered: getCurrentTimestamp(),
          orderedBy: "Dr. Patterson",
          status: "Ordered"
        }
      ]
    },
    providerComments: [
      {
        author: "Dr. Patterson",
        text: "Initial evaluation complete. Patient presents with severe RLQ pain. CT ordered to rule out appendicitis.",
        timestamp: "2025-04-08T07:15:00"
      },
      {
        author: "Dr. Patterson",
        text: "CT results show inflamed appendix. Surgical consult requested.",
        timestamp: "2025-04-08T09:30:00"
      },
      {
        author: "Dr. Patterson",
        text: "Surgeon evaluated. Patient being admitted for appendectomy.",
        timestamp: "2025-04-08T10:45:00"
      }
    ],
    nurseComments: [
      {
        text: "Pain score 8/10. Given 4mg morphine IV at 07:10.",
        timestamp: "2025-04-08T07:10:00"
      },
      {
        text: "IV antibiotics started per order. Patient reports pain now 5/10.",
        timestamp: "2025-04-08T08:00:00"
      }
    ],
    imagingPending: false,
    consultPending: false,
    acuity: 3,
    vitals: {
      temperature: "37.1°C",
      heartRate: 92,
      bloodPressure: "125/85",
      respiratoryRate: 16,
      oxygenSaturation: 98,
      weight: "65 kg"
    },
    isStroke: false,
    isSepsis: false,
    isFallRisk: false,
    // Using nurseComments and providerComments as arrays for consistency
    additionalNurseNotes: {
      text: "Patient reports pain at 7/10. Last pain medication administered 1 hour ago.",
      timestamp: "2025-04-08T07:15:00"
    },
    additionalProviderNotes: {
      author: "Dr. Johnson",
      text: "Suspect possible appendicitis. Ordered CT abdomen with contrast.",
      timestamp: "2025-04-08T07:30:00"
    }
  },
  {
    id: "3",
    name: "Robert Williams",
    age: 78,
    gender: "Male",
    dateOfBirth: "1946-11-22",
    allergies: [],
    dnrStatus: false,
    hipaaContacts: [
      {
        name: "Lily Chen",
        relationship: "Wife",
        phone: "(555) 765-4321",
        authorized: true
      }
    ],
    assignedNurse: "RN James Wilson",
    room: "T-2",
    holdStatus: true,
    chiefComplaint: "Fall, Hip Pain",
    status: "in-progress",
    assignedProvider: "Dr. Smith",
    arrivalTime: "2025-04-08T05:15:00",
    priority: "medium",
    mrn: "MRN1234567",
    lastUpdated: "2025-04-08T05:45:00",
    careArea: "Main ED",
    disposition: "To Be Admitted",
    labsPending: false,
    imagingPending: true,
    consultPending: true,
    acuity: 3,
    protocols: {
      fallRiskProtocol: {
        ordered: "2025-04-08T05:30:00",
        orderedBy: "Dr. Smith",
        status: "Active"
      }
    },
    nurseComments: {
      text: "Patient experiencing severe pain, requesting additional analgesia.",
      timestamp: "2025-04-08T06:15:00"
    },
    providerComments: {
      text: "Orthopedics consult requested. Patient needs bed rest.",
      timestamp: "2025-04-08T06:30:00"
    }
  },
  {
    id: "4",
    name: "Sarah Williams",
    age: 29,
    gender: "Female",
    allergies: [
      {
        allergen: "Codeine",
        reaction: "Nausea and vomiting",
        severity: "Moderate",
        noted: "2024-01-05"
      },
      {
        allergen: "Ibuprofen",
        reaction: "Hives",
        severity: "Mild",
        noted: "2023-11-18"
      }
    ],
    dnrStatus: false,
    hipaaContacts: [
      {
        name: "Thomas Williams",
        relationship: "Husband",
        phone: "(555) 222-8899",
        authorized: true
      }
    ],
    restrictedContacts: [
      {
        name: "Karen Johnson",
        relationship: "Mother",
        phone: "(555) 111-3344",
        authorized: false
      }
    ],
    assignedNurse: "RN Linda Chen",
    room: "P-1",
    holdStatus: true,
    chiefComplaint: "Fever, Cough",
    status: "in-progress",
    assignedProvider: "Dr. Patterson",
    arrivalTime: "2025-04-08T06:00:00",
    priority: "medium",
    mrn: "MRN7891234",
    lastUpdated: "2025-04-08T06:30:00",
    careArea: "Peds",
    disposition: null,
    labsPending: true,
    imagingPending: false,
    consultPending: false,
    acuity: 3,
    vitals: {
      temperature: "38.9°C",
      heartRate: 115,
      bloodPressure: "110/70",
      respiratoryRate: 22,
      oxygenSaturation: 96
    },
    nurseComments: {
      text: "Patient given Tylenol for fever. Mom at bedside.",
      timestamp: "2025-04-08T06:45:00"
    },
    providerComments: {
      author: "Dr. Wilson",
      text: "Suspect viral URI. Checking CBC and performing rapid strep test.",
      timestamp: "2025-04-08T07:00:00"
    },
    protocols: null
  },
  {
    id: "5",
    name: "Robert Gomez",
    age: 56,
    gender: "Male",
    allergies: [
      {
        allergen: "Shellfish",
        reaction: "Anaphylaxis",
        severity: "Severe",
        noted: "2020-03-17"
      }
    ],
    dnrStatus: false,
    hipaaContacts: [
      {
        name: "Maria Gomez",
        relationship: "Wife",
        phone: "(555) 777-9988",
        authorized: true
      },
      {
        name: "Angela Gomez",
        relationship: "Daughter",
        phone: "(555) 333-4455",
        authorized: true
      }
    ],
    assignedNurse: "RN Maria Smith",
    room: "T-1",
    holdStatus: true,
    chiefComplaint: "Motor Vehicle Accident",
    status: "in-progress",
    assignedProvider: "Dr. Johnson",
    arrivalTime: "2025-04-08T04:30:00",
    priority: "urgent",
    mrn: "MRN4567891",
    lastUpdated: "2025-04-08T04:35:00",
    careArea: "Trauma",
    disposition: "To Be Admitted",
    labsPending: true,
    imagingPending: true,
    consultPending: true,
    acuity: 1,
    medicationOrders: {
      iv: [
        {
          id: "med-iv-3",
          name: "Normal Saline",
          dose: "1000mL",
          route: "IV Drip",
          ordered: "2025-04-08T04:40:00",
          orderedBy: "Dr. Johnson",
          status: "Administered",
          administeredAt: "2025-04-08T04:45:00",
          administeredBy: "RN Maria Smith"
        },
        {
          id: "med-iv-4",
          name: "Vancomycin",
          dose: "1g",
          route: "IV",
          ordered: getCurrentTimestamp(),
          orderedBy: "Dr. Johnson",
          status: "Ordered"
        }
      ],
      blood: [
        {
          id: "blood-1",
          name: "Type O Negative",
          volume: "1 unit",
          type: "Packed RBC",
          ordered: getCurrentTimestamp(),
          orderedBy: "Dr. Johnson",
          status: "Ordered"
        }
      ],
      injection: [
        {
          id: "inj-1",
          name: "Tetanus Toxoid",
          dose: "0.5mL",
          route: "IM",
          ordered: getCurrentTimestamp(),
          orderedBy: "Dr. Johnson",
          status: "Ordered"
        }
      ]
    },
    vitals: {
      temperature: "39.1°C",
      heartRate: 122,
      bloodPressure: "90/60",
      respiratoryRate: 24,
      oxygenSaturation: 93
    },
    labResults: [
      { name: "Lactate", value: "4.3 mmol/L", normal: false, timestamp: "2025-04-08T05:10:00" },
      { name: "WBC", value: "18,200/µL", normal: false, timestamp: "2025-04-08T05:10:00" },
      { name: "Creatinine", value: "1.8 mg/dL", normal: false, timestamp: "2025-04-08T05:10:00" }
    ],
    protocols: {
      sepsisProtocol: {
        ordered: "2025-04-08T04:45:00",
        orderedBy: "Dr. Johnson",
        status: "Active"
      }
    },
    nurseComments: {
      text: "Sepsis protocol activated. First dose of antibiotics given. Monitoring vitals q15min.",
      timestamp: "2025-04-08T04:50:00"
    },
    providerComments: {
      text: "Critical patient. Needs ICU transfer ASAP. Follow up on CT results.",
      timestamp: "2025-04-08T05:15:00"
    }
  },
  {
    id: "6",
    name: "Jennifer Martin",
    age: 29,
    gender: "Female",
    assignedNurse: "RN Thomas Allen",
    room: "Room 7",
    holdStatus: false,
    chiefComplaint: "Laceration, Hand",
    status: "discharge-ready",
    assignedProvider: "Dr. Thompson",
    arrivalTime: "2025-04-08T06:15:00",
    priority: "low",
    mrn: "MRN3456789",
    lastUpdated: "2025-04-08T07:30:00",
    careArea: "Fast Track",
    disposition: "Discharge",
    labsPending: false,
    imagingPending: false,
    consultPending: false,
    acuity: 4,
    isStroke: false,
    isSepsis: false,
    isFallRisk: false
  },
  {
    id: "7",
    name: "David Wilson",
    age: 41,
    gender: "Male",
    assignedNurse: null,
    room: "Lobby",
    chiefComplaint: "Ankle Sprain",
    status: "waiting",
    assignedProvider: null, // Unassigned - will show in red
    arrivalTime: "2025-04-08T07:45:00",
    priority: "low",
    mrn: "MRN2345678",
    lastUpdated: "2025-04-08T07:50:00",
    careArea: "Fast Track",
    disposition: null,
    labsPending: false,
    imagingPending: true,
    consultPending: false,
    acuity: 4,
    vitals: {
      temperature: "36.8°C",
      heartRate: 78,
      bloodPressure: "130/85",
      respiratoryRate: 14,
      oxygenSaturation: 99
    },
    nurseComments: {
      text: "Patient reports twisting ankle while playing basketball. Ice applied.",
      timestamp: "2025-04-08T08:00:00"
    },
    isStroke: false,
    isSepsis: false,
    isFallRisk: false
  },
  {
    id: "8",
    name: "Lisa Thompson",
    age: 65,
    gender: "Female",
    assignedNurse: "RN James Wilson",
    room: "C-1",
    holdStatus: true,
    chiefComplaint: "Stroke Symptoms",
    status: "in-progress",
    assignedProvider: "Dr. Harris",
    arrivalTime: "2025-04-08T05:30:00",
    priority: "urgent",
    mrn: "MRN8912345",
    lastUpdated: "2025-04-08T05:35:00",
    careArea: "Main ED",
    disposition: "To Be Admitted",
    labsPending: true,
    imagingPending: true,
    consultPending: true,
    acuity: 1,
    vitals: {
      temperature: "37.0°C",
      heartRate: 88,
      bloodPressure: "170/95",
      respiratoryRate: 18,
      oxygenSaturation: 97
    },
    protocols: {
      strokeProtocol: {
        ordered: "2025-04-08T05:40:00",
        orderedBy: "Dr. Harris",
        status: "Active"
      },
      fallRiskProtocol: {
        ordered: "2025-04-08T05:50:00",
        orderedBy: "Nurse Wilson",
        status: "Active"
      }
    },
    nurseComments: {
      text: "Stroke protocol activated. NIH stroke scale score: 14. tPA administered at 05:55.",
      timestamp: "2025-04-08T06:00:00"
    },
    providerComments: {
      author: "Dr. Harris",
      text: "Right-sided facial droop and arm weakness. CT shows no hemorrhage. Neurology consulted.",
      timestamp: "2025-04-08T06:15:00"
    }
  },
  {
    id: "9",
    name: "James Miller",
    age: 38,
    gender: "Male",
    room: "C-2",
    holdStatus: false,
    chiefComplaint: "Headache",
    status: "discharge-ready",
    assignedProvider: "Dr. Smith",
    arrivalTime: "2025-04-08T05:00:00",
    priority: "medium",
    mrn: "MRN5678912",
    lastUpdated: "2025-04-08T07:15:00",
    careArea: "Main ED",
    disposition: "Discharge",
    labsPending: false,
    imagingPending: false,
    consultPending: false,
    acuity: 3,
    vitals: {
      temperature: "36.9°C",
      heartRate: 72,
      bloodPressure: "128/82",
      respiratoryRate: 14,
      oxygenSaturation: 99
    },
    providerComments: {
      author: "Dr. Smith",
      text: "Migraine without aura. Discharged with prescription for sumatriptan.",
      timestamp: "2025-04-08T07:10:00"
    },
    isStroke: false,
    isSepsis: false,
    isFallRisk: false
  },
  {
    id: "10",
    name: "Karen Garcia",
    age: 5,
    gender: "Female",
    room: "P-2",
    chiefComplaint: "Ear Pain",
    status: "discharged",
    assignedProvider: "Dr. Wilson",
    arrivalTime: "2025-04-08T04:00:00",
    priority: "low",
    mrn: "MRN6789123",
    lastUpdated: "2025-04-08T06:00:00",
    careArea: "Peds",
    disposition: null,
    labsPending: false,
    imagingPending: false,
    consultPending: false,
    acuity: 5,
    vitals: {
      temperature: "37.5°C",
      heartRate: 90,
      bloodPressure: "100/60",
      respiratoryRate: 18,
      oxygenSaturation: 98
    },
    nurseComments: {
      text: "Patient discharged with mother. Reviewed antibiotic instructions.",
      timestamp: "2025-04-08T05:45:00"
    },
    providerComments: {
      author: "Dr. Wilson",
      text: "Acute otitis media. Prescribed amoxicillin for 10 days. Follow up with pediatrician in 2 weeks.",
      timestamp: "2025-04-08T05:30:00"
    },
    isStroke: false,
    isSepsis: false,
    isFallRisk: false
  }
];
