import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "../utils/authStore";
import { useLocation } from "react-router-dom";
import { CuraLogo } from "components/CuraLogo";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SignInOrUpForm } from "app";
import { firebaseAuth } from "app";
import { useCurrentUser } from "app";
import { CustomFirebaseSignup } from "components/CustomFirebaseSignup";
import { RegisterModal } from "components/RegisterModal";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showQuickOptions, setShowQuickOptions] = useState(false);
  const [isQuickLogin, setIsQuickLogin] = useState(false);
  const [useFirebaseAuth, setUseFirebaseAuth] = useState(false);
  const { login, quickLogin, isAuthenticated, recentLogin, refreshRecentLoginStatus } = useAuthStore();
  const { user: firebaseUser, loading: firebaseLoading } = useCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle keyboard shortcut (Alt+A) to toggle quick login options
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command+. (period) to toggle admin options
      if (e.metaKey && e.key === ".") {
        setShowQuickOptions(prev => !prev);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Check for recent login on mount
  useEffect(() => {
    refreshRecentLoginStatus();
    if (recentLogin.recent) {
      setIsQuickLogin(true);
      setIdentifier(recentLogin.identifier || "");
    }
  }, [refreshRecentLoginStatus, recentLogin.recent, recentLogin.identifier]);

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated || firebaseUser) {
      navigate("/");
    }
    
    // Check for success message from registration
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, firebaseUser, navigate, location.state]);

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!identifier) {
      setError("Please enter your Cura ID or email address");
      return;
    }

    setIsLoading(true);

    try {
      const success = await quickLogin(identifier);
      if (success) {
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "Quick login failed. Please use full login instead.");
      console.error("Quick login error:", err);
      // Switch to full login if quick login fails
      setIsQuickLogin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate identifier (either email or Cura ID)
    if (!identifier) {
      setError("Please enter your Cura ID or email address");
      return;
    }

    // Validate password
    if (!password) {
      setError("Password is required");
      return;
    }
    
    // Format username if it's not an email (convert to C.Lastname format)
    let loginIdentifier = identifier;
    if (!identifier.includes('@')) {
      // If it's not an email, treat as username and make case-insensitive
      loginIdentifier = identifier.toLowerCase();
    }

    setIsLoading(true);

    try {
      const success = await login(loginIdentifier, password);
      if (success) {
        navigate("/");
      }
      // Error messages are handled by the auth store toast notifications
    } catch (err: any) {
      // Special case for when Firebase is not available
      if (err.code === "auth/api-key-not-valid" || 
          String(err).includes("api-key-not-valid") ||
          err.message?.includes("not initialized") ||
          err.message?.includes("network error")) {
        console.log("Firebase connectivity issue detected, trying secure fallback...");
        // Try admin credentials but without exposing password in code
        if (identifier === "cnp" || identifier === "cnpatterson01@outlook.com") {
          try {
            // Use the entered password instead of hardcoding it
            const success = await login(identifier, password);
            if (success) {
              navigate("/");
              return;
            }
          } catch (innerErr) {
            console.error("Fallback login error:", innerErr);
          }
        }
      }
      
      setError(err.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-100 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <CuraLogo size={120} showText={false} />
          </div>
          <CardTitle className="text-2xl font-bold">Cura Login</CardTitle>
          <CardDescription>
            Enter your credentials for Cura Workspace Access
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {successMessage && (
            <Alert className="mb-4 bg-green-50 text-green-800 border border-green-200">
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          
          {recentLogin.recent && !isQuickLogin && !useFirebaseAuth && (
            <Alert className="mb-4 bg-blue-50 text-blue-800 border border-blue-200">
              <div className="flex items-center">
                <div className="w-full">
                  <p>You were recently logged in</p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-blue-700" 
                    onClick={() => setIsQuickLogin(true)}
                  >
                    Use quick sign-in
                  </Button>
                </div>
              </div>
            </Alert>
          )}

          {useFirebaseAuth ? (
            <div className="space-y-4">
              <SignInOrUpForm 
                signInOptions={{
                  google: true,
                  emailAndPassword: true
                }}
              />
              <div className="text-center mt-4 pt-2">
                <p className="text-xs text-gray-500 mb-2">New user? Your username is in format C.Lastname</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUseFirebaseAuth(false)}
                >
                  Use Legacy Login
                </Button>
              </div>
            </div>
          ) : isQuickLogin ? (
            <form className="space-y-4" onSubmit={handleQuickLogin}>
              <div className="space-y-2">
                <Label htmlFor="quickIdentifier">Your Cura ID or Email</Label>
                <Input
                  id="quickIdentifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={recentLogin.identifier || ""}
                  defaultValue={recentLogin.identifier || ""}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Button 
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Quick Sign in"}
                </Button>
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsQuickLogin(false)}
                >
                  Use Full Sign in
                </Button>
              </div>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-2">
                <Label htmlFor="identifier">Cura ID or Email</Label>
                <Input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="john.doe or john.doe@example.com"
                  autoComplete="username"
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
                  autoComplete="current-password"
                  required
                />
              </div>
              <Button 
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <div className="text-center mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUseFirebaseAuth(true)}
                >
                  Use Firebase Login
                </Button>
              </div>
              {recentLogin.recent && recentLogin.identifier !== identifier && (
                <div className="text-center">
                  <button 
                    type="button" 
                    className="text-xs text-sky-600 hover:underline"
                    onClick={() => {
                      setIdentifier(recentLogin.identifier || "");
                      setIsQuickLogin(true);
                    }}
                  >
                    Use quick login instead
                  </button>
                </div>
              )}
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 items-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <RegisterModal triggerText="Register" />
          </p>
          
          {useFirebaseAuth ? (
            <div className="text-xs text-center border-t border-gray-200 pt-4 w-full h-10">
              <div className="text-[10px] text-muted-foreground opacity-50 cursor-default select-none">
                EHR System v1.0.5
              </div>
            </div>
          ) : showQuickOptions ? (
            <div className="text-xs text-center border-t border-gray-200 pt-4 w-full">
              <p className="text-muted-foreground mb-2">Quick login options:</p>
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent hover:bg-sky-50 text-sky-700 border-sky-200"
                  onClick={() => {
                    setIdentifier("provider");
                    // Focus the password field
                    setTimeout(() => {
                      document.getElementById("password")?.focus();
                    }, 100);
                  }}
                >
                  Provider Login
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent hover:bg-amber-50 text-amber-700 border-amber-200"
                  onClick={() => {
                    setIdentifier("cnp");
                    // Focus the password field
                    setTimeout(() => {
                      document.getElementById("password")?.focus();
                    }, 100);
                  }}
                >
                  Admin Login
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">Press ⌘+. to hide these options</p>
            </div>
          ) : (
            <div className="text-xs text-center border-t border-gray-200 pt-4 w-full h-10">
              <div className="text-[10px] text-muted-foreground opacity-50 cursor-default select-none">
                EHR System v1.0.5
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}