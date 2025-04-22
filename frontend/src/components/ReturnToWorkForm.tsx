import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReturnToWorkFormProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  onSign: (data: any) => void;
}

export const ReturnToWorkForm: React.FC<ReturnToWorkFormProps> = ({
  isOpen,
  onClose,
  patientName,
  patientId,
  onSign,
}) => {
  const currentDate = new Date().toISOString().slice(0, 10);

  const [formData, setFormData] = useState({
    visitDate: currentDate,
    diagnosis: "",
    
    // Return to work details
    returnStatus: "full", // full, restricted, not-cleared
    returnDate: currentDate,
    
    followUpNeeded: false,
    followUpDate: "",
    
    // Work restrictions (if applicable)
    restrictions: {
      lifting: false,
      liftingWeight: "",
      standing: false,
      standingHours: "",
      sitting: false,
      sittingHours: "",
      bending: false,
      squatting: false,
      kneeling: false,
      climbing: false,
      pushing: false,
      pulling: false,
      driving: false,
      workingAtHeights: false,
      operatingMachinery: false,
      repetitiveMotion: false,
      other: false,
      otherDescription: ""
    },
    
    // Additional information
    medications: "",
    specialInstructions: "",
    
    // Provider information
    providerName: "Dr. Patterson",
    providerPhone: "(555) 123-4567"
  });

  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [section, subField] = field.split('.');
      setFormData({
        ...formData,
        [section]: {
          ...formData[section as keyof typeof formData],
          [subField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [field]: value,
      });
    }
  };

  const handleSubmit = () => {
    const timestamp = new Date().toISOString();
    const formDataWithMeta = {
      ...formData,
      patientId,
      patientName,
      timestamp,
      type: "returnToWorkForm",
    };
    onSign(formDataWithMeta);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-sky-800">
            Return to Work Form - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visitDate" className="font-medium">Date of Visit</Label>
              <Input
                id="visitDate"
                type="date"
                value={formData.visitDate}
                onChange={(e) => handleChange('visitDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="diagnosis" className="font-medium">Diagnosis</Label>
              <Input
                id="diagnosis"
                placeholder="Primary diagnosis or condition"
                value={formData.diagnosis}
                onChange={(e) => handleChange('diagnosis', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-sky-700">Return to Work Status</h3>
            <Select
              value={formData.returnStatus}
              onValueChange={(value) => handleChange('returnStatus', value)}
            >
              <SelectTrigger id="returnStatus">
                <SelectValue placeholder="Select return status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Duty - May Return to Work Without Restrictions</SelectItem>
                <SelectItem value="restricted">May Return to Work with Restrictions</SelectItem>
                <SelectItem value="not-cleared">Not Cleared to Return to Work</SelectItem>
              </SelectContent>
            </Select>

            <div>
              <Label htmlFor="returnDate" className="font-medium">Return to Work Date</Label>
              <Input
                id="returnDate"
                type="date"
                value={formData.returnDate}
                onChange={(e) => handleChange('returnDate', e.target.value)}
              />
            </div>
          </div>

          {formData.returnStatus === "restricted" && (
            <div className="space-y-4 border-l-4 border-amber-500 pl-4">
              <h3 className="font-medium text-amber-700">Work Restrictions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                <div className="flex items-start space-x-2">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      id="lifting"
                      checked={formData.restrictions.lifting}
                      onCheckedChange={(checked) => handleChange('restrictions.lifting', !!checked)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="lifting" className="font-medium">No Lifting More Than</Label>
                    {formData.restrictions.lifting && (
                      <div className="mt-1">
                        <Input
                          id="liftingWeight"
                          placeholder="Weight in pounds"
                          value={formData.restrictions.liftingWeight}
                          onChange={(e) => handleChange('restrictions.liftingWeight', e.target.value)}
                          className="w-40"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      id="standing"
                      checked={formData.restrictions.standing}
                      onCheckedChange={(checked) => handleChange('restrictions.standing', !!checked)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="standing" className="font-medium">No Standing More Than</Label>
                    {formData.restrictions.standing && (
                      <div className="mt-1">
                        <Input
                          id="standingHours"
                          placeholder="Hours per shift"
                          value={formData.restrictions.standingHours}
                          onChange={(e) => handleChange('restrictions.standingHours', e.target.value)}
                          className="w-40"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-2">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      id="sitting"
                      checked={formData.restrictions.sitting}
                      onCheckedChange={(checked) => handleChange('restrictions.sitting', !!checked)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <Label htmlFor="sitting" className="font-medium">No Sitting More Than</Label>
                    {formData.restrictions.sitting && (
                      <div className="mt-1">
                        <Input
                          id="sittingHours"
                          placeholder="Hours per shift"
                          value={formData.restrictions.sittingHours}
                          onChange={(e) => handleChange('restrictions.sittingHours', e.target.value)}
                          className="w-40"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bending"
                    checked={formData.restrictions.bending}
                    onCheckedChange={(checked) => handleChange('restrictions.bending', !!checked)}
                  />
                  <Label htmlFor="bending" className="font-medium">No Bending/Stooping</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="squatting"
                    checked={formData.restrictions.squatting}
                    onCheckedChange={(checked) => handleChange('restrictions.squatting', !!checked)}
                  />
                  <Label htmlFor="squatting" className="font-medium">No Squatting</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="kneeling"
                    checked={formData.restrictions.kneeling}
                    onCheckedChange={(checked) => handleChange('restrictions.kneeling', !!checked)}
                  />
                  <Label htmlFor="kneeling" className="font-medium">No Kneeling</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="climbing"
                    checked={formData.restrictions.climbing}
                    onCheckedChange={(checked) => handleChange('restrictions.climbing', !!checked)}
                  />
                  <Label htmlFor="climbing" className="font-medium">No Climbing</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pushing"
                    checked={formData.restrictions.pushing}
                    onCheckedChange={(checked) => handleChange('restrictions.pushing', !!checked)}
                  />
                  <Label htmlFor="pushing" className="font-medium">No Pushing</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pulling"
                    checked={formData.restrictions.pulling}
                    onCheckedChange={(checked) => handleChange('restrictions.pulling', !!checked)}
                  />
                  <Label htmlFor="pulling" className="font-medium">No Pulling</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="driving"
                    checked={formData.restrictions.driving}
                    onCheckedChange={(checked) => handleChange('restrictions.driving', !!checked)}
                  />
                  <Label htmlFor="driving" className="font-medium">No Driving</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="workingAtHeights"
                    checked={formData.restrictions.workingAtHeights}
                    onCheckedChange={(checked) => handleChange('restrictions.workingAtHeights', !!checked)}
                  />
                  <Label htmlFor="workingAtHeights" className="font-medium">No Working at Heights</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="operatingMachinery"
                    checked={formData.restrictions.operatingMachinery}
                    onCheckedChange={(checked) => handleChange('restrictions.operatingMachinery', !!checked)}
                  />
                  <Label htmlFor="operatingMachinery" className="font-medium">No Operating Machinery</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="repetitiveMotion"
                    checked={formData.restrictions.repetitiveMotion}
                    onCheckedChange={(checked) => handleChange('restrictions.repetitiveMotion', !!checked)}
                  />
                  <Label htmlFor="repetitiveMotion" className="font-medium">No Repetitive Motion</Label>
                </div>

                <div className="flex items-start space-x-2 col-span-2">
                  <div className="flex h-5 items-center">
                    <Checkbox
                      id="other"
                      checked={formData.restrictions.other}
                      onCheckedChange={(checked) => handleChange('restrictions.other', !!checked)}
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <Label htmlFor="other" className="font-medium">Other Restrictions</Label>
                    {formData.restrictions.other && (
                      <div className="mt-1">
                        <Textarea
                          id="otherDescription"
                          placeholder="Describe other restrictions"
                          value={formData.restrictions.otherDescription}
                          onChange={(e) => handleChange('restrictions.otherDescription', e.target.value)}
                          className="min-h-[80px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="followUpNeeded"
                checked={formData.followUpNeeded}
                onCheckedChange={(checked) => handleChange('followUpNeeded', !!checked)}
              />
              <Label htmlFor="followUpNeeded" className="font-medium">Follow-up Appointment Needed</Label>
            </div>
            
            {formData.followUpNeeded && (
              <div>
                <Label htmlFor="followUpDate" className="font-medium">Follow-up Date</Label>
                <Input
                  id="followUpDate"
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => handleChange('followUpDate', e.target.value)}
                />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="medications" className="font-medium">Medications Prescribed</Label>
            <Textarea
              id="medications"
              placeholder="List medications prescribed, if any"
              value={formData.medications}
              onChange={(e) => handleChange('medications', e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div>
            <Label htmlFor="specialInstructions" className="font-medium">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              placeholder="Additional instructions or notes"
              value={formData.specialInstructions}
              onChange={(e) => handleChange('specialInstructions', e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="providerName" className="font-medium">Provider Name</Label>
              <Input
                id="providerName"
                value={formData.providerName}
                onChange={(e) => handleChange('providerName', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="providerPhone" className="font-medium">Provider Phone</Label>
              <Input
                id="providerPhone"
                value={formData.providerPhone}
                onChange={(e) => handleChange('providerPhone', e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            Sign Form
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
