import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, FileText, Pill, Activity, ClipboardCheck, FlaskConical } from 'lucide-react';

interface Event {
  id: string;
  type: 'documentation' | 'medication' | 'lab' | 'vitals' | 'order' | 'alert' | 'result';
  title: string;
  timestamp: string;
  provider?: string;
  status?: 'normal' | 'abnormal' | 'critical' | 'completed' | 'pending';
  details?: string;
}

interface PatientTimelineViewProps {
  events: Event[];
}

export const PatientTimelineView: React.FC<PatientTimelineViewProps> = ({ events }) => {
  // Sort events by timestamp, newest first
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Group events by date
  const groupedEvents: Record<string, Event[]> = {};
  
  sortedEvents.forEach(event => {
    const date = new Date(event.timestamp).toLocaleDateString();
    if (!groupedEvents[date]) {
      groupedEvents[date] = [];
    }
    groupedEvents[date].push(event);
  });

  // Format time from timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get icon for event type
  const getEventIcon = (type: string) => {
    switch(type) {
      case 'documentation':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'medication':
        return <Pill className="h-4 w-4 text-green-500" />;
      case 'lab':
        return <FlaskConical className="h-4 w-4 text-purple-500" />;
      case 'vitals':
        return <Activity className="h-4 w-4 text-blue-500" />;
      case 'order':
        return <ClipboardCheck className="h-4 w-4 text-amber-500" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'result':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <FileText className="h-4 w-4 text-slate-500" />;
    }
  };

  // Get badge for event status
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch(status) {
      case 'normal':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Normal</Badge>;
      case 'abnormal':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Abnormal</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Critical</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-slate-100 text-slate-800 border-slate-300">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Patient Timeline</CardTitle>
      </CardHeader>
      <CardContent className="p-0 max-h-[500px] overflow-y-auto">
        {Object.keys(groupedEvents).length > 0 ? (
          <div className="divide-y">
            {Object.entries(groupedEvents).map(([date, dayEvents]) => (
              <div key={date} className="p-4">
                <div className="sticky top-0 bg-white z-10 pb-2">
                  <h3 className="font-medium text-slate-800">{date}</h3>
                </div>
                <div className="space-y-4 ml-2">
                  {dayEvents.map(event => (
                    <div key={event.id} className="relative pl-5 border-l border-slate-200">
                      {/* Timeline dot */}
                      <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white bg-slate-300" />
                      
                      {/* Event content */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            {getEventIcon(event.type)}
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            {getStatusBadge(event.status)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                            <span>{formatTime(event.timestamp)}</span>
                            {event.provider && <span>• {event.provider}</span>}
                          </div>
                          {event.details && (
                            <p className="mt-1 text-sm">{event.details}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-slate-500">
            No timeline events available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
