import { createContext, useContext, ReactNode, useEffect } from "react";
import { useAuthStore, User, initAuthListener } from "./authStore";
import { useCurrentUser } from "app";
import { firebaseAuth } from "app";
import type { User as FirebaseUser } from "firebase/auth";

// Define the auth context type
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  firebaseUser: FirebaseUser | null;
}

// Create the context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Named export for the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const store = useAuthStore();
  const { user: firebaseUser, loading } = useCurrentUser();
  
  // Initialize the auth listener when the app loads
  useEffect(() => {
    initAuthListener();
  }, []);
  
  // Create a context-compatible interface from the Zustand store
  const contextValue: AuthContextType = {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isAdmin: store.isAdmin,
    login: store.login,
    logout: store.logout,
    firebaseUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Named export for the hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Fall back to direct store access if context is not available
    // This allows components to work without needing to be wrapped in provider
    const store = useAuthStore();
    const { user: firebaseUser } = useCurrentUser();
    return {
      user: store.user,
      isAuthenticated: store.isAuthenticated,
      isAdmin: store.isAdmin,
      login: store.login,
      logout: store.logout,
      firebaseUser
    };
  }
  return context;
}
