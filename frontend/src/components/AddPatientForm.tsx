import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { addDoc, collection, db, serverTimestamp } from "../utils/firebase";
import { toast } from "sonner";
import { usePatientStore } from "../utils/patientStore";
import { PhoneInput } from "./PhoneInput";
import { UserSignupForm } from "./UserSignupForm";

export interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  email: string;
  emergencyContact: string;
  emergencyPhone: string;
  insuranceProvider: string;
  insuranceNumber: string;
  allergies: string;
  medicalHistory: string;
  preferredPharmacy: string;
  mrn?: string; // Medical Record Number (auto-generated)
  registrationDate?: any; // Timestamp
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: PatientFormData) => void;
}

export const AddPatientForm: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("demographics");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
    emergencyContact: "",
    emergencyPhone: "",
    insuranceProvider: "",
    insuranceNumber: "",
    allergies: "",
    medicalHistory: "",
    preferredPharmacy: ""
  });
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Generate a random MRN
  const generateMRN = () => {
    // Format: 7 digits with leading zeros
    const randomNum = Math.floor(Math.random() * 10000000);
    return randomNum.toString().padStart(7, '0');
  };
  
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    // If birthday hasn't occurred yet this year, subtract 1
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth) {
      toast.error("First name, last name, and date of birth are required");
      return;
    }
    
    setIsSubmitting(true);
    const patientStore = usePatientStore();
    
    try {
      // Generate MRN if this is a new patient
      const mrn = generateMRN();
      
      // Create patient data with all required Patient interface fields
      const fullName = `${formData.lastName}, ${formData.firstName}`;
      const now = new Date();
      
      // Create full patient object with all required fields for the Patient interface
      const patientData = {
        ...formData,
        mrn,
        name: fullName,
        fullName,
        registrationDate: serverTimestamp(),
        
        // Required fields for Patient interface
        id: `local-${Date.now()}`, // Will be overwritten by store/Firestore
        age: calculateAge(formData.dateOfBirth),
        // Initially patients only show on schedule, not the tracking board
        room: 'Schedule' as RoomType,
        status: 'waiting' as 'waiting' | 'in-progress' | 'discharge-ready' | 'discharged',
        registrationStatus: 'pending' as 'pending' | 'checked-in' | 'triaged',
        triageStatus: 'not-triaged' as 'not-triaged' | 'in-triage' | 'triaged',
        arrivalTime: now.toISOString(),
        lastUpdated: now.toISOString(),
        chiefComplaint: "",
        priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
        assignedProvider: null,
        assignedNurse: null,
        holdStatus: false,
        waitTime: 0,
      };
      
      // Save to the patient store (which handles both Firestore and local storage)
      await patientStore.addPatient(patientData);
      
      // Notify parent component
      onSave(patientData);
      
      toast.success(`Patient ${patientData.name} added successfully`);
      onClose();
      
      // Clear the form for next use
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        phoneNumber: "",
        email: "",
        emergencyContact: "",
        emergencyPhone: "",
        insuranceProvider: "",
        insuranceNumber: "",
        allergies: "",
        medicalHistory: "",
        preferredPharmacy: ""
      });
      
      // We'll stay on the current page instead of redirecting to schedule
      // navigate("/Schedule?newPatient=" + mrn);
    } catch (error) {
      console.error("Error adding patient:", error);
      toast.error("Failed to add patient");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter patient information to register them in the system
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="contact">Contact & Insurance</TabsTrigger>
            <TabsTrigger value="messaging">Messaging</TabsTrigger>
            <TabsTrigger value="medical">Medical History</TabsTrigger>
          </TabsList>
          
          {/* Demographics Tab */}
          <TabsContent value="demographics" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label>
                <Input 
                  id="dateOfBirth" 
                  name="dateOfBirth" 
                  type="date" 
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={formData.gender} 
                  onValueChange={(value) => handleSelectChange("gender", value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input 
                  id="city" 
                  name="city" 
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select 
                  value={formData.state} 
                  onValueChange={(value) => handleSelectChange("state", value)}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AL">Alabama</SelectItem>
                    <SelectItem value="AK">Alaska</SelectItem>
                    <SelectItem value="AZ">Arizona</SelectItem>
                    {/* Add all other states */}
                    <SelectItem value="WY">Wyoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input 
                  id="zipCode" 
                  name="zipCode" 
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="button" onClick={() => setActiveTab("contact")}>Next</Button>
            </div>
          </TabsContent>
          
          {/* Contact & Insurance Tab */}
          <TabsContent value="contact" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <PhoneInput 
                  value={formData.phoneNumber}
                  onChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input 
                  id="emergencyContact" 
                  name="emergencyContact" 
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                <PhoneInput 
                  value={formData.emergencyPhone}
                  onChange={(value) => setFormData(prev => ({ ...prev, emergencyPhone: value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input 
                  id="insuranceProvider" 
                  name="insuranceProvider" 
                  value={formData.insuranceProvider}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insuranceNumber">Insurance Number</Label>
                <Input 
                  id="insuranceNumber" 
                  name="insuranceNumber" 
                  value={formData.insuranceNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferredPharmacy">Preferred Pharmacy</Label>
              <Select 
                value={formData.preferredPharmacy} 
                onValueChange={(value) => handleSelectChange("preferredPharmacy", value)}
              >
                <SelectTrigger id="preferredPharmacy">
                  <SelectValue placeholder="Select preferred pharmacy" />
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
            
            <div className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => setActiveTab("demographics")}>Previous</Button>
              <Button type="button" onClick={() => setActiveTab("messaging")}>Next</Button>
            </div>
          </TabsContent>
          
          {/* Medical History Tab */}
          <TabsContent value="medical" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Patient Registration Complete</h3>
              <p className="text-sm text-muted-foreground">
                Basic patient information has been collected. You can now register the patient in the system.
              </p>
            </div>
            
            <div className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => setActiveTab("messaging")}>Previous</Button>
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Register Patient"}
              </Button>
            </div>
          </TabsContent>
          {/* Messaging Signup Tab */}
          <TabsContent value="messaging" className="space-y-4 mt-4">
            <UserSignupForm 
              email={formData.email} 
              onEmailChange={(email) => setFormData(prev => ({ ...prev, email }))} 
              onSignupComplete={() => setActiveTab("medical")}
            />
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" type="button" onClick={() => setActiveTab("contact")}>Previous</Button>
              <Button type="button" onClick={() => setActiveTab("medical")}>Skip</Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
