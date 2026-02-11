export type FlagshipDraftMode = 'create' | 'edit';

const STORAGE_PREFIX = 'flagshipDraft';
const LAST_MODE_KEY = `${STORAGE_PREFIX}:lastMode`;

const getDraftKey = (mode: FlagshipDraftMode, editId?: string | null) => {
  if (mode === 'create') return `${STORAGE_PREFIX}:create`;
  const safeId = editId && editId.trim() ? editId.trim() : 'unknown';
  return `${STORAGE_PREFIX}:edit:${safeId}`;
};

const getStorage = () => {
  if (typeof window === 'undefined') return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const getLastDraftMode = (): FlagshipDraftMode | null => {
  const storage = getStorage();
  if (!storage) return null;
  const value = storage.getItem(LAST_MODE_KEY);
  return value === 'create' || value === 'edit' ? value : null;
};

export const setLastDraftMode = (mode: FlagshipDraftMode) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(LAST_MODE_KEY, mode);
};

export const loadDraft = <T = any>(
  mode: FlagshipDraftMode,
  editId?: string | null,
): T | null => {
  const storage = getStorage();
  if (!storage) return null;
  const key = getDraftKey(mode, editId);
  const raw = storage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const saveDraft = (
  mode: FlagshipDraftMode,
  editId: string | null | undefined,
  data: unknown,
) => {
  const storage = getStorage();
  if (!storage) return;
  const key = getDraftKey(mode, editId);
  const sanitized = (() => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) return data ?? {};
    const copy = { ...(data as Record<string, unknown>) };
    delete (copy as any).contentVersion;
    return copy;
  })();
  storage.setItem(key, JSON.stringify(sanitized ?? {}));
};

export const clearDraft = (mode: FlagshipDraftMode, editId?: string | null) => {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(getDraftKey(mode, editId));
};
