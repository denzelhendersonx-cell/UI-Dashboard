import React from "react";
import { AlertTriangle, RefreshCw, Inbox } from "lucide-react";

export function LoadingSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-neutral-800/60 rounded-md ${className}`} />
  );
}

export function LoadingState({ message = "Loading data..." }: { message?: string }) {
  return (
    <div className="py-16 px-6 text-center max-w-md mx-auto my-6 space-y-3">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 animate-spin">
        <RefreshCw className="w-5 h-5" />
      </div>
      <p className="text-xs text-neutral-400 font-medium">{message}</p>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/50 space-y-3">
      <div className="flex justify-between items-center">
        <LoadingSkeleton className="h-4 w-28" />
        <LoadingSkeleton className="h-5 w-5 rounded-full" />
      </div>
      <LoadingSkeleton className="h-8 w-20" />
      <LoadingSkeleton className="h-3 w-36" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="w-full border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/30">
      <div className="p-4 border-b border-neutral-800 flex justify-between gap-4">
        <LoadingSkeleton className="h-9 w-64" />
        <div className="flex gap-2">
          <LoadingSkeleton className="h-9 w-24" />
          <LoadingSkeleton className="h-9 w-28" />
        </div>
      </div>
      <div className="divide-y divide-neutral-800/60">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <LoadingSkeleton className="h-4 w-4 rounded" />
              <div className="space-y-1.5">
                <LoadingSkeleton className="h-4 w-48" />
                <LoadingSkeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LoadingSkeleton className="h-6 w-20 rounded-full" />
              <LoadingSkeleton className="h-6 w-16 rounded-full" />
              <LoadingSkeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({
  title = "No items to show",
  description = "There are no incidents currently matching your selected filters.",
  actionText,
  onAction,
}: {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <div className="py-14 px-6 text-center border border-dashed border-neutral-800 rounded-xl bg-neutral-900/20 max-w-lg mx-auto my-6">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-800/80 text-neutral-400 mb-3">
        <Inbox className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-neutral-200">{title}</h3>
      <p className="text-sm text-neutral-400 mt-1 max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  title = "Failed to load data",
  description = "A connection or server validation issue occurred.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-6 rounded-xl border border-rose-900/40 bg-rose-950/20 text-center max-w-md mx-auto my-8">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-rose-900/30 text-rose-400 mb-2.5">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-rose-200">{title}</h4>
      <p className="text-xs text-rose-300/80 mt-1 mb-4 leading-relaxed">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-neutral-900 border border-neutral-700 text-neutral-200 hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
}
