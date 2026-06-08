import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Route,
  ShieldCheck,
  Zap,
} from "lucide-react";

import Footer from "@/components/Footer";
import PublicHeader from "@/components/header/PublicHeader";

import {
  k2DirectAnswer,
  k2Exclusions,
  k2Faqs,
  k2GondogoroNotes,
  k2HeroCopy,
  k2Inclusions,
  k2InternalLinks,
  k2Itinerary,
  k2PartnerTypes,
  k2QuickFacts,
  k2RouteCoverage,
  k2SafetyPoints,
  k2Services,
  k2WhyLocalExecution,
} from "./k2BasecampContent";

function AnswerBlock({ children }: { children: string }) {
  return (
    <div className="rounded-[18px] border border-[#ffe0d7] bg-white px-[18px] py-[18px] shadow-[0_2px_9px_rgba(20,24,36,0.04)] md:px-6 md:py-5">
      <p className="text-[15px] font-medium leading-[1.55] text-[#596173] md:text-[16px]">
        {children}
      </p>
    </div>
  );
}

function SectionHeading({
  label,
  title,
  body,
}: {
  label?: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mx-auto max-w-[780px] text-center">
      {label ? (
        <p className="text-[14px] font-black uppercase text-[#ff3b0a]">{label}</p>
      ) : null}
      <h2 className="mx-auto mt-[14px] max-w-[760px] text-[30px] font-black leading-[1.08] text-[#2d2f49] md:text-[44px]">
        {title}
      </h2>
      {body ? (
        <p className="mx-auto mt-5 max-w-[680px] text-[15.5px] font-medium leading-[1.5] text-[#596173] md:text-[18px]">
          {body}
        </p>
      ) : null}
    </div>
  );
}

