import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface NotificationProps {
  unreadCount: number;
  messages: Message[];
}

export const MessageNotification: React.FC<NotificationProps> = ({ unreadCount, messages }) => {
  const navigate = useNavigate();
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return date.toLocaleDateString();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Recent Messages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {messages.length === 0 ? (
          <div className="px-2 py-4 text-center text-slate-500">No new messages</div>
        ) : (
          <>
            {messages.slice(0, 5).map((message) => (
              <DropdownMenuItem key={message.id} className="p-3 cursor-pointer">
                <div className="w-full">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium">{message.sender}</span>
                    <span className="text-xs text-slate-500">{formatTime(message.timestamp)}</span>
                  </div>
                  <p className="text-sm truncate mt-1">{message.content}</p>
                  {!message.read && (
                    <div className="mt-1">
                      <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                        New
                      </span>
                    </div>
                  )}
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-2 justify-center" onClick={() => navigate("/messages")}>
              <span className="text-blue-600 text-sm font-medium">View All Messages</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};