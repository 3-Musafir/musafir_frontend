import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  ClipboardCheck,
  MapPin,
  Route,
  Zap,
} from "lucide-react";

import {
  hunzaAddOns,
  hunzaDetailedItinerary,
  hunzaDirectAnswer,
  hunzaExclusions,
  hunzaFaqs,
  hunzaHeroCopy,
  hunzaIdealFor,
  hunzaImportantNotes,
  hunzaInclusions,
  hunzaInternalLinks,
  hunzaOpening,
  hunzaQuickFacts,
  hunzaSummaryItinerary,
} from "./hunzaDmcContent";

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
        <p className="mx-auto mt-5 max-w-[700px] text-[15.5px] font-medium leading-[1.5] text-[#596173] md:text-[18px]">
          {body}
        </p>
      ) : null}
    </div>
  );
}

export default function HunzaDmcPage() {
  return (
    <main className="min-h-screen scroll-smooth bg-[#fffaf8] font-[Outfit,Inter,sans-serif] text-[#2d2f49]">
      <div className="mx-auto min-h-screen w-full max-w-[500px] overflow-hidden bg-[#fffaf8] md:max-w-none">
        <header className="sticky top-0 z-50 flex h-[100px] items-center justify-between bg-white px-[22px] md:h-[92px] md:px-8 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <Link href="/pakistan-dmc" className="flex min-w-0 items-center gap-3">
            <Image
              src="/3mlogosmall.svg"
              alt="3Musafir Travels logo"
              width={42}
              height={42}
              priority
              className="h-[38px] w-[42px] shrink-0 object-contain"
            />
            <span className="text-[25px] font-extrabold leading-none text-[#2d2f49]">
              3 Musafir Travels
            </span>
          </Link>

          <a
            href="#urgent-enquiry"
            className="hidden h-11 items-center justify-center rounded-full bg-[#ff3b0a] px-5 text-[14px] font-black text-white md:flex"
          >
            Request Itinerary
          </a>
        </header>

        <section
          id="hero"
          className="scroll-mt-[100px] md:grid md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-8 md:px-8 md:py-10 lg:gap-12 lg:px-12 xl:px-[calc((100vw-1180px)/2)]"
        >
          <div className="relative h-[232px] w-full overflow-hidden bg-[#2f3143] grayscale md:order-2 md:h-auto md:aspect-[780/500] md:min-h-0 md:rounded-[28px]">
            <Image
              src="/communityimage14.jpg"
              alt="4x4 road logistics for Hunza and Northern Pakistan group tours"
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
              <span>Hunza</span>
            </nav>

            <h1 className="max-w-[455px] text-[39px] font-black leading-[1.16] text-[#2d2f49] md:max-w-none md:text-[54px] md:leading-[1.04] lg:text-[64px]">
              Hunza DMC for <span className="text-[#ff3b0a]">10-Day Northern Pakistan Group Tours</span>
            </h1>

            <p className="mt-[25px] max-w-[440px] text-[20px] font-medium leading-[1.5] text-[#596173] md:max-w-[620px] md:text-[23px]">
              {hunzaHeroCopy}
            </p>

            <div className="mt-[25px]">
              <AnswerBlock>{hunzaDirectAnswer}</AnswerBlock>
            </div>

            <div className="mt-[20px] flex flex-wrap gap-2 text-[13px] font-extrabold">
              {hunzaInternalLinks.map((link) => (
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
              {hunzaQuickFacts.map((fact) => (
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
                Request Hunza Itinerary
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-start">
            <div>
              <p className="text-[14px] font-black uppercase text-[#ff3b0a]">Direct answer</p>
              <h2 className="mt-[14px] text-[32px] font-black leading-[1.12] text-[#2d2f49] md:text-[44px]">
                10-Day Hunza Valley DMC Itinerary for Foreign Travel Agencies
              </h2>
            </div>
            <AnswerBlock>{hunzaOpening}</AnswerBlock>
          </div>
        </section>

        <section className="bg-[#fffaf8] px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <SectionHeading
            label="Route and buyer fit"
            title="Built for Northern Pakistan group programs"
            body="This itinerary balances scenic road journeys, soft adventure, local culture, comfort, safety-aware planning, and operational flexibility."
          />

          <div className="mt-[38px] grid gap-[14px] md:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-[18px] border border-[#ebe9e7] bg-white px-[20px] py-[20px] shadow-[0_2px_8px_rgba(20,24,36,0.04)]">
              <Route size={24} strokeWidth={2.5} className="text-[#ff3b0a]" />
              <h3 className="mt-[14px] text-[20px] font-black leading-tight text-[#2d2f49]">Operating route</h3>
              <p className="mt-[9px] text-[15px] font-medium leading-[1.55] text-[#596173]">
                Islamabad to Chilas, Hunza Valley, Passu/Gojal, Khunjerab Border, Karimabad,
                Hopper/Nagar, Chilas, and Islamabad.
              </p>
            </article>

            <div className="flex snap-x gap-[14px] overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:snap-none md:grid-cols-3 md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
              {hunzaIdealFor.map((item) => (
                <article
                  key={item}
                  className="min-w-[190px] snap-start rounded-[16px] border border-[#ebe9e7] bg-white px-[18px] py-[16px] shadow-[0_2px_8px_rgba(20,24,36,0.04)] md:min-w-0"
                >
                  <p className="text-[14px] font-extrabold leading-[1.35] text-[#2d2f49]">{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="itinerary"
          className="scroll-mt-[100px] bg-white px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]"
        >
          <SectionHeading
            label="Summary itinerary"
            title="10-day Hunza Valley DMC itinerary"
            body="A practical agency-ready route from Islamabad into Hunza and back, with room for seasonal route changes and a recommended Islamabad buffer for international groups."
          />

          <div className="mt-[42px] flex snap-x gap-[14px] overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-5 [&::-webkit-scrollbar]:hidden">
            {hunzaSummaryItinerary.map((item) => (
              <article
                key={`${item.day}-${item.route}`}
                className="min-w-[240px] snap-start rounded-[18px] border border-[#ebe9e7] bg-[#fffdfc] px-[18px] py-[18px] shadow-[0_2px_8px_rgba(20,24,36,0.04)] md:min-w-0"
              >
                <p className="text-[12px] font-black uppercase text-[#ff3b0a]">{item.day}</p>
                <h3 className="mt-[8px] text-[18px] font-black leading-tight text-[#2d2f49]">
                  {item.route}
                </h3>
                <p className="mt-[9px] text-[14px] font-medium leading-[1.45] text-[#596173]">
                  {item.focus}
                </p>
                <p className="mt-[12px] text-[12.5px] font-extrabold leading-[1.35] text-[#2d2f49]">
                  {item.stay}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#fffaf8] px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <SectionHeading
            label="Detailed itinerary"
            title="Day-by-day Hunza group tour execution"
            body="Written for foreign agencies that need clarity on experience flow, route assumptions, highlights, hotels, and operating notes."
          />

          <div className="mx-auto mt-[42px] max-w-[980px] space-y-[12px]">
            {hunzaDetailedItinerary.map((item) => (
              <article
                key={`${item.day}-${item.title}`}
                className="rounded-[18px] border border-[#ebe9e7] bg-white px-[18px] py-[18px] shadow-[0_2px_8px_rgba(20,24,36,0.04)] md:grid md:grid-cols-[120px_1fr] md:gap-4"
              >
                <div className="text-[13px] font-black uppercase text-[#ff3b0a]">{item.day}</div>
                <div>
                  <h3 className="text-[18px] font-black leading-tight text-[#2d2f49]">
                    {item.title}
                  </h3>
                  <p className="mt-[8px] text-[14px] font-medium leading-[1.5] text-[#596173]">
                    {item.body}
                  </p>

                  <div className="mt-[15px] grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-[12px] font-black uppercase text-[#2d2f49]">Experience highlights</p>
                      <ul className="mt-[8px] space-y-[7px]">
                        {item.highlights.map((highlight) => (
                          <li key={highlight} className="flex gap-[8px] text-[13px] font-medium leading-[1.4] text-[#596173]">
                            <CheckCircle2 size={15} strokeWidth={2.5} className="mt-[1px] shrink-0 text-[#ff3b0a]" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[12px] font-black uppercase text-[#2d2f49]">Operational notes</p>
                      <ul className="mt-[8px] space-y-[7px]">
                        {item.notes.map((note) => (
                          <li key={note} className="flex gap-[8px] text-[13px] font-medium leading-[1.4] text-[#596173]">
                            <ClipboardCheck size={15} strokeWidth={2.5} className="mt-[1px] shrink-0 text-[#ff3b0a]" />
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <p className="mt-[14px] text-[13px] font-extrabold leading-[1.4] text-[#2d2f49]">
                    {item.overnight}
                    {item.drive ? ` | ${item.drive}` : ""}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <SectionHeading
            label="Optional upgrades"
            title="Recommended add-on experiences"
            body="These can be scoped as optional upgrades depending on agency positioning, group size, dates, venue permissions, and traveler profile."
          />

          <div className="mt-[42px] grid gap-[14px] md:grid-cols-3">
            {hunzaAddOns.map((group) => (
              <article
                key={group.title}
                className="rounded-[18px] border border-[#ebe9e7] bg-[#fffdfc] px-[20px] py-[20px] shadow-[0_2px_8px_rgba(20,24,36,0.04)]"
              >
                <MapPin size={24} strokeWidth={2.5} className="text-[#ff3b0a]" />
                <h3 className="mt-[14px] text-[18px] font-black leading-tight text-[#2d2f49]">
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
        </section>

        <section className="bg-[#fffaf8] px-3 py-20 md:px-8 md:py-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <SectionHeading
            label="Operating scope"
            title="Services included and not included"
            body="Final inclusions should be confirmed against the agency brief, group size, season, rooming, transport type, hotel availability, and service level."
          />

          <div className="mt-[42px] grid gap-[18px] lg:grid-cols-[1fr_0.8fr]">
            <article className="rounded-[18px] border border-[#ebe9e7] bg-white px-[20px] py-[20px] shadow-[0_2px_8px_rgba(20,24,36,0.04)]">
              <h3 className="text-[20px] font-black leading-tight text-[#2d2f49]">Services included</h3>
              <ul className="mt-[15px] grid gap-[10px] md:grid-cols-2">
                {hunzaInclusions.map((item) => (
                  <li key={item} className="flex gap-[10px] text-[14px] font-medium leading-[1.42] text-[#596173]">
                    <Check size={17} strokeWidth={3} className="mt-[2px] shrink-0 text-[#ff3b0a]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-[18px] border border-[#ffd9cf] bg-[#fff4f0] px-[20px] py-[20px]">
              <h3 className="text-[20px] font-black leading-tight text-[#2d2f49]">Services not included</h3>
              <ul className="mt-[15px] space-y-[11px]">
                {hunzaExclusions.map((item) => (
                  <li key={item} className="flex gap-[10px] text-[14px] font-medium leading-[1.42] text-[#596173]">
                    <BadgeCheck size={17} strokeWidth={2.7} className="mt-[2px] shrink-0 text-[#ff3b0a]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="mt-[18px] grid gap-[12px] md:grid-cols-2 lg:grid-cols-3">
            {hunzaImportantNotes.map((note) => (
              <div key={note} className="rounded-[16px] border border-[#ebe9e7] bg-white px-[18px] py-[16px]">
                <p className="text-[14px] font-medium leading-[1.5] text-[#596173]">{note}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="faqs"
          className="scroll-mt-[100px] bg-[#2d2f49] px-3 pb-[48px] pt-[75px] text-white md:px-8 md:py-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]"
        >
          <h2 className="mx-auto max-w-[720px] text-center text-[35px] font-black leading-[1.05] text-white md:text-[48px]">
            Hunza DMC FAQs
          </h2>
          <p className="mx-auto mt-[27px] max-w-[620px] text-center text-[17px] font-medium leading-[1.55] text-[#b9bdca] md:text-[18px]">
            Practical answers for agencies evaluating Hunza Valley group tours, Northern Pakistan
            logistics, cultural experiences, road movement, and local DMC execution.
          </p>

          <div className="mt-[63px] space-y-[15px] md:mx-auto md:grid md:max-w-[960px] md:grid-cols-2 md:items-start md:gap-4 md:space-y-0">
            {hunzaFaqs.map((faq) => (
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
          className="scroll-mt-[100px] bg-white px-[15px] pb-[24px] pt-[42px] md:px-8 md:py-20 lg:px-12 xl:px-[calc((100vw-1180px)/2)]"
        >
          <div className="rounded-[20px] border border-[#ebe9e7] bg-[#f8f8fa] px-[31px] pb-[25px] pt-[32px] shadow-[0_1px_4px_rgba(20,24,36,0.03)] md:px-8 md:py-8">
            <h2 className="text-[24px] font-black leading-tight text-[#2d2f49] md:text-[34px]">
              Partner with 3Musafir for Hunza
            </h2>
            <p className="mt-[17px] max-w-[720px] text-[13.5px] font-medium leading-[1.45] text-[#596173] md:text-[16px]">
              Share your agency brief and we will scope the route, hotel assumptions, transport,
              local experiences, inclusions, exclusions, and Hunza ground handling requirements.
            </p>

            <a
              href="https://wa.me/923221848940?text=Hi%203Musafir%2C%20I%20want%20to%20partner%20for%20Hunza%20DMC%20services."
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
          className="scroll-mt-[100px] bg-white px-[17px] pb-[37px] pt-[4px] md:px-8 md:pb-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]"
        >
          <div className="rounded-[20px] border border-[#ffc9bb] bg-[#fff4f0] px-[31px] pb-[30px] pt-[27px] md:grid md:grid-cols-[0.8fr_1.2fr] md:gap-8 md:px-8 md:py-8 lg:gap-12">
            <div>
              <div className="flex items-center gap-[13px]">
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#ff3b0a] text-white">
                  <Zap size={21} fill="white" strokeWidth={2.5} />
                </div>
                <h2 className="text-[25px] font-black leading-[1.25] text-[#2d2f49] md:text-[36px]">
                  Request Hunza
                  <br />
                  DMC Itinerary
                </h2>
              </div>

              <p className="mt-[31px] text-[15.5px] font-medium leading-[1.5] text-[#596173] md:text-[17px]">
                Use this contact path for agency groups, cultural travel companies, corporate
                retreats, and private groups that need Hunza logistics in Pakistan.
              </p>
            </div>

            <div className="mt-[28px] md:mt-0 md:flex md:items-center">
              <a
                href="https://wa.me/923221848940?text=Hi%203Musafir%2C%20I%20need%20a%2010-day%20Hunza%20DMC%20itinerary%20for%20an%20agency%20group."
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[57px] w-full items-center justify-center rounded-[14px] bg-[#ff3b0a] px-5 text-center text-[17px] font-black text-white shadow-[0_13px_22px_rgba(255,59,10,0.22)] md:max-w-[360px]"
              >
                Request Itinerary on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <footer className="bg-[#2d2f49] px-2 pb-[83px] pt-[24px] text-white md:px-8 md:py-16 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <div className="md:grid md:grid-cols-[1.1fr_0.9fr] md:gap-12">
            <div>
              <div className="flex items-center gap-[8px]">
                <Image
                  src="/3mlogosmall.svg"
                  alt="3Musafir Travels logo"
                  width={24}
                  height={24}
                  className="h-[24px] w-[24px] object-contain"
                />
                <strong className="text-[16px] font-black">3Musafir Travels</strong>
              </div>
              <p className="mt-[23px] max-w-[460px] text-[15.5px] font-medium leading-[1.55] text-[#b9bdca] md:text-[16px]">
                Pakistan-based DMC support for Hunza Valley group tours, cultural programs, and
                inbound agency groups that need local execution in Northern Pakistan.
              </p>
            </div>

            <div className="mt-[34px] grid grid-cols-2 gap-8 md:mt-0">
              <div>
                <h3 className="text-[15px] font-black">DMC</h3>
                <ul className="mt-[22px] space-y-[14px] text-[14px] font-medium text-[#b9bdca]">
                  <li>
                    <Link href="/pakistan-dmc">Pakistan DMC services</Link>
                  </li>
                  <li>
                    <Link href="/pakistan-dmc/tours/skardu">Skardu DMC services</Link>
                  </li>
                  <li>
                    <Link href="/pakistan-dmc/tours/chitral">Chitral DMC services</Link>
                  </li>
                  <li>
                    <Link href="/pakistan-dmc/tours/k2-basecamp-trek">K2 Base Camp logistics</Link>
                  </li>
                  <li>
                    <Link href="/reviews">3Musafir reviews</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-[15px] font-black">Route</h3>
                <ul className="mt-[22px] space-y-[14px] text-[14px] font-medium text-[#b9bdca]">
                  <li>
                    <a href="#itinerary">Hunza itinerary</a>
                  </li>
                  <li>
                    <a href="#urgent-enquiry">Request Hunza plan</a>
                  </li>
                  <li>
                    <Link href="/explore">Pakistan group tours</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-[46px] border-t border-white/5 px-[15px] pt-[32px] text-[13px] font-medium text-[#878b9d]">
            &copy; 2024 3Musafir Travels (Pvt) Ltd. All rights reserved.
          </div>
        </footer>

        <div className="fixed bottom-0 left-1/2 z-[60] flex w-full max-w-[500px] -translate-x-1/2 gap-3 bg-white/95 px-3 pb-[14px] pt-[15px] backdrop-blur lg:hidden">
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
