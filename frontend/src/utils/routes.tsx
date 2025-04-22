import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from './authStore';

// Wrapper for routes that require authentication
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();

  // Check if the admin account is already created
  const checkForAdminUser = async () => {
    try {
      // Logic to check if admin exists
      // This would typically query Firestore
      return false; // No admin exists
    } catch (err) {
      console.error('Error checking for admin user:', err);
      return false;
    }
  };

  // If still loading auth state, show nothing (could add a spinner here)
  if (isLoading) {
    return <div className="p-4 flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the children
  return <>{children}</>;
};

// Wrapper for routes that should only be accessible when NOT authenticated
export const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // If still loading auth state, show nothing
  if (isLoading) {
    return <div className="p-4 flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // If authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // User is not authenticated, render the children
  return <>{children}</>;
};

// Special route for admin setup that's only accessible if no users exist
export const AdminSetupRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // This route is always accessible for now, to allow creating the initial admin
  // In a real app, you would check if any admin users exist first
  return <>{children}</>;
};
