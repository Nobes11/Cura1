import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, ListPlus, SaveIcon, ClipboardCheck, X, Info, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface Vital {
  timestamp: string;
  temperature?: string | number;
  heartRate?: string | number;
  respiratoryRate?: string | number;
  bloodPressure?: string;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  oxygenSaturation?: string | number;
  painLevel?: number;
}

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  route: string;
}

interface SmartTemplatesProps {
  patientId: string;
  patientName: string;
  vitals: Vital[];
  medications: Medication[];
  problems?: any[];
  allergies?: any[];
  onSaveNote?: (note: any) => void;
}

// Smart phrase templates
const smartPhrases: Record<string, { label: string, template: string }> = {
  ".ros": {
    label: "Review of Systems",
    template: `REVIEW OF SYSTEMS:\n\nGENERAL: No fever, chills, fatigue, or weight changes.\nHEENT: No headache, vision changes, hearing loss, nasal congestion, or sore throat.\nCARDIOVASCULAR: No chest pain, palpitations, or peripheral edema.\nRESPIRATORY: No shortness of breath, cough, wheezing, or hemoptysis.\nGASTROINTESTINAL: No abdominal pain, nausea, vomiting, diarrhea, constipation, or melena.\nGENITOURINARY: No dysuria, frequency, urgency, hematuria, or flank pain.\nMUSCULOSKELETAL: No joint pain, stiffness, swelling, or muscle weakness.\nSKIN: No rash, itching, or lesions.\nNEUROLOGIC: No headache, dizziness, syncope, weakness, numbness, or tingling.\nPSYCHIATRIC: No depression, anxiety, or mood changes.\nENDOCRINE: No polyuria, polydipsia, or heat/cold intolerance.\nHEMATOLOGIC: No easy bruising, bleeding, or enlarged lymph nodes.\nALLERGIC/IMMUNOLOGIC: No recurrent infections or environmental allergies.`
  },
  ".pe": {
    label: "Physical Examination",
    template: `PHYSICAL EXAMINATION:\n\nGENERAL: Alert and oriented, in no acute distress.\nVITAL SIGNS: [vitals]\nHEENT: Normocephalic, atraumatic. Pupils equal, round, reactive to light. Oropharynx clear.\nNECK: Supple, no lymphadenopathy or thyromegaly.\nCARDIOVASCULAR: Regular rate and rhythm, normal S1 and S2, no murmurs, rubs, or gallops.\nRESPIRATORY: Clear to auscultation bilaterally, no wheezes, rales, or rhonchi.\nABDOMEN: Soft, non-tender, non-distended, normal bowel sounds, no organomegaly.\nEXTREMITIES: No edema, cyanosis, or clubbing. Pulses intact.\nSKIN: No rashes, lesions, or abnormal pigmentation.\nNEUROLOGIC: Cranial nerves II-XII intact. Motor strength 5/5 in all extremities. Sensory intact.`
  },
  ".hpi": {
    label: "History of Present Illness",
    template: `HISTORY OF PRESENT ILLNESS:\n\n[Patient Name] is a [Age]-year-old [Gender] presenting with [chief complaint] for [duration]. The symptoms began [onset - sudden/gradual] and are described as [description]. The symptoms are [better/worse/unchanged] with [factors]. Associated symptoms include [associated symptoms]. The patient [has/has not] experienced similar symptoms in the past. The patient [has/has not] tried any home remedies or medications for these symptoms.`
  },
  ".plan": {
    label: "Assessment and Plan",
    template: `ASSESSMENT AND PLAN:\n\n1. [Problem 1]:\n   - Assessment: \n   - Plan: \n\n2. [Problem 2]:\n   - Assessment: \n   - Plan: \n\n3. [Problem 3]:\n   - Assessment: \n   - Plan: \n\nDISPOSITION: [disposition]\nFOLLOW-UP: [follow-up instructions]`
  },
  ".meds": {
    label: "Current Medications",
    template: `CURRENT MEDICATIONS:\n\n[medications]`
  },
  ".vitals": {
    label: "Recent Vitals",
    template: `VITAL SIGNS:\n\n[vitals]`
  },
  ".soap": {
    label: "SOAP Note Structure",
    template: `SUBJECTIVE:\n[reason for visit and patient's description of symptoms]\n\nOBJECTIVE:\nVital Signs: [vitals]\nPhysical Examination:\n[physical examination findings]\n\nASSESSMENT:\n[assessment of patient's condition]\n\nPLAN:\n[treatment plan]`
  },
  ".meds": {
    label: "Current Medications",
    template: `CURRENT MEDICATIONS:\n\n[medications]`
  },
  ".allergies": {
    label: "Allergies",
    template: `ALLERGIES:\n\n[allergies]`
  }
};

