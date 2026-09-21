import React from "react";
import {
  Users,
  CalendarCheck2,
  Clock,
  TrendingUp,
  DollarSign,
  Bot,
  PhoneMissed,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Phone,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  Zap,
  Calendar
} from "lucide-react";
import { OverviewMetrics } from "../../types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface OverviewCommandCenterProps {
  metrics: OverviewMetrics;
  timeframe?: "7d" | "30d" | "90d";
  onTimeframeChange?: (timeframe: "7d" | "30d" | "90d") => void;
  onNavigate: (section: any) => void;
}

export function OverviewCommandCenter({
  metrics,
  timeframe = "30d",
  onTimeframeChange,
  onNavigate,
}: OverviewCommandCenterProps) {
  const timeframeLabel =
    timeframe === "7d"
      ? "Last 7 Days"
      : timeframe === "90d"
      ? "Last 90 Days (Quarterly)"
      : "Last 30 Days";

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: Home Healthcare Agency Command Center */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800/90 bg-gradient-to-r from-neutral-950 via-neutral-900 to-indigo-950/40 p-6 shadow-xl shadow-black/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Agency Growth & Operations Command Center</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Home Healthcare Growth & AI Automation Hub
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Real-time monitoring of patient intake, hospital referrals, autonomous voice & SMS engagement, and follow-up pipeline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* 7d, 30d, 90d Tab Switcher */}
            <div className="inline-flex items-center p-1 rounded-xl bg-neutral-950/80 border border-neutral-800 shadow-inner">
              <button
                type="button"
                id="btn-timeframe-7d"
                onClick={() => onTimeframeChange?.("7d")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeframe === "7d"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                id="btn-timeframe-30d"
                onClick={() => onTimeframeChange?.("30d")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeframe === "30d"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
                }`}
              >
                30 Days
              </button>
              <button
                type="button"
                id="btn-timeframe-90d"
                onClick={() => onTimeframeChange?.("90d")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeframe === "90d"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
                }`}
              >
                90 Days
              </button>
            </div>

            <button
              type="button"
              id="btn-quick-leads"
              onClick={() => onNavigate("leads")}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span>View Leads ({metrics.leadsThisMonth})</span>
            </button>
            <button
              type="button"
              id="btn-quick-followups"
              onClick={() => onNavigate("followups")}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Follow-ups ({metrics.followUpsDue})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Primary Command Center KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Leads in selected timeframe */}
        <div
          id="overview-card-leads-month"
          onClick={() => onNavigate("leads")}
          className="p-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 hover:border-indigo-500/40 hover:bg-neutral-900/90 transition-all cursor-pointer shadow-md shadow-black/20 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                Leads ({timeframe.toUpperCase()})
              </span>
              <div className="text-2xl font-extrabold font-mono text-white mt-1">
                {metrics.leadsThisMonth}
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {timeframe === "7d" ? "+6.2% Wow" : timeframe === "90d" ? "+28.4% QoQ" : "+18.4% MoM"}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex justify-between items-center">
            <span>Inquiry Run-rate:</span>
            <span className="font-mono text-neutral-200 font-semibold">
              {timeframe === "7d" ? "5.8 leads/day" : timeframe === "90d" ? "6.8 leads/day" : "6.2 leads/day"}
            </span>
          </div>
        </div>

        {/* 2. New leads today */}
        <div
          id="overview-card-leads-today"
          onClick={() => onNavigate("leads")}
          className="p-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 hover:border-emerald-500/40 hover:bg-neutral-900/90 transition-all cursor-pointer shadow-md shadow-black/20 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                New Leads Today
              </span>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
                {metrics.newLeadsToday}
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Active Intake
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex justify-between items-center">
            <span>Hospital Discharges:</span>
            <span className="font-mono text-neutral-200 font-semibold">4 Referrals Queued</span>
          </div>
        </div>

        {/* 3. Appointments booked */}
        <div
          id="overview-card-appointments"
          onClick={() => onNavigate("followups")}
          className="p-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 hover:border-purple-500/40 hover:bg-neutral-900/90 transition-all cursor-pointer shadow-md shadow-black/20 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                <CalendarCheck2 className="w-3.5 h-3.5 text-purple-400" />
                Appointments Booked
              </span>
              <div className="text-2xl font-extrabold font-mono text-white mt-1">
                {metrics.appointmentsBooked}
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {timeframeLabel}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex justify-between items-center">
            <span>In-Home Nursing Intakes:</span>
            <span className="font-mono text-purple-300 font-semibold">
              {timeframe === "7d" ? "3 Scheduled" : timeframe === "90d" ? "32 Completed" : "8 Scheduled This Week"}
            </span>
          </div>
        </div>

        {/* 4. Follow-ups due */}
        <div
          id="overview-card-followups"
          onClick={() => onNavigate("followups")}
          className="p-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 hover:border-amber-500/40 hover:bg-neutral-900/90 transition-all cursor-pointer shadow-md shadow-black/20 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Follow-ups Due
              </span>
              <div className="text-2xl font-extrabold font-mono text-amber-400 mt-1">
                {metrics.followUpsDue}
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
              14 Today / 6 Overdue
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex justify-between items-center">
            <span>AI Automated Dispatch:</span>
            <span className="font-mono text-emerald-400 font-semibold">Active Cadence</span>
          </div>
        </div>

        {/* 5. Conversion Rate */}
        <div className="p-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 shadow-md shadow-black/20 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Conversion Rate
              </span>
              <div className="text-2xl font-extrabold font-mono text-white mt-1">
                {metrics.conversionRate}%
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              {timeframeLabel}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex justify-between items-center">
            <span>Lead to Signed Contract:</span>
            <span className="font-mono text-neutral-200 font-semibold">1 in 4 Inquiries</span>
          </div>
        </div>

        {/* 6. Revenue / Estimated Revenue */}
        <div className="p-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 shadow-md shadow-black/20 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                {timeframe === "7d" ? "Est. 7-Day Revenue" : timeframe === "90d" ? "Est. Quarterly Revenue" : "Est. Monthly Revenue"}
              </span>
              <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
                ${metrics.revenueEstimated.toLocaleString()}
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              Pipeline Active
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex justify-between items-center">
            <span>Private Pay + Medicare:</span>
            <span className="font-mono text-neutral-200 font-semibold">$3,911 / client avg</span>
          </div>
        </div>

        {/* 7. AI Activity */}
        <div
          id="overview-card-ai-agents"
          onClick={() => onNavigate("agents")}
          className="p-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 hover:border-purple-500/40 hover:bg-neutral-900/90 transition-all cursor-pointer shadow-md shadow-black/20 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                AI Automation Activity
              </span>
              <div className="text-2xl font-extrabold font-mono text-white mt-1">
                {metrics.aiActivityCount.toLocaleString()}
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20">
              {timeframeLabel}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex justify-between items-center">
            <span>Autonomous Tasks:</span>
            <span className="font-mono text-purple-300 font-semibold">Voice, SMS & Schedules</span>
          </div>
        </div>

        {/* 8. Missed calls */}
        <div
          id="overview-card-missed-calls"
          onClick={() => onNavigate("conversations")}
          className="p-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 hover:border-rose-500/40 hover:bg-neutral-900/90 transition-all cursor-pointer shadow-md shadow-black/20 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-neutral-400 flex items-center gap-1.5">
                <PhoneMissed className="w-3.5 h-3.5 text-rose-400" />
                Missed Calls
              </span>
              <div className="text-2xl font-extrabold font-mono text-rose-400 mt-1">
                {metrics.missedCalls}
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20">
              100% Auto-SMS Sent
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex justify-between items-center">
            <span>Instant Recovery SLA:</span>
            <span className="font-mono text-emerald-400 font-semibold">&lt; 30 sec callback</span>
          </div>
        </div>
      </div>

      {/* Middle Section: Performance Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart (2 cols on large) */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 backdrop-blur-md shadow-xl shadow-black/20 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                Agency Performance & Lead Trajectory
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Daily lead influx, in-home care assessments booked, and contract wins across {timeframeLabel.toLowerCase()}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Leads
              </span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Appointments
              </span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Won Care Plans
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.performanceChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="period" stroke="#737373" fontSize={11} tickLine={false} />
                <YAxis stroke="#737373" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    borderColor: "#404040",
                    borderRadius: "0.75rem",
                    color: "#f5f5f5",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="leads" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" name="Leads" />
                <Area type="monotone" dataKey="appointments" stroke="#a855f7" strokeWidth={2} fillOpacity={0} fill="none" name="Appointments" />
                <Area type="monotone" dataKey="won" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorWon)" name="Care Plans Won" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed (1 col on large) */}
        <div className="p-5 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 backdrop-blur-md shadow-xl shadow-black/20 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Recent Agency Activity
              </h3>
              <span className="text-[11px] font-mono text-neutral-400">Live Telemetry</span>
            </div>

            <div className="space-y-3.5 mt-3">
              {metrics.recentActivity.map((act) => {
                const getIcon = () => {
                  switch (act.type) {
                    case "call":
                      return <Phone className="w-3.5 h-3.5 text-rose-400" />;
                    case "sms":
                      return <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />;
                    case "appointment":
                      return <CalendarCheck2 className="w-3.5 h-3.5 text-purple-400" />;
                    case "lead_won":
                      return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
                    case "ai_action":
                    default:
                      return <Bot className="w-3.5 h-3.5 text-emerald-400" />;
                  }
                };

                return (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-950/60 flex items-start justify-between gap-3 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 shrink-0 mt-0.5">
                        {getIcon()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-neutral-200 truncate">
                          {act.title}
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-snug mt-0.5 line-clamp-2">
                          {act.description}
                        </p>
                        <span className="text-[10px] font-mono text-neutral-500 mt-1 block">
                          {act.timestamp}
                        </span>
                      </div>
                    </div>

                    {act.badge && (
                      <span className="shrink-0 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {act.badge}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            id="btn-overview-view-inbox"
            onClick={() => onNavigate("conversations")}
            className="w-full mt-4 py-2 rounded-xl text-xs font-semibold border border-neutral-800 bg-neutral-950/70 hover:bg-neutral-800 text-neutral-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Open Communications Inbox</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
