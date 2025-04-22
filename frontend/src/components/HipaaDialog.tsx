import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsItem, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, FileText, Info, Plus, Edit, Trash2, User, UserCircle2, ShieldAlert, FileCheck } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Enhanced HIPAA contact interface with more information
export interface EnhancedHipaaContact {
  id: string; // Unique identifier
  name: string;
  relationship: string;
  phone: string;
  authorized: boolean;
  infoAccess: "Full" | "Limited" | "None";
  notes?: string;
  addedOn: string;
  addedBy: string;
}

export interface HipaaComplianceData {
  formStatus: "On File" | "Pending" | "Declined" | "Expired";
  lastUpdated: string;
  updatedBy: string;
  expirationDate?: string;
  patientCapacity: "Full" | "Limited" | "None";
  authorizedContacts: EnhancedHipaaContact[];
  restrictedContacts?: EnhancedHipaaContact[];
  sharingPreferences?: {
    allowClinicalInformation: boolean;
    allowLocationInformation: boolean;
    allowFinancialInformation: boolean;
    customRestrictions?: string;
  };
  formNotes?: string;
}

interface HipaaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hipaaData: HipaaComplianceData;
  onSave: (updatedData: HipaaComplianceData) => void;
  currentProvider: string;
}

export function HipaaDialog({
  open,
  onOpenChange,
  hipaaData,
  onSave,
  currentProvider,
}: HipaaDialogProps) {
  // Form state
  const [activeTab, setActiveTab] = useState<string>("authorizedContacts");
  const [formData, setFormData] = useState<HipaaComplianceData>({...hipaaData});
  
  // Contact editing state
  const [editingContact, setEditingContact] = useState<EnhancedHipaaContact | null>(null);
  const [isAddingContact, setIsAddingContact] = useState<boolean>(false);
  const [newContact, setNewContact] = useState<Partial<EnhancedHipaaContact>>({
    name: "",
    relationship: "",
    phone: "",
    authorized: true,
    infoAccess: "Limited",
    notes: ""
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Reset the form
  const resetForm = () => {
    setFormData({...hipaaData});
    setEditingContact(null);
    setIsAddingContact(false);
    setNewContact({
      name: "",
      relationship: "",
      phone: "",
      authorized: true,
      infoAccess: "Limited",
      notes: ""
    });
  };

  // Handle cancel
  const handleCancel = () => {
    resetForm();
    onOpenChange(false);
  };

  // Handle save
  const handleSave = () => {
    // Update the HIPAA data with current timestamp and provider
    const updatedData = {
      ...formData,
      lastUpdated: new Date().toISOString(),
      updatedBy: currentProvider
    };
    
    onSave(updatedData);
    toast.success("HIPAA information updated successfully");
    resetForm();
    onOpenChange(false);
  };

  // Handle adding a new contact
  const handleAddContact = () => {
    // Validate required fields
    if (!newContact.name || !newContact.relationship || !newContact.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create new contact with ID and timestamps
    const contact: EnhancedHipaaContact = {
      id: `contact-${Date.now()}`,
      name: newContact.name,
      relationship: newContact.relationship,
      phone: newContact.phone,
      authorized: newContact.authorized || true,
      infoAccess: newContact.infoAccess as "Full" | "Limited" | "None" || "Limited",
      notes: newContact.notes || "",
      addedOn: new Date().toISOString(),
      addedBy: currentProvider
    };

    // Update the appropriate contacts list
    if (activeTab === "authorizedContacts") {
      setFormData({
        ...formData,
        authorizedContacts: [...formData.authorizedContacts, contact]
      });
    } else {
      setFormData({
        ...formData,
        restrictedContacts: [...(formData.restrictedContacts || []), contact]
      });
    }

    // Reset new contact form
    setNewContact({
      name: "",
      relationship: "",
      phone: "",
      authorized: true,
      infoAccess: "Limited",
      notes: ""
    });
    setIsAddingContact(false);
  };

  // Handle editing a contact
  const handleUpdateContact = () => {
    if (!editingContact) return;

    // Validate required fields
    if (!editingContact.name || !editingContact.relationship || !editingContact.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Update in the appropriate list
    if (activeTab === "authorizedContacts") {
      setFormData({
        ...formData,
        authorizedContacts: formData.authorizedContacts.map(c => 
          c.id === editingContact.id ? editingContact : c
        )
      });
    } else {
      setFormData({
        ...formData,
        restrictedContacts: (formData.restrictedContacts || []).map(c => 
          c.id === editingContact.id ? editingContact : c
        )
      });
    }

    setEditingContact(null);
  };

  // Handle deleting a contact
  const handleDeleteContact = (contactId: string) => {
    if (activeTab === "authorizedContacts") {
      setFormData({
        ...formData,
        authorizedContacts: formData.authorizedContacts.filter(c => c.id !== contactId)
      });
    } else {
      setFormData({
        ...formData,
        restrictedContacts: (formData.restrictedContacts || []).filter(c => c.id !== contactId)
      });
    }

    toast.success("Contact removed");
  };

  // Update form data field
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update sharing preferences
  const updateSharingPreference = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      sharingPreferences: {
        ...(prev.sharingPreferences || {
          allowClinicalInformation: true,
          allowLocationInformation: true,
          allowFinancialInformation: false,
          customRestrictions: ""
        }),
        [field]: value
      }
    }));
  };

  // Render contact form (for add/edit)
  const renderContactForm = () => {
    const contact = editingContact || newContact;
    const isRestricted = activeTab === "restrictedContacts";

    return (
      <div className="space-y-3 p-3 border rounded-md bg-slate-50">
        <h3 className="font-medium text-sm">
          {editingContact ? "Edit Contact" : "Add New Contact"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="contactName">Name <span className="text-red-500">*</span></Label>
            <Input
              id="contactName"
              value={contact.name}
              onChange={(e) => editingContact 
                ? setEditingContact({...editingContact, name: e.target.value})
                : setNewContact({...newContact, name: e.target.value})}
              placeholder="Full name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="contactRelationship">Relationship <span className="text-red-500">*</span></Label>
            <Input
              id="contactRelationship"
              value={contact.relationship}
              onChange={(e) => editingContact
                ? setEditingContact({...editingContact, relationship: e.target.value})
                : setNewContact({...newContact, relationship: e.target.value})}
              placeholder="e.g. Spouse, Child, Friend"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="contactPhone">Phone Number <span className="text-red-500">*</span></Label>
          <Input
            id="contactPhone"
            value={contact.phone}
            onChange={(e) => editingContact
              ? setEditingContact({...editingContact, phone: e.target.value})
              : setNewContact({...newContact, phone: e.target.value})}
            placeholder="(555) 123-4567"
            className="mt-1"
          />
        </div>

        {!isRestricted && (
          <div className="space-y-2">
            <Label className="text-sm">Information Access Level</Label>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="accessFull"
                  checked={contact.infoAccess === "Full"}
                  onChange={() => editingContact
                    ? setEditingContact({...editingContact, infoAccess: "Full"})
                    : setNewContact({...newContact, infoAccess: "Full"})}
                  className="rounded-full h-4 w-4 text-blue-600"
                />
                <Label htmlFor="accessFull" className="text-sm cursor-pointer">
                  Full Access (all patient information)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="accessLimited"
                  checked={contact.infoAccess === "Limited"}
                  onChange={() => editingContact
                    ? setEditingContact({...editingContact, infoAccess: "Limited"})
                    : setNewContact({...newContact, infoAccess: "Limited"})}
                  className="rounded-full h-4 w-4 text-blue-600"
                />
                <Label htmlFor="accessLimited" className="text-sm cursor-pointer">
                  Limited Access (condition updates only)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="accessNone"
                  checked={contact.infoAccess === "None"}
                  onChange={() => editingContact
                    ? setEditingContact({...editingContact, infoAccess: "None"})
                    : setNewContact({...newContact, infoAccess: "None"})}
                  className="rounded-full h-4 w-4 text-blue-600"
                />
                <Label htmlFor="accessNone" className="text-sm cursor-pointer">
                  No Access (emergency contact only)
                </Label>
              </div>
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="contactNotes">Notes</Label>
          <Textarea
            id="contactNotes"
            value={contact.notes}
            onChange={(e) => editingContact
              ? setEditingContact({...editingContact, notes: e.target.value})
              : setNewContact({...newContact, notes: e.target.value})}
            placeholder="Additional information about this contact"
            className="mt-1"
            rows={2}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => {
            setEditingContact(null);
            setIsAddingContact(false);
          }}>
            Cancel
          </Button>
          <Button size="sm" onClick={editingContact ? handleUpdateContact : handleAddContact}>
            {editingContact ? "Update" : "Add"} Contact
          </Button>
        </div>
      </div>
    );
  };

  // Render contacts table
  const renderContactsTable = (contacts: EnhancedHipaaContact[], isRestricted: boolean = false) => {
    return contacts.length === 0 ? (
      <div className="text-center py-6 text-slate-500 text-sm italic">
        No {isRestricted ? "restricted" : "authorized"} contacts added yet
      </div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Relationship</TableHead>
            <TableHead>Phone</TableHead>
            {!isRestricted && <TableHead>Access Level</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>{contact.relationship}</TableCell>
              <TableCell>{contact.phone}</TableCell>
              {!isRestricted && (
                <TableCell>
                  <Badge 
                    variant={contact.infoAccess === "Full" ? "default" : "outline"}
                    className={contact.infoAccess === "Full" 
                      ? "bg-blue-500" 
                      : contact.infoAccess === "Limited" 
                        ? "bg-amber-100 text-amber-800 border-amber-300" 
                        : "bg-slate-100 text-slate-800 border-slate-300"
                    }
                  >
                    {contact.infoAccess}
                  </Badge>
                </TableCell>
              )}
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => setEditingContact(contact)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileCheck className="h-5 w-5 text-blue-500" />
            HIPAA Authorization and Compliance
          </DialogTitle>
          <DialogDescription>
            Manage patient information sharing preferences and authorized contacts
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 pr-2">
          {/* Form status section */}
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-md mb-4">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-medium text-blue-800">HIPAA Form Status: {formData.formStatus}</h3>
                <p className="text-sm text-blue-700">Last Updated: {formatDate(formData.lastUpdated)} by {formData.updatedBy}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="formStatus" className="text-sm">Update Status:</Label>
              <select
                id="formStatus"
                value={formData.formStatus}
                onChange={(e) => updateFormData("formStatus", e.target.value)}
                className="text-sm rounded-md border border-blue-200 bg-white h-8 px-2"
              >
                <option value="On File">On File</option>
                <option value="Pending">Pending</option>
                <option value="Declined">Declined</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Tabs for different sections */}
          <Tabs defaultValue="authorizedContacts" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="authorizedContacts">Authorized Contacts</TabsTrigger>
              <TabsTrigger value="restrictedContacts">Restricted Contacts</TabsTrigger>
              <TabsTrigger value="preferences">Sharing Preferences</TabsTrigger>
            </TabsList>
            
            {/* Authorized Contacts Tab */}
            <TabsContent value="authorizedContacts" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-medium">Authorized Contacts</h3>
                {!isAddingContact && !editingContact && (
                  <Button 
                    size="sm" 
                    onClick={() => setIsAddingContact(true)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Contact
                  </Button>
                )}
              </div>

              {(isAddingContact || editingContact) && activeTab === "authorizedContacts" && renderContactForm()}

              <div className="border rounded-md overflow-hidden">
                {renderContactsTable(formData.authorizedContacts)}
              </div>

              <div className="text-sm text-slate-500 italic">
                Authorized contacts may receive information according to their access level and HIPAA guidelines.
              </div>
            </TabsContent>

            {/* Restricted Contacts Tab */}
            <TabsContent value="restrictedContacts" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-medium">Restricted Contacts</h3>
                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                    <AlertTriangle className="h-3 w-3 mr-1" /> No Information Sharing
                  </Badge>
                </div>
                {!isAddingContact && !editingContact && (
                  <Button 
                    size="sm" 
                    onClick={() => setIsAddingContact(true)}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Restricted Contact
                  </Button>
                )}
              </div>

              {(isAddingContact || editingContact) && activeTab === "restrictedContacts" && renderContactForm()}

              <div className="border rounded-md overflow-hidden">
                {renderContactsTable(formData.restrictedContacts || [], true)}
              </div>

              <div className="p-3 bg-red-50 rounded-md text-sm text-red-800 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Important: Restricted Contacts</p>
                  <p>These individuals should NOT receive any patient information under any circumstances. 
                     Staff should be alerted if these individuals attempt to obtain information.</p>
                </div>
              </div>
            </TabsContent>

            {/* Sharing Preferences Tab */}
            <TabsContent value="preferences" className="space-y-4">
              <h3 className="text-base font-medium">Information Sharing Preferences</h3>

              <div className="space-y-4 p-4 border rounded-md bg-slate-50">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowClinical" className="flex-1">Clinical Information</Label>
                    <Switch
                      id="allowClinical"
                      checked={formData.sharingPreferences?.allowClinicalInformation ?? true}
                      onCheckedChange={(checked) => updateSharingPreference("allowClinicalInformation", checked)}
                    />
                  </div>
                  <p className="text-xs text-slate-500 pl-1">Diagnoses, test results, medications, treatments</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowLocation" className="flex-1">Location Information</Label>
                    <Switch
                      id="allowLocation"
                      checked={formData.sharingPreferences?.allowLocationInformation ?? true}
                      onCheckedChange={(checked) => updateSharingPreference("allowLocationInformation", checked)}
                    />
                  </div>
                  <p className="text-xs text-slate-500 pl-1">Room number, unit, facility information</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowFinancial" className="flex-1">Financial Information</Label>
                    <Switch
                      id="allowFinancial"
                      checked={formData.sharingPreferences?.allowFinancialInformation ?? false}
                      onCheckedChange={(checked) => updateSharingPreference("allowFinancialInformation", checked)}
                    />
                  </div>
                  <p className="text-xs text-slate-500 pl-1">Billing, insurance, payment information</p>
                </div>

                <div className="pt-2">
                  <Label htmlFor="customRestrictions" className="text-sm mb-1 block">Custom Restrictions or Notes</Label>
                  <Textarea
                    id="customRestrictions"
                    value={formData.sharingPreferences?.customRestrictions || ""}
                    onChange={(e) => updateSharingPreference("customRestrictions", e.target.value)}
                    placeholder="Enter any specific restrictions or special instructions"
                    rows={3}
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-md text-sm">
                <div className="flex items-start gap-2">
                  <ShieldAlert className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800">Patient Capacity Assessment</p>
                    <p className="text-blue-700 mb-2">Determine the patient's capacity to make healthcare decisions</p>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="capacityFull"
                          checked={formData.patientCapacity === "Full"}
                          onChange={() => updateFormData("patientCapacity", "Full")}
                          className="rounded-full h-4 w-4 text-blue-600"
                        />
                        <Label htmlFor="capacityFull" className="text-sm cursor-pointer">
                          Full Capacity - Patient can make all healthcare decisions
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="capacityLimited"
                          checked={formData.patientCapacity === "Limited"}
                          onChange={() => updateFormData("patientCapacity", "Limited")}
                          className="rounded-full h-4 w-4 text-blue-600"
                        />
                        <Label htmlFor="capacityLimited" className="text-sm cursor-pointer">
                          Limited Capacity - Some decisions require assistance
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="radio" 
                          id="capacityNone"
                          checked={formData.patientCapacity === "None"}
                          onChange={() => updateFormData("patientCapacity", "None")}
                          className="rounded-full h-4 w-4 text-blue-600"
                        />
                        <Label htmlFor="capacityNone" className="text-sm cursor-pointer">
                          No Capacity - Medical proxy makes all decisions
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
