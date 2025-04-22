import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { toast } from "sonner";

interface ChartNote {
  id: string;
  timestamp: string;
  author: string;
  content: string;
  priority: string;
}

interface ChartNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chartNotes: ChartNote[];
  formatDateTime: (dateString: string) => string;
}

export function ChartNotesDialog({ 
  open, 
  onOpenChange, 
  chartNotes, 
  formatDateTime 
}: ChartNotesDialogProps) {
  const [newNote, setNewNote] = useState("");
  const [notePriority, setNotePriority] = useState("medium");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#7b9d8f]" />
            Staff Chart Notes
          </DialogTitle>
          <DialogDescription>
            Important patient information visible to all staff
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Add new chart note */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Add Chart Note</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea 
                  placeholder="Enter important information for staff (e.g., history of violent tendencies, special care needs)..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex justify-between items-center">
                  <div className="space-x-2">
                    <Select 
                      value={notePriority} 
                      onValueChange={setNotePriority}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="high">High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={() => {
                      if (newNote.trim()) {
                        toast.success("Chart note added");
                        setNewNote("");
                        setNotePriority("medium");
                      }
                    }}
                    disabled={!newNote.trim()}
                    className="bg-[#7b9d8f] hover:bg-[#c1632f]"
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing chart notes */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Existing Chart Notes</h3>
            {chartNotes.map((note) => (
              <Card key={note.id} className={`
                ${note.priority === 'high' ? 'border-red-200 bg-red-50' : 
                  note.priority === 'medium' ? 'border-amber-200 bg-amber-50' : 
                  'border-slate-200 bg-slate-50'}
              `}>
                <CardContent className="p-4">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium text-sm flex items-center gap-2">
                      <span>{note.author}</span>
                      <span className="text-slate-500 text-xs">{formatDateTime(note.timestamp)}</span>
                    </div>
                    <Badge className={`
                      ${note.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' : 
                        note.priority === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' : 
                        'bg-slate-100 text-slate-800 border-slate-200'}
                    `}>
                      {note.priority.charAt(0).toUpperCase() + note.priority.slice(1)} Priority
                    </Badge>
                  </div>
                  <p className="text-sm whitespace-pre-line">{note.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}