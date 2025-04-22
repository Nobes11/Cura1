import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RoomType, RoomStatus, roomStatuses } from "../utils/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  patientName: string;
  currentRoom: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newRoom: string) => void;
  occupiedRooms?: string[];
}

export const RoomChangeDialog: React.FC<Props> = ({
  patientName,
  currentRoom,
  isOpen,
  onClose,
  onSave,
  occupiedRooms = [],
}) => {
  // Function to get the color for room status
  const getStatusColor = (status: RoomStatus): string => {
    switch (status) {
      case 'ready':
        return 'bg-green-500';
      case 'dirty':
        return 'bg-amber-500';
      case 'cleaning':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const [newRoom, setNewRoom] = useState(currentRoom);
  const [roomType, setRoomType] = useState<"existing" | "custom">("existing");
  const [roomCategory, setRoomCategory] = useState<"standard" | "trauma" | "critical" | "psych" | "lobby">("standard");

  // All possible rooms
  const allRooms: RoomType[] = [
    "Lobby", 
    "Room 1", "Room 2", "Room 3", "Room 4", "Room 5", 
    "Room 6", "Room 7", "Room 8", "Room 9", "Room 10",
    "T-1", "T-2", // Trauma rooms
    "C-1", "C-2", // Critical rooms
    "P-1", "P-2", // Psych rooms
  ];
  
  // Filter out occupied rooms and current room
  // Always keep Lobby as an available option since it can have multiple patients
  const availableRooms: RoomType[] = allRooms.filter(room => 
    (room === "Lobby" || (room !== currentRoom && !occupiedRooms.includes(room)))
  );

  const handleSave = () => {
    if (newRoom.trim()) {
      onSave(newRoom);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Change Patient Room</DialogTitle>
          <DialogDescription>
            Move {patientName} from Room {currentRoom} to a new room.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="roomType" className="col-span-4">Room Selection Method</Label>
            <div className="col-span-4 flex gap-4">
              <Button 
                variant={roomType === "existing" ? "default" : "outline"}
                onClick={() => setRoomType("existing")}
                className="w-full"
              >
                Available Rooms
              </Button>
              <Button 
                variant={roomType === "custom" ? "default" : "outline"}
                onClick={() => setRoomType("custom")}
                className="w-full"
              >
                Custom Room
              </Button>
            </div>
          </div>

          {roomType === "existing" ? (
            <>
              <div className="grid grid-cols-1 items-center gap-4">
                <Label htmlFor="roomCategory">Room Category</Label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    size="sm"
                    variant={roomCategory === "standard" ? "default" : "outline"}
                    onClick={() => setRoomCategory("standard")}
                  >
                    Standard
                  </Button>
                  <Button 
                    size="sm"
                    variant={roomCategory === "trauma" ? "default" : "outline"}
                    onClick={() => setRoomCategory("trauma")}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Trauma
                  </Button>
                  <Button 
                    size="sm"
                    variant={roomCategory === "critical" ? "default" : "outline"}
                    onClick={() => setRoomCategory("critical")}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Critical
                  </Button>
                  <Button 
                    size="sm"
                    variant={roomCategory === "psych" ? "default" : "outline"}
                    onClick={() => setRoomCategory("psych")}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Psychiatric
                  </Button>
                  <Button 
                    size="sm"
                    variant={roomCategory === "lobby" ? "default" : "outline"}
                    onClick={() => setRoomCategory("lobby")}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Lobby
                  </Button>
                </div>
              </div>
            
              <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="col-span-4">Select Available Room</Label>
              <Select 
                defaultValue={availableRooms[0]} 
                onValueChange={setNewRoom}
              >
                <SelectTrigger className="col-span-4">
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms
                    .filter(room => {
                      if (roomCategory === "standard") return room.startsWith("Room");
                      if (roomCategory === "trauma") return room.startsWith("T-");
                      if (roomCategory === "critical") return room.startsWith("C-");
                      if (roomCategory === "psych") return room.startsWith("P-");
                      if (roomCategory === "lobby") return room === "Lobby";
                      return true;
                    })
                    .map((room) => (
                    <SelectItem key={room} value={room} className="flex items-center">
                      <div className="flex items-center space-x-2">
                        <span>{room}</span>
                        {room !== "Lobby" && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <span className={`inline-block w-3 h-3 rounded-full ml-2 ${getStatusColor(roomStatuses[room])}`}></span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="capitalize">{roomStatuses[room]} {roomStatuses[room] === 'cleaning' ? 'in progress' : ''}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            </>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customRoom" className="col-span-4">Enter Room Number</Label>
              <Input
                id="customRoom"
                value={newRoom}
                onChange={(e) => setNewRoom(e.target.value)}
                className="col-span-4"
                placeholder="Enter room number"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!newRoom.trim()}>Move Patient</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
