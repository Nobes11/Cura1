import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { mockPatients } from "../utils/mockData";
import { usePatientStore } from "../utils/patientStore";
import { useAuthStore } from "../utils/authStore";
import { usePatientContext } from "../utils/PatientContext";
import { NavigationBar } from "../components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, FileText, LayoutGrid, Pill, Activity, ClipboardList, Info, Plus, Edit, AlertCircle, User, CheckCircle, XCircle, History, Printer, LineChart, BarChart, ChevronLeft, ChevronRight, Image, Clipboard, ListChecks, FlaskConical, Home, X, Clock, Shield, FilePlus, Pencil, Eye, Check, BookMedical, ClipboardCheck, Thermometer, StickyNote, Waves, Search, LucideIcon, Layers, ScrollText, Syringe, Building2, Droplets, FileOutput, FilePenLine, GraduationCap, Heart, HandshakeIcon, HeartPulse, ListTodo, Scissors, LucideIcon as Stethoscope, UserCircle, Users, Wallet, Bandage, CircleX, AlertOctagon, ShieldAlert, Ban, PlusCircle, ChevronDown, Brain, Lock, UserMinus, ChevronsRight, ChevronsLeft, ArrowRight, Save, Pen, FileCheck, Target, UserCog, UploadCloud, MoveHorizontal, Utensils, ArrowRightLeft, Calendar, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { CodeStatusDialog } from "../components/CodeStatusDialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";


