import { useEffect } from "react";
import { REVIEW_STATUS_LABELS, Review } from "@/data/reviews";
import MediaBlock from "@/components/MediaBlock";

type ReviewCardProps = {
  review: Review;
  expanded: boolean;
  onToggleExpand: () => void;
  onHelped: () => void;
  helped: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStopMedia: () => void;
};

const helpedLabel = "\u2764\uFE0F This helped me";
const thanksMessage = "Thanks well show more stories like this.";

type EditorialTransform = Exclude<Review["editorialTransform"], undefined>;

const editorialTransformNotes: Partial<Record<EditorialTransform, string>> = {
  trimmed: "Trimmed for length.",
  normalized: "Lightly normalized for readability.",
  excerpted: "Excerpted from a longer post-trip message.",
};

const formatSourceDate = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat("en-PK", {
    month: "short",
    year: "numeric",
  }).format(parsed);
};

export default function ReviewCard({
  review,
  expanded,
  onToggleExpand,
  onHelped,
  helped,
  isPlaying,
  onTogglePlay,
  onStopMedia,
}: ReviewCardProps) {
  useEffect(() => {
    if (!expanded && isPlaying) {
      onStopMedia();
    }
  }, [expanded, isPlaying, onStopMedia]);

  const name = review.name ?? "Musafir";
  const city = review.city;
  const sourceDate = formatSourceDate(review.sourceDate || review.createdAt);
  const statusLabel = REVIEW_STATUS_LABELS[review.verifiedStatus];
  const transformNote = review.editorialTransform
    ? editorialTransformNotes[review.editorialTransform]
    : null;

  return (
    <article
      id={review.id}
      className="rounded-2xl border border-canvas-line bg-white px-6 py-5 shadow-soft"
    >
      <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-text-light">
        <span className="rounded-full bg-brand-primary-light px-2.5 py-1 text-heading">
          {statusLabel}
        </span>
        {review.sourceEvent ? (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-text">
            {review.sourceEvent}
          </span>
        ) : null}
        {sourceDate ? <span>{sourceDate}</span> : null}
        {review.sourceChannel ? <span>{review.sourceChannel}</span> : null}
      </div>

      <p
        className={`mt-4 text-sm leading-relaxed text-heading ${
          expanded ? "" : "line-clamp-2"
        }`}
      >
        {review.quote}
      </p>
      <div className="mt-3 text-sm text-heading">
        <span className="font-semibold">{name}</span>
        {city ? <span className="text-text"> \u00b7 {city}</span> : null}
      </div>
      <p className="mt-1 text-xs text-text-light">{review.context}</p>

      {review.media ? (
        <MediaBlock
          media={review.media}
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
        />
      ) : null}

      {expanded && review.story ? (
        <p className="mt-4 text-sm leading-relaxed text-text">{review.story}</p>
      ) : null}

      {expanded ? (
        <div className="mt-4 space-y-2 rounded-2xl bg-gray-50 px-4 py-3 text-xs text-text">
          <p>
            <span className="font-semibold text-heading">How this review was processed:</span>{" "}
            {statusLabel}
            {transformNote ? ` · ${transformNote}` : ""}
          </p>
          {review.sourceEvent || review.sourceDate ? (
            <p>
              <span className="font-semibold text-heading">Source:</span>{" "}
              {[review.sourceEvent, sourceDate].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-expanded={expanded}
          onClick={onToggleExpand}
          className="rounded-full border border-canvas-line px-4 py-1.5 text-xs font-semibold text-heading transition hover:border-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        >
          {expanded ? "Show less" : "Read their story"}
        </button>
        <button
          type="button"
          onClick={onHelped}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
            helped
              ? "bg-brand-primary-light text-heading"
              : "border border-brand-primary text-heading"
          }`}
        >
          {helpedLabel}
        </button>
      </div>

      {helped ? <p className="mt-2 text-xs text-text-light">{thanksMessage}</p> : null}
    </article>
  );
}
