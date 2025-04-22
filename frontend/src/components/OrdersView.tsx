import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, Calendar, List, Check, X, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Order {
  id: string;
  type: string;
  name: string;
  status: string;
  orderedBy: string;
  orderedDate: string;
  details?: string;
  priority?: string;
  result?: string;
  completedDate?: string;
}

export function OrdersView() {
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [orderType, setOrderType] = useState("lab");
  const [activeTab, setActiveTab] = useState("active");
  
  // Mock data for orders
  const mockOrders: Order[] = [
    {
      id: "o-1",
      type: "lab",
      name: "Complete Blood Count (CBC)",
      status: "completed",
      orderedBy: "Dr. Johnson",
      orderedDate: "2025-04-16T09:30:00",
      completedDate: "2025-04-16T11:45:00",
      priority: "routine"
    },
    {
      id: "o-2",
      type: "lab",
      name: "Basic Metabolic Panel",
      status: "pending",
      orderedBy: "Dr. Johnson",
      orderedDate: "2025-04-16T09:32:00",
      priority: "stat"
    },
    {
      id: "o-3",
      type: "imaging",
      name: "Chest X-Ray",
      status: "pending",
      orderedBy: "Dr. Johnson",
      orderedDate: "2025-04-16T09:35:00",
      details: "Rule out pneumonia",
      priority: "urgent"
    },
    {
      id: "o-4",
      type: "medication",
      name: "Acetaminophen 500mg",
      status: "active",
      orderedBy: "Dr. Johnson",
      orderedDate: "2025-04-16T09:40:00",
      details: "1 tablet every 6 hours as needed for pain"
    },
    {
      id: "o-5",
      type: "consultation",
      name: "Cardiology Consult",
      status: "pending",
      orderedBy: "Dr. Johnson",
      orderedDate: "2025-04-16T10:00:00",
      details: "Evaluate for possible cardiac involvement"
    }
  ];

  // Filter orders based on active tab
  const filteredOrders = mockOrders.filter(order => {
    if (activeTab === "active") return order.status === "active" || order.status === "pending";
    if (activeTab === "completed") return order.status === "completed";
    if (activeTab === "all") return true;
    
    // Filter by type tabs
    return order.type === activeTab;
  });

  // Function to format date and time
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Render new order dialog
  const renderNewOrderDialog = () => {
    return (
      <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FilePlus className="h-5 w-5 text-[#7b9d8f]" />
              Create New Order
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Tabs defaultValue="lab" onValueChange={setOrderType} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="lab">Laboratory</TabsTrigger>
                <TabsTrigger value="imaging">Imaging</TabsTrigger>
                <TabsTrigger value="medication">Medication</TabsTrigger>
                <TabsTrigger value="consultation">Consult</TabsTrigger>
              </TabsList>
              
              {/* Lab Order Form */}
              <TabsContent value="lab" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="lab-test">Laboratory Test</Label>
                  <Select>
                    <SelectTrigger id="lab-test">
                      <SelectValue placeholder="Select laboratory test" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cbc">Complete Blood Count (CBC)</SelectItem>
                      <SelectItem value="bmp">Basic Metabolic Panel</SelectItem>
                      <SelectItem value="cmp">Comprehensive Metabolic Panel</SelectItem>
                      <SelectItem value="coag">Coagulation Panel</SelectItem>
                      <SelectItem value="troponin">Troponin</SelectItem>
                      <SelectItem value="ua">Urinalysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lab-priority">Priority</Label>
                  <Select defaultValue="routine">
                    <SelectTrigger id="lab-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="stat">STAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lab-notes">Clinical Notes</Label>
                  <Textarea 
                    id="lab-notes" 
                    placeholder="Enter clinical notes or special instructions"
                  />
                </div>
              </TabsContent>
              
              {/* Imaging Order Form */}
              <TabsContent value="imaging" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="imaging-type">Imaging Type</Label>
                  <Select>
                    <SelectTrigger id="imaging-type">
                      <SelectValue placeholder="Select imaging type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xray">X-Ray</SelectItem>
                      <SelectItem value="ct">CT Scan</SelectItem>
                      <SelectItem value="mri">MRI</SelectItem>
                      <SelectItem value="us">Ultrasound</SelectItem>
                      <SelectItem value="echo">Echocardiogram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imaging-area">Body Area</Label>
                  <Select>
                    <SelectTrigger id="imaging-area">
                      <SelectValue placeholder="Select body area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="head">Head</SelectItem>
                      <SelectItem value="chest">Chest</SelectItem>
                      <SelectItem value="abdomen">Abdomen</SelectItem>
                      <SelectItem value="pelvis">Pelvis</SelectItem>
                      <SelectItem value="extremity">Extremity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imaging-reason">Reason for Exam</Label>
                  <Textarea 
                    id="imaging-reason" 
                    placeholder="Enter reason for imaging study"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imaging-priority">Priority</Label>
                  <Select defaultValue="routine">
                    <SelectTrigger id="imaging-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="stat">STAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              {/* Medication Order Form */}
              <TabsContent value="medication" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="medication-name">Medication</Label>
                  <Input 
                    id="medication-name" 
                    placeholder="Enter medication name"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medication-dose">Dose</Label>
                    <Input 
                      id="medication-dose" 
                      placeholder="Enter dose"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="medication-route">Route</Label>
                    <Select>
                      <SelectTrigger id="medication-route">
                        <SelectValue placeholder="Select route" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="po">PO (Oral)</SelectItem>
                        <SelectItem value="iv">IV</SelectItem>
                        <SelectItem value="im">IM</SelectItem>
                        <SelectItem value="sc">Subcutaneous</SelectItem>
                        <SelectItem value="topical">Topical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medication-frequency">Frequency</Label>
                    <Select>
                      <SelectTrigger id="medication-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Once</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="bid">BID (Twice Daily)</SelectItem>
                        <SelectItem value="tid">TID (Three Times Daily)</SelectItem>
                        <SelectItem value="qid">QID (Four Times Daily)</SelectItem>
                        <SelectItem value="prn">PRN (As Needed)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="medication-duration">Duration</Label>
                    <Input 
                      id="medication-duration" 
                      placeholder="Enter duration"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medication-instructions">Instructions</Label>
                  <Textarea 
                    id="medication-instructions" 
                    placeholder="Enter special instructions"
                  />
                </div>
              </TabsContent>
              
              {/* Consultation Order Form */}
              <TabsContent value="consultation" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="consult-specialty">Specialty</Label>
                  <Select>
                    <SelectTrigger id="consult-specialty">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="orthopedics">Orthopedics</SelectItem>
                      <SelectItem value="gastroenterology">Gastroenterology</SelectItem>
                      <SelectItem value="endocrinology">Endocrinology</SelectItem>
                      <SelectItem value="pulmonology">Pulmonology</SelectItem>
                      <SelectItem value="nephrology">Nephrology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="consult-reason">Reason for Consultation</Label>
                  <Textarea 
                    id="consult-reason" 
                    placeholder="Enter reason for consultation"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="consult-priority">Priority</Label>
                  <Select defaultValue="routine">
                    <SelectTrigger id="consult-priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="stat">STAT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowNewOrderDialog(false)}>Cancel</Button>
            <Button 
              className="bg-[#7b9d8f] text-white hover:bg-[#c1632f]"
              onClick={() => {
                toast.success(`New ${orderType} order created`);
                setShowNewOrderDialog(false);
              }}
            >
              Submit Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="w-full space-y-6">
      {renderNewOrderDialog()}
      
      {/* Header with tabs */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Orders</h2>
        <Button 
          onClick={() => setShowNewOrderDialog(true)}
          className="bg-[#7b9d8f] text-white hover:bg-[#c1632f]"
        >
          <FilePlus className="h-4 w-4 mr-2" />
          New Order
        </Button>
      </div>
      
      {/* Tab navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="lab">Laboratory</TabsTrigger>
          <TabsTrigger value="imaging">Imaging</TabsTrigger>
          <TabsTrigger value="medication">Medications</TabsTrigger>
          <TabsTrigger value="consultation">Consults</TabsTrigger>
          <TabsTrigger value="all">All Orders</TabsTrigger>
        </TabsList>
        
        {/* Orders list - same content for all tabs, just filtered differently */}
        <TabsContent value={activeTab} className="mt-0">
          <Card>
            <CardContent className="p-6">
              {filteredOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map(order => (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.name}</div>
                            {order.details && (
                              <div className="text-sm text-slate-500">{order.details}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{order.type}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {formatDateTime(order.orderedDate)}
                            {order.priority && (
                              <Badge variant="outline" className={
                                order.priority === "stat" ? "bg-red-100 text-red-800 border-red-200" :
                                order.priority === "urgent" ? "bg-amber-100 text-amber-800 border-amber-200" :
                                "bg-blue-100 text-blue-800 border-blue-200"
                              }>
                                {order.priority.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{order.orderedBy}</TableCell>
                        <TableCell>
                          <Badge className={
                            order.status === "completed" ? "bg-green-100 text-green-800 border-green-200" :
                            order.status === "pending" ? "bg-amber-100 text-amber-800 border-amber-200" :
                            "bg-blue-100 text-blue-800 border-blue-200"
                          }>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="mx-auto h-12 w-12 text-slate-300" />
                  <h3 className="mt-2 text-lg font-medium">No Orders Found</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    There are no {activeTab === "active" ? "active" : activeTab === "completed" ? "completed" : activeTab} orders at this time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
