import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, FileText, AlertCircle } from 'lucide-react';
import { useDocumentationStore, CompletedDocumentation, TemplateType } from '../utils/documentationStore';

interface DocumentationListProps {
  patientId: string;
  encounterId?: string;
  onViewDocumentation?: (documentation: CompletedDocumentation) => void;
  onNewDocumentation?: () => void;
}

export const DocumentationList: React.FC<DocumentationListProps> = ({
  patientId,
  encounterId,
  onViewDocumentation,
  onNewDocumentation
}) => {
  const { getDocumentationsForPatient, isLoading, error } = useDocumentationStore();
  const [documentations, setDocumentations] = useState<CompletedDocumentation[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    const loadDocumentations = async () => {
      if (patientId) {
        const docs = await getDocumentationsForPatient(patientId);
        setDocumentations(docs);
      }
    };

    loadDocumentations();
  }, [patientId, getDocumentationsForPatient]);

  // Filter documentations by tab
  const filteredDocumentations = activeTab === 'all' 
    ? documentations 
    : documentations.filter(doc => doc.templateType === activeTab);

  // Filter by encounterId if provided
  const encounterDocumentations = encounterId 
    ? filteredDocumentations.filter(doc => doc.encounterId === encounterId)
    : filteredDocumentations;

  // Sort by date descending
  const sortedDocumentations = [...encounterDocumentations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Get a readable name for template type
  const getTemplateTypeName = (type: TemplateType): string => {
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

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <span>Error loading documentation: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Clinical Documentation</CardTitle>
            <CardDescription>Patient's clinical documentation history</CardDescription>
          </div>
          {onNewDocumentation && (
            <Button onClick={onNewDocumentation} size="sm">
              <FileText className="h-4 w-4 mr-2" />
              New Documentation
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value={TemplateType.REVIEW_OF_SYSTEMS}>ROS</TabsTrigger>
            <TabsTrigger value={TemplateType.CHIEF_COMPLAINT}>Chief Complaint</TabsTrigger>
            <TabsTrigger value={TemplateType.PHYSICAL_EXAM}>Physical Exam</TabsTrigger>
            <TabsTrigger value={TemplateType.ASSESSMENT_PLAN}>Assessment & Plan</TabsTrigger>
          </TabsList>
          
          <div className="space-y-4">
            {isLoading ? (
              // Loading state
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-5 w-1/3 mb-2" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                  <Skeleton className="h-4 w-1/2 mb-3" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            ) : sortedDocumentations.length === 0 ? (
              // Empty state
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No {activeTab === 'all' ? '' : getTemplateTypeName(activeTab as TemplateType)} documentation found</p>
              </div>
            ) : (
              // Documentation list
              sortedDocumentations.map((doc) => (
                <div key={doc.id} className="border rounded-md p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{doc.content.generatedNote ? doc.content.generatedNote.substring(0, 50) + '...' : 'Documentation'}</h3>
                      <Badge variant="outline">{getTemplateTypeName(doc.templateType)}</Badge>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(doc.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Created by: {doc.createdBy}</p>
                  {onViewDocumentation && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => onViewDocumentation(doc)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};
