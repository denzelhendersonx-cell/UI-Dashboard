import React, { useState } from "react";
import {
  Bot,
  Phone,
  MessageSquare,
  Clock,
  CalendarCheck2,
  Star,
  FileBarChart,
  CheckCircle2,
  Sparkles,
  Zap,
  Activity,
  Check
} from "lucide-react";
import { AIAgentConfig } from "../../types";

interface AIAgentsAutomationViewProps {
  agents: AIAgentConfig[];
  onToggleAgent: (id: string) => Promise<void>;
}

export function AIAgentsAutomationView({ agents, onToggleAgent }: AIAgentsAutomationViewProps) {
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    try {
      await onToggleAgent(id);
    } finally {
      setTogglingId(null);
    }
  };

  const getSectionIcon = (section: AIAgentConfig["section"]) => {
    switch (section) {
      case "AI Phone Agent":
        return <Phone className="w-5 h-5 text-purple-400" />;
      case "AI SMS Agent":
        return <MessageSquare className="w-5 h-5 text-indigo-400" />;
      case "Lead Follow-Up Agent":
        return <Clock className="w-5 h-5 text-amber-400" />;
      case "Appointment Agent":
        return <CalendarCheck2 className="w-5 h-5 text-emerald-400" />;
      case "Review/Feedback Agent":
        return <Star className="w-5 h-5 text-rose-400" />;
      case "Reporting Agent":
      default:
        return <FileBarChart className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-400" />
            Home Healthcare Autonomous AI Agents
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure, monitor, and toggle specialized artificial intelligence workers across voice, SMS, scheduling, and compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-neutral-300 font-semibold">
            {agents.filter((a) => a.status === "Active").length} of {agents.length} Agents Active
          </span>
        </div>
      </div>

      {/* Agents Grid (6 specialized sections) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => {
          const isActive = agent.status === "Active";
          const isToggling = togglingId === agent.id;

          return (
            <div
              key={agent.id}
              id={`agent-card-${agent.id}`}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isActive
                  ? "bg-neutral-900/80 border-neutral-800/90 shadow-lg shadow-black/20 hover:border-neutral-700"
                  : "bg-neutral-950/60 border-neutral-850 opacity-75"
              }`}
            >
              <div className="space-y-3.5">
                {/* Top Row: Icon, Name & ON/OFF Toggle */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 shadow-inner">
                      {getSectionIcon(agent.section)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-neutral-400 font-semibold tracking-wider">
                        {agent.section}
                      </span>
                      <h3 className="text-sm font-bold text-white tracking-tight">{agent.name}</h3>
                    </div>
                  </div>

                  {/* Simple ON / OFF Toggle Switch */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-mono font-bold ${
                        isActive ? "text-emerald-400" : "text-neutral-500"
                      }`}
                    >
                      {isActive ? "ON" : "OFF"}
                    </span>
                    <button
                      type="button"
                      id={`btn-toggle-agent-${agent.id}`}
                      disabled={isToggling}
                      onClick={() => handleToggle(agent.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isActive ? "bg-emerald-500" : "bg-neutral-800"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          isActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Role Description */}
                <p className="text-xs text-neutral-400 leading-relaxed min-h-[36px]">
                  {agent.roleDescription}
                </p>

                {/* 4 Core Agent Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800/80">
                  <div className="p-2 rounded-xl bg-neutral-950/70 border border-neutral-800/60 text-center">
                    <span className="text-[10px] text-neutral-500 block">Status</span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        isActive ? "text-emerald-400" : "text-neutral-400"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-neutral-950/70 border border-neutral-800/60 text-center">
                    <span className="text-[10px] text-neutral-500 block">Completed</span>
                    <span className="text-xs font-mono font-bold text-white">
                      {agent.tasksCompleted.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-neutral-950/70 border border-neutral-800/60 text-center">
                    <span className="text-[10px] text-neutral-500 block">Success</span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {agent.successRate}%
                    </span>
                  </div>
                </div>

                {/* Last Activity Indicator */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono px-1">
                  <span>Last activity:</span>
                  <span className="text-neutral-200 font-semibold">{agent.lastActivity}</span>
                </div>

                {/* Capabilities Chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider block">
                    Core Capabilities
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 3).map((cap, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] bg-neutral-950 border border-neutral-800 text-neutral-300"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Event Log Snippet */}
              <div className="mt-4 pt-3 border-t border-neutral-800/80 space-y-1.5">
                <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-indigo-400" />
                  Latest Action:
                </span>
                <div className="p-2 rounded-lg bg-neutral-950/90 border border-neutral-800/70 text-[11px] text-neutral-300 font-mono line-clamp-1">
                  {agent.recentEventLog[0]}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
