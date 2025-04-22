import type { ReactNode } from "react";
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/ThemeProvider";
// CookiesProvider removed as it's not available
import { ErrorHandlingProvider } from "../utils/ErrorHandlingProvider";
import { AuthProvider } from "../utils/AuthContext";
import { Suspense } from "react";
import { SuspenseWrapper } from "./SuspenseWrapper";
import { FeedbackWidget } from "./FeedbackWidget";
import { useAuthStore } from "../utils/authStore";
import { SimpleLayout } from "./SimpleLayout";
import { NavigationBar } from "./NavigationBar";
import { PatientProvider, usePatientContext } from "../utils/PatientContext";
// Import Firebase Auth components
import { firebaseApp, firebaseAuth } from "app";
// These imports are available through the app module from the Firebase Auth extension
// Theme colors are now in index.css (global styles)

interface Props {
  children: ReactNode;
}

/**
 * A provider wrapping the whole app.
 *
 * You can add multiple providers here by nesting them,
 * and they will all be applied to the app.
 */
export const AppProvider: React.FC<Props> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <ErrorHandlingProvider>
      <ThemeProvider>
        
          <AuthProvider>
            <Toaster position="top-right" closeButton richColors />
            <PatientProvider>
              {isAuthenticated && /* <NavigationBar /> */null}
              <SimpleLayout>
                {children}
              </SimpleLayout>
              {isAuthenticated && <FeedbackWidget />}
            </PatientProvider>
          </AuthProvider>
        
      </ThemeProvider>
    </ErrorHandlingProvider>
  );
};

// Export SuspenseWrapper to make it available in the global scope for router.tsx
export { SuspenseWrapper };