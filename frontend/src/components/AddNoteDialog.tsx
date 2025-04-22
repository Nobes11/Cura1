import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  patientName: string;
  noteType: "nurse" | "provider" | "comment";
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
}

export const AddNoteDialog: React.FC<Props> = ({
  patientName,
  noteType,
  isOpen,
  onClose,
  onSave,
}) => {
  const [note, setNote] = useState("");

  const handleSave = () => {
    if (note.trim()) {
      onSave(note);
      setNote("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {noteType === "comment" 
              ? "Add Comment" 
              : `Add ${noteType === "nurse" ? "Nurse" : "Provider"} Note`}
          </DialogTitle>
          <DialogDescription>
            {noteType === "comment"
              ? `Add a staff comment for patient: ${patientName}`
              : `Add a note for patient: ${patientName}`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder={noteType === "comment" 
              ? "Enter staff comment here..." 
              : `Enter ${noteType === "nurse" ? "nurse" : "provider"} notes here...`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[150px]"
            autoFocus
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!note.trim()}>
            Save {noteType === "comment" ? "Comment" : "Note"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
