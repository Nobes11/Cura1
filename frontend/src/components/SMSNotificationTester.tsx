import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "../utils/authStore";
import { toast } from "sonner";
import brain from "brain";
import { LoaderCircle } from "lucide-react";

interface Props {
  className?: string;
}

export const SMSNotificationTester: React.FC<Props> = ({ className = "" }) => {
  const [testMessage, setTestMessage] = useState("This is a test notification from Cura");
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string | null>(null);
  const { isAdmin } = useAuthStore();

  const sendTestNotification = async () => {
    if (!testMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);
    try {
      const response = await brain.send_sms_notification({
        message: testMessage,
        recipient_type: "admin",
        test_mode: true
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Test notification sent");
        fetchNotificationLogs();
      } else {
        toast.error(`Failed to send test notification: ${data.message}`);
      }
    } catch (error) {
      console.error("Error sending test notification:", error);
      toast.error("Error sending test notification");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotificationLogs = async () => {
    try {
      const response = await fetch("/api/notifications/logs");
      const data = await response.json();
      setLogs(data.logs);
    } catch (error) {
      console.error("Error fetching notification logs:", error);
      toast.error("Error fetching notification logs");
    }
  };

  // Only admins can use this component
  if (!isAdmin) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>SMS Notification Tester</CardTitle>
        <CardDescription>
          Test the SMS notification system without creating new users
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="test-message">Test Message</Label>
          <Textarea
            id="test-message"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter test notification message"
            className="min-h-[100px]"
          />
        </div>

        {logs && (
          <div className="space-y-2">
            <Label>Recent Notification Logs</Label>
            <div className="bg-slate-50 p-3 rounded-md text-xs font-mono overflow-auto max-h-[200px] whitespace-pre">
              {logs}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={fetchNotificationLogs}
          disabled={isLoading}
        >
          View Logs
        </Button>
        <Button 
          onClick={sendTestNotification}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Test SMS"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
