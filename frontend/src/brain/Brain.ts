import {
  CheckHealthData,
  CreateDocumentationData,
  CreateDocumentationError,
  CreateTemplateData,
  CreateTemplateError,
  CreateTemplatePayload,
  DeleteTemplateData,
  DeleteTemplateError,
  DeleteTemplateParams,
  DocumentationCreate,
  GetDocumentationData,
  GetDocumentationError,
  GetDocumentationParams,
  GetEncounterDocumentationsData,
  GetEncounterDocumentationsError,
  GetEncounterDocumentationsParams,
  GetNotificationLogsData,
  GetPatientDocumentationsData,
  GetPatientDocumentationsError,
  GetPatientDocumentationsParams,
  GetTemplateData,
  GetTemplateError,
  GetTemplateParams,
  GetTemplatesData,
  GetTemplatesError,
  GetTemplatesParams,
  SMSNotificationRequest,
  SeedInitialTemplatesData,
  SendSmsNotificationData,
  SendSmsNotificationError,
  UpdateDocumentationData,
  UpdateDocumentationError,
  UpdateDocumentationParams,
  UpdateDocumentationPayload,
  UpdateTemplateData,
  UpdateTemplateError,
  UpdateTemplateParams,
  UpdateTemplatePayload,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Send an SMS notification, currently only to the admin. In a production environment, this would integrate with a real SMS service like Twilio. For this implementation, we'll simulate the SMS by logging the message.
   *
   * @tags dbtn/module:notifications, dbtn/hasAuth
   * @name send_sms_notification
   * @summary Send Sms Notification
   * @request POST:/routes/notifications/sms
   */
  send_sms_notification = (data: SMSNotificationRequest, params: RequestParams = {}) =>
    this.request<SendSmsNotificationData, SendSmsNotificationError>({
      path: `/routes/notifications/sms`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Retrieve the notification logs
   *
   * @tags dbtn/module:notifications, dbtn/hasAuth
   * @name get_notification_logs
   * @summary Get Notification Logs
   * @request GET:/routes/notifications/logs
   */
  get_notification_logs = (params: RequestParams = {}) =>
    this.request<GetNotificationLogsData, any>({
      path: `/routes/notifications/logs`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get all templates or filter by type
   *
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name get_templates
   * @summary Get Templates
   * @request GET:/routes/api/documentation/templates
   */
  get_templates = (query: GetTemplatesParams, params: RequestParams = {}) =>
    this.request<GetTemplatesData, GetTemplatesError>({
      path: `/routes/api/documentation/templates`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * @description Create a new template
   *
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name create_template
   * @summary Create Template
   * @request POST:/routes/api/documentation/templates
   */
  create_template = (data: CreateTemplatePayload, params: RequestParams = {}) =>
    this.request<CreateTemplateData, CreateTemplateError>({
      path: `/routes/api/documentation/templates`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get a specific template by ID
   *
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name get_template
   * @summary Get Template
   * @request GET:/routes/api/documentation/templates/{template_id}
   */
  get_template = ({ templateId, ...query }: GetTemplateParams, params: RequestParams = {}) =>
    this.request<GetTemplateData, GetTemplateError>({
      path: `/routes/api/documentation/templates/${templateId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Update an existing template
   *
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name update_template
   * @summary Update Template
   * @request PUT:/routes/api/documentation/templates/{template_id}
   */
  update_template = (
    { templateId, ...query }: UpdateTemplateParams,
    data: UpdateTemplatePayload,
    params: RequestParams = {},
  ) =>
    this.request<UpdateTemplateData, UpdateTemplateError>({
      path: `/routes/api/documentation/templates/${templateId}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Delete a template
   *
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name delete_template
   * @summary Delete Template
   * @request DELETE:/routes/api/documentation/templates/{template_id}
   */
  delete_template = ({ templateId, ...query }: DeleteTemplateParams, params: RequestParams = {}) =>
    this.request<DeleteTemplateData, DeleteTemplateError>({
      path: `/routes/api/documentation/templates/${templateId}`,
      method: "DELETE",
      ...params,
    });

  /**
   * @description Create a new documentation instance
   *
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name create_documentation
   * @summary Create Documentation
   * @request POST:/routes/api/documentation
   */
  create_documentation = (data: DocumentationCreate, params: RequestParams = {}) =>
    this.request<CreateDocumentationData, CreateDocumentationError>({
      path: `/routes/api/documentation`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Get all documentations for a patient
   *
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name get_patient_documentations
   * @summary Get Patient Documentations
   * @request GET:/routes/api/documentation/patient/{patient_id}
   */
  get_patient_documentations = ({ patientId, ...query }: GetPatientDocumentationsParams, params: RequestParams = {}) =>
    this.request<GetPatientDocumentationsData, GetPatientDocumentationsError>({
      path: `/routes/api/documentation/patient/${patientId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get all documentations for an encounter
   *
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name get_encounter_documentations
   * @summary Get Encounter Documentations
   * @request GET:/routes/api/documentation/encounter/{encounter_id}
   */
  get_encounter_documentations = (
    { encounterId, ...query }: GetEncounterDocumentationsParams,
    params: RequestParams = {},
  ) =>
    this.request<GetEncounterDocumentationsData, GetEncounterDocumentationsError>({
      path: `/routes/api/documentation/encounter/${encounterId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Get a specific documentation by ID
   *
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name get_documentation
   * @summary Get Documentation
   * @request GET:/routes/api/documentation/{documentation_id}
   */
  get_documentation = ({ documentationId, ...query }: GetDocumentationParams, params: RequestParams = {}) =>
    this.request<GetDocumentationData, GetDocumentationError>({
      path: `/routes/api/documentation/${documentationId}`,
      method: "GET",
      ...params,
    });

  /**
   * @description Update a documentation's content
   *
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name update_documentation
   * @summary Update Documentation
   * @request PUT:/routes/api/documentation/{documentation_id}
   */
  update_documentation = (
    { documentationId, ...query }: UpdateDocumentationParams,
    data: UpdateDocumentationPayload,
    params: RequestParams = {},
  ) =>
    this.request<UpdateDocumentationData, UpdateDocumentationError>({
      path: `/routes/api/documentation/${documentationId}`,
      method: "PUT",
      query: query,
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Seed initial templates if none exist
   *
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name seed_initial_templates
   * @summary Seed Initial Templates
   * @request POST:/routes/api/documentation/seed
   */
  seed_initial_templates = (params: RequestParams = {}) =>
    this.request<SeedInitialTemplatesData, any>({
      path: `/routes/api/documentation/seed`,
      method: "POST",
      ...params,
    });
}
