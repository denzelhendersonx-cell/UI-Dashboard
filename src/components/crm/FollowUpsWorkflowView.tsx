import React, { useState } from "react";
import {
  Clock,
  AlertCircle,
  CalendarCheck2,
  CheckCircle2,
  Bot,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  User,
  Zap,
  Check,
  RefreshCw
} from "lucide-react";
import { FollowUpItem, FollowUpUrgency } from "../../types";

interface FollowUpsWorkflowViewProps {
  counts: {
    dueToday: number;
    overdue: number;
    scheduled: number;
    completed: number;
  };
  items: FollowUpItem[];
  onTriggerAI: (id: string) => Promise<void>;
  onMarkCompleted: (id: string) => Promise<void>;
}

export function FollowUpsWorkflowView({
  counts,
  items,
  onTriggerAI,
  onMarkCompleted
}: FollowUpsWorkflowViewProps) {
  const [activeTab, setActiveTab] = useState<FollowUpUrgency>("due_today");
  const [executingId, setExecutingId] = useState<string | null>(null);

  const filteredItems = items.filter((i) => i.urgency === activeTab);

  const handleAction = async (id: string) => {
    setExecutingId(id);
    try {
      await onTriggerAI(id);
    } finally {
      setExecutingId(null);
    }
  };

  const handleComplete = async (id: string) => {
    await onMarkCompleted(id);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Dedicated Patient Follow-Up Workflow
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Automated outreach cadence, post-appointment nurse checks, and AI-assisted patient conversion actions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cadence Engine: Automated Day 1, 3, 7 Sequences</span>
        </div>
      </div>

      {/* 4 Dedicated Stage Filter Cards (Due Today, Overdue, Scheduled, Completed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stage 1: Due Today */}
        <div
          id="tab-followup-due-today"
          onClick={() => setActiveTab("due_today")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-md flex flex-col justify-between ${
            activeTab === "due_today"
              ? "bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-500/40"
              : "bg-neutral-900/70 border-neutral-800 hover:border-neutral-700"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Due Today
              </span>
              <div className="text-3xl font-extrabold font-mono text-amber-400 mt-1">
                {counts.dueToday} leads
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
              High Priority
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-3 pt-2 border-t border-neutral-800/80">
            Intakes requiring immediate same-day outreach
          </p>
        </div>

        {/* Stage 2: Overdue */}
        <div
          id="tab-followup-overdue"
          onClick={() => setActiveTab("overdue")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-md flex flex-col justify-between ${
            activeTab === "overdue"
              ? "bg-rose-950/30 border-rose-500/60 ring-1 ring-rose-500/40"
              : "bg-neutral-900/70 border-neutral-800 hover:border-neutral-700"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                Overdue
              </span>
              <div className="text-3xl font-extrabold font-mono text-rose-400 mt-1">
                {counts.overdue} leads
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20">
              SLA Breached
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-3 pt-2 border-t border-neutral-800/80">
            Requires coordinator triage or AI escalation
          </p>
        </div>

        {/* Stage 3: Scheduled */}
        <div
          id="tab-followup-scheduled"
          onClick={() => setActiveTab("scheduled")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-md flex flex-col justify-between ${
            activeTab === "scheduled"
              ? "bg-indigo-950/30 border-indigo-500/60 ring-1 ring-indigo-500/40"
              : "bg-neutral-900/70 border-neutral-800 hover:border-neutral-700"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <CalendarCheck2 className="w-3.5 h-3.5 text-indigo-400" />
                Scheduled
              </span>
              <div className="text-3xl font-extrabold font-mono text-indigo-300 mt-1">
                {counts.scheduled} leads
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Pipeline Future
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-3 pt-2 border-t border-neutral-800/80">
            Post-appointment checks & multi-day touches
          </p>
        </div>

        {/* Stage 4: Completed */}
        <div
          id="tab-followup-completed"
          onClick={() => setActiveTab("completed")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-md flex flex-col justify-between ${
            activeTab === "completed"
              ? "bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/40"
              : "bg-neutral-900/70 border-neutral-800 hover:border-neutral-700"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Completed
              </span>
              <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
                {counts.completed} leads
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Resolved
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-3 pt-2 border-t border-neutral-800/80">
            Fully converted care plans & finalized notes
          </p>
        </div>
      </div>

      {/* AI Automation Action Center */}
      <div className="p-5 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">
              AI Actionable Follow-Up Queue ({filteredItems.length} active in this view)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-neutral-400">
            Autonomous One-Click Dispatch
          </span>
        </div>

        {/* Queue Items */}
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isExecuting = executingId === item.id;
            const isDone = item.status === "completed" || item.status === "ai_dispatched";

            return (
              <div
                key={item.id}
                id={`followup-item-${item.id}`}
                className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-950/60 hover:bg-neutral-950/90 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{item.leadName}</span>
                    <span className="text-xs font-mono text-neutral-400">({item.phone})</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                      Value: ${item.dealValue.toLocaleString()}
                    </span>
                    <span className="text-xs font-mono text-amber-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.dueDate}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 flex items-center gap-1.5">
                    <span className="font-semibold text-indigo-400">Required Action:</span>
                    <span>&ldquo;{item.actionRequired}&rdquo;</span>
                  </p>

                  <div className="p-2 rounded-lg bg-neutral-900/90 border border-neutral-800/80 text-[11px] text-neutral-400">
                    <span className="text-emerald-400 font-semibold">AI Recommendation: </span>
                    {item.aiSuggestedPrompt}
                  </div>

                  <div className="text-[10px] text-neutral-500 font-mono">
                    Last Contact: {item.lastInteraction} · Assigned to {item.assignedTo}
                  </div>
                </div>

                {/* AI One-Click Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  {item.actionRequired.toLowerCase().includes("call") && (
                    <button
                      type="button"
                      disabled={isExecuting || isDone}
                      onClick={() => handleAction(item.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-600/30 cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{isExecuting ? "Calling Lead..." : isDone ? "Call Initiated" : "AI Call Lead Back"}</span>
                    </button>
                  )}

                  {item.actionRequired.toLowerCase().includes("text") && (
                    <button
                      type="button"
                      disabled={isExecuting || isDone}
                      onClick={() => handleAction(item.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{isExecuting ? "Sending SMS..." : isDone ? "SMS Dispatched" : "AI Send Text"}</span>
                    </button>
                  )}

                  {item.actionRequired.toLowerCase().includes("appointment") && (
                    <button
                      type="button"
                      disabled={isExecuting || isDone}
                      onClick={() => handleAction(item.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/30 cursor-pointer"
                    >
                      <CalendarCheck2 className="w-3.5 h-3.5" />
                      <span>{isExecuting ? "Processing..." : isDone ? "Follow-Up Sent" : "Post-Assessment Check"}</span>
                    </button>
                  )}

                  {item.actionRequired.toLowerCase().includes("3 days") && (
                    <button
                      type="button"
                      disabled={isExecuting || isDone}
                      onClick={() => handleAction(item.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-600/30 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isExecuting ? "Scheduling..." : isDone ? "Snoozed 3 Days" : "Schedule 3-Day Re-Try"}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleComplete(item.id)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="Mark task completed manually"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Done</span>
                  </button>
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="p-8 text-center text-xs text-neutral-500">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
              <span>No follow-ups pending in this category. Excellent work!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
