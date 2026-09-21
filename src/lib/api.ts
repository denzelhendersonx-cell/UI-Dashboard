import { Incident, DashboardMetrics, AuditLog, OverviewMetrics, Lead, Conversation, FollowUpItem, AIAgentConfig } from "../types";

let currentRoleHeader = "coordinator";
let currentSessionToken = "sess_sarah_coordinator";

export function setUserRoleHeader(role: string) {
  currentRoleHeader = role;
  // Automatically align simulated session to the corresponding role
  if (role === "admin") currentSessionToken = "sess_marcus_admin";
  else if (role === "manager") currentSessionToken = "sess_ellen_manager";
  else if (role === "viewer") currentSessionToken = "sess_auditor_viewer";
  else currentSessionToken = "sess_sarah_coordinator";
}

export function getUserRoleHeader() {
  return currentRoleHeader;
}

export function setSessionToken(token: string) {
  currentSessionToken = token;
}

export function getSessionToken() {
  return currentSessionToken;
}

/**
 * Generates authenticated server-action headers:
 * Transmits server-managed session tokens without exposing backend secrets.
 */
const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-session-token": currentSessionToken,
  "x-user-role": currentRoleHeader,
});

export const api = {
  // Session & Organization Context (Server-Side Authenticated)
  async getSession(): Promise<{ authenticated: boolean; tenant: any }> {
    const res = await fetch("/api/auth/session", { headers: getHeaders() });
    if (!res.ok) throw new Error(`Session authentication failed (${res.status})`);
    return res.json();
  },

  async getOrganizations(): Promise<{ organizations: any[]; availableSessions: any[] }> {
    const res = await fetch("/api/auth/organizations");
    if (!res.ok) throw new Error(`Failed to load organizations (${res.status})`);
    return res.json();
  },

  async getMetrics(): Promise<DashboardMetrics> {
    const res = await fetch("/api/metrics", { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to load metrics (${res.status})`);
    return res.json();
  },

  async getIncidents(params?: {
    search?: string;
    category?: string;
    priority?: string;
    status?: string;
    source?: string;
    sort?: string;
    order?: "asc" | "desc";
  }): Promise<{ data: Incident[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.category && params.category !== "all") query.set("category", params.category);
    if (params?.priority && params.priority !== "all") query.set("priority", params.priority);
    if (params?.status && params.status !== "all") query.set("status", params.status);
    if (params?.source && params.source !== "all") query.set("source", params.source);
    if (params?.sort) query.set("sort", params.sort);
    if (params?.order) query.set("order", params.order);

    const res = await fetch(`/api/incidents?${query.toString()}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to load incidents (${res.status})`);
    return res.json();
  },

  async createIncident(payload: Partial<Incident> & { slaMinutes?: number }): Promise<Incident> {
    const res = await fetch("/api/incidents", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || "Failed to create incident");
    }
    return data.data;
  },

  async updateIncident(id: string, updates: Partial<Incident> & { resolutionNotes?: string }): Promise<Incident> {
    const res = await fetch(`/api/incidents/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || "Failed to update incident");
    }
    return data.data;
  },

  async bulkActions(payload: {
    incidentIds: string[];
    action: "resolve" | "mark_in_progress" | "snooze" | "reassign";
    assignedTo?: string;
    snoozeMinutes?: number;
  }): Promise<{ updatedCount: number; message: string }> {
    const res = await fetch("/api/incidents/bulk", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || "Bulk action failed");
    }
    return data;
  },

  async getAuditLogs(): Promise<{ data: AuditLog[] }> {
    const res = await fetch("/api/audit-logs", { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to load audit logs (${res.status})`);
    return res.json();
  },

  async requestAITriage(payload: {
    incidentId: string;
    actionType: "analyze_root_cause" | "draft_sms_response" | "find_substitute_caregiver" | "score_priority";
    userPrompt?: string;
  }): Promise<{
    success: boolean;
    mode: string;
    analysis: string;
    recommendedAction: string;
    draftCommunication?: string;
    keyTakeaway?: string;
    confidenceScore: number;
  }> {
    const res = await fetch("/api/ai/triage", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || "AI triage request failed");
    }
    return data;
  },

  async retryDictation(id: string): Promise<{ success: boolean; message: string; data: { id: string } }> {
    return {
      success: true,
      message: "Reprocessed successfully",
      data: { id },
    };
  },

  // 1. Overview API
  async getOverviewMetrics(timeframe: "7d" | "30d" | "90d" = "30d"): Promise<OverviewMetrics> {
    const res = await fetch(`/api/overview?timeframe=${timeframe}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to load overview metrics (${res.status})`);
    return res.json();
  },

  // 2. CRM Leads API
  async getLeads(params?: { search?: string; status?: string; source?: string }): Promise<{ data: Lead[]; total: number }> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.status && params.status !== "all") query.set("status", params.status);
    if (params?.source && params.source !== "all") query.set("source", params.source);

    const res = await fetch(`/api/crm/leads?${query.toString()}`, { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to load leads (${res.status})`);
    return res.json();
  },

  async createLead(lead: Partial<Lead>): Promise<Lead> {
    const res = await fetch("/api/crm/leads", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(lead),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create lead");
    return data.data;
  },

  async updateLead(id: string, updates: Partial<Lead> & { note?: string }): Promise<Lead> {
    const res = await fetch(`/api/crm/leads/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update lead");
    return data.data;
  },

  async bulkLeadAction(payload: {
    leadIds: string[];
    action: "update_status" | "reassign" | "tag";
    status?: string;
    assignedUser?: string;
    addTag?: string;
  }): Promise<{ success: boolean; count: number; message: string }> {
    const res = await fetch("/api/crm/leads/bulk", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Bulk action failed");
    return data;
  },

  // 3. Conversations API
  async getConversations(): Promise<{ data: Conversation[] }> {
    const res = await fetch("/api/conversations", { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to load conversations (${res.status})`);
    return res.json();
  },

  async sendConversationMessage(conversationId: string, payload: { text: string; sender?: string; senderName?: string }): Promise<any> {
    const res = await fetch(`/api/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to send message");
    return data.data;
  },

  // 4. Follow-Ups Workflow API
  async getFollowUps(): Promise<{ counts: { dueToday: number; overdue: number; scheduled: number; completed: number }; items: FollowUpItem[] }> {
    const res = await fetch("/api/follow-ups", { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to load follow-ups (${res.status})`);
    return res.json();
  },

  async triggerAIFollowUp(id: string): Promise<{ success: boolean; message: string; data: FollowUpItem }> {
    const res = await fetch(`/api/follow-ups/${id}/trigger-ai`, {
      method: "POST",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to dispatch AI follow-up");
    return data;
  },

  async updateFollowUp(id: string, updates: Partial<FollowUpItem>): Promise<FollowUpItem> {
    const res = await fetch(`/api/follow-ups/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update follow-up");
    return data.data;
  },

  // 5. AI Agents API
  async getAIAgents(): Promise<{ data: AIAgentConfig[] }> {
    const res = await fetch("/api/ai-agents", { headers: getHeaders() });
    if (!res.ok) throw new Error(`Failed to load AI agents (${res.status})`);
    return res.json();
  },

  async toggleAIAgent(id: string): Promise<{ success: boolean; message: string; data: AIAgentConfig }> {
    const res = await fetch(`/api/ai-agents/${id}/toggle`, {
      method: "PATCH",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to toggle AI agent");
    return data;
  },

  // Telephony Outbound Dispatch
  async dispatchTelephony(payload: { toPhone: string; message: string; channel: "sms" | "voice_callback" }) {
    const res = await fetch("/api/telephony/dispatch", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Telephony dispatch failed");
    return data;
  },

  // Server-Side Autonomous AI Tool Execution
  async executeAITool(toolName: string, args: Record<string, any>) {
    const res = await fetch("/api/ai/tools/execute", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ toolName, arguments: args }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "AI tool execution failed");
    return data;
  },
};
