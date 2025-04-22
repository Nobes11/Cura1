import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pill, Clock, AlertTriangle, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  status: string;
  prescribedDate: string;
  completedDate?: string;
  lastAdministered?: string;
  nextDue?: string;
  prescribedBy?: string;
  notes?: string;
}

export interface MedicationInteraction {
  id: string;
  medications: string[];
  severity: 'low' | 'moderate' | 'severe';
  description: string;
  recommendation: string;
}

export interface HomeMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
}

interface EnhancedMedicationManagementProps {
  activeMedications: Medication[];
  completedMedications: Medication[];
  homeMedications: HomeMedication[];
  interactions: MedicationInteraction[];
  onNewMedication: () => void;
  onReconciliation: () => void;
}

export const EnhancedMedicationManagement: React.FC<EnhancedMedicationManagementProps> = ({
  activeMedications,
  completedMedications,
  homeMedications,
  interactions,
  onNewMedication,
  onReconciliation
}) => {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [interactionsOpen, setInteractionsOpen] = useState(false);
  
  // Format date from timestamp
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  // Format time from timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get next due indicator
  const getNextDueIndicator = (medication: Medication) => {
    if (!medication.nextDue) return null;
    
    const nextDue = new Date(medication.nextDue);
    const now = new Date();
    const hoursDiff = (nextDue.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff < 0) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300 ml-1">
          Overdue
        </Badge>
      );
    } else if (hoursDiff < 1) {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-300 ml-1">
          Due Soon
        </Badge>
      );
    } else if (hoursDiff < 2) {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-300 ml-1">
          In {Math.round(hoursDiff)} hour
        </Badge>
      );
    }
    
    return null;
  };
  
  // Check if medication has interactions
  const medicationHasInteraction = (medId: string) => {
    return interactions.some(interaction => 
      interaction.medications.includes(medId)
    );
  };
  
  // Get medication interactions for a specific medication
  const getMedicationInteractions = (medId: string) => {
    return interactions.filter(interaction => 
      interaction.medications.includes(medId)
    );
  };
  
  // Handle interaction warning click
  const handleInteractionWarningClick = (medication: Medication) => {
    setSelectedMedication(medication);
    setInteractionsOpen(true);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Medications</h2>
        <div className="flex gap-2">
          <Button onClick={onReconciliation}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Med Reconciliation
          </Button>
          <Button onClick={onNewMedication}>
            <Pill className="h-4 w-4 mr-1" />
            New Medication
          </Button>
        </div>
      </div>
      
      {/* Medication Interactions Alert */}
      {interactions.length > 0 && (
        <Card className="mb-4 border-l-4 border-amber-500">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">
                  {interactions.length} medication interaction{interactions.length > 1 ? 's' : ''} detected
                </p>
                <p className="text-sm text-slate-600">
                  {interactions.some(i => i.severity === 'severe') ? 
                    'Warning: Some interactions require immediate attention' : 
                    'Review interactions before administering medications'}
                </p>
                <Button 
                  variant="link" 
                  className="px-0 h-auto text-amber-600 hover:text-amber-800"
                  onClick={() => setInteractionsOpen(true)}
                >
                  View all interactions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="px-4 pt-0 pb-3 border-b w-full justify-start overflow-x-auto">
            <TabsTrigger value="active" className="rounded-sm">
              Active Medications
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-sm">
              Completed Medications
            </TabsTrigger>
            <TabsTrigger value="home" className="rounded-sm">
              Home Medications
            </TabsTrigger>
          </TabsList>
          
          {/* Active Medications Tab */}
          <TabsContent value="active" className="p-4">
            {activeMedications.length > 0 ? (
              <div className="divide-y">
                {activeMedications.map((med) => (
                  <div key={med.id} className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{med.name}</h3>
                        <Badge className="ml-2 bg-green-100 text-green-800 border-green-300">
                          {med.status}
                        </Badge>
                        {getNextDueIndicator(med)}
                        {medicationHasInteraction(med.id) && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="ml-1 h-6 px-1 text-amber-600"
                            onClick={() => handleInteractionWarningClick(med)}
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">
                        {med.dosage} {med.route} {med.frequency}
                      </p>
                      {med.lastAdministered && (
                        <p className="text-xs text-slate-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Last given: {formatDate(med.lastAdministered)} {formatTime(med.lastAdministered)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedMedication(med);
                          setDetailsOpen(true);
                        }}
                      >
                        Details
                      </Button>
                      {med.nextDue && (
                        <Button size="sm">
                          Administer
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                No active medications
              </div>
            )}
          </TabsContent>
          
          {/* Completed Medications Tab */}
          <TabsContent value="completed" className="p-4">
            {completedMedications.length > 0 ? (
              <div className="divide-y">
                {completedMedications.map((med) => (
                  <div key={med.id} className="py-3 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{med.name}</h3>
                        <Badge className="ml-2 bg-slate-100 text-slate-800 border-slate-300">
                          {med.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500">
                        {med.dosage} {med.route} {med.frequency}
                      </p>
                      {med.completedDate && (
                        <p className="text-xs text-slate-500 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          Completed: {formatDate(med.completedDate)} {formatTime(med.completedDate)}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedMedication(med);
                          setDetailsOpen(true);
                        }}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                No completed medications
              </div>
            )}
          </TabsContent>
          
          {/* Home Medications Tab */}
          <TabsContent value="home" className="p-4">
            {homeMedications.length > 0 ? (
              <div>
                <div className="mb-3 flex items-center">
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-sm text-amber-700">
                    Please verify these medications with the patient/caregiver during reconciliation
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Route</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead className="text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {homeMedications.map((med) => (
                        <TableRow key={med.id}>
                          <TableCell className="font-medium">{med.name}</TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.route}</TableCell>
                          <TableCell>{med.frequency}</TableCell>
                          <TableCell className="text-right">
                            {medicationHasInteraction(med.id) && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="ml-1 h-8 px-2 text-amber-600"
                                onClick={() => {
                                  const activeMed = activeMedications.find(m => m.id === med.id) ||
                                    // Converting home med to active med format for interaction dialog
                                    {
                                      ...med,
                                      status: 'Home',
                                      prescribedDate: new Date().toISOString()
                                    };
                                  handleInteractionWarningClick(activeMed as Medication);
                                }}
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Interaction
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                No home medications recorded
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Medication Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Medication Details</DialogTitle>
          </DialogHeader>
          
          {selectedMedication && (
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-500">Medication</p>
                  <p className="font-medium">{selectedMedication.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Status</p>
                  <Badge 
                    className={`${selectedMedication.status === "Active" ? "bg-green-100 text-green-800 border-green-300" : "bg-slate-100 text-slate-800 border-slate-300"}`}
                  >
                    {selectedMedication.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Dosage</p>
                  <p className="font-medium">{selectedMedication.dosage}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Route</p>
                  <p className="font-medium">{selectedMedication.route}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Frequency</p>
                  <p className="font-medium">{selectedMedication.frequency}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Prescribed</p>
                  <p className="font-medium">
                    {formatDate(selectedMedication.prescribedDate)} {formatTime(selectedMedication.prescribedDate)}
                  </p>
                </div>
                {selectedMedication.prescribedBy && (
                  <div>
                    <p className="text-sm text-slate-500">Prescribed By</p>
                    <p className="font-medium">{selectedMedication.prescribedBy}</p>
                  </div>
                )}
                {selectedMedication.lastAdministered && (
                  <div>
                    <p className="text-sm text-slate-500">Last Administered</p>
                    <p className="font-medium">
                      {formatDate(selectedMedication.lastAdministered)} {formatTime(selectedMedication.lastAdministered)}
                    </p>
                  </div>
                )}
                {selectedMedication.nextDue && (
                  <div>
                    <p className="text-sm text-slate-500">Next Due</p>
                    <p className="font-medium flex items-center">
                      {formatDate(selectedMedication.nextDue)} {formatTime(selectedMedication.nextDue)}
                      {getNextDueIndicator(selectedMedication)}
                    </p>
                  </div>
                )}
                {selectedMedication.completedDate && (
                  <div>
                    <p className="text-sm text-slate-500">Completed</p>
                    <p className="font-medium">
                      {formatDate(selectedMedication.completedDate)} {formatTime(selectedMedication.completedDate)}
                    </p>
                  </div>
                )}
              </div>
              
              {selectedMedication.notes && (
                <div className="mb-4">
                  <p className="text-sm text-slate-500">Notes</p>
                  <p className="p-2 bg-slate-50 rounded-md mt-1">{selectedMedication.notes}</p>
                </div>
              )}
              
              {medicationHasInteraction(selectedMedication.id) && (
                <div className="mt-4">
                  <p className="font-medium text-amber-700 flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Medication Interactions
                  </p>
                  <div className="divide-y border rounded-md">
                    {getMedicationInteractions(selectedMedication.id).map(interaction => (
                      <div key={interaction.id} className="p-3">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">
                            {interaction.severity === 'severe' ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : interaction.severity === 'moderate' ? (
                              <AlertTriangle className="h-5 w-5 text-amber-500" />
                            ) : (
                              <AlertCircle className="h-5 w-5 text-blue-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">
                              Interaction with {interaction.medications
                                .filter(m => m !== selectedMedication.id)
                                .map(m => {
                                  const med = [...activeMedications, ...completedMedications, ...homeMedications]
                                    .find(med => med.id === m);
                                  return med ? med.name : m;
                                })
                                .join(', ')}
                            </p>
                            <Badge 
                              className={`mt-1 ${interaction.severity === 'severe' ? 'bg-red-100 text-red-800 border-red-300' : 
                                interaction.severity === 'moderate' ? 'bg-amber-100 text-amber-800 border-amber-300' : 
                                'bg-blue-100 text-blue-800 border-blue-300'}`}
                            >
                              {interaction.severity.charAt(0).toUpperCase() + interaction.severity.slice(1)} Severity
                            </Badge>
                            <p className="mt-2 text-sm">{interaction.description}</p>
                            <p className="mt-1 text-sm font-medium">Recommendation: {interaction.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* All Interactions Dialog */}
      <Dialog open={interactionsOpen} onOpenChange={setInteractionsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Medication Interactions</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            {interactions.length > 0 ? (
              <div className="space-y-4">
                {/* Group by severity */}
                {['severe', 'moderate', 'low'].map(severity => {
                  const filteredInteractions = interactions.filter(i => i.severity === severity);
                  if (filteredInteractions.length === 0) return null;
                  
                  return (
                    <div key={severity}>
                      <h3 className="font-medium mb-2">
                        {severity === 'severe' ? 'Severe' : severity === 'moderate' ? 'Moderate' : 'Low'} Interactions
                      </h3>
                      <div className="divide-y border rounded-md">
                        {filteredInteractions.map(interaction => (
                          <div key={interaction.id} className="p-3">
                            <div className="flex items-start gap-2">
                              <div className="mt-0.5">
                                {severity === 'severe' ? (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                ) : severity === 'moderate' ? (
                                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                                ) : (
                                  <AlertCircle className="h-5 w-5 text-blue-500" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  Interaction between {interaction.medications
                                    .map(m => {
                                      const med = [...activeMedications, ...completedMedications, ...homeMedications]
                                        .find(med => med.id === m);
                                      return med ? med.name : m;
                                    })
                                    .join(' and ')}
                                </p>
                                <p className="mt-2 text-sm">{interaction.description}</p>
                                <p className="mt-1 text-sm font-medium">Recommendation: {interaction.recommendation}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                No medication interactions detected
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
