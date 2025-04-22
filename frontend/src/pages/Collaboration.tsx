import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/authStore";
import { CollaborationBoard } from "components/CollaborationBoard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, MessageSquare, Bell } from "lucide-react";

export default function Collaboration() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [activeBoard, setActiveBoard] = useState("general");

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Handle board change
  const handleBoardChange = (boardId: string) => {
    setActiveBoard(boardId);
  };

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login
  }

  return (
    <div className="container max-w-6xl py-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold">Collaboration Center</h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Panel */}
        <div className="w-full md:w-64 space-y-4">
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" /> Team Boards
            </h3>
            <div className="space-y-1">
              <Button 
                variant={activeBoard === "general" ? "default" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => handleBoardChange("general")}
              >
                <MessageSquare className="h-4 w-4 mr-2" /> General
              </Button>
              <Button 
                variant={activeBoard === "clinical" ? "default" : "ghost"} 
                className="w-full justify-start" 
                onClick={() => handleBoardChange("clinical")}
              >
                <Bell className="h-4 w-4 mr-2" /> Clinical Updates
              </Button>
              {user.role === 'admin' && (
                <Button 
                  variant={activeBoard === "admin" ? "default" : "ghost"} 
                  className="w-full justify-start" 
                  onClick={() => handleBoardChange("admin")}
                >
                  <Users className="h-4 w-4 mr-2" /> Admin Only
                </Button>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-3">Active Users</h3>
            <p className="text-sm text-gray-500">Real-time collaboration</p>
            <p className="text-sm mt-2">
              You're currently signed in as <strong>{user.username}</strong> ({user.role})
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 bg-white rounded-lg border shadow-sm p-6">
          <CollaborationBoard boardId={activeBoard} />
        </div>
      </div>
    </div>
  );
}
