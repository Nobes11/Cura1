/**
 * Role-based permission system for Cura EHR
 * 
 * This file defines the permissions and access levels for each role in the system.
 * The permission structure follows healthcare workflow standards while maintaining
 * appropriate access controls.
 */

// Role definitions with descriptions
export const roleDefinitions = {
  // Administrative roles
  admin: { name: "System Administrator", category: "administrative" },
  
  // Provider roles - can diagnose, prescribe, and provide medical orders
  physician: { name: "Attending Physician (MD/DO)", category: "provider" },
  resident: { name: "Resident Physician", category: "provider" },
  fellow: { name: "Clinical Fellow", category: "provider" },
  np: { name: "Nurse Practitioner", category: "provider" },
  pa: { name: "Physician Assistant", category: "provider" },
  
  // Nursing roles - can assess, document, and execute orders
  nurse: { name: "Registered Nurse (RN)", category: "nursing" },
  lpn: { name: "Licensed Practical Nurse", category: "nursing" },
  
  // Clinical support roles
  cna: { name: "Certified Nursing Assistant", category: "clinical_support" },
  ma: { name: "Medical Assistant", category: "clinical_support" },
  ccma: { name: "Certified Clinical Medical Assistant", category: "clinical_support" },
  tech: { name: "Patient Care Tech / Clinical Assistant", category: "clinical_support" },
  
  // Medical student roles
  med_student: { name: "Medical Student", category: "student" },
  
  // Documentation roles
  scribe: { name: "Medical Scribe", category: "documentation" },
  
  // Diagnostic and therapeutic roles
  lab_tech: { name: "Laboratory Technician", category: "diagnostic" },
  lab_admin: { name: "Lab Manager or Lab Director", category: "diagnostic" },
  pharmacist: { name: "Pharmacist", category: "therapeutic" },
  pharmacy_tech: { name: "Pharmacy Technician", category: "therapeutic" },
  radiology_tech: { name: "Radiologic Technologist", category: "diagnostic" },
  radiologist: { name: "Radiologist", category: "diagnostic" },
  respiratory_therapist: { name: "RT / Respiratory Care", category: "therapeutic" },
  
  // Patient care coordination
  social_worker: { name: "Social Worker / Discharge Planner", category: "care_coordination" },
  case_manager: { name: "Case Manager", category: "care_coordination" },
  dietitian: { name: "Dietitian / Nutritionist", category: "care_coordination" },
  
  // Administrative support
  registration: { name: "Front Desk / Intake Staff", category: "admin_support" },
  billing: { name: "Billing / Coding / Revenue Cycle", category: "admin_support" },
  
  // Hospital operations
  transport: { name: "Patient Transporter", category: "operations" },
  security: { name: "Hospital Security", category: "operations" },
  it_support: { name: "IT / Tech Support", category: "operations" },
  housekeeping: { name: "Environmental Services", category: "operations" },
  
  // Special access types
  visitor: { name: "Limited or view-only access", category: "special" },
  researcher: { name: "Academic/clinical research access", category: "special" },
}

// Permission types based on healthcare workflows
export enum Permission {
  // System permissions
  ACCESS_ADMIN_PANEL = "access_admin_panel",
  MANAGE_USERS = "manage_users",
  MANAGE_SYSTEM = "manage_system",
  
  // Provider-level clinical permissions
  DIAGNOSE = "diagnose",
  PRESCRIBE = "prescribe",
  ORDER_MEDICATIONS = "order_medications",
  ORDER_LABS = "order_labs",
  ORDER_IMAGING = "order_imaging",
  ORDER_PROCEDURES = "order_procedures",
  FINALIZE_DOCUMENTATION = "finalize_documentation",
  
  // Nursing-level clinical permissions
  DOCUMENT_ASSESSMENTS = "document_assessments",
  RECORD_VITALS = "record_vitals",
  ADMINISTER_MEDICATIONS = "administer_medications",
  INITIATE_PROTOCOLS = "initiate_protocols",
  
  // Support-level clinical permissions
  RECORD_BASIC_VITALS = "record_basic_vitals",
  ASSIST_PROCEDURES = "assist_procedures",
  
  // Department-specific permissions
  MANAGE_LAB_ORDERS = "manage_lab_orders",
  PROCESS_LAB_RESULTS = "process_lab_results",
  MANAGE_MEDICATIONS = "manage_medications",
  PROCESS_RADIOLOGY = "process_radiology",
  PROCESS_RESPIRATORY = "process_respiratory",
  
  // Care coordination permissions
  MANAGE_DISCHARGE = "manage_discharge",
  MANAGE_CARE_PLAN = "manage_care_plan",
  MANAGE_NUTRITION = "manage_nutrition",
  
  // Patient management permissions
  REGISTER_PATIENTS = "register_patients",
  MANAGE_BILLING = "manage_billing",
  
  // Documentation permissions
  DOCUMENT_FOR_PROVIDER = "document_for_provider",
  VIEW_CHARTS = "view_charts",
  EDIT_CHARTS = "edit_charts",
  
