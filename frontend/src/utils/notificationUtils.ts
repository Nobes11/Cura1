import { doc, updateDoc } from './firebase';
import { db } from './firebase';
import { useAuthStore, User } from './authStore';
import { toast } from 'sonner';

export interface NotificationPreferences {
  receiveEmailNotifications: boolean;
  receiveSMSNotifications: boolean;
  phoneNumber?: string;
}

/**
 * Updates a user's notification preferences in Firestore and local state
 */
export const updateNotificationPreferences = async (
  preferences: NotificationPreferences
): Promise<boolean> => {
  const { user } = useAuthStore.getState();
  
  if (!user) {
    toast.error('You must be logged in to update notification preferences');
    return false;
  }
  
  try {
    // Update the user document in Firestore
    await updateDoc(doc(db, 'users', user.uid), {
      notificationPreferences: preferences
    });
    
    // Update local state
    const updatedUser: User = {
      ...user,
      notificationPreferences: preferences
    };
    
    // Update the user in the auth store
    useAuthStore.setState({ user: updatedUser });
    
    return true;
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return false;
  }
};
