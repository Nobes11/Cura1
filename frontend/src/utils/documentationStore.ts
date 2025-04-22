import { create } from 'zustand';
import brain from 'brain';

// Template types
export enum TemplateType {
  REVIEW_OF_SYSTEMS = 'reviewOfSystems',
  CHIEF_COMPLAINT = 'chiefComplaint',
  PHYSICAL_EXAM = 'physicalExam',
  ASSESSMENT_PLAN = 'assessmentPlan'
}

// Template section interface for Review of Systems
export interface ROSSection {
  id: string;
  name: string;
  findings: Array<{
    id: string;
    name: string;
    normal: boolean;
    value?: string;
  }>;
}

// Interface for Review of Systems template
export interface ROSTemplate {
  id: string;
  name: string;
  type: TemplateType.REVIEW_OF_SYSTEMS;
  sections: ROSSection[];
}

// Union type for all template types
export type Template = ROSTemplate; // Add other template types here as they are created

// Interface for a completed documentation
export interface CompletedDocumentation {
  id: string;
  patientId: string;
  encounterId: string;
  templateId: string;
  templateType: TemplateType;
  content: any; // This will be template-specific data
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

// Store state interface
interface DocumentationStoreState {
  templates: Template[];
  activeTemplate: Template | null;
  completedDocumentations: CompletedDocumentation[];
  isLoading: boolean;
  error: string | null;
  // Actions
  loadTemplates: () => Promise<void>;
  setActiveTemplate: (templateId: string) => void;
  saveDocumentation: (documentation: Omit<CompletedDocumentation, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  getDocumentationsForPatient: (patientId: string) => Promise<CompletedDocumentation[]>;
}

// Define ROS template data
const initialROSTemplate: ROSTemplate = {
  id: 'ros-template-1',
  name: 'Standard Review of Systems',
  type: TemplateType.REVIEW_OF_SYSTEMS,
  sections: [
    {
      id: 'constitutional',
      name: 'Constitutional',
      findings: [
        { id: 'fever', name: 'Fever', normal: true },
        { id: 'chills', name: 'Chills', normal: true },
        { id: 'fatigue', name: 'Fatigue', normal: true },
        { id: 'malaise', name: 'Malaise', normal: true },
        { id: 'weight-loss', name: 'Weight Loss', normal: true },
        { id: 'weight-gain', name: 'Weight Gain', normal: true }
      ]
    },
    {
      id: 'heent',
      name: 'HEENT',
      findings: [
        { id: 'headache', name: 'Headache', normal: true },
        { id: 'vision-changes', name: 'Vision Changes', normal: true },
        { id: 'hearing-loss', name: 'Hearing Loss', normal: true },
        { id: 'ear-pain', name: 'Ear Pain', normal: true },
        { id: 'tinnitus', name: 'Tinnitus', normal: true },
        { id: 'nasal-congestion', name: 'Nasal Congestion', normal: true },
        { id: 'sore-throat', name: 'Sore Throat', normal: true }
      ]
    },
    {
      id: 'cardiovascular',
      name: 'Cardiovascular',
      findings: [
        { id: 'chest-pain', name: 'Chest Pain', normal: true },
        { id: 'palpitations', name: 'Palpitations', normal: true },
        { id: 'edema', name: 'Edema', normal: true },
        { id: 'orthopnea', name: 'Orthopnea', normal: true },
        { id: 'pnd', name: 'PND', normal: true }
      ]
    },
    {
      id: 'respiratory',
      name: 'Respiratory',
      findings: [
        { id: 'shortness-of-breath', name: 'Shortness of Breath', normal: true },
        { id: 'cough', name: 'Cough', normal: true },
        { id: 'wheezing', name: 'Wheezing', normal: true },
        { id: 'hemoptysis', name: 'Hemoptysis', normal: true }
      ]
    },
    {
      id: 'gastrointestinal',
      name: 'Gastrointestinal',
      findings: [
        { id: 'abdominal-pain', name: 'Abdominal Pain', normal: true },
        { id: 'nausea', name: 'Nausea', normal: true },
        { id: 'vomiting', name: 'Vomiting', normal: true },
        { id: 'diarrhea', name: 'Diarrhea', normal: true },
        { id: 'constipation', name: 'Constipation', normal: true },
        { id: 'bloody-stool', name: 'Bloody Stool', normal: true }
      ]
    },
    {
      id: 'genitourinary',
      name: 'Genitourinary',
      findings: [
        { id: 'dysuria', name: 'Dysuria', normal: true },
        { id: 'frequency', name: 'Frequency', normal: true },
        { id: 'hematuria', name: 'Hematuria', normal: true },
        { id: 'incontinence', name: 'Incontinence', normal: true }
      ]
    },
    {
      id: 'musculoskeletal',
      name: 'Musculoskeletal',
      findings: [
        { id: 'joint-pain', name: 'Joint Pain', normal: true },
        { id: 'muscle-pain', name: 'Muscle Pain', normal: true },
        { id: 'back-pain', name: 'Back Pain', normal: true },
        { id: 'joint-swelling', name: 'Joint Swelling', normal: true }
      ]
    },
    {
      id: 'skin',
      name: 'Skin',
      findings: [
        { id: 'rash', name: 'Rash', normal: true },
        { id: 'pruritus', name: 'Pruritus', normal: true },
        { id: 'skin-lesions', name: 'Skin Lesions', normal: true }
      ]
    },
    {
      id: 'neurological',
      name: 'Neurological',
      findings: [
        { id: 'dizziness', name: 'Dizziness', normal: true },
        { id: 'syncope', name: 'Syncope', normal: true },
        { id: 'seizures', name: 'Seizures', normal: true },
        { id: 'numbness', name: 'Numbness', normal: true },
        { id: 'weakness', name: 'Weakness', normal: true }
      ]
    },
    {
      id: 'psychiatric',
      name: 'Psychiatric',
      findings: [
        { id: 'depression', name: 'Depression', normal: true },
        { id: 'anxiety', name: 'Anxiety', normal: true },
        { id: 'suicidal-ideation', name: 'Suicidal Ideation', normal: true },
        { id: 'sleep-disturbance', name: 'Sleep Disturbance', normal: true }
      ]
    },
    {
      id: 'endocrine',
      name: 'Endocrine',
      findings: [
        { id: 'polydipsia', name: 'Polydipsia', normal: true },
        { id: 'polyphagia', name: 'Polyphagia', normal: true },
        { id: 'polyuria', name: 'Polyuria', normal: true },
        { id: 'heat-intolerance', name: 'Heat Intolerance', normal: true },
        { id: 'cold-intolerance', name: 'Cold Intolerance', normal: true }
      ]
    },
    {
      id: 'hematologic',
      name: 'Hematologic/Lymphatic',
      findings: [
        { id: 'easy-bruising', name: 'Easy Bruising', normal: true },
        { id: 'bleeding', name: 'Bleeding', normal: true },
        { id: 'lymphadenopathy', name: 'Lymphadenopathy', normal: true }
      ]
    },
    {
      id: 'allergic',
      name: 'Allergic/Immunologic',
      findings: [
        { id: 'environmental-allergies', name: 'Environmental Allergies', normal: true },
        { id: 'food-allergies', name: 'Food Allergies', normal: true },
        { id: 'immunocompromised', name: 'Immunocompromised', normal: true }
      ]
    }
  ]
};

// Create the store
export const useDocumentationStore = create<DocumentationStoreState>((set, get) => ({
  // State
  templates: [],
  activeTemplate: null,
  completedDocumentations: [],
  isLoading: false,
  error: null,

  // Load templates from API
  loadTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      // First check if we need to seed initial data
      await brain.seed_initial_templates();
      
      // Then fetch templates
      const response = await brain.get_templates();
      const data = await response.json();
      
      if (data && data.templates) {
        set({ templates: data.templates, isLoading: false });
      } else {
        set({ templates: [], isLoading: false });
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      set({ error: 'Failed to load templates', isLoading: false });
    }
  },

  // Set active template
  setActiveTemplate: (templateId: string) => {
    const template = get().templates.find(t => t.id === templateId) || null;
    set({ activeTemplate: template });
  },

  // Save documentation to API
  saveDocumentation: async (documentation) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.create_documentation(documentation);
      const result = await response.json();
      
      if (result && result.documentation) {
        set(state => ({
          completedDocumentations: [...state.completedDocumentations, result.documentation],
          isLoading: false
        }));
      } else {
        throw new Error('Failed to save documentation');
      }
    } catch (error) {
      console.error('Error saving documentation:', error);
      set({ error: 'Failed to save documentation', isLoading: false });
      throw error;
    }
  },

  // Get documentations for a patient from API
  getDocumentationsForPatient: async (patientId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await brain.get_patient_documentations({ patient_id: patientId });
      const data = await response.json();
      
      if (data && data.documentations) {
        set({ 
          completedDocumentations: data.documentations,
          isLoading: false 
        });
        return data.documentations;
      } else {
        set({ isLoading: false });
        return [];
      }
    } catch (error) {
      console.error('Error fetching patient documentations:', error);
      set({ error: 'Failed to fetch documentations', isLoading: false });
      return [];
    }
  }
}));