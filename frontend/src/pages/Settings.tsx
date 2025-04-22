import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, User } from "../utils/authStore";
import { updateNotificationPreferences } from "../utils/notificationUtils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { SMSNotificationTester } from "components/SMSNotificationTester";
import { ArrowLeft, Bell, User as UserIcon, Lock, ShieldAlert } from "lucide-react";

export default function Settings() {
  // Prevent any unintended medication tab activation
  useEffect(() => {
    // Remove any event listeners that might cause medication tabs to show
    const cleanup = () => {
      // Remove any rogue medication event handlers
      const settings = document.getElementById('medications-tab');
      if (settings) {
        settings.id = 'settings-medications-tab'; // Rename to avoid conflict
      }
    };
    
    // Run cleanup on mount
    cleanup();
    
    return () => {
      // Additional cleanup if needed when component unmounts
    };
  }, []);

  const { user, isAuthenticated, isLoading, isAdmin, updateUserProfile } = useAuthStore();
  const navigate = useNavigate();
  
  // Form states
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [receiveEmailNotifications, setReceiveEmailNotifications] = useState(true);
  const [receiveSMSNotifications, setReceiveSMSNotifications] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Load user data
  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setReceiveEmailNotifications(user.notificationPreferences?.receiveEmailNotifications ?? true);
      setReceiveSMSNotifications(user.notificationPreferences?.receiveSMSNotifications ?? false);
      setPhoneNumber(user.notificationPreferences?.phoneNumber || "");
    }
  }, [user]);

  const handleUpdateNotificationPreferences = async () => {
    if (!user) return;
    
    setIsSaving(true);
    
    try {
      // For SMS notifications, validate phone number if enabled
      if (receiveSMSNotifications && !phoneNumber) {
        toast.error("Please enter your phone number to receive SMS notifications");
        return;
      }
      
      const preferences = {
        receiveEmailNotifications,
        receiveSMSNotifications,
        phoneNumber: receiveSMSNotifications ? phoneNumber : undefined
      };
      
      const success = await updateNotificationPreferences(preferences);
      
      if (success) {
        toast.success("Notification preferences updated successfully");
      } else {
        toast.error("Failed to update notification preferences");
      }
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast.error("An error occurred while updating your notification preferences");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full mb-8" style={{ gridTemplateColumns: isAdmin ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr' }}>
          <TabsTrigger value="profile">
            <UserIcon className="h-4 w-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" /> Security
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="sms-testing">
              <Bell className="h-4 w-4 mr-2" /> SMS Testing
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={user.username} disabled />
                  <p className="text-sm text-gray-500">Your username cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} disabled />
                  <p className="text-sm text-gray-500">Contact an administrator to change your email</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={user.role} disabled />
                  <p className="text-sm text-gray-500">Your role is assigned by an administrator</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={receiveEmailNotifications}
                      onCheckedChange={setReceiveEmailNotifications}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-gray-500">Receive notifications via text message</p>
                      </div>
                      <Switch
                        checked={receiveSMSNotifications}
                        onCheckedChange={setReceiveSMSNotifications}
                      />
                    </div>

                    {receiveSMSNotifications && (
                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input
                          id="phoneNumber"
                          placeholder="+1 (555) 123-4567"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <p className="text-sm text-gray-500">Enter your phone number to receive SMS notifications</p>
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleUpdateNotificationPreferences} 
                  disabled={isSaving}
                  className="w-full"
                >
                  {isSaving ? "Saving..." : "Save Notification Preferences"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Account Status</h4>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${user.approved ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <span>{user.approved ? 'Approved' : 'Pending Approval'}</span>
                  </div>
                  {!user.approved && (
                    <p className="text-sm text-amber-600">Your account is pending administrator approval</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Change Password</h4>
                  <p className="text-sm text-gray-500">
                    Password changes are currently not available in this interface. Please contact your administrator if you need to reset your password.
                  </p>
                </div>

                <Button variant="destructive" onClick={() => useAuthStore.getState().logout()}>
                  <ShieldAlert className="h-4 w-4 mr-2" /> Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="sms-testing">
            <Card>
              <CardHeader>
                <CardTitle>SMS Notification Testing</CardTitle>
                <CardDescription>
                  Test the SMS notification system for admin alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <SMSNotificationTester />
                  
                  <Separator />
                  
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">About SMS Notifications</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            SMS notifications are sent to administrators when new users register. The notification 
                            includes the username and role of the new user.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
