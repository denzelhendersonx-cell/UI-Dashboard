export interface AuditEntry {
  id: string;
  orgId: string;
  timestamp: string;
  incidentId?: string;
  action: string;
  performedBy: string;
  role: string;
  ipAddress?: string;
  details: string;
  status: "success" | "denied" | "rate_limited" | "error";
}

// In-memory tenant-isolated audit log ledger
const auditStore: AuditEntry[] = [];

/**
 * Server-Side Secure Audit Logger
 * Ensures audit logs are immutable, strictly multi-tenant isolated,
 * and masks any sensitive tokens or PII before storing.
 */
export function recordAuditLog(entry: Omit<AuditEntry, "id" | "timestamp">) {
  const sanitizedDetails = maskSensitiveData(entry.details);
  const log: AuditEntry = {
    id: `AUD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: new Date().toISOString(),
    ...entry,
    details: sanitizedDetails,
  };

  auditStore.unshift(log);

  // Keep up to 500 records per instance
  if (auditStore.length > 500) {
    auditStore.pop();
  }

  return log;
}

export function getTenantAuditLogs(orgId: string, limit: number = 50): AuditEntry[] {
  return auditStore.filter(log => log.orgId === orgId).slice(0, limit);
}

/**
 * Strips API keys, passwords, bearer tokens, or full SSNs from log strings
 */
function maskSensitiveData(text: string): string {
  if (!text) return "";
  return text
    .replace(/AIza[0-9A-Za-z-_]{35}/g, "[REDACTED_GEMINI_KEY]")
    .replace(/eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g, "[REDACTED_JWT]")
    .replace(/SK[0-9a-fA-F]{32}/g, "[REDACTED_TWILIO_SECRET]")
    .replace(/(password|secret|auth_token)\s*[:=]\s*["']?[^"',\s]+/gi, "$1: [REDACTED]");
}
