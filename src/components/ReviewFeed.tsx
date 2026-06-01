import { type KeyboardEvent, type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  DEFAULT_QUESTION,
  EXPLORING_ID,
  EXPLORING_LABEL,
  QUESTIONS,
} from "@/data/questions";
import {
  REVIEW_DISCLOSURE_ITEMS,
  REVIEW_STATUS_LABELS,
  REVIEWS,
  Review,
} from "@/data/reviews";
import { rankReviews } from "@/lib/rankReviews";
import QuestionSelector from "@/components/QuestionSelector";
import useUserHandler from "@/hooks/useUserHandler";
import {
  EMPTY_REVIEW_PREFERENCES,
  areReviewPreferencesEqual,
  buildPreferenceFromReview,
  hasUnsyncedLocalPreferences,
  loadLocalReviewPreferences,
  markReviewPreferencesSynced,
  mergeReviewPreferences,
  normalizeReviewPreferences,
  saveLocalReviewPreferences,
  toReviewPreferencesUpdate,
  type LocalReviewPreferences,
} from "@/lib/reviewPreferences";

const ReviewSphereCanvas = dynamic(() => import("@/components/ReviewSphereCanvas"), {
  ssr: false,
});

const formatSourceDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat("en-PK", {
    month: "short",
    year: "numeric",
  }).format(parsed);
};

