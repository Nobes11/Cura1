import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/authStore";
import { doc, updateDoc, db } from "../utils/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, Save, ArrowLeft, ShieldCheck, Smartphone } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

export default function UserSettings() {
  const { user, isAuthenticated, updateUserProfile } = useAuthStore();
  const navigate = useNavigate();
  
  // User profile fields
  const [phoneNumber, setPhoneNumber] = useState("");
  const [save2FAEnabled, setSave2FAEnabled] = useState(false);
  const [sessionPersistence, setSessionPersistence] = useState(false);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  
  // Load existing user settings
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (user) {
      // Load existing phone number if available
      if (user.phoneNumber) {
        setPhoneNumber(user.phoneNumber);
      }
      
      // Load existing preferences
      setSave2FAEnabled(user.save2FAEnabled || false);
      setSessionPersistence(user.sessionPersistence || false);
    }
  }, [user, isAuthenticated, navigate]);
  
  const validatePhoneNumber = (phone: string) => {
    // Basic US phone number validation (10 digits)
    return /^\d{10}$/.test(phone.replace(/[\s-()]/g, ''));
  };
  
  const handleSaveSettings = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      // Validate phone if provided
      if (phoneNumber && !validatePhoneNumber(phoneNumber)) {
        setError("Please enter a valid 10-digit phone number");
        setIsLoading(false);
        return;
      }
      
      // Check if 2FA is required for password saving
      if (save2FAEnabled && !phoneNumber) {
        setError("Phone number is required for 2FA password saving");
        setIsLoading(false);
        return;
      }
      
      // Update user profile in Firestore
      const updates = {
        phoneNumber: phoneNumber || null,
        save2FAEnabled,
        sessionPersistence,
        updatedAt: new Date()
      };
      
      // Use the updateUserProfile function from authStore
      await updateUserProfile(updates);
      
      toast.success("Settings updated successfully");
      setIsLoading(false);
    } catch (err: any) {
      console.error("Error updating settings:", err);
      setError(err.message || "Failed to update settings");
      setIsLoading(false);
    }
  };
  
  const handleVerifyPhone = () => {
    // In a real implementation, this would send a verification code to the user's phone
    setIsVerifyingPhone(true);
    toast.info("Verification code sent to your phone (demo only)");
    
    // For demo purposes, we'll just simulate a verification code
    // In production, this would integrate with Firebase phone auth or similar
  };
  
  const handleConfirmVerification = () => {
    // In a real implementation, this would verify the code with a service like Firebase
    if (verificationCode === "123456") {
      toast.success("Phone number verified successfully");
      setIsVerifyingPhone(false);
    } else {
      setError("Invalid verification code");
    }
  };
  
  if (!user) {
    return <div className="p-8 text-center">Loading user data...</div>;
  }
  
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Settings</CardTitle>
          <CardDescription>
            Manage your account preferences and security settings
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Account Information</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input 
                  id="username" 
                  value={user.username} 
                  disabled 
                  className="col-span-2" 
                />
              </div>
              
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <Input 
                  id="role" 
                  value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                  disabled 
                  className="col-span-2" 
                />
              </div>
              
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="phoneNumber" className="text-right flex items-center">
                  Phone Number
                  <span className="text-xs text-gray-500 ml-1">(optional)</span>
                </Label>
                <div className="col-span-2 flex">
                  <Input 
                    id="phoneNumber" 
                    placeholder="(123) 456-7890" 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                    className="flex-1" 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="ml-2 whitespace-nowrap" 
                    onClick={handleVerifyPhone}
                    disabled={!phoneNumber || isVerifyingPhone}
                  >
                    <Smartphone className="h-4 w-4 mr-1" />
                    Verify
                  </Button>
                </div>
              </div>
              
              {isVerifyingPhone && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="verificationCode" className="text-right">
                    Verification Code
                  </Label>
                  <div className="col-span-2 flex">
                    <Input 
                      id="verificationCode" 
                      placeholder="123456" 
                      value={verificationCode} 
                      onChange={(e) => setVerificationCode(e.target.value)} 
                      className="flex-1" 
                    />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="sm" 
                      className="ml-2" 
                      onClick={handleConfirmVerification}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Security Settings</h3>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <div className="text-right">
                  <Label htmlFor="save2FAEnabled" className="cursor-pointer">
                    Enable 2FA for Password
                  </Label>
                </div>
                <div className="flex items-center space-x-2 col-span-2">
                  <Switch 
                    id="save2FAEnabled" 
                    checked={save2FAEnabled} 
                    onCheckedChange={setSave2FAEnabled} 
                  />
                  <div className="text-sm text-gray-500 flex items-center">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    {save2FAEnabled ? "On" : "Off"}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 items-center gap-4">
                <div className="text-right">
                  <Label htmlFor="sessionPersistence" className="cursor-pointer">
                    Remember Me
                  </Label>
                </div>
                <div className="flex items-center space-x-2 col-span-2">
                  <Switch 
                    id="sessionPersistence" 
                    checked={sessionPersistence} 
                    onCheckedChange={setSessionPersistence} 
                  />
                  <span className="text-sm text-gray-500">
                    {sessionPersistence ? "Stay signed in on this device" : "Sign out when browser closes"}
                  </span>
                </div>
              </div>
              
              <div className="col-span-3">
                <p className="text-xs text-gray-500 mt-2">
                  <strong>Note:</strong> Enabling 2FA for password saving requires a verified phone number.
                  Your device will require verification when using saved passwords.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button 
            variant="default" 
            onClick={handleSaveSettings} 
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
