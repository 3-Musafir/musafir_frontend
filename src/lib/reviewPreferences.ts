import type { Review } from "@/data/reviews";

export type ReviewPreferences = {
  preferredReviewIds: string[];
  questionTags: string[];
  personaTags: string[];
  updatedAt?: string;
};

export type LocalReviewPreferences = ReviewPreferences & {
  syncedAt?: string;
};

export type ReviewPreferencesUpdate = {
  reviewIds?: string[];
  questionTags?: string[];
  personaTags?: string[];
};

const STORAGE_KEY = "3musafir.reviewPreferences.v1";
const REVIEW_ID_PATTERN = /^[a-z0-9][a-z0-9-]{1,140}$/;
const PREFERENCE_LIMITS = {
  preferredReviewIds: 100,
  questionTags: 20,
  personaTags: 20,
};

const ALLOWED_QUESTION_TAGS = new Set([
  "first_experience",
  "safety_women",
  "solo_awkward",
  "value_money",
  "inclusive",
  "no_one",
  "comfort_self",
  "community_active",
]);

const ALLOWED_PERSONA_TAGS = new Set([
  "solo",
  "women",
  "introvert",
  "safety",
  "community",
]);

export const EMPTY_REVIEW_PREFERENCES: ReviewPreferences = {
  preferredReviewIds: [],
  questionTags: [],
  personaTags: [],
};

const uniqueCapped = (values: string[], cap: number) => {
  const seen = new Set<string>();
  const result: string[] = [];
  values.forEach((value) => {
    if (seen.has(value)) return;
    seen.add(value);
    result.push(value);
  });
  return result.slice(0, cap);
};

const normalizeDate = (value: unknown) => {
  if (!value) return undefined;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

const latestDate = (values: Array<string | undefined>) => {
  const timestamps = values
    .map((value) => (value ? new Date(value).getTime() : NaN))
    .filter((value) => !Number.isNaN(value));
  if (!timestamps.length) return undefined;
  return new Date(Math.max(...timestamps)).toISOString();
};

export const normalizeReviewPreferences = (
  value: Partial<LocalReviewPreferences> | null | undefined
): LocalReviewPreferences => {
  const preferredReviewIds = uniqueCapped(
    Array.isArray(value?.preferredReviewIds)
      ? value.preferredReviewIds.filter(
          (id): id is string => typeof id === "string" && REVIEW_ID_PATTERN.test(id)
        )
      : [],
    PREFERENCE_LIMITS.preferredReviewIds
  );
  const questionTags = uniqueCapped(
    Array.isArray(value?.questionTags)
      ? value.questionTags.filter(
          (tag): tag is string => typeof tag === "string" && ALLOWED_QUESTION_TAGS.has(tag)
        )
      : [],
    PREFERENCE_LIMITS.questionTags
  );
  const personaTags = uniqueCapped(
    Array.isArray(value?.personaTags)
      ? value.personaTags.filter(
          (tag): tag is string => typeof tag === "string" && ALLOWED_PERSONA_TAGS.has(tag)
        )
      : [],
    PREFERENCE_LIMITS.personaTags
  );

  return {
    preferredReviewIds,
    questionTags,
    personaTags,
    updatedAt: normalizeDate(value?.updatedAt),
    syncedAt: normalizeDate(value?.syncedAt),
  };
};

export const mergeReviewPreferences = (
  ...sources: Array<Partial<LocalReviewPreferences> | null | undefined>
): LocalReviewPreferences => {
  const normalized = sources.map(normalizeReviewPreferences);
  const merged = normalizeReviewPreferences({
    preferredReviewIds: normalized.flatMap((source) => source.preferredReviewIds),
    questionTags: normalized.flatMap((source) => source.questionTags),
    personaTags: normalized.flatMap((source) => source.personaTags),
    updatedAt: latestDate(normalized.map((source) => source.updatedAt)),
  });

  if (
    !merged.updatedAt &&
    (merged.preferredReviewIds.length || merged.questionTags.length || merged.personaTags.length)
  ) {
    merged.updatedAt = new Date().toISOString();
  }

  return merged;
};

export const buildPreferenceFromReview = (review: Review): LocalReviewPreferences =>
  normalizeReviewPreferences({
    preferredReviewIds: [review.id],
    questionTags: review.questionTags,
    personaTags: review.personaTags ?? [],
    updatedAt: new Date().toISOString(),
  });

export const toReviewPreferencesUpdate = (
  preferences: ReviewPreferences
): ReviewPreferencesUpdate => ({
  reviewIds: preferences.preferredReviewIds,
  questionTags: preferences.questionTags,
  personaTags: preferences.personaTags,
});

export const loadLocalReviewPreferences = (): LocalReviewPreferences => {
  if (typeof window === "undefined") return { ...EMPTY_REVIEW_PREFERENCES };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return normalizeReviewPreferences(raw ? JSON.parse(raw) : null);
  } catch {
    return { ...EMPTY_REVIEW_PREFERENCES };
  }
};

export const saveLocalReviewPreferences = (preferences: LocalReviewPreferences) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(normalizeReviewPreferences(preferences))
  );
};

export const markReviewPreferencesSynced = (
  preferences: LocalReviewPreferences
): LocalReviewPreferences => ({
  ...preferences,
  syncedAt: preferences.updatedAt,
});

export const hasUnsyncedLocalPreferences = (preferences: LocalReviewPreferences) =>
  Boolean(
    (preferences.preferredReviewIds.length ||
      preferences.questionTags.length ||
      preferences.personaTags.length) &&
      preferences.updatedAt !== preferences.syncedAt
  );

export const areReviewPreferencesEqual = (
  left: ReviewPreferences,
  right: ReviewPreferences
) => {
  const normalizedLeft = normalizeReviewPreferences(left);
  const normalizedRight = normalizeReviewPreferences(right);
  const sameArray = (a: string[], b: string[]) =>
    a.length === b.length && a.every((value, index) => value === b[index]);

  return (
    sameArray(normalizedLeft.preferredReviewIds, normalizedRight.preferredReviewIds) &&
    sameArray(normalizedLeft.questionTags, normalizedRight.questionTags) &&
    sameArray(normalizedLeft.personaTags, normalizedRight.personaTags)
  );
};

