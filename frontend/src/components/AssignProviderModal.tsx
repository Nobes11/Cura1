import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  isOpen: boolean;
  patientName: string;
  patientId: string;
  currentProvider?: string | null;
  assignmentType: "provider" | "nurse";
  onClose: () => void;
  onSave: (patientId: string, provider: string) => void;
}

const providers = [
  "Dr. Sarah Johnson",
  "Dr. Michael Chen",
  "Dr. Emily Rodriguez",
  "Dr. David Kim",
  "Dr. Lisa Patel",
  "Dr. James Wilson",
  "Dr. Robert Smith",
  "Dr. Maria Garcia"
];

const nurses = [
  "RN Amanda Thompson",
  "RN John Davis",
  "RN Jessica Lee",
  "RN Carlos Mendez",
  "RN Stephanie Wright",
  "RN Kevin Brown",
  "RN Rachel Taylor",
  "RN Thomas Miller"
];

export const AssignProviderModal: React.FC<Props> = ({
  isOpen,
  patientName,
  patientId,
  currentProvider,
  assignmentType,
  onClose,
  onSave,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>(currentProvider || "");
  const [customName, setCustomName] = useState<string>("");
  const [inputMethod, setInputMethod] = useState<"select" | "custom">("select");
  const [customStyles, setCustomStyles] = useState({
    color: assignmentType === "provider" ? "#3b82f6" : "#10b981",
    fontFamily: assignmentType === "provider" ? "monospace" : "serif",
    fontStyle: assignmentType === "provider" ? "normal" : "italic",
    fontWeight: "normal"
  });
  const options = assignmentType === "provider" ? providers : nurses;
  
  const getProviderName = () => {
    if (inputMethod === "custom" && customName) {
      return customName;
    }
    return selectedProvider;
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Assign {assignmentType === "provider" ? "Provider" : "Nurse"} to {patientName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Tabs defaultValue="select" onValueChange={(value) => setInputMethod(value as "select" | "custom")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="select">Choose from List</TabsTrigger>
              <TabsTrigger value="custom">Enter Custom Name</TabsTrigger>
            </TabsList>
            
            <TabsContent value="select" className="space-y-3 pt-2">
              <div className="space-y-2">
                <Label htmlFor="provider">
                  Select {assignmentType === "provider" ? "Provider" : "Nurse"}
                </Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${assignmentType === "provider" ? "Provider" : "Nurse"}...`} />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-3 pt-2">
              <div className="space-y-2">
                <Label htmlFor="customName">
                  Enter {assignmentType === "provider" ? "Provider" : "Nurse"} Name
                </Label>
                <Input 
                  id="customName" 
                  value={customName} 
                  onChange={(e) => setCustomName(e.target.value)} 
                  placeholder={assignmentType === "provider" ? "Dr. " : "RN "}
                />
              </div>
              
              <div className="space-y-2 pt-2">
                <Label>Custom Styling</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="textColor" className="text-xs">Text Color</Label>
                    <Input 
                      id="textColor" 
                      type="color" 
                      value={customStyles.color} 
                      onChange={(e) => setCustomStyles({...customStyles, color: e.target.value})} 
                      className="h-8 w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fontFamily" className="text-xs">Font Style</Label>
                    <Select 
                      value={customStyles.fontFamily} 
                      onValueChange={(val) => setCustomStyles({...customStyles, fontFamily: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Font family" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sans-serif">Sans Serif</SelectItem>
                        <SelectItem value="serif">Serif</SelectItem>
                        <SelectItem value="monospace">Monospace</SelectItem>
                        <SelectItem value="cursive">Cursive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <Label htmlFor="fontWeight" className="text-xs">Weight</Label>
                    <Select 
                      value={customStyles.fontWeight} 
                      onValueChange={(val) => setCustomStyles({...customStyles, fontWeight: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Font weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="fontStyle" className="text-xs">Style</Label>
                    <Select 
                      value={customStyles.fontStyle} 
                      onValueChange={(val) => setCustomStyles({...customStyles, fontStyle: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Font style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="italic">Italic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-3 p-2 border rounded">
                  <Label className="text-xs mb-1 block">Preview:</Label>
                  <div 
                    style={{
                      color: customStyles.color,
                      fontFamily: customStyles.fontFamily,
                      fontWeight: customStyles.fontWeight,
                      fontStyle: customStyles.fontStyle
                    }} 
                    className="text-base">
                    {customName || (assignmentType === "provider" ? "Dr. Example" : "RN Example")}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            type="button" 
            disabled={inputMethod === "select" ? !selectedProvider : !customName}
            onClick={() => {
              const finalName = getProviderName();
              // Save the name along with the style information as a JSON string in the format: "|style|{...}|name|"  
              const styleData = JSON.stringify(customStyles);
              const styledName = inputMethod === "custom" 
                ? `|style|${styleData}|name|${finalName}` 
                : finalName;
              
              onSave(patientId, styledName);
              onClose();
            }}
          >
            Assign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
