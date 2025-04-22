/** AssessmentPlanTemplate */
export interface AssessmentPlanTemplate {
  /** Id */
  id: string;
  /** Name */
  name: string;
  /** @default "assessmentPlan" */
  type?: TemplateType;
  /** Description */
  description?: string | null;
  /** Created At */
  created_at?: string;
  /** Updated At */
  updated_at?: string;
  /** Assessment Fields */
  assessment_fields: Record<string, any>[];
  /** Plan Fields */
  plan_fields: Record<string, any>[];
}

/** ChiefComplaintTemplate */
export interface ChiefComplaintTemplate {
  /** Id */
  id: string;
  /** Name */
  name: string;
  /** @default "chiefComplaint" */
  type?: TemplateType;
  /** Description */
  description?: string | null;
  /** Created At */
  created_at?: string;
  /** Updated At */
  updated_at?: string;
  /** Fields */
  fields: Record<string, any>[];
}

/** DocumentationCreate */
export interface DocumentationCreate {
  /** Patient Id */
  patient_id: string;
  /** Encounter Id */
  encounter_id: string;
  /** Template Id */
  template_id: string;
  template_type: TemplateType;
  /** Content */
  content: Record<string, any>;
  /** Created By */
  created_by: string;
}

/** Finding */
export interface Finding {
  /** Id */
  id: string;
  /** Name */
  name: string;
  /**
   * Normal
   * @default true
   */
  normal?: boolean;
  /** Value */
  value?: string | null;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** PhysicalExamTemplate */
export interface PhysicalExamTemplate {
  /** Id */
  id: string;
  /** Name */
  name: string;
  /** @default "physicalExam" */
  type?: TemplateType;
  /** Description */
  description?: string | null;
  /** Created At */
  created_at?: string;
  /** Updated At */
  updated_at?: string;
  /** Sections */
  sections: Section[];
}

/** ROSTemplate */
export interface ROSTemplate {
  /** Id */
  id: string;
  /** Name */
  name: string;
  /** @default "reviewOfSystems" */
  type?: TemplateType;
  /** Description */
  description?: string | null;
  /** Created At */
  created_at?: string;
  /** Updated At */
  updated_at?: string;
  /** Sections */
  sections: Section[];
}

/** SMSNotificationRequest */
export interface SMSNotificationRequest {
  /** Message */
  message: string;
  /**
   * Recipient Type
   * @default "admin"
   */
  recipient_type?: string;
  /**
   * Test Mode
   * @default false
   */
  test_mode?: boolean;
}

/** SMSNotificationResponse */
export interface SMSNotificationResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
}

/** Section */
export interface Section {
  /** Id */
  id: string;
  /** Name */
  name: string;
  /** Findings */
  findings: Finding[];
}

/** TemplateType */
export enum TemplateType {
  ReviewOfSystems = "reviewOfSystems",
  ChiefComplaint = "chiefComplaint",
  PhysicalExam = "physicalExam",
  AssessmentPlan = "assessmentPlan",
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type SendSmsNotificationData = SMSNotificationResponse;

export type SendSmsNotificationError = HTTPValidationError;

/** Response Get Notification Logs */
export type GetNotificationLogsData = Record<string, any>;

export interface GetTemplatesParams {
  /** Template Type */
  template_type?: TemplateType | null;
}

export type GetTemplatesData = any;

export type GetTemplatesError = HTTPValidationError;

/** Template */
export type CreateTemplatePayload =
  | ROSTemplate
  | ChiefComplaintTemplate
  | PhysicalExamTemplate
  | AssessmentPlanTemplate;

export type CreateTemplateData = any;

export type CreateTemplateError = HTTPValidationError;

export interface GetTemplateParams {
  /** Template Id */
  templateId: string;
}

export type GetTemplateData = any;

export type GetTemplateError = HTTPValidationError;

/** Template */
export type UpdateTemplatePayload =
  | ROSTemplate
  | ChiefComplaintTemplate
  | PhysicalExamTemplate
  | AssessmentPlanTemplate;

export interface UpdateTemplateParams {
  /** Template Id */
  templateId: string;
}

export type UpdateTemplateData = any;

export type UpdateTemplateError = HTTPValidationError;

export interface DeleteTemplateParams {
  /** Template Id */
  templateId: string;
}

export type DeleteTemplateData = any;

export type DeleteTemplateError = HTTPValidationError;

export type CreateDocumentationData = any;

export type CreateDocumentationError = HTTPValidationError;

export interface GetPatientDocumentationsParams {
  /** Patient Id */
  patientId: string;
}

export type GetPatientDocumentationsData = any;

export type GetPatientDocumentationsError = HTTPValidationError;

export interface GetEncounterDocumentationsParams {
  /** Encounter Id */
  encounterId: string;
}

export type GetEncounterDocumentationsData = any;

export type GetEncounterDocumentationsError = HTTPValidationError;

export interface GetDocumentationParams {
  /** Documentation Id */
  documentationId: string;
}

export type GetDocumentationData = any;

export type GetDocumentationError = HTTPValidationError;

/** Content */
export type UpdateDocumentationPayload = Record<string, any>;

export interface UpdateDocumentationParams {
  /** Updated By */
  updated_by: string;
  /** Documentation Id */
  documentationId: string;
}

export type UpdateDocumentationData = any;

export type UpdateDocumentationError = HTTPValidationError;

export type SeedInitialTemplatesData = any;
