type SilentablePayload = Record<string, any> | FormData;

export const ensureSilentUpdate = (payload?: SilentablePayload) => {
  if (!payload) return;

  if (payload instanceof FormData) {
    payload.set('silentUpdate', 'true');
    return;
  }

  if (typeof payload === 'object') {
    payload.silentUpdate = true;
  }
};

export const getContentVersionToken = (
  source?: { contentVersion?: string | null } | null,
): string | undefined => {
  const value = source?.contentVersion;
  if (!value || typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};
