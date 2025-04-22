import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "../utils/authStore";
import { CuraLogo } from "components/CuraLogo";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SignInOrUpForm } from "app";
import { useCurrentUser } from "app";
import { CustomFirebaseSignup } from "components/CustomFirebaseSignup";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [useFirebaseAuth, setUseFirebaseAuth] = useState(false);
  const { register, isAuthenticated } = useAuthStore();
  const { user: firebaseUser } = useCurrentUser();
  const navigate = useNavigate();

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated || firebaseUser) {
      navigate("/");
    }
  }, [isAuthenticated, firebaseUser, navigate]);

  const validateForm = () => {
    // Reset error state
    setError("");

    // Validate username (alphanumeric with limited special chars)
    if (!username || !/^[a-zA-Z0-9._-]{3,20}$/.test(username)) {
      setError("Username must be 3-20 characters and may contain only letters, numbers, dots, underscores, and hyphens");
      return false;
    }

    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    // Validate password (min 8 chars with letters and numbers)
    if (!password || password.length < 8 || !/^(?=.*[a-zA-Z])(?=.*\d).+$/.test(password)) {
      setError("Password must be at least 8 characters and include both letters and numbers");
      return false;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    // Validate role selection
    if (!role) {
      setError("Please select a role");
      return false;
    }

    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await register({
        username,
        email,
        password,
        role,
        gender: gender || undefined,
        title: title || undefined,
      });

      if (success) {
        // Redirect to login page after successful registration
        navigate("/login", { 
          state: { 
            message: "Registration successful! Please wait for admin approval before logging in."
          }
        });
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-100 to-white p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <CuraLogo size={50} />
          </div>
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>
            Register for Cura Workspace Access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {useFirebaseAuth ? (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="text-center font-medium mb-2">Sign up with format C.Lastname</h3>
                <CustomFirebaseSignup />
              </div>
              <div className="text-center mt-6 border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">Or use standard Firebase signup</p>
                <SignInOrUpForm 
                  signInOptions={{
                    google: true,
                    emailAndPassword: true
                  }}
                />
              </div>
              <div className="text-center mt-4 border-t pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUseFirebaseAuth(false)}
                >
                  Use Legacy Registration
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physician">Physician</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="cma">Certified Medical Assistant</SelectItem>
                  <SelectItem value="cna">Certified Nursing Assistant</SelectItem>
                  <SelectItem value="clerk">Medical Clerk</SelectItem>
                  <SelectItem value="other">Other Healthcare Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="flex items-center">
                Professional Title <span className="text-xs text-gray-500 ml-1">(optional)</span>
              </Label>
              <Input
                id="title"
                placeholder="e.g. MD, RN, etc."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="flex items-center">
                Gender <span className="text-xs text-gray-500 ml-1">(optional)</span>
              </Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Register"}
            </Button>
          </form>
          )}
        </CardContent>
        {!useFirebaseAuth && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="text-center mb-4">
              <span className="bg-white text-gray-500 px-2 text-sm relative z-10 before:content-[''] before:absolute before:left-[-100%] before:right-[-100%] before:h-[1px] before:top-[50%] before:bg-gray-200 before:-z-10">
                Or continue with
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                variant="outline" 
                type="button" 
                className="w-full flex items-center justify-center gap-2" 
                onClick={() => setUseFirebaseAuth(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </Button>
            </div>
          </div>
        )}
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-sky-600 hover:underline">
                Login
              </Link>
            </p>
          </CardFooter>
      </Card>
    </div>
  );
}
