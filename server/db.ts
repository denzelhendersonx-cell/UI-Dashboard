import { recordAuditLog } from "./audit";

/**
 * Server-Side Privileged Supabase / Relational Client
 * Strictly encapsulates SUPABASE_SERVICE_ROLE_KEY and private DB credentials.
 * Browser/Client NEVER accesses or receives the service-role key or database credentials.
 */
class PrivilegedDatabaseService {
  private isSupabaseConfigured(): boolean {
    return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  }

  /**
   * Enforces Multi-Tenant Database Query Isolation:
   * Every record MUST match the organization ID authenticated from the session.
   * If a user attempts to fetch or modify a record belonging to another org,
   * it returns an immediate tenant access rejection.
   */
  enforceTenantAccess<T extends { orgId: string }>(item: T | null | undefined, authorizedOrgId: string): T {
    if (!item) {
      throw new Error("Record not found.");
    }
    if (item.orgId !== authorizedOrgId) {
      recordAuditLog({
        orgId: authorizedOrgId,
        action: "TENANT_CROSS_ACCESS_ATTEMPT",
        performedBy: "SYSTEM_DEFENSE",
        role: "security_guard",
        details: `Blocked cross-tenant access attempt to record belonging to org '${item.orgId}'`,
        status: "denied",
      });
      throw new Error("Access denied: Multi-tenant boundary violation.");
    }
    return item;
  }
}

export const privilegedDb = new PrivilegedDatabaseService();
