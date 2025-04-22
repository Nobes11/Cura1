import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pill, Syringe, Droplet, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Patient } from '../utils/mockData';

interface MedicationStatusIndicatorProps {
  patient: Patient;
  onAdminister?: (medicationType: string, medicationId: string) => void;
}

type MedicationType = 'oral' | 'iv' | 'injection' | 'blood';

export const MedicationStatusIndicator: React.FC<MedicationStatusIndicatorProps> = ({ 
  patient,
  onAdminister 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedType, setSelectedType] = useState<MedicationType | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdministerDialog, setShowAdministerDialog] = useState(false);
  
  // Check if any medication orders exist
  const hasOralMeds = patient.medicationOrders?.oral && patient.medicationOrders.oral.length > 0;
  const hasIvMeds = patient.medicationOrders?.iv && patient.medicationOrders.iv.length > 0;
  const hasInjections = patient.medicationOrders?.injection && patient.medicationOrders.injection.length > 0;
  const hasBloodProducts = patient.medicationOrders?.blood && patient.medicationOrders.blood.length > 0;
  
  // Count meds that need to be administered
  const pendingOralMeds = patient.medicationOrders?.oral?.filter(med => med.status === 'Ordered').length || 0;
  const pendingIvMeds = patient.medicationOrders?.iv?.filter(med => med.status === 'Ordered').length || 0;
  const pendingInjections = patient.medicationOrders?.injection?.filter(med => med.status === 'Ordered').length || 0;
  const pendingBloodProducts = patient.medicationOrders?.blood?.filter(med => med.status === 'Ordered').length || 0;
  
  const handleClick = () => {
    setShowDetails(true);
  };
  
  const handleDoubleClick = (type: MedicationType, id: string) => {
    setSelectedType(type);
    setSelectedId(id);
    setShowAdministerDialog(true);
  };
  
  const handleAdminister = () => {
    if (selectedType && selectedId && onAdminister) {
      onAdminister(selectedType, selectedId);
      setShowAdministerDialog(false);
      
      // Show success toast
      toast.success("Medication administered", {
        description: "Updated patient's medication status"
      });
    }
  };
  
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  return (
    <>
      <div className="flex gap-1">
        {hasOralMeds && (
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div 
                  className={`cursor-pointer rounded-full h-6 w-6 flex items-center justify-center ${pendingOralMeds > 0 ? 'bg-amber-100' : 'bg-green-100'}`}
                  onClick={handleClick}
                >
                  <Pill className={`h-4 w-4 ${pendingOralMeds > 0 ? 'text-amber-700' : 'text-green-700'}`} />
                  {pendingOralMeds > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {pendingOralMeds}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{pendingOralMeds} pending oral medications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {hasIvMeds && (
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div 
                  className={`cursor-pointer rounded-full h-6 w-6 flex items-center justify-center ${pendingIvMeds > 0 ? 'bg-blue-100' : 'bg-green-100'}`}
                  onClick={handleClick}
                >
                  <Droplet className={`h-4 w-4 ${pendingIvMeds > 0 ? 'text-blue-700' : 'text-green-700'}`} />
                  {pendingIvMeds > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {pendingIvMeds}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{pendingIvMeds} pending IV medications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {hasInjections && (
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div 
                  className={`cursor-pointer rounded-full h-6 w-6 flex items-center justify-center ${pendingInjections > 0 ? 'bg-purple-100' : 'bg-green-100'}`}
                  onClick={handleClick}
                >
                  <Syringe className={`h-4 w-4 ${pendingInjections > 0 ? 'text-purple-700' : 'text-green-700'}`} />
                  {pendingInjections > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {pendingInjections}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{pendingInjections} pending injections</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        
        {hasBloodProducts && (
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger asChild>
                <div 
                  className={`cursor-pointer rounded-full h-6 w-6 flex items-center justify-center ${pendingBloodProducts > 0 ? 'bg-red-100' : 'bg-green-100'}`}
                  onClick={handleClick}
                >
                  <Heart className={`h-4 w-4 ${pendingBloodProducts > 0 ? 'text-red-700' : 'text-green-700'}`} />
                  {pendingBloodProducts > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {pendingBloodProducts}
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{pendingBloodProducts} pending blood products</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      {/* Medication details dialog */}
      {showDetails && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Medication Orders for {patient.name}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-2">
              {hasOralMeds && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Oral Medications</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dose</TableHead>
                        <TableHead>Ordered</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.medicationOrders?.oral?.map((med) => (
                        <TableRow key={med.id}>
                          <TableCell>{med.name}</TableCell>
                          <TableCell>{med.dose} {med.route}</TableCell>
                          <TableCell>{formatDateTime(med.ordered)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={med.status === 'Administered' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-amber-100 text-amber-800 border-amber-300'}
                            >
                              {med.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {med.status === 'Ordered' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs"
                                onClick={() => handleDoubleClick('oral', med.id)}
                              >
                                Administer
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {hasIvMeds && (
                <div>
                  <h3 className="text-lg font-medium mb-2">IV Medications</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dose</TableHead>
                        <TableHead>Ordered</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.medicationOrders?.iv?.map((med) => (
                        <TableRow key={med.id}>
                          <TableCell>{med.name}</TableCell>
                          <TableCell>{med.dose} {med.route}</TableCell>
                          <TableCell>{formatDateTime(med.ordered)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={med.status === 'Administered' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-blue-100 text-blue-800 border-blue-300'}
                            >
                              {med.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {med.status === 'Ordered' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs"
                                onClick={() => handleDoubleClick('iv', med.id)}
                              >
                                Administer
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {hasInjections && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Injections</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dose</TableHead>
                        <TableHead>Ordered</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.medicationOrders?.injection?.map((med) => (
                        <TableRow key={med.id}>
                          <TableCell>{med.name}</TableCell>
                          <TableCell>{med.dose} {med.route}</TableCell>
                          <TableCell>{formatDateTime(med.ordered)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={med.status === 'Administered' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-purple-100 text-purple-800 border-purple-300'}
                            >
                              {med.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {med.status === 'Ordered' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs"
                                onClick={() => handleDoubleClick('injection', med.id)}
                              >
                                Administer
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {hasBloodProducts && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Blood Products</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Volume</TableHead>
                        <TableHead>Ordered</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.medicationOrders?.blood?.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.volume} {product.type}</TableCell>
                          <TableCell>{formatDateTime(product.ordered)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={product.status === 'Administered' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}
                            >
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {product.status === 'Ordered' && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs"
                                onClick={() => handleDoubleClick('blood', product.id)}
                              >
                                Administer
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              
              {!hasOralMeds && !hasIvMeds && !hasInjections && !hasBloodProducts && (
                <div className="p-4 text-center text-gray-500 italic">
                  No medication orders for this patient
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button onClick={() => setShowDetails(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Administer medication dialog */}
      {showAdministerDialog && (
        <Dialog open={showAdministerDialog} onOpenChange={setShowAdministerDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Administer Medication</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              <p>Are you sure you want to administer this medication?</p>
              <p className="text-sm text-gray-500">
                This action will update the medication status to "Administered" and record the current time and your user information.
              </p>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdministerDialog(false)}>Cancel</Button>
              <Button onClick={handleAdminister}>Confirm Administration</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