  // Research permissions
  ACCESS_RESEARCH_DATA = "access_research_data",
}

// Role-based permissions mapping
export const rolePermissions: Record<string, Permission[]> = {
  // Administrative roles
  admin: [
    Permission.ACCESS_ADMIN_PANEL,
    Permission.MANAGE_USERS,
    Permission.MANAGE_SYSTEM,
    Permission.VIEW_CHARTS,
    Permission.EDIT_CHARTS,
  ],
  
  // Provider roles
  physician: [
    Permission.DIAGNOSE,
    Permission.PRESCRIBE,
    Permission.ORDER_MEDICATIONS,
    Permission.ORDER_LABS,
    Permission.ORDER_IMAGING,
    Permission.ORDER_PROCEDURES,
    Permission.FINALIZE_DOCUMENTATION,
    Permission.DOCUMENT_ASSESSMENTS,
    Permission.RECORD_VITALS,
    Permission.VIEW_CHARTS,
    Permission.EDIT_CHARTS,
    Permission.MANAGE_CARE_PLAN,
  ],
  
  resident: [
    Permission.DIAGNOSE,
    Permission.PRESCRIBE,
    Permission.ORDER_MEDICATIONS,
    Permission.ORDER_LABS,
    Permission.ORDER_IMAGING,
    Permission.ORDER_PROCEDURES,
    Permission.DOCUMENT_ASSESSMENTS,
    Permission.RECORD_VITALS,
    Permission.VIEW_CHARTS,
    Permission.EDIT_CHARTS,
    // Note: May require supervision for some actions
  ],
  
  fellow: [
    Permission.DIAGNOSE,
    Permission.PRESCRIBE,
    Permission.ORDER_MEDICATIONS,
    Permission.ORDER_LABS,
    Permission.ORDER_IMAGING,
    Permission.ORDER_PROCEDURES,
    Permission.FINALIZE_DOCUMENTATION,
    Permission.DOCUMENT_ASSESSMENTS,
    Permission.RECORD_VITALS,
    Permission.VIEW_CHARTS,
    Permission.EDIT_CHARTS,
    Permission.MANAGE_CARE_PLAN,
  ],
  
  np: [
    Permission.DIAGNOSE,
    Permission.PRESCRIBE,
    Permission.ORDER_MEDICATIONS,
    Permission.ORDER_LABS,
    Permission.ORDER_IMAGING,
    Permission.ORDER_PROCEDURES,
    Permission.FINALIZE_DOCUMENTATION,
    Permission.DOCUMENT_ASSESSMENTS,
    Permission.RECORD_VITALS,
    Permission.VIEW_CHARTS,
    Permission.EDIT_CHARTS,
    Permission.MANAGE_CARE_PLAN,
  ],
  
  pa: [
    Permission.DIAGNOSE,
    Permission.PRESCRIBE,
    Permission.ORDER_MEDICATIONS,
    Permission.ORDER_LABS,
    Permission.ORDER_IMAGING,
    Permission.ORDER_PROCEDURES,
    Permission.FINALIZE_DOCUMENTATION,
    Permission.DOCUMENT_ASSESSMENTS,
    Permission.RECORD_VITALS,
    Permission.VIEW_CHARTS,
    Permission.EDIT_CHARTS,
    Permission.MANAGE_CARE_PLAN,
  ],
  
  // Nursing roles
  nurse: [
    Permission.DOCUMENT_ASSESSMENTS,
    Permission.RECORD_VITALS,
    Permission.ADMINISTER_MEDICATIONS,
    Permission.INITIATE_PROTOCOLS,
    Permission.VIEW_CHARTS,
    Permission.EDIT_CHARTS,
    Permission.ASSIST_PROCEDURES,
  ],
  
  lpn: [
    Permission.DOCUMENT_ASSESSMENTS,
    Permission.RECORD_VITALS,
    Permission.ADMINISTER_MEDICATIONS,
    Permission.VIEW_CHARTS,
    Permission.ASSIST_PROCEDURES,
  ],
  
  // Clinical support roles
  cna: [
    Permission.RECORD_BASIC_VITALS,
    Permission.ASSIST_PROCEDURES,
    Permission.VIEW_CHARTS,
  ],
  
  ma: [
    Permission.RECORD_BASIC_VITALS,
    Permission.ASSIST_PROCEDURES,
    Permission.VIEW_CHARTS,
    Permission.DOCUMENT_ASSESSMENTS,
  ],
  
  ccma: [
    Permission.RECORD_BASIC_VITALS,
    Permission.ASSIST_PROCEDURES,
    Permission.VIEW_CHARTS,
    Permission.DOCUMENT_ASSESSMENTS,
  ],
  
  tech: [
    Permission.RECORD_BASIC_VITALS,
    Permission.ASSIST_PROCEDURES,
    Permission.VIEW_CHARTS,
  ],
  
  // Student roles
  med_student: [
    Permission.VIEW_CHARTS,
    // Limited permissions that require supervision
  ],
  
  // Documentation roles
  scribe: [
    Permission.DOCUMENT_FOR_PROVIDER,
    Permission.VIEW_CHARTS,
  ],
  
  // Diagnostic and therapeutic roles
  lab_tech: [
    Permission.PROCESS_LAB_RESULTS,
    Permission.VIEW_CHARTS,
  ],
  
  lab_admin: [
    Permission.MANAGE_LAB_ORDERS,
    Permission.PROCESS_LAB_RESULTS,
    Permission.VIEW_CHARTS,
  ],
  
  pharmacist: [
    Permission.MANAGE_MEDICATIONS,
    Permission.VIEW_CHARTS,
  ],
  
  pharmacy_tech: [
    Permission.VIEW_CHARTS,
  ],
  
  radiology_tech: [
    Permission.PROCESS_RADIOLOGY,
    Permission.VIEW_CHARTS,
  ],
  
  radiologist: [
    Permission.PROCESS_RADIOLOGY,
    Permission.DIAGNOSE,
    Permission.VIEW_CHARTS,
  ],
  
  respiratory_therapist: [
    Permission.PROCESS_RESPIRATORY,
    Permission.VIEW_CHARTS,
    Permission.DOCUMENT_ASSESSMENTS,
  ],
  
  // Patient care coordination
  social_worker: [
    Permission.MANAGE_DISCHARGE,
    Permission.VIEW_CHARTS,
  ],
  
  case_manager: [
    Permission.MANAGE_DISCHARGE,
    Permission.MANAGE_CARE_PLAN,
    Permission.VIEW_CHARTS,
  ],
  
  dietitian: [
    Permission.MANAGE_NUTRITION,
    Permission.VIEW_CHARTS,
  ],
  
  // Administrative support
  registration: [
    Permission.REGISTER_PATIENTS,
    Permission.VIEW_CHARTS,
  ],
  
  billing: [
    Permission.MANAGE_BILLING,
    Permission.VIEW_CHARTS,
  ],
  
  // Hospital operations
  transport: [
    Permission.VIEW_CHARTS,
  ],
  
  security: [
    // Limited access for security purposes
  ],
  
  it_support: [
    Permission.MANAGE_SYSTEM,
  ],
  
  housekeeping: [
    // Very limited access
  ],
  
  // Special access types
  visitor: [
    // Read-only access to specific areas
  ],
  
  researcher: [
    Permission.ACCESS_RESEARCH_DATA,
    Permission.VIEW_CHARTS,
  ],
};