export default function PatientChart() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { setPatientDetailOpen } = usePatientContext();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeRole, setActiveRole] = useState("Provider");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Dialog states
  const [showAllergiesDialog, setShowAllergiesDialog] = useState(false);
  const [showVitalsDialog, setShowVitalsDialog] = useState(false);
  const [showHipaaDialog, setShowHipaaDialog] = useState(false);
  const [showQuickFormDialog, setShowQuickFormDialog] = useState(false);
  const [selectedQuickForm, setSelectedQuickForm] = useState("");
  const [showDemoDialog, setShowDemoDialog] = useState(false);
  const [showEncounterDialog, setShowEncounterDialog] = useState(false);
  const [showDocumentationDialog, setShowDocumentationDialog] = useState(false);
  const [showDocumentationViewDialog, setShowDocumentationViewDialog] = useState(false);
  const [showCodeStatusDialog, setShowCodeStatusDialog] = useState(false);

  // Tab state
  const [activeSection, setActiveSection] = useState("summary");
  const [activeVitalsView, setActiveVitalsView] = useState("table");
  const [activeView, setActiveView] = useState("ed");
  const [isNavigationCollapsed, setIsNavigationCollapsed] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState("summary");
  
  // Custom tab configuration
  const [availableTabs, setAvailableTabs] = useState([
    { id: "intake", name: "Ambulatory Intake", icon: FileText },
    { id: "summary", name: "Ambulatory Summary", icon: ClipboardList },
    { id: "careplan", name: "Advance Care Planning", icon: Clipboard },
    { id: "admission", name: "Hospital Admission", icon: Building2 },
    { id: "discharge", name: "Hospital Discharge", icon: ArrowRight },
    { id: "telemetry", name: "Telemetry", icon: Activity, disabled: true },
    { id: "sdoh", name: "Social Determinants", icon: Users, disabled: true },
  ]);
  
  // Active tabs in user's configuration (only enabled ones are shown by default)
  const [activeTabs, setActiveTabs] = useState(
    availableTabs.filter(tab => !tab.disabled).map(tab => tab.id)
  )
  
  // Handle showing the tab customization dialog
  const [showTabCustomizationDialog, setShowTabCustomizationDialog] = useState(false);
  
  // Collapsible panel states
  const [collapsibleStates, setCollapsibleStates] = useState({
    allergies: true,
    vitals: true,
    medications: true,
    problems: true,
    protocols: true,
    encounterNotes: true,
    labs: true,
    history: true
  });

  // Form states
  const [openForm, setOpenForm] = useState({type: "", isOpen: false});
  const [editingAllergy, setEditingAllergy] = useState(null);
  const [editingVitals, setEditingVitals] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [selectedDocumentation, setSelectedDocumentation] = useState(null);
  const [documentationMode, setDocumentationMode] = useState("select");
  
  // Protocol management state
  const [protocols, setProtocols] = useState([
    { id: "fall", name: "Fall Risk", active: false, severity: "moderate" },
    { id: "stemi", name: "STEMI", active: false, severity: "severe" },
    { id: "stroke", name: "Stroke", active: false, severity: "severe" },
    { id: "noama", name: "No AMA", active: false, severity: "moderate" },
    { id: "sepsis", name: "Sepsis", active: false, severity: "severe" },
    { id: "isolation", name: "Isolation", active: false, severity: "moderate" },
    { id: "restraints", name: "Restraints", active: false, severity: "moderate" },
    { id: "suicide", name: "Suicide Precautions", active: false, severity: "severe" }
  ]);
  
  // Past forms
  const pastForms = [
    { id: "form1", title: "Intake Assessment", date: "2025-04-15T10:30:00", provider: "Dr. Johnson" },
    { id: "form2", title: "Triage Form", date: "2025-04-15T10:15:00", provider: "Nurse Wilson" },
    { id: "form3", title: "Return to Work Clearance", date: "2025-04-10T14:00:00", provider: "Dr. Smith" },
    { id: "form4", title: "Surgery Clearance", date: "2025-03-22T09:30:00", provider: "Dr. Johnson" },
    { id: "form5", title: "Intake Assessment", date: "2025-03-15T16:45:00", provider: "Dr. Brown" }
  ];

  // Find patient data from store or mock data
  const patientStore = usePatientStore();
  const { selectedPatient } = usePatientContext();
  
  // Extract patientId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get("patientId");
  
  // State for tracking loading status
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the patient data when component mounts
  useEffect(() => {
    const fetchPatient = async () => {
      if (!patientId) {
        console.log('No patient ID found in URL parameters');
        // No patient ID provided, go back to Dashboard
        navigate("/Dashboard");
        return;
      }
      
      console.log('Fetching patient with ID:', patientId);
      try {
        // Attempt to fetch patient data from store
        await patientStore.fetchPatients();
        console.log('Patient store data after fetch:', patientStore.patients.length, 'patients');
        // Log all available patient IDs to help debug
        console.log('Available patient IDs in store:', patientStore.patients.map(p => p.id));
        console.log('Available patient IDs in mock data:', mockPatients.map(p => p.id));

        // If patient still not found, try loading directly from mock data as fallback
        const storePatient = patientStore.patients.find(p => p.id === patientId);
        if (!storePatient) {
          const mockPatient = mockPatients.find(p => p.id === patientId);
          if (mockPatient) {
            console.log('Patient found in mock data, adding to store');
            // Add mock patient to store to ensure it's available
            await patientStore.updatePatients([...patientStore.patients, mockPatient]);
          } else {
            console.error('Patient not found in either store or mock data');
            toast.error('Unable to find patient data');
          }
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
        toast.error('Error loading patient data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPatient();
  }, [patientId, navigate, patientStore]);
  
  // Use selectedPatient from context if available, otherwise fallback to URL parameter
  const patient = useMemo(() => {
    let result = selectedPatient;
    
    if (!result && patientId) {
      // Try to find in patient store first
      result = patientStore.patients.find(p => p.id === patientId);
      
      // If not found in store, try mock data as fallback
      if (!result) {
        result = mockPatients.find(p => p.id === patientId);
        console.log('Looking in mock data for:', patientId, 'found:', result ? 'yes' : 'no');
      }
    }
    
    return result;
  }, [selectedPatient, patientId, patientStore.patients]);
    
  // Debug log patient data
  useEffect(() => {
    if (!isLoading) {
      console.log('Selected patient from context:', selectedPatient ? selectedPatient.id : 'none');
      console.log('Patient ID from URL:', patientId);
      console.log('Patient store count:', patientStore.patients.length);
      console.log('Found patient:', patient ? patient.id : 'not found');
      
      if (!patient && patientId) {
        // Log all patient IDs to help debug
        console.log('Available patient IDs in store:', patientStore.patients.map(p => p.id));
        console.log('Available patient IDs in mock data:', mockPatients.map(p => p.id));
      }
    }
  }, [patient, isLoading, patientId, patientStore.patients, selectedPatient]);
    
  // Fix for background display issue: Set document body background to white when in patient chart
  useEffect(() => {
    // Save the original background
    const originalBackground = document.body.style.background;
    const originalBodyClass = document.body.className;
    
    // Set background to white and add a class to ensure it overrides other styles
    document.body.style.background = "#fff";
    document.body.style.backgroundColor = "#fff";
    document.body.className = `${originalBodyClass} patient-chart-active`;
    
    // Add a style tag to ensure specificity
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      body.patient-chart-active {
        background-color: #fff !important;
        background: #fff !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Mark patient detail as open
    setPatientDetailOpen(true);
    
    // Restore original background on unmount
    return () => {
      document.body.style.background = originalBackground;
      document.body.style.backgroundColor = originalBackground;
      document.body.className = originalBodyClass;
      document.head.removeChild(styleElement);
      setPatientDetailOpen(false);
    };
  }, [setPatientDetailOpen]);

  // Effect to handle auth state persistence
  useEffect(() => {
    // This will ensure auth state is checked continuously
    const intervalId = setInterval(() => {
      // Force a re-evaluation of auth state
      const { isAuthenticated: authState } = useAuthStore.getState();
      if (!authState) {
        navigate("/login");
      }
    }, 1000); // Check every second
    
    return () => clearInterval(intervalId);
  }, [navigate]);

  // Redirect to dashboard if no patient found
  useEffect(() => {
    // Make sure user is authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Redirect to dashboard if no patient found
    if (!patient) {
      navigate("/Dashboard");
    }
  }, [patient, navigate, isAuthenticated]);

  // If no patient is found, show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 p-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Loading Patient Data</CardTitle>
            <CardDescription>Please wait while we retrieve the patient information...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If patient data was loaded but no matching patient was found
  if (!patient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96 p-6">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-red-500">Patient Not Found</CardTitle>
            <CardDescription>The requested patient could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mt-2">Patient ID: {patientId || "Not provided"}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/")} className="w-full">
              Return to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Mock vitals data
  const mockVitals = [
    {
      timestamp: "2025-04-16T14:30:00",
      temperature: 98.6,
      heartRate: 72,
      respiratoryRate: 16,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      oxygenSaturation: 98,
      painLevel: 0
    },
    {
      timestamp: "2025-04-16T10:15:00",
      temperature: 99.1,
      heartRate: 86,
      respiratoryRate: 18,
      bloodPressureSystolic: 128,
      bloodPressureDiastolic: 84,
      oxygenSaturation: 96,
      painLevel: 3
    }
  ];

  // Date and time formatting utilities
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: false // Use 24-hour format
    });
  };

  // State for editing problems
  const [editingProblem, setEditingProblem] = useState<{id: string; name: string; code: string; date: string} | null>(null);
  const [showProblemDialog, setShowProblemDialog] = useState(false);
  
  // Mock active problems
  const [activeProblems, setActiveProblems] = useState([
    { id: "p1", name: "Hypertension", code: "I10", date: "Jan 2023" },
    { id: "p2", name: "Type 2 Diabetes Mellitus", code: "E11.9", date: "Mar 2022" },
    { id: "p3", name: "Asthma", code: "J45.901", date: "Aug 2020" }
  ]);
  
  // Mock resolved problems
  const [resolvedProblems, setResolvedProblems] = useState([
    { id: "p4", name: "Pneumonia", code: "J18.9", date: "Mar 2024", resolvedDate: "Mar 2024" },
    { id: "p5", name: "Acute Bronchitis", code: "J20.9", date: "Nov 2023", resolvedDate: "Nov 2023" },
    { id: "p6", name: "Otitis Media", code: "H66.9", date: "Jul 2022", resolvedDate: "Jul 2022" }
  ]);

  // Mock protocols
  const [activeProtocols, setActiveProtocols] = useState([
    { id: "pr1", name: "Fall Risk", severity: "high", date: "Apr 16, 2025", icon: AlertOctagon },
    { id: "pr2", name: "STEMI Protocol", severity: "high", date: "Apr 16, 2025", icon: Heart },
    { id: "pr3", name: "Sepsis Protocol", severity: "moderate", date: "Apr 15, 2025", icon: Droplets },
    { id: "pr4", name: "No AMA", severity: "information", date: "Apr 14, 2025", icon: Ban }
  ]);
  
  // Mock resolved protocols
  const [resolvedProtocols, setResolvedProtocols] = useState([
    { id: "pr5", name: "Stroke Protocol", severity: "high", date: "Apr 10, 2025", resolvedDate: "Apr 15, 2025" },
    { id: "pr6", name: "COVID-19 Precautions", severity: "moderate", date: "Apr 5, 2025", resolvedDate: "Apr 10, 2025" }
  ]);
  
  // Handle resolving a protocol
  const handleResolveProtocol = (protocol) => {
    // Remove from active protocols
    setActiveProtocols(activeProtocols.filter(p => p.id !== protocol.id));
    
    // Add to resolved protocols with today's date
    const today = new Date();
    const resolvedDate = today.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
    
    setResolvedProtocols([
      ...resolvedProtocols,
      {...protocol, resolvedDate}
    ]);
    
    toast.success(`Protocol '${protocol.name}' marked as resolved`);
    
    // Update patient in tracking board
    if (patientId) {
      const patientStore = usePatientStore();
      const updatedPatients = patientStore.patients.map(p => {
        if (p.id === patientId) {
          // Update specific flags based on protocol name
          const updatedPatient = { ...p };
          
          if (protocol.name.toLowerCase().includes('fall risk')) {
            updatedPatient.isFallRisk = false;
          } else if (protocol.name.toLowerCase().includes('stroke')) {
            updatedPatient.isStroke = false;
          } else if (protocol.name.toLowerCase().includes('sepsis')) {
            updatedPatient.isSepsis = false;
          } else if (protocol.name.toLowerCase().includes('stemi')) {
            updatedPatient.isStemi = false;
          } else if (protocol.name.toLowerCase().includes('no ama')) {
            updatedPatient.noAmaProtocol = false;
          }
          
          return updatedPatient;
        }
        return p;
      });
      
      // Update patient store
      patientStore.updatePatients(updatedPatients);
    }
  };

  // Handle resolving a problem
  const handleResolveProblem = (problem: {id: string; name: string; code: string; date: string}) => {
    // Remove from active problems
    setActiveProblems(activeProblems.filter(p => p.id !== problem.id));
    
    // Add to resolved problems with today's date
    const today = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const resolvedDate = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;
    
    setResolvedProblems([
      ...resolvedProblems,
      {...problem, resolvedDate}
    ]);
    
    toast.success(`Problem '${problem.name}' marked as resolved`);
  };

  // Mock patient data that would come from API/DB
  const patientData = {
    // DNR Status (legacy field)
    dnrStatus: {
      status: patient.dnrStatus ? "DNR" : "Full Code",
      dateUpdated: "2025-04-15",
      updatedBy: "Dr. Johnson",
      notes: ""
    },

    // Code Status model
    codeStatus: patient.codeStatus || {
      status: patient.dnrStatus ? "DNR" : "Full Code",
      lastUpdated: "2025-04-15T14:30:00",
      updatedBy: "Dr. Johnson",
      reason: patient.dnrStatus ? "Patient request" : "",
      history: []
    },

    // HIPAA Compliance
    hipaaCompliance: {
      formStatus: "On File",
      lastUpdated: "2025-01-10",
      authorizedContacts: [
        { name: "Sarah Patterson", relationship: "Spouse", phone: "(555) 789-0123", infoAccess: "Full" },
        { name: "Michael Patterson", relationship: "Son", phone: "(555) 456-7890", infoAccess: "Limited" }
      ]
    },

    // Allergies
    allergies: patient.allergies || [],

    // Lab Results
    labs: [
      {
        id: "lab1",
        name: "Complete Blood Count",
        collected: "2025-04-16T09:45:00",
        resulted: "2025-04-16T10:30:00",
        results: [
          { test: "WBC", value: "9.5", unit: "10^3/μL", normalRange: "4.5-11.0", flag: null },
          { test: "RBC", value: "4.2", unit: "10^6/μL", normalRange: "4.5-5.9", flag: "L" },
          { test: "Hemoglobin", value: "14.2", unit: "g/dL", normalRange: "13.5-17.5", flag: null },
          { test: "Hematocrit", value: "42", unit: "%", normalRange: "41-50", flag: null },
          { test: "Platelets", value: "342", unit: "10^3/μL", normalRange: "150-450", flag: null }
        ]
      },
      {
        id: "lab2",
        name: "Comprehensive Metabolic Panel",
        collected: "2025-04-16T09:45:00",
        resulted: "2025-04-16T11:15:00",
        results: [
          { test: "Glucose", value: "142", unit: "mg/dL", normalRange: "70-99", flag: "H" },
          { test: "Sodium", value: "140", unit: "mmol/L", normalRange: "136-145", flag: null },
          { test: "Potassium", value: "4.1", unit: "mmol/L", normalRange: "3.5-5.1", flag: null },
          { test: "Chloride", value: "102", unit: "mmol/L", normalRange: "98-107", flag: null },
          { test: "BUN", value: "15", unit: "mg/dL", normalRange: "7-20", flag: null },
          { test: "Creatinine", value: "0.9", unit: "mg/dL", normalRange: "0.7-1.3", flag: null }
        ]
      }
    ],

    // Imaging Results
    imaging: [],

    // Documentation
    documentation: [
      {
        id: "doc1",
        title: "Progress Note",
        provider: "Dr. Johnson",
        date: "2025-04-15T13:30:00",
        content: "Patient seen for routine follow-up of hypertension and diabetes. Blood pressure well controlled on current regimen. Fasting glucose still elevated, consider adjustment to Metformin dosage.",
        encounterType: "Outpatient"
      },
      {
        id: "doc2",
        title: "Phone Call",
        provider: "Nurse Wilson",
        date: "2025-04-14T10:15:00",
        content: "Patient called with questions about medication side effects. Advised to continue medications and schedule appointment if symptoms worsen.",
        encounterType: "Phone"
      }
    ]
  };

  // Handlers for dialog close
  const handleCloseAllergiesDialog = () => {
    setShowAllergiesDialog(false);
    setEditingAllergy(null);
  };

  const handleCloseVitalsDialog = () => {
    setShowVitalsDialog(false);
    setEditingVitals(null);
  };

  // Allergies Dialog
  const renderAllergiesDialog = () => {
    return (
      <Dialog open={showAllergiesDialog} onOpenChange={handleCloseAllergiesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#7b9d8f]" />
              {editingAllergy ? "Edit Allergy" : "Add Allergy"}
            </DialogTitle>
            <DialogDescription>
              Record a new patient allergy
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="allergen">Allergen</Label>
              <Input id="allergen" placeholder="Enter allergy..." defaultValue={editingAllergy?.allergen || ""} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reaction">Reaction</Label>
                <Input id="reaction" placeholder="Enter reaction..." defaultValue={editingAllergy?.reaction || ""} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select defaultValue={editingAllergy?.severity || "Moderate"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mild">Mild</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Additional information..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAllergiesDialog}>Cancel</Button>
            <Button 
              className="bg-[#7b9d8f] hover:bg-[#c1632f]"
              onClick={() => {
                toast.success(editingAllergy ? "Allergy updated!" : "Allergy added!");
                handleCloseAllergiesDialog();
              }}
            >
              {editingAllergy ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Vitals Dialog
  const renderVitalsDialog = () => {
    return (
      <Dialog open={showVitalsDialog} onOpenChange={handleCloseVitalsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#7b9d8f]" />
              {editingVitals ? "Edit Vitals" : "Record Vitals"}
            </DialogTitle>
            <DialogDescription>
              Record new vitals for the patient
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input id="temperature" type="number" step="0.1" defaultValue={editingVitals?.temperature || "98.6"} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                <Input id="heartRate" type="number" defaultValue={editingVitals?.heartRate || "75"} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                <Input id="respiratoryRate" type="number" defaultValue={editingVitals?.respiratoryRate || "16"} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="oxygenSaturation">O² Saturation (%)</Label>
                <Input id="oxygenSaturation" type="number" defaultValue={editingVitals?.oxygenSaturation || "98"} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="map">Mean Arterial Pressure (MAP)</Label>
                <Input id="map" type="number" defaultValue={editingVitals?.map || "93"} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="painLevel">Pain Level (0-10)</Label>
                <Input id="painLevel" type="number" min="0" max="10" defaultValue={editingVitals?.painLevel || "0"} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="systolic">Blood Pressure - Systolic</Label>
                <Input id="systolic" type="number" defaultValue={editingVitals?.bloodPressureSystolic || "120"} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diastolic">Blood Pressure - Diastolic</Label>
                <Input id="diastolic" type="number" defaultValue={editingVitals?.bloodPressureDiastolic || "80"} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (ft/in)</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input 
                    id="heightFeet" 
                    type="number" 
                    min="0" 
                    placeholder="Feet"
                    defaultValue={editingVitals?.heightFeet || ""}
                  />
                  <Input 
                    id="heightInches" 
                    type="number" 
                    min="0" 
                    max="11"
                    placeholder="Inches"
                    defaultValue={editingVitals?.heightInches || ""}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  min="0" 
                  placeholder="Weight in lbs"
                  defaultValue={editingVitals?.weight || ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bpArm">BP Measurement Arm</Label>
                <Select defaultValue="right">
                  <SelectTrigger id="bpArm">
                    <SelectValue placeholder="Select arm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bpCuffSize">BP Cuff Size</Label>
                <Select defaultValue="adult">
                  <SelectTrigger id="bpCuffSize">
                    <SelectValue placeholder="Select cuff size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pediatric">Pediatric</SelectItem>
                    <SelectItem value="small-adult">Small Adult</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="large-adult">Large Adult</SelectItem>
                    <SelectItem value="thigh">Thigh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="oxygenDelivery">Oxygen Delivery Method</Label>
              <Select defaultValue="room-air">
                <SelectTrigger id="oxygenDelivery">
                  <SelectValue placeholder="Select oxygen delivery method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="room-air">Room Air</SelectItem>
                  <SelectItem value="nasal-cannula">Nasal Cannula</SelectItem>
                  <SelectItem value="simple-mask">Simple Mask</SelectItem>
                  <SelectItem value="non-rebreather">Non-Rebreather Mask</SelectItem>
                  <SelectItem value="venturi-mask">Venturi Mask</SelectItem>
                  <SelectItem value="bipap">BiPAP</SelectItem>
                  <SelectItem value="cpap">CPAP</SelectItem>
                  <SelectItem value="ventilator">Ventilator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vitalsNotes">Notes</Label>
              <Textarea id="vitalsNotes" placeholder="Additional information..." />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseVitalsDialog}>Cancel</Button>
            <Button 
              className="bg-[#7b9d8f] hover:bg-[#c1632f]"
              onClick={() => {
                toast.success(editingVitals ? "Vitals updated!" : "Vitals added!");
                handleCloseVitalsDialog();
              }}
            >
              {editingVitals ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // HIPAA Dialog
  const renderHipaaDialog = () => {
    return (
      <Dialog open={showHipaaDialog} onOpenChange={setShowHipaaDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#7b9d8f]" />
              HIPAA Information & Authorized Contacts
            </DialogTitle>
            <DialogDescription>
              HIPAA compliance and information sharing preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">HIPAA Status</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {patientData.hipaaCompliance.formStatus}
                        </Badge>
                        <span className="text-sm text-slate-500">
                          Last updated: {patientData.hipaaCompliance.lastUpdated}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-md">
                        <p className="text-sm">Patient has signed HIPAA consent form and information can be shared with authorized contacts as specified below.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Information Sharing</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Voice messages may be left with detailed information</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">May discuss information with authorized contacts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Email communication not authorized</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Authorized Contacts</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Name</th>
                      <th className="px-4 py-2 text-left font-medium">Relationship</th>
                      <th className="px-4 py-2 text-left font-medium">Contact</th>
                      <th className="px-4 py-2 text-left font-medium">Access Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientData.hipaaCompliance.authorizedContacts.map((contact, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2 font-medium">{contact.name}</td>
                        <td className="px-4 py-2">{contact.relationship}</td>
                        <td className="px-4 py-2">{contact.phone}</td>
                        <td className="px-4 py-2">
                          <Badge variant={contact.infoAccess === "Full" ? "default" : "outline"} className={contact.infoAccess === "Full" ? "bg-blue-500" : ""}>
                            {contact.infoAccess}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select result..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positive">Positive</SelectItem>
                      <SelectItem value="negative">Negative</SelectItem>
                      <SelectItem value="inconclusive">Inconclusive</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="progress">Progress Note</SelectItem>
                      <SelectItem value="consult">Consultation</SelectItem>
                      <SelectItem value="procedure">Procedure Note</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
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
                  toast.success(`${selectedQuickForm} form submitted!`);
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

  // Code Status Dialog
  const renderCodeStatusDialog = () => {
    return (
      <CodeStatusDialog
        open={showCodeStatusDialog}
        onOpenChange={setShowCodeStatusDialog}
        codeStatus={patientData.codeStatus}
        onSave={(updatedCodeStatus) => {
          toast.success("Code status updated!");
          // In a real app, this would update the patient's code status
          console.log("Updated code status:", updatedCodeStatus);
          setShowCodeStatusDialog(false);
        }}
        currentProvider="Dr. Smith"
      />
    );
  };

  // Define a comprehensive tab list with expanded medical sections
  const tabLists = {
    Provider: [
      // Priority tabs in requested order
      { name: "Forms", icon: ClipboardList },
      { name: "Vitals", icon: Activity },
      { name: "Medications", icon: Pill },
      { name: "EncounterNotes", icon: FileText },
      { name: "Protocols", icon: ShieldAlert },
      { name: "Active Problems", icon: AlertCircle },
      { name: "Medical History", icon: ScrollText },
      // Additional detailed sections
      { name: "Assessments", icon: ClipboardCheck },

      { name: "Prescriptions", icon: FilePenLine },
      { name: "Consultations", icon: Users },
      { name: "Vaccinations", icon: Syringe },
      { name: "Social History", icon: UserCircle },
      { name: "Family History", icon: User },
      { name: "Surgical History", icon: Scissors },
      { name: "Physical Exams", icon: Activity },
      { name: "Consent Forms", icon: FileText },
      { name: "Documentation", icon: StickyNote },
      { name: "Care Plans", icon: ListTodo },
      { name: "Hospital Visits", icon: Building2 },
      { name: "Discharge Notes", icon: FileOutput },
      { name: "Preventive Care", icon: Shield },
      { name: "Health Maintenance", icon: HeartPulse },
      { name: "Insurance", icon: Wallet }
    ],
    Nursing: [
      // Priority tabs in requested order
      { name: "Forms", icon: ClipboardList },
      { name: "Vitals", icon: Activity },
      { name: "Medications", icon: Pill },
      { name: "EncounterNotes", icon: FileText },
      { name: "Active Problems", icon: AlertCircle },
      { name: "Medical History", icon: ScrollText },
      // Additional sections for nursing
      { name: "Allergies", icon: AlertTriangle },
      { name: "Assessments", icon: ClipboardCheck },
      { name: "Results", icon: FlaskConical },
      { name: "Labs", icon: FlaskConical },
      { name: "Imaging", icon: Image },
      { name: "Orders", icon: ClipboardCheck },
      { name: "Protocols", icon: ShieldAlert },
      { name: "Vaccinations", icon: Syringe },
      { name: "Fluid Balance", icon: Droplets },
      { name: "Nursing Notes", icon: FileText },
      { name: "Care Plans", icon: ListTodo },
      { name: "Wounds", icon: Bandage },
      { name: "Interventions", icon: Heart },
      { name: "Patient Education", icon: GraduationCap },
      { name: "Discharge Planning", icon: FileOutput },
      { name: "Consent Forms", icon: FileText },
      { name: "Social Services", icon: Users },
    ]
  };

  // Get current tab list based on active role
  const currentTabs = tabLists[activeRole];

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId.toLowerCase());
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Function to handle scrolling and update active tab
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Extract the ID and set it as the active tab
            const id = entry.target.id.toLowerCase();
            setActiveTab(id);
          }
        });
      },
      { threshold: 0.3 } // Trigger when at least 30% of the element is visible
    );

    // Observe all section elements
    const sections = document.querySelectorAll('[id]');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Function to handle scrolling and update active tab
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Extract the ID and set it as the active tab
            const id = entry.target.id.toLowerCase();
            setActiveTab(id);
          }
        });
      },
      { threshold: 0.3 } // Trigger when at least 30% of the element is visible
    );

    // Observe all section elements
    const sections = document.querySelectorAll('[id]');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="bg-white">
      {/* Add the NavigationBar component at the top of the page */}
      <NavigationBar />
      <div className="p-4 space-y-4 overflow-x-hidden bg-white">
      {/* Include all dialog components */}
      {renderAllergiesDialog()}
      {renderVitalsDialog()}
      {renderHipaaDialog()}
      {renderQuickFormDialog()}
      {renderCodeStatusDialog()}

      {/* Tab Customization Dialog */}
      <Dialog open={showTabCustomizationDialog} onOpenChange={setShowTabCustomizationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customize Chart Views</DialogTitle>
            <DialogDescription>
              Select and reorder the chart views you want to see in your tabs.  
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              {availableTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTabs.includes(tab.id);
                return (
                  <div key={tab.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-slate-500" />
                      <span className="font-medium text-sm">{tab.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={isActive} 
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setActiveTabs([...activeTabs, tab.id]);
                          } else {
                            setActiveTabs(activeTabs.filter(id => id !== tab.id));
                          }
                        }}
                      />
                      {isActive && (
                        <div className="flex">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              const currentIndex = activeTabs.indexOf(tab.id);
                              if (currentIndex > 0) {
                                const newActiveTabs = [...activeTabs];
                                const temp = newActiveTabs[currentIndex];
                                newActiveTabs[currentIndex] = newActiveTabs[currentIndex - 1];
                                newActiveTabs[currentIndex - 1] = temp;
                                setActiveTabs(newActiveTabs);
                              }
                            }}
                            disabled={activeTabs.indexOf(tab.id) === 0}
                          >
                            <ChevronsLeft className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              const currentIndex = activeTabs.indexOf(tab.id);
                              if (currentIndex < activeTabs.length - 1) {
                                const newActiveTabs = [...activeTabs];
                                const temp = newActiveTabs[currentIndex];
                                newActiveTabs[currentIndex] = newActiveTabs[currentIndex + 1];
                                newActiveTabs[currentIndex + 1] = temp;
                                setActiveTabs(newActiveTabs);
                              }
                            }}
                            disabled={activeTabs.indexOf(tab.id) === activeTabs.length - 1}
                          >
                            <ChevronsRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowTabCustomizationDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              // Save tab configuration (in a real app, this would persist to storage)
              setShowTabCustomizationDialog(false);
            }} className="bg-[#7b9d8f] hover:bg-[#c1632f]">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      {/* Role toggle at the top */}
      <div className="mb-4">
        <div className="inline-flex items-center rounded-lg border p-1 shadow-sm">
          <Button
            variant={activeRole === "Provider" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveRole("Provider")}
            className={activeRole === "Provider" ? "bg-[#7b9d8f] text-white" : ""}
          >
            Provider View
          </Button>
          <Button
            variant={activeRole === "Nursing" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveRole("Nursing")}
            className={activeRole === "Nursing" ? "bg-[#7b9d8f] text-white" : ""}
          >
            Nursing View
          </Button>
        </div>
      </div>

      {/* Patient header - Compact PowerChart style */}
      <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4 mb-6">
        {/* Main patient info row */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">{patient.name}</h1>
              <div className="flex gap-2">
                <Badge 
                  className={patient.dnrStatus ? "bg-red-100 text-red-800 border-red-300" : "bg-green-100 text-green-800 border-green-300"}
                  title={patient.dnrStatus ? "Patient has Do Not Resuscitate status" : "Patient has Full Code status"}
                >
                  {patient.dnrStatus ? "DNR" : "Full Code"}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  ED Visit
                </Badge>
              </div>
            </div>
            <div className="text-base text-slate-600 flex items-center gap-4">
              <div>MRN: {patient.id}</div>
              <div>{patient.age} yr, {patient.gender}</div>
              <div>DOB: {patient.dateOfBirth || "01/15/1980"}</div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-9" 
                    onClick={() => setShowHipaaDialog(true)}
                  >
                    <Shield className="h-4 w-4" />
                    <span className="sr-only">HIPAA Information</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>HIPAA Compliance Information</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="h-9"
                    onClick={() => setShowCodeStatusDialog(true)}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span className="sr-only">Code Status</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Update Code Status</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button 
              variant="outline"
              size="sm"
              className="h-9 bg-white"
              onClick={() => navigate('/Dashboard', { replace: true })} // Use replace to avoid adding to history stack
            >
              <Home className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Patient info rows */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-y-2 text-sm">
          {/* First row */}
          <div className="flex flex-wrap gap-x-6">
            <div>
              <span className="font-medium">HIPAA:</span> On File
            </div>
            <div>
              <span className="font-medium">Location:</span> ED Room 12
            </div>
            <div>
              <span className="font-medium">Provider:</span> Dr. Johnson
            </div>
          </div>

          {/* Second row - visit info */}
          <div className="flex items-center text-xs text-slate-600">
            <span className="font-medium mr-1">Visit Info:</span>
            <span>Arrived {formatDateTime("2025-04-16T08:30:00")} with chief complaint of chest pain</span>
          </div>
        </div>

        {/* Cards for demographics, allergies, and vitals */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-md p-3">
              <h3 className="font-medium mb-2 text-sm">Demographics</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p><strong>Address:</strong> 123 Main St, Apt 4B</p>
                  <p><strong>Phone:</strong> (555) 123-4567</p>
                </div>
                <div>
                  <p><strong>Height:</strong> 5'10"</p>
                  <p><strong>Weight:</strong> 165 lbs</p>
                </div>
              </div>
          </div>

          <div className="bg-white rounded-md p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex flex-col">
                <h3 className="font-medium text-sm">Allergies</h3>
                <span className="text-xs text-slate-500">Last reviewed: Apr 16, 2025 10:30</span>
              </div>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowAllergiesDialog(true)}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {patientData.allergies && patientData.allergies.length > 0 ? (
              <ul className="list-disc list-inside text-xs">
                {patientData.allergies.map((allergy, index) => {
                  // Determine severity color based on severity level
                  let severityColor = "bg-blue-100 text-blue-800";
                  if (allergy.severity === "Severe" || allergy.reaction.toLowerCase().includes("anaphylaxis")) {
                    severityColor = "bg-red-100 text-red-800";
                  } else if (allergy.severity === "Moderate") {
                    severityColor = "bg-amber-100 text-amber-800";
                  } else if (allergy.severity === "Mild") {
                    severityColor = "bg-green-100 text-green-800";
                  }
                  
                  return (
                    <li key={index} className="py-0.5">
                      <span className="font-medium">{allergy.allergen}</span> - {allergy.reaction} 
                      <Badge variant="outline" className={`ml-1 text-xs ${severityColor}`}>
                        {allergy.reaction.toLowerCase().includes("anaphylaxis") ? "Severe" : allergy.severity}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-xs">No known allergies</p>
            )}
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs h-7"
                onClick={() => alert('Review allergies')}
              >
                Review Allergies
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-md p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-sm">Recent Vitals</h3>
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setShowVitalsDialog(true)}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            {mockVitals.length > 0 && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div>
                  <p className="text-slate-500">Temperature</p>
                  <p className="font-medium">{mockVitals[0].temperature}°F</p>
                </div>
                <div>
                  <p className="text-slate-500">Heart Rate</p>
                  <p className="font-medium">{mockVitals[0].heartRate} bpm</p>
                </div>
                <div>
                  <p className="text-slate-500">Blood Pressure</p>
                  <p className="font-medium">{mockVitals[0].bloodPressureSystolic}/{mockVitals[0].bloodPressureDiastolic} mmHg</p>
                </div>
                <div>
                  <p className="text-slate-500">O₂ Saturation</p>
                  <p className="font-medium">{mockVitals[0].oxygenSaturation}%</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PowerChart Layout - Sidebar and Content */}
      <div className="flex flex-col lg:flex-row gap-4 min-h-[calc(100vh-250px)]">
        {/* Vertical Sidebar Navigation - Expanded down the full chart */}
        <div className="w-full lg:w-60 flex-shrink-0 bg-white shadow rounded-lg p-3 lg:h-full lg:sticky lg:top-4 border border-slate-200 overflow-hidden">
          <div className="flex justify-between items-center p-2 border-b border-slate-100 mb-3">
            <h3 className="font-semibold text-slate-700">Chart Sections</h3>
          </div>
          <nav className="h-full overflow-y-auto pr-2 space-y-1">
            {currentTabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <button
                  key={`${tab.name}-${index}`}
                  onClick={() => scrollToSection(tab.name)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === tab.name.toLowerCase() 
                    ? "bg-[#7b9d8f] text-white" 
                    : "text-slate-700 hover:bg-slate-100"}`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${activeTab === tab.name.toLowerCase() ? "text-white" : "text-slate-500"}`} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-6 pb-8 overflow-x-hidden border-l border-slate-100 pl-4">
          {/* Main Tabs Navigation - Clinical Workflow Tabs */}
          <Tabs 
            value={activeMainTab} 
            onValueChange={setActiveMainTab} 
            className="w-full"
          >
            <div className="bg-white shadow rounded-lg py-3 mb-4 border border-slate-200">
              <TabsList className="flex mb-0 overflow-x-auto bg-white p-1 rounded-md">
                {availableTabs
                  .filter(tab => activeTabs.includes(tab.id))
                  .map(tab => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger 
                        key={tab.id}
                        value={tab.id} 
                        className="flex-1 whitespace-nowrap px-4 py-2"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {tab.name}
                      </TabsTrigger>
                    );
                  })}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="px-2 ml-2 rounded-md hover:bg-slate-100"
                        onClick={() => setShowTabCustomizationDialog(true)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Customize Workflow Tabs</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TabsList>
            </div>

            {/* Ambulatory Intake Tab Content */}
            <TabsContent value="intake" className="space-y-6">
              <div className="flex gap-4">
                {/* Secondary Sidebar for Intake View */}
                <div className="w-48 flex-shrink-0 bg-slate-50 shadow rounded-lg p-3 border border-slate-200 overflow-hidden">
                  <div className="flex justify-between items-center p-2 border-b border-slate-100 mb-3">
                    <h3 className="font-semibold text-slate-700 text-sm">Intake Sections</h3>
                  </div>
                  <nav className="space-y-1">
                    {[
                      { name: "Chief Complaint", icon: AlertCircle },
                      { name: "Vitals", icon: Activity },
                      { name: "Allergies", icon: AlertOctagon },
                      { name: "Medications", icon: Pill },
                      { name: "History", icon: ScrollText },
                      { name: "Screen", icon: Search },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          className="w-full text-left px-3 py-2 rounded-md text-xs font-medium 
                            flex items-center gap-2 text-slate-700 hover:bg-slate-100"
                        >
                          <Icon className="h-3.5 w-3.5 text-slate-500" />
                          {item.name}
                        </button>
                      );
                    })}
                  </nav>
                </div>
                
                {/* Intake Forms */}
                <div className="flex-1 space-y-4">
                  {/* Chief Complaint Card */}
                  <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-slate-500" />
                        <h2 className="text-lg font-semibold">Chief Complaint</h2>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="complaint">Chief Complaint</Label>
                          <Textarea 
                            id="complaint" 
                            placeholder="Enter patient's primary complaint..." 
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="onset">Onset</Label>
                          <div className="flex gap-2 mt-1">
                            <Input id="onset" type="date" className="w-40" />
                            <Input type="time" className="w-32" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="severity">Severity (1-10)</Label>
                          <div className="flex gap-2 items-center mt-1">
                            <Input id="severity" type="number" min="1" max="10" className="w-20" />
                            <Select defaultValue="unchanged">
                              <SelectTrigger className="w-40">
                                <SelectValue placeholder="Trend" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unchanged">Unchanged</SelectItem>
                                <SelectItem value="improving">Improving</SelectItem>
                                <SelectItem value="worsening">Worsening</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="pt-2 flex justify-end">
                          <Button className="bg-[#7b9d8f] hover:bg-[#c1632f]">
                            Save Chief Complaint
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vitals Quick Entry */}
                  <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-slate-500" />
                        <h2 className="text-lg font-semibold">Intake Vitals</h2>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="temperature">Temperature (°F)</Label>
                          <Input id="temperature" type="number" step="0.1" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                          <Input id="heartRate" type="number" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="respRate">Resp Rate (rpm)</Label>
                          <Input id="respRate" type="number" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="bp-systolic">BP Systolic (mmHg)</Label>
                          <Input id="bp-systolic" type="number" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="bp-diastolic">BP Diastolic (mmHg)</Label>
                          <Input id="bp-diastolic" type="number" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="o2sat">O₂ Saturation (%)</Label>
                          <Input id="o2sat" type="number" max="100" className="mt-1" />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button className="bg-[#7b9d8f] hover:bg-[#c1632f]">
                          Record Vitals
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Screening */}
                  <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Search className="h-5 w-5 text-slate-500" />
                        <h2 className="text-lg font-semibold">Screening</h2>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 border rounded-md">
                            <h3 className="font-medium mb-2">Fall Risk Screening</h3>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <Checkbox id="fall-risk-1" />
                                <Label htmlFor="fall-risk-1" className="ml-2">History of falls in past 6 months</Label>
                              </div>
                              <div className="flex items-center">
                                <Checkbox id="fall-risk-2" />
                                <Label htmlFor="fall-risk-2" className="ml-2">Multiple diagnoses</Label>
                              </div>
                              <div className="flex items-center">
                                <Checkbox id="fall-risk-3" />
                                <Label htmlFor="fall-risk-3" className="ml-2">Mobility issue/assistive device</Label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-3 border rounded-md">
                            <h3 className="font-medium mb-2">Pain Screening</h3>
                            <div className="space-y-2">
                              <Label>Pain Level (0-10)</Label>
                              <Input type="number" min="0" max="10" className="w-20" />
                              <div className="flex items-center mt-2">
                                <Checkbox id="pain-acute" />
                                <Label htmlFor="pain-acute" className="ml-2">Acute</Label>
                              </div>
                              <div className="flex items-center">
                                <Checkbox id="pain-chronic" />
                                <Label htmlFor="pain-chronic" className="ml-2">Chronic</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-2 flex justify-end">
                          <Button className="bg-[#7b9d8f] hover:bg-[#c1632f]">
                            Complete Screening
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Ambulatory Summary Tab Content */}
            <TabsContent value="summary" className="space-y-6">
              <div className="flex gap-4">
                {/* Secondary Sidebar for Summary View */}
                <div className="w-48 flex-shrink-0 bg-slate-50 shadow rounded-lg p-3 border border-slate-200 overflow-hidden">
                  <div className="flex justify-between items-center p-2 border-b border-slate-100 mb-3">
                    <h3 className="font-semibold text-slate-700 text-sm">Summary Sections</h3>
                  </div>
                  <nav className="space-y-1">
                    {[
                      { name: "Patient Info", icon: User },
                      { name: "Allergies", icon: AlertOctagon },
                      { name: "Problems", icon: AlertCircle },
                      { name: "Medications", icon: Pill },
                      { name: "Recent Labs", icon: FlaskConical },
                      { name: "Recent Vitals", icon: Activity },
                      { name: "Recent Notes", icon: FileText },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          className="w-full text-left px-3 py-2 rounded-md text-xs font-medium 
                            flex items-center gap-2 text-slate-700 hover:bg-slate-100"
                        >
                          <Icon className="h-3.5 w-3.5 text-slate-500" />
                          {item.name}
                        </button>
                      );
                    })}
                  </nav>
                </div>
                
                {/* Summary Content */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Active Problems */}
                    <div className="col-span-2 bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-slate-500" />
                          <h2 className="text-lg font-semibold">Active Problems</h2>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-blue-600"
                          onClick={() => document.getElementById('Active Problems')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          View All <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                      <div className="p-4">
                        {activeProblems.length > 0 ? (
                          <div className="space-y-2">
                            {activeProblems.slice(0, 3).map((problem) => (
                              <div key={problem.id} className="p-2 bg-slate-50 rounded-md flex justify-between items-center">
                                <div>
                                  <p className="font-medium">{problem.name}</p>
                                  <p className="text-xs text-slate-500">Code: {problem.code} • Added: {problem.date}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center text-slate-500">No active problems</p>
                        )}
                      </div>
                    </div>

                    {/* Protocols */}
                    <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="h-5 w-5 text-slate-500" />
                          <h2 className="text-lg font-semibold">Protocols</h2>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-blue-600"
                          onClick={() => document.getElementById('Protocols')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          View All <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                      <div className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {activeProtocols.map((protocol) => {
                            const Icon = protocol.icon || ShieldAlert;
                            return (
                              <Badge key={protocol.id} className="px-2 py-1 flex items-center bg-amber-100 text-amber-800 border-amber-300">
                                <Icon className="h-3 w-3 mr-1" />
                                <span>{protocol.name}</span>
                              </Badge>
                            );
                          })}
                          
                          {activeProtocols.length === 0 && (
                            <div className="text-center w-full text-slate-500">No active protocols</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Medications Summary */}
                  <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-slate-500" />
                        <h2 className="text-lg font-semibold">Medications</h2>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-600"
                        onClick={() => document.getElementById('Medications')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left">
                            <th className="pb-2 font-medium">Medication</th>
                            <th className="pb-2 font-medium">Dosage</th>
                            <th className="pb-2 font-medium">Route</th>
                            <th className="pb-2 font-medium">Frequency</th>
                            <th className="pb-2 font-medium">Started</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-1 font-medium">Lisinopril</td>
                            <td className="py-1">10 mg</td>
                            <td className="py-1">Oral</td>
                            <td className="py-1">Daily</td>
                            <td className="py-1">2023-05-15</td>
                          </tr>
                          <tr>
                            <td className="py-1 font-medium">Metformin</td>
                            <td className="py-1">500 mg</td>
                            <td className="py-1">Oral</td>
                            <td className="py-1">BID</td>
                            <td className="py-1">2023-01-20</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Recent Vitals */}
                  <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-slate-500" />
                        <h2 className="text-lg font-semibold">Recent Vitals</h2>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-600"
                        onClick={() => document.getElementById('Vitals')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        View All <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-slate-50 rounded-md">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">Blood Pressure</p>
                            <span className="text-sm font-bold">128/82</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Today, 10:30 AM</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-md">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">Pulse</p>
                            <span className="text-sm font-bold">78 bpm</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Today, 10:30 AM</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-md">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">Temperature</p>
                            <span className="text-sm font-bold">98.6 °F</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Today, 10:30 AM</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-md">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">Resp Rate</p>
                            <span className="text-sm font-bold">16 rpm</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">Today, 10:30 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Advance Care Planning Tab Content */}
            <TabsContent value="careplan" className="space-y-6">
              <div className="flex gap-4">
                {/* Secondary Sidebar for Care Planning View */}
                <div className="w-48 flex-shrink-0 bg-slate-50 shadow rounded-lg p-3 border border-slate-200 overflow-hidden">
                  <div className="flex justify-between items-center p-2 border-b border-slate-100 mb-3">
                    <h3 className="font-semibold text-slate-700 text-sm">Planning Sections</h3>
                  </div>
                  <nav className="space-y-1">
                    {[
                      { name: "Code Status", icon: HeartPulse },
                      { name: "Directives", icon: FileCheck },
                      { name: "Care Team", icon: Users },
                      { name: "Care Goals", icon: Target },
                      { name: "Decision Maker", icon: UserCog },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          className="w-full text-left px-3 py-2 rounded-md text-xs font-medium 
                            flex items-center gap-2 text-slate-700 hover:bg-slate-100"
                        >
                          <Icon className="h-3.5 w-3.5 text-slate-500" />
                          {item.name}
                        </button>
                      );
                    })}
                  </nav>
                </div>
                
                {/* Care Planning Content */}
                <div className="flex-1 space-y-4">
                  {/* Code Status */}
                  <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <HeartPulse className="h-5 w-5 text-slate-500" />
                        <h2 className="text-lg font-semibold">Code Status</h2>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        <RadioGroup defaultValue="full">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="full" id="code-full" />
                            <Label htmlFor="code-full" className="font-medium">Full Code</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dnr" id="code-dnr" />
                            <Label htmlFor="code-dnr" className="font-medium">Do Not Resuscitate (DNR)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="dni" id="code-dni" />
                            <Label htmlFor="code-dni" className="font-medium">Do Not Intubate (DNI)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cc" id="code-cc" />
                            <Label htmlFor="code-cc" className="font-medium">Comfort Care Only</Label>
                          </div>
                        </RadioGroup>
                        
                        <div>
                          <Label htmlFor="code-notes">Notes</Label>
                          <Textarea 
                            id="code-notes" 
                            placeholder="Enter any relevant notes about code status..." 
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="pt-2 flex justify-end">
                          <Button className="bg-[#7b9d8f] hover:bg-[#c1632f]">
                            Update Code Status
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Advance Directives */}
                  <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-slate-500" />
                        <h2 className="text-lg font-semibold">Advance Directives</h2>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 border rounded-md">
                            <h3 className="font-medium mb-2">Documents on File</h3>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <Checkbox id="doc-living-will" />
                                <Label htmlFor="doc-living-will" className="ml-2">Living Will</Label>
                              </div>
                              <div className="flex items-center">
                                <Checkbox id="doc-healthcare-poa" />
                                <Label htmlFor="doc-healthcare-poa" className="ml-2">Healthcare Power of Attorney</Label>
                              </div>
                              <div className="flex items-center">
                                <Checkbox id="doc-polst" />
                                <Label htmlFor="doc-polst" className="ml-2">POLST/MOLST Form</Label>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Label>Document Upload</Label>
                            <div className="mt-1 border-2 border-dashed border-slate-200 rounded-md p-6 text-center">
                              <UploadCloud className="h-8 w-8 mx-auto text-slate-400" />
                              <p className="mt-2 text-sm text-slate-500">Drag and drop files here or click to browse</p>
                              <Button variant="outline" size="sm" className="mt-2">
                                Browse Files
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-2 flex justify-end">
                          <Button className="bg-[#7b9d8f] hover:bg-[#c1632f]">
                            Save Documents
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Hospital Admission Tab Content */}
            <TabsContent value="admission" className="space-y-6">
              <div className="flex gap-4">
                {/* Secondary Sidebar for Admission View */}
                <div className="w-48 flex-shrink-0 bg-slate-50 shadow rounded-lg p-3 border border-slate-200 overflow-hidden">
                  <div className="flex justify-between items-center p-2 border-b border-slate-100 mb-3">
                    <h3 className="font-semibold text-slate-700 text-sm">Admission Sections</h3>
                  </div>
                  <nav className="space-y-1">
                    {[
                      { name: "Admission Info", icon: Building2 },
                      { name: "Intake/Output", icon: MoveHorizontal },
                      { name: "Orders", icon: ClipboardList },
                      { name: "Diet", icon: Utensils },
                      { name: "IV Fluids", icon: FlaskConical },
                      { name: "Dressing Changes", icon: Bandage },
                      { name: "Transfer", icon: ArrowRightLeft },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          className="w-full text-left px-3 py-2 rounded-md text-xs font-medium 
                            flex items-center gap-2 text-slate-700 hover:bg-slate-100"
                        >
                          <Icon className="h-3.5 w-3.5 text-slate-500" />
                          {item.name}
                        </button>
                      );
                    })}
                  </nav>
                </div>
                
                {/* Admission Content */}
                <div className="flex-1 space-y-4">
                  {/* Admission Information */}
                  <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-slate-500" />
                        <h2 className="text-lg font-semibold">Admission Information</h2>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="admission-date">Admission Date/Time</Label>
                          <div className="flex gap-2 mt-1">
                            <Input id="admission-date" type="date" />
                            <Input type="time" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="admission-type">Admission Type</Label>
                          <Select defaultValue="inpatient">
                            <SelectTrigger id="admission-type" className="mt-1">
                              <SelectValue placeholder="Select admission type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inpatient">Inpatient</SelectItem>
                              <SelectItem value="observation">Observation</SelectItem>
                              <SelectItem value="outpatient">Outpatient</SelectItem>
                              <SelectItem value="emergency">Emergency</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="admission-provider">Admitting Provider</Label>
                          <Input id="admission-provider" className="mt-1" defaultValue="Dr. Johnson" />
                        </div>
                        <div>
                          <Label htmlFor="admission-room">Room Assignment</Label>
                          <Input id="admission-room" className="mt-1" defaultValue="Room 304" />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="admission-diagnosis">Admitting Diagnosis</Label>
                          <Textarea 
                            id="admission-diagnosis" 
                            placeholder="Enter admitting diagnosis..." 
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button className="bg-[#7b9d8f] hover:bg-[#c1632f]">
                          Save Admission Information
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Intake & Output */}
                  <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MoveHorizontal className="h-5 w-5 text-slate-500" />
                        <h2 className="text-lg font-semibold">Intake & Output</h2>
                      </div>
                    </div>
                    <div className="p-4">
                      <Tabs defaultValue="intake" className="w-full">
                        <TabsList>
                          <TabsTrigger value="intake">Intake</TabsTrigger>
                          <TabsTrigger value="output">Output</TabsTrigger>
                          <TabsTrigger value="summary">I/O Summary</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="intake" className="pt-4">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">Record Intake</h3>
                              <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" /> Add Entry
                              </Button>
                            </div>
                            
                            <div className="border rounded-md overflow-hidden">
                              <table className="w-full text-sm">
                                <thead className="bg-slate-50">
                                  <tr>
                                    <th className="p-2 text-left font-medium">Time</th>
                                    <th className="p-2 text-left font-medium">Type</th>
                                    <th className="p-2 text-left font-medium">Volume (mL)</th>
                                    <th className="p-2 text-left font-medium">Route</th>
                                    <th className="p-2 text-left font-medium">Notes</th>
                                    <th className="p-2 text-left font-medium"></th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  <tr>
                                    <td className="p-2">10:30 AM</td>
                                    <td className="p-2">Oral Fluids</td>
                                    <td className="p-2">240</td>
                                    <td className="p-2">PO</td>
                                    <td className="p-2">Water</td>
                                    <td className="p-2">
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="p-2">12:15 PM</td>
                                    <td className="p-2">IV Fluids</td>
                                    <td className="p-2">500</td>
                                    <td className="p-2">IV</td>
                                    <td className="p-2">Normal Saline</td>
                                    <td className="p-2">
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="output" className="pt-4">
                          <div className="p-4 text-center text-slate-500 border border-dashed rounded-md">
                            Output tracking would be displayed here
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="summary" className="pt-4">
                          <div className="p-4 text-center text-slate-500 border border-dashed rounded-md">
                            Intake/Output summary would be displayed here
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Hospital Discharge Tab Content */}
            <TabsContent value="discharge" className="space-y-6">
              <div className="flex gap-4">
                {/* Secondary Sidebar for Discharge View */}
                <div className="w-48 flex-shrink-0 bg-slate-50 shadow rounded-lg p-3 border border-slate-200 overflow-hidden">
                  <div className="flex justify-between items-center p-2 border-b border-slate-100 mb-3">
                    <h3 className="font-semibold text-slate-700 text-sm">Discharge Sections</h3>
                  </div>
                  <nav className="space-y-1">
                    {[
                      { name: "Summary", icon: ClipboardList },
                      { name: "Medications", icon: Pill },
                      { name: "Instructions", icon: FileText },
                      { name: "Follow-up", icon: Calendar },
                      { name: "Referrals", icon: ExternalLink },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          className="w-full text-left px-3 py-2 rounded-md text-xs font-medium 
                            flex items-center gap-2 text-slate-700 hover:bg-slate-100"
                        >
                          <Icon className="h-3.5 w-3.5 text-slate-500" />
                          {item.name}
                        </button>
                      );
                    })}
                  </nav>
                </div>
                
                {/* Discharge Content */}
                <div className="flex-1 space-y-4">
                  {/* Discharge Summary */}
                  <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-slate-500" />
                        <h2 className="text-lg font-semibold">Discharge Summary</h2>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="discharge-date">Discharge Date/Time</Label>
                            <div className="flex gap-2 mt-1">
                              <Input id="discharge-date" type="date" />
                              <Input type="time" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="discharge-disposition">Disposition</Label>
                            <Select defaultValue="home">
                              <SelectTrigger id="discharge-disposition" className="mt-1">
                                <SelectValue placeholder="Select disposition" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="home">Home</SelectItem>
                                <SelectItem value="snf">Skilled Nursing Facility</SelectItem>
                                <SelectItem value="rehab">Rehabilitation</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="discharge-diagnosis">Discharge Diagnosis</Label>
                          <Textarea 
                            id="discharge-diagnosis" 
                            placeholder="Enter discharge diagnosis..." 
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="hospital-course">Hospital Course</Label>
                          <Textarea 
                            id="hospital-course" 
                            placeholder="Summarize the patient's hospital course..." 
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <Button className="bg-[#7b9d8f] hover:bg-[#c1632f]">
                            Save Discharge Summary
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Discharge Medications */}
                  <div className="bg-white shadow rounded-lg border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Pill className="h-5 w-5 text-slate-500" />
                        <h2 className="text-lg font-semibold">Discharge Medications</h2>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" /> Add Medication
                      </Button>
                    </div>
                    <div className="p-4">
                      <div className="space-y-4">
                        <div className="border rounded-md overflow-hidden">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="p-2 text-left font-medium">Medication</th>
                                <th className="p-2 text-left font-medium">Dosage</th>
                                <th className="p-2 text-left font-medium">Route</th>
                                <th className="p-2 text-left font-medium">Frequency</th>
                                <th className="p-2 text-left font-medium">Instructions</th>
                                <th className="p-2 text-left font-medium"></th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              <tr>
                                <td className="p-2">Lisinopril</td>
                                <td className="p-2">10 mg</td>
                                <td className="p-2">Oral</td>
                                <td className="p-2">Daily</td>
                                <td className="p-2">Take in the morning</td>
                                <td className="p-2">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                              <tr>
                                <td className="p-2">Metformin</td>
                                <td className="p-2">500 mg</td>
                                <td className="p-2">Oral</td>
                                <td className="p-2">BID</td>
                                <td className="p-2">Take with meals</td>
                                <td className="p-2">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button className="bg-[#7b9d8f] hover:bg-[#c1632f]">
                            Generate Prescriptions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Medications Section - Converted to Collapsible Panel */}
          <Collapsible className="mb-6 bg-white shadow rounded-lg border border-slate-200 overflow-hidden" id="Medications">
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-slate-500" />
                <h2 className="text-lg font-semibold">Medications</h2>
              </div>
              <ChevronDown className="h-5 w-5 text-slate-500 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6 pt-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Medications</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert('New medication order')}
                  className="bg-[#7b9d8f] text-white hover:bg-[#c1632f]"
                >
                  <FilePlus className="h-4 w-4 mr-1" />
                  Order
                </Button>
              </div>

              <Card>
                <CardContent className="py-4">
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Active Medications</h3>
                      </div>
                      <div className="mt-2">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left">
                              <th className="pb-2 font-medium">Medication</th>
                              <th className="pb-2 font-medium">Dosage</th>
                              <th className="pb-2 font-medium">Route</th>
                              <th className="pb-2 font-medium">Frequency</th>
                              <th className="pb-2 font-medium">Started</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-1 font-medium">Lisinopril</td>
                              <td className="py-1">10 mg</td>
                              <td className="py-1">Oral</td>
                              <td className="py-1">Daily</td>
                              <td className="py-1">2023-05-15</td>
                            </tr>
                            <tr>
                              <td className="py-1 font-medium">Metformin</td>
                              <td className="py-1">500 mg</td>
                              <td className="py-1">Oral</td>
                              <td className="py-1">BID</td>
                              <td className="py-1">2023-01-20</td>
                            </tr>
                            <tr>
                              <td className="py-1 font-medium">Albuterol</td>
                              <td className="py-1">90 mcg</td>
                              <td className="py-1">Inhaled</td>
                              <td className="py-1">PRN</td>
                              <td className="py-1">2020-08-15</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Encounter Notes Section - Converted to Collapsible Panel */}
          <Collapsible className="mb-6 bg-white shadow rounded-lg border border-slate-200 overflow-hidden" id="EncounterNotes">
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-500" />
                <h2 className="text-lg font-semibold">Encounter Notes</h2>
              </div>
              <ChevronDown className="h-5 w-5 text-slate-500 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Encounter Notes</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSelectedQuickForm("General Clinical Note");
                    setShowQuickFormDialog(true);
                  }}
                  className="bg-[#7b9d8f] text-white hover:bg-[#c1632f]"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  New Note
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Recent Clinical Notes */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Recent Clinical Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    {patientData.documentation && patientData.documentation.length > 0 ? (
                      <div className="space-y-3">
                        {patientData.documentation.slice(0, 3).map((note, index) => (
                          <div key={index} className="p-3 bg-slate-50 rounded-md">
                            <div className="flex justify-between items-center mb-1">
                              <h4 className="font-medium text-sm">{note.type}</h4>
                              <span className="text-xs text-slate-500">{formatDateTime(note.timestamp)}</span>
                            </div>
                            <p className="text-sm text-slate-700 line-clamp-2">{note.content.substring(0, 150)}...</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="mt-1 h-6 text-xs text-blue-600 hover:text-blue-800 p-0"
                              onClick={() => {
                                setSelectedDocumentation(note);
                                setShowDocumentationViewDialog(true);
                              }}
                            >
                              View full note
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-slate-500">
                        <p>No clinical notes available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                

              </div>
              </div>
            </CollapsibleContent>
          </Collapsible>



          {/* Labs Section - Converted to Collapsible Panel */}
          <Collapsible className="mb-6 bg-white shadow rounded-lg border border-slate-200 overflow-hidden" id="Labs">
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5 text-slate-500" />
                <h2 className="text-lg font-semibold">Laboratory Results</h2>
              </div>
              <ChevronDown className="h-5 w-5 text-slate-500 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6 pt-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Laboratory Results</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert('New lab order')}
                  className="bg-[#7b9d8f] text-white hover:bg-[#c1632f]"
                >
                  <FlaskConical className="h-4 w-4 mr-1" />
                  New Lab Order
                </Button>
              </div>

              <Card>
                <CardContent className="py-4">
                  <div className="space-y-6">
                    <div className="relative">
                      <Input 
                        placeholder="Search for lab results..." 
                        className="mb-4 bg-white"
                      />
                    </div>

                    {patientData.labs.map((lab, labIndex) => (
                      <div key={labIndex} className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">{lab.name}</h3>
                            <span className="text-sm text-slate-500">Collected: {formatDateTime(lab.collected)}</span>
                          </div>
                        </div>
                        <div className="p-0">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-slate-100 text-slate-700">
                                <th className="px-4 py-2 text-left font-medium">Test</th>
                                <th className="px-4 py-2 text-left font-medium">Result</th>
                                <th className="px-4 py-2 text-left font-medium">Units</th>
                                <th className="px-4 py-2 text-left font-medium">Normal Range</th>
                                <th className="px-4 py-2 text-left font-medium">Flag</th>
                              </tr>
                            </thead>
                            <tbody>
                              {lab.results.map((result, resultIndex) => (
                                <tr key={resultIndex} className="border-t hover:bg-slate-50">
                                  <td className="px-4 py-2 font-medium">{result.test}</td>
                                  <td className="px-4 py-2">
                                    {/* Color code values based on flags */}
                                    <span className={`font-medium ${result.flag === 'H' ? 'text-red-600' : result.flag === 'L' ? 'text-blue-600' : ''}`}>
                                      {result.value}
                                    </span>
                                  </td>
                                  <td className="px-4 py-2">{result.unit}</td>
                                  <td className="px-4 py-2">{result.normalRange}</td>
                                  <td className="px-4 py-2">
                                    {result.flag && (
                                      <Badge variant="outline" className={
                                        (result.flag === 'H' || result.flag === 'Critical High') ? 'bg-red-100 text-red-800 border-red-300' :
                                        (result.flag === 'L' || result.flag === 'Critical Low') ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                        'bg-yellow-100 text-yellow-800 border-yellow-300'
                                      }>
                                        {result.flag}
                                      </Badge>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Orders Section - Converted to Collapsible Panel */}
          <Collapsible className="mb-6 bg-white shadow rounded-lg border border-slate-200 overflow-hidden" id="Orders">
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FilePlus className="h-5 w-5 text-slate-500" />
                <h2 className="text-lg font-semibold">Orders</h2>
              </div>
              <ChevronDown className="h-5 w-5 text-slate-500 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Orders</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-[#7b9d8f] text-white hover:bg-[#c1632f]"
                >
                  <FilePlus className="h-4 w-4 mr-1" />
                  New Order
                </Button>
              </div>
              
              <Tabs defaultValue="active" className="mt-2">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="active">
                  <Card>
                    <CardContent className="py-4">
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 text-slate-700">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium">Order</th>
                              <th className="px-4 py-2 text-left font-medium">Status</th>
                              <th className="px-4 py-2 text-left font-medium">Ordered By</th>
                              <th className="px-4 py-2 text-left font-medium">Date</th>
                              <th className="px-4 py-2 text-left font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t hover:bg-slate-50">
                              <td className="px-4 py-2 font-medium">CBC with Differential</td>
                              <td className="px-4 py-2">
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">In Progress</Badge>
                              </td>
                              <td className="px-4 py-2">Dr. Johnson</td>
                              <td className="px-4 py-2">Apr 16, 2025</td>
                              <td className="px-4 py-2">
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                            <tr className="border-t hover:bg-slate-50">
                              <td className="px-4 py-2 font-medium">Basic Metabolic Panel</td>
                              <td className="px-4 py-2">
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Pending</Badge>
                              </td>
                              <td className="px-4 py-2">Dr. Johnson</td>
                              <td className="px-4 py-2">Apr 16, 2025</td>
                              <td className="px-4 py-2">
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                            <tr className="border-t hover:bg-slate-50">
                              <td className="px-4 py-2 font-medium">Chest X-Ray</td>
                              <td className="px-4 py-2">
                                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Scheduled</Badge>
                              </td>
                              <td className="px-4 py-2">Dr. Johnson</td>
                              <td className="px-4 py-2">Apr 16, 2025</td>
                              <td className="px-4 py-2">
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="pending">
                  <Card>
                    <CardContent className="py-4 text-center text-slate-500">
                      <p>No pending orders</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="completed">
                  <Card>
                    <CardContent className="py-4">
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-50 text-slate-700">
                            <tr>
                              <th className="px-4 py-2 text-left font-medium">Order</th>
                              <th className="px-4 py-2 text-left font-medium">Status</th>
                              <th className="px-4 py-2 text-left font-medium">Ordered By</th>
                              <th className="px-4 py-2 text-left font-medium">Completed</th>
                              <th className="px-4 py-2 text-left font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t hover:bg-slate-50">
                              <td className="px-4 py-2 font-medium">Troponin I</td>
                              <td className="px-4 py-2">
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Completed</Badge>
                              </td>
                              <td className="px-4 py-2">Dr. Johnson</td>
                              <td className="px-4 py-2">Apr 16, 2025</td>
                              <td className="px-4 py-2">
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Imaging Section - Converted to Collapsible Panel */}
          <Collapsible className="mb-6 bg-white shadow rounded-lg border border-slate-200 overflow-hidden" id="Imaging">
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-slate-500" />
                <h2 className="text-lg font-semibold">Imaging Results</h2>
              </div>
              <ChevronDown className="h-5 w-5 text-slate-500 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6 pt-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Imaging Results</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => alert('New imaging order')}
                  className="bg-[#7b9d8f] text-white hover:bg-[#c1632f]"
                >
                  <Image className="h-4 w-4 mr-1" />
                  New Imaging
                </Button>
              </div>

              <Card>
                <CardContent className="py-4">
                  <div className="space-y-4">
                    {/* Imaging studies table */}
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-700">
                          <tr>
                            <th className="px-4 py-2 text-left font-medium">Study</th>
                            <th className="px-4 py-2 text-left font-medium">Date</th>
                            <th className="px-4 py-2 text-left font-medium">Status</th>
                            <th className="px-4 py-2 text-left font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t hover:bg-slate-50">
                            <td className="px-4 py-2 font-medium">Chest X-Ray, 2 Views</td>
                            <td className="px-4 py-2">Apr 16, 2025</td>
                            <td className="px-4 py-2">
                              <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>
                            </td>
                            <td className="px-4 py-2">
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-t hover:bg-slate-50">
                            <td className="px-4 py-2 font-medium">CT Head without Contrast</td>
                            <td className="px-4 py-2">Apr 15, 2025</td>
                            <td className="px-4 py-2">
                              <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>
                            </td>
                            <td className="px-4 py-2">
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-t hover:bg-slate-50">
                            <td className="px-4 py-2 font-medium">MRI Knee Right</td>
                            <td className="px-4 py-2">Apr 10, 2025</td>
                            <td className="px-4 py-2">
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>
                            </td>
                            <td className="px-4 py-2">
                              <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                                <AlertCircle className="h-4 w-4 mr-1" /> Results
                              </Button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
              </div>
            </CollapsibleContent>
          </Collapsible>


          {/* Protocols Section - Converted to Collapsible Panel */}
          <Collapsible className="mb-6 bg-white shadow rounded-lg border border-slate-200 overflow-hidden" id="Protocols">
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-slate-500" />
                <h2 className="text-lg font-semibold">Protocols & Precautions</h2>
              </div>
              <ChevronDown className="h-5 w-5 text-slate-500 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6 pt-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">Protocols & Precautions</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    // Show a dropdown of available protocols
                    const protocolOptions = protocols.map(p => ({
                      value: p.id,
                      label: p.name
                    }));
                    
                    // Implement a simple dialog to select protocol
                    const selectedProtocol = window.prompt('Select a protocol to add:\n' + 
                      protocolOptions.map((p, i) => `${i+1}. ${p.label}`).join('\n'));
                    
                    if (selectedProtocol) {
                      const index = parseInt(selectedProtocol) - 1;
                      if (index >= 0 && index < protocolOptions.length) {
                        // Get the selected protocol
                        const protocol = protocols[index];
                        
                        // Generate protocol object
                        const protocolIcons = {
                          fall: AlertOctagon,
                          stemi: Heart,
                          stroke: Brain,
                          noama: Ban,
                          sepsis: Droplets,
                          isolation: Shield,
                          restraints: Lock,
                          suicide: UserMinus
                        };
                        
                        // Add to active protocols
                        const now = new Date();
                        const formattedDate = now.toLocaleDateString('en-US', {
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric'
                        });
                        
                        const newProtocol = {
                          id: `pr-${Date.now()}`,
                          name: protocol.name,
                          severity: protocol.severity,
                          date: formattedDate,
                          icon: protocolIcons[protocol.id] || AlertTriangle
                        };
                        
                        setActiveProtocols([...activeProtocols, newProtocol]);
                        toast.success(`Protocol '${protocol.name}' activated`);
                        
                        // Update patient in tracking board
                        if (patientId) {
                          const patientStore = usePatientStore();
                          const updatedPatients = patientStore.patients.map(p => {
                            if (p.id === patientId) {
                              // Update specific flags based on protocol ID
                              const updatedPatient = { ...p };
                              
                              if (protocol.id === 'fall') {
                                updatedPatient.isFallRisk = true;
                              } else if (protocol.id === 'stroke') {
                                updatedPatient.isStroke = true;
                              } else if (protocol.id === 'sepsis') {
                                updatedPatient.isSepsis = true;
                              } else if (protocol.id === 'stemi') {
                                updatedPatient.isStemi = true;
                              } else if (protocol.id === 'noama') {
                                // Add the No AMA protocol field
                                if (!updatedPatient.protocols) {
                                  updatedPatient.protocols = {};
                                }
                                updatedPatient.protocols.noAmaProtocol = {
                                  ordered: new Date().toISOString(),
                                  orderedBy: "Current Provider",
                                  status: 'Active'
                                };
                              }
                              
                              return updatedPatient;
                            }
                            return p;
                          });
                          
                          // Update patient store
                          patientStore.updatePatients(updatedPatients);
                        }
                      }
                    }
                  }}
                  className="bg-[#7b9d8f] text-white hover:bg-[#c1632f]"
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Protocol
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Active Protocols */}
                <div className="col-span-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Active Protocols</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {activeProtocols.map((protocol) => {
                            let badgeColor = "bg-blue-100 text-blue-800 border-blue-300";
                            if (protocol.severity === "high") {
                              badgeColor = "bg-red-100 text-red-800 border-red-300";
                            } else if (protocol.severity === "moderate") {
                              badgeColor = "bg-amber-100 text-amber-800 border-amber-300";
                            }
                            
                            const IconComponent = protocol.icon;
                            
                            return (
                              <Badge key={protocol.id} className={`${badgeColor} px-3 py-1.5 flex items-center group relative`}>
                                <IconComponent className="h-4 w-4 mr-1" />
                                <span>{protocol.name}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => handleResolveProtocol(protocol)}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            );
                          })}
                          
                          {activeProtocols.length === 0 && (
                            <div className="text-slate-500">No active protocols</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Resolved Protocols */}
                <div>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-md">Resolved</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2">
                      <div className="space-y-2 max-h-44 overflow-y-auto">
                        {resolvedProtocols.map((protocol) => (
                          <div key={protocol.id} className="text-sm flex items-center justify-between px-2 py-1 rounded-md">
                            <div className="flex items-center">
                              <span>{protocol.name}</span>
                            </div>
                            <div className="text-xs text-slate-500">
                              {protocol.resolvedDate}
                            </div>
                          </div>
                        ))}
                        
                        {resolvedProtocols.length === 0 && (
                          <div className="text-slate-500 text-sm">No resolved protocols</div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Active Problems Section - Converted to Collapsible Panel */}
          <Collapsible className="mb-6 bg-white shadow rounded-lg border border-slate-200 overflow-hidden" id="Active Problems">
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-slate-500" />
                <h2 className="text-lg font-semibold">Active Problems</h2>
              </div>
              <ChevronDown className="h-5 w-5 text-slate-500 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6 pt-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Active Problems</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-[#7b9d8f] text-white hover:bg-[#c1632f]"
                  onClick={() => {
                    setEditingProblem(null);
                    setShowProblemDialog(true);
                  }}
                >
                  <FilePlus className="h-4 w-4 mr-1" />
                  Add Problem
                </Button>
              </div>
              
              <Card>
                <CardContent className="py-4">
                  <div className="space-y-2">
                    {activeProblems.map((problem) => (
                      <div key={problem.id} className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-slate-50">
                        <span>{problem.name} ({problem.code})</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Diagnosed: {problem.date}</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setEditingProblem(problem);
                                    setShowProblemDialog(true);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit Problem</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 text-green-600"
                                  onClick={() => handleResolveProblem(problem)}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mark as Resolved</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    ))}
                    
                    {activeProblems.length === 0 && (
                      <div className="text-center py-4 text-slate-500">
                        <p>No active problems</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Problem Dialog */}
              <Dialog open={showProblemDialog} onOpenChange={setShowProblemDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingProblem ? "Edit Problem" : "Add New Problem"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingProblem ? "Update the problem details" : "Enter the details for the new medical problem"}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="problemName">Problem Name</Label>
                      <Input 
                        id="problemName" 
                        defaultValue={editingProblem?.name || ""} 
                        placeholder="e.g., Hypertension"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="problemCode">ICD-10 Code</Label>
                      <Input 
                        id="problemCode" 
                        defaultValue={editingProblem?.code || ""} 
                        placeholder="e.g., I10"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="diagnosisDate">Diagnosis Date</Label>
                      <Input 
                        id="diagnosisDate" 
                        type="date"
                        defaultValue={editingProblem ? new Date().toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowProblemDialog(false)}>Cancel</Button>
                    <Button onClick={() => {
                      if (editingProblem) {
                        toast.success("Problem updated successfully");
                      } else {
                        toast.success("Problem added successfully");
                      }
                      setShowProblemDialog(false);
                    }}>
                      {editingProblem ? "Update" : "Add"} Problem
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              </div>
            </CollapsibleContent>
          </Collapsible>



          {/* History Section - Converted to Collapsible Panel */}
          <Collapsible className="mb-6 bg-white shadow rounded-lg border border-slate-200 overflow-hidden" id="Medical History">
            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-slate-500" />
                <h2 className="text-lg font-semibold">Medical History</h2>
              </div>
              <ChevronDown className="h-5 w-5 text-slate-500 transition-transform ui-open:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6 pt-4">
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">History</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-[#7b9d8f] text-white hover:bg-[#c1632f]"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add History
                </Button>
              </div>

              <Tabs defaultValue="medical" className="w-full">
                <TabsList className="grid grid-cols-2 w-full mb-4">
                  <TabsTrigger value="medical">Medical History</TabsTrigger>
                  <TabsTrigger value="resolved">Resolved Problems</TabsTrigger>
                </TabsList>
                
                <TabsContent value="resolved" className="mt-0">
                  <Card>
                    <CardContent className="py-4">
                      <div className="space-y-2">
                        {resolvedProblems.map((problem) => (
                          <div key={problem.id} className="flex items-center justify-between px-2 py-1 rounded-md hover:bg-slate-50">
                            <span>{problem.name} ({problem.code})</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">Resolved: {problem.resolvedDate}</span>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <Pencil className="h-3 w-3" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Edit Resolved Problem</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        ))}
                        
                        {resolvedProblems.length === 0 && (
                          <div className="text-center py-4 text-slate-500">
                            <p>No resolved problems</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="medical" className="mt-0">
                  <Card>
                    <CardContent className="py-4">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h3 className="font-medium mb-2">Past Medical History</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Hypertension (2018)</li>
                              <li>Type 2 Diabetes (2020)</li>
                              <li>Hyperlipidemia (2019)</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">Past Surgical History</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Appendectomy (2010)</li>
                              <li>Right knee arthroscopy (2015)</li>
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">Family History</h3>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Father: MI at age 62</li>
                              <li>Mother: Breast cancer at age 58</li>
                              <li>Sister: Type 2 Diabetes</li>
                            </ul>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <h3 className="font-medium mb-2">Social History</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p><strong>Tobacco:</strong> Former smoker (quit 2018), 15 pack-years</p>
                              <p><strong>Alcohol:</strong> Social drinker (2-3 drinks/week)</p>
                              <p><strong>Exercise:</strong> Walks 30 minutes, 3 times weekly</p>
                            </div>
                            <div>
                              <p><strong>Occupation:</strong> Office manager</p>
                              <p><strong>Diet:</strong> Regular, no restrictions</p>
                              <p><strong>Living Situation:</strong> Lives with spouse</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
    </div>
  );
}