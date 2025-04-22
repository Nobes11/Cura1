import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { firebaseAuth } from 'app';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { roleDefinitions, getRolesByCategory } from '../utils/rolePermissions';

interface CustomFirebaseSignupProps {
  onComplete?: () => void;
}

export const CustomFirebaseSignup: React.FC<CustomFirebaseSignupProps> = ({ onComplete }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    // Form validation
    if (!firstName || !lastName) {
      setError('First name and last name are required');
      return;
    }

    if (!email) {
      setError('Email is required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!role) {
      setError('Please select your position');
      return;
    }

    // Create username in first initial.lastname format (formatted consistently)
    const displayName = `${firstName.charAt(0).toUpperCase()}.${lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()}`;
    
    // Function to generate a username from first and last name
    const generateUsername = () => {
      if (firstName && lastName) {
        // Format: First initial + period + last name (all lowercase)
        return `${firstName.charAt(0)}.${lastName}`.toLowerCase();
      }
      return '';
    };
    
    setIsLoading(true);

    try {
      // Create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth, 
        email, 
        password
      );

      // Update the user's profile with the firstname.lastname display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });

      // Create a user record in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username: displayName,
        email: email,
        role: role || 'pending', // Use selected role or default to 'pending' until admin approves
        fullName: `${firstName} ${lastName}`,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        approved: false,
        notificationPreferences: {
          receiveEmailNotifications: true,
          receiveSMSNotifications: false
        }
      });

      setSuccess(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('');
      
      if (onComplete) {
        onComplete();
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else {
        setError(err.message || 'Failed to create account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 bg-green-50 text-green-800 border border-green-200">
            <AlertDescription>
              Account created successfully! Please wait for admin approval before logging in.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Position/Role</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your position" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(getRolesByCategory()).map(([category, roles]) => (
                  <div key={category} className="px-1">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase pt-2 pb-1">
                      {category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h4>
                    {roles.map(role => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="text-xs text-gray-500 text-center mt-2">
            By signing up, you agree to our Terms of Service and Privacy Policy.
            <br />Your username will be <strong>{firstName && lastName ? `${firstName.charAt(0).toUpperCase()}.${lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()}` : "C.Lastname"}</strong>
            <br /><span className="text-slate-500">Format: First initial.LastName</span>
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
