import React, { useState, useEffect, useRef } from "react";
import { Patient } from "../utils/mockData";

interface Props {
  children: React.ReactNode;
  patient: Patient;
  onAction: (action: string, patient: Patient) => void;
}

export const ContextMenuWrapper: React.FC<Props> = ({ children, patient, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close the menu if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    // Calculate position relative to the viewport
    const x = e.clientX;
    const y = e.clientY;
    
    // Check if we're near the right edge of the screen
    const rightEdgeDistance = window.innerWidth - x;
    const bottomEdgeDistance = window.innerHeight - y;
    
    // If we're too close to the right edge, adjust the position
    const adjustedX = rightEdgeDistance < 200 ? x - 200 : x;
    const adjustedY = bottomEdgeDistance < 300 ? y - 300 : y;
    
    setPosition({ x: adjustedX, y: adjustedY });
    setIsOpen(true);
  };

  return (
    <div 
      ref={wrapperRef}
      onContextMenu={handleContextMenu}
      style={{ position: "relative" }}
    >
      {children}
      
      {isOpen && (
        <div 
          ref={menuRef}
          className="absolute z-50 bg-white shadow-lg rounded-md border border-gray-200 py-1 w-64 text-sm"
          style={{ 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            position: "fixed" 
          }}
        >
          <div className="px-3 py-2 font-medium border-b">
            {patient.name}
            <span className="block text-xs text-muted-foreground">
              {patient.age}y, {patient.gender} • Room {patient.room}
            </span>
          </div>
          
          <div className="py-1">
            <button 
              className="w-full text-left px-4 py-1.5 hover:bg-sky-50 flex items-center space-x-2"
              onClick={() => { onAction("assignProvider", patient); setIsOpen(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              <span>Assign Provider</span>
            </button>
            
            <button 
              className="w-full text-left px-4 py-1.5 hover:bg-sky-50 flex items-center space-x-2"
              onClick={() => { onAction("updateLocation", patient); setIsOpen(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              <span>Update Location</span>
            </button>
            
            <button 
              className="w-full text-left px-4 py-1.5 hover:bg-sky-50 flex items-center space-x-2"
              onClick={() => { onAction("updateStatus", patient); setIsOpen(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              <span>Update Status</span>
            </button>
          </div>
          
          <div className="border-t py-1">
            <button 
              className="w-full text-left px-4 py-1.5 hover:bg-sky-50 flex items-center space-x-2"
              onClick={() => { onAction("placeOrders", patient); setIsOpen(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
              <span>Place Orders</span>
            </button>
            
            <button 
              className="w-full text-left px-4 py-1.5 hover:bg-sky-50 flex items-center space-x-2"
              onClick={() => { onAction("addNote", patient); setIsOpen(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              <span>Add Note</span>
            </button>
            
            <button 
              className="w-full text-left px-4 py-1.5 hover:bg-sky-50 flex items-center space-x-2"
              onClick={() => { onAction("toggleProtocol", patient); setIsOpen(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              <span>Toggle Protocol</span>
            </button>
          </div>
          
          <div className="border-t py-1">
            <button 
              className="w-full text-left px-4 py-1.5 hover:bg-sky-50 flex items-center space-x-2"
              onClick={() => { onAction("startDischarge", patient); setIsOpen(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              <span>Start Discharge</span>
            </button>
            
            <button 
              className="w-full text-left px-4 py-1.5 hover:bg-sky-50 flex items-center space-x-2 text-red-600"
              onClick={() => { onAction("escalate", patient); setIsOpen(false); }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 1.5H8.25A1.5 1.5 0 0 0 6.75 3v.75"></path><path d="M10.5 4.5v3a1.5 1.5 0 0 0 1.5 1.5h3"></path><path d="M18.75 6.75h.75a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h.75"></path><path d="m13.5 7.5 7.5 7.5"></path><path d="M12 21a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5"></path></svg>
              <span>Escalate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
