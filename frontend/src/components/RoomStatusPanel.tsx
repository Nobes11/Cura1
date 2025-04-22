import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import * as mockData from "../utils/mockData";
import { RoomType, RoomStatus } from "../utils/mockData";
import { Badge } from "@/components/ui/badge";

interface Props {
  occupiedRooms: string[];
  onUpdateRoomStatus: (roomId: RoomType, newStatus: RoomStatus) => void;
}

export const RoomStatusPanel: React.FC<Props> = ({ occupiedRooms, onUpdateRoomStatus }) => {
  // Group rooms by status
  const roomsByStatus = Object.entries(mockData.roomStatuses)
    .reduce<Record<RoomStatus, RoomType[]>>(
      (acc, [roomId, status]) => {
        // Skip Lobby and occupied rooms
        if (roomId === 'Lobby' || occupiedRooms.includes(roomId)) return acc;
        
        if (!acc[status]) acc[status] = [];
        acc[status].push(roomId as RoomType);
        return acc;
      },
      { ready: [], dirty: [], cleaning: [] }
    );
  
  // Get count of rooms by status
  const readyCount = roomsByStatus.ready.length;
  const dirtyCount = roomsByStatus.dirty.length;
  const cleaningCount = roomsByStatus.cleaning.length;
  
  // Get next status in workflow
  const getNextStatus = (currentStatus: RoomStatus): RoomStatus => {
    switch (currentStatus) {
      case 'ready': return 'dirty';
      case 'dirty': return 'cleaning';
      case 'cleaning': return 'ready';
      default: return 'ready';
    }
  };
  
  // Room status colors
  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case 'ready': return 'bg-green-500';
      case 'dirty': return 'bg-amber-500';
      case 'cleaning': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Move room to next status
  const moveToNextStatus = (roomId: RoomType, currentStatus: RoomStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    onUpdateRoomStatus(roomId, nextStatus);
  };

  // Button text for each status
  const getActionText = (currentStatus: RoomStatus) => {
    switch (currentStatus) {
      case 'ready': return 'Mark Dirty';
      case 'dirty': return 'Start Cleaning';
      case 'cleaning': return 'Mark Ready';
      default: return 'Update';
    }
  };

  return (
    <div className="rounded-md bg-background">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-[#173F5F]">Room Status Management</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Ready: {readyCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Dirty: {dirtyCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Cleaning: {cleaningCount}</span>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="ready" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="ready" className="flex items-center justify-center">
            Ready
            <Badge variant="secondary" className="ml-2">{readyCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="dirty" className="flex items-center justify-center">
            Dirty
            <Badge variant="secondary" className="ml-2">{dirtyCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="cleaning" className="flex items-center justify-center">
            Cleaning
            <Badge variant="secondary" className="ml-2">{cleaningCount}</Badge>
          </TabsTrigger>
        </TabsList>
        
        {/* Ready Rooms Tab */}
        <TabsContent value="ready" className="space-y-4">
          {roomsByStatus.ready.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No available ready rooms</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {roomsByStatus.ready.map((roomId) => (
                <div key={roomId} className="border rounded-md p-2 flex flex-col items-center">
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor('ready')} mr-2`}></div>
                    <span className="font-medium">{roomId}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-1"
                    onClick={() => moveToNextStatus(roomId, 'ready')}
                  >
                    {getActionText('ready')}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Dirty Rooms Tab */}
        <TabsContent value="dirty" className="space-y-4">
          {roomsByStatus.dirty.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No dirty rooms</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {roomsByStatus.dirty.map((roomId) => (
                <div key={roomId} className="border rounded-md p-2 flex flex-col items-center">
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor('dirty')} mr-2`}></div>
                    <span className="font-medium">{roomId}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-1"
                    onClick={() => moveToNextStatus(roomId, 'dirty')}
                  >
                    {getActionText('dirty')}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Cleaning Rooms Tab */}
        <TabsContent value="cleaning" className="space-y-4">
          {roomsByStatus.cleaning.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No rooms being cleaned</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {roomsByStatus.cleaning.map((roomId) => (
                <div key={roomId} className="border rounded-md p-2 flex flex-col items-center">
                  <div className="flex items-center mb-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor('cleaning')} mr-2`}></div>
                    <span className="font-medium">{roomId}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-1"
                    onClick={() => moveToNextStatus(roomId, 'cleaning')}
                  >
                    {getActionText('cleaning')}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