export default function K2BaseCampDmcPage() {
  return (
    <main className="min-h-screen scroll-smooth bg-[#fffaf8] font-[Outfit,Inter,sans-serif] text-[#2d2f49]">
      <div className="min-h-screen w-full overflow-x-hidden bg-[#fffaf8]">
        <PublicHeader variant="dmc" hideAuthCta>
          <a
            href="#urgent-enquiry"
            className="hidden h-11 items-center justify-center rounded-full bg-[#ff3b0a] px-5 text-[14px] font-black text-white md:flex"
          >
            Request Plan
          </a>
        </PublicHeader>

        <section
          id="hero"
          className="mx-auto w-full max-w-6xl scroll-mt-20 md:grid md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-8 md:px-8 md:py-10 lg:gap-12 xl:px-10"
        >
          <div className="relative h-[232px] w-full overflow-hidden bg-[#2f3143] grayscale md:order-2 md:h-auto md:aspect-[780/500] md:min-h-0 md:rounded-[28px]">
            <Image
              src="/communityimage14.jpg"
              alt="4x4 ground transport for Northern Pakistan expedition logistics"
              fill
              priority
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 44vw, 520px"
              className="object-cover object-center opacity-75"
            />
            <div className="absolute inset-0 bg-[#151625]/30" />
          </div>

          <div className="relative px-[21px] pb-12 pt-[24px] md:order-1 md:flex md:min-h-[650px] md:flex-col md:justify-center md:px-0 md:py-0">
            <div className="pointer-events-none absolute right-[-70px] top-[260px] h-[280px] w-[280px] rounded-full bg-[#ff3b0a]/10 blur-3xl md:left-[40%] md:right-auto md:top-[68%]" />

            <nav aria-label="Breadcrumb" className="mb-[19px] text-[13px] font-bold text-[#747b8c]">
              <Link href="/" className="text-[#2d2f49] underline decoration-[#ff3b0a]/30 underline-offset-4">
                Home
              </Link>
              <span className="px-2 text-[#a0a5b0]">/</span>
              <Link href="/pakistan-dmc" className="text-[#2d2f49] underline decoration-[#ff3b0a]/30 underline-offset-4">
                Pakistan DMC
              </Link>
              <span className="px-2 text-[#a0a5b0]">/</span>
              <span>K2 Base Camp</span>
            </nav>

            <h1 className="max-w-[455px] text-[39px] font-black leading-[1.16] text-[#2d2f49] md:max-w-none md:text-[54px] md:leading-[1.04] lg:text-[60px]">
              K2 Base Camp DMC for <span className="text-[#ff3b0a]">Expedition Logistics in Pakistan</span>
            </h1>

            <p className="mt-[25px] max-w-[440px] text-[20px] font-medium leading-[1.5] text-[#596173] md:max-w-[620px] md:text-[23px]">
              {k2HeroCopy}
            </p>

            <div className="mt-[25px]">
              <AnswerBlock>
                3Musafir coordinates hotels, transport, permits, guides, porters, meals, equipment
                support, and on-ground logistics for B2B partners planning K2 Base Camp expedition
                programs in Pakistan.
              </AnswerBlock>
            </div>

            <div className="mt-[20px] flex flex-wrap gap-2 text-[13px] font-extrabold">
              {k2InternalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-[#ece8e5] bg-white px-3 py-2 text-[#2d2f49]"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-[34px] grid gap-[12px] md:grid-cols-2">
              {k2QuickFacts.slice(0, 4).map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-[16px] border border-[#ece8e5] bg-white px-[18px] py-[15px] shadow-[0_3px_10px_rgba(29,31,50,0.05)]"
                >
                  <p className="text-[12px] font-black uppercase text-[#ff3b0a]">{fact.label}</p>
                  <p className="mt-[5px] text-[15px] font-extrabold leading-[1.25] text-[#2d2f49]">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-[44px] space-y-[22px] md:flex md:max-w-[640px] md:gap-4 md:space-y-0">
              <a
                href="#partner"
                className="flex h-[72px] w-full items-center justify-center rounded-[19px] bg-[#ff3b0a] text-[20px] font-extrabold text-white shadow-[0_13px_25px_rgba(255,59,10,0.22)] md:h-[62px] md:flex-1"
              >
                Partner with 3Musafir
              </a>
              <a
                href="#urgent-enquiry"
                className="flex h-[70px] w-full items-center justify-center rounded-[18px] border border-[#ebedf0] bg-white px-4 text-center text-[18px] font-extrabold text-[#2d2f49] shadow-[0_2px_8px_rgba(20,24,36,0.04)] md:h-[62px] md:flex-1 md:text-[16px]"
              >
                Request K2 Base Camp Ground Handling Plan
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-10">
          <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <p className="text-[14px] font-black uppercase text-[#ff3b0a]">Direct answer</p>
              <h2 className="mt-[14px] text-[32px] font-black leading-[1.12] text-[#2d2f49] md:text-[44px]">
                What does a K2 Base Camp DMC do?
              </h2>
            </div>
            <AnswerBlock>{k2DirectAnswer}</AnswerBlock>
          </div>
        </section>

        <section className="bg-[#fffaf8] px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-10">
          <SectionHeading
            label="Why local execution matters"
            title="Why K2 Base Camp needs a serious local DMC"
            body="K2 Base Camp is not a simple sightseeing route. It is a high-altitude expedition-style trek where local operations affect safety, timing, comfort, and commercial reliability."
          />

          <div className="mt-[38px] grid gap-[14px] md:grid-cols-2 lg:grid-cols-3">
            {k2WhyLocalExecution.map((item) => (
              <article
                key={item}
                className="rounded-[18px] border border-[#ebe9e7] bg-white px-[20px] py-[20px] shadow-[0_2px_8px_rgba(20,24,36,0.04)]"
              >
                <CheckCircle2 size={24} strokeWidth={2.5} className="text-[#ff3b0a]" />
                <p className="mt-[12px] text-[15px] font-medium leading-[1.45] text-[#596173]">
                  {item}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="services"
          className="scroll-mt-[100px] bg-white px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-10"
        >
          <SectionHeading
            label="Expedition support"
            title="K2 Base Camp expedition support services"
            body="A practical operating scope for foreign agencies, K2 Base Camp tour operators, and adventure DMC partners that need reliable K2 Base Camp logistics in Pakistan."
          />

          <div className="mt-[42px] grid gap-[14px] md:grid-cols-2 lg:grid-cols-3">
            {k2Services.map((service) => (
              <article
                key={service.title}
                className="rounded-[18px] border border-[#ebe9e7] bg-[#fffdfc] px-[20px] py-[20px] shadow-[0_2px_8px_rgba(20,24,36,0.04)]"
              >
                <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#fff1eb] text-[#ff3b0a]">
                  <ClipboardCheck size={22} strokeWidth={2.6} />
                </div>
                <h3 className="mt-[16px] text-[18px] font-black leading-tight text-[#2d2f49]">
                  {service.title}
                </h3>
                <p className="mt-[9px] text-[14px] font-medium leading-[1.45] text-[#596173]">
                  {service.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#fffaf8] px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-10">
          <SectionHeading
            label="Route coverage"
            title="Operational route coverage"
            body="3Musafir coordinates the ground chain from city arrival to mountain field operations, with routing shaped by permits, weather, roads, flights, guide assessment, and agency requirements."
          />

          <div className="mt-[38px] grid gap-[14px] md:grid-cols-2 lg:grid-cols-3">
            {k2RouteCoverage.map((item) => (
              <article
                key={item.title}
                className="rounded-[18px] border border-[#ebe9e7] bg-white px-[20px] py-[20px] shadow-[0_2px_8px_rgba(20,24,36,0.04)]"
              >
                <Route size={24} strokeWidth={2.5} className="text-[#ff3b0a]" />
                <h3 className="mt-[14px] text-[18px] font-black leading-tight text-[#2d2f49]">
                  {item.title}
                </h3>
                <p className="mt-[9px] text-[14px] font-medium leading-[1.45] text-[#596173]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-10">
          <SectionHeading
            label="Sample itinerary"
            title="Sample K2 Base Camp expedition itinerary"
            body="This is a sample 21-day agency itinerary. Final routing depends on season, permits, weather, flight operations, road conditions, client profile, guide assessment, and agency requirements. Buffer days are strongly recommended."
          />

          <div className="mx-auto mt-[42px] max-w-[980px] space-y-[12px]">
            {k2Itinerary.map((item) => (
              <article
                key={`${item.day}-${item.title}`}
                className="grid gap-3 rounded-[18px] border border-[#ebe9e7] bg-[#fffdfc] px-[18px] py-[18px] shadow-[0_2px_8px_rgba(20,24,36,0.04)] md:grid-cols-[120px_1fr]"
              >
                <div className="text-[13px] font-black uppercase text-[#ff3b0a]">{item.day}</div>
                <div>
                  <h3 className="text-[18px] font-black leading-tight text-[#2d2f49]">
                    {item.title}
                  </h3>
                  <p className="mt-[8px] text-[14px] font-medium leading-[1.45] text-[#596173]">
                    {item.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#2d2f49] px-3 py-20 text-white md:px-8 md:py-24 lg:px-12 xl:px-10">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <p className="text-[14px] font-black uppercase text-[#ff3b0a]">Optional extension</p>
              <h2 className="mt-[14px] text-[32px] font-black leading-[1.12] text-white md:text-[44px]">
                Gondogoro La must stay conditional
              </h2>
              <p className="mt-[18px] text-[16px] font-medium leading-[1.55] text-[#c5c8d3]">
                Gondogoro La can be scoped as an optional crossing, but it should never be sold as a
                guaranteed outcome.
              </p>
            </div>

            <div className="space-y-[12px]">
              {k2GondogoroNotes.map((item) => (
                <div key={item} className="rounded-[16px] bg-[#1e2533] px-[18px] py-[16px]">
                  <p className="text-[14px] font-medium leading-[1.5] text-[#d7d9e2]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-10">
          <SectionHeading
            label="Operating scope"
            title="Typical inclusions and exclusions"
            body="The final proposal should be confirmed against the agency brief, group size, route, dates, service level, and risk profile. These points are a practical scope guide, not an unconditional promise."
          />

          <div className="mt-[42px] grid gap-[18px] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-[14px] md:grid-cols-2">
              {k2Inclusions.map((group) => (
                <article
                  key={group.title}
                  className="rounded-[18px] border border-[#ebe9e7] bg-[#fffdfc] px-[20px] py-[20px] shadow-[0_2px_8px_rgba(20,24,36,0.04)]"
                >
                  <h3 className="text-[18px] font-black leading-tight text-[#2d2f49]">
                    {group.title}
                  </h3>
                  <ul className="mt-[13px] space-y-[10px]">
                    {group.items.map((item) => (
                      <li key={item} className="flex gap-[10px] text-[14px] font-medium leading-[1.4] text-[#596173]">
                        <Check size={17} strokeWidth={3} className="mt-[2px] shrink-0 text-[#ff3b0a]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <article className="rounded-[18px] border border-[#ffd9cf] bg-[#fff4f0] px-[20px] py-[20px]">
              <h3 className="text-[20px] font-black leading-tight text-[#2d2f49]">
                Common exclusions and risk costs
              </h3>
              <ul className="mt-[15px] space-y-[11px]">
                {k2Exclusions.map((item) => (
                  <li key={item} className="flex gap-[10px] text-[14px] font-medium leading-[1.42] text-[#596173]">
                    <ShieldCheck size={17} strokeWidth={2.7} className="mt-[2px] shrink-0 text-[#ff3b0a]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="bg-[#fffaf8] px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-10">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <p className="text-[14px] font-black uppercase text-[#ff3b0a]">International partners</p>
              <h2 className="mt-[14px] text-[32px] font-black leading-[1.12] text-[#2d2f49] md:text-[44px]">
                Built for international partners
              </h2>
              <p className="mt-[18px] text-[16px] font-medium leading-[1.55] text-[#596173] md:text-[18px]">
                This page is for B2B partners that need a Pakistan inbound adventure operator, not a
                generic consumer tour listing.
              </p>
              <p className="mt-[14px] text-[15px] font-medium leading-[1.55] text-[#596173] md:text-[16px]">
                3Musafir can support as a K2 Base Camp ground operator, trekking DMC in Pakistan, or
                local adventure DMC partner for agencies that own the client relationship and need
                field execution handled in Pakistan.
              </p>
            </div>

            <div className="grid gap-[12px] md:grid-cols-2">
              {k2PartnerTypes.map((item) => (
                <div
                  key={item}
                  className="rounded-[16px] border border-[#ebe9e7] bg-white px-[18px] py-[16px] shadow-[0_2px_8px_rgba(20,24,36,0.04)]"
                >
                  <p className="text-[15px] font-extrabold leading-[1.35] text-[#2d2f49]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-10">
          <SectionHeading
            label="Safety-aware execution"
            title="Safety-aware field execution"
            body="3Musafir plans K2 Base Camp programs with conservative language, realistic pacing, and clear escalation expectations. We do not present weather, altitude, or field outcomes as guaranteed."
          />

          <div className="mt-[38px] grid gap-[14px] md:grid-cols-2 lg:grid-cols-3">
            {k2SafetyPoints.map((item) => (
              <article
                key={item}
                className="rounded-[18px] border border-[#ebe9e7] bg-[#fffdfc] px-[20px] py-[20px] shadow-[0_2px_8px_rgba(20,24,36,0.04)]"
              >
                <BadgeCheck size={24} strokeWidth={2.5} className="text-[#ff3b0a]" />
                <p className="mt-[12px] text-[15px] font-medium leading-[1.45] text-[#596173]">
                  {item}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="faqs"
          className="scroll-mt-[100px] bg-[#2d2f49] px-3 pb-[48px] pt-[75px] text-white md:px-8 md:py-24 lg:px-12 xl:px-10"
        >
          <h2 className="mx-auto max-w-[720px] text-center text-[35px] font-black leading-[1.05] text-white md:text-[48px]">
            K2 Base Camp DMC FAQs
          </h2>
          <p className="mx-auto mt-[27px] max-w-[620px] text-center text-[17px] font-medium leading-[1.55] text-[#b9bdca] md:text-[18px]">
            Practical answers for agencies evaluating K2 Base Camp logistics, permits, transport,
            trekking staff, route changes, and field execution in Pakistan.
          </p>

          <div className="mt-[63px] space-y-[15px] md:mx-auto md:grid md:max-w-[960px] md:grid-cols-2 md:items-start md:gap-4 md:space-y-0">
            {k2Faqs.map((faq) => (
              <details key={faq.question} className="group rounded-[12px] bg-[#1e2533] px-[23px] py-[25px]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-black leading-[1.55] [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span className="text-[#ff3b0a] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[14px] font-medium leading-[1.5] text-[#b9bdca]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section
          id="partner"
          className="scroll-mt-[100px] bg-white px-[15px] pb-[24px] pt-[42px] md:px-8 md:py-20 lg:px-12 xl:px-10"
        >
          <div className="rounded-[20px] border border-[#ebe9e7] bg-[#f8f8fa] px-[31px] pb-[25px] pt-[32px] shadow-[0_1px_4px_rgba(20,24,36,0.03)] md:px-8 md:py-8">
            <h2 className="text-[24px] font-black leading-tight text-[#2d2f49] md:text-[34px]">
              Partner with 3Musafir for K2 Base Camp
            </h2>
            <p className="mt-[17px] max-w-[720px] text-[13.5px] font-medium leading-[1.45] text-[#596173] md:text-[16px]">
              Share your agency brief and we will scope the local execution model, route assumptions,
              buffer logic, inclusions, exclusions, and ground handling requirements.
            </p>

            <a
              href="https://wa.me/923221848940?text=Hi%203Musafir%2C%20I%20want%20to%20partner%20for%20K2%20Base%20Camp%20DMC%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[23px] flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#2d2f49] px-5 text-[15px] font-black text-white shadow-[0_8px_18px_rgba(20,24,36,0.12)] md:max-w-[300px]"
            >
              Chat on WhatsApp
            </a>
          </div>
        </section>

        <section
          id="urgent-enquiry"
          className="scroll-mt-[100px] bg-white px-[17px] pb-[37px] pt-[4px] md:px-8 md:pb-24 lg:px-12 xl:px-10"
        >
          <div className="rounded-[20px] border border-[#ffc9bb] bg-[#fff4f0] px-[31px] pb-[30px] pt-[27px] md:grid md:grid-cols-[0.8fr_1.2fr] md:gap-8 md:px-8 md:py-8 lg:gap-12">
            <div>
              <div className="flex items-center gap-[13px]">
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#ff3b0a] text-white">
                  <Zap size={21} fill="white" strokeWidth={2.5} />
                </div>
                <h2 className="text-[25px] font-black leading-[1.25] text-[#2d2f49] md:text-[36px]">
                  Request K2 Ground
                  <br />
                  Handling Plan
                </h2>
              </div>

              <p className="mt-[31px] text-[15.5px] font-medium leading-[1.5] text-[#596173] md:text-[17px]">
                Use this form for agency groups, private expedition groups, and adventure operators
                that need K2 Base Camp logistics in Pakistan.
              </p>
            </div>

            <div className="mt-[28px] md:mt-0 md:flex md:items-center">
              <a
                href="https://wa.me/923221848940?text=Hi%203Musafir%2C%20I%20need%20a%20K2%20Base%20Camp%20ground%20handling%20plan%20for%20an%20agency%20group."
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[57px] w-full items-center justify-center rounded-[14px] bg-[#ff3b0a] px-5 text-center text-[17px] font-black text-white shadow-[0_13px_22px_rgba(255,59,10,0.22)] md:max-w-[360px]"
              >
                Request Plan on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <Footer />

        <div className="fixed bottom-0 left-1/2 z-[60] flex w-full max-w-6xl -translate-x-1/2 gap-3 bg-white/95 px-3 pb-[14px] pt-[15px] backdrop-blur lg:hidden">
          <a
            href="#partner"
            className="flex h-[39px] flex-1 items-center justify-center rounded-[9px] bg-[#f2f3f5] text-[12px] font-extrabold text-[#2d2f49]"
          >
            Partner
          </a>
          <a
            href="#urgent-enquiry"
            className="flex h-[39px] flex-1 items-center justify-center rounded-[9px] bg-[#ff3b0a] text-[12px] font-extrabold text-white shadow-[0_9px_18px_rgba(255,59,10,0.25)]"
          >
            Request Plan
          </a>
        </div>
      </div>
    </main>
  );
}
