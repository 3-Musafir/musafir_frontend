import type { FaqItem } from "@/components/seo/SeoHead";

type FaqSectionProps = {
  title?: string;
  items: FaqItem[];
};

export default function FaqSection({ title = "FAQs", items }: FaqSectionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-heading">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <details key={item.question} className="rounded-xl border border-gray-200 p-4">
            <summary className="cursor-pointer font-medium text-heading">
              {item.question}
            </summary>
            <p className="mt-2 text-sm text-text leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
