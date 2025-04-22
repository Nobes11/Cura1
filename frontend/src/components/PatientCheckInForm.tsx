import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Patient } from "../utils/mockData";
import { usePatientStore } from "../utils/patientStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export const PatientCheckInForm: React.FC<Props> = ({ isOpen, onClose, patient }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const patientStore = usePatientStore();
  
  // Form state
  const [formData, setFormData] = useState({
    chiefComplaint: "",
    preferredPharmacy: "",
    arrivalMode: "ambulatory"
  });
  
  // Initialize form data when patient changes
  useEffect(() => {
    if (patient) {
      setFormData({
        chiefComplaint: patient.chiefComplaint || "",
        preferredPharmacy: patient.preferredPharmacy || "",
        arrivalMode: patient.arrivalMode || "ambulatory"
      });
    }
  }, [patient]);
  
  // Handle text inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!patient) return;
    
    if (!formData.chiefComplaint) {
      toast.error("Chief complaint is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Update patient data
      await patientStore.updatePatient(patient.id, {
        ...formData,
        registrationStatus: "checked-in",
        triageStatus: "not-triaged",
        status: "waiting",
        // Move from schedule to tracking board
        room: "Lobby", 
        // Set current time as check-in time
        checkInTime: new Date().toISOString()
      });
      
      toast.success("Patient checked in successfully");
      onClose();
    } catch (error) {
      console.error("Error checking in patient:", error);
      toast.error("Failed to check in patient");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!patient) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Patient Check-In</DialogTitle>
          <DialogDescription>
            Check in {patient.name} and enter chief complaint
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="chiefComplaint">Chief Complaint <span className="text-red-500">*</span></Label>
            <Textarea
              id="chiefComplaint"
              name="chiefComplaint"
              placeholder="Reason for visit"
              value={formData.chiefComplaint}
              onChange={handleInputChange}
              className="min-h-[80px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferredPharmacy">Preferred Pharmacy</Label>
              <Select
                value={formData.preferredPharmacy}
                onValueChange={(value) => handleSelectChange("preferredPharmacy", value)}
              >
                <SelectTrigger id="preferredPharmacy">
                  <SelectValue placeholder="Select pharmacy" />
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
            
            <div className="space-y-2">
              <Label htmlFor="arrivalMode">Arrival Mode</Label>
              <Select
                value={formData.arrivalMode}
                onValueChange={(value) => handleSelectChange("arrivalMode", value)}
              >
                <SelectTrigger id="arrivalMode">
                  <SelectValue placeholder="Select arrival mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambulatory">Ambulatory</SelectItem>
                  <SelectItem value="wheelchair">Wheelchair</SelectItem>
                  <SelectItem value="stretcher">Stretcher</SelectItem>
                  <SelectItem value="ambulance">Ambulance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Check In Patient"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
