import {
  IMPORTED_REVIEWS,
  type ImportedReviewSeed,
} from "./reviews.imported";

export type Media = {
  type: "voice" | "photos" | "video";
  durationSec?: number;
  count?: number;
};

export type Review = {
  id: string;
  quote: string;
  name?: string;
  city?: string;
  rating?: number;
  context: string;
  questionTags: string[];
  intensityScore: number;
  helpfulCount: number;
  verifiedTrip?: boolean;
  createdAt: string;
  media?: Media;
  story?: string;
  personaTags?: string[];
  sourceType: "testimonial" | "review";
  verifiedStatus: "editorial" | "submitted" | "trip-linked";
  sourceEvent?: string;
  sourceDate?: string;
  sourceChannel?: string;
  sourceUrl?: string;
  language?: "en" | "ur" | "mixed";
  editorialTransform?: "none" | "trimmed" | "normalized" | "excerpted";
};

type BaseReview = Omit<
  Review,
  | "sourceType"
  | "verifiedStatus"
  | "sourceEvent"
  | "sourceDate"
  | "sourceChannel"
  | "sourceUrl"
  | "language"
  | "editorialTransform"
>;

export const REVIEW_STATUS_LABELS: Record<Review["verifiedStatus"], string> = {
  editorial: "Editorial testimonial",
  submitted: "Submitted post-trip message",
  "trip-linked": "Trip-linked review",
};

export const REVIEW_DISCLOSURE_ITEMS = [
  "Most entries on this page are curated post-trip testimonials submitted by travelers after a 3Musafir event.",
  "Editorial testimonials may be shortened, lightly normalized, or excerpted for readability while preserving the original meaning.",
  "Unless a review is labeled trip-linked, it is not independently tied to a booking or registration record on this page.",
];

const collapseWhitespace = (value: string) =>
  value.replace(/https?:\/\/\S+/gi, "").replace(/\s+/g, " ").trim();

