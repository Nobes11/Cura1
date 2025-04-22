import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface NursingNoteProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  onSign: (data: any) => void;
}

export const NursingNote: React.FC<NursingNoteProps> = ({
  isOpen,
  onClose,
  patientName,
  patientId,
  onSign,
}) => {
  const [formData, setFormData] = useState({
    // Assessment
    vitalSigns: {
      temperature: "",
      pulse: "",
      respirations: "",
      bloodPressure: "",
      oxygenSaturation: "",
      painScore: "0"
    },
    patientStatus: {
      oriented: true,
      alert: true,
      responsive: true,
      confused: false,
      agitated: false,
      unresponsive: false
    },
    painAssessment: {
      location: "",
      quality: "",
      severity: "0",
      duration: "",
      relievingFactors: "",
      aggravatingFactors: ""
    },
    ivStatus: {
      hasIV: false,
      site: "",
      size: "",
      fluidType: "",
      flowRate: "",
      lastChanged: ""
    },
    // Activities
    careProvided: {
      medicationsGiven: "",
      proceduresPerformed: "",
      specimenCollected: "",
      otherCare: ""
    },
    patientTeaching: "",
    // Narrative
    narrativeNote: "Patient continues to be monitored in the emergency department. ",
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

  const handleNarrativeChange = (value: string) => {
    setFormData({
      ...formData,
      narrativeNote: value,
    });
  };

  const handleSubmit = () => {
    const timestamp = new Date().toISOString();
    const noteData = {
      ...formData,
      patientId,
      nurseName: "Nurse Johnson",
      timestamp,
      type: "nursingNote",
    };
    onSign(noteData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-sky-800">
            Nursing Narrative Note - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Vital Signs */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Current Vital Signs</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="temperature" className="font-medium">Temperature (°F)</Label>
                <Input
                  id="temperature"
                  placeholder="e.g., 98.6"
                  value={formData.vitalSigns.temperature}
                  onChange={(e) => handleChange('vitalSigns', 'temperature', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pulse" className="font-medium">Pulse (bpm)</Label>
                <Input
                  id="pulse"
                  placeholder="e.g., 72"
                  value={formData.vitalSigns.pulse}
                  onChange={(e) => handleChange('vitalSigns', 'pulse', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="respirations" className="font-medium">Respirations (bpm)</Label>
                <Input
                  id="respirations"
                  placeholder="e.g., 16"
                  value={formData.vitalSigns.respirations}
                  onChange={(e) => handleChange('vitalSigns', 'respirations', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bloodPressure" className="font-medium">Blood Pressure</Label>
                <Input
                  id="bloodPressure"
                  placeholder="e.g., 120/80"
                  value={formData.vitalSigns.bloodPressure}
                  onChange={(e) => handleChange('vitalSigns', 'bloodPressure', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="oxygenSaturation" className="font-medium">O2 Saturation (%)</Label>
                <Input
                  id="oxygenSaturation"
                  placeholder="e.g., 98"
                  value={formData.vitalSigns.oxygenSaturation}
                  onChange={(e) => handleChange('vitalSigns', 'oxygenSaturation', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="painScore" className="font-medium">Pain Score (0-10)</Label>
                <Select
                  value={formData.vitalSigns.painScore}
                  onValueChange={(value) => handleChange('vitalSigns', 'painScore', value)}
                >
                  <SelectTrigger id="painScore">
                    <SelectValue placeholder="Select pain level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(11)].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Patient Status */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Patient Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="oriented"
                  checked={formData.patientStatus.oriented}
                  onCheckedChange={(checked) => handleChange('patientStatus', 'oriented', !!checked)}
                />
                <Label htmlFor="oriented">Oriented</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="alert"
                  checked={formData.patientStatus.alert}
                  onCheckedChange={(checked) => handleChange('patientStatus', 'alert', !!checked)}
                />
                <Label htmlFor="alert">Alert</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="responsive"
                  checked={formData.patientStatus.responsive}
                  onCheckedChange={(checked) => handleChange('patientStatus', 'responsive', !!checked)}
                />
                <Label htmlFor="responsive">Responsive</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="confused"
                  checked={formData.patientStatus.confused}
                  onCheckedChange={(checked) => handleChange('patientStatus', 'confused', !!checked)}
                />
                <Label htmlFor="confused">Confused</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agitated"
                  checked={formData.patientStatus.agitated}
                  onCheckedChange={(checked) => handleChange('patientStatus', 'agitated', !!checked)}
                />
                <Label htmlFor="agitated">Agitated</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="unresponsive"
                  checked={formData.patientStatus.unresponsive}
                  onCheckedChange={(checked) => handleChange('patientStatus', 'unresponsive', !!checked)}
                />
                <Label htmlFor="unresponsive">Unresponsive</Label>
              </div>
            </div>
          </div>

          {/* Pain Assessment */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Pain Assessment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="painLocation" className="font-medium">Pain Location</Label>
                <Input
                  id="painLocation"
                  placeholder="Location of pain"
                  value={formData.painAssessment.location}
                  onChange={(e) => handleChange('painAssessment', 'location', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="painQuality" className="font-medium">Pain Quality</Label>
                <Input
                  id="painQuality"
                  placeholder="e.g., sharp, dull, throbbing"
                  value={formData.painAssessment.quality}
                  onChange={(e) => handleChange('painAssessment', 'quality', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="painSeverity" className="font-medium">Pain Severity (0-10)</Label>
                <Select
                  value={formData.painAssessment.severity}
                  onValueChange={(value) => handleChange('painAssessment', 'severity', value)}
                >
                  <SelectTrigger id="painSeverity">
                    <SelectValue placeholder="Select pain severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(11)].map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>{i}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="painDuration" className="font-medium">Pain Duration</Label>
                <Input
                  id="painDuration"
                  placeholder="How long pain has been present"
                  value={formData.painAssessment.duration}
                  onChange={(e) => handleChange('painAssessment', 'duration', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="relievingFactors" className="font-medium">Relieving Factors</Label>
                <Input
                  id="relievingFactors"
                  placeholder="What relieves the pain"
                  value={formData.painAssessment.relievingFactors}
                  onChange={(e) => handleChange('painAssessment', 'relievingFactors', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="aggravatingFactors" className="font-medium">Aggravating Factors</Label>
                <Input
                  id="aggravatingFactors"
                  placeholder="What worsens the pain"
                  value={formData.painAssessment.aggravatingFactors}
                  onChange={(e) => handleChange('painAssessment', 'aggravatingFactors', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* IV Status */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Checkbox
                id="hasIV"
                checked={formData.ivStatus.hasIV}
                onCheckedChange={(checked) => handleChange('ivStatus', 'hasIV', !!checked)}
              />
              <Label htmlFor="hasIV" className="font-medium text-sky-700">IV Access</Label>
            </div>
            
            {formData.ivStatus.hasIV && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
                <div>
                  <Label htmlFor="ivSite" className="font-medium">IV Site</Label>
                  <Input
                    id="ivSite"
                    placeholder="e.g., Right forearm"
                    value={formData.ivStatus.site}
                    onChange={(e) => handleChange('ivStatus', 'site', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ivSize" className="font-medium">IV Size</Label>
                  <Input
                    id="ivSize"
                    placeholder="e.g., 20G"
                    value={formData.ivStatus.size}
                    onChange={(e) => handleChange('ivStatus', 'size', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fluidType" className="font-medium">Fluid Type</Label>
                  <Input
                    id="fluidType"
                    placeholder="e.g., Normal Saline"
                    value={formData.ivStatus.fluidType}
                    onChange={(e) => handleChange('ivStatus', 'fluidType', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="flowRate" className="font-medium">Flow Rate</Label>
                  <Input
                    id="flowRate"
                    placeholder="e.g., 125 mL/hr"
                    value={formData.ivStatus.flowRate}
                    onChange={(e) => handleChange('ivStatus', 'flowRate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastChanged" className="font-medium">Last Changed</Label>
                  <Input
                    id="lastChanged"
                    placeholder="When IV was last changed"
                    value={formData.ivStatus.lastChanged}
                    onChange={(e) => handleChange('ivStatus', 'lastChanged', e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Care Provided */}
          <div>
            <h3 className="font-medium text-sky-700 mb-3">Care Provided</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="medicationsGiven" className="font-medium">Medications Given</Label>
                <Textarea
                  id="medicationsGiven"
                  placeholder="Medications administered"
                  value={formData.careProvided.medicationsGiven}
                  onChange={(e) => handleChange('careProvided', 'medicationsGiven', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="proceduresPerformed" className="font-medium">Procedures Performed</Label>
                <Textarea
                  id="proceduresPerformed"
                  placeholder="Procedures or treatments"
                  value={formData.careProvided.proceduresPerformed}
                  onChange={(e) => handleChange('careProvided', 'proceduresPerformed', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="specimenCollected" className="font-medium">Specimens Collected</Label>
                <Textarea
                  id="specimenCollected"
                  placeholder="Lab specimens collected"
                  value={formData.careProvided.specimenCollected}
                  onChange={(e) => handleChange('careProvided', 'specimenCollected', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label htmlFor="otherCare" className="font-medium">Other Care</Label>
                <Textarea
                  id="otherCare"
                  placeholder="Additional care activities"
                  value={formData.careProvided.otherCare}
                  onChange={(e) => handleChange('careProvided', 'otherCare', e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="patientTeaching" className="font-medium">Patient Teaching</Label>
            <Textarea
              id="patientTeaching"
              placeholder="Education provided to patient"
              value={formData.patientTeaching}
              onChange={(e) => setFormData({...formData, patientTeaching: e.target.value})}
              className="min-h-[80px]"
            />
          </div>

          {/* Narrative Note */}
          <div>
            <Label htmlFor="narrativeNote" className="font-medium">Narrative Note</Label>
            <Textarea
              id="narrativeNote"
              placeholder="Detailed narrative of patient care and observations"
              value={formData.narrativeNote}
              onChange={(e) => handleNarrativeChange(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
        </div>

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
