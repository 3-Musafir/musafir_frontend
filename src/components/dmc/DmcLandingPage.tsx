"use client";

import Image from "next/image";
import {
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Download,
  Gavel,
  Headphones,
  Linkedin,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

import {
  agencyMarkets,
  advantageAnswer,
  advantagePoints,
  credentialCards,
  credentialsAnswer,
  dmcDestinations,
  dmcFaqs,
  dmcHeroSupport,
  dmcServiceCapabilities,
  heroAnswer,
  internationalAnswer,
  internalLinks,
  navItems,
  premiumIncludes,
  pricingAnswer,
  services,
  servicesAnswer,
  standardIncludes,
  stats,
  trustProofs,
} from "./dmcContent";

const iconMap = {
  gavel: Gavel,
  headphones: Headphones,
};

function AnswerBlock({ children }: { children: string }) {
  return (
    <div className="rounded-[18px] border border-[#ffe0d7] bg-white px-[18px] py-[18px] shadow-[0_2px_9px_rgba(20,24,36,0.04)] md:px-6 md:py-5">
      <p className="text-[15px] font-medium leading-[1.55] text-[#596173] md:text-[16px]">{children}</p>
    </div>
  );
}

function DmcNavMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-[#2d2f49]/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <nav
        aria-label="DMC page navigation"
        className="absolute right-4 top-4 w-[250px] rounded-[22px] bg-white p-4 shadow-2xl md:right-8 lg:right-12 xl:right-[calc((100vw-1180px)/2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[16px] font-black text-[#2d2f49]">Navigate</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-full p-2 text-[#2d2f49]"
          >
            <X size={22} strokeWidth={3} />
          </button>
        </div>

        <div className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="block rounded-[12px] px-3 py-3 text-[15px] font-extrabold text-[#2d2f49] hover:bg-[#fff1eb]"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default function DmcLandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen scroll-smooth bg-[#fffaf8] font-[Outfit,Inter,sans-serif] text-[#2d2f49]">
      <DmcNavMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="mx-auto min-h-screen w-full max-w-[500px] overflow-hidden bg-[#fffaf8] md:max-w-none">
        <header className="sticky top-0 z-50 flex h-[100px] items-center justify-between bg-white px-[22px] md:h-[92px] md:px-8 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <a href="#hero" className="flex min-w-0 items-center gap-3">
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
          </a>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#2d2f49]"
          >
            <Menu size={30} strokeWidth={3} />
          </button>
        </header>

        <section id="hero" className="scroll-mt-[100px] md:grid md:grid-cols-[0.92fr_1.08fr] md:items-center md:gap-8 md:px-8 md:py-10 lg:gap-12 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <div className="relative h-[212px] w-full overflow-hidden bg-[#2f3143] grayscale md:order-2 md:h-auto md:aspect-[780/454] md:min-h-0 md:rounded-[28px]">
            <Image
              src="/3musafir-founders.jpg"
              alt="3Musafir team for Pakistan destination management services"
              fill
              priority
              sizes="(max-width: 767px) 100vw, (max-width: 1279px) 44vw, 520px"
              className="object-cover object-center opacity-70"
            />
            <div className="absolute inset-0 bg-[#151625]/25" />
          </div>

          <div className="relative px-[21px] pb-12 pt-[24px] md:order-1 md:flex md:min-h-[650px] md:flex-col md:justify-center md:px-0 md:py-0">
            <div className="pointer-events-none absolute right-[-70px] top-[230px] h-[280px] w-[280px] rounded-full bg-[#ff3b0a]/10 blur-3xl md:left-[40%] md:right-auto md:top-[68%]" />

            <nav aria-label="Breadcrumb" className="mb-[19px] text-[13px] font-bold text-[#747b8c]">
              <a href="/" className="text-[#2d2f49] underline decoration-[#ff3b0a]/30 underline-offset-4">
                Home
              </a>
              <span className="px-2 text-[#a0a5b0]">/</span>
              <span>Pakistan DMC</span>
            </nav>

            <h1 className="max-w-[455px] text-[40px] font-black leading-[1.18] text-[#2d2f49] md:max-w-none md:text-[54px] md:leading-[1.04] lg:text-[64px]">
              Pakistan DMC for <span className="text-[#ff3b0a]">International Travel Agencies</span>
            </h1>

            <p className="mt-[25px] max-w-[440px] text-[21px] font-medium leading-[1.5] text-[#596173] md:max-w-[620px] md:text-[23px]">
              {dmcHeroSupport}
            </p>

            <div className="mt-[25px]">
              <AnswerBlock>{heroAnswer}</AnswerBlock>
            </div>

            <div className="mt-[20px] flex flex-wrap gap-2 text-[13px] font-extrabold">
              {internalLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-[#ece8e5] bg-white px-3 py-2 text-[#2d2f49]"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-[34px] flex min-h-[73px] w-full max-w-[378px] items-center gap-4 rounded-[16px] border border-[#ece8e5] bg-white px-[23px] shadow-[0_3px_10px_rgba(29,31,50,0.06)]">
              <BadgeCheck size={25} strokeWidth={2.7} className="shrink-0 text-[#ff3b0a]" />
              <p className="text-[18px] font-extrabold leading-[1.25] text-[#2d2f49]">
                NIC and Aga Khan Foundation
                <br />
                backed company
              </p>
            </div>

            <div className="mt-[44px] space-y-[22px] md:flex md:max-w-[620px] md:gap-4 md:space-y-0">
              <a
                href="#urgent-enquiry"
                className="flex h-[72px] w-full items-center justify-center rounded-[19px] bg-[#ff3b0a] text-[20px] font-extrabold text-white shadow-[0_13px_25px_rgba(255,59,10,0.22)] md:h-[62px] md:flex-1"
              >
                Plan an inbound Pakistan group
              </a>

              <a
                href="#partner"
                className="flex h-[70px] w-full items-center justify-center gap-4 rounded-[18px] border border-[#ebedf0] bg-white text-[20px] font-extrabold text-[#2d2f49] shadow-[0_2px_8px_rgba(20,24,36,0.04)] md:h-[62px] md:flex-1 md:text-[18px]"
              >
                <Download size={25} strokeWidth={3} className="text-black" />
                Partner with 3Musafir
              </a>
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-[100px] bg-white px-3 pb-24 pt-12 md:px-8 md:py-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="mx-auto max-w-[620px] text-[29px] font-black leading-[1.08] text-[#2d2f49] md:text-[42px]">
              Comprehensive DMC Services in Pakistan
            </h2>
            <p className="mx-auto mt-5 max-w-[560px] text-[15px] font-medium leading-[1.45] text-[#596173] md:text-[17px]">
              Tailored solutions for every type of traveler and every type of agency brief.
            </p>
          </div>

          <div className="mx-1 mt-[28px] md:mx-auto md:max-w-[780px]">
            <AnswerBlock>{servicesAnswer}</AnswerBlock>
          </div>

          <div className="mx-1 mt-[22px] flex flex-wrap gap-2 md:mx-auto md:max-w-[900px] md:justify-center">
            {dmcServiceCapabilities.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#ebe9e7] bg-[#fffaf8] px-3 py-2 text-[12.5px] font-extrabold text-[#2d2f49]"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-[42px] flex snap-x gap-[22px] overflow-x-auto px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
            {services.map((service) => (
              <article
                key={service.title}
                className="min-w-[238px] snap-start overflow-hidden rounded-[13px] border border-[#ebe9e7] bg-[#fffdfc] shadow-[0_1px_4px_rgba(20,24,36,0.04)] md:min-w-0"
              >
                <div className="relative h-[171px] w-full overflow-hidden rounded-t-[13px] bg-[#f1eeeb] md:h-[220px]">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    sizes="(max-width: 767px) 238px, (max-width: 1279px) 30vw, 360px"
                    className="object-cover"
                  />
                </div>
                <div className="px-[18px] py-[22px] text-left">
                  <h3 className="text-[19px] font-black leading-tight text-[#2d2f49]">
                    {service.title}
                  </h3>
                  <p className="mt-[11px] text-[13.5px] font-medium leading-[1.45] text-[#596173]">
                    {service.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-[62px] grid grid-cols-2 gap-x-[15px] gap-y-[15px] px-0.5 md:grid-cols-3 md:gap-6 md:px-0">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex h-[103px] flex-col justify-center rounded-[18px] border border-[#eceef0] bg-white px-[20px] text-left shadow-[0_2px_8px_rgba(20,24,36,0.05)] md:h-[128px] md:px-7"
              >
                <strong
                  className={`text-[34px] font-black leading-none ${
                    stat.orange ? "text-[#ff3b0a]" : "text-[#2d2f49]"
                  }`}
                >
                  {stat.value}
                </strong>
                <span className="mt-[11px] text-[12.5px] font-bold leading-tight text-[#747b8c]">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section
          id="destinations"
          className="scroll-mt-[100px] bg-white px-3 pb-24 pt-12 md:px-8 md:py-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]"
        >
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[14px] font-black uppercase text-[#ff3b0a]">DMC destinations</p>
            <h2 className="mx-auto mt-[14px] max-w-[660px] text-[29px] font-black leading-[1.08] text-[#2d2f49] md:text-[42px]">
              Pakistan destinations for inbound groups and agency programs
            </h2>
            <p className="mx-auto mt-5 max-w-[640px] text-[15px] font-medium leading-[1.45] text-[#596173] md:text-[17px]">
              We plan around seasonality, road conditions, flight volatility, supplier availability,
              privacy needs, and guest profile before confirming any route.
            </p>
          </div>

          <div className="mt-[38px] flex snap-x gap-[14px] overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
            {dmcDestinations.map((item) => (
              <article
                key={item.title}
                className="min-w-[290px] snap-start rounded-[18px] border border-[#ebe9e7] bg-[#fffdfc] px-[20px] py-[20px] shadow-[0_2px_8px_rgba(20,24,36,0.04)] md:min-w-0"
              >
                <h3 className="text-[18px] font-black leading-tight text-[#2d2f49]">
                  {item.href ? (
                    <a
                      href={item.href}
                      className="underline decoration-[#ff3b0a]/30 underline-offset-4"
                    >
                      {item.title}
                    </a>
                  ) : (
                    item.title
                  )}
                </h3>
                <p className="mt-[9px] text-[14px] font-medium leading-[1.45] text-[#596173]">
                  {item.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="international-agencies"
          className="scroll-mt-[100px] bg-[#fffaf8] px-3 pb-[76px] pt-[48px] md:px-8 md:py-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]"
        >
          <div className="md:grid md:grid-cols-[0.9fr_1.1fr] md:gap-10 lg:gap-14">
            <div>
              <p className="text-[14px] font-black uppercase text-[#ff3b0a]">International buyers</p>
              <h2 className="mt-[14px] text-[32px] font-black leading-[1.16] text-[#2d2f49] md:text-[44px]">
                Built for International Travel Agencies
              </h2>
              <p className="mt-[22px] text-[18px] font-medium leading-[1.52] text-[#596173] md:text-[20px]">
                3Musafir exists to help overseas tour operators and agency partners run Pakistan with
                more confidence through local execution, clearer communication, and dependable ground
                support.
              </p>

              <div className="mt-[26px]">
                <AnswerBlock>{internationalAnswer}</AnswerBlock>
              </div>
            </div>

            <div className="mt-[28px] flex snap-x gap-[14px] overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:mt-0 md:grid md:snap-none md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
              {agencyMarkets.map((market) => (
                <article
                  key={market.market}
                  className="min-w-[290px] snap-start rounded-[16px] border border-[#ebe9e7] bg-white px-[18px] py-[16px] shadow-[0_2px_8px_rgba(20,24,36,0.04)] md:min-h-[150px] md:min-w-0"
                >
                  <h3 className="text-[18px] font-black leading-tight text-[#2d2f49]">
                    {market.market}
                  </h3>
                  <p className="mt-[8px] text-[14px] font-medium leading-[1.4] text-[#596173]">
                    {market.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="advantage" className="scroll-mt-[100px] bg-[#fffaf8] px-3 pb-[66px] pt-[10px] md:px-8 md:py-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <p className="text-[16px] font-black uppercase text-[#ff3b0a]">WHY IT MATTERS</p>
          <h2 className="mt-[16px] max-w-[780px] text-[34px] font-black leading-[1.18] text-[#2d2f49] md:text-[46px]">
            Why International Agencies Use Local Execution in Pakistan
          </h2>

          <div className="mt-[25px] md:max-w-[780px]">
            <AnswerBlock>{advantageAnswer}</AnswerBlock>
          </div>

          <p className="mt-[28px] max-w-[820px] text-[21px] font-medium leading-[1.52] text-[#596173] md:text-[23px]">
            International agencies often struggle with Pakistan&apos;s unique logistical
            challenges. Our deep local roots turn these obstacles into smooth operations.
          </p>

          <div className="mt-[38px] space-y-[25px] md:grid md:grid-cols-3 md:gap-6 md:space-y-0">
            {advantagePoints.map((point) => (
              <div key={point.title} className="flex gap-[14px] md:flex-col md:rounded-[18px] md:border md:border-[#ebe9e7] md:bg-white md:p-[20px] md:shadow-[0_2px_8px_rgba(20,24,36,0.04)]">
                <CheckCircle2
                  size={26}
                  strokeWidth={2.4}
                  className="mt-1 shrink-0 text-[#ff3b0a]"
                />
                <div>
                  <h3 className="text-[19px] font-black leading-tight text-[#2d2f49]">
                    {point.title}
                  </h3>
                  <p className="mt-[7px] text-[16.5px] font-medium leading-[1.35] text-[#596173]">
                    {point.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="credentials" className="scroll-mt-[100px] bg-[#fffaf8] px-[29px] pb-[106px] pt-[47px] md:px-8 md:py-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <h2 className="text-[30px] font-black leading-[1.35] text-[#2d2f49] md:text-[44px]">
            Structured. Registered.
            <br />
            Mature.
          </h2>

          <div className="mt-[18px] md:max-w-[820px]">
            <AnswerBlock>{credentialsAnswer}</AnswerBlock>
          </div>

          <p className="mt-[20px] max-w-[720px] text-[16.5px] font-medium leading-[1.45] text-[#596173] md:text-[18px]">
            We aren&apos;t freelancers. We are an operationally mature DMC designed for B2B
            reliability.
          </p>

          <div className="mt-[26px] rounded-[18px] border border-[#ebe9e7] bg-white px-[18px] py-[18px] shadow-[0_2px_8px_rgba(20,24,36,0.04)] md:px-6">
            <ul className="space-y-[12px] md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
              {trustProofs.map((item) => (
                <li key={item} className="flex gap-[10px] text-[14px] font-bold leading-[1.35] text-[#2d2f49]">
                  <Check size={18} strokeWidth={3} className="mt-[1px] shrink-0 text-[#ff3b0a]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-[31px] space-y-[20px] md:grid md:grid-cols-3 md:gap-5 md:space-y-0">
            {credentialCards.map((card) => {
              const Icon = iconMap[card.icon as keyof typeof iconMap];
              return (
                <article
                  key={card.title}
                  className="flex min-h-[116px] items-center gap-[20px] rounded-[20px] border border-[#ebe9e7] bg-white px-[20px] py-[20px] shadow-[0_2px_9px_rgba(20,24,36,0.05)] md:min-h-[210px] md:flex-col md:items-start"
                >
                  <div
                    className={`flex h-[51px] w-[51px] shrink-0 items-center justify-center rounded-full ${card.bg}`}
                  >
                    <Icon size={25} strokeWidth={3} className={card.color} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-black leading-tight text-[#2d2f49]">
                      {card.title}
                    </h3>
                    <p className="mt-[9px] text-[14px] font-medium leading-[1.3] text-[#596173]">
                      {card.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <a
            href="#urgent-enquiry"
            className="mt-[30px] flex h-[65px] items-center justify-center rounded-[18px] border-2 border-[#2d2f49] text-[18px] font-black text-[#2d2f49] md:max-w-[360px]"
          >
            Request Company Credentials
          </a>
        </section>

        <section id="pricing" className="scroll-mt-[100px] bg-white px-[18px] pb-[29px] pt-[38px] md:px-8 md:py-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <div className="text-center">
            <p className="text-[14px] font-black uppercase text-[#ff3b0a]">VALUE PROPOSITION</p>
            <h2 className="mx-auto mt-[14px] max-w-[720px] text-[29px] font-black leading-tight text-[#2d2f49] md:text-[42px]">
              Transparent B2B Pricing for Pakistan Programs
            </h2>
            <p className="mx-auto mt-[18px] max-w-[540px] text-[15px] font-medium text-[#596173] md:text-[17px]">
              Competitive rates designed for agency margins.
            </p>
          </div>

          <div className="mx-auto mt-[28px] md:max-w-[780px]">
            <AnswerBlock>{pricingAnswer}</AnswerBlock>
          </div>

          <div className="mt-[44px] flex snap-x gap-[22px] overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:snap-none md:grid-cols-3 md:items-stretch md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
          <a
            href="/pakistan-dmc/tours/skardu"
            className="flex min-w-[290px] snap-start flex-col rounded-[20px] border border-[#ffd2c6] bg-[#fff4f0] px-[31px] pb-[30px] pt-[34px] shadow-[0_2px_8px_rgba(20,24,36,0.05)] transition hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(20,24,36,0.09)] md:min-w-0"
          >
            <div className="flex justify-between gap-4">
              <div>
                <p className="text-[12px] font-black uppercase text-[#ff3b0a]">Direct tour package</p>
                <h3 className="mt-[9px] text-[24px] font-black leading-tight text-[#2d2f49]">
                  Skardu Valley
                  <br />
                  DMC Itinerary
                </h3>
                <p className="mt-[8px] text-[15.5px] font-medium leading-[1.5] text-[#596173]">
                  10-day Gilgit-Baltistan group tour for foreign agencies.
                </p>
              </div>
            </div>

            <ul className="mt-[28px] space-y-[15px]">
              {[
                "Skardu, Shigar, Khaplu, Kachura, Deosai or Basho",
                "Flights, hotels, transport, local guides, and cultural experiences",
                "Flight contingency planning and on-ground group coordination",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-[14px] text-[13.5px] font-medium leading-[1.4] text-[#2d2f49]"
                >
                  <Check size={18} strokeWidth={3} className="mt-[1px] shrink-0 text-[#ff3b0a]" />
                  {item}
                </li>
              ))}
            </ul>

            <span className="mt-[31px] flex h-[49px] items-center justify-center rounded-[14px] bg-[#ff3b0a] text-[14px] font-black text-white shadow-[0_10px_20px_rgba(255,59,10,0.18)] md:mt-auto">
              View Skardu Package
            </span>
          </a>

          <a
            href="/pakistan-dmc/tours/hunza"
            className="flex min-w-[290px] snap-start flex-col rounded-[20px] border border-[#ffd2c6] bg-[#fff4f0] px-[31px] pb-[30px] pt-[34px] shadow-[0_2px_8px_rgba(20,24,36,0.05)] transition hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(20,24,36,0.09)] md:min-w-0"
          >
            <div className="flex justify-between gap-4">
              <div>
                <p className="text-[12px] font-black uppercase text-[#ff3b0a]">Direct tour package</p>
                <h3 className="mt-[9px] text-[24px] font-black leading-tight text-[#2d2f49]">
                  Hunza Valley
                  <br />
                  DMC Itinerary
                </h3>
                <p className="mt-[8px] text-[15.5px] font-medium leading-[1.5] text-[#596173]">
                  10-day Northern Pakistan group tour for foreign agencies.
                </p>
              </div>
            </div>

            <ul className="mt-[28px] space-y-[15px]">
              {[
                "Islamabad, Chilas, Hunza, Gojal, Khunjerab, and Nagar",
                "Hotels, transport, local guides, and cultural experiences",
                "Safety-aware road logistics and on-ground group coordination",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-[14px] text-[13.5px] font-medium leading-[1.4] text-[#2d2f49]"
                >
                  <Check size={18} strokeWidth={3} className="mt-[1px] shrink-0 text-[#ff3b0a]" />
                  {item}
                </li>
              ))}
            </ul>

            <span className="mt-[31px] flex h-[49px] items-center justify-center rounded-[14px] bg-[#ff3b0a] text-[14px] font-black text-white shadow-[0_10px_20px_rgba(255,59,10,0.18)] md:mt-auto">
              View Hunza Package
            </span>
          </a>

          <a
            href="/pakistan-dmc/tours/k2basecamp"
            className="flex min-w-[290px] snap-start flex-col rounded-[20px] border border-[#ffd2c6] bg-[#fff4f0] px-[31px] pb-[30px] pt-[34px] shadow-[0_2px_8px_rgba(20,24,36,0.05)] transition hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(20,24,36,0.09)] md:min-w-0"
          >
            <div className="flex justify-between gap-4">
              <div>
                <p className="text-[12px] font-black uppercase text-[#ff3b0a]">Direct tour package</p>
                <h3 className="mt-[9px] text-[24px] font-black leading-tight text-[#2d2f49]">
                  K2 Base Camp
                  <br />
                  DMC Services
                </h3>
                <p className="mt-[8px] text-[15.5px] font-medium leading-[1.5] text-[#596173]">
                  Expedition logistics for agencies and adventure operators.
                </p>
              </div>
            </div>

            <ul className="mt-[28px] space-y-[15px]">
              {[
                "Baltoro Glacier trekking logistics",
                "Skardu, Askole, Concordia route planning",
                "Guides, porters, meals, camping, and contingency support",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-[14px] text-[13.5px] font-medium leading-[1.4] text-[#2d2f49]"
                >
                  <Check size={18} strokeWidth={3} className="mt-[1px] shrink-0 text-[#ff3b0a]" />
                  {item}
                </li>
              ))}
            </ul>

            <span className="mt-[31px] flex h-[49px] items-center justify-center rounded-[14px] bg-[#ff3b0a] text-[14px] font-black text-white shadow-[0_10px_20px_rgba(255,59,10,0.18)] md:mt-auto">
              View K2 Package
            </span>
          </a>

          <div className="flex min-w-[290px] snap-start flex-col rounded-[20px] border border-[#ebe9e7] bg-white px-[31px] pb-[30px] pt-[34px] shadow-[0_2px_8px_rgba(20,24,36,0.05)] md:min-w-0">
            <div className="flex justify-between gap-4">
              <div>
                <h3 className="text-[24px] font-black leading-tight text-[#2d2f49]">
                  Standard Tours
                </h3>
                <p className="mt-[7px] text-[15.5px] font-medium leading-[1.55] text-[#596173]">
                  Best for budget-conscious groups
                </p>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-extrabold uppercase leading-[1.25] text-[#6f7481]">
                  Starting
                  <br />
                  From
                </p>
                <p className="text-[28px] font-black leading-none text-[#ff3b0a]">$45</p>
                <p className="mt-[6px] text-[15px] font-medium text-[#596173]">/day/pax</p>
              </div>
            </div>

            <ul className="mt-[34px] space-y-[16px]">
              {standardIncludes.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-[14px] text-[13.5px] font-medium text-[#2d2f49]"
                >
                  <Check size={18} strokeWidth={3} className="text-[#1db954]" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#urgent-enquiry"
              className="mt-[31px] flex h-[49px] items-center justify-center rounded-[14px] border border-[#2d2f49] text-[14px] font-black text-[#2d2f49] md:mt-auto"
            >
              Request Quote
            </a>
          </div>

          <div className="relative flex min-w-[290px] snap-start flex-col overflow-hidden rounded-[20px] bg-[#2d2f49] px-[32px] pb-[31px] pt-[33px] text-white shadow-[0_15px_28px_rgba(20,24,36,0.18)] md:min-w-0">
            <div className="absolute right-0 top-0 rounded-bl-[18px] bg-[#ff3b0a] px-[18px] py-[8px] text-[11px] font-black uppercase">
              Recommended
            </div>

            <div className="flex justify-between gap-4 pt-[3px]">
              <div>
                <h3 className="text-[23px] font-black leading-[1.38]">
                  Premium
                  <br />
                  Expeditions
                </h3>
                <p className="mt-[2px] text-[15px] font-medium leading-[1.45] text-[#c5c8d3]">
                  For high-end clients & corporate
                </p>
              </div>
              <div className="text-right">
                <p className="text-[12px] font-extrabold uppercase leading-[1.25] text-[#aeb3c0]">
                  Starting
                  <br />
                  From
                </p>
                <p className="text-[28px] font-black leading-none text-white">$120</p>
                <p className="mt-[6px] text-[15px] font-medium text-[#c5c8d3]">/day/pax</p>
              </div>
            </div>

            <ul className="mt-[25px] space-y-[17px]">
              {premiumIncludes.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-[14px] text-[13.5px] font-medium text-white/90"
                >
                  <Check size={18} strokeWidth={3} className="text-[#ff3b0a]" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#urgent-enquiry"
              className="mt-[32px] flex h-[46px] items-center justify-center rounded-[14px] bg-[#ff3b0a] text-[15px] font-black text-white shadow-[0_13px_22px_rgba(255,59,10,0.24)] md:mt-auto"
            >
              Request Quote
            </a>
          </div>
          </div>

          <p className="mx-auto mt-[58px] max-w-[314px] text-center text-[12.5px] font-medium leading-[1.5] text-[#6f7481]">
            * Prices are indicative and vary based on season, group size, and itinerary.
          </p>
        </section>

        <section id="faqs" className="scroll-mt-[100px] bg-[#2d2f49] px-3 pb-[48px] pt-[75px] text-white md:px-8 md:py-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <h2 className="mx-auto max-w-[640px] text-center text-[35px] font-black leading-[1.05] text-white md:text-[48px]">
            Frequently Asked
            <br />
            Questions
          </h2>
          <p className="mx-auto mt-[27px] max-w-[620px] text-center text-[17px] font-medium leading-[1.55] text-[#b9bdca] md:text-[18px]">
            Answers for international agencies evaluating 3Musafir as a Pakistan DMC, inbound tour
            operator, ground handler, and logistics partner.
          </p>

          <div className="mt-[63px] space-y-[15px] md:mx-auto md:grid md:max-w-[960px] md:grid-cols-2 md:items-start md:gap-4 md:space-y-0">
            {dmcFaqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group rounded-[12px] bg-[#1e2533] px-[23px] py-[25px]"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-black leading-[1.55] [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown
                    size={19}
                    strokeWidth={3}
                    className="shrink-0 text-[#ff3b0a] transition group-open:rotate-180"
                  />
                </summary>
                <p className="mt-3 text-[14px] font-medium leading-[1.5] text-[#b9bdca]">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section id="partner" className="scroll-mt-[100px] bg-white px-[15px] pb-[24px] pt-[42px] md:px-8 md:py-20 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <div className="rounded-[20px] border border-[#ebe9e7] bg-[#f8f8fa] px-[31px] pb-[25px] pt-[32px] shadow-[0_1px_4px_rgba(20,24,36,0.03)] md:px-8 md:py-8">
            <h2 className="text-[24px] font-black leading-tight text-[#2d2f49] md:text-[34px]">Become a Partner</h2>
            <p className="mt-[17px] max-w-[620px] text-[13.5px] font-medium leading-[1.45] text-[#596173] md:text-[16px]">
              Join our network of international agencies and unlock exclusive B2B rates.
            </p>

            <a
              href="https://wa.me/923221848940?text=Hi%203Musafir%2C%20I%20want%20to%20partner%20for%20Pakistan%20DMC%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-[23px] flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#2d2f49] px-5 text-[15px] font-black text-white shadow-[0_8px_18px_rgba(20,24,36,0.12)] md:max-w-[300px]"
            >
              Chat on WhatsApp
            </a>
          </div>
        </section>

        <section id="urgent-enquiry" className="scroll-mt-[100px] bg-white px-[17px] pb-[37px] pt-[4px] md:px-8 md:pb-24 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
          <div className="rounded-[20px] border border-[#ffc9bb] bg-[#fff4f0] px-[31px] pb-[30px] pt-[27px] md:grid md:grid-cols-[0.8fr_1.2fr] md:gap-8 md:px-8 md:py-8 lg:gap-12">
            <div>
            <div className="flex items-center gap-[13px]">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#ff3b0a] text-white">
                <Zap size={21} fill="white" strokeWidth={2.5} />
              </div>
              <h2 className="text-[25px] font-black leading-[1.25] text-[#2d2f49] md:text-[36px]">
                Urgent Inquiry /
                <br />
                Quote
              </h2>
            </div>

            <p className="mt-[31px] text-[15.5px] font-medium leading-[1.5] text-[#596173] md:text-[17px]">
              Have a group ready to go? Need a quote within 24 hours? Fill out the details below
              for priority handling.
            </p>
            </div>

            <div className="mt-[28px] md:mt-0 md:flex md:items-center">
              <a
                href="https://wa.me/923221848940?text=Hi%203Musafir%2C%20I%20need%20a%20Pakistan%20DMC%20quote%20for%20an%20agency%20group."
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[57px] w-full items-center justify-center rounded-[14px] bg-[#ff3b0a] px-5 text-center text-[17px] font-black text-white shadow-[0_13px_22px_rgba(255,59,10,0.22)] md:max-w-[360px]"
              >
                Request Quote on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <footer id="footer" className="scroll-mt-[100px] bg-[#2d2f49] px-2 pb-[83px] pt-[24px] text-white md:px-8 md:py-16 lg:px-12 xl:px-[calc((100vw-1180px)/2)]">
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
            <p className="mt-[23px] max-w-[420px] text-[15.5px] font-medium leading-[1.55] text-[#b9bdca] md:text-[16px]">
              Your trusted B2B Destination Management Company in Pakistan. Registered, insured, and
              operationally ready.
            </p>

            <div className="mt-[24px] flex gap-[15px]">
              <a
                href="https://www.linkedin.com/company/3musafirinternational/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="3Musafir International on LinkedIn"
                className="flex h-[31px] w-[31px] items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <Linkedin size={14} />
              </a>
            </div>
          </div>

          <div className="mt-[34px] space-y-[35px] md:mt-0 md:grid md:grid-cols-2 md:gap-10 md:space-y-0">
            <div>
              <h3 className="text-[15px] font-black">Company</h3>
              <ul className="mt-[22px] space-y-[14px] text-[14px] font-medium text-[#b9bdca]">
                <li>
                  <a href="/about-3musafir">About 3Musafir</a>
                </li>
                <li>
                  <a href="/why">why 3Musafir</a>
                </li>
                <li>
                  <a href="/trust-and-verification">trust and verification</a>
                </li>
                <li>
                  <a href="/terms&conditonsby3musafir">Terms and conditions</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[15px] font-black">Services</h3>
              <ul className="mt-[22px] space-y-[14px] text-[14px] font-medium text-[#b9bdca]">
                <li>
                  <a href="#services">Pakistan DMC services</a>
                </li>
                <li>
                  <a href="#pricing">corporate retreats in Pakistan</a>
                </li>
                <li>
                  <a href="#services">hotel and transport logistics</a>
                </li>
                <li>
                  <a href="#urgent-enquiry">contact 3Musafir</a>
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
            Contact 3Musafir
          </a>
        </div>
      </div>
    </main>
  );
}