export function SmartTemplates({
  patientId,
  patientName,
  vitals,
  medications,
  problems = [],
  allergies = [],
  onSaveNote
}: SmartTemplatesProps) {
  const [noteText, setNoteText] = useState("");
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showSOAPDialog, setShowSOAPDialog] = useState(false);
  const [showShortcutHelpDialog, setShowShortcutHelpDialog] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeTemplateTab, setActiveTemplateTab] = useState("templates");
  
  // Helper to format vitals
  const formatVitals = () => {
    if (vitals.length === 0) return "No recent vitals recorded.";
    
    const mostRecent = vitals.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];
    
    const temp = mostRecent.temperature || "--";
    const hr = mostRecent.heartRate || "--";
    const rr = mostRecent.respiratoryRate || "--";
    
    let bp = "--/--";
    if (mostRecent.bloodPressure) {
      bp = mostRecent.bloodPressure;
    } else if (mostRecent.bloodPressureSystolic && mostRecent.bloodPressureDiastolic) {
      bp = `${mostRecent.bloodPressureSystolic}/${mostRecent.bloodPressureDiastolic}`;
    }
    
    const o2 = mostRecent.oxygenSaturation || "--";
    const pain = mostRecent.painLevel !== undefined ? mostRecent.painLevel : "--";
    
    return `Temperature: ${temp}°F, Heart Rate: ${hr} bpm, Respiratory Rate: ${rr} breaths/min, Blood Pressure: ${bp} mmHg, O2 Saturation: ${o2}%, Pain Level: ${pain}/10`;
  };
  
  // Helper to format medications
  const formatMedications = () => {
    if (medications.length === 0) return "No current medications.";
    
    return medications.map(med => 
      `- ${med.name} ${med.dosage} ${med.route} ${med.frequency}`
    ).join("\n");
  };
  
  // Helper to format allergies
  const formatAllergies = () => {
    if (!allergies || allergies.length === 0) return "No known allergies.";
    
    return allergies.map((allergy: any) => 
      `- ${allergy.allergen}: ${allergy.reaction || 'Unknown reaction'} (${allergy.severity || 'Unknown severity'})`
    ).join("\n");
  };
  
  // Helper to personalize templates
  const personalizeTemplate = (template: string) => {
    let result = template;
    
    // Replace patient info
    result = result.replace(/\[Patient Name\]/g, patientName);
    
    // Replace vitals
    result = result.replace(/\[vitals\]/g, formatVitals());
    
    // Replace medications
    result = result.replace(/\[medications\]/g, formatMedications());
    
    // Replace allergies
    result = result.replace(/\[allergies\]/g, formatAllergies());
    
    // Replace problems
    if (problems && problems.length > 0) {
      let problemList = "";
      problems.forEach((problem, index) => {
        result = result.replace(new RegExp(`\\[Problem ${index + 1}\\]`, 'g'), problem.problem);
        problemList += `${index + 1}. ${problem.problem} (${problem.icd10})\n`;
      });
      result = result.replace(/\[problems\]/g, problemList);
    }
    
    return result;
  };
  
  // Handle input changes and detect smart phrases
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNoteText(value);
    
    // Save current cursor position
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };
  
  // Check for smart phrases on key press
  const handleKeyDown = (e: React.KeyDownEvent<HTMLTextAreaElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      const text = noteText;
      const curPos = textareaRef.current?.selectionStart || 0;
      
      // Find the word before cursor
      const beforeCursor = text.substring(0, curPos);
      const words = beforeCursor.split(/\s/);
      const lastWord = words[words.length - 1];
      
      // Check if it's a smart phrase
      if (smartPhrases[lastWord]) {
        e.preventDefault();
        
        // Replace the smart phrase with the template
        const template = personalizeTemplate(smartPhrases[lastWord].template);
        const newText = beforeCursor.substring(0, beforeCursor.length - lastWord.length) + 
                        template + 
                        text.substring(curPos);
        
        setNoteText(newText);
        
        // Set cursor position after the inserted template
        setTimeout(() => {
          if (textareaRef.current) {
            const newPosition = beforeCursor.length - lastWord.length + template.length;
            textareaRef.current.selectionStart = newPosition;
            textareaRef.current.selectionEnd = newPosition;
            textareaRef.current.focus();
            setCursorPosition(newPosition);
          }
        }, 0);
        
        // Show toast notification
        toast.success(`Inserted "${smartPhrases[lastWord].label}" template`);
      }
    }
  };
  
  // Insert template at cursor position
  const insertTemplate = (template: string) => {
    if (!textareaRef.current) return;
    
    const personalizedTemplate = personalizeTemplate(template);
    const startPos = textareaRef.current.selectionStart;
    const endPos = textareaRef.current.selectionEnd;
    
    const textBefore = noteText.substring(0, startPos);
    const textAfter = noteText.substring(endPos);
    
    const newText = textBefore + personalizedTemplate + textAfter;
    setNoteText(newText);
    
    // Close dialog
    setShowTemplateDialog(false);
    
    // Set cursor position after the inserted template
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = startPos + personalizedTemplate.length;
        textareaRef.current.selectionStart = newPosition;
        textareaRef.current.selectionEnd = newPosition;
        textareaRef.current.focus();
        setCursorPosition(newPosition);
      }
    }, 0);
  };
  
  // Insert SOAP note template
  const insertSOAPTemplate = () => {
    // Create a complete SOAP note with all sections
    const soapTemplate = personalizeTemplate(smartPhrases[".soap"].template);
    setNoteText(soapTemplate);
    setNoteTitle("SOAP Note - " + new Date().toLocaleDateString());
    setShowSOAPDialog(false);
    
    // Focus textarea and place cursor at the right position
    setTimeout(() => {
      if (textareaRef.current) {
        // Find the position after "SUBJECTIVE:\n"
        const pos = soapTemplate.indexOf("SUBJECTIVE:\n") + "SUBJECTIVE:\n".length;
        textareaRef.current.selectionStart = pos;
        textareaRef.current.selectionEnd = pos;
        textareaRef.current.focus();
        setCursorPosition(pos);
      }
    }, 0);
  };
  
  // Save the completed note
  const saveNote = () => {
    if (!noteTitle) {
      toast.error("Please enter a title for this note");
      return;
    }
    
    if (!noteText || noteText.trim().length === 0) {
      toast.error("Note cannot be empty");
      return;
    }
    
    const note = {
      id: `note_${Date.now()}`,
      title: noteTitle,
      content: noteText,
      timestamp: new Date().toISOString(),
      patientId,
      authorType: "physician" // or nurse, depending on the user role
    };
    
    onSaveNote?.(note);
    toast.success("Note saved successfully");
    setNoteText("");
    setNoteTitle("");
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Clinical Documentation
            </CardTitle>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8"
                      onClick={() => setShowShortcutHelpDialog(true)}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Smart Phrases Help</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={() => setShowTemplateDialog(true)}
              >
                <ListPlus className="h-4 w-4 mr-1" />
                Insert Template
              </Button>
              
              <Button 
                variant="default" 
                size="sm" 
                className="h-8 bg-[#7b9d8f] hover:bg-[#c1632f]"
                onClick={() => setShowSOAPDialog(true)}
              >
                <ClipboardCheck className="h-4 w-4 mr-1" />
                1-Click SOAP Note
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Note Title"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="font-medium"
              />
            </div>
            
            <div className="space-y-2">
              <Textarea
                ref={textareaRef}
                placeholder="Start typing your note here...
Tip: Use .phrases like .ros or .pe to quickly insert templates."
                value={noteText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="min-h-[300px] font-mono text-sm"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Type <span className="font-mono bg-slate-100 px-1 rounded">.phrase</span> followed by space to expand templates
              </div>
              <Button 
                onClick={saveNote}
                className="bg-[#7b9d8f] hover:bg-[#c1632f]"
              >
                <SaveIcon className="h-4 w-4 mr-1" />
                Save Note
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Template insertion dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Insert Template</DialogTitle>
          </DialogHeader>
          
          <Tabs value={activeTemplateTab} onValueChange={setActiveTemplateTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="templates">Quick Templates</TabsTrigger>
              <TabsTrigger value="sections">Note Sections</TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates" className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-2 flex flex-col items-start"
                  onClick={() => insertTemplate(smartPhrases[".vitals"].template)}
                >
                  <span className="font-medium">Recent Vitals</span>
                  <span className="text-xs text-slate-500">Insert current vitals summary</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-2 flex flex-col items-start"
                  onClick={() => insertTemplate(smartPhrases[".meds"].template)}
                >
                  <span className="font-medium">Medications</span>
                  <span className="text-xs text-slate-500">Insert current medication list</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-2 flex flex-col items-start"
                  onClick={() => insertTemplate(smartPhrases[".allergies"].template)}
                >
                  <span className="font-medium">Allergies</span>
                  <span className="text-xs text-slate-500">Insert allergies and reactions</span>
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="sections" className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-2 flex flex-col items-start"
                  onClick={() => insertTemplate(smartPhrases[".hpi"].template)}
                >
                  <span className="font-medium">History of Present Illness</span>
                  <span className="text-xs text-slate-500">Standard HPI template</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-2 flex flex-col items-start"
                  onClick={() => insertTemplate(smartPhrases[".pe"].template)}
                >
                  <span className="font-medium">Physical Examination</span>
                  <span className="text-xs text-slate-500">Complete physical exam template</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-2 flex flex-col items-start"
                  onClick={() => insertTemplate(smartPhrases[".ros"].template)}
                >
                  <span className="font-medium">Review of Systems</span>
                  <span className="text-xs text-slate-500">Comprehensive ROS template</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-2 flex flex-col items-start"
                  onClick={() => insertTemplate(smartPhrases[".plan"].template)}
                >
                  <span className="font-medium">Assessment & Plan</span>
                  <span className="text-xs text-slate-500">Problem-based A/P format</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplateDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* SOAP Note dialog */}
      <Dialog open={showSOAPDialog} onOpenChange={setShowSOAPDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate SOAP Note</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-md text-sm flex gap-2">
              <Info className="text-blue-500 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-800 mb-1">Quick SOAP Note Generator</p>
                <p className="text-blue-700">This will create a new note with the SOAP format pre-filled with patient information. You'll need to complete the subjective and assessment sections.</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Note Title</label>
              <Input
                placeholder="SOAP Note - Chief Complaint"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSOAPDialog(false)}>
              Cancel
            </Button>
            <Button onClick={insertSOAPTemplate}>
              Generate SOAP Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Smart Phrases Help Dialog */}
      <Dialog open={showShortcutHelpDialog} onOpenChange={setShowShortcutHelpDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Smart Phrases Quick Reference</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Type any of these phrases followed by a space to automatically expand the template:
            </p>
            
            <div className="max-h-[300px] overflow-y-auto pr-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-medium">Phrase</th>
                    <th className="text-left py-2 px-2 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(smartPhrases).map(([phrase, { label }]) => (
                    <tr key={phrase} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-2 px-2 font-mono">{phrase}</td>
                      <td className="py-2 px-2">{label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-amber-50 p-3 rounded-md text-sm flex gap-2">
              <Info className="text-amber-500 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium text-amber-800">Pro Tip</p>
                <p className="text-amber-700">Custom smart phrases can be added by your system administrator. Contact IT support to request additions.</p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowShortcutHelpDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
