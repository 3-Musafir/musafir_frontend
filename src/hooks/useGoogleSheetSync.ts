import { useCallback, useEffect, useState } from "react";
import { FlagshipService } from "@/services/flagshipService";

export interface GoogleSheetStatus {
  connected: boolean;
  sheetId: string | null;
  sheetName: string | null;
  lastSyncedAt: string | null;
  syncError: string | null;
}

export const useGoogleSheetSync = (flagshipId?: string) => {
  const [status, setStatus] = useState<GoogleSheetStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!flagshipId) return;
    setLoading(true);
    try {
      const data = await FlagshipService.getGoogleSheetStatus(flagshipId);
      setStatus({
        connected: Boolean(data?.connected),
        sheetId: data?.sheetId || null,
        sheetName: data?.sheetName || null,
        lastSyncedAt: data?.lastSyncedAt ? new Date(data.lastSyncedAt).toISOString() : null,
        syncError: data?.syncError || null,
      });
    } catch (error) {
      console.error("Failed to load Google Sheet status:", error);
    } finally {
      setLoading(false);
    }
  }, [flagshipId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const connectSheet = useCallback(
    async (sheetId: string, sheetName?: string) => {
      if (!flagshipId) return;
      setActionLoading(true);
      try {
        await FlagshipService.connectGoogleSheet(flagshipId, sheetId, sheetName);
        await fetchStatus();
      } catch (error) {
        console.error("Failed to connect Google Sheet:", error);
      } finally {
        setActionLoading(false);
      }
    },
    [flagshipId, fetchStatus],
  );

  const disconnectSheet = useCallback(async () => {
    if (!flagshipId) return;
    setActionLoading(true);
    try {
      await FlagshipService.disconnectGoogleSheet(flagshipId);
      await fetchStatus();
    } catch (error) {
      console.error("Failed to disconnect Google Sheet:", error);
    } finally {
      setActionLoading(false);
    }
  }, [flagshipId, fetchStatus]);

  return {
    status,
    loading,
    actionLoading,
    refresh: fetchStatus,
    connectSheet,
    disconnectSheet,
  };
};
