import React, { useState } from "react";
import { Incident, IncidentStatus, IncidentPriority } from "../../types";
import {
  X,
  Clock,
  User,
  Phone,
  Mail,
  ShieldAlert,
  Bot,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
} from "lucide-react";

interface IncidentDetailModalProps {
  incident: Incident | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: IncidentStatus, notes?: string) => void;
  onOpenAI: (incident: Incident) => void;
  userRole: string;
}

export function IncidentDetailModal({
  incident,
  isOpen,
  onClose,
  onUpdateStatus,
  onOpenAI,
  userRole,
}: IncidentDetailModalProps) {
  const [resolutionNote, setResolutionNote] = useState("");

  if (!isOpen || !incident) return null;

  const handleResolve = () => {
    onUpdateStatus(incident.id, "resolved", resolutionNote || "Resolved via operations detail console");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 font-semibold border border-neutral-700">
              {incident.id}
            </span>
            <span className="text-xs text-neutral-400 capitalize">
              Source: {incident.source.replace("_", " ")}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close details modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-300">
          {/* Title & Status */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-bold text-neutral-100">{incident.title}</h2>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded font-mono text-xs font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
                  Priority Score: {incident.score}/100
                </span>
                <span className="px-2.5 py-1 rounded text-xs font-semibold capitalize bg-neutral-800 text-neutral-200 border border-neutral-700">
                  {incident.status.replace("_", " ")}
                </span>
              </div>
            </div>
            <p className="text-neutral-400 leading-relaxed text-xs">{incident.description}</p>
          </div>

          {/* Key Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-indigo-400" /> Patient / Family Contact
              </span>
              <div className="text-neutral-100 font-medium">{incident.customerName}</div>
              {incident.customerPhone && (
                <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {incident.customerPhone}
                </div>
              )}
              {incident.customerEmail && (
                <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {incident.customerEmail}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-emerald-400" /> Assigned Care Aide
              </span>
              <div className="text-neutral-100 font-medium">
                {incident.caregiverName || "Unassigned"}
              </div>
              {incident.caregiverPhone && (
                <div className="text-[11px] text-neutral-400 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {incident.caregiverPhone}
                </div>
              )}
              <div className="text-[11px] text-neutral-400">
                Ops Coordinator: {incident.assignedTo}
              </div>
            </div>
          </div>

          {/* Operational Why Flagged & Next Step */}
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300">
              <span className="font-semibold text-amber-200">Trigger Rule: </span>
              {incident.whyFlagged}
            </div>

            <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-200">
              <span className="font-semibold text-indigo-300">Suggested Action: </span>
              {incident.suggestedAction}
            </div>
          </div>

          {/* Aurix Autonomous History */}
          <div className="space-y-2 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
            <div className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-indigo-400" />
              Aurix Autonomous Action Trail
            </div>
            <div className="space-y-1.5 pl-1">
              {incident.aurixLog?.map((log, i) => (
                <div key={i} className="text-[11px] text-neutral-400 font-mono flex items-start gap-2">
                  <span className="text-indigo-400 shrink-0">→</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resolution Note if resolving */}
          {userRole !== "viewer" && incident.status !== "resolved" && (
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-medium text-neutral-300">
                Resolution / Coordinator Action Notes
              </label>
              <textarea
                rows={2}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Notes on resolution (e.g. Dispatched Elena Gomez; daughter verified satisfied)..."
                className="w-full p-2 rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-neutral-800 bg-neutral-950/80 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAI(incident);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-indigo-400" />
            Open Aurix AI Copilot
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 text-xs font-medium cursor-pointer"
            >
              Close
            </button>
            {userRole !== "viewer" && incident.status !== "resolved" && (
              <button
                type="button"
                onClick={handleResolve}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Resolved
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
