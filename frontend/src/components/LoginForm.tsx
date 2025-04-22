import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export interface LoginCredentials {
  username: string;
  password: string;
  role?: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: "admin" | "physician" | "nurse" | "clerk";
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    name: "Admin User",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=400&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGRvY3RvcnxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: "2",
    username: "drjohnson",
    name: "Dr. Johnson",
    role: "physician",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8ZG9jdG9yfGVufDB8fDB8fHww"
  },
  {
    id: "3",
    username: "nurse1",
    name: "Sarah Thompson",
    role: "nurse",
    avatar: "https://images.unsplash.com/photo-1574684114445-03b8622ab53b?w=400&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fG51cnNlfGVufDB8fDB8fHww"
  },
  {
    id: "4",
    username: "clerk1",
    name: "Michael Wilson",
    role: "clerk",
    avatar: "https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=400&h=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bWFufGVufDB8MXwwfHx8MA%3D%3D"
  }
];

interface Props {
  onLogin: (user: User) => void;
}

export const LoginForm: React.FC<Props> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: ""
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    // For demonstration, simulate API call with timeout
    setTimeout(() => {
      if (credentials.username && credentials.password) {
        // For demo purposes: find a matching user, or return the first user that matches the role if demo mode
        const user = mockUsers.find(u => u.username === credentials.username);
        
        if (user) {
          // Check if password is correct (in a real app, this would be handled securely on the server)
          // Use any password for demo purposes - this is just a UI component and not used in production
          if (credentials.password.length > 0) {
            // Login successful
            toast.success(`Welcome back, ${user.name}!`);
            onLogin(user);
            navigate("/dashboard");
          } else {
            toast.error("Invalid password. Try again.");
          }
        } else if (selectedRole && credentials.username === "demo") {
          // Demo login with role
          const demoUser = mockUsers.find(u => u.role === selectedRole);
          if (demoUser) {
            toast.success(`Logged in as ${demoUser.name} (Demo)`);
            onLogin(demoUser);
            navigate("/dashboard");
          }
        } else {
          toast.error("User not found. Please check your credentials.");
        }
      } else {
        toast.error("Please enter both username and password.");
      }
      setIsLoggingIn(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Log In</CardTitle>
        <CardDescription>
          Enter your credentials to access the ED Tracking System
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter your username"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="pt-2">
            <Label htmlFor="role" className="block mb-2">Quick Login (Demo)</Label>
            <Select onValueChange={setSelectedRole} value={selectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="physician">Physician</SelectItem>
                <SelectItem value="nurse">Nurse</SelectItem>
                <SelectItem value="clerk">Clerk</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              For demo: use username "demo" and any password with a selected role
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Log In"}
          </Button>
          
          <div className="mt-4 text-sm text-center text-gray-500">
            <p className="mb-1">For testing, use these accounts:</p>
            <p>Username: admin, drjohnson, nurse1, or clerk1</p>
            <p>Password: password</p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
};
