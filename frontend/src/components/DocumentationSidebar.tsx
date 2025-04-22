import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Pencil } from "lucide-react";

interface Doc {
  id: string;
  type: string;
  department: string;
  specialty: string;
  provider: string;
  timestamp: string;
  title: string;
  content: string;
}

interface DocumentationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  document: Doc | null;
  formatDateTime: (dateString: string) => string;
}

export function DocumentationSidebar({ 
  isOpen, 
  onClose, 
  document, 
  formatDateTime 
}: DocumentationSidebarProps) {
  if (!document) return null;
  
  return (
    <div 
      className={`fixed top-0 right-0 h-screen w-96 bg-white border-l border-slate-200 shadow-lg transform transition-transform duration-300 ease-in-out overflow-y-auto z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center mb-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            <ChevronRight className="h-4 w-4" />
            <span className="ml-1">Close</span>
          </Button>
          <Button variant="outline" size="sm">
            <Pencil className="h-4 w-4" />
            <span className="ml-1">Edit</span>
          </Button>
        </div>
        <div>
          <h2 className="text-lg font-medium">{document.title}</h2>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <Badge variant="outline">{document.type}</Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">{document.department}</Badge>
            <span className="text-slate-500">{formatDateTime(document.timestamp)}</span>
          </div>
          <div className="mt-2 text-sm">
            <span className="font-medium">Author:</span> {document.provider}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="prose max-w-none whitespace-pre-line">
          {document.content}
        </div>
      </div>
    </div>
  );
}