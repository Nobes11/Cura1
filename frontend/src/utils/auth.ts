import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';

export interface User {
  id: string;
  username: string;
  fullName: string;
  initials: string;
  role?: string;
  name?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  getCurrentUser: () => User | null;
}

// Mock users database
const USERS: User[] = [
  {
    id: '1',
    username: 'guest',
    fullName: 'Guest User',
    name: 'Guest User',
    initials: 'GU',
    role: 'CCMA',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg'
  },
  {
    id: '2',
    username: 'jdoe',
    fullName: 'John Doe',
    name: 'John Doe',
    initials: 'JD',
    role: 'doctor',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  {
    id: '3',
    username: 'msmith',
    fullName: 'Maria Smith',
    name: 'Maria Smith',
    initials: 'MS',
    role: 'nurse',
    avatar: 'https://randomuser.me/api/portraits/women/22.jpg'
  },
  {
    id: '4',
    username: 'agarcia',
    fullName: 'Alex Garcia',
    name: 'Alex Garcia',
    initials: 'AG',
    role: 'clerk',
    avatar: 'https://randomuser.me/api/portraits/men/35.jpg'
  }
];

// Helper to validate usernames
export const isValidUsername = (username: string): boolean => {
  if (!username) return false;
  if (username.length > 20) return false;
  
  // First initial + last name pattern (relaxed to allow various formats)
  const pattern = /^[a-zA-Z0-9._-]{1,20}$/;
  return pattern.test(username);
};

// Authentication store with persistence
export const useAuthStore = create<AuthState>(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (username: string, password: string) => {
        // In a real app, this would validate against an API
        // Here we just check against our mock data
        // Note: password is ignored in this mock version
        
        const foundUser = USERS.find(u => 
          u.username.toLowerCase() === username.toLowerCase());
        
        if (foundUser) {
          set({ user: foundUser, isAuthenticated: true });
          return true;
        }
        
        return false;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      getCurrentUser: () => {
        return get().user;
      }
    }),
    {
      name: 'ed-tracking-auth',
    }
  )
);

// Helper to get user initials for activity tracking
export interface UserInfo {
  userId: string;
  name: string;
  role: string;
  avatar?: string;
  permissions?: string[];
}

// Get the current logged in user info
export const getUserInfo = (): UserInfo => {
  // In a real app, this would come from an auth provider or context
  // For demo purposes, we'll return a mock user
  return {
    userId: "user-123",
    name: "Dr. Sarah Johnson",
    role: "Physician",
    permissions: ["chart_access", "order_create", "note_create", "medication_admin"]
  };
};

// Get initials from a name
export const getUserInitials = (name: string): string => {
  if (!name) return "";
  const names = name.split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};

export const calculateTimeElapsed = (arrivalTime: string) => {
  const arrival = new Date(arrivalTime);
  const now = new Date();
  const diffMs = now.getTime() - arrival.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const getCurrentUserInitials = (): string => {
  const user = useAuthStore.getState().user;
  return user?.initials || 'SYSTEM';
};

// Helper to create activity stamp
export const createActivityStamp = (): string => {
  const user = useAuthStore.getState().user;
  const initials = user?.initials || 'SYSTEM';
  const now = new Date();
  
  // Format: CNP - 04/08/2025 10:45 AM
  const formattedDate = now.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  });
  
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  return `${initials} - ${formattedDate} ${formattedTime}`;
};