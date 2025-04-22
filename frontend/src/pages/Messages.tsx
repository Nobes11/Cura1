import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../utils/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Search, Users, PlusCircle, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockConversations, mockMessages } from "../utils/messageData";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  recipientId: string;
  recipientName: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachedPatientId?: string;
  attachedPatientName?: string;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup: boolean;
  groupName?: string;
  groupMembers?: { id: string; name: string }[];
}

// Mock data is now imported from messageData.ts

export default function Messages() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [activeConversationMessages, setActiveConversationMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [activeTab, setActiveTab] = useState("direct");
  const [contactType, setContactType] = useState("colleagues");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Load conversation messages when active conversation changes
    if (activeConversation) {
      setActiveConversationMessages(
        mockMessages.filter(
          (msg) => 
            msg.senderId === activeConversation || 
            msg.recipientId === activeConversation
        ).sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      );
    } else {
      setActiveConversationMessages([]);
    }
  }, [activeConversation]);
  
  if (!user) return null;

  const filteredConversations = conversations.filter(conv => {
    // Add a property to identify if the conversation is with a patient or colleague
    // This is a mock implementation - in a real app, you would have this data from the backend
    const isPatient = conv.participantId.startsWith('patient');
    
    // Filter by contact type when in direct messages
    const matchesContactType = activeTab !== "direct" || 
      (contactType === "patients" ? isPatient : !isPatient);
      
    // Return false if it doesn't match the contact type
    if (!matchesContactType) return false;

    // Filter by search term
    const matchesSearch = searchTerm 
      ? conv.participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (conv.isGroup && conv.groupName?.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    
    // Filter by active tab
    const matchesTab = activeTab === "direct" 
      ? !conv.isGroup 
      : conv.isGroup;
    
    return matchesSearch && matchesTab;
  });

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return;
    
    // In a real app, this would send the message to a backend
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      recipientId: activeConversation,
      recipientName: conversations.find(c => c.participantId === activeConversation)?.participantName || "",
      content: messageText,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Add to local messages
    setActiveConversationMessages(prev => [...prev, newMessage]);
    
    // Update last message in conversations list
    setConversations(prev => 
      prev.map(conv => 
        conv.participantId === activeConversation 
          ? {
              ...conv,
              lastMessage: messageText,
              lastMessageTime: new Date().toISOString()
            }
          : conv
      )
    );
    
    // Clear input
    setMessageText("");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.getDate() === now.getDate() &&
                   date.getMonth() === now.getMonth() &&
                   date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() &&
                        date.getMonth() === yesterday.getMonth() &&
                        date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white border-b shadow-sm py-2">
        <div className="container flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-slate-800">Messages</h1>
          <Button onClick={() => navigate("/")} variant="outline" size="sm">
            Back to Dashboard
          </Button>
        </div>
      </header>
      
      <main className="flex-1 container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          {/* Conversations List */}
          <Card className="md:col-span-1 h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Conversations</CardTitle>
                </div>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Tabs className="mt-2" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="direct">Direct</TabsTrigger>
                  <TabsTrigger value="group">Groups</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {activeTab === "direct" && (
                <div className="mt-2 flex justify-center">
                  <Tabs value={contactType} onValueChange={setContactType}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="colleagues">Colleagues</TabsTrigger>
                      <TabsTrigger value="patients">Patients</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>
              <div className="space-y-1">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No conversations found
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div 
                      key={conversation.id}
                      className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${activeConversation === conversation.participantId ? 'bg-sky-50' : 'hover:bg-slate-100'}`}
                      onClick={() => setActiveConversation(conversation.participantId)}
                    >
                      {conversation.isGroup ? (
                        <div className="bg-slate-200 h-12 w-12 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-slate-600" />
                        </div>
                      ) : (
                        <Avatar className="h-12 w-12">
                          {conversation.participantAvatar ? (
                            <AvatarImage src={conversation.participantAvatar} alt={conversation.participantName} />
                          ) : null}
                          <AvatarFallback className="bg-sky-100 text-sky-800">
                            {conversation.participantName.split(' ').map(name => name[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-medium text-slate-800 truncate">
                            {conversation.isGroup ? conversation.groupName : conversation.participantName}
                          </h3>
                          <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 truncate">{conversation.lastMessage}</p>
                        
                        {conversation.unreadCount > 0 && (
                          <Badge variant="default" className="mt-1">
                            {conversation.unreadCount} new
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Message Content */}
          <Card className="md:col-span-2 h-full flex flex-col overflow-hidden">
            {activeConversation ? (
              <>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center">
                    {conversations.find(c => c.participantId === activeConversation)?.isGroup ? (
                      <div className="bg-slate-200 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-slate-600" />
                      </div>
                    ) : (
                      <Avatar className="h-10 w-10 mr-3">
                        {conversations.find(c => c.participantId === activeConversation)?.participantAvatar ? (
                          <AvatarImage 
                            src={conversations.find(c => c.participantId === activeConversation)?.participantAvatar || ""} 
                            alt={conversations.find(c => c.participantId === activeConversation)?.participantName} 
                          />
                        ) : null}
                        <AvatarFallback className="bg-sky-100 text-sky-800">
                          {(conversations.find(c => c.participantId === activeConversation)?.participantName || "").split(' ').map(name => name[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div>
                      <CardTitle className="text-lg">
                        {conversations.find(c => c.participantId === activeConversation)?.isGroup
                          ? conversations.find(c => c.participantId === activeConversation)?.groupName
                          : conversations.find(c => c.participantId === activeConversation)?.participantName}
                      </CardTitle>
                      {conversations.find(c => c.participantId === activeConversation)?.isGroup && (
                        <div className="text-xs text-slate-500">
                          {conversations.find(c => c.participantId === activeConversation)?.groupMembers?.length} members
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-4" style={{ height: 'calc(100vh - 350px)' }}>
                  <div className="space-y-4">
                    {activeConversationMessages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className="flex max-w-[75%]">
                          {message.senderId !== user.id && (
                            <Avatar className="h-8 w-8 mr-2 mt-1">
                              {message.senderAvatar ? (
                                <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                              ) : null}
                              <AvatarFallback className="bg-slate-200 text-slate-600">
                                {message.senderName.split(' ').map(name => name[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          
                          <div>
                            {message.senderId !== user.id && (
                              <div className="text-xs text-slate-500 mb-1">{message.senderName}</div>
                            )}
                            
                            <div className={`rounded-lg p-3 ${message.senderId === user.id ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-800'}`}>
                              {message.content}
                              
                              {message.attachedPatientId && (
                                <div className={`mt-2 p-2 rounded ${message.senderId === user.id ? 'bg-sky-600' : 'bg-slate-200'}`}>
                                  <div className={`text-xs ${message.senderId === user.id ? 'text-sky-200' : 'text-slate-500'}`}>Patient Reference:</div>
                                  <div className={`font-medium ${message.senderId === user.id ? 'text-white' : 'text-slate-800'}`}>
                                    {message.attachedPatientName}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            <div className="text-xs text-slate-500 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <div className="p-4 border-t">
                  <div className="flex items-end gap-2">
                    <Textarea 
                      placeholder="Type your message..."
                      className="flex-1"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} disabled={!messageText.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center h-[500px] text-center">
                <div className="mb-4 p-4 rounded-full bg-slate-100">
                  <MessageSquare className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Your Messages</h3>
                <p className="text-gray-500 max-w-sm">
                  Select a conversation from the list to start messaging
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
