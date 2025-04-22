import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CustomFirebaseSignup } from "./CustomFirebaseSignup";

interface RegisterModalProps {
  triggerText?: string;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({ triggerText = "Register" }) => {
  const [open, setOpen] = useState(false);
  
  const handleComplete = () => {
    // Close the modal after successful registration
    setTimeout(() => setOpen(false), 3000);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-sky-600 hover:underline px-0">
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">Create an account</DialogTitle>
          <DialogDescription className="text-center">
            Register for Cura Workspace Access
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <CustomFirebaseSignup onComplete={handleComplete} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
