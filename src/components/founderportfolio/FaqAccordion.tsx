import { ChevronDown } from "lucide-react";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  title: string;
  items: FaqItem[];
};

export default function FaqAccordion({ title, items }: FaqAccordionProps) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-heading">{title}</h2>
      <div className="mt-4 divide-y divide-gray-200/70">
        {items.map((item) => (
          <details key={item.question} className="py-3">
            <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold text-brand-primary list-none [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </summary>
            <p className="mt-2 text-sm text-text leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