const normalizeForDedupe = (value: string) =>
  collapseWhitespace(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

const toSentencePreview = (value: string, maxLength = 180) => {
  const cleaned = collapseWhitespace(value);
  if (cleaned.length <= maxLength) return cleaned;

  const preview = cleaned.slice(0, maxLength);
  const lastBreak = Math.max(
    preview.lastIndexOf(". "),
    preview.lastIndexOf("! "),
    preview.lastIndexOf("? "),
    preview.lastIndexOf(", "),
    preview.lastIndexOf(" ")
  );

  if (lastBreak > 80) {
    return `${preview.slice(0, lastBreak).trim()}...`;
  }

  return `${preview.trim()}...`;
};

const matchesAny = (value: string, patterns: RegExp[]) =>
  patterns.some((pattern) => pattern.test(value));

const inferLanguage = (text: string): Review["language"] => {
  const hasUrduScript = /[\u0600-\u06FF]/.test(text);
  const hasLatin = /[A-Za-z]/.test(text);
  const hasRomanUrduMarkers = /\b(yaar|bohat|acha|mazay|safar|musafir|khush|yaind|lekin|sab|dua|inshaallah)\b/i.test(
    text
  );

  if (hasUrduScript && hasLatin) return "mixed";
  if (hasUrduScript) return "ur";
  if (hasRomanUrduMarkers) return "mixed";
  return "en";
};

const inferQuestionTags = (text: string) => {
  const value = text.toLowerCase();
  const tags = new Set<string>();

  if (
    matchesAny(value, [
      /\bfirst time\b/,
      /\bfirst ever\b/,
      /\bvery first\b/,
      /\bmy first trip\b/,
      /\bfirst solo\b/,
      /\bfirst group trip\b/,
    ])
  ) {
    tags.add("first_experience");
  }

  if (
    matchesAny(value, [
      /\bsolo\b/,
      /\balone\b/,
      /\bstrangers\b/,
      /didn'?t know anyone/,
      /\banxious\b/,
      /\bawkward\b/,
      /social battery/,
      /\bintrovert/,
    ])
  ) {
    tags.add("solo_awkward");
    tags.add("no_one");
  }

  if (
    matchesAny(value, [
      /\bsafe\b/,
      /\bsafety\b/,
      /\bsupported\b/,
      /\bcomfortable\b/,
      /\bsafe space\b/,
      /\bwomen\b/,
      /\bfemale\b/,
      /\bgirls\b/,
    ])
  ) {
    tags.add("safety_women");
  }

  if (
    matchesAny(value, [
      /\bheal/,
      /\btherapy\b/,
      /\bconfidence\b/,
      /\bbe myself\b/,
      /\bjudg/,
      /\bcomfortable\b/,
      /\bhome\b/,
      /\bpeace\b/,
      /\bcalm\b/,
      /\bawakening\b/,
      /\bgratitude\b/,
      /\bdetox\b/,
    ])
  ) {
    tags.add("comfort_self");
  }

  if (
    matchesAny(value, [
      /\bfriend/,
      /\bfamily\b/,
      /\bconnected\b/,
      /stay in touch/,
      /\bbond/,
      /\bcommunity\b/,
      /meet again/,
      /\bhome away from home\b/,
    ])
  ) {
    tags.add("community_active");
  }

  if (
    matchesAny(value, [
      /\bwelcoming\b/,
      /\bwarm\b/,
      /\bkind\b/,
      /\binclusive\b/,
      /\bbelong/,
      /\bcomfortable\b/,
      /didn'?t feel alone/,
      /didn'?t feel it at all/,
    ])
  ) {
    tags.add("inclusive");
  }

  if (
    matchesAny(value, [
      /\bwell managed\b/,
      /\bwell organised\b/,
      /\bwell organized\b/,
      /\borganized\b/,
      /\barranging\b/,
      /\bworth it\b/,
      /\bworth every\b/,
      /\bfacilities\b/,
    ])
  ) {
    tags.add("value_money");
  }

  if (!tags.size) {
    tags.add("community_active");
  }

  return Array.from(tags).slice(0, 5);
};

const inferPersonaTags = (text: string) => {
  const value = text.toLowerCase();
  const tags = new Set<string>();

  if (/\bsolo\b|\balone\b/.test(value)) tags.add("solo");
  if (/\bwomen\b|\bfemale\b|\bgirls\b|\bgrlies\b/.test(value)) tags.add("women");
  if (/\bintrovert\b|social battery|anti-social/.test(value)) tags.add("introvert");
  if (/\bsafe\b|\bsafety\b|\bsafe space\b/.test(value)) tags.add("safety");
  if (/\bfriends\b|\bfamily\b|\bcommunity\b|\bconnected\b/.test(value)) tags.add("community");

  return tags.size ? Array.from(tags) : undefined;
};

const inferContext = (event: string, text: string) => {
  const value = text.toLowerCase();

  if (
    /\bfirst\b/.test(value) &&
    (/\bsolo\b/.test(value) || /\balone\b/.test(value))
  ) {
    return `${event} · First-time solo`;
  }

  if (/\bsolo\b/.test(value) || /\balone\b/.test(value)) {
    return `${event} · Solo traveler`;
  }

  if (/\bfirst\b/.test(value)) {
    return `${event} · First-time traveler`;
  }

  if (/\bsecond\b|\bthird\b|\bfourth\b|\bfifth\b|\bagain\b/.test(value)) {
    return `${event} · Returning member`;
  }

  if (/\bretreat\b|\bdetox\b|\byoga\b|\bmeditation\b|\bheal/.test(value)) {
    return `${event} · Healing retreat`;
  }

  return `${event} · Community event`;
};

const inferIntensity = (text: string) => {
  const value = text.toLowerCase();
  let score = 0.58;

  if (matchesAny(value, [/\bbest\b/, /\bunforgettable\b/, /\bmagical\b/, /\bepic\b/])) {
    score += 0.08;
  }
  if (matchesAny(value, [/\blife changing\b/, /\bcore memory\b/, /\bdream come true\b/])) {
    score += 0.1;
  }
  if (matchesAny(value, [/\bheal/, /\btherapy\b/, /\bconfidence\b/, /\bawakening\b/])) {
    score += 0.08;
  }
  if (matchesAny(value, [/\banxious\b/, /\bscared\b/, /\bdoubts\b/, /\bworried\b/])) {
    score += 0.06;
  }
  if (matchesAny(value, [/\bso safe\b/, /\bsafe\b/, /\bsupported\b/, /\bhome\b/])) {
    score += 0.04;
  }

  return Math.min(0.92, Math.max(0.45, Number(score.toFixed(2))));
};

const distinctSignalPatterns = [
  /\bsolo\b/,
  /\balone\b/,
  /\bfirst\b/,
  /\bsafe\b/,
  /\bsafety\b/,
  /\banxious\b/,
  /\bmemorable\b/,
  /\bunforgettable\b/,
  /\bbelong/,
  /\bhome\b/,
  /\bcommunity\b/,
  /\bfriends?\b/,
  /\bbond/,
  /\bheal/,
  /\btherapy\b/,
  /\bwelcoming\b/,
  /\bkind\b/,
  /\bcomfortable\b/,
  /\bworth\b/,
  /\borganized\b/,
  /\bwell managed\b/,
];

const isLowSignalReview = (text: string) => {
  const normalized = collapseWhitespace(text);
  if (normalized.length >= 70) return false;
  return !matchesAny(normalized.toLowerCase(), distinctSignalPatterns);
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildImportedReview = (review: ImportedReviewSeed, index: number): Review => {
  const story = collapseWhitespace(review.text);
  const quote = toSentencePreview(story);

  return {
    id: `${slugify(review.event)}-${slugify(review.name || "anonymous")}-${index + 1}`,
    quote,
    name: review.name,
    context: inferContext(review.event, story),
    questionTags: inferQuestionTags(story),
    intensityScore: inferIntensity(story),
    helpfulCount: 0,
    verifiedTrip: false,
    createdAt: review.createdAt,
    story: story.length > quote.length ? story : undefined,
    personaTags: inferPersonaTags(story),
    sourceType: "testimonial",
    verifiedStatus: review.verifiedStatus || "editorial",
    sourceEvent: review.event,
    sourceDate: review.createdAt,
    sourceChannel: review.sourceChannel || "community post-trip message",
    sourceUrl: review.sourceUrl,
    language: review.language || inferLanguage(review.text),
    editorialTransform: review.editorialTransform || "excerpted",
  };
};

const withSeedMetadata = (review: BaseReview): Review => ({
  ...review,
  sourceType: "testimonial",
  verifiedStatus: "editorial",
  sourceEvent: review.context.split(" · ")[0],
  sourceDate: review.createdAt,
  sourceChannel: "community post-trip message",
  language: inferLanguage(review.story || review.quote),
  editorialTransform: "excerpted",
});

const baseSeedReviews: BaseReview[] = [
  {
    id: "manual-firefest-1",
    quote:
      "Thank you to all 3M team members for inviting me. Met amazing people. Vibe match honi chahiye bus.",
    name: "Usman Naseer Khan",
    context: "FIREFEST 4.0 · Community event",
    questionTags: ["community_active", "inclusive"],
    intensityScore: 0.72,
    helpfulCount: 0,
    verifiedTrip: false,
    createdAt: "2022-09-26T00:00:00.000Z",
    story:
      "He described the event as amazing, appreciated the people he met, and emphasized the shared vibe and connection.",
    personaTags: ["community"],
  },
  {
    id: "manual-firefest-2",
    quote:
      "It was my first time traveling solo and I didn't feel it at all.",
    name: "Sameen Fatima",
    context: "FIREFEST 4.0 · First-time solo",
    questionTags: ["solo_awkward", "no_one", "first_experience"],
    intensityScore: 0.84,
    helpfulCount: 0,
    verifiedTrip: false,
    createdAt: "2022-09-26T00:00:00.000Z",
    story:
      "She said the group made it feel like the best trip ever and removed the isolation she expected from solo travel.",
    personaTags: ["solo"],
  },
  {
    id: "manual-firefest-3",
    quote:
      "Thank you guys for being the amazing lot to travel with. Loved every bit of it.",
    name: "Urooj Malik",
    context: "FIREFEST 4.0 · Community event",
    questionTags: ["inclusive", "community_active"],
    intensityScore: 0.69,
    helpfulCount: 0,
    verifiedTrip: false,
    createdAt: "2022-09-26T00:00:00.000Z",
    story:
      "She described the group as fun to travel with and said she loved the experience from start to finish.",
    personaTags: ["community"],
  },
  {
    id: "manual-firefest-4",
    quote:
      "Traveling solo for the first time was not as easy as I expected, but it turned out better than I imagined.",
    name: "Rafay",
    context: "FIREFEST 4.0 · First-time solo",
    questionTags: ["solo_awkward", "first_experience", "no_one"],
    intensityScore: 0.82,
    helpfulCount: 0,
    verifiedTrip: false,
    createdAt: "2022-09-26T00:00:00.000Z",
    story:
      "He appreciated how welcoming everyone was and said the solo travel experience ended up much better than expected.",
    personaTags: ["solo"],
  },
  {
    id: "manual-firefest-5",
    quote:
      "I'm going to remember this tour as the first of many with 3 Musafir.",
    name: "Muhammad Abdullah",
    context: "FIREFEST 4.0 · First-time traveler",
    questionTags: ["first_experience", "community_active", "comfort_self"],
    intensityScore: 0.77,
    helpfulCount: 0,
    verifiedTrip: false,
    createdAt: "2022-09-26T00:00:00.000Z",
    story:
      "He highlighted the freedom to enjoy the trip in his own way, from bus moments to the hike, music, and dance.",
    personaTags: ["community"],
  },
  {
    id: "manual-firefest-6",
    quote:
      "It was like nothing I’ve ever felt, from the bus vibes to the dance in the rain at 3am.",
    name: "Faraz Butt",
    context: "FIREFEST 4.0 · High-energy group trip",
    questionTags: ["community_active", "first_experience"],
    intensityScore: 0.79,
    helpfulCount: 0,
    verifiedTrip: false,
    createdAt: "2022-09-26T00:00:00.000Z",
    story:
      "He described a rare sense of shared energy across the group and gave a strong shoutout to the 3M team.",
    personaTags: ["community"],
  },
  {
    id: "manual-firefest-7",
    quote:
      "I was travelling solo but coming back with a bunch of great friends.",
    name: "Alweena",
    context: "FIREFEST 4.0 · Solo traveler",
    questionTags: ["solo_awkward", "no_one", "community_active", "inclusive"],
    intensityScore: 0.9,
    helpfulCount: 0,
    verifiedTrip: false,
    createdAt: "2022-09-26T00:00:00.000Z",
    story:
      "She called it the best trip of her life, praised the comfortable space created by the team, and said she found people with the same energy, vibes, and frequency.",
    personaTags: ["solo", "community"],
  },
  {
    id: "manual-firefest-8",
    quote:
      "I really needed a break and used this trip as one, but it turned out to be way better than my expectations.",
    name: "Barka Nazir",
    context: "FIREFEST 4.0 · Returning member",
    questionTags: ["comfort_self", "community_active", "first_experience"],
    intensityScore: 0.8,
    helpfulCount: 0,
    verifiedTrip: false,
    createdAt: "2022-09-26T00:00:00.000Z",
    story:
      "She framed the trip as a healing break, said each new trip gets better, and credited both the people and the team for that feeling.",
    personaTags: ["community"],
  },
  {
    id: "manual-firefest-9",
    quote:
      "Loved the experience. Thank you all for making it worth it.",
    name: "Maham Sheikh",
    context: "FIREFEST 4.0 · Community event",
    questionTags: ["inclusive", "community_active"],
    intensityScore: 0.64,
    helpfulCount: 0,
    verifiedTrip: false,
    createdAt: "2022-09-26T00:00:00.000Z",
    story:
      "She kept it short but clearly described the event as worthwhile and appreciated the group experience.",
    personaTags: ["community"],
  },
];

const curatedImportedReviews = (() => {
  const seen = new Set<string>();

  return IMPORTED_REVIEWS
    .map(buildImportedReview)
    .filter((review) => {
      const fingerprint = normalizeForDedupe(
        `${review.sourceEvent || ""} ${review.name || ""} ${review.story || review.quote}`
      );

      if (!fingerprint || seen.has(fingerprint)) {
        return false;
      }

      if (isLowSignalReview(review.story || review.quote)) {
        return false;
      }

      seen.add(fingerprint);
      return true;
    });
})();

const seedReviews = baseSeedReviews.map(withSeedMetadata);

export const REVIEWS: Review[] = [...seedReviews, ...curatedImportedReviews];
