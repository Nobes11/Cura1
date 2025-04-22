import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PatientSearchResult } from "./PatientSearch";
import { PatientSearch } from "./PatientSearch";
import { collection, addDoc, doc, updateDoc, db, serverTimestamp } from "../utils/firebase";

interface CheckInData {
  patientId: string;
  patientName: string;
  patientMrn: string;
  careArea: string;
  chiefComplaint: string;
  triageLevel: string;
  checkInTime: any; // Timestamp
  status: 'waiting';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface Props {
  onCheckInComplete: (checkIn: CheckInData) => void;
}

export const PatientCheckIn: React.FC<Props> = ({ onCheckInComplete }) => {
  const [selectedPatient, setSelectedPatient] = useState<PatientSearchResult | null>(null);
  const [careArea, setCareArea] = useState<string>("ED");
  const [chiefComplaint, setChiefComplaint] = useState<string>("");
  const [triageLevel, setTriageLevel] = useState<string>("3");
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handlePatientSelect = (patient: PatientSearchResult) => {
    setSelectedPatient(patient);
    toast.success(`Selected patient: ${patient.name}`);
  };

  const handleCheckIn = async () => {
    if (!selectedPatient) {
      toast.error("Please select a patient");
      return;
    }

    if (!chiefComplaint) {
      toast.error("Please enter a chief complaint");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare check-in data
      const checkInData: CheckInData = {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        patientMrn: selectedPatient.mrn,
        careArea,
        chiefComplaint,
        triageLevel,
        priority,
        checkInTime: serverTimestamp(),
        status: 'waiting'
      };

      // Save to Firestore - in a real app this would save to the database
      // For ED patients we would add them to an ED visits collection
      await addDoc(collection(db, "edVisits"), checkInData);
      
      // Update the patient's status in the patients collection
      if (selectedPatient.id.startsWith("mock")) {
        // Skip updating mock patients
        console.log("Mock patient - skipping status update");
      } else {
        await updateDoc(doc(db, "patients", selectedPatient.id), {
          lastVisit: serverTimestamp(),
          activeVisit: true
        });
      }

      // Notify parent component
      onCheckInComplete(checkInData);
      
      // Reset the form
      setSelectedPatient(null);
      setChiefComplaint("");
      setTriageLevel("3");
      setPriority("medium");
      
      toast.success(`Patient ${selectedPatient.name} checked in successfully`);
    } catch (error) {
      console.error("Error checking in patient:", error);
      toast.error("Failed to check in patient");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Patient Check-In</CardTitle>
          <CardDescription>
            Search for a patient by MRN, name, date of birth, or phone number
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedPatient ? (
            <PatientSearch onPatientSelect={handlePatientSelect} />
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-muted/50">
                <h3 className="font-medium">Selected Patient</h3>
                <p>{selectedPatient.name}</p>
                <p className="text-sm text-muted-foreground">
                  MRN: {selectedPatient.mrn} | 
                  DOB: {new Date(selectedPatient.dateOfBirth).toLocaleDateString()} | 
                  Gender: {selectedPatient.gender}
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Care Area</label>
                  <Select value={careArea} onValueChange={setCareArea}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select care area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ED">Emergency Department</SelectItem>
                      <SelectItem value="Trauma">Trauma</SelectItem>
                      <SelectItem value="Fast Track">Fast Track</SelectItem>
                      <SelectItem value="Triage">Triage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Chief Complaint</label>
                  <Textarea 
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    placeholder="Enter chief complaint..."
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Triage Level</label>
                    <Select value={triageLevel} onValueChange={setTriageLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select triage level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Level 1 (Resuscitation)</SelectItem>
                        <SelectItem value="2">Level 2 (Emergent)</SelectItem>
                        <SelectItem value="3">Level 3 (Urgent)</SelectItem>
                        <SelectItem value="4">Level 4 (Less Urgent)</SelectItem>
                        <SelectItem value="5">Level 5 (Non-Urgent)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <Select 
                      value={priority} 
                      onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high' | 'urgent')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {selectedPatient ? (
            <>
              <Button variant="outline" onClick={() => setSelectedPatient(null)}>Change Patient</Button>
              <Button onClick={handleCheckIn} disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Check In Patient"}
              </Button>
            </>
          ) : null}
        </CardFooter>
      </Card>
    </div>
  );
};
