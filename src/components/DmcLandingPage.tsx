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
  Mail,
  Menu,
  Mountain,
  Phone,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Services", href: "#services" },
  { label: "Advantage", href: "#advantage" },
  { label: "Credentials", href: "#credentials" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQs", href: "#faqs" },
  { label: "Partner", href: "#partner" },
  { label: "Urgent Quote", href: "#urgent-enquiry" },
];

const services = [
  {
    title: "Special Interest",
    description: "Photography tours, religious tourism, and culinary experiences.",
    image: "/communityimage11.jpg",
  },
  {
    title: "MICE",
    description: "Meetings, Incentives, Conferences, and Exhibitions management.",
    image: "/communityimage12.jpg",
  },
  {
    title: "Corporate Retreats",
    description: "Executive retreats, business logistics, and secure transport for VIPs.",
    image: "/communityimage13.jpg",
  },
  {
    title: "Inbound Tourism",
    description: "Curated cultural tours, adventure expeditions, and heritage walks.",
    image: "/communityimage14.jpg",
  },
  {
    title: "Logistics & Fleet",
    description:
      "A fleet of well-maintained vehicles ranging from 4x4 Jeeps to 5C new model coaches.",
    image: "/communityimage15.jpg",
  },
  {
    title: "Hotel Contracting",
    description: "Preferential rates at 3 to 5-star properties across Pakistan.",
    image: "/biographysubimage4.jpeg",
  },
];

const stats = [
  { value: "6+", label: "Years of Operation", orange: true },
  { value: "50+", label: "Corporate Clients" },
  { value: "100k", label: "social followers", orange: true },
  { value: "172+", label: "Tourism Vendors" },
  { value: "4.9/5", label: "Rated on Google", orange: true },
  { value: "7760", label: "Travellers Catered" },
];

const advantagePoints = [
  {
    title: "Authority Proof",
    body: "We don't sub-contract to unknown entities. We are the entity.",
  },
  {
    title: "Cost Efficiency",
    body: "Direct vendor rates passed to you, increasing your margins.",
  },
  {
    title: "Crisis Management",
    body: "Local teams capable of handling road blocks, weather changes, and medical emergencies instantly.",
  },
];

const credentialCards = [
  {
    title: "Legal Compliance",
    body: "Full tax compliance and regulatory adherence in all operating regions.",
    icon: Gavel,
    bg: "bg-[#edf3ff]",
    color: "text-[#2764e7]",
  },
  {
    title: "Service Level Agreements (SLA’s)",
    body: "Everything is written down for your clarity and peace of mind.",
    icon: Gavel,
    bg: "bg-[#ecfbf2]",
    color: "text-[#13a665]",
  },
  {
    title: "24/7 On-Ground Support",
    body: "Dedicated dispatch teams monitoring every movement.",
    icon: Headphones,
    bg: "bg-[#ffe9e2]",
    color: "text-[#ff3b0a]",
  },
];

const standardIncludes = [
  "3-Star Accommodation",
  "Standard Coaster/Hiace Transport",
  "Local Guide",
];

const premiumIncludes = [
  "4/5-Star & Boutique Hotels",
  "Luxury SUV / Prado Transport",
  "Dedicated Account Manager 24/7",
  "Security Detail (Optional)",
];

const faqs = [
  "Do you provide visa assistance for international groups?",
  "What is your policy on security and insurance?",
  "Can you handle large corporate MICE events?",
  "What are your payment terms for B2B partners?",
  "Do you offer white-label services?",
  "How do you handle last-minute itinerary changes?",
];

