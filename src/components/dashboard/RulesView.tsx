import React from "react";
import { Bot, Shield, CheckCircle2, Sliders, ToggleLeft, ToggleRight, Sparkles } from "lucide-react";

export function RulesView() {
  const rules = [
    {
      id: "rule-1",
      name: "Autonomous Caregiver No-Show Alert",
      trigger: "GPS geo-fence arrival unverified at shift start + 15 mins",
      action: "Aurix pings caregiver via automated SMS; if no response within 5 mins, escalates to Sarah with Standby Caregiver recommendations.",
      status: "Active",
      severity: "Critical",
    },
    {
      id: "rule-2",
      name: "High-Value Inbound Lead SLA Enforcement",
      trigger: "Inbound web lead or SMS unanswered for > 15 mins",
      action: "Flags priority queue, pre-generates personalized service quote, drafts SMS response for one-click coordinator dispatch.",
      status: "Active",
      severity: "High",
    },
    {
      id: "rule-3",
      name: "Scheduling Double-Booking Conflict Resolver",
      trigger: "Overlap detected between two client calendar blocks",
      action: "Calculates transit buffer; if transit infeasible, proposes optimal shift reallocation to qualified standby aide.",
      status: "Active",
      severity: "High",
    },
    {
      id: "rule-4",
      name: "Recertification & Compliance Window Watchdog",
      trigger: "Caregiver BLS/CPR or TB certification expiring within 14 days",
      action: "Auto-alerts HR coordinator and restricts scheduling for shifts beyond expiration date.",
      status: "Active",
      severity: "Medium",
    },
  ];

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-semibold text-neutral-200">Aurix Autonomous Decision Policy & Rules</h3>
        </div>
        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
          The operations engine evaluates incoming telemetry every 60 seconds against these operational thresholds.
          When a threshold breaches, an Attention Item is automatically queued with pre-computed resolution plans.
        </p>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/60 transition-colors space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-200">{rule.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${
                    rule.severity === "Critical"
                      ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                      : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {rule.severity}
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                {rule.status}
              </span>
            </div>

            <div className="text-xs space-y-1 bg-neutral-950 p-3 rounded-lg border border-neutral-800/80">
              <div>
                <span className="text-neutral-400 font-medium">Trigger Condition: </span>
                <span className="text-neutral-300">{rule.trigger}</span>
              </div>
              <div>
                <span className="text-indigo-400 font-medium">Aurix Autonomous Action: </span>
                <span className="text-neutral-300">{rule.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
