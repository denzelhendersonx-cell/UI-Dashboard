import React from "react";
import { DashboardMetrics } from "../../types";
import { AlertCircle, Clock, CheckCheck, Bot, DollarSign, ArrowUpRight } from "lucide-react";
import { CardSkeleton } from "../ui/States";

interface KpiCardsProps {
  metrics?: DashboardMetrics;
  isLoading: boolean;
  onFilterCategory?: (category: string) => void;
  onFilterBreaches?: () => void;
}

export function KpiCards({ metrics, isLoading, onFilterBreaches }: KpiCardsProps) {
  if (isLoading || !metrics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      id: "needs-attention",
      label: "Needs Attention Now",
      value: metrics.needsAttentionCount,
      subtext: "Prioritized by urgency score",
      icon: AlertCircle,
      badgeColor: metrics.needsAttentionCount > 0 ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      accentBg: "border-neutral-800 hover:border-neutral-700",
      isInteractive: false,
    },
    {
      id: "sla-breaches",
      label: "Critical SLA Breaches",
      value: metrics.criticalSlaBreaches,
      subtext: metrics.criticalSlaBreaches > 0 ? "Requires immediate outreach" : "All response windows on track",
      icon: Clock,
      badgeColor: metrics.criticalSlaBreaches > 0 ? "bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold" : "bg-neutral-800 text-neutral-400 border-neutral-700",
      accentBg: metrics.criticalSlaBreaches > 0 ? "border-rose-900/40 bg-rose-950/10" : "border-neutral-800",
      isInteractive: true,
      onClick: onFilterBreaches,
      ctaLabel: "Filter Breaches",
    },
    {
      id: "in-progress",
      label: "Active In Progress",
      value: metrics.inProgressCount,
      subtext: "Assigned & under review",
      icon: CheckCheck,
      badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      accentBg: "border-neutral-800 hover:border-neutral-700",
      isInteractive: false,
    },
    {
      id: "aurix-auto",
      label: "Aurix Auto-Resolved",
      value: metrics.aurixAutomatedResolutions,
      subtext: "Zero human noise today",
      icon: Bot,
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      accentBg: "border-neutral-800 hover:border-neutral-700",
      isInteractive: false,
    },
    {
      id: "deal-value",
      label: "Value at Risk",
      value: `$${(metrics.totalDealValueAtRisk || 0).toLocaleString()}`,
      subtext: "Across pending inquiries",
      icon: DollarSign,
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      accentBg: "border-neutral-800 hover:border-neutral-700",
      isInteractive: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            id={`kpi-${card.id}`}
            onClick={card.onClick}
            className={`p-4 rounded-xl border bg-neutral-900/70 backdrop-blur-sm transition-all duration-150 flex flex-col justify-between ${
              card.accentBg
            } ${card.isInteractive ? "cursor-pointer group hover:border-rose-700/60" : ""}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-neutral-400">{card.label}</span>
              <span className={`p-1.5 rounded-lg border text-xs ${card.badgeColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="mt-3 mb-1 flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight text-neutral-100 font-mono">
                {card.value}
              </span>
              {card.isInteractive && (
                <span className="text-[11px] text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                  {card.ctaLabel} <ArrowUpRight className="w-3 h-3" />
                </span>
              )}
            </div>

            <div className="text-[11px] text-neutral-400 font-normal truncate">
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