function TextInput({
  label,
  placeholder,
  required = false,
}: {
  label: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-[6px] block text-[15px] font-extrabold leading-tight text-[#2d2f49]">
        {label}
        {required ? "*" : ""}
      </span>
      <input
        type="text"
        placeholder={placeholder}
        className="h-[42px] w-full rounded-[11px] border border-[#d3d8df] bg-white px-[11px] text-[15px] font-medium text-[#2d2f49] outline-none placeholder:text-[#c8c9cd] focus:border-[#ff3b0a]"
      />
    </label>
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
        className="absolute right-4 top-4 w-[250px] rounded-[22px] bg-white p-4 shadow-2xl"
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

      <div className="mx-auto min-h-screen w-full max-w-[500px] overflow-hidden bg-[#fffaf8]">
        <header className="sticky top-0 z-50 flex h-[100px] items-center justify-between bg-white px-[22px]">
          <a href="#hero" className="flex items-center gap-3">
            <Image
              src="/3mlogosmall.svg"
              alt="3Musafir logo"
              width={42}
              height={42}
              priority
              className="h-[38px] w-[42px] object-contain"
            />
            <span className="text-[25px] font-extrabold leading-none text-[#2d2f49]">
              3 Musafir Travels
            </span>
          </a>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#2d2f49]"
          >
            <Menu size={30} strokeWidth={3} />
          </button>
        </header>

        <section id="hero" className="scroll-mt-[100px]">
          <div className="relative h-[212px] w-full overflow-hidden bg-[#2f3143] grayscale">
            <Image
              src="/3musafir-founders.jpg"
              alt="3Musafir team"
              fill
              priority
              className="object-cover object-center opacity-70"
            />
            <div className="absolute inset-0 bg-[#151625]/25" />
          </div>

          <div className="relative px-[21px] pb-12 pt-[29px]">
            <div className="pointer-events-none absolute right-[-70px] top-[230px] h-[280px] w-[280px] rounded-full bg-[#ff3b0a]/10 blur-3xl" />

            <h1 className="max-w-[455px] text-[40px] font-black leading-[1.27] text-[#2d2f49]">
              Destination Management Company in Pakistan for{" "}
              <span className="text-[#ff3b0a]">International Partners</span>
            </h1>

            <p className="mt-[29px] max-w-[440px] text-[24px] font-medium leading-[1.55] text-[#596173]">
              We handle the logistics so you can focus on the experience. The trusted ground
              partner for international agencies.
            </p>

            <div className="mt-[42px] flex min-h-[73px] w-full max-w-[378px] items-center gap-4 rounded-[16px] border border-[#ece8e5] bg-white px-[23px] shadow-[0_3px_10px_rgba(29,31,50,0.06)]">
              <BadgeCheck size={25} strokeWidth={2.7} className="shrink-0 text-[#ff3b0a]" />
              <p className="text-[18px] font-extrabold leading-[1.25] text-[#2d2f49]">
                NIC and Aga Khan Foundation
                <br />
                backed company
              </p>
            </div>

            <div className="mt-[52px] space-y-[22px]">
              <a
                href="#urgent-enquiry"
                className="flex h-[72px] w-full items-center justify-center rounded-[19px] bg-[#ff3b0a] text-[20px] font-extrabold text-white shadow-[0_13px_25px_rgba(255,59,10,0.22)]"
              >
                Urgent Enquiry
              </a>

              <a
                href="/brochure-2026.pdf"
                className="flex h-[70px] w-full items-center justify-center gap-4 rounded-[18px] border border-[#ebedf0] bg-white text-[20px] font-extrabold text-[#2d2f49] shadow-[0_2px_8px_rgba(20,24,36,0.04)]"
              >
                <Download size={25} strokeWidth={3} className="text-black" />
                Download Brochure 2026
              </a>
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-[100px] bg-white px-3 pb-28 pt-12">
          <div className="mx-auto max-w-[500px] text-center">
            <h2 className="mx-auto max-w-[330px] text-[29px] font-black leading-[1.08] text-[#2d2f49]">
              Comprehensive DMC
              <br />
              Services
            </h2>
            <p className="mt-5 text-[15px] font-medium text-[#596173]">
              Tailored solutions for every type of traveler.
            </p>
          </div>

          <div className="mt-[62px] flex snap-x gap-[22px] overflow-x-auto px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {services.map((service) => (
              <article
                key={service.title}
                className="min-w-[238px] snap-start overflow-hidden rounded-[13px] border border-[#ebe9e7] bg-[#fffdfc] shadow-[0_1px_4px_rgba(20,24,36,0.04)]"
              >
                <div className="relative h-[171px] w-full overflow-hidden rounded-t-[13px] bg-[#f1eeeb]">
                  <Image src={service.image} alt={service.title} fill className="object-cover" />
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

          <div className="mt-[70px] grid grid-cols-2 gap-x-[15px] gap-y-[15px] px-0.5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex h-[103px] flex-col justify-center rounded-[18px] border border-[#eceef0] bg-white px-[20px] text-left shadow-[0_2px_8px_rgba(20,24,36,0.05)]"
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

        <section id="advantage" className="scroll-mt-[100px] bg-[#fffaf8] px-3 pb-[66px] pt-[10px]">
          <p className="text-[16px] font-black uppercase text-[#ff3b0a]">WHY IT MATTERS</p>
          <h2 className="mt-[16px] text-[36px] font-black leading-[1.24] text-[#2d2f49]">
            The &quot;Brutally Local&quot;
            <br />
            Advantage
          </h2>
          <p className="mt-[32px] text-[22px] font-medium leading-[1.58] text-[#596173]">
            International agencies often struggle with Pakistan&apos;s unique logistical
            challenges. Our deep local roots turn these obstacles into smooth operations.
          </p>

          <div className="mt-[41px] space-y-[25px]">
            {advantagePoints.map((point) => (
              <div key={point.title} className="flex gap-[14px]">
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

        <section id="credentials" className="scroll-mt-[100px] bg-[#fffaf8] px-[29px] pb-[126px] pt-[47px]">
          <h2 className="text-[30px] font-black leading-[1.35] text-[#2d2f49]">
            Structured. Registered.
            <br />
            Mature.
          </h2>
          <p className="mt-[13px] text-[16.5px] font-medium leading-[1.45] text-[#596173]">
            We aren&apos;t freelancers. We are an operationally mature DMC designed for B2B
            reliability.
          </p>

          <div className="mt-[31px] space-y-[20px]">
            {credentialCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.title}
                  className="flex min-h-[116px] items-center gap-[20px] rounded-[20px] border border-[#ebe9e7] bg-white px-[20px] py-[20px] shadow-[0_2px_9px_rgba(20,24,36,0.05)]"
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
            href="/company-credentials.pdf"
            className="mt-[30px] flex h-[65px] items-center justify-center rounded-[18px] border-2 border-[#2d2f49] text-[18px] font-black text-[#2d2f49]"
          >
            View Company Credentials
          </a>
        </section>

        <section id="pricing" className="scroll-mt-[100px] bg-white px-[18px] pb-[29px] pt-[38px]">
          <div className="text-center">
            <p className="text-[14px] font-black uppercase text-[#ff3b0a]">VALUE PROPOSITION</p>
            <h2 className="mt-[14px] text-[29px] font-black leading-tight text-[#2d2f49]">
              Transparent B2B Pricing
            </h2>
            <p className="mt-[18px] text-[15px] font-medium text-[#596173]">
              Competitive rates designed for agency margins.
            </p>
          </div>

          <div className="mt-[67px] rounded-[20px] border border-[#ebe9e7] bg-white px-[31px] pb-[30px] pt-[34px] shadow-[0_2px_8px_rgba(20,24,36,0.05)]">
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
              className="mt-[31px] flex h-[49px] items-center justify-center rounded-[14px] border border-[#2d2f49] text-[14px] font-black text-[#2d2f49]"
            >
              Request Quote
            </a>
          </div>

          <div className="relative mt-[30px] overflow-hidden rounded-[20px] bg-[#2d2f49] px-[32px] pb-[31px] pt-[33px] text-white shadow-[0_15px_28px_rgba(20,24,36,0.18)]">
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
              className="mt-[32px] flex h-[46px] items-center justify-center rounded-[14px] bg-[#ff3b0a] text-[15px] font-black text-white shadow-[0_13px_22px_rgba(255,59,10,0.24)]"
            >
              Request Quote
            </a>
          </div>

          <p className="mx-auto mt-[58px] max-w-[314px] text-center text-[12.5px] font-medium leading-[1.5] text-[#6f7481]">
            * Prices are indicative and vary based on season, group size, and itinerary.
          </p>
        </section>

        <section id="faqs" className="scroll-mt-[100px] bg-[#2d2f49] px-3 pb-[48px] pt-[75px] text-white">
          <h2 className="mx-auto max-w-[320px] text-center text-[35px] font-black leading-[1.05]">
            Frequently Asked
            <br />
            Questions
          </h2>
          <p className="mx-auto mt-[27px] max-w-[320px] text-center text-[17px] font-medium leading-[1.55] text-[#b9bdca]">
            Everything you need to know about partnering with 3Musafir as your DMC in Pakistan.
          </p>

          <div className="mt-[63px] space-y-[15px]">
            {faqs.map((faq) => (
              <details key={faq} className="group rounded-[12px] bg-[#1e2533] px-[23px] py-[25px]">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-black leading-[1.55] [&::-webkit-details-marker]:hidden">
                  {faq}
                  <ChevronDown
                    size={19}
                    strokeWidth={3}
                    className="shrink-0 text-[#ff3b0a] transition group-open:rotate-180"
                  />
                </summary>
                <p className="mt-3 text-[14px] font-medium leading-[1.5] text-[#b9bdca]">
                  Yes. Our team coordinates requirements, timelines, supplier communication and
                  operational support based on the final itinerary and partner scope.
                </p>
              </details>
            ))}
          </div>
        </section>

        <section id="partner" className="scroll-mt-[100px] bg-white px-[15px] pb-[24px] pt-[42px]">
          <div className="rounded-[20px] border border-[#ebe9e7] bg-[#f8f8fa] px-[31px] pb-[25px] pt-[32px] shadow-[0_1px_4px_rgba(20,24,36,0.03)]">
            <h2 className="text-[24px] font-black leading-tight text-[#2d2f49]">Become a Partner</h2>
            <p className="mt-[17px] text-[13.5px] font-medium leading-[1.45] text-[#596173]">
              Join our network of international agencies and unlock exclusive B2B rates.
            </p>

            <form className="mt-[23px] space-y-[15px]">
              <TextInput label="Company Name" placeholder="Company/ Business name" />
              <TextInput label="Country" placeholder="your country" />
              <TextInput label="Email " placeholder="Your official email" required />
              <button
                type="button"
                className="mt-[6px] h-[42px] w-full rounded-[10px] bg-[#2d2f49] text-[13px] font-black text-white"
              >
                Register Interest
              </button>
            </form>
          </div>
        </section>

        <section id="urgent-enquiry" className="scroll-mt-[100px] bg-white px-[17px] pb-[37px] pt-[4px]">
          <div className="rounded-[20px] border border-[#ffc9bb] bg-[#fff4f0] px-[31px] pb-[30px] pt-[27px]">
            <div className="flex items-center gap-[13px]">
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#ff3b0a] text-white">
                <Zap size={21} fill="white" strokeWidth={2.5} />
              </div>
              <h2 className="text-[25px] font-black leading-[1.25] text-[#2d2f49]">
                Urgent Inquiry /
                <br />
                Quote
              </h2>
            </div>

            <p className="mt-[31px] text-[15.5px] font-medium leading-[1.5] text-[#596173]">
              Have a group ready to go? Need a quote within 24 hours? Fill out the details below
              for priority handling.
            </p>

            <form className="mt-[28px] space-y-[18px]">
              <TextInput label="Full Name" placeholder="Your name" required />
              <TextInput label="Company Name" placeholder="Company/ Business name" />
              <TextInput label="Email " placeholder="Your official email" required />
              <TextInput
                label="Contact Number (with country code)"
                placeholder="Preferably WhatsApp number"
                required
              />
              <TextInput
                label="Number of Travelers"
                placeholder="e.g 50 (you can also enter a range)"
                required
              />

              <label className="block">
                <span className="mb-[6px] block text-[15px] font-extrabold leading-tight text-[#2d2f49]">
                  Requirements (Destinations, PAX, Dates)
                </span>
                <textarea className="h-[87px] w-full resize-none rounded-[11px] border border-[#d3d8df] bg-white px-[11px] py-3 text-[15px] font-medium text-[#2d2f49] outline-none focus:border-[#ff3b0a]" />
              </label>

              <button
                type="button"
                className="mt-[5px] h-[57px] w-full rounded-[14px] bg-[#ff3b0a] text-[17px] font-black text-white shadow-[0_13px_22px_rgba(255,59,10,0.22)]"
              >
                Get Priority Quote
              </button>
            </form>
          </div>
        </section>

        <footer className="bg-[#2d2f49] px-2 pb-[83px] pt-[24px] text-white">
          <div className="flex items-center gap-[8px]">
            <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#ff3b0a]">
              <Mountain size={14} fill="white" strokeWidth={2.2} />
            </div>
            <strong className="text-[16px] font-black">3Musafir Travels</strong>
          </div>
          <p className="mt-[23px] max-w-[345px] text-[15.5px] font-medium leading-[1.55] text-[#b9bdca]">
            Your trusted B2B Destination Management Company in Pakistan. Registered, insured, and
            operationally ready.
          </p>

          <div className="mt-[24px] flex gap-[15px]">
            <a
              href="mailto:hello@3musafir.com"
              aria-label="Email 3Musafir"
              className="flex h-[31px] w-[31px] items-center justify-center rounded-full bg-white/10 text-white"
            >
              <Mail size={14} />
            </a>
            <a
              href="tel:+920000000000"
              aria-label="Call 3Musafir"
              className="flex h-[31px] w-[31px] items-center justify-center rounded-full bg-white/10 text-white"
            >
              <Phone size={14} />
            </a>
          </div>

          <div className="mt-[34px] space-y-[35px]">
            <div>
              <h3 className="text-[15px] font-black">Company</h3>
              <ul className="mt-[22px] space-y-[14px] text-[14px] font-medium text-[#b9bdca]">
                <li>
                  <a href="#hero">About Us</a>
                </li>
                <li>
                  <a href="#credentials">Our Team</a>
                </li>
                <li>
                  <a href="#credentials">Licensing & Compliance</a>
                </li>
                <li>
                  <a href="/privacy-policy">Privacy Policy</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[15px] font-black">Services</h3>
              <ul className="mt-[22px] space-y-[14px] text-[14px] font-medium text-[#b9bdca]">
                <li>
                  <a href="#services">Corporate Retreats</a>
                </li>
                <li>
                  <a href="#services">MICE Management</a>
                </li>
                <li>
                  <a href="#services">Inbound Tours</a>
                </li>
                <li>
                  <a href="#services">Logistics Support</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-[46px] border-t border-white/5 px-[15px] pt-[32px] text-[13px] font-medium text-[#878b9d]">
            &copy; 2024 3Musafir Travels (Pvt) Ltd. All rights reserved.
          </div>
        </footer>

        <div className="fixed bottom-0 left-1/2 z-[60] flex w-full max-w-[500px] -translate-x-1/2 gap-3 bg-white/95 px-3 pb-[14px] pt-[15px] backdrop-blur">
          <a
            href="/brochure-2026.pdf"
            className="flex h-[39px] flex-1 items-center justify-center rounded-[9px] bg-[#f2f3f5] text-[12px] font-extrabold text-[#2d2f49]"
          >
            Brochure
          </a>
          <a
            href="#urgent-enquiry"
            className="flex h-[39px] flex-1 items-center justify-center rounded-[9px] bg-[#ff3b0a] text-[12px] font-extrabold text-white shadow-[0_9px_18px_rgba(255,59,10,0.25)]"
          >
            Urgent Enquiry
          </a>
        </div>
      </div>
    </main>
  );
}
