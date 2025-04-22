import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Link, CheckCircle, Clock, AlertCircle, X, FileText, Clipboard, Calendar } from "lucide-react";
import { toast } from "sonner";

interface Problem {
  id: string;
  problem: string;
  icd10: string;
  onset: string;
  status: "Active" | "Resolved" | "Chronic";
  notes?: string;
  linkedItems?: Array<{
    type: "note" | "order" | "encounter";
    id: string;
    label: string;
  }>;
}

interface ProblemListModuleProps {
  problems: Problem[];
  onAddProblem?: (problem: Problem) => void;
  onUpdateProblem?: (id: string, updates: Partial<Problem>) => void;
  onLinkItem?: (problemId: string, itemType: string, itemId: string) => void;
  onDeleteProblem?: (id: string) => void;
  notes?: any[];
  orders?: any[];
  encounters?: any[];
}

export function ProblemListModule({
  problems = [],
  onAddProblem,
  onUpdateProblem,
  onLinkItem,
  onDeleteProblem,
  notes = [],
  orders = [],
  encounters = []
}: ProblemListModuleProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [newProblem, setNewProblem] = useState<Partial<Problem>>({
    status: "Active"
  });
  const [linkType, setLinkType] = useState<"note" | "order" | "encounter">("note");
  const [selectedItemId, setSelectedItemId] = useState<string>("");

  const handleAddProblem = () => {
    if (!newProblem.problem || !newProblem.icd10) {
      toast.error("Problem name and ICD-10 code are required");
      return;
    }
    
    const problemToAdd = {
      id: `p${Date.now()}`,
      problem: newProblem.problem,
      icd10: newProblem.icd10,
      onset: newProblem.onset || new Date().toISOString().split('T')[0],
      status: newProblem.status as "Active" | "Resolved" | "Chronic",
      notes: newProblem.notes,
      linkedItems: []
    };
    
    onAddProblem?.(problemToAdd);
    setNewProblem({ status: "Active" });
    setShowAddDialog(false);
    toast.success("Problem added successfully");
  };

  const handleUpdateProblem = () => {
    if (!editingProblem) return;
    
    onUpdateProblem?.(editingProblem.id, editingProblem);
    setEditingProblem(null);
    toast.success("Problem updated successfully");
  };

  const handleLinkItem = () => {
    if (!selectedProblemId || !selectedItemId) {
      toast.error("Please select both a problem and an item to link");
      return;
    }
    
    onLinkItem?.(selectedProblemId, linkType, selectedItemId);
    setShowLinkDialog(false);
    toast.success("Item linked to problem successfully");
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active":
        return <Badge className="bg-red-500">Active</Badge>;
      case "Resolved":
        return <Badge className="bg-green-500">Resolved</Badge>;
      case "Chronic":
        return <Badge className="bg-blue-500">Chronic</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getAvailableItemsForLinking = () => {
    switch(linkType) {
      case "note":
        return notes.map(note => ({
          id: note.id,
          label: `${note.title} (${new Date(note.timestamp).toLocaleDateString()})`
        }));
      case "order":
        return orders.map(order => ({
          id: order.id,
          label: `${order.name} (${order.status})`
        }));
      case "encounter":
        return encounters.map(encounter => ({
          id: encounter.id,
          label: `Encounter on ${new Date(encounter.date).toLocaleDateString()}`
        }));
      default:
        return [];
    }
  };
  
  const renderLinkedItems = (problem: Problem) => {
    if (!problem.linkedItems || problem.linkedItems.length === 0) {
      return <span className="text-slate-400 text-xs italic">No linked items</span>;
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {problem.linkedItems.map((item, idx) => (
          <Badge key={idx} variant="outline" className="text-xs flex items-center gap-1">
            {item.type === "note" && <FileText className="h-3 w-3" />}
            {item.type === "order" && <Clipboard className="h-3 w-3" />}
            {item.type === "encounter" && <Calendar className="h-3 w-3" />}
            <span>{item.label}</span>
          </Badge>
        ))}
      </div>
    );
  };

  const getLinkableItemOptions = () => {
    const items = getAvailableItemsForLinking();
    
    if (items.length === 0) {
      return <option value="">No items available</option>;
    }
    
    return items.map(item => (
      <option key={item.id} value={item.id}>{item.label}</option>
    ));
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Problem List
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => setShowLinkDialog(true)}
              disabled={problems.length === 0}
              className="h-8"
              variant="outline"
            >
              <Link className="h-4 w-4 mr-1" />
              Link Item
            </Button>
            <Button 
              size="sm" 
              onClick={() => setShowAddDialog(true)}
              className="h-8 bg-[#7b9d8f] hover:bg-[#c1632f]"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Problem
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {problems.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Problem</TableHead>
                  <TableHead>ICD-10</TableHead>
                  <TableHead>Onset</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Linked Items</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {problems.map((problem) => (
                  <TableRow key={problem.id}>
                    <TableCell className="font-medium">{problem.problem}</TableCell>
                    <TableCell className="text-slate-700 font-mono">{problem.icd10}</TableCell>
                    <TableCell>{new Date(problem.onset).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(problem.status)}</TableCell>
                    <TableCell>{renderLinkedItems(problem)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            setEditingProblem(problem);
                            setShowAddDialog(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this problem?")) {
                              onDeleteProblem?.(problem.id);
                              toast.success("Problem deleted");
                            }
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 border border-dashed rounded-md">
              <p className="text-slate-500 mb-2">No problems documented</p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setShowAddDialog(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Problem
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Problem Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProblem ? "Edit Problem" : "Add New Problem"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="problem">Problem Name</Label>
                <Input 
                  id="problem" 
                  value={editingProblem?.problem || newProblem.problem || ""}
                  onChange={(e) => {
                    if (editingProblem) {
                      setEditingProblem({...editingProblem, problem: e.target.value});
                    } else {
                      setNewProblem({...newProblem, problem: e.target.value});
                    }
                  }}
                  placeholder="e.g. Hypertension"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icd10">ICD-10 Code</Label>
                <Input 
                  id="icd10" 
                  value={editingProblem?.icd10 || newProblem.icd10 || ""}
                  onChange={(e) => {
                    if (editingProblem) {
                      setEditingProblem({...editingProblem, icd10: e.target.value});
                    } else {
                      setNewProblem({...newProblem, icd10: e.target.value});
                    }
                  }}
                  placeholder="e.g. I10"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="onset">Onset Date</Label>
                <Input 
                  id="onset" 
                  type="date"
                  value={editingProblem?.onset || newProblem.onset || ""}
                  onChange={(e) => {
                    if (editingProblem) {
                      setEditingProblem({...editingProblem, onset: e.target.value});
                    } else {
                      setNewProblem({...newProblem, onset: e.target.value});
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={editingProblem?.status || newProblem.status as string} 
                  onValueChange={(value) => {
                    if (editingProblem) {
                      setEditingProblem({...editingProblem, status: value as "Active" | "Resolved" | "Chronic"});
                    } else {
                      setNewProblem({...newProblem, status: value as "Active" | "Resolved" | "Chronic"});
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="Resolved">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Resolved
                      </div>
                    </SelectItem>
                    <SelectItem value="Chronic">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Chronic
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                value={editingProblem?.notes || newProblem.notes || ""}
                onChange={(e) => {
                  if (editingProblem) {
                    setEditingProblem({...editingProblem, notes: e.target.value});
                  } else {
                    setNewProblem({...newProblem, notes: e.target.value});
                  }
                }}
                placeholder="Additional context about this problem..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setEditingProblem(null);
              setNewProblem({ status: "Active" });
            }}>
              Cancel
            </Button>
            <Button onClick={editingProblem ? handleUpdateProblem : handleAddProblem}>
              {editingProblem ? "Update" : "Add"} Problem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Item Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link Item to Problem</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="problem-select">Select Problem</Label>
              <Select 
                value={selectedProblemId || ""} 
                onValueChange={(value) => setSelectedProblemId(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a problem" />
                </SelectTrigger>
                <SelectContent>
                  {problems.map(problem => (
                    <SelectItem key={problem.id} value={problem.id}>
                      {problem.problem} ({problem.icd10})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-type">Item Type</Label>
              <Select 
                value={linkType} 
                onValueChange={(value: "note" | "order" | "encounter") => {
                  setLinkType(value);
                  setSelectedItemId("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="note">Clinical Note</SelectItem>
                  <SelectItem value="order">Order</SelectItem>
                  <SelectItem value="encounter">Encounter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="item-select">Select Item</Label>
              <Select 
                value={selectedItemId} 
                onValueChange={setSelectedItemId}
                disabled={getAvailableItemsForLinking().length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableItemsForLinking().map(item => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getAvailableItemsForLinking().length === 0 && (
                <p className="text-xs text-amber-500">No {linkType}s available to link</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleLinkItem}
              disabled={!selectedProblemId || !selectedItemId}
            >
              Link Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
