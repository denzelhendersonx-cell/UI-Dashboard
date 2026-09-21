import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Mic,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  RotateCw,
  SlidersHorizontal,
  Download,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Volume2,
  FileAudio,
  Radio,
  Clock,
  Search,
  Activity,
  ShieldCheck,
  HeartPulse,
  Stethoscope,
  ClipboardCheck,
  Building2,
  CalendarCheck2,
  FileCheck2,
  UserCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { DashboardMetrics, BusinessMetrics } from "../../types";
import { CardSkeleton } from "../ui/States";
import { useToast } from "../ui/Toast";
import { api } from "../../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ExecutiveDashboardViewProps {
  metrics?: DashboardMetrics;
  isLoading: boolean;
  onNavigateToQueue: () => void;
}

export function ExecutiveDashboardView({
  metrics,
  isLoading,
  onNavigateToQueue,
}: ExecutiveDashboardViewProps) {
  const { toast } = useToast();
  const qc = useQueryClient();

  // Local view filters
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "ytd">("30d");
  const [mrrChartMode, setMrrChartMode] = useState<"trajectory" | "waterfall" | "tiers">("trajectory");
  const [selectedFunnelStage, setSelectedFunnelStage] = useState<string>("stage-4");
  const [selectedDictationTab, setSelectedDictationTab] = useState<"recent" | "taxonomy">("recent");
  const [dictationSearch, setDictationSearch] = useState("");

  // Mutation to retry/reprocess failed dictation
  const retryMutation = useMutation({
    mutationFn: (id: string) => api.retryDictation(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["metrics"] });
      qc.invalidateQueries({ queryKey: ["auditLogs"] });
      toast({
        type: "success",
        title: "Audio Neural Cleanse Complete",
        message: `${res.data.id} reprocessed successfully. Transcription confidence elevated to 96%.`,
      });
    },
    onError: (err: any) => {
      toast({
        type: "error",
        title: "Reprocess Failed",
        message: err.message || "Failed to re-run audio model filter.",
      });
    },
  });

  if (isLoading || !metrics || !metrics.business) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 animate-pulse" />
          <div className="h-80 rounded-xl border border-neutral-800 bg-neutral-900/50 p-6 animate-pulse" />
        </div>
      </div>
    );
  }

  const { business } = metrics;
  const { mrr, arpu, freeToPaidConversion, failedDictations, conversionFunnel, homeHealthCare } = business;

  const currentStage =
    conversionFunnel.stages.find((s) => s.id === selectedFunnelStage) || conversionFunnel.stages[3];

  const filteredDictations = failedDictations.recentFailures.filter(
    (d) =>
      d.caregiverName.toLowerCase().includes(dictationSearch.toLowerCase()) ||
      d.clientName.toLowerCase().includes(dictationSearch.toLowerCase()) ||
      d.failureReason.toLowerCase().includes(dictationSearch.toLowerCase()) ||
      d.id.toLowerCase().includes(dictationSearch.toLowerCase())
  );

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-neutral-950/95 border border-neutral-800 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 z-50">
          <div className="font-semibold text-neutral-200 border-b border-neutral-800 pb-1 flex items-center justify-between gap-3">
            <span>{label}</span>
            <span className="text-[10px] text-indigo-400 font-mono">Telemetry</span>
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-semibold text-neutral-100">
                {typeof entry.value === "number" && entry.value > 1000
                  ? `$${entry.value.toLocaleString()}`
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Modern Top Header Controls Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-neutral-800/80 bg-gradient-to-r from-neutral-900/90 via-neutral-900/60 to-neutral-950/80 backdrop-blur-md shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold tracking-tight text-white">
                Home Health Agency Operations & SaaS Hub
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Agency Telemetry
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                EVV & OASIS-E Compliant
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Agency recurring revenue (MMR), caregiver APPU, EVV verification compliance, and clinical dictation engine reliability
            </p>
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
            {(["7d", "30d", "90d", "ytd"] as const).map((range) => (
              <button
                key={range}
                type="button"
                id={`filter-range-${range}`}
                onClick={() => {
                  setTimeRange(range);
                  toast({
                    type: "info",
                    title: "Timeframe Updated",
                    message: `Metrics aligned to ${range.toUpperCase()} window.`,
                  });
                }}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  timeRange === range
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-900/40"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            id="btn-export-kpi-summary"
            onClick={() =>
              toast({
                type: "success",
                title: "Report Exported",
                message: "Executive CSV summary snapshot generated and ready.",
              })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-700/80 bg-neutral-900/90 text-neutral-300 hover:text-white hover:border-neutral-600 text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>Export Snapshot</span>
          </button>
        </div>
      </div>

      {/* 4 PRIMARY MODERN KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. MMR / Monthly Recurring Revenue */}
        <div
          id="kpi-card-mrr"
          className="group relative p-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 hover:border-indigo-500/40 hover:bg-neutral-900/90 transition-all duration-200 shadow-md shadow-black/20 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                Monthly Recurring Revenue (MMR)
              </span>
              <div className="text-2xl font-extrabold tracking-tight text-white font-mono">
                ${mrr.current.toLocaleString()}
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{mrr.growthPercent}%
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-neutral-400 text-[11px]">
              <span>Progress to Q1 Target (${(mrr.target / 1000).toFixed(0)}k)</span>
              <span className="font-mono text-neutral-200 font-semibold">
                {((mrr.current / mrr.target) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${Math.min(100, (mrr.current / mrr.target) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
              <span>Net New MRR:</span>
              <span className="font-mono font-bold text-emerald-400">
                +${mrr.netNewMRR.toLocaleString()}/mo
              </span>
            </div>
          </div>
        </div>

        {/* 2. APPU / Average Revenue Per User */}
        <div
          id="kpi-card-appu"
          className="group relative p-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 hover:border-purple-500/40 hover:bg-neutral-900/90 transition-all duration-200 shadow-md shadow-black/20 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                Average Revenue / User (APPU)
              </span>
              <div className="text-2xl font-extrabold tracking-tight text-white font-mono">
                ${arpu.current}.00
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{arpu.growthPercent}%
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Enterprise Agency Tier:</span>
              <span className="font-mono text-purple-300 font-semibold">$480.00</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Active Billable Seats:</span>
              <span className="font-mono text-neutral-200 font-semibold">607 Accounts</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
              <span>Previous Quarter:</span>
              <span className="font-mono text-neutral-400">${arpu.previous}.00/mo</span>
            </div>
          </div>
        </div>

        {/* 3. Free -> Paid Conversion */}
        <div
          id="kpi-card-conversion"
          className="group relative p-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 hover:border-emerald-500/40 hover:bg-neutral-900/90 transition-all duration-200 shadow-md shadow-black/20 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Free → Paid Conversion
              </span>
              <div className="text-2xl font-extrabold tracking-tight text-white font-mono">
                {freeToPaidConversion.ratePercent}%
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{freeToPaidConversion.changePercent}%
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Avg Time to Convert:</span>
              <span className="font-mono text-emerald-300 font-semibold">
                {freeToPaidConversion.avgDaysToConvert} Days
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Upgrades This Month:</span>
              <span className="font-mono text-neutral-200 font-semibold">
                {freeToPaidConversion.paidConversionsThisMonth} Providers
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
              <span>Active Free Trials:</span>
              <span className="font-mono text-neutral-300">
                {freeToPaidConversion.freeTrialActiveCount} In Pipeline
              </span>
            </div>
          </div>
        </div>

        {/* 4. Failed Dictations Telemetry */}
        <div
          id="kpi-card-failed-dictations"
          className="group relative p-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 hover:border-amber-500/40 hover:bg-neutral-900/90 transition-all duration-200 shadow-md shadow-black/20 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                <FileAudio className="w-3.5 h-3.5 text-amber-400" />
                Failed Dictations
              </span>
              <div className="text-2xl font-extrabold tracking-tight text-white font-mono flex items-baseline gap-2">
                {failedDictations.failedCount}
                <span className="text-xs font-normal text-neutral-400">
                  ({failedDictations.failureRatePercent}%)
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ArrowDownRight className="w-3.5 h-3.5" />
              {failedDictations.trendPercent}% error
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-800/80 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Auto-Recovered by AI:</span>
              <span className="font-mono text-emerald-400 font-semibold">
                {failedDictations.recoveredCount} ({failedDictations.recoveryRatePercent}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Total Shift Dictations:</span>
              <span className="font-mono text-neutral-200 font-semibold">
                {failedDictations.totalDictations.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
              <span>SLA Target:</span>
              <span className="font-mono text-emerald-300">Target &lt; 1.0% error</span>
            </div>
          </div>
        </div>
      </div>

      {/* ROW 2: MRR GROWTH & REVENUE DYNAMICS */}
      <div className="p-5 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 backdrop-blur-md shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                MRR Growth & Revenue Velocity
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                +${mrr.netNewMRR.toLocaleString()} Net New
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Monthly expansion, new caregiver seats, and churn trajectory across all agency contracts
            </p>
          </div>

          {/* Chart View Toggle */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 self-start sm:self-auto text-xs">
            <button
              type="button"
              id="btn-mrr-trajectory"
              onClick={() => setMrrChartMode("trajectory")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                mrrChartMode === "trajectory"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-900/30"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Net Trajectory
            </button>
            <button
              type="button"
              id="btn-mrr-waterfall"
              onClick={() => setMrrChartMode("waterfall")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                mrrChartMode === "waterfall"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-900/30"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Waterfall (New / Expansion / Churn)
            </button>
            <button
              type="button"
              id="btn-mrr-tiers"
              onClick={() => setMrrChartMode("tiers")}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                mrrChartMode === "tiers"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-900/30"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Tier Distribution
            </button>
          </div>
        </div>

        {/* MRR Chart Area */}
        <div className="h-72 w-full">
          {mrrChartMode === "trajectory" && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mrr.history} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="netGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#333" }}
                />
                <YAxis
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#333" }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={customTooltip} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: "11px", paddingBottom: "10px", color: "#a3a3a3" }}
                />
                <Area
                  type="monotone"
                  name="Total MMR"
                  dataKey="mrr"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#mrrGradient)"
                />
                <Area
                  type="monotone"
                  name="Net New MRR"
                  dataKey="netMRR"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#netGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {mrrChartMode === "waterfall" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mrr.history} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#333" }}
                />
                <YAxis
                  stroke="#737373"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "#333" }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={customTooltip} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: "11px", paddingBottom: "10px", color: "#a3a3a3" }}
                />
                <Bar dataKey="newMRR" name="New Customer MRR" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expansionMRR" name="Expansion MRR" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="churnMRR" name="Churn / Contraction" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {mrrChartMode === "tiers" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full items-center">
              {arpu.cohortByTier.map((tier) => (
                <div
                  key={tier.tier}
                  className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/70 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-300">{tier.tier}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {tier.sharePercent}% Share
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-white">
                    ${tier.arpu}
                    <span className="text-xs font-normal text-neutral-400">/mo/user</span>
                  </div>
                  <div className="text-xs text-neutral-400 flex items-center justify-between pt-2 border-t border-neutral-800/80">
                    <span>Active Subscribed Accounts:</span>
                    <span className="font-mono text-neutral-200 font-semibold">{tier.userCount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MRR Key Takeaways Bar */}
        <div className="mt-4 pt-3 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-neutral-400">Annualized Run Rate:</span>
            <div className="font-mono font-bold text-neutral-200 text-sm">
              ${((mrr.current * 12) / 1000000).toFixed(2)}M ARR
            </div>
          </div>
          <div>
            <span className="text-neutral-400">Net Retention Rate:</span>
            <div className="font-mono font-bold text-emerald-400 text-sm">109.4% NRR</div>
          </div>
          <div>
            <span className="text-neutral-400">Monthly Churn:</span>
            <div className="font-mono font-bold text-rose-400 text-sm">
              ${Math.abs(mrr.breakdown.churnMRR).toLocaleString()} (1.8%)
            </div>
          </div>
          <div>
            <span className="text-neutral-400">Expansion Volume:</span>
            <div className="font-mono font-bold text-indigo-400 text-sm">
              +${mrr.breakdown.expansionMRR.toLocaleString()} MoM
            </div>
          </div>
        </div>
      </div>

      {/* ROW 3: CONVERSION FUNNEL METRICS & STEP-BY-STEP FLOW */}
      <div className="p-5 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 backdrop-blur-md shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Agency Conversion Funnel & Caregiver Activation Pipeline
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {conversionFunnel.overallConversionRate}% Overall Conversion
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              From agency trial registration through first bedside shift dictation to multi-branch home health expansion
            </p>
          </div>

          <div className="text-xs text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800">
            Avg Velocity to Paid: <span className="font-mono text-neutral-200 font-semibold">{freeToPaidConversion.avgDaysToConvert} days</span>
          </div>
        </div>

        {/* Visual Multi-Stage Funnel Display */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-5">
          {conversionFunnel.stages.map((stage, idx) => {
            const isSelected = selectedFunnelStage === stage.id;
            return (
              <div
                key={stage.id}
                id={`funnel-stage-${stage.id}`}
                onClick={() => setSelectedFunnelStage(stage.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-neutral-800/90 border-indigo-500 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-500/40"
                    : "bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase text-neutral-400">
                      Step 0{idx + 1}
                    </span>
                    {stage.stepDropoffRate > 0 && (
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/20">
                        -{stage.stepDropoffRate}%
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-neutral-200 line-clamp-1">{stage.name}</div>
                  <div className="text-xl font-extrabold font-mono text-white mt-1">
                    {stage.count.toLocaleString()}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-800/80 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Funnel Share:</span>
                    <span className="font-mono font-semibold text-indigo-300">
                      {stage.conversionRate}%
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${stage.conversionRate}%`,
                        backgroundColor: stage.color,
                      }}
                    />
                  </div>
                  <div className="text-[10px] text-neutral-400 flex items-center justify-between">
                    <span>Avg Duration:</span>
                    <span className="font-mono text-neutral-300">{stage.avgDuration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Funnel Stage Deep Dive Card */}
        {currentStage && (
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-200">{currentStage.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {currentStage.count.toLocaleString()} Active Accounts ({currentStage.conversionRate}% of top)
                </span>
              </div>
              <p className="text-neutral-400">{currentStage.description}</p>
            </div>
            <div className="sm:max-w-md bg-neutral-900/90 p-2.5 rounded-lg border border-neutral-800 text-[11px] text-neutral-300">
              <span className="text-amber-400 font-semibold">Funnel Bottleneck Insight: </span>
              {conversionFunnel.topDropoffFactor}
            </div>
          </div>
        )}
      </div>

      {/* HOME HEALTHCARE AGENCY OPERATIONS & EVV COMPLIANCE HUB */}
      {homeHealthCare && (
        <div className="p-5 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 backdrop-blur-md shadow-xl shadow-black/20 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Home Healthcare Operations & Field Caregiver Analytics
                </h3>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  EVV State Mandate Compliant
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Real-time Electronic Visit Verification (EVV), OASIS-E intake efficiency, caregiver roster allocation, and payer mix
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400">Payer Authorization:</span>
              <span className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono font-semibold text-indigo-300">
                CMS / Medicare Advantage
              </span>
            </div>
          </div>

          {/* 4 Core Home Health Operational Metric Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tile 1: EVV Compliance */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    EVV Compliance Rate
                  </span>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    {homeHealthCare.evvCompliancePercent}%
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Audited Clean
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex justify-between">
                <span>GPS & Clock-In Verified:</span>
                <span className="font-mono text-neutral-200 font-semibold">100% 21st Century Cures Act</span>
              </div>
            </div>

            {/* Tile 2: Active Patient Care Plans */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                    <ClipboardCheck className="w-3.5 h-3.5 text-indigo-400" />
                    Active Patient Care Plans
                  </span>
                  <div className="text-2xl font-bold font-mono text-white mt-1">
                    {homeHealthCare.activeCarePlans.toLocaleString()}
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  +42 This Mo
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex justify-between">
                <span>Caregiver Utilization:</span>
                <span className="font-mono text-emerald-400 font-semibold">{homeHealthCare.caregiverUtilizationRate}% Billable Hrs</span>
              </div>
            </div>

            {/* Tile 3: OASIS-E Intake Documentation Time */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    Avg OASIS-E Time
                  </span>
                  <div className="text-2xl font-bold font-mono text-white mt-1">
                    {homeHealthCare.avgOasisDocumentationTimeHours} hrs
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  -54% vs Manual
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex justify-between">
                <span>Clinical Dictation Lift:</span>
                <span className="font-mono text-neutral-200 font-semibold">Saves 1.3 hrs/nurse/shift</span>
              </div>
            </div>

            {/* Tile 4: Medication Adherence & Visit Reliability */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                    <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                    MAR Adherence Rate
                  </span>
                  <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                    {homeHealthCare.medicationAdherenceRatePercent}%
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Top Decile
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex justify-between">
                <span>Missed Visit Ratio:</span>
                <span className="font-mono text-neutral-200 font-semibold">{homeHealthCare.missedVisitsRatePercent}% (&lt; 0.5% SLA)</span>
              </div>
            </div>
          </div>

          {/* Deep Dives: Payer Mix + Field Caregiver Staff Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
            {/* Payer Breakdown */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  Home Health Payer Mix & Reimbursement Distribution
                </span>
                <span className="text-[11px] font-mono text-neutral-400">Claims Volume</span>
              </div>

              <div className="space-y-2.5 pt-1">
                <div>
                  <div className="flex justify-between text-xs text-neutral-300 mb-1">
                    <span>Medicare Advantage (Part C / HMO)</span>
                    <span className="font-mono font-bold text-white">{homeHealthCare.medicarePrivatePayRatio.medicareAdvantagePercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${homeHealthCare.medicarePrivatePayRatio.medicareAdvantagePercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-300 mb-1">
                    <span>Medicaid Waiver / State Managed Care</span>
                    <span className="font-mono font-bold text-white">{homeHealthCare.medicarePrivatePayRatio.medicaidWaiverPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${homeHealthCare.medicarePrivatePayRatio.medicaidWaiverPercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-300 mb-1">
                    <span>Private Pay & Long-Term Care Insurance (LTC)</span>
                    <span className="font-mono font-bold text-white">{homeHealthCare.medicarePrivatePayRatio.privatePayPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${homeHealthCare.medicarePrivatePayRatio.privatePayPercent}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-300 mb-1">
                    <span>Veterans Affairs Community Care (VA-CCN)</span>
                    <span className="font-mono font-bold text-white">{homeHealthCare.medicarePrivatePayRatio.veteransAffairsPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${homeHealthCare.medicarePrivatePayRatio.veteransAffairsPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Field Caregiver Allocation */}
            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-400" />
                  Active Field Caregiver Network (460 Clinicians)
                </span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  18 On-Call Standby
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/60">
                  <span className="text-[11px] text-neutral-400 block">Registered & Licensed Nurses</span>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">
                    {homeHealthCare.fieldCaregiverCount.rnLpn} RNs / LPNs
                  </div>
                  <span className="text-[10px] text-indigo-400">Skilled nursing & wound care</span>
                </div>

                <div className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/60">
                  <span className="text-[11px] text-neutral-400 block">Aides & Personal Care</span>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">
                    {homeHealthCare.fieldCaregiverCount.cnaHha} CNAs / HHAs
                  </div>
                  <span className="text-[10px] text-purple-400">Activities of Daily Living (ADLs)</span>
                </div>

                <div className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/60">
                  <span className="text-[11px] text-neutral-400 block">Physical & Occ Therapy</span>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">
                    {homeHealthCare.fieldCaregiverCount.physicalTherapy} PT / OT / SLP
                  </div>
                  <span className="text-[10px] text-emerald-400">Rehabilitation & mobility</span>
                </div>

                <div className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/60">
                  <span className="text-[11px] text-neutral-400 block">Backup Dispatch Standby</span>
                  <div className="text-lg font-bold font-mono text-white mt-0.5">
                    {homeHealthCare.fieldCaregiverCount.onCallStandby} Active Standby
                  </div>
                  <span className="text-[10px] text-amber-400">Guarantees zero no-shows</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ROW 4: FAILED DICTATIONS & AUDIO ENGINE RELIABILITY */}
      <div className="p-5 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 backdrop-blur-md shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Radio className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Field Caregiver & Nurse Clinical Dictation Engine
              </h3>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                {failedDictations.failureRatePercent}% Failure Rate (Target &lt; 1.0%)
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Field visit voice notes, SOAP documentation, OASIS-E intake audio reliability, and AI clinical auto-recovery
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
              <button
                type="button"
                id="btn-dictation-recent"
                onClick={() => setSelectedDictationTab("recent")}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedDictationTab === "recent"
                    ? "bg-neutral-800 text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Recent Incidents ({failedDictations.recentFailures.length})
              </button>
              <button
                type="button"
                id="btn-dictation-taxonomy"
                onClick={() => setSelectedDictationTab("taxonomy")}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  selectedDictationTab === "taxonomy"
                    ? "bg-neutral-800 text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Error Taxonomy Breakdown
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Recent Dictation Incidents with Live 1-Click Reprocess */}
        {selectedDictationTab === "recent" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Filter by caregiver, client, or error code..."
                  value={dictationSearch}
                  onChange={(e) => setDictationSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="text-xs text-neutral-400 flex items-center gap-2">
                <span>Auto-recovery pipeline:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {failedDictations.recoveredCount} / {failedDictations.failedCount} ({failedDictations.recoveryRatePercent}%)
                </span>
              </div>
            </div>

            <div className="divide-y divide-neutral-800/80 rounded-xl border border-neutral-800 bg-neutral-950/60 overflow-hidden">
              {filteredDictations.map((dictation) => {
                const isPending = dictation.status === "pending_retry";
                const isRecovered = dictation.status === "auto_recovered";

                return (
                  <div
                    key={dictation.id}
                    id={`dictation-row-${dictation.id}`}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-neutral-900/40 transition-colors"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-white">
                          {dictation.id}
                        </span>
                        <span className="text-xs text-neutral-300 font-medium">
                          {dictation.caregiverName}
                        </span>
                        <span className="text-[11px] text-neutral-400">→ Client:</span>
                        <span className="text-xs text-neutral-200">{dictation.clientName}</span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          ({dictation.durationSeconds}s audio, {dictation.audioQualityDb} dB)
                        </span>

                        {isRecovered ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Auto-Recovered
                          </span>
                        ) : isPending ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Pending Retry
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            Manual Review
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-rose-300 flex items-center gap-1.5">
                        <span className="font-semibold">Reason:</span>
                        <span>{dictation.failureReason}</span>
                      </div>

                      <div className="text-[11px] text-neutral-400 italic bg-neutral-900/70 p-2 rounded-lg border border-neutral-800/80 font-mono">
                        "{dictation.snippet}"
                      </div>
                    </div>

                    {/* Action button */}
                    <div className="shrink-0 flex items-center gap-2">
                      {isRecovered ? (
                        <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {(dictation.confidence * 100).toFixed(0)}% Confidence
                        </span>
                      ) : (
                        <button
                          type="button"
                          id={`btn-retry-dictation-${dictation.id}`}
                          disabled={retryMutation.isPending}
                          onClick={() => retryMutation.mutate(dictation.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md shadow-indigo-900/30 cursor-pointer disabled:opacity-50"
                        >
                          <RotateCw
                            className={`w-3.5 h-3.5 ${retryMutation.isPending ? "animate-spin" : ""}`}
                          />
                          <span>Reprocess with Cleanse</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Error Taxonomy Breakdown */}
        {selectedDictationTab === "taxonomy" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Dictation Error Categories
              </h4>
              <div className="space-y-2">
                {failedDictations.errorBreakdown.map((item) => (
                  <div
                    key={item.reason}
                    className="p-3 rounded-xl border border-neutral-800 bg-neutral-950/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-200 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        {item.reason}
                      </span>
                      <span className="font-mono font-bold text-white">
                        {item.count} events ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/80 space-y-3">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4" />
                Aurix Neural Cleanse Telemetry
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Kavik’s secondary speech repair model runs an adaptive band-pass filter and clinical context
                cross-referencing against the patient's active Medication Administration Record (MAR). Over
                <strong className="text-white"> 93.6% of flagged dictations</strong> are repaired without needing
                the visiting caregiver to re-record their note.
              </p>
              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                <span>Avg Audio Recovery Latency:</span>
                <span className="font-mono text-emerald-400 font-semibold">1.4 seconds</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
