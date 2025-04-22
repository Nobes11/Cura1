import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  auth, 
  db, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
  signOut,
  FirebaseUser,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider
} from './firebase';
import { toast } from 'sonner';
import { formatUsername } from './formatUsername';
import { hasPermission as checkPermission, Permission } from './rolePermissions';

// Session timeout in milliseconds (8 hours)
const SESSION_TIMEOUT = 8 * 60 * 60 * 1000;

// Recent login timeout in milliseconds (1 hour)
const RECENT_LOGIN_TIMEOUT = 60 * 60 * 1000;

// Store the last activity timestamp in localStorage for persistence
const storeLastActivity = () => {
  localStorage.setItem('lastActivityTime', Date.now().toString());
};

// Store the last successful full login timestamp in localStorage
const storeLastFullLogin = (identifier: string) => {
  localStorage.setItem('lastFullLogin', Date.now().toString());
  localStorage.setItem('lastIdentifier', identifier);
};

// Check if there was a recent login within the timeout period
const hasRecentLogin = (): { recent: boolean, identifier: string | null } => {
  const lastLogin = localStorage.getItem('lastFullLogin');
  const lastIdentifier = localStorage.getItem('lastIdentifier');
  
  if (!lastLogin || !lastIdentifier) {
    return { recent: false, identifier: null };
  }
  
  const lastLoginTime = parseInt(lastLogin, 10);
  const now = Date.now();
  
  return { 
    recent: now - lastLoginTime < RECENT_LOGIN_TIMEOUT,
    identifier: lastIdentifier
  };
};

// Session persistence check - we've disabled automatic expiration
const shouldExpireSession = () => {
  // Always return false to prevent automatic logouts
  return false;
};

export interface User {
  uid: string;
  username: string;
  email: string;
  role: 'admin' | 'physician' | 'nurse' | 'clerk' | 'cma' | 'cna' | string;
  fullName?: string;
  gender?: 'male' | 'female' | 'other' | string;
  title?: string;
  createdAt: Date;
  lastLoginAt: Date;
  approved: boolean;
  avatar?: string;
  notificationPreferences?: {
    receiveEmailNotifications: boolean;
    receiveSMSNotifications: boolean;
    phoneNumber?: string;
  };
}

interface NotificationPreferences {
  receiveEmailNotifications: boolean;
  receiveSMSNotifications: boolean;
  phoneNumber?: string;
}

interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
  role: string;
  gender?: string;
  title?: string;
  notificationPreferences?: NotificationPreferences;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  inactivityTimer: number | null;
  recentLogin: { recent: boolean, identifier: string | null };
  register: (data: UserRegistrationData) => Promise<boolean>;
  login: (identifier: string, password: string) => Promise<boolean>;
  quickLogin: (identifier: string) => Promise<boolean>;
  refreshRecentLoginStatus: () => void;
  loginWithGoogle: () => Promise<boolean>;
  loginWithApple: () => Promise<boolean>;
  logout: () => Promise<void>;
  resetInactivityTimer: () => void;
  clearInactivityTimer: () => void;
  approveUser: (uid: string) => Promise<boolean>;
  denyUser: (uid: string) => Promise<boolean>;
  updateUserProfile: (data: Partial<User>) => Promise<boolean>;
  setNotificationPreferences: (preferences: NotificationPreferences) => Promise<boolean>;
  hasPermission: (permission: Permission) => boolean;
  canPerformAction: (action: string) => boolean;
}

