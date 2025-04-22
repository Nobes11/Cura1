import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FlaskConical, FileText, Clipboard, Activity, Search, Calendar, Clock } from "lucide-react";
import { toast } from "sonner";

// Types for orders
interface Order {
  id: string;
  type: string;
  name: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  orderedAt: string;
  orderedBy: string;
  priority: "routine" | "urgent" | "stat";
  notes?: string;
  result?: {
    value: string;
    units?: string;
    referenceRange?: string;
    completedAt: string;
    completedBy: string;
    abnormal?: boolean;
    interpretation?: string;
  };
}

interface PatientOrdersProps {
  patientId: string;
  patientName: string;
  existingOrders?: Order[];
  onPlaceOrder: (order: any) => void;
}

export const PatientOrders: React.FC<PatientOrdersProps> = ({
  patientId,
  patientName,
  existingOrders = [],
  onPlaceOrder
}) => {
  const [activeTab, setActiveTab] = useState<string>("active");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderType, setOrderType] = useState<string>("lab");
  const [orders, setOrders] = useState<Order[]>(existingOrders);
  
  // State for new order form
  const [newOrder, setNewOrder] = useState({
    name: "",
    priority: "routine",
    notes: "",
    specific: {
      lab: {
        specimen: "",
        collectionNotes: ""
      },
      imaging: {
        bodyPart: "",
        contrast: false,
        transportNeeded: false
      },
      medication: {
        dose: "",
        route: "IV",
        frequency: ""
      },
      consult: {
        specialty: "",
        reason: ""
      }
    }
  });

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === "active") {
      return order.status === "pending" || order.status === "in-progress";
    } else if (activeTab === "completed") {
      return order.status === "completed";
    } else if (activeTab === "cancelled") {
      return order.status === "cancelled";
    }
    return true;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setNewOrder({
      ...newOrder,
      [field]: e.target.value
    });
  };

  const handleSpecificInputChange = (value: any, category: string, field: string) => {
    setNewOrder({
      ...newOrder,
      specific: {
        ...newOrder.specific,
        [category]: {
          ...newOrder.specific[category as keyof typeof newOrder.specific],
          [field]: value
        }
      }
    });
  };

  const handlePlaceOrder = () => {
    if (!newOrder.name) {
      toast.error("Please enter an order name");
      return;
    }

    const timestamp = new Date().toISOString();
    const order: Order = {
      id: `order_${Date.now()}`,
      type: orderType,
      name: newOrder.name,
      status: "pending",
      orderedAt: timestamp,
      orderedBy: "Dr. Current User", // Would be the logged-in user in a real app
      priority: newOrder.priority as "routine" | "urgent" | "stat",
      notes: newOrder.notes
    };

    setOrders([order, ...orders]);
    onPlaceOrder(order);
    setShowOrderForm(false);
    resetOrderForm();
    toast.success("Order placed successfully");
  };

  const resetOrderForm = () => {
    setNewOrder({
      name: "",
      priority: "routine",
      notes: "",
      specific: {
        lab: {
          specimen: "",
          collectionNotes: ""
        },
        imaging: {
          bodyPart: "",
          contrast: false,
          transportNeeded: false
        },
        medication: {
          dose: "",
          route: "IV",
          frequency: ""
        },
        consult: {
          specialty: "",
          reason: ""
        }
      }
    });
  };

  const getOrderIcon = (type: string) => {
    switch (type) {
      case "lab":
        return <FlaskConical className="h-4 w-4 text-blue-600" />;
      case "imaging":
        return <Search className="h-4 w-4 text-purple-600" />;
      case "medication":
        return <Activity className="h-4 w-4 text-green-600" />;
      case "consult":
        return <Clipboard className="h-4 w-4 text-amber-600" />;
      default:
        return <FileText className="h-4 w-4 text-slate-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Pending</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-300">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "routine":
        return <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-300">Routine</Badge>;
      case "urgent":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">Urgent</Badge>;
      case "stat":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">STAT</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-4">
      {showOrderForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Place New Order for {patientName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order-type">Order Type</Label>
                <Select value={orderType} onValueChange={setOrderType}>
                  <SelectTrigger id="order-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab">Laboratory</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="consult">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="order-priority">Priority</Label>
                <Select value={newOrder.priority} onValueChange={(value) => setNewOrder({...newOrder, priority: value})}>
                  <SelectTrigger id="order-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="stat">STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="order-name">Order Name</Label>
              <Input 
                id="order-name" 
                value={newOrder.name} 
                onChange={(e) => handleInputChange(e, "name")}
                placeholder={orderType === "lab" ? "e.g., CBC, BMP, Troponin" : 
                  orderType === "imaging" ? "e.g., Chest X-Ray, CT Abdomen" :
                  orderType === "medication" ? "e.g., Morphine, Normal Saline" :
                  "e.g., Cardiology Consult"}
              />
            </div>

            {/* Order-specific fields */}
            {orderType === "lab" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lab-specimen">Specimen Type</Label>
                  <Select 
                    value={newOrder.specific.lab.specimen} 
                    onValueChange={(value) => handleSpecificInputChange(value, "lab", "specimen")}
                  >
                    <SelectTrigger id="lab-specimen">
                      <SelectValue placeholder="Select specimen type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blood">Blood</SelectItem>
                      <SelectItem value="urine">Urine</SelectItem>
                      <SelectItem value="csf">CSF</SelectItem>
                      <SelectItem value="sputum">Sputum</SelectItem>
                      <SelectItem value="stool">Stool</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="lab-collection">Collection Notes</Label>
                  <Input 
                    id="lab-collection" 
                    value={newOrder.specific.lab.collectionNotes}
                    onChange={(e) => handleSpecificInputChange(e.target.value, "lab", "collectionNotes")}
                    placeholder="e.g., Fasting, timed collection"
                  />
                </div>
              </div>
            )}

            {orderType === "imaging" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="imaging-bodyPart">Body Part</Label>
                  <Input 
                    id="imaging-bodyPart" 
                    value={newOrder.specific.imaging.bodyPart}
                    onChange={(e) => handleSpecificInputChange(e.target.value, "imaging", "bodyPart")}
                    placeholder="e.g., Chest, Abdomen, Head"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="imaging-contrast" 
                      checked={newOrder.specific.imaging.contrast}
                      onCheckedChange={(checked) => 
                        handleSpecificInputChange(checked === true, "imaging", "contrast")
                      }
                    />
                    <Label htmlFor="imaging-contrast">With Contrast</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="imaging-transport" 
                      checked={newOrder.specific.imaging.transportNeeded}
                      onCheckedChange={(checked) => 
                        handleSpecificInputChange(checked === true, "imaging", "transportNeeded")
                      }
                    />
                    <Label htmlFor="imaging-transport">Transport Needed</Label>
                  </div>
                </div>
              </div>
            )}

            {orderType === "medication" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="med-dose">Dose</Label>
                  <Input 
                    id="med-dose" 
                    value={newOrder.specific.medication.dose}
                    onChange={(e) => handleSpecificInputChange(e.target.value, "medication", "dose")}
                    placeholder="e.g., 5mg, 500mL"
                  />
                </div>
                <div>
                  <Label htmlFor="med-route">Route</Label>
                  <Select 
                    value={newOrder.specific.medication.route} 
                    onValueChange={(value) => handleSpecificInputChange(value, "medication", "route")}
                  >
                    <SelectTrigger id="med-route">
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IV">IV</SelectItem>
                      <SelectItem value="PO">PO (Oral)</SelectItem>
                      <SelectItem value="IM">IM</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="PR">PR</SelectItem>
                      <SelectItem value="SL">SL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="med-frequency">Frequency</Label>
                  <Input 
                    id="med-frequency" 
                    value={newOrder.specific.medication.frequency}
                    onChange={(e) => handleSpecificInputChange(e.target.value, "medication", "frequency")}
                    placeholder="e.g., Q8H, BID, Once"
                  />
                </div>
              </div>
            )}

            {orderType === "consult" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="consult-specialty">Specialty</Label>
                  <Select 
                    value={newOrder.specific.consult.specialty} 
                    onValueChange={(value) => handleSpecificInputChange(value, "consult", "specialty")}
                  >
                    <SelectTrigger id="consult-specialty">
                      <SelectValue placeholder="Select specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="gastroenterology">Gastroenterology</SelectItem>
                      <SelectItem value="infectious-disease">Infectious Disease</SelectItem>
                      <SelectItem value="nephrology">Nephrology</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="consult-reason">Reason for Consult</Label>
                  <Input 
                    id="consult-reason" 
                    value={newOrder.specific.consult.reason}
                    onChange={(e) => handleSpecificInputChange(e.target.value, "consult", "reason")}
                    placeholder="Brief reason for consultation"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="order-notes">Additional Notes</Label>
              <Textarea 
                id="order-notes" 
                value={newOrder.notes} 
                onChange={(e) => handleInputChange(e, "notes")}
                placeholder="Additional instructions or clinical context"
                className="h-20"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowOrderForm(false)}>Cancel</Button>
            <Button onClick={handlePlaceOrder}>Place Order</Button>
          </CardFooter>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Orders & Results</h2>
            <Button onClick={() => setShowOrderForm(true)}>
              <FileText className="h-4 w-4 mr-2" />
              Place New Order
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="active">Active Orders</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              <TabsTrigger value="all">All Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="pt-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-8 border rounded-md bg-slate-50">
                  <p className="text-slate-500">No {activeTab} orders found</p>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order Type</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Ordered</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map(order => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div className="flex items-center">
                              {getOrderIcon(order.type)}
                              <span className="ml-2 capitalize">{order.type}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{order.name}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3.5 w-3.5 text-slate-500 mr-1" />
                              <span>{formatDate(order.orderedAt)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                {order.status === "completed" ? "View Results" : "Details"}
                              </Button>
                              {order.status === "pending" && (
                                <Button size="sm" variant="outline">
                                  Cancel
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};
