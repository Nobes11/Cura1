import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Info, FileText, TrendingUp, AlertCircle } from 'lucide-react';

export interface LabResult {
  id: string;
  name: string;
  category: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'canceled';
  priority: 'routine' | 'stat' | 'urgent';
  orderedBy: string;
  components?: LabComponent[];
  notes?: string;
}

export interface LabComponent {
  id: string;
  name: string;
  value: string | number;
  units: string;
  referenceRange: string;
  abnormal: boolean;
  critical?: boolean;
  previousResults?: {
    timestamp: string;
    value: number;
  }[];
}

interface PatientLabResultsProps {
  results: LabResult[];
}

export const PatientLabResults: React.FC<PatientLabResultsProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<LabComponent | null>(null);
  const [trendingDialogOpen, setTrendingDialogOpen] = useState(false);

  // Group results by category
  const categories = [...new Set(results.map(r => r.category))];
  
  // Sort results by timestamp, newest first
  const sortedResults = [...results].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  // Filter results based on active tab
  const filteredResults = activeTab === "all" 
    ? sortedResults 
    : sortedResults.filter(r => r.category === activeTab);
  
  // Format date from timestamp
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  // Format time from timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      case 'canceled':
        return <Badge className="bg-slate-100 text-slate-800 border-slate-300">Canceled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get priority badge color
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

  const handleViewDetails = (result: LabResult) => {
    setSelectedResult(result);
    setOpenDialog(true);
  };

  const handleViewTrend = (component: LabComponent) => {
    setSelectedComponent(component);
    setTrendingDialogOpen(true);
  };

  // Render trend chart for a lab component
  const renderTrendChart = (component: LabComponent) => {
    if (!component.previousResults || component.previousResults.length < 2) {
      return (
        <div className="flex items-center justify-center h-[250px] text-slate-500">
          Not enough data for trending
        </div>
      );
    }

    // Prepare data for chart - include current result
    const currentValue = typeof component.value === 'number' ? component.value : parseFloat(component.value) || 0;
    
    const chartData = [
      ...component.previousResults,
      { timestamp: new Date().toISOString(), value: currentValue }
    ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    // Extract reference range as numbers if possible
    let refMin = null;
    let refMax = null;
    
    const refRangeMatch = component.referenceRange.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
    if (refRangeMatch) {
      refMin = parseFloat(refRangeMatch[1]);
      refMax = parseFloat(refRangeMatch[2]);
    }

    return (
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()} 
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
            <Tooltip 
              labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
              formatter={(value) => [value + ` ${component.units}`, component.name]}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#2563eb" 
              strokeWidth={2}
              dot={{ fill: '#2563eb', strokeWidth: 2 }} 
              activeDot={{ r: 8 }} 
            />
            {refMin !== null && (
              <ReferenceLine y={refMin} stroke="#9ca3af" strokeDasharray="3 3" label={{ value: 'Min', position: 'insideBottomLeft', fontSize: 10 }} />
            )}
            {refMax !== null && (
              <ReferenceLine y={refMax} stroke="#9ca3af" strokeDasharray="3 3" label={{ value: 'Max', position: 'insideTopLeft', fontSize: 10 }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Laboratory Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="px-4 pt-0 pb-3 border-b w-full justify-start overflow-x-auto">
              <TabsTrigger value="all" className="rounded-sm">All</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="rounded-sm">{category}</TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={activeTab} className="p-4">
              {filteredResults.length > 0 ? (
                <div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredResults.map(result => (
                          <TableRow key={result.id}>
                            <TableCell className="font-medium">{result.name}</TableCell>
                            <TableCell>
                              {formatDate(result.timestamp)}
                              <div className="text-xs text-slate-500">{formatTime(result.timestamp)}</div>
                            </TableCell>
                            <TableCell>{getStatusBadge(result.status)}</TableCell>
                            <TableCell>{getPriorityBadge(result.priority)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleViewDetails(result)}>
                                <Info className="h-4 w-4 mr-1" />
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center text-slate-500">
                  No laboratory results available
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedResult?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <p className="text-sm text-slate-500">Ordered By</p>
                <p className="font-medium">{selectedResult?.orderedBy}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Date & Time</p>
                <p className="font-medium">
                  {selectedResult ? formatDate(selectedResult.timestamp) : ''}
                  <span className="ml-1 text-sm text-slate-500">
                    {selectedResult ? formatTime(selectedResult.timestamp) : ''}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <div>{selectedResult ? getStatusBadge(selectedResult.status) : ''}</div>
              </div>
              <div>
                <p className="text-sm text-slate-500">Priority</p>
                <div>{selectedResult ? getPriorityBadge(selectedResult.priority) : ''}</div>
              </div>
            </div>
            
            {selectedResult?.notes && (
              <div className="mb-4 p-3 bg-slate-50 rounded-md text-sm">
                <p className="font-medium text-slate-700 mb-1">Notes</p>
                <p>{selectedResult.notes}</p>
              </div>
            )}
            
            {selectedResult?.components && selectedResult.components.length > 0 ? (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Test Results</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Component</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Units</TableHead>
                        <TableHead>Reference Range</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedResult.components.map(component => (
                        <TableRow key={component.id}>
                          <TableCell className="font-medium">
                            {component.name}
                            {component.critical && (
                              <Badge className="ml-2 bg-red-100 text-red-800 border-red-300">Critical</Badge>
                            )}
                          </TableCell>
                          <TableCell className={component.abnormal ? "font-bold text-red-600" : ""}>
                            {component.value}
                            {component.abnormal && !component.critical && (
                              <AlertCircle className="h-4 w-4 inline-block ml-1 text-amber-500" />
                            )}
                            {component.critical && (
                              <AlertCircle className="h-4 w-4 inline-block ml-1 text-red-500" />
                            )}
                          </TableCell>
                          <TableCell>{component.units}</TableCell>
                          <TableCell>{component.referenceRange}</TableCell>
                          <TableCell className="text-right">
                            {component.previousResults && component.previousResults.length > 0 && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleViewTrend(component)}
                                className="text-xs"
                              >
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trend
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
              <div className="py-4 text-center text-slate-500">
                No result details available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Trending Dialog */}
      <Dialog open={trendingDialogOpen} onOpenChange={setTrendingDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedComponent?.name} Trend
              <span className="ml-2 text-sm font-normal text-slate-500">({selectedComponent?.units})</span>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {selectedComponent && renderTrendChart(selectedComponent)}
            <div className="mt-4 text-sm text-slate-500">
              <p className="flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Reference Range: {selectedComponent?.referenceRange}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