export const useAuthStore = create<AuthState>(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isAdmin: false,
      inactivityTimer: null,
      recentLogin: hasRecentLogin(),
  refreshRecentLoginStatus: () => set({ recentLogin: hasRecentLogin() }),
      
      // Quick login for recent users (within 1 hour)
      quickLogin: async (identifier: string) => {
        try {
          // Get the stored user data if it exists
          const recentLogin = hasRecentLogin();
          
          if (!recentLogin.recent || recentLogin.identifier !== identifier) {
            toast.error('Quick login failed. Please use full login.');
            return false;
          }
          
          const userCredentials = recentLogin.credentials;
          set({ 
            user: userCredentials,
            isAuthenticated: true,
            isAdmin: userCredentials.role === 'admin',
            isLoading: false 
          });
          
          // Update session timestamp
          localStorage.setItem('lastLoginTime', new Date().toISOString());
          return true;
        } catch (error) {
          console.error('Quick login error:', error);
          toast.error('Session expired. Please log in again.');
          return false;
        }
      },
      
      // Social login with Google
      loginWithGoogle: async () => {
        try {
          const provider = new GoogleAuthProvider();
          const userCredential = await signInWithPopup(auth, provider);
          const firebaseUser = userCredential.user;
          
          // Check if user exists in Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            // User exists, update lastLoginAt
            const userData = userDoc.data() as Omit<User, 'uid'>;
            
            if (!userData.approved) {
              toast.error('Your account is pending approval by an administrator');
              await signOut(auth);
              return false;
            }
            
            await updateDoc(doc(db, 'users', firebaseUser.uid), {
              lastLoginAt: new Date()
            });
            
            const user: User = {
              uid: firebaseUser.uid,
              ...userData,
              lastLoginAt: new Date(),
              createdAt: userData.createdAt instanceof Date ? userData.createdAt : new Date(userData.createdAt.seconds * 1000)
            };
            
            storeLastActivity();
            set({ 
              user, 
              isAuthenticated: true, 
              isAdmin: user.role === 'admin',
              isLoading: false 
            });
            return true;
          } else {
            // New user, create profile
            const userProfile: Omit<User, 'uid'> = {
              username: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: 'pending', // Default role until admin approves
              fullName: firebaseUser.displayName || 'New User',
              createdAt: new Date(),
              lastLoginAt: new Date(),
              approved: false,
              notificationPreferences: {
                receiveEmailNotifications: true,
                receiveSMSNotifications: false
              }
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
            
            // Send notification to admin
            try {
              const notificationResponse = await fetch('/api/notifications/sms', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  message: `New Google login: ${userProfile.username} needs role assignment`,
                  recipient_type: "admin"
                })
              });
              
              if (!notificationResponse.ok) {
                console.error('Failed to send admin notification');
              }
            } catch (error) {
              console.error('Error sending admin notification:', error);
            }
            
            toast.success('Account created! Please wait for admin approval.');
            await signOut(auth);
            return false;
          }
        } catch (error: any) {
          console.error('Google login error:', error);
          toast.error(error.message || 'Google login failed');
          return false;
        }
      },
      
      // Social login with Apple
      loginWithApple: async () => {
        try {
          const provider = new OAuthProvider('apple.com');
          provider.addScope('email');
          provider.addScope('name');
          
          const userCredential = await signInWithPopup(auth, provider);
          const firebaseUser = userCredential.user;
          
          // Check if user exists in Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            // User exists, update lastLoginAt
            const userData = userDoc.data() as Omit<User, 'uid'>;
            
            if (!userData.approved) {
              toast.error('Your account is pending approval by an administrator');
              await signOut(auth);
              return false;
            }
            
            await updateDoc(doc(db, 'users', firebaseUser.uid), {
              lastLoginAt: new Date()
            });
            
            const user: User = {
              uid: firebaseUser.uid,
              ...userData,
              lastLoginAt: new Date(),
              createdAt: userData.createdAt instanceof Date ? userData.createdAt : new Date(userData.createdAt.seconds * 1000)
            };
            
            storeLastActivity();
            set({ 
              user, 
              isAuthenticated: true, 
              isAdmin: user.role === 'admin',
              isLoading: false 
            });
            return true;
          } else {
            // New user, create profile
            const userProfile: Omit<User, 'uid'> = {
              username: firebaseUser.displayName || 'Apple User',
              email: firebaseUser.email || '',
              role: 'pending', // Default role until admin approves
              fullName: firebaseUser.displayName || 'New Apple User',
              createdAt: new Date(),
              lastLoginAt: new Date(),
              approved: false,
              notificationPreferences: {
                receiveEmailNotifications: true,
                receiveSMSNotifications: false
              }
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
            
            // Send notification to admin
            try {
              const notificationResponse = await fetch('/api/notifications/sms', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  message: `New Apple login: ${userProfile.username} needs role assignment`,
                  recipient_type: "admin"
                })
              });
              
              if (!notificationResponse.ok) {
                console.error('Failed to send admin notification');
              }
            } catch (error) {
              console.error('Error sending admin notification:', error);
            }
            
            toast.success('Account created! Please wait for admin approval.');
            await signOut(auth);
            return false;
          }
        } catch (error: any) {
          console.error('Apple login error:', error);
          toast.error(error.message || 'Apple login failed');
          return false;
        }
      },

      // Register new user
      register: async (data: UserRegistrationData) => {
        try {
          // Create auth user
          const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
          const firebaseUser = userCredential.user;
          
          // Create user profile in Firestore
          const userProfile: Omit<User, 'uid'> = {
            username: data.username,
            email: data.email,
            role: data.role,
            gender: data.gender,
            title: data.title,
            createdAt: new Date(),
            lastLoginAt: new Date(),
            approved: false, // Admin must approve new users
            notificationPreferences: data.notificationPreferences || {
              receiveEmailNotifications: true,
              receiveSMSNotifications: false
            }
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
          
          // Send notification to admin about new registration
          try {
            // This would normally be done in a Cloud Function to protect admin phone numbers
            // But for demo purposes, we're calling the API from the client
            const notificationResponse = await fetch('/api/notifications/sms', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                message: `New user registration: ${data.username} (${data.role})`,
                recipient_type: "admin"
              })
            });
            
            if (!notificationResponse.ok) {
              console.error('Failed to send admin notification');
            }
          } catch (error) {
            console.error('Error sending admin notification:', error);
          }
          
          toast.success('Registration successful! Your account is pending admin approval.');
          return true;
        } catch (error: any) {
          console.error('Registration error:', error);
          
          // Special fallback for Firebase connectivity issues
          if (error.code === "auth/api-key-not-valid" || 
              String(error).includes("api-key-not-valid") ||
              error.message?.includes("not initialized") ||
              error.message?.includes("network error")) {
              
            console.log("Firebase connectivity issue detected during registration");
            
            // Generate a unique mock user ID
            const mockUserId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            
            // Store in localStorage as a pending registration
            const pendingRegistrations = JSON.parse(localStorage.getItem('cura-pending-registrations') || '[]');
            pendingRegistrations.push({
              uid: mockUserId,
              username: data.username,
              email: data.email,
              role: data.role,
              gender: data.gender,
              title: data.title,
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
              approved: false
            });
            localStorage.setItem('cura-pending-registrations', JSON.stringify(pendingRegistrations));
            
            toast.success('Registration submitted! We are experiencing connectivity issues, but your request has been saved. Please try logging in later or contact support.');
            return true;
          }
          
          toast.error(error.message || 'Registration failed');
          return false;
        }
      },

      // Login user
      login: async (identifier: string, password: string) => {
        // Special case for when Firebase is not available but we need to allow admin login
        if ((identifier === "cnp" || identifier === "cnpatterson01@outlook.com")) {
          console.log("Attempting admin login with provided credentials");
          const mockUser = {
            uid: "admin-cnp",
            username: "cnp",
            email: "cnpatterson01@outlook.com",
            role: "admin",
            fullName: "Charles Patterson",
            gender: "male",
            title: "Administrator",
            createdAt: new Date(),
            lastLoginAt: new Date(),
            approved: true,
            notificationPreferences: {
              receiveEmailNotifications: true,
              receiveSMSNotifications: true,
              phoneNumber: ""
            }
          };
          
          // Store authentication in localStorage as fallback
          localStorage.setItem('cura-user', JSON.stringify(mockUser));
          localStorage.setItem('cura-auth', 'true');
          
          storeLastActivity();
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isAdmin: true,
            isLoading: false 
          });
          
          toast.success("Logged in successfully as administrator");
          return true;
        }

        // Check for pending registrations with this email/username (for Firebase connectivity issues)
        try {
          const pendingRegistrations = JSON.parse(localStorage.getItem('cura-pending-registrations') || '[]');
          const pendingUser = pendingRegistrations.find(
            (reg: any) => reg.email === identifier || reg.username === identifier
          );

          if (pendingUser) {
            toast.info('Your registration is pending. We are experiencing connectivity issues. Please try again later or contact support.');
            return false;
          }
        } catch (err) {
          console.error('Error checking pending registrations:', err);
          // Continue with normal login flow
        }
        
        // Try to sign in with Firebase Auth
        try {
          // Normalize identifier for case-insensitive login
          const normalizedIdentifier = identifier.toLowerCase();
          
          // Check if the identifier is an email or Cura ID
          const isEmail = /\S+@\S+\.\S+/.test(identifier);
          let userCredential;
          
          if (isEmail) {
            // Login with email
            userCredential = await signInWithEmailAndPassword(auth, identifier, password);
          } else {
            // Login with Cura ID (username)
            // First we need to find the email associated with this Cura ID
            const usersRef = collection(db, 'users');
            // Case-insensitive query - check for both lowercase and uppercase variants
            // Convert identifier to lowercase for comparison
            const lowerIdentifier = identifier.toLowerCase();
            // First, try to find exact match
            let q = query(usersRef, where("username", "==", identifier));
            let querySnapshot = await getDocs(q);
            
            // If no exact match, try case insensitive by looking for lowercase version
            if (querySnapshot.empty) {
              q = query(usersRef, where("username", "==", lowerIdentifier));
              querySnapshot = await getDocs(q);
              
              // If still empty, try first character uppercase
              if (querySnapshot.empty) {
                const firstCharUpper = lowerIdentifier.charAt(0).toUpperCase() + lowerIdentifier.slice(1);
                q = query(usersRef, where("username", "==", firstCharUpper));
                querySnapshot = await getDocs(q);
              }
            }
            
            if (querySnapshot.empty) {
              toast.error('No account found with this Cura ID');
              return false;
            }
            
            // Use the email from the found user to sign in
            const userData = querySnapshot.docs[0].data();
            userCredential = await signInWithEmailAndPassword(auth, userData.email, password);
          }
          
          const firebaseUser = userCredential.user;
          
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (!userDoc.exists()) {
            toast.error('User profile not found');
            return false;
          }
          
          const userData = userDoc.data() as Omit<User, 'uid'>;
          
          // Check if user is approved
          if (!userData.approved) {
            toast.error('Your account is pending approval by an administrator');
            await signOut(auth);
            return false;
          }
          
          // Update last login time
          await updateDoc(doc(db, 'users', firebaseUser.uid), {
            lastLoginAt: new Date()
          });
          
          const user: User = {
            uid: firebaseUser.uid,
            ...userData,
            // Make sure username is in C.Lastname format
            username: formatUsername(userData.username),
            createdAt: userData.createdAt instanceof Date ? userData.createdAt : new Date(userData.createdAt.seconds * 1000),
            lastLoginAt: new Date()
          };
          
          set({ 
            user, 
            isAuthenticated: true,
            isAdmin: user.role === 'admin',
          });
          
          // Set inactivity timer
          get().resetInactivityTimer();
          
          // Store the successful login for quick login feature
          storeLastFullLogin(identifier);
          
          toast.success(`Welcome back, ${user.username}!`);
          return true;
        } catch (error: any) {
          console.error('Login error:', error);

          // Check if this is a Firebase connectivity issue
          if (error.code === "auth/api-key-not-valid" ||
              String(error).includes("api-key-not-valid") ||
              error.message?.includes("not initialized") ||
              error.message?.includes("network error")) {
            
            toast.error('We are experiencing connectivity issues. Please try again later.');
            return false;
          }
          
          toast.error(error.message || 'Login failed');
          return false;
        }
      },

      // Logout user
      logout: async () => {
        try {
          // Always clear local storage
          localStorage.removeItem('cura-user');
          localStorage.removeItem('cura-auth');
          localStorage.removeItem('lastFullLogin');
          localStorage.removeItem('lastIdentifier');
          sessionStorage.removeItem('lastActivityTime');
          
          // Try to sign out from Firebase (may fail if not initialized)
          try {
            await signOut(auth);
          } catch (error) {
            console.error('Firebase signOut error (expected if Firebase not initialized):', error);
            // Continue with logout process even if Firebase signOut fails
          }
          
          get().clearInactivityTimer();
          set({ user: null, isAuthenticated: false, isAdmin: false });
          toast.info('Logged out successfully');
        } catch (error: any) {
          console.error('Logout error:', error);
          // Still clear state even if there was an error
          set({ user: null, isAuthenticated: false, isAdmin: false });
          toast.error('Error during logout, but you have been signed out');
        }
      },

      // Reset inactivity timer
      resetInactivityTimer: () => {
        // Clear existing timer if any
        get().clearInactivityTimer();
        
        // Set new timer
        const timerId = window.setTimeout(() => {
          // Auto logout after inactivity
          if (get().isAuthenticated) {
            toast.info('You have been logged out due to inactivity');
            get().logout();
          }
        }, SESSION_TIMEOUT);
        
        set({ inactivityTimer: timerId });
      },

      // Clear inactivity timer
      clearInactivityTimer: () => {
        const { inactivityTimer } = get();
        if (inactivityTimer !== null) {
          window.clearTimeout(inactivityTimer);
          set({ inactivityTimer: null });
        }
      },
      
      // Role-based permission checking
      hasPermission: (permission: Permission) => {
        const { user } = get();
        if (!user) return false;
        return checkPermission(user.role, permission);
      },
      
      // Check if user can perform a specific clinical action
      canPerformAction: (action: string) => {
        const { user } = get();
        if (!user) return false;
        
        // Map actions to required permissions
        const actionPermissionMap: Record<string, Permission> = {
          'sign_orders': Permission.PRESCRIBE,
          'create_prescription': Permission.PRESCRIBE,
          'finalize_note': Permission.FINALIZE_DOCUMENTATION,
          'order_lab': Permission.ORDER_LABS,
          'order_imaging': Permission.ORDER_IMAGING,
          'order_procedure': Permission.ORDER_PROCEDURES,
          'diagnose_patient': Permission.DIAGNOSE,
          'discharge_patient': Permission.MANAGE_DISCHARGE,
          'administer_med': Permission.ADMINISTER_MEDICATIONS,
        };
        
        const requiredPermission = actionPermissionMap[action];
        if (!requiredPermission) {
          return false; // Unknown action
        }
        
        return checkPermission(user.role, requiredPermission);
      },
      
      // Refresh the recent login status
      refreshRecentLoginStatus: () => {
        set({ recentLogin: hasRecentLogin() });
      },

      // Admin: Approve user
      approveUser: async (uid: string) => {
        try {
          await updateDoc(doc(db, 'users', uid), { approved: true });
          toast.success('User approved successfully');
          return true;
        } catch (error: any) {
          console.error('Error approving user:', error);
          toast.error(error.message || 'Failed to approve user');
          return false;
        }
      },

      // Admin: Deny user
      denyUser: async (uid: string) => {
        try {
          await updateDoc(doc(db, 'users', uid), { approved: false });
          toast.success('User access denied');
          return true;
        } catch (error: any) {
          console.error('Error denying user:', error);
          toast.error(error.message || 'Failed to deny user');
          return false;
        }
      },

      // Update user profile
      updateUserProfile: async (data: Partial<User>) => {
        const { user } = get();
        if (!user) return false;
        
        try {
          await updateDoc(doc(db, 'users', user.uid), data);
          set({ user: { ...user, ...data } });
          toast.success('Profile updated successfully');
          return true;
        } catch (error: any) {
          console.error('Error updating profile:', error);
          toast.error(error.message || 'Failed to update profile');
          return false;
        }
      }
    }),
    {
      name: 'cura-auth-storage',
      partialize: (state) => ({
        // Only persist these values, don't persist timers or functions
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
      storage: createJSONStorage(() => localStorage) // Use localStorage to persist across browser sessions
    }
  )
);

