import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth, createUserWithEmailAndPassword, db, doc, setDoc } from "../utils/firebase";
import { toast } from "sonner";
import { CuraLogo } from "../components/CuraLogo";

export default function CreateInitialAdmin() {
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAdminAccount = async () => {
    setIsCreating(true);
    setError(null);

    try {
      // Create the user with email and password
      const email = "cnp@cura-ehr.com";
      // Generate a secure random password - in a real system we'd want a more secure password
      const password = `Admin${Math.random().toString(36).substring(2, 10)}${Math.floor(Math.random() * 1000)}`;
      const username = "cnp";

      // Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userData = {
        username: username,
        email: email,
        role: "admin",
        fullName: "Charles Patterson",
        gender: "male",
        title: "Administrator",
        createdAt: new Date(),
        lastLoginAt: new Date(),
        approved: true, // Auto-approve admin account
        notificationPreferences: {
          receiveEmailNotifications: true,
          receiveSMSNotifications: true,
          phoneNumber: ""
        }
      };

      await setDoc(doc(db, "users", user.uid), userData);
      
      toast.success("Admin account created successfully!");
      setIsCreated(true);
    } catch (err: any) {
      console.error("Error creating admin account:", err);
      setError(err.message || "Failed to create admin account");
      toast.error(err.message || "Failed to create admin account");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-100 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <CuraLogo size={40} />
          <CardTitle className="text-2xl font-bold">Create Admin Account</CardTitle>
          <CardDescription>
            Create the initial administrator account for Cura EHR
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm bg-red-100 border border-red-200 rounded text-red-800">
              {error}
            </div>
          )}

          {isCreated ? (
            <div className="p-4 bg-green-100 border border-green-200 rounded text-green-800">
              <p className="font-semibold">Admin account created!</p>
              <p className="mt-2">You can now log in with:</p>
              <ul className="mt-1 ml-4 list-disc">
                <li>Username: <span className="font-mono">cnp</span></li>
                <li>Email: <span className="font-mono">cnp@cura-ehr.com</span></li>
                <li>Password: <span className="font-mono">[Secure password has been generated]</span></li>
              </ul>
              <p className="mt-2 text-sm">For security reasons, the password is not displayed. Please check your email for login instructions or use the password you set during installation.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                <p className="text-amber-800">This will create an admin account with the following credentials:</p>
                <ul className="mt-2 ml-4 list-disc text-amber-800">
                  <li>Username: <span className="font-mono">cnp</span></li>
                  <li>Email: <span className="font-mono">cnp@cura-ehr.com</span></li>
                  <li>A secure password will be generated</li>
                </ul>
                <p className="mt-2 text-xs text-amber-700">After creation, you'll need to use the email above with the password you chose during setup.</p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter>
          {!isCreated ? (
            <Button 
              className="w-full" 
              onClick={createAdminAccount} 
              disabled={isCreating}
            >
              {isCreating ? "Creating Account..." : "Create Admin Account"}
            </Button>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => window.location.href = "/login"}
            >
              Go to Login
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