/**
 * Check if a user has a specific permission based on their role
 * @param role The user's role
 * @param permission The permission to check
 * @returns boolean indicating if the user has the permission
 */
export function hasPermission(role: string, permission: Permission): boolean {
  if (!role || !rolePermissions[role]) {
    return false;
  }
  
  return rolePermissions[role].includes(permission);
}

/**
 * Get all permissions for a specific role
 * @param role The role to get permissions for
 * @returns Array of permissions for the role
 */
export function getPermissionsForRole(role: string): Permission[] {
  if (!role || !rolePermissions[role]) {
    return [];
  }
  
  return rolePermissions[role];
}

/**
 * Get all roles that have a specific permission
 * @param permission The permission to check for
 * @returns Array of roles that have the permission
 */
export function getRolesWithPermission(permission: Permission): string[] {
  return Object.entries(rolePermissions)
    .filter(([_, permissions]) => permissions.includes(permission))
    .map(([role]) => role);
}

/**
 * Check if a role can perform a specific clinical action
 * @param role The user's role
 * @param action The clinical action to check
 * @returns boolean indicating if the role can perform the action
 */
export function canPerformClinicalAction(role: string, action: string): boolean {
  // Map common clinical actions to required permissions
  const actionPermissionMap: Record<string, Permission> = {
    'sign_orders': Permission.PRESCRIBE,
    'create_prescription': Permission.PRESCRIBE,
    'finalize_note': Permission.FINALIZE_DOCUMENTATION,
    'order_lab': Permission.ORDER_LABS,
    'order_imaging': Permission.ORDER_IMAGING,
    'order_procedure': Permission.ORDER_PROCEDURES,
    'diagnose_patient': Permission.DIAGNOSE,
    'discharge_patient': Permission.MANAGE_DISCHARGE,
    'administer_med': Permission.ADMINISTER_MEDICATIONS,
  };
  
  const requiredPermission = actionPermissionMap[action];
  if (!requiredPermission) {
    return false; // Unknown action
  }
  
  return hasPermission(role, requiredPermission);
}

/**
 * Get a user-friendly description of a role
 * @param role The role code
 * @returns The human-readable role name
 */
export function getRoleDisplayName(role: string): string {
  return roleDefinitions[role]?.name || role;
}

/**
 * Group roles by their category for display
 * @returns Object with categories as keys and arrays of roles as values
 */
export function getRolesByCategory(): Record<string, {id: string, name: string}[]> {
  const categories: Record<string, {id: string, name: string}[]> = {};
  
  Object.entries(roleDefinitions).forEach(([id, definition]) => {
    const { category, name } = definition;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push({ id, name });
  });
  
  return categories;
}
