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


export const getUpdatedAtToken = (source?: { updatedAt?: string | Date } | null): string | undefined => {
  const value = source?.updatedAt;
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
};
