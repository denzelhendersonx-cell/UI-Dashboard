import React from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Bot,
  User,
  Sliders,
  Sparkles,
  Users,
  MessageSquare,
  Home,
  FileText,
  PhoneCall
} from "lucide-react";
import { UserRole } from "../../types";

export type NavSection =
  | "overview"
  | "leads"
  | "conversations"
  | "followups"
  | "agents"
  | "dashboard"
  | "queue"
  | "table"
  | "analytics"
  | "audit"
  | "rules";

interface SidebarProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  needsAttentionCount: number;
  criticalBreachesCount: number;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
}

export function Sidebar({
  activeSection,
  onSelectSection,
  needsAttentionCount,
  criticalBreachesCount,
  userRole,
  onChangeRole,
}: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 bg-neutral-950 border-r border-neutral-800/80 flex flex-col justify-between select-none">
      {/* Brand & Workspace */}
      <div className="overflow-y-auto">
        <div className="p-5 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/30">
              K
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Kavik Ops
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono font-normal">
                  v2.5
                </span>
              </div>
              <div className="text-[11px] text-neutral-400">Home Care Agency CRM</div>
            </div>
          </div>
        </div>

        {/* Primary Command Center Navigation */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-neutral-400">
            Agency Command Center
          </div>

          {/* 1. Overview */}
          <button
            type="button"
            id="nav-overview-tab"
            onClick={() => onSelectSection("overview")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSection === "overview"
                ? "bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm shadow-indigo-950/50 font-semibold"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Home className={`w-4 h-4 ${activeSection === "overview" ? "text-indigo-400" : "text-neutral-400"}`} />
              <span>Overview</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
              Hub
            </span>
          </button>

          {/* 2. Leads */}
          <button
            type="button"
            id="nav-leads-tab"
            onClick={() => onSelectSection("leads")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSection === "leads"
                ? "bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm shadow-indigo-950/50 font-semibold"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className={`w-4 h-4 ${activeSection === "leads" ? "text-indigo-400" : "text-neutral-400"}`} />
              <span>Leads (CRM)</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Pipeline
            </span>
          </button>

          {/* 3. Conversations */}
          <button
            type="button"
            id="nav-conversations-tab"
            onClick={() => onSelectSection("conversations")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSection === "conversations"
                ? "bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm shadow-indigo-950/50 font-semibold"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <MessageSquare className={`w-4 h-4 ${activeSection === "conversations" ? "text-indigo-400" : "text-neutral-400"}`} />
              <span>Conversations</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Voice / SMS
            </span>
          </button>

          {/* 4. Follow-Ups */}
          <button
            type="button"
            id="nav-followups-tab"
            onClick={() => onSelectSection("followups")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSection === "followups"
                ? "bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm shadow-indigo-950/50 font-semibold"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className={`w-4 h-4 ${activeSection === "followups" ? "text-amber-400" : "text-neutral-400"}`} />
              <span>Follow-Ups</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              20 Due
            </span>
          </button>

          {/* 5. AI Agents */}
          <button
            type="button"
            id="nav-agents-tab"
            onClick={() => onSelectSection("agents")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSection === "agents"
                ? "bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm shadow-indigo-950/50 font-semibold"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bot className={`w-4 h-4 ${activeSection === "agents" ? "text-emerald-400" : "text-neutral-400"}`} />
              <span>AI Agents</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              6 Active
            </span>
          </button>

          <div className="pt-3 px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-neutral-400">
            SaaS & Clinical Ops
          </div>

          <button
            type="button"
            id="nav-dashboard-tab"
            onClick={() => onSelectSection("dashboard")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeSection === "dashboard"
                ? "bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm shadow-indigo-950/50 font-semibold"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className={`w-4 h-4 ${activeSection === "dashboard" ? "text-indigo-400" : "text-neutral-400"}`} />
              <span>Executive MRR</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-neutral-800 text-neutral-300">
              EVV & MRR
            </span>
          </button>

          <button
            type="button"
            id="nav-queue-tab"
            onClick={() => onSelectSection("queue")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeSection === "queue"
                ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-semibold"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Needs Attention</span>
            </div>
            {needsAttentionCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {needsAttentionCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onSelectSection("table")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeSection === "table"
                ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-semibold"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-neutral-400" />
              <span>Incidents Log</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection("audit")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeSection === "audit"
                ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 font-semibold"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Security & Audit</span>
            </div>
          </button>
        </nav>
      </div>

      {/* User Profile & Role Switcher (RBAC) */}
      <div className="p-3 border-t border-neutral-800 bg-neutral-950/80 space-y-2">
        <div className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-xs">
              SJ
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-neutral-200 truncate">Sarah Jenkins</div>
              <div className="text-[10px] text-neutral-400 truncate">Lead Ops Coordinator</div>
            </div>
          </div>
        </div>

        {/* Live Role Switcher for Testing RBAC */}
        <div className="px-2 py-1 space-y-1">
          <div className="flex items-center justify-between text-[10px] text-neutral-400">
            <span>Simulate RBAC Role:</span>
            <span className="capitalize font-mono text-indigo-400 font-semibold">{userRole}</span>
          </div>
          <select
            value={userRole}
            onChange={(e) => onChangeRole(e.target.value as UserRole)}
            className="w-full text-xs py-1 px-2 rounded-md border border-neutral-700 bg-neutral-900 text-neutral-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            aria-label="Switch RBAC user role"
          >
            <option value="coordinator">Coordinator (Sarah - Full Triage)</option>
            <option value="admin">Administrator (Full Access)</option>
            <option value="manager">Manager (Approve & Escalate)</option>
            <option value="viewer">Viewer (Read-Only Mode)</option>
          </select>
        </div>
      </div>
    </aside>
  );
}
