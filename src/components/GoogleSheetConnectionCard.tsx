import { Button } from "@/components/ui/button";
import React from "react";

interface GoogleSheetConnectionCardProps {
  title: string;
  description: string;
  statusLabel: string;
  lastSynced?: string | null;
  connected: boolean;
  sheetId?: string | null;
  sheetUrl?: string | null;
  loading?: boolean;
  actionLoading?: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const GoogleSheetConnectionCard: React.FC<GoogleSheetConnectionCardProps> = ({
  title,
  description,
  statusLabel,
  lastSynced,
  connected,
  sheetId,
  sheetUrl,
  loading,
  actionLoading,
  onConnect,
  onDisconnect,
  onRefresh,
}) => {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-700">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            connected ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-700"
          }`}
        >
          {statusLabel}
        </span>
      </div>
      <div className="mt-3 space-y-2 text-sm text-gray-600">
        <p>
          <span className="font-semibold">Sheet:</span>{" "}
          {loading ? "Loading…" : sheetId || "Not connected"}
        </p>
        {lastSynced && (
          <p>
            <span className="font-semibold">Last sync:</span>{" "}
            {new Date(lastSynced).toLocaleString()}
          </p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            await onRefresh();
          }}
          disabled={loading}
        >
          Refresh
        </Button>
        {connected ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-rose-600"
            onClick={onDisconnect}
            isLoading={actionLoading}
          >
            Disconnect
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onConnect}
            isLoading={actionLoading}
          >
            Connect Google Sheet
          </Button>
        )}
        {sheetUrl && (
          <a
            href={sheetUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-input px-3 py-1 text-xs font-semibold text-brand-primary shadow-sm hover:bg-brand-primary/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary"
          >
            Open sheet
          </a>
        )}
      </div>
    </div>
  );
};
