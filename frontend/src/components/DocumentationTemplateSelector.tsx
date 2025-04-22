import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDocumentationStore, Template, TemplateType } from '../utils/documentationStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, AlertCircle, Loader2 } from 'lucide-react';

interface DocumentationTemplateSelectorProps {
  patientId: string;
  encounterId: string;
  providerName: string;
  onSelectTemplate: (templateId: string) => void;
  onCancel: () => void;
}

export const DocumentationTemplateSelector: React.FC<DocumentationTemplateSelectorProps> = ({
  patientId,
  encounterId,
  providerName,
  onSelectTemplate,
  onCancel
}) => {
  const { templates, loadTemplates, isLoading, error } = useDocumentationStore();
  const [activeTab, setActiveTab] = useState<string>(TemplateType.REVIEW_OF_SYSTEMS);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // Filter templates by type
  const filteredTemplates = templates.filter(template => template.type === activeTab);

  // Helper to get template type name
  const getTemplateName = (type: string): string => {
    switch (type) {
      case TemplateType.REVIEW_OF_SYSTEMS:
        return 'Review of Systems';
      case TemplateType.CHIEF_COMPLAINT:
        return 'Chief Complaint';
      case TemplateType.PHYSICAL_EXAM:
        return 'Physical Exam';
      case TemplateType.ASSESSMENT_PLAN:
        return 'Assessment & Plan';
      default:
        return type;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Select Documentation Template</CardTitle>
        <CardDescription>Choose a template to document patient information</CardDescription>
      </CardHeader>
      
      <CardContent>
        {error ? (
          <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-800 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>Error loading templates: {error}</span>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value={TemplateType.REVIEW_OF_SYSTEMS}>Review of Systems</TabsTrigger>
              <TabsTrigger value={TemplateType.CHIEF_COMPLAINT}>Chief Complaint</TabsTrigger>
              <TabsTrigger value={TemplateType.PHYSICAL_EXAM}>Physical Exam</TabsTrigger>
              <TabsTrigger value={TemplateType.ASSESSMENT_PLAN}>Assessment & Plan</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-500">Loading templates...</span>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No {getTemplateName(activeTab)} templates available</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredTemplates.map((template) => (
                  <div 
                    key={template.id} 
                    className="border rounded-md p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                    onClick={() => onSelectTemplate(template.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-lg">{template.name}</h3>
                    </div>
                    {template.description && (
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Tabs>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};
