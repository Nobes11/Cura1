import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/authStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePatientContext } from "../utils/PatientContext";
import { 
  Calendar, 
  ClipboardList, 
  MessageSquare, 
  StickyNote, 
  LogOut, 
  FileText, 
  Mail, 
  ShoppingBasket,
  Plus,
  RefreshCw,
  Car,
  Pill
} from "lucide-react";
import { getUnreadMessagesCount } from "../utils/messageData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";

import { formatUsername } from "../utils/formatUsername";

export const NavigationBar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { patientDetailOpen } = usePatientContext();
  
  // Mock basket count
  const [basketCount, setBasketCount] = useState<number>(2);
  
  // Count consulted patients - temporarily disable until we have proper patient data
  const consultedCount = 0; // Disabled until we have proper data
  // Search functionality
  const [searchTerm, setSearchTerm] = useState("");
  
  const handleLogout = () => {
    logout();
    navigate("/Login");
  };

  const handleRefresh = () => {
    toast.success("Data refreshed");
    console.log("Refreshing data...");
  };
  
  return (
    <div className="w-full bg-white border-b shadow-sm z-30">
      <div className="px-3 py-2">
        <div className="flex justify-start items-center w-full gap-2 overflow-x-auto">
          <NavigationItem 
            icon={<Calendar className="h-5 w-5 text-blue-600" />}
            label="Schedule"
            onClick={() => navigate("/Schedule")}
          />
          <NavigationItem 
            icon={<ClipboardList className="h-5 w-5 text-green-600" />}
            label="Patient List"
            onClick={() => navigate("/Dashboard")}
          />
          <NavigationItem 
            icon={<div className="h-5 w-5 bg-blue-300 rounded-sm flex items-center justify-center shadow-sm"><MessageSquare className="h-3 w-3 text-blue-800" /></div>}
            label="Communications"
            badge={consultedCount}
            onClick={() => navigate("/Consults")}
          />
          <NavigationItem 
            icon={<div className="h-5 w-5 bg-yellow-300 rounded-sm flex items-center justify-center shadow-sm"><StickyNote className="h-3 w-3 text-yellow-800" /></div>}
            label="New Note"
            onClick={() => alert("Create new sticky note")}
            disabled={!patientDetailOpen}
          />
          <NavigationItem 
            icon={<div className="h-5 w-5 bg-yellow-300 rounded-sm flex items-center justify-center shadow-sm"><StickyNote className="h-3 w-3 text-yellow-800" /></div>}
            label="View Notes"
            onClick={() => alert("View sticky notes")}
            disabled={!patientDetailOpen}
          />
          <NavigationItem 
            icon={<Car className="h-5 w-5 text-red-600" />}
            label="Discharge"
            onClick={() => alert("Discharge patient")}
            disabled={!patientDetailOpen}
          />
          <NavigationItem 
            icon={<FileText className="h-5 w-5 text-blue-500" />}
            label="Forms"
            onClick={() => alert("View forms")}
          />
          <NavigationItem 
            icon={<Pill className="h-5 w-5 text-green-500" />}
            label="Pharmacy"
            onClick={() => alert("Patient Pharmacy")}
            disabled={!patientDetailOpen}
          />
          <NavigationItem 
            icon={<Mail className="h-5 w-5 text-blue-400" />}
            label="Portal"
            onClick={() => alert("Portal Invite")}
          />
          <NavigationItem 
            icon={<Plus className="h-5 w-5 text-indigo-600" />}
            label="Add Patient"
            onClick={() => alert("Add Patient")}
          />
          
          <div className="ml-auto flex items-center space-x-3">
            {/* Refresh button - moved to left of basket */}
            <div className="flex flex-col items-center cursor-pointer" onClick={handleRefresh}>
              <RefreshCw className="h-6 w-6 text-gray-700" />
              <span className="text-[10px] mt-1 text-gray-600">Refresh</span>
            </div>
            
            {/* Basket Icon with Counter */}
            <div className="flex flex-col items-center">
              <div className="relative cursor-pointer" onClick={() => alert("Open basket")}>
                <ShoppingBasket className="h-6 w-6 text-gray-700" />
                {basketCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 py-0 min-w-[1.25rem] flex items-center justify-center">
                    {basketCount}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] mt-1 text-gray-600">Basket</span>
            </div>

            {/* Search box - moved between basket and logout */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 w-40 text-xs pl-8 pr-2 rounded border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <svg className="w-4 h-4 text-gray-500 absolute left-2 top-1/2 transform -translate-y-1/2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Logout Button */}
            <div className="flex flex-col items-center cursor-pointer" onClick={handleLogout}>
              <LogOut className="h-6 w-6 text-gray-700" />
              <span className="text-[10px] mt-1 text-gray-600">Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface NavigationItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  badge?: number;
  disabled?: boolean;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ icon, label, onClick, badge, disabled = false }) => {
  return (
    <div className="flex flex-col items-center">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClick}
        className={`relative p-1 h-auto w-auto ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        disabled={disabled}
      >
        {icon}
        {badge && badge > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 py-0 min-w-[1.25rem] flex items-center justify-center">
            {badge}
          </Badge>
        )}
      </Button>
      <span className={`text-[10px] mt-1 ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
    </div>
  );
};

