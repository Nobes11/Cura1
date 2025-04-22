import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, User } from "../utils/authStore";
import { collection, query, getDocs, doc, updateDoc, db } from "../utils/firebase";
import { Permission } from "../utils/rolePermissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { CheckCircle, XCircle, AlertCircle, UserPlus, Clock } from "lucide-react";

interface UserWithId extends User {
  uid: string;
}

export default function AdminUserManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserWithId[]>([]);
  const [pendingUsers, setPendingUsers] = useState<UserWithId[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<UserWithId[]>([]);
  const { isAdmin, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Redirect if not admin
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      toast.error("You don't have permission to access this page");
      navigate("/");
    }
  }, [isAdmin, isAuthenticated, isLoading, navigate]);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersQuery = query(collection(db, "users"));
        const querySnapshot = await getDocs(usersQuery);
        
        const fetchedUsers: UserWithId[] = [];
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data() as Omit<User, "uid">;
          fetchedUsers.push({
            uid: doc.id,
            ...userData,
            createdAt: userData.createdAt instanceof Date ? userData.createdAt : new Date(userData.createdAt.seconds * 1000),
            lastLoginAt: userData.lastLoginAt instanceof Date ? userData.lastLoginAt : new Date(userData.lastLoginAt.seconds * 1000)
          });
        });
        
        setUsers(fetchedUsers);
        setPendingUsers(fetchedUsers.filter(user => !user.approved));
        setApprovedUsers(fetchedUsers.filter(user => user.approved));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  const handleApproveUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { approved: true });
      
      // Update local state
      const updatedUsers = users.map(user => 
        user.uid === userId ? { ...user, approved: true } : user
      );
      
      setUsers(updatedUsers);
      setPendingUsers(updatedUsers.filter(user => !user.approved));
      setApprovedUsers(updatedUsers.filter(user => user.approved));
      
      toast.success("User approved successfully");
      
      // In production, this would trigger an SMS notification to the admin
      // and potentially an email to the user
      console.log(`User ${userId} approved - notification would be sent`);
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Failed to approve user");
    }
  };

  const handleDenyUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { approved: false });
      
      // Update local state
      const updatedUsers = users.map(user => 
        user.uid === userId ? { ...user, approved: false } : user
      );
      
      setUsers(updatedUsers);
      setPendingUsers(updatedUsers.filter(user => !user.approved));
      setApprovedUsers(updatedUsers.filter(user => user.approved));
      
      toast.success("User access denied");
    } catch (error) {
      console.error("Error denying user:", error);
      toast.error("Failed to deny user");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Check if the user can approve/reject users
  const canManageUsers = useAuthStore().hasPermission(Permission.MANAGE_USERS);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">User Management</CardTitle>
              <CardDescription>Manage user accounts and access permissions</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                <Clock className="h-3 w-3" /> 
                <span>{pendingUsers.length} Pending</span>
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                <UserPlus className="h-3 w-3" /> 
                <span>{approvedUsers.length} Active</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="pending" className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> Pending Approvals ({pendingUsers.length})
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4" /> Approved Users ({approvedUsers.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" /> All Users ({users.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {pendingUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No pending user registrations</p>
                </div>
              ) : (
                <UserTable 
                  users={pendingUsers} 
                  onApprove={handleApproveUser} 
                  onDeny={handleDenyUser} 
                  formatDate={formatDate} 
                  showActions={true} 
                />
              )}
            </TabsContent>
            
            <TabsContent value="approved">
              {approvedUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No approved users</p>
                </div>
              ) : (
                <UserTable 
                  users={approvedUsers} 
                  onApprove={handleApproveUser} 
                  onDeny={handleDenyUser} 
                  formatDate={formatDate} 
                  showActions={true} 
                />
              )}
            </TabsContent>
            
            <TabsContent value="all">
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No users found</p>
                </div>
              ) : (
                <UserTable 
                  users={users} 
                  onApprove={handleApproveUser} 
                  onDeny={handleDenyUser} 
                  formatDate={formatDate} 
                  showActions={true} 
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface UserTableProps {
  users: UserWithId[];
  onApprove: (userId: string) => void;
  onDeny: (userId: string) => void;
  formatDate: (date: Date) => string;
  showActions: boolean;
}

const UserTable: React.FC<UserTableProps> = ({ users, onApprove, onDeny, formatDate, showActions }) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead>Status</TableHead>
            {showActions && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.uid}>
              <TableCell className="font-medium">{user.username}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell>{user.gender || "Not specified"}</TableCell>
              <TableCell>{user.title || "None"}</TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell>
                {user.approved ? (
                  <Badge className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="mr-1 h-3 w-3" /> Approved
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    <Clock className="mr-1 h-3 w-3" /> Pending
                  </Badge>
                )}
              </TableCell>
              {canManageUsers && (
                <TableCell>
                  <div className="flex items-center gap-2">
                    {!user.approved ? (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-green-600 hover:text-green-800 hover:bg-green-50"
                        onClick={() => onApprove(user.uid)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" /> Approve
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                        onClick={() => onDeny(user.uid)}
                      >
                        <XCircle className="mr-1 h-4 w-4" /> Revoke
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
