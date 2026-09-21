import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { DashboardMetrics } from "../../types";
import { TrendingUp, BarChart3, Activity } from "lucide-react";

interface ThroughputChartProps {
  metrics?: DashboardMetrics;
  isLoading: boolean;
  timeframe?: "7d" | "30d" | "90d";
  onTimeframeChange?: (timeframe: "7d" | "30d" | "90d") => void;
}

export function ThroughputChart({
  metrics,
  isLoading,
  timeframe = "7d",
  onTimeframeChange,
}: ThroughputChartProps) {
  const [chartMode, setChartMode] = useState<"throughput" | "categories">("throughput");
  const [localTimeframe, setLocalTimeframe] = useState<"7d" | "30d" | "90d">(timeframe);

  const activeTimeframe = onTimeframeChange ? timeframe : localTimeframe;

  const handleTimeframeSelect = (tf: "7d" | "30d" | "90d") => {
    setLocalTimeframe(tf);
    onTimeframeChange?.(tf);
  };

  if (isLoading || !metrics) {
    return (
      <div className="h-72 rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 flex items-center justify-center">
        <div className="animate-pulse text-xs text-neutral-400">Loading operations telemetry...</div>
      </div>
    );
  }

  // Derive timeframe-scaled data
  const throughputData =
    activeTimeframe === "7d"
      ? metrics.throughputHistory
      : activeTimeframe === "30d"
      ? [
          { time: "Week 1", incoming: 48, resolved: 36, automated: 22 },
          { time: "Week 2", incoming: 62, resolved: 48, automated: 31 },
          { time: "Week 3", incoming: 74, resolved: 58, automated: 39 },
          { time: "Week 4", incoming: 88, resolved: 69, automated: 48 },
        ]
      : [
          { time: "Month 1", incoming: 220, resolved: 180, automated: 110 },
          { time: "Month 2", incoming: 275, resolved: 225, automated: 145 },
          { time: "Month 3", incoming: 310, resolved: 260, automated: 178 },
        ];

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg shadow-xl text-xs space-y-1 z-50">
          <div className="font-semibold text-neutral-300 mb-1 border-b border-neutral-800 pb-1">
            {chartMode === "throughput" ? `Time Window: ${label}` : label}
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-neutral-400">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-medium text-neutral-200">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-xl border border-neutral-800 bg-neutral-900/70 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-neutral-200">
              {chartMode === "throughput" ? "Operations & Triage Throughput" : "Volume by Incident Category"}
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            {chartMode === "throughput"
              ? `Comparison of incoming incidents vs. resolved and autonomous Aurix handling (${activeTimeframe.toUpperCase()})`
              : "Distribution across active operational queues"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 7d, 30d, 90d Tab Switcher */}
          {chartMode === "throughput" && (
            <div className="flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs">
              {(["7d", "30d", "90d"] as const).map((range) => (
                <button
                  key={range}
                  type="button"
                  id={`btn-throughput-range-${range}`}
                  onClick={() => handleTimeframeSelect(range)}
                  className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                    activeTimeframe === range
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : "90 Days"}
                </button>
              ))}
            </div>
          )}

          {/* Chart View Toggle */}
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 self-start sm:self-auto">
            <button
              type="button"
              id="btn-chart-throughput"
              onClick={() => setChartMode("throughput")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                chartMode === "throughput"
                  ? "bg-neutral-800 text-neutral-100 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Throughput
            </button>
            <button
              type="button"
              id="btn-chart-categories"
              onClick={() => setChartMode("categories")}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                chartMode === "categories"
                  ? "bg-neutral-800 text-neutral-100 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Categories
            </button>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        {chartMode === "throughput" ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={throughputData}
              margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis
                dataKey="time"
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
                allowDecimals={false}
              />
              <Tooltip content={customTooltip} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: "11px", paddingBottom: "10px", color: "#a3a3a3" }}
              />
              <Line
                type="monotone"
                name="Incoming Items"
                dataKey="incoming"
                stroke="#F43F5E"
                strokeWidth={2}
                dot={{ r: 3, fill: "#F43F5E" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                name="Human Resolved"
                dataKey="resolved"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ r: 3, fill: "#6366F1" }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                name="Aurix Autonomous"
                dataKey="automated"
                stroke="#10B981"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: "#10B981" }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={metrics.categoryDistribution}
              margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis
                dataKey="label"
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
                allowDecimals={false}
              />
              <Tooltip content={customTooltip} />
              <Bar dataKey="count" name="Incidents" radius={[4, 4, 0, 0]}>
                {metrics.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
