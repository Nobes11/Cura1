import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

interface Allergy {
  allergen: string;
  reaction: string;
  severity: "Mild" | "Moderate" | "Severe";
  noted: string;
}

interface AllergiesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (allergy: Allergy) => void;
  onDelete?: (index: number) => void;
  allergy?: Allergy;
}

export const AllergiesDialog: React.FC<AllergiesDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  allergy,
  onDelete
}) => {
  const [allergyData, setAllergyData] = useState<Allergy>(allergy || {
    allergen: "",
    reaction: "",
    severity: "Moderate",
    noted: new Date().toISOString().split('T')[0]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAllergyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!allergyData.allergen || !allergyData.reaction) {
      alert("Please fill in all required fields");
      return;
    }
    
    onSave(allergyData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{allergy ? "Edit Allergy" : "Add New Allergy"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="allergen" className="text-sm font-medium">Allergen</label>
            <input
              id="allergen"
              name="allergen"
              className="w-full p-2 border rounded"
              value={allergyData.allergen}
              onChange={handleInputChange}
              placeholder="Enter allergen name"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="reaction" className="text-sm font-medium">Reaction</label>
            <input
              id="reaction"
              name="reaction"
              className="w-full p-2 border rounded"
              value={allergyData.reaction}
              onChange={handleInputChange}
              placeholder="Describe reaction"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="severity" className="text-sm font-medium">Severity</label>
            <select
              id="severity"
              name="severity"
              className="w-full p-2 border rounded"
              value={allergyData.severity}
              onChange={handleInputChange}
            >
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="noted" className="text-sm font-medium">Date Noted</label>
            <input
              id="noted"
              name="noted"
              type="date"
              className="w-full p-2 border rounded"
              value={allergyData.noted}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          {allergy && onDelete && (
            <Button variant="destructive" onClick={() => {
              // We don't have the index here, but PatientCharts component will find it
              onDelete(-1);
              onClose();
            }}>
              <Cross2Icon className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Allergy</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};