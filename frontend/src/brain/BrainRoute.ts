import {
  CheckHealthData,
  CreateDocumentationData,
  CreateTemplateData,
  CreateTemplatePayload,
  DeleteTemplateData,
  DocumentationCreate,
  GetDocumentationData,
  GetEncounterDocumentationsData,
  GetNotificationLogsData,
  GetPatientDocumentationsData,
  GetTemplateData,
  GetTemplatesData,
  SMSNotificationRequest,
  SeedInitialTemplatesData,
  SendSmsNotificationData,
  TemplateType,
  UpdateDocumentationData,
  UpdateDocumentationPayload,
  UpdateTemplateData,
  UpdateTemplatePayload,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Send an SMS notification, currently only to the admin. In a production environment, this would integrate with a real SMS service like Twilio. For this implementation, we'll simulate the SMS by logging the message.
   * @tags dbtn/module:notifications, dbtn/hasAuth
   * @name send_sms_notification
   * @summary Send Sms Notification
   * @request POST:/routes/notifications/sms
   */
  export namespace send_sms_notification {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SMSNotificationRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SendSmsNotificationData;
  }

  /**
   * @description Retrieve the notification logs
   * @tags dbtn/module:notifications, dbtn/hasAuth
   * @name get_notification_logs
   * @summary Get Notification Logs
   * @request GET:/routes/notifications/logs
   */
  export namespace get_notification_logs {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetNotificationLogsData;
  }

  /**
   * @description Get all templates or filter by type
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name get_templates
   * @summary Get Templates
   * @request GET:/routes/api/documentation/templates
   */
  export namespace get_templates {
    export type RequestParams = {};
    export type RequestQuery = {
      /** Template Type */
      template_type?: TemplateType | null;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTemplatesData;
  }

  /**
   * @description Create a new template
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name create_template
   * @summary Create Template
   * @request POST:/routes/api/documentation/templates
   */
  export namespace create_template {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateTemplatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = CreateTemplateData;
  }

  /**
   * @description Get a specific template by ID
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name get_template
   * @summary Get Template
   * @request GET:/routes/api/documentation/templates/{template_id}
   */
  export namespace get_template {
    export type RequestParams = {
      /** Template Id */
      templateId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetTemplateData;
  }

  /**
   * @description Update an existing template
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name update_template
   * @summary Update Template
   * @request PUT:/routes/api/documentation/templates/{template_id}
   */
  export namespace update_template {
    export type RequestParams = {
      /** Template Id */
      templateId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = UpdateTemplatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateTemplateData;
  }

  /**
   * @description Delete a template
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name delete_template
   * @summary Delete Template
   * @request DELETE:/routes/api/documentation/templates/{template_id}
   */
  export namespace delete_template {
    export type RequestParams = {
      /** Template Id */
      templateId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteTemplateData;
  }

  /**
   * @description Create a new documentation instance
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name create_documentation
   * @summary Create Documentation
   * @request POST:/routes/api/documentation
   */
  export namespace create_documentation {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DocumentationCreate;
    export type RequestHeaders = {};
    export type ResponseBody = CreateDocumentationData;
  }

  /**
   * @description Get all documentations for a patient
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name get_patient_documentations
   * @summary Get Patient Documentations
   * @request GET:/routes/api/documentation/patient/{patient_id}
   */
  export namespace get_patient_documentations {
    export type RequestParams = {
      /** Patient Id */
      patientId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetPatientDocumentationsData;
  }

  /**
   * @description Get all documentations for an encounter
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name get_encounter_documentations
   * @summary Get Encounter Documentations
   * @request GET:/routes/api/documentation/encounter/{encounter_id}
   */
  export namespace get_encounter_documentations {
    export type RequestParams = {
      /** Encounter Id */
      encounterId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetEncounterDocumentationsData;
  }

  /**
   * @description Get a specific documentation by ID
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name get_documentation
   * @summary Get Documentation
   * @request GET:/routes/api/documentation/{documentation_id}
   */
  export namespace get_documentation {
    export type RequestParams = {
      /** Documentation Id */
      documentationId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetDocumentationData;
  }

  /**
   * @description Update a documentation's content
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name update_documentation
   * @summary Update Documentation
   * @request PUT:/routes/api/documentation/{documentation_id}
   */
  export namespace update_documentation {
    export type RequestParams = {
      /** Documentation Id */
      documentationId: string;
    };
    export type RequestQuery = {
      /** Updated By */
      updated_by: string;
    };
    export type RequestBody = UpdateDocumentationPayload;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateDocumentationData;
  }

  /**
   * @description Seed initial templates if none exist
   * @tags dbtn/module:documentation, dbtn/hasAuth
   * @name seed_initial_templates
   * @summary Seed Initial Templates
   * @request POST:/routes/api/documentation/seed
   */
  export namespace seed_initial_templates {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = SeedInitialTemplatesData;
  }
}
