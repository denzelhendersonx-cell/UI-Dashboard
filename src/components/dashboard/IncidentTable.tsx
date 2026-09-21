import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import { Incident, IncidentCategory, IncidentPriority, IncidentStatus } from "../../types";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  Clock,
  AlertTriangle,
  User,
  Eye,
  CheckCircle2,
  Trash2,
  Filter,
} from "lucide-react";
import { TableSkeleton, EmptyState } from "../ui/States";

interface IncidentTableProps {
  incidents: Incident[];
  isLoading: boolean;
  onOpenAITriage: (incident: Incident) => void;
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
  onBulkAction: (ids: string[], action: "resolve" | "mark_in_progress" | "snooze") => void;
  onSelectIncident: (incident: Incident) => void;
  userRole: string;
}

const categoryLabels: Record<IncidentCategory, { label: string; bg: string; text: string }> = {
  caregiver_noshow: { label: "Caregiver No-Show", bg: "bg-rose-500/10 border-rose-500/20", text: "text-rose-400" },
  scheduling_conflict: { label: "Schedule Conflict", bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-400" },
  new_lead: { label: "New Lead", bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400" },
  missed_call: { label: "Missed Call", bg: "bg-sky-500/10 border-sky-500/20", text: "text-sky-400" },
  overdue_followup: { label: "Overdue Follow-up", bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-400" },
};

const priorityStyles: Record<IncidentPriority, { label: string; badge: string }> = {
  critical: { label: "Critical", badge: "bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold" },
  high: { label: "High", badge: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  medium: { label: "Medium", badge: "bg-neutral-800 text-neutral-300 border-neutral-700" },
  low: { label: "Low", badge: "bg-neutral-800/60 text-neutral-400 border-neutral-700/50" },
};

export function IncidentTable({
  incidents,
  isLoading,
  onOpenAITriage,
  onUpdateStatus,
  onBulkAction,
  onSelectIncident,
  userRole,
}: IncidentTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sorting, setSorting] = useState<SortingState>([{ id: "score", desc: true }]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    dealValue: true,
    assignedTo: true,
    source: false,
  });
  const [isColumnDropdownOpen, setIsColumnDropdownOpen] = useState(false);

  // Pre-filter data with category/priority/status
  const filteredData = useMemo(() => {
    return incidents.filter((item) => {
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (priorityFilter !== "all" && item.priority !== priorityFilter) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      return true;
    });
  }, [incidents, categoryFilter, priorityFilter, statusFilter]);

  const columns = useMemo<ColumnDef<Incident>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
            className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-neutral-900 cursor-pointer"
            aria-label="Select all rows on page"
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
            className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-neutral-900 cursor-pointer"
            aria-label={`Select incident ${row.original.id}`}
          />
        ),
        enableSorting: false,
        size: 32,
      },
      {
        accessorKey: "score",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer"
          >
            Urgency
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-600" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const score = row.original.score;
          const isCritical = score >= 90;
          return (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-mono text-xs font-bold border ${
                  isCritical
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                    : score >= 75
                    ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                    : "bg-neutral-800 text-neutral-300 border-neutral-700"
                }`}
              >
                {score}
              </span>
            </div>
          );
        },
        size: 70,
      },
      {
        accessorKey: "title",
        header: "Attention Item & Client",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="space-y-0.5 max-w-sm">
              <div
                onClick={() => onSelectIncident(item)}
                className="text-xs font-medium text-neutral-100 hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <span className="font-mono text-[11px] text-neutral-400">{item.id}</span>
                <span className="truncate font-semibold">{item.title}</span>
              </div>
              <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                <span className="text-neutral-300 font-medium">{item.customerName}</span>
                {item.caregiverName && (
                  <span className="text-neutral-400 truncate">· Aide: {item.caregiverName}</span>
                )}
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const cat = categoryLabels[row.original.category] || {
            label: row.original.category,
            bg: "bg-neutral-800",
            text: "text-neutral-300",
          };
          return (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${cat.bg} ${cat.text}`}
            >
              {cat.label}
            </span>
          );
        },
      },
      {
        accessorKey: "slaMinutesRemaining",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer"
          >
            SLA Window
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-600" />
            )}
          </button>
        ),
        cell: ({ row }) => {
          const mins = row.original.slaMinutesRemaining;
          const isBreached = mins < 0 && row.original.status !== "resolved";
          return (
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <Clock className={`w-3.5 h-3.5 ${isBreached ? "text-rose-400" : "text-neutral-400"}`} />
              {isBreached ? (
                <span className="text-rose-400 font-bold">Breached ({Math.abs(mins)}m ago)</span>
              ) : row.original.status === "resolved" ? (
                <span className="text-neutral-400">Resolved</span>
              ) : (
                <span className={mins <= 30 ? "text-amber-400 font-medium" : "text-neutral-300"}>
                  {mins} min
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "dealValue",
        header: "Deal Value",
        cell: ({ row }) => {
          const val = row.original.dealValue;
          return (
            <span className="font-mono text-xs text-neutral-300">
              {val ? `$${val.toLocaleString()}` : "—"}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          const config = {
            needs_action: { label: "Needs Action", style: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
            in_progress: { label: "In Progress", style: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
            waiting: { label: "Waiting / Hold", style: "bg-neutral-800 text-neutral-300 border-neutral-700" },
            resolved: { label: "Resolved", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
          }[status] || { label: status, style: "bg-neutral-800 text-neutral-400 border-neutral-700" };

          return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${config.style}`}>
              {config.label}
            </span>
          );
        },
      },
      {
        accessorKey: "assignedTo",
        header: "Assignee",
        cell: ({ row }) => {
          return (
            <span className="text-xs text-neutral-400 truncate max-w-[110px] block">
              {row.original.assignedTo}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original;
          const isResolved = item.status === "resolved";
          const canMutate = userRole !== "viewer";

          return (
            <div className="flex items-center gap-1.5 justify-end">
              {/* AI Triage Button */}
              <button
                type="button"
                onClick={() => onOpenAITriage(item)}
                title="Open Aurix AI Copilot Triage"
                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                AI Triage
              </button>

              {/* Quick Resolve Button */}
              {canMutate && !isResolved && (
                <button
                  type="button"
                  onClick={() => onUpdateStatus(item.id, "resolved")}
                  title="Mark Resolved"
                  className="p-1 rounded text-neutral-400 hover:text-emerald-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}

              {/* View Details */}
              <button
                type="button"
                onClick={() => onSelectIncident(item)}
                title="View Full Item Details"
                className="p-1 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        },
      },
    ],
    [onOpenAITriage, onUpdateStatus, onSelectIncident, userRole]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      sorting,
      rowSelection,
      columnVisibility,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="space-y-3">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 p-3 rounded-xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search incident, patient name, caregiver, notes..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-neutral-700/80 bg-neutral-950 text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            aria-label="Filter by incident category"
          >
            <option value="all">All Categories</option>
            <option value="caregiver_noshow">Caregiver No-Show</option>
            <option value="scheduling_conflict">Scheduling Conflict</option>
            <option value="new_lead">New Lead</option>
            <option value="missed_call">Missed Call</option>
            <option value="overdue_followup">Overdue Follow-up</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            aria-label="Filter by incident status"
          >
            <option value="all">All Statuses</option>
            <option value="needs_action">Needs Action</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting">Waiting / Hold</option>
            <option value="resolved">Resolved</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            aria-label="Filter by incident priority"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Column Visibility Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsColumnDropdownOpen(!isColumnDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              Columns
            </button>
            {isColumnDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-lg border border-neutral-700 bg-neutral-950 shadow-xl p-2 z-40 space-y-1">
                <div className="text-[11px] font-semibold text-neutral-400 px-2 py-1 border-b border-neutral-800">
                  Toggle Columns
                </div>
                {table
                  .getAllLeafColumns()
                  .filter((col) => col.id !== "select" && col.id !== "actions")
                  .map((column) => (
                    <label
                      key={column.id}
                      className="flex items-center gap-2 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800/60 rounded cursor-pointer capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={column.getToggleVisibilityHandler()}
                        className="w-3.5 h-3.5 rounded border-neutral-700 bg-neutral-900 text-indigo-600"
                      />
                      {column.id === "slaMinutesRemaining"
                        ? "SLA Window"
                        : column.id === "dealValue"
                        ? "Deal Value"
                        : column.id === "assignedTo"
                        ? "Assignee"
                        : column.id}
                    </label>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contextual Bulk Action Toolbar */}
      {selectedCount > 0 && (
        <div className="flex items-center justify-between p-2.5 px-4 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-indigo-200 font-medium">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px]">
              {selectedCount}
            </span>
            <span>{selectedCount === 1 ? "incident selected" : "incidents selected"}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const ids = selectedRows.map((r) => r.original.id);
                onBulkAction(ids, "resolve");
                table.resetRowSelection();
              }}
              disabled={userRole === "viewer"}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Bulk Resolve
            </button>
            <button
              type="button"
              onClick={() => {
                const ids = selectedRows.map((r) => r.original.id);
                onBulkAction(ids, "mark_in_progress");
                table.resetRowSelection();
              }}
              disabled={userRole === "viewer"}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              Mark In Progress
            </button>
            <button
              type="button"
              onClick={() => {
                const ids = selectedRows.map((r) => r.original.id);
                onBulkAction(ids, "snooze");
                table.resetRowSelection();
              }}
              disabled={userRole === "viewer"}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Clock className="w-3.5 h-3.5" />
              Snooze (+30m)
            </button>
            <button
              type="button"
              onClick={() => table.resetRowSelection()}
              className="px-2 py-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-xl border border-neutral-800 overflow-hidden bg-neutral-900/40 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-neutral-800 bg-neutral-950/70 text-neutral-400">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      className="py-2.5 px-3.5 text-xs font-semibold uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-neutral-800/40 transition-colors ${
                      row.getIsSelected() ? "bg-indigo-950/20" : ""
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-2.5 px-3.5 text-xs">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length}>
                    <EmptyState
                      title="No matching attention items"
                      description="Zero incidents match your current search and filter parameters. Great job keeping the queue clear!"
                      actionText="Reset Filters"
                      onAction={() => {
                        setGlobalFilter("");
                        setCategoryFilter("all");
                        setPriorityFilter("all");
                        setStatusFilter("all");
                      }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 border-t border-neutral-800 bg-neutral-950/40 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span>
              Showing {table.getRowModel().rows.length} of {filteredData.length} records
            </span>
            <span className="text-neutral-600">|</span>
            <label className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="rounded border border-neutral-700 bg-neutral-900 px-1.5 py-0.5 text-xs text-neutral-200 cursor-pointer"
              >
                {[5, 8, 15, 25].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1 rounded border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-mono text-neutral-300">
              Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
            </span>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1 rounded border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