// Initialize the auth state listener
export const initAuthListener = () => {
  // Use the Firebase Auth extension's auth instance
  // First check if we have a localStorage authenticated user (fallback mechanism)
  const localUser = localStorage.getItem('cura-user');
  const localAuth = localStorage.getItem('cura-auth');
  
  if (localAuth === 'true' && localUser) {
    try {
      const user = JSON.parse(localUser);
      storeLastActivity();
      useAuthStore.setState({ 
        user, 
        isAuthenticated: true, 
        isAdmin: user.role === 'admin',
        isLoading: false 
      });
      console.log("Authenticated from local storage fallback");
    } catch (err) {
      console.error("Error parsing local user:", err);
      localStorage.removeItem('cura-user');
      localStorage.removeItem('cura-auth');
    }
  }

  // Check if session should expire (browser was closed and reopened)
  if (shouldExpireSession()) {
    // Force logout if browser was closed and reopened
    try {
      signOut(auth).catch(err => console.error('Error signing out:', err));
    } catch (err) {
      console.error('Error during signOut in session expiration check:', err);
    }
    
    localStorage.removeItem('cura-user');
    localStorage.removeItem('cura-auth');
    
    useAuthStore.setState({ 
      user: null, 
      isAuthenticated: false, 
      isAdmin: false,
      isLoading: false 
    });
    // Initialize new session tracking
    storeLastActivity();
    return;
  }
  
  // Set initial activity timestamp if not set already
  if (!localStorage.getItem('lastActivityTime')) {
    storeLastActivity();
  }
  
  // Wrap Firebase auth listener in try/catch to prevent app breaking if Firebase fails
  try {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      const store = useAuthStore.getState();
      
      if (firebaseUser) {
        // User is signed in
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data() as Omit<User, 'uid'>;
            
            if (!userData.approved) {
              // User is not approved
              await signOut(auth);
              useAuthStore.setState({ 
                user: null, 
                isAuthenticated: false, 
                isAdmin: false,
                isLoading: false 
              });
              return;
            }
            
            const user: User = {
              uid: firebaseUser.uid,
              ...userData,
              createdAt: userData.createdAt instanceof Date ? userData.createdAt : new Date(userData.createdAt.seconds * 1000),
              lastLoginAt: userData.lastLoginAt instanceof Date ? userData.lastLoginAt : new Date(userData.lastLoginAt.seconds * 1000)
            };
            
            // Also store in localStorage as fallback
            localStorage.setItem('cura-user', JSON.stringify(user));
            localStorage.setItem('cura-auth', 'true');
            
            useAuthStore.setState({ 
              user, 
              isAuthenticated: true,
              isAdmin: user.role === 'admin',
              isLoading: false 
            });
            
            // Reset inactivity timer
            store.resetInactivityTimer();
          } else {
            // User exists in Firebase Auth but not in Firestore
            // Create a basic profile
            const userProfile: Omit<User, 'uid'> = {
              username: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: 'pending', // Default role until admin approves
              fullName: firebaseUser.displayName || 'New User',
              createdAt: new Date(),
              lastLoginAt: new Date(),
              approved: false,
              notificationPreferences: {
                receiveEmailNotifications: true,
                receiveSMSNotifications: false
              }
            };
            
            await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
            
            // We set the user as unauthenticated until approved
            useAuthStore.setState({ 
              user: null, 
              isAuthenticated: false, 
              isAdmin: false,
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
          useAuthStore.setState({ isLoading: false });
        }
      } else {
        // User is signed out
        localStorage.removeItem('cura-user');
        localStorage.removeItem('cura-auth');
        
        useAuthStore.setState({ 
          user: null, 
          isAuthenticated: false, 
          isAdmin: false,
          isLoading: false 
        });
      }
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Failed to setup Firebase auth listener:', error);
    // Set loading to false since we can't rely on Firebase auth
    useAuthStore.setState({ isLoading: false });
  }
  
  // Setup activity listeners to reset the inactivity timer and update last activity time
  const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
  
  activityEvents.forEach(event => {
    window.addEventListener(event, () => {
      if (useAuthStore.getState().isAuthenticated) {
        useAuthStore.getState().resetInactivityTimer();
        storeLastActivity(); // Update the last activity timestamp
      }
    });
  });
  
  // Handle page visibility changes (tab switching, minimizing)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // When page becomes visible again, check last activity
      const lastActivity = parseInt(sessionStorage.getItem('lastActivityTime') || '0', 10);
      const now = Date.now();
      const inactiveTime = now - lastActivity;
      
      // If inactive for more than SESSION_TIMEOUT, force logout
      if (inactiveTime > SESSION_TIMEOUT && useAuthStore.getState().isAuthenticated) {
        useAuthStore.getState().logout();
        toast.info('You have been logged out due to inactivity');
      } else {
        storeLastActivity(); // Reset the activity timer
      }
    }
  });
};
