import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Image, FileText, Download, RotateCw, ZoomIn, Grid2X2, MaximizeIcon, MinimizeIcon, PlusCircle } from 'lucide-react';

export interface DiagnosticImage {
  id: string;
  studyName: string;
  type: string;
  thumbnailUrl: string;
  imageUrl: string;
  acquisitionDate: string;
  status: 'completed' | 'pending' | 'in-progress';
  priority: 'routine' | 'stat' | 'urgent';
  orderedBy: string;
  report?: {
    findings: string;
    impression: string;
    readBy: string;
    readAt: string;
  };
  notes?: string;
  metadata?: {
    modality: string;
    bodyPart: string;
    numberOfImages: number;
    series?: string;
  };
}

interface PatientDiagnosticImagingProps {
  images: DiagnosticImage[];
}

export const PatientDiagnosticImaging: React.FC<PatientDiagnosticImagingProps> = ({ images }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedImage, setSelectedImage] = useState<DiagnosticImage | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Sort images by acquisitionDate, newest first
  const sortedImages = [...images].sort((a, b) => 
    new Date(b.acquisitionDate).getTime() - new Date(a.acquisitionDate).getTime()
  );
  
  // Filter images by modality
  const modalities = Array.from(new Set(images.map(img => img.metadata?.modality || '')));
  const filteredImages = activeTab === "all" ? sortedImages : 
    sortedImages.filter(img => img.metadata?.modality === activeTab);
  
  // Format date from timestamp
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  // Format time from timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">In Progress</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'stat':
        return <Badge className="bg-red-100 text-red-800 border-red-300">STAT</Badge>;
      case 'urgent':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Urgent</Badge>;
      case 'routine':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Routine</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  // Open image viewer
  const handleViewImage = (image: DiagnosticImage) => {
    setSelectedImage(image);
    setViewerOpen(true);
    setZoomLevel(100);
  };

  // Open image report
  const handleViewReport = (image: DiagnosticImage) => {
    setSelectedImage(image);
    setReportOpen(true);
  };

  // Toggle view mode between single and grid
  const toggleViewMode = () => {
    setViewMode(viewMode === 'single' ? 'grid' : 'single');
  };

  // Handle zoom
  const handleZoom = (increase: boolean) => {
    setZoomLevel(prev => {
      const newZoom = increase ? prev + 20 : prev - 20;
      return Math.max(50, Math.min(newZoom, 300)); // Limit zoom between 50% and 300%
    });
  };

  return (
    <div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Diagnostic Imaging</span>
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-1" />
              Order New Study
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="px-4 pt-0 pb-3 border-b w-full justify-start overflow-x-auto">
              <TabsTrigger value="all" className="rounded-sm">All Studies</TabsTrigger>
              {modalities.map(modality => (
                <TabsTrigger key={modality} value={modality} className="rounded-sm">{modality}</TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeTab} className="p-4">
              {filteredImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredImages.map(image => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="relative aspect-video bg-slate-50 overflow-hidden">
                        <img 
                          src={image.thumbnailUrl} 
                          alt={image.studyName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-1">
                          {getStatusBadge(image.status)}
                        </div>
                      </div>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-sm truncate">{image.studyName}</h3>
                        <div className="flex items-center justify-between mt-1">
                          <div className="text-xs text-slate-500">
                            {formatDate(image.acquisitionDate)} {formatTime(image.acquisitionDate)}
                          </div>
                          <div>{getPriorityBadge(image.priority)}</div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {image.metadata?.modality} • {image.metadata?.bodyPart}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 text-xs"
                            onClick={() => handleViewImage(image)}
                          >
                            <Image className="h-3 w-3 mr-1" />
                            View Image
                          </Button>
                          <Button 
                            variant={image.report ? "outline" : "ghost"} 
                            size="sm" 
                            className={`h-8 text-xs ${!image.report ? 'text-slate-400' : ''}`}
                            disabled={!image.report}
                            onClick={() => image.report && handleViewReport(image)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            {image.report ? 'View Report' : 'No Report'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-500">
                  No diagnostic imaging studies available
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Image Viewer Dialog */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 overflow-hidden">
          <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center">
                <DialogTitle className="text-white">
                  {selectedImage?.studyName}
                </DialogTitle>
                <span className="ml-2 text-sm text-slate-300">
                  {selectedImage?.metadata?.modality} • {selectedImage?.metadata?.bodyPart}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-white hover:text-white hover:bg-slate-700"
                  onClick={toggleViewMode}
                >
                  {viewMode === 'single' ? 
                    <Grid2X2 className="h-4 w-4" /> : 
                    <MaximizeIcon className="h-4 w-4" />
                  }
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-white hover:text-white hover:bg-slate-700"
                  onClick={() => handleZoom(false)}
                  disabled={zoomLevel <= 50}
                >
                  <MinimizeIcon className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-white hover:text-white hover:bg-slate-700"
                  onClick={() => handleZoom(true)}
                  disabled={zoomLevel >= 300}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-white hover:text-white hover:bg-slate-700"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-white hover:text-white hover:bg-slate-700"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Image Viewer Area */}
            <div className="flex-1 bg-slate-950 p-4 overflow-auto">
              <div 
                className={`flex ${viewMode === 'grid' ? 'flex-wrap justify-center gap-4' : 'justify-center items-center h-full'}`}
              >
                {viewMode === 'single' ? (
                  <div 
                    className="relative overflow-auto" 
                    style={{
                      maxHeight: 'calc(80vh - 8rem)',
                      maxWidth: '100%'
                    }}
                  >
                    <img 
                      src={selectedImage?.imageUrl} 
                      alt={selectedImage?.studyName}
                      style={{
                        transform: `scale(${zoomLevel/100})`,
                        transformOrigin: 'center',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  </div>
                ) : (
                  // Grid view - show multiple images from the same study
                  // For demo purposes, we'll just duplicate the same image to simulate a series
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className="w-1/2 p-2">
                      <img 
                        src={selectedImage?.imageUrl} 
                        alt={`${selectedImage?.studyName} - Series ${index + 1}`}
                        className="border border-slate-800 max-w-full h-auto"
                      />
                      <p className="text-xs text-center text-slate-400 mt-1">
                        Series {index + 1}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Footer with metadata */}
            <div className="p-3 bg-slate-900 text-slate-300 text-xs">
              <div className="flex justify-between">
                <span>{selectedImage ? formatDate(selectedImage.acquisitionDate) : ''}</span>
                <span>Zoom: {zoomLevel}%</span>
                <span>{selectedImage?.metadata?.numberOfImages} Images</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Report Dialog */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Imaging Report</DialogTitle>
            <DialogDescription>
              {selectedImage?.studyName} - {selectedImage ? formatDate(selectedImage.acquisitionDate) : ''}
            </DialogDescription>
          </DialogHeader>
          
          {selectedImage?.report && (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-500">Study</p>
                  <p className="font-medium">{selectedImage.studyName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="font-medium">
                    {formatDate(selectedImage.acquisitionDate)} {formatTime(selectedImage.acquisitionDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Modality</p>
                  <p className="font-medium">{selectedImage.metadata?.modality}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Body Part</p>
                  <p className="font-medium">{selectedImage.metadata?.bodyPart}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium text-slate-800 mb-2">Findings</h3>
                <div className="p-3 bg-slate-50 rounded-md">
                  {selectedImage.report.findings}
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-medium text-slate-800 mb-2">Impression</h3>
                <div className="p-3 bg-slate-50 rounded-md font-medium">
                  {selectedImage.report.impression}
                </div>
              </div>
              
              <div className="mt-6 text-sm text-slate-600">
                <p>Report prepared by {selectedImage.report.readBy}</p>
                <p>Read on {formatDate(selectedImage.report.readAt)} at {formatTime(selectedImage.report.readAt)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
