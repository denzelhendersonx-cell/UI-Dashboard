import React, { useState } from "react";
import { Incident } from "../../types";
import { api } from "../../lib/api";
import { useToast } from "../ui/Toast";
import {
  Sparkles,
  X,
  Bot,
  Send,
  UserCheck,
  Clock,
  ShieldCheck,
  CheckCircle,
  Copy,
  AlertCircle,
  Loader2,
  RefreshCw,
  FileText,
} from "lucide-react";

interface AITriagePanelProps {
  incident: Incident | null;
  onClose: () => void;
  onResolve: (id: string, notes?: string) => void;
  onReassign: (id: string, newAssignee: string) => void;
  userRole: string;
}

export function AITriagePanel({
  incident,
  onClose,
  onResolve,
  onReassign,
  userRole,
}: AITriagePanelProps) {
  const { toast } = useToast();
  const [activeAction, setActiveAction] = useState<
    "analyze_root_cause" | "draft_sms_response" | "find_substitute_caregiver" | "score_priority"
  >("analyze_root_cause");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{
    analysis: string;
    recommendedAction: string;
    draftCommunication?: string;
    keyTakeaway?: string;
    mode?: string;
  } | null>(null);

  if (!incident) return null;

  const handleRunAI = async (
    actionType: "analyze_root_cause" | "draft_sms_response" | "find_substitute_caregiver" | "score_priority"
  ) => {
    setActiveAction(actionType);
    setIsLoading(true);
    try {
      const res = await api.requestAITriage({
        incidentId: incident.id,
        actionType,
        userPrompt: customPrompt.trim() || undefined,
      });
      setAiResult(res);
      toast({
        type: "success",
        title: "Aurix AI Triage Generated",
        message: res.keyTakeaway || "Operational analysis updated successfully.",
      });
    } catch (err: any) {
      toast({
        type: "error",
        title: "AI Triage Failed",
        message: err.message || "Failed to reach AI service.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      type: "info",
      title: "Copied to Clipboard",
      message: "Ready to paste into SMS/Dispatch portal.",
    });
  };

  const handleApplyResolution = () => {
    if (userRole === "viewer") {
      toast({ type: "error", title: "Action Denied", message: "Viewer role cannot resolve incidents." });
      return;
    }
    const note = aiResult?.recommendedAction
      ? `Action executed based on Aurix AI recommendation: ${aiResult.recommendedAction}`
      : "Resolved via Aurix AI Copilot console.";
    onResolve(incident.id, note);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-neutral-100">Aurix AI Operational Copilot</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-neutral-800 text-indigo-300 border border-neutral-700">
                  {incident.id}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Autonomous triage and decision acceleration for Operations Coordinator
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close Aurix AI modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-300 divide-y divide-neutral-800/80">
          {/* Incident Summary Card */}
          <div className="space-y-3 pb-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-medium text-neutral-100">{incident.title}</div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold">
                  Urgency Score: {incident.score}/100
                </span>
                <span className="text-neutral-400 text-xs">
                  {incident.slaMinutesRemaining < 0
                    ? `Breached by ${Math.abs(incident.slaMinutesRemaining)}m`
                    : `${incident.slaMinutesRemaining}m SLA window`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800">
              <div>
                <span className="text-[11px] text-neutral-400 block">Customer / Family</span>
                <span className="font-medium text-neutral-200">{incident.customerName}</span>
                {incident.customerPhone && (
                  <span className="block text-[11px] text-neutral-400">{incident.customerPhone}</span>
                )}
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block">Assigned Caregiver</span>
                <span className="font-medium text-neutral-200">
                  {incident.caregiverName || "None Assigned"}
                </span>
                {incident.caregiverPhone && (
                  <span className="block text-[11px] text-neutral-400">{incident.caregiverPhone}</span>
                )}
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block">Deal / Account Value</span>
                <span className="font-mono font-medium text-emerald-400">
                  {incident.dealValue ? `$${incident.dealValue.toLocaleString()}` : "Standard Client"}
                </span>
              </div>
            </div>

            {/* Why Flagged */}
            <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div className="leading-relaxed">
                <span className="font-semibold text-amber-200">Flagged Reason: </span>
                {incident.whyFlagged}
              </div>
            </div>

            {/* Prior Aurix Autonomous Actions */}
            {incident.aurixLog && incident.aurixLog.length > 0 && (
              <div className="bg-neutral-950/40 p-3 rounded-lg border border-neutral-800/80 space-y-1.5">
                <div className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-neutral-400" />
                  Aurix Autonomous Audit Trail (Prior Actions)
                </div>
                <div className="space-y-1">
                  {incident.aurixLog.map((entry, idx) => (
                    <div key={idx} className="text-[11px] text-neutral-400 font-mono">
                      • {entry}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Action Tabs */}
          <div className="pt-4 space-y-3">
            <div className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
              <span>Select Aurix Intelligence Action:</span>
              <span className="text-[11px] text-indigo-400 font-mono">Powered by Gemini 3.8 Flash</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleRunAI("analyze_root_cause")}
                disabled={isLoading}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  activeAction === "analyze_root_cause"
                    ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-200"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <ShieldCheck className="w-4 h-4 mb-1 text-indigo-400" />
                <span className="font-medium text-xs">Root Cause</span>
                <span className="text-[10px] text-neutral-400">Deep system analysis</span>
              </button>

              <button
                type="button"
                onClick={() => handleRunAI("draft_sms_response")}
                disabled={isLoading}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  activeAction === "draft_sms_response"
                    ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-200"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Send className="w-4 h-4 mb-1 text-sky-400" />
                <span className="font-medium text-xs">Draft SMS</span>
                <span className="text-[10px] text-neutral-400">Reassure client/aide</span>
              </button>

              <button
                type="button"
                onClick={() => handleRunAI("find_substitute_caregiver")}
                disabled={isLoading}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  activeAction === "find_substitute_caregiver"
                    ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-200"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <UserCheck className="w-4 h-4 mb-1 text-emerald-400" />
                <span className="font-medium text-xs">Find Standby</span>
                <span className="text-[10px] text-neutral-400">Proximity & cert match</span>
              </button>

              <button
                type="button"
                onClick={() => handleRunAI("score_priority")}
                disabled={isLoading}
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  activeAction === "score_priority"
                    ? "bg-indigo-950/40 border-indigo-500/50 text-indigo-200"
                    : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200"
                }`}
              >
                <Sparkles className="w-4 h-4 mb-1 text-amber-400" />
                <span className="font-medium text-xs">Score Priority</span>
                <span className="text-[10px] text-neutral-400">Recalibrate urgency</span>
              </button>
            </div>

            {/* Custom instruction bar */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Optional custom instructions for Aurix (e.g. 'Offer 15% discount for the delay')..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) handleRunAI(activeAction);
                }}
                className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-950 text-xs text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleRunAI(activeAction)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                Generate
              </button>
            </div>

            {/* AI Output Card */}
            {isLoading ? (
              <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950/80 flex flex-col items-center justify-center gap-2 text-center animate-pulse">
                <Bot className="w-6 h-6 text-indigo-400 animate-bounce" />
                <div className="text-xs font-medium text-neutral-300">Aurix is reasoning over operational constraints...</div>
                <div className="text-[11px] text-neutral-400">Checking SLA policy, caregiver availability, and client history</div>
              </div>
            ) : aiResult ? (
              <div className="p-4 rounded-xl border border-indigo-500/30 bg-neutral-950/80 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-neutral-200">Aurix Recommendation</span>
                  </div>
                  {aiResult.keyTakeaway && (
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[11px] font-medium">
                      {aiResult.keyTakeaway}
                    </span>
                  )}
                </div>

                {/* Analysis */}
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
                    Operational Analysis
                  </div>
                  <p className="text-xs text-neutral-200 leading-relaxed">{aiResult.analysis}</p>
                </div>

                {/* Recommended Immediate Action */}
                <div className="space-y-1 bg-indigo-950/30 p-2.5 rounded-lg border border-indigo-500/20">
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-indigo-400">
                    One-Tap Action
                  </div>
                  <p className="text-xs text-indigo-200 font-medium leading-relaxed">
                    {aiResult.recommendedAction}
                  </p>
                </div>

                {/* Draft Communication */}
                {aiResult.draftCommunication && (
                  <div className="space-y-1.5 bg-neutral-900 p-2.5 rounded-lg border border-neutral-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
                        Ready-to-Send Message
                      </span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(aiResult.draftCommunication!)}
                        className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3 h-3" /> Copy Text
                      </button>
                    </div>
                    <p className="text-xs font-mono text-neutral-300 bg-neutral-950 p-2 rounded border border-neutral-800/80 leading-relaxed">
                      "{aiResult.draftCommunication}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-neutral-800 bg-neutral-950/40 text-center">
                <p className="text-xs text-neutral-400">
                  Click any action above to run Aurix AI decision assistance.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-neutral-800 bg-neutral-950 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Actions write directly to operational audit trail</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-neutral-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyResolution}
              disabled={userRole === "viewer"}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Execute Resolution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
