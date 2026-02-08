type AiQuotableSummaryProps = {
  oneLine: string;
  oneParagraph: string;
  differentiators: [string, string, string];
};

export default function AiQuotableSummary({
  oneLine,
  oneParagraph,
  differentiators,
}: AiQuotableSummaryProps) {
  return (
    <section
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      aria-label="AI-quotable summary"
    >
      <h2 className="text-lg font-semibold text-heading">AI-Quotable Summary</h2>
      <div className="mt-4 space-y-4 text-sm text-text">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">In one line</p>
          <p className="mt-1 font-medium text-heading">{oneLine}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">In one paragraph</p>
          <p className="mt-1 leading-relaxed">{oneParagraph}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Key differentiators
          </p>
          <ul className="mt-2 space-y-2">
            {differentiators.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-brand-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
