import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Patient } from '../utils/mockData';
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, ClipboardList, User, Stethoscope, Activity, PencilLine, X } from 'lucide-react';

interface TasksPanelProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
}

interface Task {
  id: string;
  patientId: string;
  patientName: string;
  type: 'medication' | 'consult' | 'order' | 'nursing';
  title: string;
  details?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'normal' | 'stat' | 'urgent';
  dueTime?: string;
  assignedTo?: string;
  orderedBy?: string;
  orderedTime: string;
}

export const TasksPanel: React.FC<TasksPanelProps> = ({ isOpen, onClose, patients }) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Generate mock tasks based on patient data
  const generateMockTasks = (): Task[] => {
    const tasks: Task[] = [];
    
    // Add tasks based on patient properties
    patients.forEach(patient => {
      // Skip discharged patients
      if (patient.status === 'discharged') return;
      
      // Add lab tasks
      if (patient.labsPending) {
        tasks.push({
          id: `lab-${patient.id}-${Date.now()}`,
          patientId: patient.id,
          patientName: patient.name,
          type: 'order',
          title: 'Complete Blood Count',
          details: 'Collect blood sample and send to lab',
          status: 'pending',
          priority: patient.priority === 'urgent' ? 'stat' : 'normal',
          orderedTime: patient.lastUpdated,
          orderedBy: 'System',
          dueTime: '30 minutes'
        });
        
        tasks.push({
          id: `lab-${patient.id}-${Date.now()+1}`,
          patientId: patient.id,
          patientName: patient.name,
          type: 'order',
          title: 'Basic Metabolic Panel',
          details: 'Collect blood sample and send to lab',
          status: 'pending',
          priority: patient.priority === 'urgent' ? 'stat' : 'normal',
          orderedTime: patient.lastUpdated,
          orderedBy: 'System',
          dueTime: '30 minutes'
        });
      }
      
      // Add imaging tasks
      if (patient.imagingPending) {
        tasks.push({
          id: `img-${patient.id}-${Date.now()}`,
          patientId: patient.id,
          patientName: patient.name,
          type: 'order',
          title: 'Chest X-Ray',
          details: 'Portable AP and lateral',
          status: 'pending',
          priority: patient.priority === 'urgent' ? 'stat' : 'normal',
          orderedTime: patient.lastUpdated,
          orderedBy: 'System',
          dueTime: '45 minutes'
        });
      }
      
      // Add consult tasks
      if (patient.consultPending) {
        tasks.push({
          id: `consult-${patient.id}-${Date.now()}`,
          patientId: patient.id,
          patientName: patient.name,
          type: 'consult',
          title: 'Cardiology Consult',
          details: 'Evaluate for chest pain and ECG changes',
          status: 'pending',
          priority: patient.priority === 'urgent' ? 'urgent' : 'normal',
          orderedTime: patient.lastUpdated,
          orderedBy: patient.assignedProvider || 'System',
          dueTime: '60 minutes'
        });
      }
      
      // Add medications for all non-waiting patients
      if (patient.status !== 'waiting') {
        tasks.push({
          id: `med-${patient.id}-${Date.now()}`,
          patientId: patient.id,
          patientName: patient.name,
          type: 'medication',
          title: 'Acetaminophen 650mg',
          details: 'PO q4h PRN pain or fever',
          status: 'pending',
          priority: 'normal',
          orderedTime: patient.lastUpdated,
          orderedBy: patient.assignedProvider || 'System',
          dueTime: 'PRN'
        });
      }
      
      // Add stroke protocol tasks
      if (patient.isStroke) {
        tasks.push({
          id: `stroke-${patient.id}-${Date.now()}`,
          patientId: patient.id,
          patientName: patient.name,
          type: 'nursing',
          title: 'Neurological Assessment',
          details: 'Complete NIH Stroke Scale',
          status: 'pending',
          priority: 'stat',
          orderedTime: patient.lastUpdated,
          orderedBy: 'Protocol',
          dueTime: 'ASAP'
        });
        
        tasks.push({
          id: `stroke-${patient.id}-${Date.now()+1}`,
          patientId: patient.id,
          patientName: patient.name,
          type: 'order',
          title: 'CT Brain without Contrast',
          details: 'STAT for stroke protocol',
          status: 'pending',
          priority: 'stat',
          orderedTime: patient.lastUpdated,
          orderedBy: 'Protocol',
          dueTime: 'ASAP'
        });
      }
      
      // Add sepsis protocol tasks
      if (patient.isSepsis) {
        tasks.push({
          id: `sepsis-${patient.id}-${Date.now()}`,
          patientId: patient.id,
          patientName: patient.name,
          type: 'medication',
          title: 'Broad Spectrum Antibiotics',
          details: 'Administer within 1 hour of arrival',
          status: 'pending',
          priority: 'stat',
          orderedTime: patient.lastUpdated,
          orderedBy: 'Protocol',
          dueTime: 'ASAP'
        });
        
        tasks.push({
          id: `sepsis-${patient.id}-${Date.now()+1}`,
          patientId: patient.id,
          patientName: patient.name,
          type: 'nursing',
          title: 'Fluid Resuscitation',
          details: '30ml/kg IV bolus',
          status: 'pending',
          priority: 'stat',
          orderedTime: patient.lastUpdated,
          orderedBy: 'Protocol',
          dueTime: 'ASAP'
        });
      }
      
      // Add nursing tasks for all patients
      tasks.push({
        id: `nurse-${patient.id}-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.name,
        type: 'nursing',
        title: 'Vital Signs',
        details: 'Complete set of vital signs',
        status: 'pending',
        priority: patient.priority === 'urgent' ? 'stat' : 'normal',
        orderedTime: patient.lastUpdated,
        orderedBy: 'Protocol',
        dueTime: patient.priority === 'urgent' ? '15 minutes' : '1 hour'
      });
    });
    
    return tasks;
  };
  
  const allTasks = generateMockTasks();
  
  // Filter tasks based on active tab and search term
  const filteredTasks = allTasks.filter(task => {
    // Filter by tab
    if (activeTab !== "all" && task.type !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        task.patientName.toLowerCase().includes(term) ||
        task.title.toLowerCase().includes(term) ||
        (task.details && task.details.toLowerCase().includes(term)) ||
        (task.assignedTo && task.assignedTo.toLowerCase().includes(term))
      );
    }
    
    return true;
  });
  
  // Get counts for tab indicators
  const getCounts = () => {
    const counts = {
      all: allTasks.length,
      medication: allTasks.filter(t => t.type === 'medication').length,
      consult: allTasks.filter(t => t.type === 'consult').length,
      order: allTasks.filter(t => t.type === 'order').length,
      nursing: allTasks.filter(t => t.type === 'nursing').length,
    };
    return counts;
  };
  
  const counts = getCounts();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">ED Tasks & Orders</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Input 
              placeholder="Search tasks..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline" size="sm">
              <PencilLine className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all" className="flex items-center justify-center">
                <ClipboardList className="mr-2 h-4 w-4" />
                All Tasks
                <Badge className="ml-2 bg-sky-600 hover:bg-sky-600">{counts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="medication" className="flex items-center justify-center">
                <Activity className="mr-2 h-4 w-4" />
                Medications
                <Badge className="ml-2 bg-sky-600 hover:bg-sky-600">{counts.medication}</Badge>
              </TabsTrigger>
              <TabsTrigger value="consult" className="flex items-center justify-center">
                <User className="mr-2 h-4 w-4" />
                Consults
                <Badge className="ml-2 bg-sky-600 hover:bg-sky-600">{counts.consult}</Badge>
              </TabsTrigger>
              <TabsTrigger value="order" className="flex items-center justify-center">
                <ClipboardList className="mr-2 h-4 w-4" />
                Orders
                <Badge className="ml-2 bg-sky-600 hover:bg-sky-600">{counts.order}</Badge>
              </TabsTrigger>
              <TabsTrigger value="nursing" className="flex items-center justify-center">
                <Stethoscope className="mr-2 h-4 w-4" />
                Nursing
                <Badge className="ml-2 bg-sky-600 hover:bg-sky-600">{counts.nursing}</Badge>
              </TabsTrigger>
            </TabsList>
            
            {/* Content is the same for all tabs, just filtered differently */}
            <div className="bg-white rounded-md shadow">
              <div className="grid grid-cols-12 bg-slate-100 p-2 font-medium text-sm text-slate-600">
                <div className="col-span-3">Patient / Task</div>
                <div className="col-span-3">Details</div>
                <div className="col-span-1 text-center">Priority</div>
                <div className="col-span-1 text-center">Due</div>
                <div className="col-span-2">Ordered By</div>
                <div className="col-span-2 text-center">Status</div>
              </div>
              
              <div className="divide-y">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <div key={task.id} className="grid grid-cols-12 p-3 hover:bg-slate-50">
                      <div className="col-span-3">
                        <div className="font-medium">{task.patientName}</div>
                        <div className="text-sm text-slate-500 mt-1">{task.title}</div>
                      </div>
                      <div className="col-span-3 text-sm">{task.details}</div>
                      <div className="col-span-1 text-center">
                        <Badge 
                          variant="outline" 
                          className={`
                            ${task.priority === 'stat' ? 'bg-red-50 text-red-600 border-red-200' : ''}
                            ${task.priority === 'urgent' ? 'bg-amber-50 text-amber-600 border-amber-200' : ''}
                            ${task.priority === 'normal' ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
                          `}
                        >
                          {task.priority === 'stat' ? 'STAT' : 
                           task.priority === 'urgent' ? 'Urgent' : 'Normal'}
                        </Badge>
                      </div>
                      <div className="col-span-1 text-center text-sm flex items-center justify-center">
                        <Clock className="h-3 w-3 mr-1 inline" />
                        {task.dueTime}
                      </div>
                      <div className="col-span-2 text-sm">{task.orderedBy}</div>
                      <div className="col-span-2 text-center">
                        <div className="flex justify-center space-x-2">
                          <Button 
                            variant={task.status === 'pending' ? 'default' : 'outline'} 
                            size="sm" 
                            className="h-8"
                          >
                            {task.status === 'completed' ? (
                              <>
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                Complete
                              </>
                            ) : (
                              'Start Task'
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    No tasks found matching your criteria
                  </div>
                )}
              </div>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
