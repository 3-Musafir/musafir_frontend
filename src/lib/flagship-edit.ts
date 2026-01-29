export const getEditIdFromSearch = (search?: string | null): string | null => {
  if (!search) return null;
  const params = new URLSearchParams(search);
  const editId = params.get("editId");
  return editId && editId.trim() ? editId.trim() : null;
};

export const withEditId = (path: string, editId?: string | null): string => {
  if (!editId) return path;
  return `${path}?editId=${encodeURIComponent(editId)}`;
};
