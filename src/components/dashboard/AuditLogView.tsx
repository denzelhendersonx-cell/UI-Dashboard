import React, { useState } from "react";
import { AuditLog } from "../../types";
import { Shield, Clock, User, FileText, Search, RefreshCw } from "lucide-react";

interface AuditLogViewProps {
  logs: AuditLog[];
  isLoading: boolean;
  onRefresh: () => void;
}

export function AuditLogView({ logs, isLoading, onRefresh }: AuditLogViewProps) {
  const [filter, setFilter] = useState("");

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(filter.toLowerCase()) ||
      l.performedBy.toLowerCase().includes(filter.toLowerCase()) ||
      l.details.toLowerCase().includes(filter.toLowerCase()) ||
      l.incidentId.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-neutral-200">Security & Operational Audit Trail</h3>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Immutable log of all human coordinator and Aurix autonomous system actions (OWASP compliance)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="p-1.5 rounded-lg border border-neutral-700 hover:bg-neutral-800 text-neutral-300 transition-colors cursor-pointer"
            title="Refresh Audit Logs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/70 text-neutral-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Action</th>
                <th className="py-2.5 px-4">Target ID</th>
                <th className="py-2.5 px-4">Actor</th>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-2.5 px-4 font-mono text-[11px] text-neutral-400">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-neutral-800 text-indigo-300 border border-neutral-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-neutral-400">{log.incidentId}</td>
                    <td className="py-2.5 px-4 font-medium text-neutral-200">{log.performedBy}</td>
                    <td className="py-2.5 px-4 capitalize">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-400">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-neutral-300">{log.details}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">
                    No audit records match the search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
