import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuditEntry, AuditActionType, getAllAuditLogs, getPatientAuditLogs } from "../utils/auditTrail";
import { Button } from "@/components/ui/button";

interface Props {
  patientId?: string;
  compact?: boolean;
  maxItems?: number;
}

export const AuditTrail: React.FC<Props> = ({ patientId, compact = false, maxItems }) => {
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Load audit logs
    const logs = patientId ? getPatientAuditLogs(patientId) : getAllAuditLogs();
    setAuditLogs(logs);
  }, [patientId]);

  const getActionColor = (actionType: AuditActionType) => {
    switch (actionType) {
      case AuditActionType.CHART_ACCESS:
        return "bg-blue-50 text-blue-600 border-blue-100";
      case AuditActionType.CHART_MODIFIED:
        return "bg-amber-50 text-amber-600 border-amber-100";
      case AuditActionType.ORDER_CREATED:
      case AuditActionType.NOTE_CREATED:
        return "bg-green-50 text-green-600 border-green-100";
      case AuditActionType.ORDER_MODIFIED:
      case AuditActionType.NOTE_MODIFIED:
        return "bg-purple-50 text-purple-600 border-purple-100";
      case AuditActionType.NOTE_SIGNED:
        return "bg-indigo-50 text-indigo-600 border-indigo-100";
      case AuditActionType.MEDICATION_ADMINISTERED:
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const displayLogs = maxItems && !showAll ? auditLogs.slice(0, maxItems) : auditLogs;

  return (
    <Card className={compact ? "border-0 shadow-none" : ""}>
      <CardHeader className={compact ? "p-3" : "p-4"}>
        <CardTitle className={compact ? "text-md" : "text-lg"}>
          {patientId ? "Patient Activity Log" : "System Audit Trail"}
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? "p-3 pt-0" : "p-4 pt-0"}>
        {auditLogs.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No activity recorded</div>
        ) : (
          <div className="space-y-3">
            {displayLogs.map((log, index) => (
              <div key={index} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <Badge className={getActionColor(log.actionType)} variant="outline">
                      {log.actionType.replace("_", " ")}
                    </Badge>
                    <span className="text-sm font-medium">{log.userName}</span>
                    <span className="text-xs text-gray-500">({log.userRole})</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatTimestamp(log.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-700">{log.details.action}</p>
                {log.providerId && (
                  <p className="text-xs text-gray-500 mt-1">
                    Provider: {log.providerName} (#{log.providerId})
                  </p>
                )}
              </div>
            ))}
            
            {maxItems && auditLogs.length > maxItems && (
              <div className="text-center mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "Show Less" : `Show All (${auditLogs.length})`}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
