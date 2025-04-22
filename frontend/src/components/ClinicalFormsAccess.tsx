import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, ClipboardList, FileDown } from "lucide-react";

// Types for clinical forms
interface ClinicalForm {
  id: string;
  name: string;
  description: string;
  category: string;
  lastUpdated: string;
}

interface ClinicalFormsAccessProps {
  patientId: string;
  patientName: string;
}

export const ClinicalFormsAccess: React.FC<ClinicalFormsAccessProps> = ({
  patientId,
  patientName
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Mock clinical forms data
  const mockForms: ClinicalForm[] = [
    {
      id: "form1",
      name: "Consent for Treatment",
      description: "Standard consent form for medical treatment",
      category: "consent",
      lastUpdated: "2025-01-15"
    },
    {
      id: "form2",
      name: "Advance Directive",
      description: "Form to document patient's advance directives and end-of-life wishes",
      category: "legal",
      lastUpdated: "2025-02-20"
    },
    {
      id: "form3",
      name: "Surgical Consent",
      description: "Informed consent for surgical procedures",
      category: "consent",
      lastUpdated: "2025-03-10"
    },
    {
      id: "form4",
      name: "Fall Risk Assessment",
      description: "Assessment to identify patients at risk for falls",
      category: "assessment",
      lastUpdated: "2025-03-05"
    },
    {
      id: "form5",
      name: "Discharge Instructions",
      description: "Standard discharge instructions template",
      category: "discharge",
      lastUpdated: "2025-02-28"
    },
    {
      id: "form6",
      name: "Pain Assessment",
      description: "Comprehensive pain assessment form",
      category: "assessment",
      lastUpdated: "2025-01-30"
    },
  ];
  
  // Filter forms based on search term and category
  const filteredForms = mockForms.filter(form => {
    const matchesSearch = form.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         form.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || form.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Clinical Forms for {patientName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="consent">Consent Forms</SelectItem>
                <SelectItem value="legal">Legal Documents</SelectItem>
                <SelectItem value="assessment">Assessments</SelectItem>
                <SelectItem value="discharge">Discharge Forms</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredForms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-slate-500">
                    No forms found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredForms.map(form => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.name}</TableCell>
                    <TableCell>{form.description}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {form.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{form.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Fill
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileDown className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
