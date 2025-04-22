import React from 'react';
import { useAuthStore } from '../utils/authStore';

interface SimpleLayoutProps {
  children: React.ReactNode;
}

export const SimpleLayout: React.FC<SimpleLayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  // If not authenticated, just render children without any extra styling
  if (!isAuthenticated) {
    return <>{children}</>;
  }
  
  // Simplified layout with just the main content area, no sidebar
  return (
    <div className="min-h-screen" style={{backgroundColor: '#f5e6c8'}}>
      <main className="h-full w-full max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};
