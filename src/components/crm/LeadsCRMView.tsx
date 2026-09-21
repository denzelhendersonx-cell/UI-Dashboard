import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Tag,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  DollarSign,
  FileText,
  ChevronRight,
  Sparkles,
  Users,
  Building2,
  Send,
  X
} from "lucide-react";
import { Lead, LeadStatus } from "../../types";

interface LeadsCRMViewProps {
  leads: Lead[];
  onUpdateLead: (id: string, updates: Partial<Lead> & { note?: string }) => Promise<void>;
  onCreateLead: (lead: Partial<Lead>) => Promise<void>;
  onBulkAction: (payload: { leadIds: string[]; action: "update_status" | "reassign" | "tag"; status?: string; assignedUser?: string; addTag?: string }) => Promise<void>;
}

export function LeadsCRMView({ leads, onUpdateLead, onCreateLead, onBulkAction }: LeadsCRMViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [activeLeadDetails, setActiveLeadDetails] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // New Lead Modal state
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadPhone, setNewLeadPhone] = useState("");
  const [newLeadEmail, setNewLeadEmail] = useState("");
  const [newLeadSource, setNewLeadSource] = useState<Lead["leadSource"]>("Web Form");
  const [newLeadCareNeed, setNewLeadCareNeed] = useState("");
  const [newLeadValue, setNewLeadValue] = useState("5000");

  const statuses: LeadStatus[] = ["New", "Contacted", "Qualified", "Appointment", "Won", "Lost"];

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.leadSource === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeadIds(filteredLeads.map((l) => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleToggleLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveNote = async () => {
    if (!activeLeadDetails || !newNoteText.trim()) return;
    await onUpdateLead(activeLeadDetails.id, { note: newNoteText.trim() });
    setActiveLeadDetails((prev) =>
      prev ? { ...prev, notes: [`Just now: ${newNoteText.trim()}`, ...prev.notes] } : null
    );
    setNewNoteText("");
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    await onUpdateLead(leadId, { status: newStatus });
    if (activeLeadDetails?.id === leadId) {
      setActiveLeadDetails((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim()) return;
    await onCreateLead({
      name: newLeadName.trim(),
      phone: newLeadPhone.trim() || "(555) 000-0000",
      email: newLeadEmail.trim() || "referral@homecare.com",
      leadSource: newLeadSource,
      status: "New",
      careNeed: newLeadCareNeed.trim() || "In-home care inquiry",
      estimatedValue: Number(newLeadValue) || 5000,
      tags: ["Intake Queued"],
      notes: ["Lead manually captured by coordinator."],
      nextFollowUp: "Today, 3:00 PM",
    });
    setShowAddLeadModal(false);
    setNewLeadName("");
    setNewLeadPhone("");
    setNewLeadEmail("");
    setNewLeadCareNeed("");
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "New":
        return "bg-blue-500/15 text-blue-300 border-blue-500/30";
      case "Contacted":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "Qualified":
        return "bg-indigo-500/15 text-indigo-300 border-indigo-500/30";
      case "Appointment":
        return "bg-purple-500/15 text-purple-300 border-purple-500/30";
      case "Won":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "Lost":
      default:
        return "bg-neutral-800 text-neutral-400 border-neutral-700";
    }
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Home Healthcare Lead & Patient Pipeline
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage hospital referrals, physician portal intakes, inbound inquiries, and care plan conversion.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-add-lead-modal"
            onClick={() => setShowAddLeadModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 backdrop-blur-md shadow-md space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              id="input-leads-search"
              placeholder="Search by name, phone, email, or care need tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-neutral-950/80 border border-neutral-800 rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Status & Source Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              id="select-leads-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              id="select-leads-source"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-neutral-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="Hospital Referral">Hospital Referral</option>
              <option value="Doctor Office">Doctor Office</option>
              <option value="Physician Portal">Physician Portal</option>
              <option value="Inbound Call">Inbound Call</option>
              <option value="Web Form">Web Form</option>
              <option value="Google Search">Google Search</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar (when items selected) */}
        {selectedLeadIds.length > 0 && (
          <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-indigo-200">
              {selectedLeadIds.length} lead{selectedLeadIds.length > 1 ? "s" : ""} selected
            </span>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Bulk Actions:</span>
              <button
                type="button"
                onClick={() =>
                  onBulkAction({ leadIds: selectedLeadIds, action: "update_status", status: "Qualified" })
                }
                className="px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 hover:bg-indigo-600/50 cursor-pointer font-medium"
              >
                Mark Qualified
              </button>
              <button
                type="button"
                onClick={() =>
                  onBulkAction({ leadIds: selectedLeadIds, action: "update_status", status: "Appointment" })
                }
                className="px-2.5 py-1 rounded-lg bg-purple-600/30 text-purple-200 border border-purple-500/40 hover:bg-purple-600/50 cursor-pointer font-medium"
              >
                Mark Appointment
              </button>
              <button
                type="button"
                onClick={() =>
                  onBulkAction({ leadIds: selectedLeadIds, action: "tag", addTag: "Priority Intake" })
                }
                className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 border border-neutral-700 hover:bg-neutral-700 cursor-pointer font-medium"
              >
                Tag Priority Intake
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CRM Leads Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-900/70 backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-800/80 bg-neutral-950/60 text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-neutral-700 text-indigo-600 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="p-3">Patient / Contact Name</th>
                <th className="p-3">Contact (Phone / Email)</th>
                <th className="p-3">Lead Source</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Contact</th>
                <th className="p-3">Next Follow-Up</th>
                <th className="p-3">Assigned User</th>
                <th className="p-3 text-right">Est. Value</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredLeads.map((lead) => {
                const isChecked = selectedLeadIds.includes(lead.id);

                return (
                  <tr
                    key={lead.id}
                    id={`lead-row-${lead.id}`}
                    className={`transition-colors hover:bg-neutral-800/40 ${
                      isChecked ? "bg-indigo-950/20" : ""
                    }`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleLead(lead.id)}
                        className="rounded border-neutral-700 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-neutral-100 flex items-center gap-1.5">
                        <span>{lead.name}</span>
                        {lead.tags.includes("Urgent") && (
                          <span className="w-2 h-2 rounded-full bg-rose-400" title="Urgent Lead" />
                        )}
                      </div>
                      {lead.careNeed && (
                        <div className="text-[11px] text-neutral-400 mt-0.5 truncate max-w-xs">
                          {lead.careNeed}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lead.tags.map((t) => (
                          <span
                            key={t}
                            className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700/80"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1.5 text-neutral-200 font-mono">
                        <Phone className="w-3 h-3 text-neutral-400" />
                        {lead.phone}
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mt-0.5">
                        <Mail className="w-3 h-3 text-neutral-500" />
                        {lead.email}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-lg text-[11px] font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
                        {lead.leadSource}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border focus:outline-none cursor-pointer ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        {statuses.map((st) => (
                          <option key={st} value={st} className="bg-neutral-900 text-neutral-200">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-neutral-400 font-mono text-[11px]">
                      {lead.lastContact}
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      <span className="text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lead.nextFollowUp}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-300 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-indigo-400" />
                        <span>{lead.assignedUser}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-emerald-400">
                      ${lead.estimatedValue.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        id={`btn-open-lead-${lead.id}`}
                        onClick={() => setActiveLeadDetails(lead)}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lead Details Drawer Modal */}
      {activeLeadDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg h-full bg-neutral-950 border-l border-neutral-800 p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {activeLeadDetails.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                        activeLeadDetails.status
                      )}`}
                    >
                      {activeLeadDetails.status}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">
                    ID: {activeLeadDetails.id} · Source: {activeLeadDetails.leadSource}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveLeadDetails(null)}
                  className="p-1.5 rounded-lg bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Patient Intake Highlights */}
              <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 space-y-2">
                <div className="text-xs font-semibold text-neutral-300">Care Requirement:</div>
                <p className="text-xs text-neutral-400">{activeLeadDetails.careNeed}</p>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                  <span className="text-neutral-400">Estimated Plan Value:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    ${activeLeadDetails.estimatedValue.toLocaleString()} / 60-day cycle
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 text-xs">
                <div className="text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  Contact & Dispatch
                </div>
                <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-900/40 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Phone:</span>
                    <span className="font-mono text-white">{activeLeadDetails.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Email:</span>
                    <span className="font-mono text-white">{activeLeadDetails.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Assigned Coordinator:</span>
                    <span className="text-indigo-300 font-semibold">{activeLeadDetails.assignedUser}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Next Scheduled Follow-up:</span>
                    <span className="text-amber-400 font-mono font-semibold">
                      {activeLeadDetails.nextFollowUp}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes & Activity Log */}
              <div className="space-y-2 text-xs">
                <div className="text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  Clinical & Intake Notes ({activeLeadDetails.notes.length})
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeLeadDetails.notes.map((note, index) => (
                    <div
                      key={index}
                      className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900/80 text-neutral-300 text-xs"
                    >
                      {note}
                    </div>
                  ))}
                </div>

                {/* Add Manual Note */}
                <div className="pt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type manual coordinator note..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveNote()}
                    className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Save
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveLeadDetails(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Add New Home Care Lead
              </h3>
              <button
                type="button"
                onClick={() => setShowAddLeadModal(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Patient or Primary Contact Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="(555) 000-0000"
                    value={newLeadPhone}
                    onChange={(e) => setNewLeadPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="contact@family.com"
                    value={newLeadEmail}
                    onChange={(e) => setNewLeadEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Lead Source</label>
                  <select
                    value={newLeadSource}
                    onChange={(e) => setNewLeadSource(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Hospital Referral">Hospital Referral</option>
                    <option value="Doctor Office">Doctor Office</option>
                    <option value="Physician Portal">Physician Portal</option>
                    <option value="Inbound Call">Inbound Call</option>
                    <option value="Web Form">Web Form</option>
                    <option value="Google Search">Google Search</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Estimated Deal Value ($)</label>
                  <input
                    type="number"
                    value={newLeadValue}
                    onChange={(e) => setNewLeadValue(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Care Need / Clinical Diagnosis</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Post-stroke rehabilitation, 4x weekly RN wound dressing"
                  value={newLeadCareNeed}
                  onChange={(e) => setNewLeadCareNeed(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-neutral-300 border border-neutral-800 hover:bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
