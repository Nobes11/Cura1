import React, { useState, useEffect } from "react";
import { collection, query, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, orderBy } from "../utils/firebase";
import { db } from "../utils/firebase";
import { useAuthStore } from "../utils/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PlusCircle, Trash2, Clock, UserPlus } from "lucide-react";

interface CollaborationNote {
  id: string;
  content: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    uid: string;
    username: string;
    role: string;
  };
  priority: 'low' | 'medium' | 'high';
  category: 'clinical' | 'administrative' | 'educational' | 'other';
  assignedTo?: string[];
}

interface CollaborationBoardProps {
  boardId?: string; // Optional - if not provided, will show the general board
}

export const CollaborationBoard: React.FC<CollaborationBoardProps> = ({ boardId = 'general' }) => {
  const [notes, setNotes] = useState<CollaborationNote[]>([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNotePriority, setNewNotePriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newNoteCategory, setNewNoteCategory] = useState<'clinical' | 'administrative' | 'educational' | 'other'>('clinical');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeUsers, setActiveUsers] = useState<{uid: string, username: string, role: string}[]>([]);
  
  const { user, isAuthenticated } = useAuthStore();

  // Subscribe to collaboration notes
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Set this user as active on this board
    const userRef = doc(db, 'boardActivity', `${boardId}_${user.uid}`);
    updateDoc(userRef, {
      lastActive: serverTimestamp(),
      username: user.username,
      role: user.role,
      uid: user.uid
    }).catch(() => {
      // If document doesn't exist yet, create it
      addDoc(collection(db, 'boardActivity'), {
        boardId,
        uid: user.uid,
        username: user.username,
        role: user.role,
        lastActive: serverTimestamp()
      });
    });

    // Set up interval to refresh user activity
    const activityInterval = setInterval(() => {
      if (user) {
        updateDoc(userRef, { lastActive: serverTimestamp() }).catch(console.error);
      }
    }, 30000); // Update every 30 seconds

    // Subscribe to notes
    const q = query(
      collection(db, 'collaborationNotes'), 
      // where('boardId', '==', boardId),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notesData: CollaborationNote[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.boardId === boardId) {
          notesData.push({
            id: doc.id,
            content: data.content,
            title: data.title,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
            createdBy: data.createdBy,
            priority: data.priority,
            category: data.category,
            assignedTo: data.assignedTo || []
          });
        }
      });
      setNotes(notesData);
    }, (error) => {
      console.error("Error subscribing to notes:", error);
      toast.error("Failed to load collaboration notes");
    });

    // Subscribe to active users
    const activeUsersQuery = query(collection(db, 'boardActivity'));
    const activityUnsubscribe = onSnapshot(activeUsersQuery, (snapshot) => {
      const now = new Date();
      const activeUsersList: {uid: string, username: string, role: string}[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.boardId === boardId) {
          // Consider users active if they've been seen in the last 5 minutes
          const lastActive = data.lastActive?.toDate() || new Date(0);
          const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
          
          if (lastActive > fiveMinutesAgo && data.uid !== user.uid) {
            activeUsersList.push({
              uid: data.uid,
              username: data.username,
              role: data.role
            });
          }
        }
      });
      
      setActiveUsers(activeUsersList);
    });

    return () => {
      unsubscribe();
      activityUnsubscribe();
      clearInterval(activityInterval);
    };
  }, [isAuthenticated, user, boardId]);

  const handleAddNote = async () => {
    if (!user) return;
    if (!newNoteTitle.trim() || !newNoteContent.trim()) {
      toast.error("Please provide both a title and content for your note");
      return;
    }

    setIsSubmitting(true);

    try {
      await addDoc(collection(db, 'collaborationNotes'), {
        boardId,
        title: newNoteTitle,
        content: newNoteContent,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: {
          uid: user.uid,
          username: user.username,
          role: user.role
        },
        priority: newNotePriority,
        category: newNoteCategory
      });

      // Reset form
      setNewNoteTitle("");
      setNewNoteContent("");
      setNewNotePriority('medium');
      setNewNoteCategory('clinical');
      setIsAddingNote(false);
      toast.success("Note added to collaboration board");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!user) return;

    try {
      await deleteDoc(doc(db, 'collaborationNotes', noteId));
      toast.success("Note deleted");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  // Format date to a human-readable format
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  // Get color for priority
  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  // Get color for category
  const getCategoryColor = (category: 'clinical' | 'administrative' | 'educational' | 'other') => {
    switch (category) {
      case 'clinical': return 'bg-blue-100 text-blue-800';
      case 'administrative': return 'bg-purple-100 text-purple-800';
      case 'educational': return 'bg-cyan-100 text-cyan-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Please log in to view the collaboration board</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Collaboration Board</h2>
          <p className="text-gray-500">Work together with your team in real-time</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {activeUsers.length > 0 && (
            <div>
              <div className="flex -space-x-2">
                {activeUsers.slice(0, 3).map((activeUser) => (
                  <Avatar key={activeUser.uid} className="border-2 border-white w-8 h-8">
                    <AvatarFallback className="bg-primary text-white text-xs">
                      {activeUser.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {activeUsers.length > 3 && (
                  <div className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white">
                    +{activeUsers.length - 3}
                  </div>
                )}
              </div>
            </div>
          )}
          
          <Button onClick={() => setIsAddingNote(true)} disabled={isAddingNote}>
            <PlusCircle className="h-4 w-4 mr-2" /> Add Note
          </Button>
        </div>
      </div>

      {isAddingNote && (
        <Card className="border border-dashed">
          <CardHeader>
            <Input 
              placeholder="Note Title" 
              value={newNoteTitle} 
              onChange={(e) => setNewNoteTitle(e.target.value)} 
              className="font-medium text-lg"
            />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea 
                placeholder="Note content..." 
                value={newNoteContent} 
                onChange={(e) => setNewNoteContent(e.target.value)} 
                className="min-h-24"
              />
              
              <div className="flex flex-wrap gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Priority</label>
                  <div className="flex gap-2">
                    {['low', 'medium', 'high'].map((priority) => (
                      <Badge 
                        key={priority} 
                        variant={newNotePriority === priority ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setNewNotePriority(priority as 'low' | 'medium' | 'high')}
                      >
                        {priority}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Category</label>
                  <div className="flex gap-2">
                    {['clinical', 'administrative', 'educational', 'other'].map((category) => (
                      <Badge 
                        key={category} 
                        variant={newNoteCategory === category ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setNewNoteCategory(category as 'clinical' | 'administrative' | 'educational' | 'other')}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAddingNote(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddNote} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Note"}
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.length === 0 ? (
          <div className="col-span-full py-8 text-center">
            <p className="text-gray-500">No notes yet. Be the first to add one!</p>
          </div>
        ) : (
          notes.map(note => (
            <Card key={note.id} className="relative overflow-hidden">
              <div className="absolute top-2 right-2 flex space-x-1">
                <Badge className={getPriorityColor(note.priority)}>{note.priority}</Badge>
                <Badge className={getCategoryColor(note.category)}>{note.category}</Badge>
              </div>
              
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
                <div className="flex items-center mt-1 text-sm text-gray-500">
                  <Avatar className="h-5 w-5 mr-1">
                    <AvatarFallback className="text-xs">
                      {note.createdBy.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{note.createdBy.username}</span>
                  <span className="mx-1">•</span>
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatDate(note.updatedAt)}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="whitespace-pre-wrap">{note.content}</p>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm">
                  <UserPlus className="h-4 w-4 mr-1" /> Assign
                </Button>
                
                {user.uid === note.createdBy.uid && (
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteNote(note.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
