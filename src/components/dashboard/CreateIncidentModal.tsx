import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IncidentCategory, IncidentPriority, IncidentSource } from "../../types";
import { X, PlusCircle, AlertCircle, Loader2 } from "lucide-react";

const createSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  category: z.enum(["new_lead", "missed_call", "overdue_followup", "scheduling_conflict", "caregiver_noshow"]),
  priority: z.enum(["critical", "high", "medium", "low"]),
  customerName: z.string().min(2, "Customer / Client name is required"),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  caregiverName: z.string().optional(),
  description: z.string().min(5, "Please provide at least a brief context (5+ characters)"),
  suggestedAction: z.string().optional(),
  dealValue: z.coerce.number().min(0).optional(),
  slaMinutes: z.coerce.number().int().min(5).max(1440).default(60),
  source: z.enum(["phone_sms", "crm", "calendar", "email", "scheduling"]).default("phone_sms"),
});

export type CreateIncidentFormData = z.infer<typeof createSchema>;

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateIncidentFormData) => Promise<void>;
  isLoading: boolean;
}

export function CreateIncidentModal({ isOpen, onClose, onSubmit, isLoading }: CreateIncidentModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateIncidentFormData>({
    resolver: zodResolver(createSchema) as any,
    defaultValues: {
      category: "scheduling_conflict",
      priority: "high",
      slaMinutes: 45,
      dealValue: 2400,
      source: "phone_sms",
    },
  });

  if (!isOpen) return null;

  const handleFormSubmit = async (data: CreateIncidentFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Log Attention Item / Incident</h3>
              <p className="text-xs text-neutral-400">Queue an operational issue for immediate triage</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Incident Summary / Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              placeholder="e.g. Caregiver missed arrival check-in"
              className={`w-full px-3 py-2 rounded-lg border bg-neutral-950 text-neutral-100 text-xs focus:outline-none focus:ring-1 ${
                errors.title ? "border-rose-500 focus:ring-rose-500" : "border-neutral-700 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
            />
            {errors.title && <p className="text-[11px] text-rose-400 mt-1">{errors.title.message}</p>}
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                {...register("category")}
                className="w-full px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="caregiver_noshow">Caregiver No-Show</option>
                <option value="scheduling_conflict">Scheduling Conflict</option>
                <option value="new_lead">New Inbound Lead</option>
                <option value="missed_call">Missed Emergency Call</option>
                <option value="overdue_followup">Overdue Recertification</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Initial Priority <span className="text-rose-400">*</span>
              </label>
              <select
                {...register("priority")}
                className="w-full px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-200 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="critical">Critical (Immediate escalation)</option>
                <option value="high">High (Needs action &lt; 30m)</option>
                <option value="medium">Medium (Within 2 hours)</option>
                <option value="low">Low (Standard routine)</option>
              </select>
            </div>
          </div>

          {/* Customer & Caregiver */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Customer / Patient Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                {...register("customerName")}
                placeholder="e.g. Arthur Pendelton"
                className={`w-full px-3 py-2 rounded-lg border bg-neutral-950 text-neutral-100 text-xs focus:outline-none focus:ring-1 ${
                  errors.customerName ? "border-rose-500 focus:ring-rose-500" : "border-neutral-700 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              />
              {errors.customerName && <p className="text-[11px] text-rose-400 mt-1">{errors.customerName.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Assigned Aide / Caregiver (Optional)
              </label>
              <input
                type="text"
                {...register("caregiverName")}
                placeholder="e.g. Jessica Hayes, PT"
                className="w-full px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Contact Details & Deal Value */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Phone Number</label>
              <input
                type="text"
                {...register("customerPhone")}
                placeholder="(555) 000-0000"
                className="w-full px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">SLA Target (Mins)</label>
              <input
                type="number"
                {...register("slaMinutes")}
                placeholder="30"
                className="w-full px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">Estimated Value ($)</label>
              <input
                type="number"
                {...register("dealValue")}
                placeholder="3200"
                className="w-full px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Context & Root Reason <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={2}
              {...register("description")}
              placeholder="Detailed description of what happened..."
              className={`w-full px-3 py-2 rounded-lg border bg-neutral-950 text-neutral-100 text-xs focus:outline-none focus:ring-1 ${
                errors.description ? "border-rose-500 focus:ring-rose-500" : "border-neutral-700 focus:border-indigo-500 focus:ring-indigo-500"
              }`}
            />
            {errors.description && <p className="text-[11px] text-rose-400 mt-1">{errors.description.message}</p>}
          </div>

          {/* Suggested Next Action */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Suggested Immediate Action
            </label>
            <input
              type="text"
              {...register("suggestedAction")}
              placeholder="e.g. Call emergency family contact and dispatch standby roster"
              className="w-full px-3 py-2 rounded-lg border border-neutral-700 bg-neutral-950 text-neutral-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save & Queue Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
