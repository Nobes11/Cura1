import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Printer, Clock, User, FileClock } from 'lucide-react';
import { CompletedDocumentation, TemplateType } from '../utils/documentationStore';

interface DocumentationViewerProps {
  documentation: CompletedDocumentation;
  onClose: () => void;
}

export const DocumentationViewer: React.FC<DocumentationViewerProps> = ({
  documentation,
  onClose
}) => {
  // Helper to get template type name
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

  // Handle print
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const content = documentation.content.generatedNote || 'No content available';
      printWindow.document.write(`
        <html>
          <head>
            <title>Documentation - ${getTemplateTypeName(documentation.templateType)}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1 { font-size: 18px; color: #333; }
              .metadata { font-size: 12px; color: #666; margin-bottom: 20px; }
              .content { white-space: pre-wrap; line-height: 1.5; }
            </style>
          </head>
          <body>
            <h1>${getTemplateTypeName(documentation.templateType)} Documentation</h1>
            <div class="metadata">
              <p>Created by: ${documentation.createdBy} | Date: ${formatDate(documentation.createdAt)}</p>
            </div>
            <div class="content">${content}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Clinical Documentation</CardTitle>
            <CardDescription>
              {getTemplateTypeName(documentation.templateType)}
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {getTemplateTypeName(documentation.templateType)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>Created by: {documentation.createdBy}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>Created: {formatDate(documentation.createdAt)}</span>
          </div>
          {documentation.updatedBy && (
            <div className="flex items-center">
              <FileClock className="h-4 w-4 mr-1" />
              <span>Updated: {formatDate(documentation.updatedAt)} by {documentation.updatedBy}</span>
            </div>
          )}
        </div>
        
        <Separator />
        
        {documentation.templateType === TemplateType.REVIEW_OF_SYSTEMS && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg mb-2">Documentation Note</h3>
              <div className="p-4 border rounded-md bg-slate-50 whitespace-pre-wrap">
                {documentation.content.generatedNote || 'No generated note available'}
              </div>
            </div>
            
            {documentation.content.additionalNotes && (
              <div>
                <h3 className="font-medium text-lg mb-2">Additional Notes</h3>
                <div className="p-4 border rounded-md">
                  {documentation.content.additionalNotes}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Implement other template type views as needed */}
        {(documentation.templateType !== TemplateType.REVIEW_OF_SYSTEMS) && (
          <div className="p-4 border rounded-md">
            <p className="text-center text-gray-500">Content preview not available for this template type</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
      </CardFooter>
    </Card>
  );
};
