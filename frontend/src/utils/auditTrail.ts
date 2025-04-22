import { getUserInfo } from './auth';

// Action types for audit logging
export enum AuditActionType {
  CHART_ACCESS = 'CHART_ACCESS',
  CHART_MODIFIED = 'CHART_MODIFIED',
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_MODIFIED = 'ORDER_MODIFIED',
  NOTE_CREATED = 'NOTE_CREATED',
  NOTE_SIGNED = 'NOTE_SIGNED',
  NOTE_MODIFIED = 'NOTE_MODIFIED',
  MEDICATION_ADMINISTERED = 'MEDICATION_ADMINISTERED'
}

// Interface for audit entries
export interface AuditEntry {
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  actionType: AuditActionType;
  patientId: string;
  patientName: string;
  providerId?: string; // The provider under whose authority action is taken
  providerName?: string;
  details: {
    action: string;
    targetId?: string;
    targetType?: string;
    beforeState?: any;
    afterState?: any;
    location?: string;
    ipAddress?: string;
    additionalInfo?: Record<string, any>;
  };
}

// Store audit logs in localStorage for demonstration (would be server-side in production)
const getAuditLogs = (): AuditEntry[] => {
  const logs = localStorage.getItem('auditLogs');
  return logs ? JSON.parse(logs) : [];
};

const saveAuditLogs = (logs: AuditEntry[]) => {
  localStorage.setItem('auditLogs', JSON.stringify(logs));
};

// Create a new audit entry
export const createAuditEntry = (
  actionType: AuditActionType,
  patientId: string,
  patientName: string,
  details: AuditEntry['details'],
  providerId?: string,
  providerName?: string
): AuditEntry => {
  const userInfo = getUserInfo();
  
  const entry: AuditEntry = {
    timestamp: new Date().toISOString(),
    userId: userInfo.userId,
    userName: userInfo.name,
    userRole: userInfo.role,
    actionType,
    patientId,
    patientName,
    providerId,
    providerName,
    details: {
      ...details,
      location: window.location.pathname,
      // In a real app, IP would be captured server-side
    }
  };

  return entry;
};

// Log an audit event
export const logAuditEvent = (
  actionType: AuditActionType,
  patientId: string,
  patientName: string,
  details: AuditEntry['details'],
  providerId?: string,
  providerName?: string
) => {
  const logs = getAuditLogs();
  const newEntry = createAuditEntry(actionType, patientId, patientName, details, providerId, providerName);
  logs.unshift(newEntry); // Add to beginning of array
  saveAuditLogs(logs);
  console.log('Audit log created:', newEntry);
  return newEntry;
};

// Log chart access
export const logChartAccess = (patientId: string, patientName: string, section?: string) => {
  return logAuditEvent(
    AuditActionType.CHART_ACCESS,
    patientId,
    patientName,
    {
      action: `Accessed patient chart${section ? ` - ${section}` : ''}`,
      additionalInfo: { section }
    }
  );
};

// Log order creation
export const logOrderCreation = (
  patientId: string,
  patientName: string,
  orderDetails: any,
  providerId: string,
  providerName: string
) => {
  return logAuditEvent(
    AuditActionType.ORDER_CREATED,
    patientId,
    patientName,
    {
      action: `Created order: ${orderDetails.type}`,
      targetId: orderDetails.id,
      targetType: 'Order',
      afterState: orderDetails
    },
    providerId,
    providerName
  );
};

// Get audit logs for a specific patient
export const getPatientAuditLogs = (patientId: string): AuditEntry[] => {
  const allLogs = getAuditLogs();
  return allLogs.filter(log => log.patientId === patientId);
};

// Get all audit logs
export const getAllAuditLogs = (): AuditEntry[] => {
  return getAuditLogs();
};
