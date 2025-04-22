import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Patient } from "../utils/mockData";
import { useAuthStore } from "../utils/authStore";
import { mockPatients } from "../utils/mockData";
import PatientTrackingBoard from "components/PatientTrackingBoard";
import { PatientDetail } from "components/PatientDetail";
import { CuraLogo } from "components/CuraLogo";
import { AddPatientForm, PatientFormData } from "components/AddPatientForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { toast } from "sonner";
import { usePatientContext } from "../utils/PatientContext";
import { formatUsername } from "../utils/formatUsername";
import { NavigationBar } from "../components/NavigationBar";

export default function App() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientDetail, setShowPatientDetail] = useState(false);
  const [selectedPatientFilter, setSelectedPatientFilter] = useState<string>("all");
  const [showPharmacyDialog, setShowPharmacyDialog] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>("Walgreens - Main St");
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { setPatientDetailOpen } = usePatientContext();
  const navigate = useNavigate();

  // Load patients from Firestore if authenticated
  useEffect(() => {
    // In a real app, this would load patients from Firestore
    // and replace the mock data
  }, []);


  // Set page title and favicon
  useEffect(() => {
    document.title = "Cura - Patient Tracking System";
  }, []);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientDetail(true);
    setPatientDetailOpen(true);
  };

  const handlePatientDetailClose = () => {
    setShowPatientDetail(false);
    setPatientDetailOpen(false);
  };

  const handleOpenPharmacyDialog = () => {
    setShowPharmacyDialog(true);
  };

  const handleOpenAddPatientForm = () => {
    setShowAddPatientForm(true);
  };

  const handleAddPatient = (patientData: PatientFormData) => {
    // In a real app, this would add the patient to the database
    // For this demo, we'll update the local state with a new mock patient
    const newPatient: Patient = {
      id: `new-${Date.now()}`,
      name: `${patientData.lastName}, ${patientData.firstName}`,
      age: calculateAge(patientData.dateOfBirth),
      gender: patientData.gender,
      mrn: patientData.mrn || '',
      room: 'Lobby',
      chiefComplaint: '',
      status: 'waiting',
      assignedProvider: null,
      assignedNurse: null,
      waitTime: 0,
      arrivalTime: new Date().toISOString(),
      priority: 'medium',
      careArea: 'ED',
      triageLevel: '3',
      lastUpdate: new Date().toISOString(),
      isStroke: false,
      isSepsis: false,
      isFallRisk: false,
      holdStatus: false,
      labsPending: false,
      imagingPending: false,
      consultPending: false,
      vitalSigns: [],
      nurseComments: [],
      providerComments: [],
      demographics: {
        dateOfBirth: patientData.dateOfBirth,
        address: patientData.address,
        city: patientData.city,
        state: patientData.state,
        zipCode: patientData.zipCode,
        phoneNumber: patientData.phoneNumber,
        email: patientData.email,
        emergencyContact: patientData.emergencyContact,
        emergencyPhone: patientData.emergencyPhone,
        insuranceProvider: patientData.insuranceProvider,
        insuranceNumber: patientData.insuranceNumber
      }
    };

    // Add the new patient to the list
    setPatients(prevPatients => [newPatient, ...prevPatients]);
    toast.success(`Patient ${patientData.firstName} ${patientData.lastName} added`);
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const filterPatientsByStatus = (status: string) => {
    setSelectedPatientFilter(status);
  };

  const handleLogout = () => {
    logout();
    navigate("/Login");
  };

  // Add a simulated data refresh every 5 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Update wait times by random amounts
      const updatedPatients = patients.map(patient => ({
        ...patient,
        waitTime: Math.max(0, (patient.waitTime || 0) + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5))
      }));
      setPatients(updatedPatients);
      console.log('Patient data refreshed');
    }, 300000); // 5 minutes in milliseconds

    return () => clearInterval(intervalId);
  }, [patients]);

  // If not authenticated, redirect to login page
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Don't render content while redirecting
  if (!isAuthenticated) {
    return null;
  }

  return (
    <main className="flex flex-col min-h-screen p-2 md:p-4 bg-gray-50">
      <Card className="w-full">
        <CardContent className="p-0">
          {/* Main header with user info and navigation */}
          <div className="bg-white border-b sticky top-0 z-40">
            {/* Top bar with Cura logo and user info */}
            <div className="flex justify-between items-center py-2 px-4 bg-gray-100 border-b">
              <div className="flex items-center gap-2">
                <CuraLogo size={20} showText={false} />
                <span className="text-gray-800 text-lg font-semibold">Tracking Board</span>
              </div>
              <div className="font-medium text-sm">
                <span>User: {formatUsername(user?.fullName || user?.username || 'Unknown User')}</span>
                <span className="text-gray-500 mx-2">|</span>
                <span>Role: {user?.role || 'unknown'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="h-6 text-xs" onClick={() => alert("Help documentation would open here")}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                  <span className="ml-1">Help</span>
                </Button>
              </div>
            </div>
            
            {/* Navigation bar below header */}
            <NavigationBar />
          </div>
          
          {/* Main content */}
          <div className="w-full">
            <PatientTrackingBoard selectedTab={selectedPatientFilter} />
          </div>

          {/* Pharmacy Dialog */}
          <Dialog open={showPharmacyDialog} onOpenChange={setShowPharmacyDialog}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Patient Pharmacy</DialogTitle>
                <DialogDescription>
                  View or change the patient's preferred pharmacy.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pharmacy" className="text-right col-span-1">
                    Pharmacy
                  </Label>
                  <Select value={selectedPharmacy} onValueChange={setSelectedPharmacy} className="col-span-3">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pharmacy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Walgreens - Main St">Walgreens - Main St</SelectItem>
                      <SelectItem value="CVS - Downtown">CVS - Downtown</SelectItem>
                      <SelectItem value="Rite Aid - Westside">Rite Aid - Westside</SelectItem>
                      <SelectItem value="Hospital Pharmacy">Hospital Pharmacy</SelectItem>
                      <SelectItem value="Community Drugs">Community Drugs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="address" className="text-right col-span-1">
                    Address
                  </Label>
                  <Input id="address" value="123 Main St, Anytown USA" className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right col-span-1">
                    Phone
                  </Label>
                  <Input id="phone" value="(555) 123-4567" className="col-span-3" readOnly />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" onClick={() => setShowPharmacyDialog(false)}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Sheet open={showPatientDetail} onOpenChange={setShowPatientDetail}>
        <SheetContent side="right" className="w-full sm:max-w-full md:max-w-4xl lg:max-w-6xl overflow-y-auto">
          {selectedPatient && (
            <PatientDetail patient={selectedPatient} onClose={handlePatientDetailClose} />
          )}
        </SheetContent>
      </Sheet>

      {/* Add Patient Dialog */}
      <Dialog open={showAddPatientForm} onOpenChange={setShowAddPatientForm}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <AddPatientForm
            isOpen={showAddPatientForm}
            onClose={() => setShowAddPatientForm(false)}
            onSave={handleAddPatient}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
