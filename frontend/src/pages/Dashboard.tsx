import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/authStore";
import PatientTrackingBoard from "../components/PatientTrackingBoard";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, Settings, ShieldCheck } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorBoundary from "components/ErrorBoundary";

// Skeleton loader for the dashboard
const DashboardSkeleton = () => {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-[600px] w-full rounded-md" />
    </div>
  );
};

export default function Dashboard() {
  // State for dashboard content visibility
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
  
  const { user, logout, isAuthenticated, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
    
    // Force auth state refresh when navigating back to dashboard
    const authStateCheck = () => {
      const { isAuthenticated: currentAuthState } = useAuthStore.getState();
      if (!currentAuthState) {
        // If somehow auth state was lost, try to restore from localStorage
        const localAuth = localStorage.getItem('cura-auth');
        const localUser = localStorage.getItem('cura-user');
        if (localAuth === 'true' && localUser) {
          // Manually restore auth state if needed
          console.log("Restoring auth state from localStorage");
        } else {
          navigate("/login");
        }
      }
    };
    
    // Run auth check immediately
    authStateCheck();
    
    // Set up event listener for focus to check auth again
    window.addEventListener('focus', authStateCheck);
    
    // Clean up
    return () => {
      window.removeEventListener('focus', authStateCheck);
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated || !user) {
    return null; // Don't render anything until redirect happens
  }

  // Memoize the role-specific content to avoid unnecessary recalculations
  const getRoleSpecificContent = useCallback(() => {
    switch (user.role) {
      case "admin":
        return {
          greeting: "Administrator Dashboard",
          hint: "You have full access to all system functions"
        };
      case "physician":
        return {
          greeting: "Physician Dashboard",
          hint: "View your patients and make clinical decisions"
        };
      case "nurse":
        return {
          greeting: "Nurse Dashboard",
          hint: "Track patients and document care activities"
        };
      case "clerk":
        return {
          greeting: "Clerk Dashboard",
          hint: "Manage patient registration and basic information"
        };
      default:
        return {
          greeting: "Dashboard",
          hint: "Welcome to the ED Tracking System"
        };
    }
  }, [user?.role]);

  const { greeting, hint } = getRoleSpecificContent();

  const toggleDashboard = () => {
    setIsDashboardVisible(!isDashboardVisible);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 onClick={toggleDashboard} className="text-xl font-bold cursor-pointer hover:text-gray-600 transition-colors">{greeting}</h1>
          </div>

          
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user?.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin-user-management")}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    <span>User Management</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate("/user-settings")}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {isDashboardVisible && (
        <div className="container mx-auto py-6 px-4">
        <p className="text-gray-500 mb-6">{hint}</p>

        <div className="w-full">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Patient Tracking</h2>
              <Button size="sm" variant="outline" onClick={() => navigate('/PatientChart')}>
                View All Patients
              </Button>
            </div>
            <ErrorBoundary>
              <Suspense fallback={<DashboardSkeleton />}>
                <PatientTrackingBoard />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
