import { z } from "zod";

// Zod schema for Incident Creation
export const CreateIncidentServerSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  category: z.enum(["new_lead", "missed_call", "overdue_followup", "scheduling_conflict", "caregiver_noshow"]),
  priority: z.enum(["critical", "high", "medium", "low"]),
  customerName: z.string().min(2, "Customer name is required").max(100),
  customerPhone: z.string().max(30).optional(),
  customerEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
  caregiverName: z.string().max(100).optional(),
  description: z.string().min(5, "Description must be at least 5 characters").max(2000),
  suggestedAction: z.string().max(500).optional(),
  dealValue: z.number().nonnegative("Deal value cannot be negative").optional(),
  slaMinutes: z.number().int().positive().optional(),
  source: z.enum(["phone_sms", "crm", "calendar", "email", "scheduling"]).default("phone_sms"),
});

// Zod schema for Incident Update
export const UpdateIncidentServerSchema = z.object({
  status: z.enum(["needs_action", "in_progress", "waiting", "resolved"]).optional(),
  priority: z.enum(["critical", "high", "medium", "low"]).optional(),
  assignedTo: z.string().max(100).optional(),
  suggestedAction: z.string().max(500).optional(),
  resolutionNotes: z.string().max(1000).optional(),
});

// Zod schema for Bulk Incident Actions
export const BulkIncidentActionServerSchema = z.object({
  incidentIds: z.array(z.string().min(1)).min(1, "Select at least one incident"),
  action: z.enum(["resolve", "mark_in_progress", "snooze", "reassign"]),
  assignedTo: z.string().max(100).optional(),
  snoozeMinutes: z.number().int().positive().optional(),
});

// Zod schema for AI Triage & Assistant Requests
export const AITriageServerSchema = z.object({
  incidentId: z.string().min(1, "Incident ID required"),
  userPrompt: z.string().max(500, "Prompt must be under 500 characters").optional(),
  actionType: z.enum([
    "analyze_root_cause",
    "draft_sms_response",
    "find_substitute_caregiver",
    "score_priority",
  ]).default("analyze_root_cause"),
});

// Zod schema for CRM Lead Creation
export const CreateLeadServerSchema = z.object({
  name: z.string().min(2, "Lead name required").max(100),
  phone: z.string().min(7, "Valid phone number required").max(30),
  email: z.string().email("Valid email required"),
  leadSource: z.enum([
    "Web Form",
    "Inbound Call",
    "Hospital Referral",
    "Doctor Office",
    "Google Search",
    "Physician Portal",
  ]),
  status: z.enum(["New", "Contacted", "Qualified", "Appointment", "Won", "Lost"]).default("New"),
  estimatedValue: z.number().nonnegative().default(5000),
  careNeed: z.string().max(500).optional(),
  notes: z.array(z.string().max(500)).optional(),
  tags: z.array(z.string().max(50)).optional(),
  nextFollowUp: z.string().max(100).optional(),
  assignedUser: z.string().max(100).optional(),
});

// Zod schema for CRM Lead Update
export const UpdateLeadServerSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().max(30).optional(),
  email: z.string().email().optional(),
  leadSource: z.enum([
    "Web Form",
    "Inbound Call",
    "Hospital Referral",
    "Doctor Office",
    "Google Search",
    "Physician Portal",
  ]).optional(),
  status: z.enum(["New", "Contacted", "Qualified", "Appointment", "Won", "Lost"]).optional(),
  estimatedValue: z.number().nonnegative().optional(),
  careNeed: z.string().max(500).optional(),
  notes: z.array(z.string()).optional(),
  note: z.string().max(1000).optional(),
  tags: z.array(z.string()).optional(),
  nextFollowUp: z.string().max(100).optional(),
  assignedUser: z.string().max(100).optional(),
});

// Zod schema for Bulk CRM Lead Action
export const BulkLeadActionServerSchema = z.object({
  leadIds: z.array(z.string().min(1)).min(1, "Select at least one lead"),
  action: z.enum(["update_status", "reassign", "tag"]),
  status: z.string().optional(),
  assignedUser: z.string().optional(),
  addTag: z.string().max(50).optional(),
});

// Zod schema for Sending Message (SMS / Chat)
export const SendMessageServerSchema = z.object({
  text: z.string().min(1, "Message text cannot be empty").max(1600),
  sender: z.enum(["lead", "ai_agent", "human_coordinator", "coordinator"]).default("human_coordinator"),
  senderName: z.string().max(100).optional(),
});

// Zod schema for Outbound Telephony / SMS Dispatch
export const TelephonyDispatchServerSchema = z.object({
  toPhone: z.string().min(10, "Valid E.164 phone required").max(20),
  message: z.string().min(1).max(1600),
  leadId: z.string().optional(),
  channel: z.enum(["sms", "voice_callback"]),
});

// Zod schema for Webhook Ingestion (Twilio / External Telephony / EHR Portal)
export const WebhookIngestServerSchema = z.object({
  event: z.string().min(1),
  source: z.enum(["twilio_sms", "twilio_voice", "hospital_portal", "physician_referral"]),
  payload: z.record(z.string(), z.any()),
  signature: z.string().optional(),
});

// Zod schema for AI Tool Execution
export const AIToolExecutionServerSchema = z.object({
  toolName: z.enum([
    "check_caregiver_availability",
    "calculate_drive_transit_time",
    "verify_insurance_eligibility",
    "generate_evv_audit_packet",
    "dispatch_family_notification",
  ]),
  arguments: z.record(z.string(), z.any()),
});
