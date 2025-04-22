  // Quick Form Dialog
  const renderQuickFormDialog = () => {
    return (
      <Dialog open={showQuickFormDialog} onOpenChange={setShowQuickFormDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#7b9d8f]" />
              {selectedQuickForm ? `${selectedQuickForm} Form` : "Clinical Form"}
            </DialogTitle>
            <DialogDescription>
              Complete the required fields below
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedQuickForm === "Triage Intake" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="chiefComplaint">Chief Complaint</Label>
                  <Textarea id="chiefComplaint" placeholder="Patient's primary complaint..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="painLevel">Pain Level (0-10)</Label>
                    <Input id="painLevel" type="number" min="0" max="10" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="painLocation">Pain Location</Label>
                    <Input id="painLocation" placeholder="Location of pain" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="triageNotes">Additional Notes</Label>
                  <Textarea id="triageNotes" placeholder="Other relevant information..." />
                </div>
              </>
            )}
            
            {selectedQuickForm === "Return to Work" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">Diagnosis</Label>
                  <Input id="diagnosis" placeholder="Primary diagnosis" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restrictions">Work Restrictions</Label>
                  <Textarea id="restrictions" placeholder="List any work restrictions..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" />
                  </div>
                </div>
              </>
            )}
            
            {selectedQuickForm === "COVID Clearance" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="testDate">Test Date</Label>
                  <Input id="testDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testResult">Test Result</Label>
                  <select 
                    id="testResult"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select result...</option>
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                    <option value="inconclusive">Inconclusive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clearanceNotes">Clearance Notes</Label>
                  <Textarea id="clearanceNotes" placeholder="Additional notes..." />
                </div>
              </>
            )}
            
            {selectedQuickForm === "General Clinical Note" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="noteType">Note Type</Label>
                  <select 
                    id="noteType"
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select type...</option>
                    <option value="progress">Progress Note</option>
                    <option value="consult">Consultation</option>
                    <option value="procedure">Procedure Note</option>
                    <option value="followup">Follow-up</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clinicalNote">Clinical Note</Label>
                  <Textarea id="clinicalNote" placeholder="Enter clinical note..." className="min-h-[150px]" />
                </div>
              </>
            )}
            
            {!selectedQuickForm && (
              <div className="flex items-center justify-center h-40 border border-dashed rounded-md">
                <p className="text-slate-500">Please select a form type to continue</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQuickFormDialog(false)}>Cancel</Button>
            {selectedQuickForm && (
              <Button 
                className="bg-[#7b9d8f] hover:bg-[#c1632f]"
                onClick={() => {
                  alert(`${selectedQuickForm} form submitted!`);
                  setShowQuickFormDialog(false);
                }}
              >
                Submit Form
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Allergies Dialog
  const renderAllergiesDialog = () => {
    return (
      <Dialog open={showAllergiesDialog} onOpenChange={setShowAllergiesDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Add New Allergy
            </DialogTitle>
            <DialogDescription>
              Document a new patient allergy or intolerance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="allergen">Allergen/Substance</Label>
              <Input id="allergen" placeholder="Medication, food, or other substance" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reaction">Reaction</Label>
              <Textarea id="reaction" placeholder="Describe the patient's reaction..." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                  <SelectItem value="life-threatening">Life-threatening</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAllergiesDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success("Allergy added successfully");
              setShowAllergiesDialog(false);
            }}>
              Save Allergy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Vitals Dialog
  const renderVitalsDialog = () => {
    return (
      <Dialog open={showVitalsDialog} onOpenChange={setShowVitalsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Record Vitals
            </DialogTitle>
            <DialogDescription>
              Record new vital signs for this patient
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input id="temperature" type="text" placeholder="98.6" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bloodPressure">Blood Pressure</Label>
                <Input id="bloodPressure" placeholder="120/80" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                <Input id="heartRate" type="text" placeholder="72" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                <Input id="respiratoryRate" type="text" placeholder="18" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="o2sat">O₂ Saturation (%)</Label>
                <Input id="o2sat" type="text" placeholder="98" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="painLevel">Pain Level (0-10)</Label>
                <Input id="painLevel" type="number" min="0" max="10" placeholder="0" />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVitalsDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success("Vitals recorded successfully");
              setShowVitalsDialog(false);
            }}>
              Save Vitals
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // HIPAA Authorization Dialog
  const renderHipaaDialog = () => {
    return (
      <Dialog open={showHipaaDialog} onOpenChange={setShowHipaaDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              HIPAA Authorization
            </DialogTitle>
            <DialogDescription>
              Authorized contacts who may receive patient information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-md text-sm">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">HIPAA Compliance Status: {patientData.hipaaCompliance.formStatus}</p>
                  <p className="text-blue-700">Last Updated: {formatDate(patientData.hipaaCompliance.lastUpdated)}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Authorized Contacts</h3>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Relationship</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Access Level</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.hipaaCompliance.authorizedContacts.map((contact, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{contact.name}</TableCell>
                        <TableCell>{contact.relationship}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>
                          <Badge variant={contact.infoAccess === "Full" ? "default" : "outline"} className={contact.infoAccess === "Full" ? "bg-blue-500" : ""}>
                            {contact.infoAccess}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-md text-sm">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Information Disclosure Reminder</p>
                  <p className="text-amber-700">Only share patient information with authorized contacts as specified above. Verify identity before disclosure.</p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => alert('Update HIPAA authorization')}
              className="bg-[#7b9d8f] text-white hover:bg-[#c1632f]"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update Authorization
            </Button>
            <Button 
              onClick={() => setShowHipaaDialog(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Activity, AlertCircle, BarChart, ChevronLeft, ChevronRight, Clipboard, ClipboardCheck, Edit, FileText, FlaskConical, History, Home, Image, Info, LineChart, ListChecks, LayoutGrid, Pill, Plus, Printer, User, X, XCircle, CheckCircle, AlertTriangle } from "lucide-react";
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { SignatureButton } from './SignatureButton';
import { Patient } from '../utils/mockData';
import { DocumentationTemplateSelector } from './DocumentationTemplateSelector';
import { ROSDocumentationForm } from './ROSDocumentationForm';
import { DocumentationList } from './DocumentationList';
import { DocumentationViewer } from './DocumentationViewer';
import { Separator } from "@/components/ui/separator";

// Helper functions
const calculateTimeElapsed = (arrivalTime: string) => {
  const arrival = new Date(arrivalTime);
  const now = new Date();
  const diffMs = now.getTime() - arrival.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

interface PatientChartsProps {
  patient: Patient;
  onClose: () => void;
  initialForm?: 'triage' | null;
}

export const PatientCharts: React.FC<PatientChartsProps> = ({ patient, onClose }) => {

  // Tab state
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [activeVitalsView, setActiveVitalsView] = useState<'table' | 'trend'>('table');
  const [activeView, setActiveView] = useState<'ed' | 'provider' | 'floor'>('ed');

  // Navigation state
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState<boolean>(false);
  
  // Documentation state
  const [documentationMode, setDocumentationMode] = useState<'select' | 'document'>('select');
  
  // Dialog controls
  const [showDemoDialog, setShowDemoDialog] = useState(false);
  const [showHipaaDialog, setShowHipaaDialog] = useState(false);
  const [showAllergiesDialog, setShowAllergiesDialog] = useState(false);
  const [showVitalsDialog, setShowVitalsDialog] = useState(false);
  
  // Refs for section elements to track scroll position
  const sectionRefs = {
    summary: useRef<HTMLDivElement>(null),
    demographics: useRef<HTMLDivElement>(null),
    vitals: useRef<HTMLDivElement>(null),
    allergies: useRef<HTMLDivElement>(null),
    medications: useRef<HTMLDivElement>(null),
    problems: useRef<HTMLDivElement>(null),
    orders: useRef<HTMLDivElement>(null),
    results: useRef<HTMLDivElement>(null),
    imaging: useRef<HTMLDivElement>(null),
    notes: useRef<HTMLDivElement>(null),
    forms: useRef<HTMLDivElement>(null),
    documentation: useRef<HTMLDivElement>(null)
  };
  
  // Track scroll position to highlight active section
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const scrollPosition = contentRef.current.scrollTop;

      // Find which section is currently visible
      const sections = Object.keys(sectionRefs);

      for (const section of sections) {
        const ref = sectionRefs[section as keyof typeof sectionRefs];
        if (!ref.current) continue;

        const offsetTop = ref.current.offsetTop;
        const offsetHeight = ref.current.offsetHeight;

        if (scrollPosition >= offsetTop - 100 && 
            scrollPosition < offsetTop + offsetHeight - 100) {
          setActiveSection(section);
          break;
        }
      }
    };

    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', handleScroll);
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  // Check screen size and auto-collapse navigation on mobile
  useEffect(() => {
    const handleResize = () => {
      setIsNavigationCollapsed(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle tab and section synchronization
  useEffect(() => {
    // When switching to results tab, set the active section to labs
    if (activeTab === 'results' && activeSection !== 'labs') {
      setActiveSection('labs');
    } else if (activeTab === 'orders' && activeSection !== 'orders') {
      setActiveSection('orders');
    } else if (activeTab === 'documentation' && activeSection !== 'documentation') {
      setActiveSection('documentation');
    }
  }, [activeTab, activeSection]);

  // Dialog states
  const [showEncounterDialog, setShowEncounterDialog] = useState<boolean>(false);
  const [showDocumentationDialog, setShowDocumentationDialog] = useState<boolean>(false);
  const [showQuickFormDialog, setShowQuickFormDialog] = useState<boolean>(false);
  const [selectedQuickForm, setSelectedQuickForm] = useState<string>("");

  // Form states
  const [openForm, setOpenForm] = useState<{type: string, isOpen: boolean}>({type: '', isOpen: false});
  const [editingAllergy, setEditingAllergy] = useState<any>(null);
  const [editingVitals, setEditingVitals] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedDocumentation, setSelectedDocumentation] = useState<any>(null);
  
  // Documentation states
  const [showDocumentationViewDialog, setShowDocumentationViewDialog] = useState<boolean>(false);

  // Mock patient data that would come from API/DB
  const patientData = {
    // DNR Status
    dnrStatus: {
      status: "Full Code", // Options: "Full Code", "DNR", "DNR/DNI", "Comfort Care Only"
      dateUpdated: "2023-07-15",
      updatedBy: "Dr. Johnson",
      notes: ""
    },
    
    // HIPAA Compliance
    hipaaCompliance: {
      formStatus: "On File",
      lastUpdated: "2023-01-10",
      authorizedContacts: [
        { name: "Sarah Patterson", relationship: "Spouse", phone: "(555) 789-0123", infoAccess: "Full" },
        { name: "Michael Patterson", relationship: "Son", phone: "(555) 456-7890", infoAccess: "Limited" }
      ]
    },
    
    // Allergies
    allergies: [
      { allergen: "Penicillin", reaction: "Rash and hives", severity: "Severe", documented: "2022-05-12" },
      { allergen: "Sulfa Drugs", reaction: "Difficulty breathing", severity: "Severe", documented: "2021-11-03" },
      { allergen: "Latex", reaction: "Skin irritation", severity: "Moderate", documented: "2021-11-03" }
    ],
    
    // Vitals
    vitals: [
      { 
        time: "2023-08-01T10:30:00",
        temperature: "98.6",
        bloodPressure: "120/80",
        heartRate: "72",
        respiratoryRate: "18",
        oxygenSaturation: "98%",
        weight: "170 lbs",
        height: "5'10\"" 
      },
      { 
        time: "2023-08-01T06:15:00",
        temperature: "99.1",
        bloodPressure: "130/85",
        heartRate: "78",
        respiratoryRate: "20",
        oxygenSaturation: "97%",
        weight: "170 lbs",
        height: "5'10\"" 
      }
    ],
    
    // Demographics
    dateOfBirth: "1980-01-15",
    contactPhone: "(555) 123-4567",
    address: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zip: "90210"
    },
    insurance: {
      primary: "Blue Cross Blue Shield",
      memberId: "XYZ123456789",
      group: "EMPLOYER123"
    },

    // Medical History
    medicalConditions: [
      { condition: "Hypertension", diagnosedDate: "2018-05-10", status: "Active" },
      { condition: "Type 2 Diabetes", diagnosedDate: "2019-11-23", status: "Active" },
      { condition: "Asthma", diagnosedDate: "2005-08-15", status: "Controlled" }
    ],
    surgeries: [
      { procedure: "Appendectomy", date: "2010-02-20", surgeon: "Dr. Smith" },
      { procedure: "Knee Arthroscopy", date: "2015-06-18", surgeon: "Dr. Johnson" }
    ],
    familyHistory: [
      { condition: "Hypertension", relation: "Father" },
      { condition: "Breast Cancer", relation: "Mother" },
      { condition: "Type 1 Diabetes", relation: "Sister" }
    ],

    // Allergies
    allergies: [
      { allergen: "Penicillin", reaction: "Hives", severity: "Moderate", noted: "2012-06-30" },
      { allergen: "Peanuts", reaction: "Anaphylaxis", severity: "Severe", noted: "2005-11-14" }
    ],

    // Medications
    medications: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Daily", started: "2018-06-15", prescriber: "Dr. Johnson" },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily", started: "2019-12-05", prescriber: "Dr. Smith" },
      { name: "Albuterol Inhaler", dosage: "2 puffs", frequency: "As needed", started: "2005-09-01", prescriber: "Dr. Wilson" }
    ],

    // Problem List
    problems: [
      { problem: "Essential Hypertension", icd10: "I10", onset: "2018-05-10", status: "Active" },
      { problem: "Type 2 Diabetes Mellitus", icd10: "E11.9", onset: "2019-11-23", status: "Active" },
      { problem: "Asthma, Unspecified", icd10: "J45.909", onset: "2005-08-15", status: "Active" },
      { problem: "Hyperlipidemia", icd10: "E78.5", onset: "2018-07-22", status: "Active" }
    ],

    // Current ED Vitals
    vitals: [
      { 
        timestamp: "2023-08-01T08:30:00",
        temperature: "98.6",
        heartRate: "76",
        respRate: "16",
        bloodPressure: "120/80",
        oxygenSat: "99",
        painLevel: "1"
      },
      { 
        timestamp: "2023-08-01T10:30:00",
        temperature: "99.1",
        heartRate: "82",
        respRate: "18",
        bloodPressure: "126/84",
        oxygenSat: "97",
        painLevel: "3"
      },
      { 
        timestamp: "2023-08-01T12:30:00",
        temperature: "99.0",
        heartRate: "78",
        respRate: "17",
        bloodPressure: "122/82",
        oxygenSat: "98",
        painLevel: "2"
      }
    ],

    // Lab results
    labs: [
      {
        name: "Basic Metabolic Panel",
        collected: "2023-08-01T09:15:00",
        results: [
          { test: "Sodium", value: "140", unit: "mmol/L", normalRange: "135-145", flag: "" },
          { test: "Potassium", value: "4.2", unit: "mmol/L", normalRange: "3.5-5.0", flag: "" },
          { test: "Chloride", value: "102", unit: "mmol/L", normalRange: "98-108", flag: "" },
          { test: "CO2", value: "24", unit: "mmol/L", normalRange: "22-30", flag: "" },
          { test: "BUN", value: "15", unit: "mg/dL", normalRange: "7-20", flag: "" },
          { test: "Creatinine", value: "0.9", unit: "mg/dL", normalRange: "0.5-1.2", flag: "" },
          { test: "Glucose", value: "168", unit: "mg/dL", normalRange: "70-100", flag: "HIGH" }
        ]
      },
      {
        name: "Complete Blood Count",
        collected: "2023-08-01T09:15:00",
        results: [
          { test: "WBC", value: "12.3", unit: "K/uL", normalRange: "4.0-11.0", flag: "HIGH" },
          { test: "RBC", value: "4.8", unit: "M/uL", normalRange: "4.0-5.5", flag: "" },
          { test: "Hemoglobin", value: "14.2", unit: "g/dL", normalRange: "12.0-16.0", flag: "" },
          { test: "Hematocrit", value: "42", unit: "%", normalRange: "36-48", flag: "" },
          { test: "Platelets", value: "250", unit: "K/uL", normalRange: "150-400", flag: "" }
        ]
      },
      {
        name: "Troponin I",
        collected: "2023-08-01T09:15:00",
        results: [
          { test: "Troponin I", value: "0.02", unit: "ng/mL", normalRange: "<0.04", flag: "" }
        ]
      }
    ],

    // Orders
    orders: [
      { type: "Laboratory", name: "Comprehensive Metabolic Panel", status: "Completed", ordered: "2023-08-01T08:45:00", orderedBy: "Dr. Johnson" },
      { type: "Laboratory", name: "Complete Blood Count", status: "Completed", ordered: "2023-08-01T08:45:00", orderedBy: "Dr. Johnson" },
      { type: "Laboratory", name: "Troponin I", status: "Completed", ordered: "2023-08-01T08:45:00", orderedBy: "Dr. Johnson" },
      { type: "Imaging", name: "Chest X-Ray", status: "Pending", ordered: "2023-08-01T09:00:00", orderedBy: "Dr. Johnson" },
      { type: "Medication", name: "Acetaminophen 650mg", status: "Active", ordered: "2023-08-01T10:15:00", orderedBy: "Dr. Johnson" }
    ]
  };

  // Helper methods
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Event handlers
  const handleEditField = (fieldName: string) => {
    setEditingField(fieldName);
  }

  const handleSaveEncounterSummary = () => {
    setShowEncounterDialog(false);
  }

  const openFormModal = (formType: 'physician' | 'triage' | 'nurse' | 'returnToWork' | 'discharge' | 'procedureConsent' | 'medicalCertificate' | 'medicationRecord') => {
    setOpenForm({ type: formType, isOpen: true });
  }

  const closeFormModal = () => {
    setOpenForm({ type: '', isOpen: false });
  }

  const handleDeleteAllergy = (index: number) => {
    // Would update via API call in real implementation
    console.log('Delete allergy at index:', index);
  }

  // Render section content based on active view and section
  // Tab content rendering based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case 'ed':
        return renderSectionContent();
      case 'summary':
        return (
          <div className="space-y-4" ref={sectionRefs.summary}>
            {/* DNR Status and HIPAA Compliance Alert Card */}
            <Card className="border-l-4 border-amber-500 mb-4">
              <CardHeader className="pb-2 flex-row flex justify-between items-start">
                <div>
                  <CardTitle>Patient Status & Compliance</CardTitle>
                </div>
                <div className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => alert('Print patient summary')}>
                          <Printer className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Print patient summary</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {/* DNR Status Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-bold text-slate-700">DNR Status</h3>
                      {patientData.dnrStatus.status === "DNR" || patientData.dnrStatus.status === "DNR/DNI" || patientData.dnrStatus.status === "Comfort Care Only" ? (
                        <Badge className="bg-red-500 hover:bg-red-600">{patientData.dnrStatus.status}</Badge>
                      ) : (
                        <Badge className="bg-green-500 hover:bg-green-600">{patientData.dnrStatus.status}</Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mb-1">
                      Last updated: {formatDate(patientData.dnrStatus.dateUpdated)} by {patientData.dnrStatus.updatedBy}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1 h-7 text-xs bg-[#7b9d8f] text-white border-gray-400 hover:bg-[#c1632f] hover:text-white w-full justify-start"
                      onClick={() => alert('Update DNR status')}
                    >
                      <Edit className="h-3 w-3 mr-2" /> Update DNR Status
                    </Button>
                  </div>

                  {/* HIPAA Compliance Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-bold text-slate-700">HIPAA Compliance</h3>
                      <Badge className="bg-blue-500 hover:bg-blue-600">{patientData.hipaaCompliance.formStatus}</Badge>
                    </div>
                    <div className="text-xs text-slate-500 mb-1">
                      {patientData.hipaaCompliance.authorizedContacts.length} authorized contact(s)
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1 h-7 text-xs bg-[#7b9d8f] text-white border-gray-400 hover:bg-[#c1632f] hover:text-white w-full justify-start"
                      onClick={() => setShowHipaaDialog(true)}
                    >
                      <FileText className="h-3 w-3 mr-2" /> View HIPAA Authorization
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart Search Bar */}
            <div className="mb-4 relative">
              <Input 
                type="text" 
                placeholder="🔍 Search patient chart (meds, labs, notes...)"
                className="pl-9 bg-white border-2 focus-within:border-[#7b9d8f] transition-colors"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-100 bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-600">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>

            {/* Priority Action Buttons - Floating */}
            <div className="sticky top-0 z-10 bg-white shadow-md rounded-md p-3 mb-4 border-l-4 border-[#7b9d8f]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-700">Priority Actions</h3>
                <span className="text-xs text-slate-500">Patient ID: #{patient.id}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  className="bg-[#7b9d8f] hover:bg-[#c1632f] text-white font-medium shadow-sm"
                  onClick={() => {
                    setSelectedQuickForm("Triage Intake");
                    setShowQuickFormDialog(true);
                  }}
                >
                  <Clipboard className="h-4 w-4 mr-2" />
                  Start Triage
                </Button>
                <Button 
                  size="sm" 
                  className="bg-[#7b9d8f] hover:bg-[#c1632f] text-white font-medium shadow-sm"
                  onClick={() => alert('New Medication Order')}
                >
                  <Pill className="h-4 w-4 mr-2" />
                  Order Medication
                </Button>
                <Button 
                  size="sm" 
                  className="bg-[#7b9d8f] hover:bg-[#c1632f] text-white font-medium shadow-sm"
                  onClick={() => setShowDocumentationDialog(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
                <Button 
                  size="sm" 
                  className="bg-[#7b9d8f] hover:bg-[#c1632f] text-white font-medium shadow-sm"
                  onClick={() => openFormModal('discharge')}
                >
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Discharge
                </Button>
              </div>
            </div>

            {/* Quick Form Launcher */}
            <Card className="border-l-4 border-[#7b9d8f] mb-4">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-[#7b9d8f]" />
                    Quick Form Launcher
                  </CardTitle>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Quickly launch structured forms for common clinical tasks</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 items-center">
                  <select 
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={(e) => setSelectedQuickForm(e.target.value)}
                    value={selectedQuickForm}
                  >
                    <option value="">Select a form...</option>
                    <option value="Triage Intake">Triage Intake</option>
                    <option value="Return to Work">Return to Work</option>
                    <option value="COVID Clearance">COVID Clearance</option>
                    <option value="General Clinical Note">General Clinical Note</option>
                  </select>
                  <Button 
                    className="bg-[#7b9d8f] hover:bg-[#c1632f] text-white"
                    onClick={() => {
                      if (selectedQuickForm) {
                        setShowQuickFormDialog(true);
                      } else {
                        alert("Please select a form type");
                      }
                    }}
                  >
                    Open Form
                  </Button>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-8 px-2"
                    onClick={() => {
                      setSelectedQuickForm("Triage Intake");
                      setShowQuickFormDialog(true);
                    }}
                  >
                    Triage
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-8 px-2"
                    onClick={() => {
                      setSelectedQuickForm("Return to Work");
                      setShowQuickFormDialog(true);
                    }}
                  >
                    Return to Work
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-8 px-2"
                    onClick={() => {
                      setSelectedQuickForm("COVID Clearance");
                      setShowQuickFormDialog(true);
                    }}
                  >
                    COVID
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs h-8 px-2"
                    onClick={() => {
                      setSelectedQuickForm("General Clinical Note");
                      setShowQuickFormDialog(true);
                    }}
                  >
                    Note
                  </Button>
                </div>
              </CardContent>
            </Card>
            {/* Patient Overview Card */}
            <Card className="border-l-4 border-blue-500">
              <CardHeader className="pb-2">
                <CardTitle>Patient Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Demographics</h3>
                    <div className="mt-1 space-y-1">
                      <div className="text-sm">DOB: {formatDate(patientData.dateOfBirth)}</div>
                      <div className="text-sm">Phone: {patientData.contactPhone}</div>
                      <div className="text-sm">Address: {patientData.address.street}, {patientData.address.city}, {patientData.address.state}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-slate-500">Visit Information</h3>
                    <div className="mt-1 space-y-1">
                      <div className="text-sm">Chief Complaint: {patient.chiefComplaint}</div>
                      <div className="text-sm">Arrival: {formatDateTime(patient.arrivalTime)}</div>
                      <div className="text-sm">Status: <StatusBadge status={patient.status} /></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vitals Card */}
            <Card className="border-l-4 border-green-500" ref={sectionRefs.vitals}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-500" />
                    Vitals Snapshot
                  </CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button variant={activeVitalsView === 'table' ? 'default' : 'outline'} size="sm" onClick={() => setActiveVitalsView('table')}>Table</Button>
                  <Button variant={activeVitalsView === 'trend' ? 'default' : 'outline'} size="sm" onClick={() => setActiveVitalsView('trend')}>Trend</Button>
                </div>
              </CardHeader>
              <CardContent>
                {activeVitalsView === 'table' ? (
                  <div className="space-y-2">
                    {patientData.vitals.length > 0 && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-2 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                          <div className="text-sm font-medium text-gray-500">BP</div>
                          <div className="text-lg font-semibold">{patientData.vitals[patientData.vitals.length - 1].bloodPressure}</div>
                          <div className="text-xs text-gray-400">mmHg</div>
                        </div>
                        <div className="p-2 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                          <div className="text-sm font-medium text-gray-500">HR</div>
                          <div className="text-lg font-semibold">{patientData.vitals[patientData.vitals.length - 1].heartRate}</div>
                          <div className="text-xs text-gray-400">bpm</div>
                        </div>
                        <div className="p-2 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                          <div className="text-sm font-medium text-gray-500">Temp</div>
                          <div className="text-lg font-semibold">{patientData.vitals[patientData.vitals.length - 1].temperature}</div>
                          <div className="text-xs text-gray-400">°F</div>
                        </div>
                        <div className="p-2 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                          <div className="text-sm font-medium text-gray-500">RR</div>
                          <div className="text-lg font-semibold">{patientData.vitals[patientData.vitals.length - 1].respRate}</div>
                          <div className="text-xs text-gray-400">br/min</div>
                        </div>
                        <div className="p-2 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                          <div className="text-sm font-medium text-gray-500">O2</div>
                          <div className="text-lg font-semibold">{patientData.vitals[patientData.vitals.length - 1].oxygenSat}</div>
                          <div className="text-xs text-gray-400">%</div>
                        </div>
                        <div className="p-2 border rounded-md bg-white hover:bg-gray-50 transition-colors">
                          <div className="text-sm font-medium text-gray-500">Pain</div>
                          <div className="text-lg font-semibold">{patientData.vitals[patientData.vitals.length - 1].painLevel}</div>
                          <div className="text-xs text-gray-400">/10</div>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-7"
                        onClick={() => setShowVitalsDialog(true)}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Record New Vitals
                      </Button>
                      <div className="text-xs text-slate-500">
                        Last recorded: {formatDateTime(patientData.vitals[patientData.vitals.length - 1].timestamp)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="h-40 border rounded-md p-2 bg-white">
                      <div className="flex justify-between mb-2">
                        <div className="text-xs font-medium">Vital Trends (Last 24h)</div>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs h-5 bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer">BP</Badge>
                          <Badge variant="outline" className="text-xs h-5 bg-red-50 text-red-700 hover:bg-red-100 cursor-pointer">HR</Badge>
                          <Badge variant="outline" className="text-xs h-5 bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer">Temp</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-center h-28">
                        <LineChart className="h-6 w-6 text-gray-300" />
                        <span className="ml-2 text-sm text-gray-400">Vital signs trend chart would appear here</span>
                      </div>
                    </div>
                    <div className="text-xs text-right text-slate-500 mt-1">
                      Based on {patientData.vitals.length} measurements
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Allergies Card */}
            <Card className="border-l-4 border-red-500" ref={sectionRefs.allergies}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-red-500" /> 
                    Allergies & Alerts
                  </CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowAllergiesDialog(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent>
                {patientData.allergies.length > 0 ? (
                  <div className="space-y-2">
                    {patientData.allergies.map((allergy, index) => (
                      <div key={index} className={`flex justify-between items-center p-2 border rounded-md ${allergy.severity === 'Severe' ? 'bg-red-100 border-red-300' : 'bg-red-50 border-red-200'}`}>
                        <div>
                          <div className={`font-medium ${allergy.severity === 'Severe' ? 'text-red-700' : ''}`}>
                            {allergy.allergen}
                            {allergy.severity === 'Severe' && (
                              <span className="ml-2 animate-pulse">
                                <AlertTriangle className="h-4 w-4 text-red-600 inline" />
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-slate-600">
                            Reaction: <span className="font-medium">{allergy.reaction}</span> • 
                            Severity: <span className="font-medium">{allergy.severity}</span>
                          </div>
                        </div>
                        <Badge 
                          variant={allergy.severity === 'Severe' ? 'default' : 'outline'} 
                          className={allergy.severity === 'Severe' 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : allergy.severity === 'Moderate'
                              ? 'bg-red-100 text-red-700 border-red-200'
                              : 'bg-orange-100 text-orange-700 border-orange-200'
                          }
                        >
                          {allergy.severity}
                        </Badge>
                      </div>
                    ))}
                    
                    {/* Critical Alert Section */}
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-red-700 text-sm">Critical Alerts</h4>
                          <ul className="mt-1 text-sm text-red-700 space-y-1 list-disc list-inside">
                            <li>Patient has history of anaphylaxis</li>
                            <li>Patient has mast cell activation disorder</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 italic">No known allergies</div>
                )}
              </CardContent>
            </Card>

            {/* Medications Card */}
            <Card className="border-l-4 border-purple-500" ref={sectionRefs.medications}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Pill className="h-5 w-5 mr-2 text-purple-500" />
                    Active Medications
                  </CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert('Add medication')}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </CardHeader>
              <CardContent>
                {patientData.medications.length > 0 ? (
                  <div className="space-y-3">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Medication</TableHead>
                          <TableHead>Dose & Route</TableHead>
                          <TableHead>Compliance</TableHead>
                          <TableHead>Last Taken</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientData.medications.map((med, index) => {
                          // Mock compliance data
                          const complianceStatus = index === 0 ? "High" : (index === 1 ? "Medium" : "Low");
                          const lastTaken = index === 0 ? "Today 08:15" : (index === 1 ? "Yesterday 19:30" : "3 days ago");
                          
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{med.name}</TableCell>
                              <TableCell>{med.dosage}, {med.frequency}</TableCell>
                              <TableCell>
                                <Badge
                                  className={`${complianceStatus === "High" ? "bg-green-100 text-green-800 hover:bg-green-200" :
                                    complianceStatus === "Medium" ? "bg-amber-100 text-amber-800 hover:bg-amber-200" :
                                    "bg-red-100 text-red-800 hover:bg-red-200"}`}
                                >
                                  {complianceStatus}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{lastTaken}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    
                    <div className="flex justify-between items-center text-xs text-slate-500">
                      <span>Prescribing Provider: Dr. Johnson</span>
                      <span>Last medication review: {formatDate("2023-07-30")}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 italic">No active medications</div>
                )}
              </CardContent>
            </Card>

            {/* Recent Orders Summary Card */}
            <Card className="border-l-4 border-amber-500" ref={sectionRefs.results}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <FlaskConical className="h-5 w-5 mr-2 text-amber-500" />
                  Recent Orders Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Laboratory</h3>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Order
                      </Button>
                    </div>
                    <div className="border rounded-md divide-y">
                      {patientData.orders
                        .filter(order => order.type === "Laboratory")
                        .sort((a, b) => new Date(b.ordered).getTime() - new Date(a.ordered).getTime())
                        .slice(0, 3)
                        .map((order, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 text-sm hover:bg-gray-50">
                            <div>
                              <div className="font-medium">{order.name}</div>
                              <div className="text-xs text-slate-500">{formatDateTime(order.ordered)}</div>
                            </div>
                            <Badge 
                              className={`${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                          order.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                                          'bg-blue-100 text-blue-800'}`}
                            >
                              {order.status}
                            </Badge>
                          </div>
                        ))
                      }
                      {patientData.orders.filter(order => order.type === "Laboratory").length === 0 && (
                        <div className="p-2 text-sm text-slate-500 italic">No lab orders</div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Imaging</h3>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Order
                      </Button>
                    </div>
                    <div className="border rounded-md divide-y">
                      {patientData.orders
                        .filter(order => order.type === "Imaging")
                        .sort((a, b) => new Date(b.ordered).getTime() - new Date(a.ordered).getTime())
                        .slice(0, 2)
                        .map((order, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 text-sm hover:bg-gray-50">
                            <div>
                              <div className="font-medium">{order.name}</div>
                              <div className="text-xs text-slate-500">{formatDateTime(order.ordered)}</div>
                            </div>
                            <Badge 
                              className={`${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                          order.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                                          'bg-blue-100 text-blue-800'}`}
                            >
                              {order.status}
                            </Badge>
                          </div>
                        ))
                      }
                      {patientData.orders.filter(order => order.type === "Imaging").length === 0 && (
                        <div className="p-2 text-sm text-slate-500 italic">No imaging orders</div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Medications</h3>
                      <Button variant="ghost" size="sm" className="h-6 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Order
                      </Button>
                    </div>
                    <div className="border rounded-md divide-y">
                      {patientData.orders
                        .filter(order => order.type === "Medication")
                        .sort((a, b) => new Date(b.ordered).getTime() - new Date(a.ordered).getTime())
                        .slice(0, 2)
                        .map((order, idx) => (
                          <div key={idx} className="flex justify-between items-center p-2 text-sm hover:bg-gray-50">
                            <div>
                              <div className="font-medium">{order.name}</div>
                              <div className="text-xs text-slate-500">{formatDateTime(order.ordered)}</div>
                            </div>
                            <Badge 
                              className={`${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                          order.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                          order.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                                          'bg-blue-100 text-blue-800'}`}
                            >
                              {order.status}
                            </Badge>
                          </div>
                        ))
                      }
                      {patientData.orders.filter(order => order.type === "Medication").length === 0 && (
                        <div className="p-2 text-sm text-slate-500 italic">No medication orders</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical History Card */}
            <Card className="border-l-4 border-blue-500" ref={sectionRefs.problems}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <ListChecks className="h-5 w-5 mr-2 text-blue-500" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Conditions</h3>
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Condition</TableHead>
                            <TableHead>Diagnosed</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {patientData.medicalConditions.map((condition, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{condition.condition}</TableCell>
                              <TableCell>{formatDate(condition.diagnosedDate)}</TableCell>
                              <TableCell>
                                <Badge 
                                  className={`${condition.status === 'Active' ? 'bg-blue-100 text-blue-800' : 
                                    condition.status === 'Controlled' ? 'bg-green-100 text-green-800' : 
                                    'bg-gray-100 text-gray-800'}`}
                                >
                                  {condition.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Surgical History</h3>
                      <div className="border rounded-md">
                        {patientData.surgeries.length > 0 ? (
                          <div className="divide-y">
                            {patientData.surgeries.map((surgery, index) => (
                              <div key={index} className="p-2 text-sm">
                                <div className="font-medium">{surgery.procedure}</div>
                                <div className="text-xs text-slate-500">
                                  {formatDate(surgery.date)} • {surgery.surgeon}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-2 text-sm text-slate-500 italic">No surgical history</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Family History</h3>
                      <div className="border rounded-md">
                        {patientData.familyHistory.length > 0 ? (
                          <div className="divide-y">
                            {patientData.familyHistory.map((history, index) => (
                              <div key={index} className="p-2 text-sm">
                                <div className="font-medium">{history.condition}</div>
                                <div className="text-xs text-slate-500">
                                  Relation: {history.relation}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-2 text-sm text-slate-500 italic">No family history</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'chart':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Chart Review</CardTitle>
                <CardDescription>Comprehensive chart review for {patient.firstName} {patient.lastName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Chart Timeline */}
                  <div className="border-l-2 border-slate-200 pl-4 ml-2 space-y-4">
                    {[...patientData.vitals].sort((a, b) => 
                      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                    ).map((vital, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-blue-500"></div>
                        <div className="text-sm text-slate-500">{formatDateTime(vital.timestamp)}</div>
                        <div className="font-medium">Vitals Recorded</div>
                        <div className="text-sm">
                          BP: {vital.bloodPressure}, HR: {vital.heartRate}, Temp: {vital.temperature}°F
                        </div>
                      </div>
                    ))}
                    {[...patientData.labs].sort((a, b) => 
                      new Date(b.collected).getTime() - new Date(a.collected).getTime()
                    ).map((lab, index) => (
                      <div key={`lab-${index}`} className="relative">
                        <div className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-green-500"></div>
                        <div className="text-sm text-slate-500">{formatDateTime(lab.collected)}</div>
                        <div className="font-medium">{lab.name} Results</div>
                        <div className="text-sm">
                          {lab.results.filter(r => r.flag === "HIGH").length > 0 ? 
                            `${lab.results.filter(r => r.flag === "HIGH").length} abnormal values` : 
                            "All values within normal limits"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Orders & Results</CardTitle>
                <CardDescription>Manage orders and view results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Laboratory Orders */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Laboratory Orders</h3>
                    <div className="space-y-2">
                      {patientData.orders
                        .filter(order => order.type === "Laboratory")
                        .sort((a, b) => new Date(b.ordered).getTime() - new Date(a.ordered).getTime())
                        .map((order, index) => (
                          <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                            <div>
                              <div className="font-medium">{order.name}</div>
                              <div className="text-sm text-slate-500">
                                Ordered: {formatDateTime(order.ordered)} by {order.orderedBy}
                              </div>
                            </div>
                            <div>
                              <span className={`px-2 py-1 rounded-full text-xs 
                                ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-blue-100 text-blue-800'}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                  
                  {/* Imaging Orders */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Imaging Orders</h3>
                    <div className="space-y-2">
                      {patientData.orders
                        .filter(order => order.type === "Imaging")
                        .sort((a, b) => new Date(b.ordered).getTime() - new Date(a.ordered).getTime())
                        .map((order, index) => (
                          <div key={index} className="flex justify-between items-center p-2 border rounded-md">
                            <div>
                              <div className="font-medium">{order.name}</div>
                              <div className="text-sm text-slate-500">
                                Ordered: {formatDateTime(order.ordered)} by {order.orderedBy}
                              </div>
                            </div>
                            <div>
                              <span className={`px-2 py-1 rounded-full text-xs 
                                ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-blue-100 text-blue-800'}`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  {/* Clinical Protocols */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">Clinical Protocols</h3>
                    <div className="space-y-2">
                      {patient.protocolOrders ? (
                        <>
                          {patient.protocolOrders.stroke && (
                            <div className="flex justify-between items-center p-2 border rounded-md bg-red-50 border-red-200">
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-red-600 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
                                </div>
                                <div>
                                  <div className="font-medium">Stroke Protocol</div>
                                  <div className="text-sm text-slate-500">
                                    Ordered: {formatDateTime(patient.protocolOrders.stroke.ordered)} by {patient.protocolOrders.stroke.orderedBy}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className={`px-2 py-1 rounded-full text-xs 
                                  ${patient.protocolOrders.stroke.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                    patient.protocolOrders.stroke.status === 'Discontinued' ? 'bg-gray-100 text-gray-800' : 
                                    'bg-red-100 text-red-800'}`}>
                                  {patient.protocolOrders.stroke.status}
                                </span>
                              </div>
                            </div>
                          )}
                          {patient.protocolOrders.sepsis && (
                            <div className="flex justify-between items-center p-2 border rounded-md bg-purple-50 border-purple-200">
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-purple-500 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m8.5 14.5 5-5"/><path d="m8.5 9.5 5 5"/><circle cx="12" cy="12" r="10"/></svg>
                                </div>
                                <div>
                                  <div className="font-medium">Sepsis Protocol</div>
                                  <div className="text-sm text-slate-500">
                                    Ordered: {formatDateTime(patient.protocolOrders.sepsis.ordered)} by {patient.protocolOrders.sepsis.orderedBy}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className={`px-2 py-1 rounded-full text-xs 
                                  ${patient.protocolOrders.sepsis.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                    patient.protocolOrders.sepsis.status === 'Discontinued' ? 'bg-gray-100 text-gray-800' : 
                                    'bg-purple-100 text-purple-800'}`}>
                                  {patient.protocolOrders.sepsis.status}
                                </span>
                              </div>
                            </div>
                          )}
                          {patient.protocolOrders.fallRisk && (
                            <div className="flex justify-between items-center p-2 border rounded-md bg-amber-50 border-amber-200">
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-amber-500 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M17.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M6 11V8h11v.5"/><path d="M6 8V6a2 2 0 0 1 2-2h7.5"/><path d="m2 13.3 4-2.3v8h.6a2 2 0 0 0 1.8-1.06L10 15"/><path d="m14 15-1.87 3.27a2 2 0 0 0 .96 2.79l.8.4a2 2 0 0 0 2.53-1.17L21 12"/></svg>
                                </div>
                                <div>
                                  <div className="font-medium">Fall Risk Protocol</div>
                                  <div className="text-sm text-slate-500">
                                    Ordered: {formatDateTime(patient.protocolOrders.fallRisk.ordered)} by {patient.protocolOrders.fallRisk.orderedBy}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className={`px-2 py-1 rounded-full text-xs 
                                  ${patient.protocolOrders.fallRisk.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                    patient.protocolOrders.fallRisk.status === 'Discontinued' ? 'bg-gray-100 text-gray-800' : 
                                    'bg-amber-100 text-amber-800'}`}>
                                  {patient.protocolOrders.fallRisk.status}
                                </span>
                              </div>
                            </div>
                          )}
                          {patient.protocolOrders.stemi && (
                            <div className="flex justify-between items-center p-2 border rounded-md bg-orange-50 border-orange-200">
                              <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-orange-500 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                                </div>
                                <div>
                                  <div className="font-medium">Code STEMI</div>
                                  <div className="text-sm text-slate-500">
                                    Ordered: {formatDateTime(patient.protocolOrders.stemi.ordered)} by {patient.protocolOrders.stemi.orderedBy}
                                  </div>
                                </div>
                              </div>
                              <div>
                                <span className={`px-2 py-1 rounded-full text-xs 
                                  ${patient.protocolOrders.stemi.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                    patient.protocolOrders.stemi.status === 'Discontinued' ? 'bg-gray-100 text-gray-800' : 
                                    'bg-orange-100 text-orange-800'}`}>
                                  {patient.protocolOrders.stemi.status}
                                </span>
                              </div>
                            </div>
                          )}
                          {(!patient.protocolOrders.stroke && !patient.protocolOrders.sepsis && 
                            !patient.protocolOrders.fallRisk && !patient.protocolOrders.stemi) && (
                            <div className="text-slate-500 italic p-2 border rounded-md bg-gray-50">No active clinical protocols</div>
                          )}
                        </>
                      ) : (
                        <div className="text-slate-500 italic p-2 border rounded-md bg-gray-50">No active clinical protocols</div>
                      )}
                      
                      {/* Order Protocol Button */}
                      <div className="flex justify-center mt-2">
                        <Button variant="outline" size="sm" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Order Protocol
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* New Order Button */}
                  <div className="flex justify-center mt-4">
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Order
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'notes':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Documentation</CardTitle>
                <CardDescription>Notes and clinical documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Sample Notes - sorted with most recent first */}
                  {patientData.notes
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((note, index) => (
                      <div key={index} className="border rounded-md p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{note.title}</h3>
                            <div className="text-sm text-slate-500">Authored by: {note.author} - {formatDateTime(note.timestamp)}</div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                        <p className="text-sm">{note.content}</p>
                        <div className="mt-2 flex justify-end">
                          <SignatureButton status="signed" name={note.author} timestamp={formatDateTime(note.timestamp)} />
                        </div>
                      </div>
                    ))
                  }

                  {/* Create Note Button */}
                  <div className="flex justify-center mt-4">
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Note
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case 'patient-overview':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Overview</CardTitle>
                <CardDescription>Comprehensive summary for {patient.firstName} {patient.lastName}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Demographics */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Demographics</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Name:</span>
                        <span>{patient.firstName} {patient.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">DOB:</span>
                        <span>{formatDate(patientData.dateOfBirth)} ({patient.age})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">MRN:</span>
                        <span>{patient.mrn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Gender:</span>
                        <span>{patient.gender}</span>
                      </div>
                    </div>
                  </div>

                  {/* Current Visit */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Current Visit</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Chief Complaint:</span>
                        <span>{patient.chiefComplaint}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Arrival:</span>
                        <span>{formatDateTime(patient.arrivalTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Time in ED:</span>
                        <span>{calculateTimeElapsed(patient.arrivalTime)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Status:</span>
                        <StatusBadge status={patient.status} />
                      </div>
                    </div>
                  </div>

                  {/* Key Clinical Information */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Key Clinical Info</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Latest BP:</span>
                        <span>{patientData.vitals[patientData.vitals.length - 1].bloodPressure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Latest HR:</span>
                        <span>{patientData.vitals[patientData.vitals.length - 1].heartRate} bpm</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Latest Temp:</span>
                        <span>{patientData.vitals[patientData.vitals.length - 1].temperature}°F</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Allergies:</span>
                        <span>{patientData.allergies.length > 0 ? patientData.allergies.map(a => a.allergen).join(', ') : 'None'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-6">
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center" onClick={() => setActiveSection('vitals')}>
                    <Activity className="h-4 w-4 mb-1" />
                    <span className="text-xs">Vitals</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center" onClick={() => setActiveSection('orders')}>
                    <ClipboardCheck className="h-4 w-4 mb-1" />
                    <span className="text-xs">Orders</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center" onClick={() => setActiveSection('medications')}>
                    <Pill className="h-4 w-4 mb-1" />
                    <span className="text-xs">Meds</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center" onClick={() => setActiveSection('notes')}>
                    <FileText className="h-4 w-4 mb-1" />
                    <span className="text-xs">Notes</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  const renderSectionContent = () => {
    if (activeView === 'ed') {
      switch(activeSection) {
        case 'summary':
          return (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>ED Summary</CardTitle>
                  <CardDescription>Emergency Department overview for {patient.firstName} {patient.lastName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Time in ED:</span>
                      <span>{calculateTimeElapsed(patient.arrivalTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <StatusBadge status={patient.status} />
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Chief Complaint:</span>
                      <span>{patient.chiefComplaint}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        case 'vitals':
          return (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Vitals</CardTitle>
                  <CardDescription>Latest vital signs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...patientData.vitals].sort((a, b) => 
                      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                    ).map((vital, index) => (
                      <div key={index} className="border-b pb-3 last:border-0">
                        <div className="font-medium mb-2">{formatDateTime(vital.timestamp)}</div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <div className="text-slate-500">Temp</div>
                            <div>{vital.temperature}°F</div>
                          </div>
                          <div>
                            <div className="text-slate-500">Heart Rate</div>
                            <div>{vital.heartRate} bpm</div>
                          </div>
                          <div>
                            <div className="text-slate-500">Resp Rate</div>
                            <div>{vital.respRate} br/min</div>
                          </div>
                          <div>
                            <div className="text-slate-500">Blood Pressure</div>
                            <div>{vital.bloodPressure} mmHg</div>
                          </div>
                          <div>
                            <div className="text-slate-500">O2 Sat</div>
                            <div>{vital.oxygenSat}%</div>
                          </div>
                          <div>
                            <div className="text-slate-500">Pain Level</div>
                            <div>{vital.painLevel}/10</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        case 'allergies':
          return (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Allergies</CardTitle>
                  <CardDescription>Known allergies and reactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {patientData.allergies.length > 0 ? (
                      patientData.allergies.map((allergy, index) => (
                        <div key={index} className="border-b pb-2 last:border-0 flex justify-between items-center">
                          <div>
                            <div className="font-medium">{allergy.allergen}</div>
                            <div className="text-sm text-slate-500">
                              Reaction: {allergy.reaction} • Severity: {allergy.severity}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteAllergy(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-500 italic">No known allergies</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        case 'medications':
          return (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Medication Reconciliation</span>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                        <div className="flex items-center space-x-1">
                          <Info className="h-3 w-3" />
                          <span>Pending Review</span>
                        </div>
                      </Badge>
                    </div>
                  </CardTitle>
                  <CardDescription>Reconcile patient medications from home with hospital orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Tabs for different medication views */}
                    <Tabs defaultValue="reconciliation" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
                        <TabsTrigger value="home">Home Medications</TabsTrigger>
                        <TabsTrigger value="hospital">Hospital Orders</TabsTrigger>
                      </TabsList>
                      
                      {/* Reconciliation View */}
                      <TabsContent value="reconciliation" className="mt-4">
                        <div className="rounded-md border">
                          <div className="bg-slate-50 p-2 border-b">
                            <div className="grid grid-cols-12 text-xs font-medium text-slate-500">
                              <div className="col-span-3">Medication</div>
                              <div className="col-span-2">Home Dose</div>
                              <div className="col-span-2">Hospital Dose</div>
                              <div className="col-span-2">Action</div>
                              <div className="col-span-3">Notes</div>
                            </div>
                          </div>
                          
                          <div className="divide-y">
                            {/* Mock home medications for reconciliation */}
                            {patientData.medications.map((med, idx) => (
                              <div key={idx} className="grid grid-cols-12 p-2 items-center text-sm hover:bg-slate-50">
                                <div className="col-span-3 font-medium">{med.name}</div>
                                <div className="col-span-2">{med.dosage} {med.frequency}</div>
                                <div className="col-span-2">
                                  {idx === 0 ? (
                                    <span className="text-sky-700 font-medium">10mg Daily</span>
                                  ) : idx === 1 ? (
                                    <span className="text-amber-600 font-medium">1000mg BID</span>
                                  ) : (
                                    <span className="text-slate-400 italic">Not ordered</span>
                                  )}
                                </div>
                                <div className="col-span-2">
                                  <Select defaultValue={idx === 0 ? "continue" : idx === 1 ? "modify" : "stop"}>
                                    <SelectTrigger className="h-8">
                                      <SelectValue placeholder="Select action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="continue">
                                        <span className="flex items-center">
                                          <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-600" /> Continue
                                        </span>
                                      </SelectItem>
                                      <SelectItem value="modify">
                                        <span className="flex items-center">
                                          <Edit className="h-3.5 w-3.5 mr-1 text-amber-600" /> Modify
                                        </span>
                                      </SelectItem>
                                      <SelectItem value="stop">
                                        <span className="flex items-center">
                                          <XCircle className="h-3.5 w-3.5 mr-1 text-red-600" /> Stop
                                        </span>
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="col-span-3">
                                  <Input placeholder="Provider notes" className="h-8" 
                                    defaultValue={idx === 1 ? "Increase from 500mg to 1000mg" : ""} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Interaction Checking */}
                        <div className="mt-4 p-4 border rounded-md bg-amber-50 border-amber-200">
                          <h4 className="font-medium flex items-center text-amber-800 mb-2">
                            <AlertTriangle className="h-4 w-4 mr-2" /> Potential Interactions
                          </h4>
                          <div className="text-sm text-amber-700">
                            <p className="mb-2"><span className="font-medium">Lisinopril + Metformin:</span> Monitor for hypoglycemia. ACE inhibitors may enhance the hypoglycemic effect of antidiabetic agents.</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between">
                          <div>
                            <Button variant="outline" className="mr-2">
                              <FileText className="h-4 w-4 mr-2" /> Save Draft
                            </Button>
                            <Button variant="outline" className="mr-2">
                              <Printer className="h-4 w-4 mr-2" /> Print
                            </Button>
                          </div>
                          <div>
                            <Button className="bg-sky-700 hover:bg-sky-800">
                              <CheckCircle className="h-4 w-4 mr-2" /> Complete Reconciliation
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
          
          {/* Documentation Content */}
          <TabsContent value="documentation" className="space-y-4 py-6">
            <div ref={sectionRefs.documentation}>
              <DocumentationList 
                patientId={patient.id}
                onNewDocumentation={() => setShowDocumentationDialog(true)}
                onViewDocumentation={(doc) => {
                  setSelectedDocumentation(doc);
                  setShowDocumentationViewDialog(true);
                }}
              />
              
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle>Documentation Templates</CardTitle>
                  <CardDescription>Use structured templates to document clinical findings</CardDescription>
                </CardHeader>
                <CardContent>
                  {documentationMode === 'select' ? (
                    <DocumentationTemplateSelector 
                      onSelectTemplate={(templateId) => {
                        setSelectedTemplateId(templateId);
                        setDocumentationMode('document');
                      }}
                    />
                  ) : selectedTemplateId ? (
                    <ROSDocumentationForm
                      templateId={selectedTemplateId}
                      patientId={patient.id}
                      encounterId="current-encounter"
                      providerName="Dr. Johnson"
                      onSave={() => {
                        setDocumentationMode('select');
                        setSelectedTemplateId(null);
                      }}
                      onCancel={() => {
                        setDocumentationMode('select');
                        setSelectedTemplateId(null);
                      }}
                    />
                  ) : null}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
                      
                      {/* Home Medications View */}
                      <TabsContent value="home" className="mt-4">
                        <div className="rounded-md border">
                          <div className="bg-slate-50 p-2 border-b">
                            <div className="grid grid-cols-12 text-xs font-medium text-slate-500">
                              <div className="col-span-3">Medication</div>
                              <div className="col-span-2">Dosage</div>
                              <div className="col-span-2">Frequency</div>
                              <div className="col-span-2">Started</div>
                              <div className="col-span-3">Prescriber</div>
                            </div>
                          </div>
                          
                          <div className="divide-y">
                            {patientData.medications.map((med, idx) => (
                              <div key={idx} className="grid grid-cols-12 p-2 items-center text-sm hover:bg-slate-50">
                                <div className="col-span-3 font-medium">{med.name}</div>
                                <div className="col-span-2">{med.dosage}</div>
                                <div className="col-span-2">{med.frequency}</div>
                                <div className="col-span-2">{formatDate(med.started)}</div>
                                <div className="col-span-3">{med.prescriber}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Button variant="outline">
                            <Plus className="h-4 w-4 mr-2" /> Add Home Medication
                          </Button>
                        </div>
                      </TabsContent>
                      
                      {/* Hospital Orders View */}
                      <TabsContent value="hospital" className="mt-4">
                        <div className="rounded-md border">
                          <div className="bg-slate-50 p-2 border-b">
                            <div className="grid grid-cols-12 text-xs font-medium text-slate-500">
                              <div className="col-span-3">Medication</div>
                              <div className="col-span-2">Dose</div>
                              <div className="col-span-2">Route</div>
                              <div className="col-span-2">Schedule</div>
                              <div className="col-span-2">Status</div>
                              <div className="col-span-1">Actions</div>
                            </div>
                          </div>
                          
                          <div className="divide-y">
                            {/* Mock hospital orders */}
                            <div className="grid grid-cols-12 p-2 items-center text-sm hover:bg-slate-50">
                              <div className="col-span-3 font-medium">Lisinopril</div>
                              <div className="col-span-2">10mg</div>
                              <div className="col-span-2">PO</div>
                              <div className="col-span-2">Daily</div>
                              <div className="col-span-2">
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                              </div>
                              <div className="col-span-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-12 p-2 items-center text-sm hover:bg-slate-50">
                              <div className="col-span-3 font-medium">Metformin</div>
                              <div className="col-span-2">1000mg</div>
                              <div className="col-span-2">PO</div>
                              <div className="col-span-2">BID</div>
                              <div className="col-span-2">
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                              </div>
                              <div className="col-span-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Button variant="outline">
                            <Plus className="h-4 w-4 mr-2" /> New Medication Order
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        // Similar pattern for other sections...
        default:
          return (
            <div className="p-4 bg-slate-50 rounded-md">
              <p>ED View - {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} content will be displayed here.</p>
            </div>
          );
      }
    } else if (activeView === 'provider') {
      return (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Provider View - {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</CardTitle>
              <CardDescription>Clinical provider information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-slate-50 rounded-md">
                <p>Provider View - {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} content will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } else if (activeView === 'floor') {
      return (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Floor View - {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}</CardTitle>
              <CardDescription>Inpatient floor information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-slate-50 rounded-md">
                <p>Floor View - {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} content will be displayed here.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    return null;
  };

  // Render Section Titles
  const getSectionTitle = () => {
    return activeSection.charAt(0).toUpperCase() + activeSection.slice(1);
  };

  return (
    <>
      {/* Render dialogs */}
      {renderHipaaDialog()}
      {renderQuickFormDialog()}
      
      <Card className="fixed inset-0 z-50 bg-white flex flex-col max-h-screen overflow-hidden">
      {/* Header with patient banner */}
      <CardHeader className="bg-white px-6 py-4 shadow-sm z-20 sticky top-0">
        <div className="flex justify-between items-start w-full">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sky-100 text-sky-700 font-bold text-lg mt-1">
              {`${patient.firstName?.charAt(0)}${patient.lastName?.charAt(0)}`}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                {patient.firstName && patient.lastName ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}
              </h2>
              <div className="text-slate-600">
                {patient.age} years, {patient.gender} • MRN:{patient.mrn?.replace('MRN', '')} • Room: {patient.room}
              </div>
              <div className="text-slate-600 text-sm">
                DOB: {patientData?.dateOfBirth ? formatDate(patientData.dateOfBirth) : 'Unknown'} • Phone: {patientData?.contactPhone || 'Not provided'}
              </div>
              <div className="flex mt-2 space-x-2">
                <div className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Time in ED: {calculateTimeElapsed(patient.arrivalTime)}
                </div>
                <StatusBadge status={patient.status} />
                <PriorityBadge priority={patient.priority} />
              </div>
            </div>
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><path d="m15 18-6-6 6-6"/></svg>
              Back to Tracking Board
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* View tabs */}
      <CardHeader className="px-4 py-2 border-b border-slate-200 sticky top-[125px] z-10 bg-white shadow-sm">
        {/* View Type Tabs - ED, Provider, Floor */}
        <div className="mb-3">
          <div className="text-sm font-medium text-slate-500 mb-1">View Context</div>
          <div className="flex space-x-2">
            <Button 
              variant={activeView === 'ed' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setActiveView('ed')}
              className="flex items-center space-x-1"
            >
              <Activity className="h-4 w-4" />
              <span>ED View</span>
            </Button>
            <Button 
              variant={activeView === 'provider' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setActiveView('provider')}
              className="flex items-center space-x-1"
            >
              <Clipboard className="h-4 w-4" />
              <span>Provider View</span>
            </Button>
            <Button 
              variant={activeView === 'floor' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setActiveView('floor')}
              className="flex items-center space-x-1"
            >
              <Clipboard className="h-4 w-4" />
              <span>Floor View</span>
            </Button>
          </div>
        </div>

        {/* Tab Navigation - Original for clinical workflow */}
        <Tabs className="w-full" value={activeTab} onValueChange={(newTab) => {
          setActiveTab(newTab);
          
          // Reset scroll position when switching tabs
          if (contentRef.current) {
            contentRef.current.scrollTop = 0;
          }
          
          // Update active section based on tab
          if (newTab === 'overview') {
            setActiveSection('allergies');
          }
        }}>
          <TabsList className="w-full h-10 bg-slate-100 p-1 rounded-md">
            <TabsTrigger value="summary" className="rounded-md flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M8 12h8"></path><path d="M8 8h4"></path><path d="M8 16h4"></path></svg>
              Overview
            </TabsTrigger>
            <TabsTrigger value="ed" className="rounded-md flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
              Clinical
            </TabsTrigger>
            <TabsTrigger value="documentation" className="rounded-md flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Documentation
            </TabsTrigger>
            <TabsTrigger value="chart" className="rounded-md flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
              Chart Review
            </TabsTrigger>
            <TabsTrigger value="orders" className="rounded-md flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              Orders & Results
            </TabsTrigger>
            <TabsTrigger value="notes" className="rounded-md flex-1 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-1"><path d="M14 3v4a1 1 0 0 0 1 1h4"></path><path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z"></path><path d="M9 9h1"></path><path d="M9 13h6"></path><path d="M9 17h6"></path></svg>
              Documentation
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      {/* Main content with navigation panel */}
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="flex h-full overflow-hidden">
          {/* Left navigation panel */}
          <div className={`${isNavigationCollapsed ? 'w-12' : 'w-64'} border-r border-slate-200 bg-slate-50 h-full transition-all duration-200 flex-shrink-0`}>
            <div className="p-2 flex justify-between items-center border-b border-slate-200">
              <div className={`${isNavigationCollapsed ? 'hidden' : 'block'} font-medium text-sm text-slate-500`}>Navigation</div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => setIsNavigationCollapsed(!isNavigationCollapsed)}
              >
                {isNavigationCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="overflow-y-auto h-[calc(100%-40px)]">
              {/* Navigation starts with chart sections */}

              {/* Chart Section Navigation */}
              <div className="p-3 space-y-2">
                <div className="space-y-1">
                  {/* Summary */}
                  <div 
                    className={`${isNavigationCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md ${activeSection === 'summary' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'} cursor-pointer flex items-center ${isNavigationCollapsed ? '' : 'space-x-2'}`}
                    onClick={() => {
                      setActiveSection('summary');
                      if (sectionRefs.summary.current) {
                        sectionRefs.summary.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <Clipboard className="h-4 w-4" />
                    {!isNavigationCollapsed && <span>Patient Summary</span>}
                  </div>

                  {/* Demographics */}
                  <div 
                    className={`${isNavigationCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md ${activeSection === 'demographics' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'} cursor-pointer flex items-center ${isNavigationCollapsed ? '' : 'space-x-2'}`}
                    onClick={() => {
                      setActiveSection('demographics');
                      if (sectionRefs.demographics.current) {
                        sectionRefs.demographics.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <User className="h-4 w-4" />
                    {!isNavigationCollapsed && <span>Demographics</span>}
                  </div>

                  {/* Allergies */}
                  <div 
                    className={`${isNavigationCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md ${activeSection === 'allergies' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'} cursor-pointer flex items-center ${isNavigationCollapsed ? '' : 'space-x-2'}`}
                    onClick={() => {
                      setActiveSection('allergies');
                      if (sectionRefs.allergies.current) {
                        sectionRefs.allergies.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <AlertCircle className="h-4 w-4" />
                    {!isNavigationCollapsed && <span>Allergies</span>}
                  </div>

                  {/* Problems */}
                  <div 
                    className={`${isNavigationCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md ${activeSection === 'problems' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'} cursor-pointer flex items-center ${isNavigationCollapsed ? '' : 'space-x-2'}`}
                    onClick={() => {
                      setActiveSection('problems');
                      if (sectionRefs.problems.current) {
                        sectionRefs.problems.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <ListChecks className="h-4 w-4" />
                    {!isNavigationCollapsed && <span>Problems</span>}
                  </div>

                  {/* Medications */}
                  <div 
                    className={`${isNavigationCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md ${activeSection === 'medications' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'} cursor-pointer flex items-center ${isNavigationCollapsed ? '' : 'space-x-2'}`}
                    onClick={() => {
                      setActiveSection('medications');
                      if (sectionRefs.medications.current) {
                        sectionRefs.medications.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <Pill className="h-4 w-4" />
                    {!isNavigationCollapsed && <span>Medications</span>}
                  </div>

                  {/* Vitals */}
                  <div 
                    className={`${isNavigationCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md ${activeSection === 'vitals' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'} cursor-pointer flex items-center ${isNavigationCollapsed ? '' : 'space-x-2'}`}
                    onClick={() => {
                      setActiveSection('vitals');
                      if (sectionRefs.vitals.current) {
                        sectionRefs.vitals.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <Activity className="h-4 w-4" />
                    {!isNavigationCollapsed && <span>Vitals</span>}
                  </div>

                  {/* Orders */}
                  <div 
                    className={`${isNavigationCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md ${activeSection === 'orders' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'} cursor-pointer flex items-center ${isNavigationCollapsed ? '' : 'space-x-2'}`}
                    onClick={() => {
                      setActiveSection('orders');
                      if (sectionRefs.orders.current) {
                        sectionRefs.orders.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    {!isNavigationCollapsed && <span>Orders</span>}
                  </div>
                  
                  {/* Documentation */}
                  <div 
                    className={`${isNavigationCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md ${activeSection === 'documentation' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'} cursor-pointer flex items-center ${isNavigationCollapsed ? '' : 'space-x-2'}`}
                    onClick={() => {
                      setActiveSection('documentation');
                      setActiveTab('documentation');
                      if (sectionRefs.documentation.current) {
                        sectionRefs.documentation.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <FileText className="h-4 w-4" />
                    {!isNavigationCollapsed && <span>Documentation</span>}
                  </div>

                  {/* Results */}
                  <div 
                    className={`${isNavigationCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md ${activeSection === 'results' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'} cursor-pointer flex items-center ${isNavigationCollapsed ? '' : 'space-x-2'}`}
                    onClick={() => {
                      setActiveSection('results');
                      if (sectionRefs.results.current) {
                        sectionRefs.results.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <BarChart className="h-4 w-4" />
                    {!isNavigationCollapsed && <span>Lab Results</span>}
                  </div>

                  {/* Imaging */}
                  <div 
                    className={`${isNavigationCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md ${activeSection === 'imaging' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'} cursor-pointer flex items-center ${isNavigationCollapsed ? '' : 'space-x-2'}`}
                    onClick={() => {
                      setActiveSection('imaging');
                      if (sectionRefs.imaging.current) {
                        sectionRefs.imaging.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <Image className="h-4 w-4" />
                    {!isNavigationCollapsed && <span>Imaging</span>}
                  </div>

                  {/* Notes */}
                  <div 
                    className={`${isNavigationCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md ${activeSection === 'notes' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'} cursor-pointer flex items-center ${isNavigationCollapsed ? '' : 'space-x-2'}`}
                    onClick={() => {
                      setActiveSection('notes');
                      if (sectionRefs.notes.current) {
                        sectionRefs.notes.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <FileText className="h-4 w-4" />
                    {!isNavigationCollapsed && <span>Clinical Notes</span>}
                  </div>

                  {/* Forms */}
                  <div 
                    className={`${isNavigationCollapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md ${activeSection === 'forms' ? 'bg-slate-800 text-white' : 'hover:bg-slate-100 text-slate-800'} cursor-pointer flex items-center ${isNavigationCollapsed ? '' : 'space-x-2'}`}
                    onClick={() => {
                      setActiveSection('forms');
                      if (sectionRefs.forms.current) {
                        sectionRefs.forms.current.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <FileText className="h-4 w-4" />
                    {!isNavigationCollapsed && <span>Forms</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 overflow-y-auto h-full" ref={contentRef}>
            <div className="p-6">
              {activeTab === 'ed' || activeTab === 'provider' || activeTab === 'floor' ? (
                <>
                  {renderSectionContent()}
                </>
              ) : (
                renderTabContent()
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  );
};
