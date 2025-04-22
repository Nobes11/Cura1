import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PhysicianEncounterNoteProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  onSign: (data: any) => void;
}

export const PhysicianEncounterNote: React.FC<PhysicianEncounterNoteProps> = ({
  isOpen,
  onClose,
  patientName,
  patientId,
  onSign,
}) => {
  const [activeTab, setActiveTab] = useState("hpi");
  const [formData, setFormData] = useState({
    hpi: {
      chiefComplaint: "",
      historyOfPresentIllness: `Patient presents with...
      
Symptom onset: 
Severity: 
Quality: 
Radiation: 
Associated symptoms: 
Aggravating factors: 
Relieving factors: 
Timing: 
      `,
      ropSystemic: false,
      ropCardiovascular: false,
      ropRespiratory: false,
      ropGastrointestinal: false,
      ropGenitourinary: false,
      ropMusculoskeletal: false,
      ropNeurological: false,
      ropPsychiatric: false,
    },
    pastHistory: {
      pastMedicalHistory: "",
      surgicalHistory: "",
      medications: "",
      allergies: "",
      socialHistory: "",
      familyHistory: "",
    },
    physicalExam: {
      vitalSigns: "",
      generalAppearance: "Alert and oriented x3, in no acute distress",
      heent: "Normocephalic, atraumatic. Pupils equal, round, and reactive to light. Oral mucosa moist.",
      neck: "Supple, no lymphadenopathy or thyromegaly.",
      respiratory: "Clear to auscultation bilaterally, no wheezes, rales, or rhonchi.",
      cardiovascular: "Regular rate and rhythm, no murmurs, gallops, or rubs.",
      abdomen: "Soft, non-tender, non-distended. Normal bowel sounds. No organomegaly.",
      extremities: "No edema, cyanosis, or clubbing. Full range of motion.",
      skin: "No rashes, lesions, or unusual pigmentation.",
      neurological: "CN II-XII intact. Sensation intact to light touch. Motor strength 5/5 in all extremities.",
      psychiatric: "Mood and affect appropriate. Normal thought process.",
    },
    assessment: {
      diagnosis: "",
      differentials: "",
      clinicalImpression: "",
    },
    plan: {
      diagnosticStudies: "",
      medications: "",
      procedures: "",
      consultations: "",
      patientEducation: "",
      disposition: "discharge",
      followUp: "",
    },
  });

  const handleChange = (section: string, field: string, value: any) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section as keyof typeof formData],
        [field]: value,
      },
    });
  };

  const handleSubmit = () => {
    const timestamp = new Date().toISOString();
    const noteData = {
      ...formData,
      patientId,
      authorName: "Dr. Patterson",
      timestamp,
      type: "physicianEncounterNote",
    };
    onSign(noteData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-sky-800">
            Physician Encounter Note - {patientName}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="hpi">
              HPI & ROS
            </TabsTrigger>
            <TabsTrigger value="pastHistory">
              Past History
            </TabsTrigger>
            <TabsTrigger value="physicalExam">
              Physical Exam
            </TabsTrigger>
            <TabsTrigger value="assessment">
              Assessment
            </TabsTrigger>
            <TabsTrigger value="plan">
              Plan
            </TabsTrigger>
          </TabsList>

          {/* HPI Tab */}
          <TabsContent value="hpi" className="space-y-4">
            <div>
              <Label htmlFor="chiefComplaint" className="font-medium">Chief Complaint</Label>
              <Input
                id="chiefComplaint"
                placeholder="Chief complaint"
                value={formData.hpi.chiefComplaint}
                onChange={(e) => handleChange('hpi', 'chiefComplaint', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="historyOfPresentIllness" className="font-medium">History of Present Illness</Label>
              <Textarea
                id="historyOfPresentIllness"
                placeholder="Describe the history of present illness"
                value={formData.hpi.historyOfPresentIllness}
                onChange={(e) => handleChange('hpi', 'historyOfPresentIllness', e.target.value)}
                className="min-h-[200px]"
              />
            </div>

            <div>
              <h3 className="font-medium mb-2">Review of Systems</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ropSystemic"
                    checked={formData.hpi.ropSystemic}
                    onCheckedChange={(checked) => handleChange('hpi', 'ropSystemic', checked)}
                  />
                  <Label htmlFor="ropSystemic">Systemic (fever, chills, fatigue)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ropCardiovascular"
                    checked={formData.hpi.ropCardiovascular}
                    onCheckedChange={(checked) => handleChange('hpi', 'ropCardiovascular', checked)}
                  />
                  <Label htmlFor="ropCardiovascular">Cardiovascular</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ropRespiratory"
                    checked={formData.hpi.ropRespiratory}
                    onCheckedChange={(checked) => handleChange('hpi', 'ropRespiratory', checked)}
                  />
                  <Label htmlFor="ropRespiratory">Respiratory</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ropGastrointestinal"
                    checked={formData.hpi.ropGastrointestinal}
                    onCheckedChange={(checked) => handleChange('hpi', 'ropGastrointestinal', checked)}
                  />
                  <Label htmlFor="ropGastrointestinal">Gastrointestinal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ropGenitourinary"
                    checked={formData.hpi.ropGenitourinary}
                    onCheckedChange={(checked) => handleChange('hpi', 'ropGenitourinary', checked)}
                  />
                  <Label htmlFor="ropGenitourinary">Genitourinary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ropMusculoskeletal"
                    checked={formData.hpi.ropMusculoskeletal}
                    onCheckedChange={(checked) => handleChange('hpi', 'ropMusculoskeletal', checked)}
                  />
                  <Label htmlFor="ropMusculoskeletal">Musculoskeletal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ropNeurological"
                    checked={formData.hpi.ropNeurological}
                    onCheckedChange={(checked) => handleChange('hpi', 'ropNeurological', checked)}
                  />
                  <Label htmlFor="ropNeurological">Neurological</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ropPsychiatric"
                    checked={formData.hpi.ropPsychiatric}
                    onCheckedChange={(checked) => handleChange('hpi', 'ropPsychiatric', checked)}
                  />
                  <Label htmlFor="ropPsychiatric">Psychiatric</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Past History Tab */}
          <TabsContent value="pastHistory" className="space-y-4">
            <div>
              <Label htmlFor="pastMedicalHistory" className="font-medium">Past Medical History</Label>
              <Textarea
                id="pastMedicalHistory"
                placeholder="List patient's medical history"
                value={formData.pastHistory.pastMedicalHistory}
                onChange={(e) => handleChange('pastHistory', 'pastMedicalHistory', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="surgicalHistory" className="font-medium">Surgical History</Label>
              <Textarea
                id="surgicalHistory"
                placeholder="List patient's surgical history"
                value={formData.pastHistory.surgicalHistory}
                onChange={(e) => handleChange('pastHistory', 'surgicalHistory', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="medications" className="font-medium">Medications</Label>
              <Textarea
                id="medications"
                placeholder="List patient's current medications"
                value={formData.pastHistory.medications}
                onChange={(e) => handleChange('pastHistory', 'medications', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="allergies" className="font-medium">Allergies</Label>
              <Textarea
                id="allergies"
                placeholder="List patient's allergies and reactions"
                value={formData.pastHistory.allergies}
                onChange={(e) => handleChange('pastHistory', 'allergies', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="socialHistory" className="font-medium">Social History</Label>
              <Textarea
                id="socialHistory"
                placeholder="Smoking, alcohol, drugs, occupation, etc."
                value={formData.pastHistory.socialHistory}
                onChange={(e) => handleChange('pastHistory', 'socialHistory', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="familyHistory" className="font-medium">Family History</Label>
              <Textarea
                id="familyHistory"
                placeholder="Relevant family medical history"
                value={formData.pastHistory.familyHistory}
                onChange={(e) => handleChange('pastHistory', 'familyHistory', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </TabsContent>

          {/* Physical Exam Tab */}
          <TabsContent value="physicalExam" className="space-y-4">
            <div>
              <Label htmlFor="vitalSigns" className="font-medium">Vital Signs</Label>
              <Textarea
                id="vitalSigns"
                placeholder="BP, HR, RR, Temp, O2 Sat, Pain (0-10)"
                value={formData.physicalExam.vitalSigns}
                onChange={(e) => handleChange('physicalExam', 'vitalSigns', e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="generalAppearance" className="font-medium">General Appearance</Label>
                <Textarea
                  id="generalAppearance"
                  value={formData.physicalExam.generalAppearance}
                  onChange={(e) => handleChange('physicalExam', 'generalAppearance', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="heent" className="font-medium">HEENT</Label>
                <Textarea
                  id="heent"
                  value={formData.physicalExam.heent}
                  onChange={(e) => handleChange('physicalExam', 'heent', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="neck" className="font-medium">Neck</Label>
                <Textarea
                  id="neck"
                  value={formData.physicalExam.neck}
                  onChange={(e) => handleChange('physicalExam', 'neck', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="respiratory" className="font-medium">Respiratory</Label>
                <Textarea
                  id="respiratory"
                  value={formData.physicalExam.respiratory}
                  onChange={(e) => handleChange('physicalExam', 'respiratory', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="cardiovascular" className="font-medium">Cardiovascular</Label>
                <Textarea
                  id="cardiovascular"
                  value={formData.physicalExam.cardiovascular}
                  onChange={(e) => handleChange('physicalExam', 'cardiovascular', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="abdomen" className="font-medium">Abdomen</Label>
                <Textarea
                  id="abdomen"
                  value={formData.physicalExam.abdomen}
                  onChange={(e) => handleChange('physicalExam', 'abdomen', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="extremities" className="font-medium">Extremities</Label>
                <Textarea
                  id="extremities"
                  value={formData.physicalExam.extremities}
                  onChange={(e) => handleChange('physicalExam', 'extremities', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="skin" className="font-medium">Skin</Label>
                <Textarea
                  id="skin"
                  value={formData.physicalExam.skin}
                  onChange={(e) => handleChange('physicalExam', 'skin', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="neurological" className="font-medium">Neurological</Label>
                <Textarea
                  id="neurological"
                  value={formData.physicalExam.neurological}
                  onChange={(e) => handleChange('physicalExam', 'neurological', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="psychiatric" className="font-medium">Psychiatric</Label>
                <Textarea
                  id="psychiatric"
                  value={formData.physicalExam.psychiatric}
                  onChange={(e) => handleChange('physicalExam', 'psychiatric', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </TabsContent>

          {/* Assessment Tab */}
          <TabsContent value="assessment" className="space-y-4">
            <div>
              <Label htmlFor="diagnosis" className="font-medium">Primary Diagnosis</Label>
              <Textarea
                id="diagnosis"
                placeholder="Primary diagnosis or impression"
                value={formData.assessment.diagnosis}
                onChange={(e) => handleChange('assessment', 'diagnosis', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="differentials" className="font-medium">Differential Diagnoses</Label>
              <Textarea
                id="differentials"
                placeholder="List differential diagnoses"
                value={formData.assessment.differentials}
                onChange={(e) => handleChange('assessment', 'differentials', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="clinicalImpression" className="font-medium">Clinical Impression & Summary</Label>
              <Textarea
                id="clinicalImpression"
                placeholder="Clinical reasoning and assessment summary"
                value={formData.assessment.clinicalImpression}
                onChange={(e) => handleChange('assessment', 'clinicalImpression', e.target.value)}
                className="min-h-[150px]"
              />
            </div>
          </TabsContent>

          {/* Plan Tab */}
          <TabsContent value="plan" className="space-y-4">
            <div>
              <Label htmlFor="diagnosticStudies" className="font-medium">Diagnostic Studies</Label>
              <Textarea
                id="diagnosticStudies"
                placeholder="Labs, imaging, and other diagnostic tests"
                value={formData.plan.diagnosticStudies}
                onChange={(e) => handleChange('plan', 'diagnosticStudies', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="medications" className="font-medium">Medications</Label>
              <Textarea
                id="medications"
                placeholder="Prescribed medications, dosage, frequency"
                value={formData.plan.medications}
                onChange={(e) => handleChange('plan', 'medications', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="procedures" className="font-medium">Procedures</Label>
              <Textarea
                id="procedures"
                placeholder="Procedures performed or recommended"
                value={formData.plan.procedures}
                onChange={(e) => handleChange('plan', 'procedures', e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="consultations" className="font-medium">Consultations</Label>
              <Textarea
                id="consultations"
                placeholder="Specialist consultations requested"
                value={formData.plan.consultations}
                onChange={(e) => handleChange('plan', 'consultations', e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="patientEducation" className="font-medium">Patient Education</Label>
              <Textarea
                id="patientEducation"
                placeholder="Instructions and education provided to patient"
                value={formData.plan.patientEducation}
                onChange={(e) => handleChange('plan', 'patientEducation', e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="disposition" className="font-medium">Disposition</Label>
              <Select
                value={formData.plan.disposition}
                onValueChange={(value) => handleChange('plan', 'disposition', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select disposition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="discharge">Discharge Home</SelectItem>
                  <SelectItem value="admit">Admit to Hospital</SelectItem>
                  <SelectItem value="transfer">Transfer to Another Facility</SelectItem>
                  <SelectItem value="observation">Observation Unit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="followUp" className="font-medium">Follow-up Instructions</Label>
              <Textarea
                id="followUp"
                placeholder="Follow-up recommendations and timing"
                value={formData.plan.followUp}
                onChange={(e) => handleChange('plan', 'followUp', e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Sign Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
