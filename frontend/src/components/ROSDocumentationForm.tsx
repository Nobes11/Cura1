import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useDocumentationStore, ROSTemplate, ROSSection, TemplateType } from '../utils/documentationStore';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface ROSDocumentationFormProps {
  templateId: string;
  patientId: string;
  encounterId: string;
  providerName: string;
  onSave: () => void;
  onCancel: () => void;
}

export const ROSDocumentationForm: React.FC<ROSDocumentationFormProps> = ({
  templateId,
  patientId,
  encounterId,
  providerName,
  onSave,
  onCancel
}) => {
  const { templates, saveDocumentation } = useDocumentationStore();
  const [template, setTemplate] = useState<ROSTemplate | null>(null);
  const [formData, setFormData] = useState<{ [sectionId: string]: { [findingId: string]: { normal: boolean, value?: string } } }>({});
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load template
  useEffect(() => {
    const selectedTemplate = templates.find(t => t.id === templateId) as ROSTemplate | undefined;
    if (selectedTemplate) {
      setTemplate(selectedTemplate);
      
      // Initialize form data
      const initialFormData: { [sectionId: string]: { [findingId: string]: { normal: boolean, value?: string } } } = {};
      selectedTemplate.sections.forEach(section => {
        initialFormData[section.id] = {};
        section.findings.forEach(finding => {
          initialFormData[section.id][finding.id] = { normal: finding.normal };
        });
      });
      setFormData(initialFormData);
    }
  }, [templateId, templates]);

  // Handle finding checkbox change
  const handleFindingChange = (sectionId: string, findingId: string, normal: boolean) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [findingId]: {
          ...prev[sectionId][findingId],
          normal
        }
      }
    }));
  };

  // Handle finding value change
  const handleFindingValueChange = (sectionId: string, findingId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        [findingId]: {
          ...prev[sectionId][findingId],
          value
        }
      }
    }));
  };

  // Generate ROS note from form data
  const generateROSNote = () => {
    if (!template) return '';
    
    const positiveFindings: string[] = [];
    const negativeFindings: string[] = [];
    
    template.sections.forEach(section => {
      const sectionPositive: string[] = [];
      const sectionNegative: string[] = [];
      
      section.findings.forEach(finding => {
        const findingData = formData[section.id]?.[finding.id];
        if (findingData) {
          if (!findingData.normal) {
            sectionPositive.push(finding.name + (findingData.value ? `: ${findingData.value}` : ''));
          } else {
            sectionNegative.push(finding.name);
          }
        }
      });
      
      if (sectionPositive.length > 0) {
        positiveFindings.push(`${section.name}: ${sectionPositive.join(', ')}`);
      }
      
      if (sectionNegative.length > 0 && sectionPositive.length === 0) {
        negativeFindings.push(section.name);
      }
    });
    
    let note = '';
    
    if (positiveFindings.length > 0) {
      note += `Positive findings: ${positiveFindings.join('. ')}. `;
    }
    
    if (negativeFindings.length > 0) {
      note += `Negative for: ${negativeFindings.join(', ')}.`;
    }
    
    if (additionalNotes) {
      note += `\n\nAdditional notes: ${additionalNotes}`;
    }
    
    return note;
  };

  // Handle save
  const handleSave = async () => {
    if (!template) return;
    
    setIsSaving(true);
    setErrorMessage(null);
    
    try {
      // Create documentation object
      await saveDocumentation({
        patientId,
        encounterId,
        templateId,
        templateType: TemplateType.REVIEW_OF_SYSTEMS,
        content: {
          formData,
          additionalNotes,
          generatedNote: generateROSNote()
        },
        createdBy: providerName,
        updatedBy: providerName
      });
      
      onSave();
    } catch (error) {
      console.error('Error saving ROS documentation:', error);
      setErrorMessage('Failed to save documentation. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Count abnormal findings
  const countAbnormalFindings = (section: ROSSection) => {
    let count = 0;
    section.findings.forEach(finding => {
      if (formData[section.id]?.[finding.id]?.normal === false) {
        count++;
      }
    });
    return count;
  };

  if (!template) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading template...
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Review of Systems</CardTitle>
        <CardDescription>
          Document positive and negative findings for each system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        
        <Accordion type="multiple" defaultValue={['constitutional']} className="w-full">
          {template.sections.map(section => {
            const abnormalCount = countAbnormalFindings(section);
            return (
              <AccordionItem key={section.id} value={section.id} className="border rounded-md px-4 mb-2">
                <AccordionTrigger className="hover:no-underline py-2">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="font-medium text-left">{section.name}</div>
                    {abnormalCount > 0 && (
                      <Badge variant="destructive" className="ml-2">
                        {abnormalCount} {abnormalCount === 1 ? 'abnormal finding' : 'abnormal findings'}
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 py-3">
                    {section.findings.map(finding => {
                      const isNormal = formData[section.id]?.[finding.id]?.normal;
                      return (
                        <div key={finding.id} className="flex flex-col space-y-1.5">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`${section.id}-${finding.id}`}
                              checked={isNormal}
                              onCheckedChange={(checked) => {
                                handleFindingChange(section.id, finding.id, checked === true);
                              }}
                            />
                            <label
                              htmlFor={`${section.id}-${finding.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {finding.name} {isNormal ? (
                                <span className="text-green-600 text-xs">(Normal)</span>
                              ) : (
                                <span className="text-red-600 text-xs">(Abnormal)</span>
                              )}
                            </label>
                          </div>
                          
                          {!isNormal && (
                            <Input
                              placeholder="Describe finding"
                              className="h-8 text-sm"
                              value={formData[section.id]?.[finding.id]?.value || ''}
                              onChange={(e) => handleFindingValueChange(section.id, finding.id, e.target.value)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        
        <div className="pt-4">
          <h3 className="text-sm font-medium mb-2">Additional Notes</h3>
          <Textarea 
            placeholder="Enter any additional notes or comments about the review of systems"
            className="min-h-[100px]"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />
        </div>
        
        <Card className="mt-6">
          <CardHeader className="py-3">
            <CardTitle className="text-base">Generated Documentation</CardTitle>
            <CardDescription>Preview of the documentation that will be saved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap border p-3 rounded-md bg-slate-50 text-sm">
              {generateROSNote() || 'No findings documented yet.'}
            </div>
          </CardContent>
        </Card>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Documentation'}
        </Button>
      </CardFooter>
    </Card>
  );
};