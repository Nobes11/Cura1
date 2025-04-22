import React, { useEffect } from 'react';
import ErrorBoundary from 'components/ErrorBoundary';

interface Props {
  children: React.ReactNode;
}

/**
 * A provider that handles errors throughout the application
 * This component implements both error boundary and error event listeners
 */
export const ErrorHandlingProvider: React.FC<Props> = ({ children }) => {
  useEffect(() => {
    // Custom handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Prevent the default handler
      event.preventDefault();
    };

    // Add global error handlers
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Clean up event listeners on unmount
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};
