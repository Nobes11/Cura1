import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentationFormProps {
  patientId: string;
  patientName: string;
  onSave: (documentation: any) => void;
  onCancel: () => void;
}

export const DocumentationForm: React.FC<DocumentationFormProps> = ({
  patientId,
  patientName,
  onSave,
  onCancel
}) => {
  const [docType, setDocType] = useState<string>("progress");
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("freeform");
  
  // Review of Systems state
  const [rosData, setRosData] = useState({
    constitutional: { checked: false, notes: "" },
    respiratory: { checked: false, notes: "" },
    cardiovascular: { checked: false, notes: "" },
    gastrointestinal: { checked: false, notes: "" },
    musculoskeletal: { checked: false, notes: "" },
    neurological: { checked: false, notes: "" },
    psychiatric: { checked: false, notes: "" },
    endocrine: { checked: false, notes: "" },
    hematologic: { checked: false, notes: "" },
    allergic: { checked: false, notes: "" },
  });

  // Physical Exam state
  const [peData, setPeData] = useState({
    general: { checked: false, notes: "" },
    heent: { checked: false, notes: "" },
    neck: { checked: false, notes: "" },
    lungs: { checked: false, notes: "" },
    cardiovascular: { checked: false, notes: "" },
    abdomen: { checked: false, notes: "" },
    extremities: { checked: false, notes: "" },
    skin: { checked: false, notes: "" },
    neurological: { checked: false, notes: "" },
  });

  const handleSave = () => {
    const timestamp = new Date().toISOString();
    let docContent = "";
    
    if (activeTab === "freeform") {
      docContent = content;
    } else if (activeTab === "ros") {
      // Format ROS data
      const rosEntries = Object.entries(rosData);
      const rosFormatted = rosEntries
        .filter(([_, value]) => value.checked || value.notes)
        .map(([system, value]) => {
          const systemName = system.charAt(0).toUpperCase() + system.slice(1);
          return `${systemName}: ${value.checked ? "Normal" : "Abnormal"}${value.notes ? ` - ${value.notes}` : ""}`;
        })
        .join("\n");
      
      docContent = `REVIEW OF SYSTEMS:\n${rosFormatted}`;
    } else if (activeTab === "pe") {
      // Format Physical Exam data
      const peEntries = Object.entries(peData);
      const peFormatted = peEntries
        .filter(([_, value]) => value.checked || value.notes)
        .map(([system, value]) => {
          const systemName = system.charAt(0).toUpperCase() + system.slice(1);
          return `${systemName}: ${value.checked ? "Normal" : "Abnormal"}${value.notes ? ` - ${value.notes}` : ""}`;
        })
        .join("\n");
      
      docContent = `PHYSICAL EXAMINATION:\n${peFormatted}`;
    }
    
    const documentation = {
      id: `doc_${Date.now()}`,
      patientId,
      title: title || `${docType.charAt(0).toUpperCase() + docType.slice(1)} Note`,
      type: docType,
      content: docContent,
      timestamp,
      provider: "Dr. Current User", // In a real app, this would be the logged-in user
    };
    
    onSave(documentation);
  };

  const updateRosField = (system: string, field: "checked" | "notes", value: boolean | string) => {
    setRosData(prev => ({
      ...prev,
      [system]: {
        ...prev[system as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const updatePeField = (system: string, field: "checked" | "notes", value: boolean | string) => {
    setPeData(prev => ({
      ...prev,
      [system]: {
        ...prev[system as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>New Documentation for {patientName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="doc-title">Title</Label>
            <Input 
              id="doc-title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Enter documentation title"
            />
          </div>
          <div>
            <Label htmlFor="doc-type">Documentation Type</Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger id="doc-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="progress">Progress Note</SelectItem>
                <SelectItem value="admission">Admission Note</SelectItem>
                <SelectItem value="discharge">Discharge Summary</SelectItem>
                <SelectItem value="procedure">Procedure Note</SelectItem>
                <SelectItem value="consultation">Consultation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="freeform">Freeform</TabsTrigger>
            <TabsTrigger value="ros">Review of Systems</TabsTrigger>
            <TabsTrigger value="pe">Physical Exam</TabsTrigger>
          </TabsList>
          
          <TabsContent value="freeform" className="space-y-4">
            <Textarea 
              placeholder="Enter documentation here..."
              className="min-h-[300px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </TabsContent>
          
          <TabsContent value="ros" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(rosData).map(([system, value]) => (
                <div key={system} className="border p-3 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox 
                      id={`ros-${system}`} 
                      checked={value.checked}
                      onCheckedChange={(checked) => 
                        updateRosField(system, "checked", checked === true)
                      }
                    />
                    <Label htmlFor={`ros-${system}`} className="capitalize">
                      {system} (Normal)
                    </Label>
                  </div>
                  <Textarea 
                    placeholder={`Notes for ${system}...`}
                    className="h-[80px]"
                    value={value.notes}
                    onChange={(e) => updateRosField(system, "notes", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="pe" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(peData).map(([system, value]) => (
                <div key={system} className="border p-3 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox 
                      id={`pe-${system}`} 
                      checked={value.checked}
                      onCheckedChange={(checked) => 
                        updatePeField(system, "checked", checked === true)
                      }
                    />
                    <Label htmlFor={`pe-${system}`} className="capitalize">
                      {system} (Normal)
                    </Label>
                  </div>
                  <Textarea 
                    placeholder={`Findings for ${system}...`}
                    className="h-[80px]"
                    value={value.notes}
                    onChange={(e) => updatePeField(system, "notes", e.target.value)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Documentation</Button>
      </CardFooter>
    </Card>
  );
};
