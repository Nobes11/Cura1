import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Bell, AlertTriangle, Info, XCircle, CheckCircle, XIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

export type AlertSeverity = 'critical' | 'high' | 'moderate' | 'low' | 'info';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved' | 'dismissed';
export type AlertCategory = 'lab' | 'medication' | 'vital' | 'diagnosis' | 'preventive' | 'protocol' | 'system';

export interface ClinicalAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  category: AlertCategory;
  status: AlertStatus;
  createdAt: string;
  updatedAt?: string;
  acknowledgedBy?: string;
  resolvedBy?: string;
  actions?: {
    label: string;
    action: string;
  }[];
  relatedData?: {
    type: string;
    id: string;
    name: string;
  };
}

interface ClinicalDecisionSupportProps {
  alerts: ClinicalAlert[];
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
  onTakeAction: (alertId: string, action: string) => void;
}

export const ClinicalDecisionSupport: React.FC<ClinicalDecisionSupportProps> = ({
  alerts,
  onAcknowledge,
  onDismiss,
  onTakeAction
}) => {
  // Filter active alerts that need attention
  const activeAlerts = alerts.filter(alert => 
    alert.status === 'active' || alert.status === 'acknowledged'
  );
  
  // Sort alerts by severity and then by creation date
  const sortedAlerts = [...activeAlerts].sort((a, b) => {
    const severityOrder = { critical: 0, high: 1, moderate: 2, low: 3, info: 4 };
    if (severityOrder[a.severity] !== severityOrder[b.severity]) {
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffMins < 1440) { // less than a day
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Get severity icon
  const getSeverityIcon = (severity: AlertSeverity) => {
    switch(severity) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'moderate':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'low':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-slate-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };
  
  // Get category label
  const getCategoryLabel = (category: AlertCategory) => {
    switch(category) {
      case 'lab': return 'Lab Result';
      case 'medication': return 'Medication';
      case 'vital': return 'Vital Sign';
      case 'diagnosis': return 'Diagnosis';
      case 'preventive': return 'Preventive Care';
      case 'protocol': return 'Clinical Protocol';
      case 'system': return 'System Alert';
      default: return 'Alert';
    }
  };
  
  // Get severity class for the border
  const getSeverityClass = (severity: AlertSeverity) => {
    switch(severity) {
      case 'critical': return 'border-l-red-500';
      case 'high': return 'border-l-amber-500';
      case 'moderate': return 'border-l-amber-400';
      case 'low': return 'border-l-blue-400';
      case 'info': return 'border-l-slate-400';
      default: return 'border-l-slate-300';
    }
  };
  
  // Get background class based on status
  const getStatusClass = (status: AlertStatus, severity: AlertSeverity) => {
    if (status === 'acknowledged') {
      return 'bg-slate-50';
    } else if (severity === 'critical') {
      return 'bg-red-50';
    } else if (severity === 'high') {
      return 'bg-amber-50';
    } else {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Clinical Alerts
        </h2>
      </header>
      
      {sortedAlerts.length > 0 ? (
        <div className="space-y-3">
          {sortedAlerts.map(alert => (
            <Card 
              key={alert.id} 
              className={`border-l-4 ${getSeverityClass(alert.severity)} ${getStatusClass(alert.status, alert.severity)} overflow-hidden`}
            >
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{alert.title}</h3>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {getCategoryLabel(alert.category)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
                        {alert.relatedData && (
                          <p className="text-xs text-slate-500 mt-1">
                            Related to: {alert.relatedData.name}
                          </p>
                        )}
                        <p className="text-xs text-slate-500 mt-2">
                          {formatDate(alert.createdAt)}
                          {alert.status === 'acknowledged' && alert.acknowledgedBy && (
                            <> • Acknowledged by {alert.acknowledgedBy}</>
                          )}
                        </p>
                      </div>
                    </div>
                    {alert.status === 'active' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-500 hover:text-slate-700"
                        onClick={() => onDismiss(alert.id)}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {alert.actions && alert.actions.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      {alert.actions.map(action => (
                        <Button 
                          key={action.action}
                          size="sm" 
                          variant={action.label.toLowerCase().includes('order') ? 'default' : 'outline'}
                          onClick={() => onTakeAction(alert.id, action.action)}
                        >
                          {action.label}
                        </Button>
                      ))}
                      
                      {alert.status === 'active' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="ml-auto"
                          onClick={() => onAcknowledge(alert.id)}
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <h3 className="text-lg font-medium">No Active Alerts</h3>
              <p className="text-slate-500">All clinical alerts have been addressed or resolved.</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {alerts.length > activeAlerts.length && (
        <div className="pt-2 text-right">
          <Button variant="link" className="text-sm">
            View {alerts.length - activeAlerts.length} resolved alerts
          </Button>
        </div>
      )}
    </div>
  );
};
