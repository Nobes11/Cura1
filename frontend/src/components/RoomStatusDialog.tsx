import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RoomType, RoomStatus } from "../utils/mockData";
import { Badge } from "@/components/ui/badge";

interface Props {
  roomId: RoomType;
  currentStatus: RoomStatus;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (roomId: RoomType, newStatus: RoomStatus) => void;
}

export const RoomStatusDialog: React.FC<Props> = ({
  roomId,
  currentStatus,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  // Function to get status badge style
  const getStatusBadge = (status: RoomStatus, isSelected: boolean = false) => {
    const baseClass = "px-3 py-2 rounded-md flex items-center justify-center cursor-pointer transition-all";
    const selectedClass = isSelected ? "ring-2 ring-offset-2 ring-primary" : "";
    
    switch (status) {
      case 'ready':
        return (
          <div className={`${baseClass} ${selectedClass} bg-green-100 text-green-800 border border-green-300`}>
            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
            Ready
          </div>
        );
      case 'dirty':
        return (
          <div className={`${baseClass} ${selectedClass} bg-amber-100 text-amber-800 border border-amber-300`}>
            <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
            Dirty
          </div>
        );
      case 'cleaning':
        return (
          <div className={`${baseClass} ${selectedClass} bg-blue-100 text-blue-800 border border-blue-300`}>
            <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
            Cleaning
          </div>
        );
      default:
        return (
          <div className={`${baseClass} ${selectedClass} bg-gray-100 text-gray-800 border border-gray-300`}>
            <div className="h-3 w-3 rounded-full bg-gray-500 mr-2"></div>
            {status}
          </div>
        );
    }
  };

  // Get next valid transitions based on current status
  const getValidTransitions = () => {
    switch (currentStatus) {
      case 'ready':
        return ['dirty']; // Ready rooms can only become dirty
      case 'dirty':
        return ['cleaning']; // Dirty rooms can only be cleaned
      case 'cleaning':
        return ['ready']; // Cleaning rooms can only become ready
      default:
        return ['ready', 'dirty', 'cleaning'];
    }
  };

  // State for selected status
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus | null>(null);
  
  // Handle status update
  const handleUpdateStatus = () => {
    if (selectedStatus) {
      onUpdateStatus(roomId, selectedStatus);
      onClose();
    }
  };

  const validTransitions = getValidTransitions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Update Room Status for {roomId}</DialogTitle>
          <DialogDescription>
            Current status: {getStatusBadge(currentStatus)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="text-sm font-medium">Select new status:</div>
          
          <div className="grid grid-cols-1 gap-3">
            {validTransitions.map((status) => (
              <div
                key={status}
                onClick={() => setSelectedStatus(status as RoomStatus)}
                className="cursor-pointer"
              >
                {getStatusBadge(status as RoomStatus, selectedStatus === status)}
              </div>
            ))}
          </div>

          {selectedStatus && (
            <div className="text-sm text-muted-foreground">
              {selectedStatus === 'ready' && 
                "This room will be marked as ready for new patients."}
              {selectedStatus === 'dirty' && 
                "This room needs cleaning before it can be used again."}
              {selectedStatus === 'cleaning' && 
                "This room is currently being cleaned."}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleUpdateStatus} 
            disabled={!selectedStatus}
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
