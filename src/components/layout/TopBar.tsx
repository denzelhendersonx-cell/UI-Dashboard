import React from "react";
import { Plus, RefreshCw, Building2, ShieldCheck, Check } from "lucide-react";
import { UserRole } from "../../types";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onOpenCreate: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  userRole: UserRole;
  breachCount: number;
  tenantOrgName?: string;
  activeSessionKey?: string;
  availableSessions?: Array<{
    sessionKey: string;
    orgId: string;
    orgName: string;
    userName: string;
    role: string;
  }>;
  onSwitchSession?: (sessionKey: string) => void;
}

export function TopBar({
  title,
  subtitle,
  onOpenCreate,
  onRefresh,
  isRefreshing,
  userRole,
  breachCount,
  tenantOrgName = "Kavik Metro Home Healthcare",
  activeSessionKey = "sess_sarah_coordinator",
  availableSessions = [],
  onSwitchSession,
}: TopBarProps) {
  return (
    <header className="h-16 px-6 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-xl flex items-center justify-between shrink-0 sticky top-0 z-30">
      {/* Title & Context */}
      <div>
        <h1 className="text-sm font-bold text-white flex items-center gap-2.5">
          {title}
          {breachCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              {breachCount} SLA {breachCount === 1 ? "Breach" : "Breaches"}
            </span>
          )}
        </h1>
        {subtitle && <p className="text-xs text-neutral-400 mt-0.5 font-normal">{subtitle}</p>}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Multi-Tenant Organization Badge & Session Switcher */}
        {availableSessions.length > 0 && onSwitchSession && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs">
            <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="text-neutral-400 text-[11px] font-medium">Tenant:</span>
            <select
              value={activeSessionKey}
              onChange={(e) => onSwitchSession(e.target.value)}
              className="bg-transparent text-xs font-semibold text-neutral-200 focus:outline-none cursor-pointer"
              title="Switch Active Organization & Session"
              aria-label="Switch Active Organization & Session"
            >
              {availableSessions.map((sess) => (
                <option key={sess.sessionKey} value={sess.sessionKey} className="bg-neutral-900 text-neutral-200">
                  {sess.orgName} ({sess.userName.split(" ")[0]} - {sess.role})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Server Security & AI Engine Status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs shadow-inner">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-neutral-400 font-mono text-[11px]">Server Security:</span>
          <span className="text-emerald-400 font-mono text-[11px] font-semibold">RBAC & Secrets Protected</span>
        </div>

        {/* Refresh Button */}
        <button
          type="button"
          id="btn-topbar-refresh"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh Data from Server"
          aria-label="Refresh Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
        </button>

        {/* Primary "+ Log Incident" CTA */}
        <button
          type="button"
          id="btn-topbar-log-incident"
          onClick={onOpenCreate}
          disabled={userRole === "viewer"}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-900/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <span>Log Incident</span>
        </button>
      </div>
    </header>
  );
}
