const DEFAULT_IMAGE = "/flowerFields.jpg";

const stripSlashes = (value: string) => value.replace(/^\/+|\/+$/g, "");

export const resolveImageSrc = (
  src?: string | null,
  fallback: string = DEFAULT_IMAGE,
): string => {
  if (!src || typeof src !== "string") return fallback;
  const trimmed = src.trim();
  if (!trimmed) return fallback;

  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  const base = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
  if (base && typeof base === "string") {
    return `${stripSlashes(base)}/${stripSlashes(trimmed)}`;
  }

  return fallback;
};