const matchesSearch = (review: Review, query: string) => {
  const haystack = [
    review.quote,
    review.name,
    review.city,
    review.context,
    review.story,
    review.sourceEvent,
    review.sourceChannel,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
};

type ReviewOrbRotatorProps = {
  reviews: Review[];
  contextLine: string;
  showClosestExperiencesLabel: boolean;
  reviewPreferences: LocalReviewPreferences;
  onShowMoreLikeThis: (review: Review) => void;
};

function ReviewOrbRotator({
  reviews,
  contextLine,
  showClosestExperiencesLabel,
  reviewPreferences,
  onShowMoreLikeThis,
}: ReviewOrbRotatorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const dragStartX = useRef<number | null>(null);

  useEffect(() => {
    setActiveIndex(0);
    setRotation(0);
  }, [reviews]);

  const safeActiveIndex = reviews.length ? activeIndex % reviews.length : 0;
  const activeReview = reviews[safeActiveIndex];
  const activeDate = formatSourceDate(activeReview?.sourceDate || activeReview?.createdAt);
  const activeStatus = activeReview
    ? REVIEW_STATUS_LABELS[activeReview.verifiedStatus]
    : null;
  const isPreferred = activeReview
    ? reviewPreferences.preferredReviewIds.includes(activeReview.id)
    : false;
  const orbitReviews = reviews.slice(0, 8);

  const rotateTo = (direction: 1 | -1) => {
    if (!reviews.length) return;
    setActiveIndex((prev) => (prev + direction + reviews.length) % reviews.length);
    setRotation((prev) => prev + direction * 42);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const delta = event.clientX - dragStartX.current;
    if (Math.abs(delta) < 42) return;
    rotateTo(delta < 0 ? 1 : -1);
    dragStartX.current = event.clientX;
  };

  const handlePointerUp = () => {
    dragStartX.current = null;
  };

  if (!activeReview) {
    return (
      <div className="rounded-3xl border border-canvas-line bg-white px-6 py-8 text-sm text-text shadow-soft">
        No matches right now. Try a different word.
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-canvas-line bg-white p-5 shadow-soft md:p-6">
      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(280px,0.85fr)_minmax(0,1.15fr)] lg:items-center">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-text-light">
            <span>{safeActiveIndex + 1}</span>
            <span className="h-px w-8 bg-canvas-line" />
            <span>{reviews.length}</span>
          </div>

          <div
            role="button"
            tabIndex={0}
            aria-label="Rotate reviews"
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                rotateTo(1);
              }
              if (event.key === "ArrowLeft") {
                event.preventDefault();
                rotateTo(-1);
              }
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="relative grid h-64 w-64 cursor-grab touch-pan-y place-items-center rounded-full outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-brand-primary sm:h-72 sm:w-72"
          >
            <div className="review-orb-frame absolute inset-7 z-0 rounded-full">
              <ReviewSphereCanvas rotation={rotation} />
            </div>

            {orbitReviews.map((review, index) => {
              const angle = (360 / Math.max(orbitReviews.length, 1)) * index + rotation;
              const isActive = review.id === activeReview.id;
              return (
                <button
                  key={review.id}
                  type="button"
                  aria-label={`Show review ${index + 1}`}
                  onClick={() => {
                    setActiveIndex(index);
                    setRotation(angle);
                  }}
                  className={`absolute left-1/2 top-1/2 z-10 -ml-1.5 -mt-1.5 h-3.5 w-3.5 rounded-full border transition ${
                    isActive
                      ? "border-heading bg-heading shadow-[0_0_0_6px_rgba(255,144,0,0.18)]"
                      : "border-white bg-brand-primary"
                  }`}
                  style={{
                    transform: `rotate(${angle}deg) translate(118px) rotate(-${angle}deg)`,
                  }}
                />
              );
            })}
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => rotateTo(-1)}
              className="rounded-full border border-canvas-line px-4 py-2 text-xs font-semibold text-heading transition hover:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => rotateTo(1)}
              className="rounded-full bg-brand-primary px-5 py-2 text-xs font-semibold text-heading transition hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
            >
              Rotate
            </button>
          </div>
        </div>

        <article
          id={activeReview.id}
          className="rounded-3xl border border-canvas-line bg-canvas-base p-5 md:p-6"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-light">{contextLine}</p>
            {showClosestExperiencesLabel ? (
              <span className="text-xs font-medium text-text">Showing closest experiences</span>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-[11px] font-medium text-text-light">
            {activeStatus ? (
              <span className="rounded-full bg-brand-primary-light px-2.5 py-1 text-heading">
                {activeStatus}
              </span>
            ) : null}
            {activeReview.sourceEvent ? (
              <span className="rounded-full bg-white px-2.5 py-1 text-text">
                {activeReview.sourceEvent}
              </span>
            ) : null}
            {activeDate ? <span>{activeDate}</span> : null}
            {activeReview.sourceChannel ? <span>{activeReview.sourceChannel}</span> : null}
          </div>

          <p className="mt-5 text-lg leading-relaxed text-heading">
            {activeReview.quote}
          </p>
          <div className="mt-4 text-sm text-heading">
            <span className="font-semibold">{activeReview.name ?? "Musafir"}</span>
            {activeReview.city ? (
              <span className="text-text"> · {activeReview.city}</span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-text-light">{activeReview.context}</p>

          {activeReview.story ? (
            <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-text">
              {activeReview.story}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onShowMoreLikeThis(activeReview)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                isPreferred
                  ? "bg-brand-primary-light text-heading"
                  : "border border-brand-primary text-heading"
              }`}
            >
              {isPreferred ? "Showing similar reviews" : "Show more like this"}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

export default function ReviewFeed() {
  const { status } = useSession();
  const { getReviewPreferences, updateReviewPreferences } = useUserHandler();
  const [selectedQuestionId, setSelectedQuestionId] = useState(EXPLORING_ID);
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewPreferences, setReviewPreferences] =
    useState<LocalReviewPreferences>(EMPTY_REVIEW_PREFERENCES);
  const [localHydrated, setLocalHydrated] = useState(false);
  const serverHydratedRef = useRef(false);
  const persistSeqRef = useRef(0);
  const preferenceApiRef = useRef({ getReviewPreferences, updateReviewPreferences });

  const activeQuestion =
    selectedQuestionId === EXPLORING_ID
      ? DEFAULT_QUESTION
      : QUESTIONS.find((question) => question.id === selectedQuestionId) ??
        DEFAULT_QUESTION;

  const biasTags = useMemo(() => {
    return [...reviewPreferences.questionTags, ...reviewPreferences.personaTags];
  }, [reviewPreferences.personaTags, reviewPreferences.questionTags]);

  const rankResult = useMemo(
    () =>
      rankReviews(REVIEWS, {
        questionTags: activeQuestion.tags,
        adjacentTags: activeQuestion.adjacentTags,
        biasTags,
      }),
    [activeQuestion.id, biasTags]
  );

  const rankedReviews = useMemo(() => {
    if (!searchQuery.trim()) return rankResult.items;
    return rankResult.items.filter((review) => matchesSearch(review, searchQuery));
  }, [rankResult.items, searchQuery]);

  const contextLine =
    selectedQuestionId === EXPLORING_ID
      ? "Heres how people describe their first experience:"
      : "People who asked this said:";

  const showClosestExperiencesLabel = rankResult.usedAdjacentTags;

  useEffect(() => {
    preferenceApiRef.current = { getReviewPreferences, updateReviewPreferences };
  }, [getReviewPreferences, updateReviewPreferences]);

  useEffect(() => {
    setReviewPreferences(loadLocalReviewPreferences());
    setLocalHydrated(true);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      serverHydratedRef.current = false;
    }
  }, [status]);

  useEffect(() => {
    if (!localHydrated || status !== "authenticated" || serverHydratedRef.current) return;

    let cancelled = false;
    serverHydratedRef.current = true;

    const hydrateServerPreferences = async () => {
      const localPreferences = loadLocalReviewPreferences();

      try {
        const serverPreferences = normalizeReviewPreferences(
          await preferenceApiRef.current.getReviewPreferences()
        );
        const mergedPreferences = mergeReviewPreferences(localPreferences, serverPreferences);
        const shouldPersistMergedPreferences =
          hasUnsyncedLocalPreferences(localPreferences) ||
          !areReviewPreferencesEqual(mergedPreferences, serverPreferences);

        if (shouldPersistMergedPreferences) {
          const savedPreferences = normalizeReviewPreferences(
            await preferenceApiRef.current.updateReviewPreferences(
              toReviewPreferencesUpdate(mergedPreferences)
            )
          );
          const syncedPreferences = markReviewPreferencesSynced(
            mergeReviewPreferences(savedPreferences, mergedPreferences)
          );
          saveLocalReviewPreferences(syncedPreferences);
          if (!cancelled) setReviewPreferences(syncedPreferences);
          return;
        }

        const syncedPreferences = markReviewPreferencesSynced(mergedPreferences);
        saveLocalReviewPreferences(syncedPreferences);
        if (!cancelled) setReviewPreferences(syncedPreferences);
      } catch {
        saveLocalReviewPreferences(localPreferences);
        if (!cancelled) setReviewPreferences(localPreferences);
      }
    };

    hydrateServerPreferences();

    return () => {
      cancelled = true;
    };
  }, [localHydrated, status]);

  const handleShowMoreLikeThis = async (review: Review) => {
    const incomingPreferences = buildPreferenceFromReview(review);
    const nextPreferences = mergeReviewPreferences(incomingPreferences, reviewPreferences);
    const sequence = persistSeqRef.current + 1;
    persistSeqRef.current = sequence;

    setReviewPreferences(nextPreferences);
    saveLocalReviewPreferences(nextPreferences);

    if (status !== "authenticated") return;

    try {
      const savedPreferences = normalizeReviewPreferences(
        await updateReviewPreferences(toReviewPreferencesUpdate(nextPreferences))
      );
      const syncedPreferences = markReviewPreferencesSynced(
        mergeReviewPreferences(savedPreferences, nextPreferences)
      );
      saveLocalReviewPreferences(syncedPreferences);
      if (persistSeqRef.current === sequence) {
        setReviewPreferences(syncedPreferences);
      }
    } catch {
      saveLocalReviewPreferences(nextPreferences);
    }
  };

  return (
    <section className="pb-16">
      <div className="max-w-full">
        <header className="pt-4 lg:pt-6">
          <h2 className="text-3xl font-semibold text-heading sm:text-4xl">
            If you are wondering
          </h2>
          <p className="mt-2 text-base text-text sm:text-lg">
            You are probably not the first. Heres what real Musafirs said.
          </p>
          <p className="mt-3 text-sm text-text-light">
            These questions came from real Musafirs before their first trip.
          </p>
        </header>

        <section className="mt-6 rounded-3xl border border-canvas-line bg-white px-6 py-5 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-lg font-semibold text-heading">
                How reviews are collected and edited
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text">
                This page is a trust hub for real post-trip testimonials. It mixes
                curated excerpts and traveler-submitted messages, and it does not
                treat every entry as a booking-linked review.
              </p>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-text">
                {REVIEW_DISCLOSURE_ITEMS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="min-w-[240px] rounded-2xl bg-gray-50 px-4 py-4 text-xs text-text">
              <p className="font-semibold uppercase tracking-[0.14em] text-text-light">
                Review Labels
              </p>
              <div className="mt-3 space-y-2">
                {Object.entries(REVIEW_STATUS_LABELS).map(([key, label]) => (
                  <p key={key}>
                    <span className="font-semibold text-heading">{label}:</span>{" "}
                    {key === "trip-linked"
                      ? "directly tied to a known trip or registration flow."
                      : key === "submitted"
                        ? "posted by a traveler after a trip, without booking verification on this page."
                        : "curated from longer community posts for readability."}
                  </p>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/trust" className="font-semibold text-brand-primary hover:underline">
                  Trust hub
                </Link>
                <Link href="/why" className="font-semibold text-brand-primary hover:underline">
                  Why 3Musafir
                </Link>
                <Link
                  href="/about-3musafir"
                  className="font-semibold text-brand-primary hover:underline"
                >
                  About 3Musafir
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="sticky top-0 z-20 mt-6">
        <QuestionSelector
          questions={QUESTIONS}
          selectedId={selectedQuestionId}
          showAll={showAllQuestions}
          onSelect={(id) => setSelectedQuestionId(id)}
          onToggleShowAll={() => setShowAllQuestions((prev) => !prev)}
        />
      </div>

      <div className="mt-4 max-w-full">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-light">{contextLine}</p>
          {showClosestExperiencesLabel ? (
            <span className="text-xs font-medium text-text">Showing closest experiences</span>
          ) : null}
        </div>
        <p className="mt-2 text-xs text-text-light">
          Browse themes like solo travel, safety, first-time nerves, community, and trip quality.
        </p>

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-xs text-text-light" htmlFor="review-search">
            Search
          </label>
          <input
            id="review-search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, event, trip, or keyword"
            className="w-full rounded-2xl border border-canvas-line bg-white px-4 py-3 text-sm text-heading placeholder:text-text-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          />
          {searchQuery.trim() ? (
            <span className="text-xs text-text">Matches your search</span>
          ) : null}
        </div>

        <div className="mt-6">
          <ReviewOrbRotator
            reviews={rankedReviews}
            contextLine={contextLine}
            showClosestExperiencesLabel={showClosestExperiencesLabel}
            reviewPreferences={reviewPreferences}
            onShowMoreLikeThis={handleShowMoreLikeThis}
          />
        </div>
      </div>

      <div className="sr-only">{EXPLORING_LABEL}</div>
    </section>
  );
}
