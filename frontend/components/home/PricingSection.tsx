"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ question, answer, isOpen, onToggle }: FaqItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!contentRef.current || !iconRef.current) return;

    if (isOpen) {
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.35,
        ease: "power2.out",
      });
      gsap.to(iconRef.current, {
        rotation: 180,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(iconRef.current, {
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isOpen]);

  return (
    <div className="border-b border-outline-variant/30 py-4 last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left focus:outline-none group py-2"
        aria-expanded={isOpen}
      >
        <span className="text-base font-bold text-on-surface group-hover:text-primary transition-colors pr-4 md:text-lg">
          {question}
        </span>
        <span
          ref={iconRef}
          className="material-symbols-outlined text-outline group-hover:text-primary transition-colors shrink-0 select-none"
        >
          keyboard_arrow_down
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden h-0 opacity-0"
      >
        <p className="pb-4 pt-2 text-sm leading-7 text-on-surface-variant md:text-base">
          {answer}
        </p>
      </div>
    </div>
  );
}

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [dailyCustomers, setDailyCustomers] = useState<number>(50);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Calculations for ROI Calculator
  const scanRate = 0.15; // 15% scan QR standee
  const happyRate = 0.72; // 72% rate 4-5 stars (Google reviews)
  const privateFeedbackRate = 0.28 * 0.65; // 28% rate 1-3 stars, 65% of them leave private feedback

  const monthlyCustomers = dailyCustomers * 30;
  const estimatedScans = Math.round(monthlyCustomers * scanRate);
  const estimatedReviews = Math.round(estimatedScans * happyRate);
  const estimatedPrivateFeedback = Math.round(estimatedScans * privateFeedbackRate);

  const needsPro = estimatedScans > 100;

  const faqs = [
    {
      question: "How does the smart feedback flow protect my reputation?",
      answer: "When customers scan your table signs, they select their star rating. Happy customers (rating 4 or 5 stars) are instantly guided to your Google review link to post publicly. Unhappy customers (1 to 3 stars) are routed to a private form to send details directly to your dashboard. This lets you resolve issues privately before they turn into public complaints.",
    },
    {
      question: "Can I customize the printed table signs?",
      answer: "Yes! Our designer tool lets you upload your logo, choose brand colors, select from 12+ industry-specific template designs, and write custom call-to-actions. You can download high-resolution, print-ready PNG files immediately.",
    },
    {
      question: "What happens if I exceed my monthly scan limit?",
      answer: "On the Free plan, campaigns display a limit warning after 100 scans in a month. On the Pro plan, you get up to 5,000 scans per month, which handles high-traffic locations. We will notify you when you reach 80% and 100% of your limit, and we never charge surprise overage fees.",
    },
    {
      question: "Can I switch between monthly and yearly plans?",
      answer: "Absolutely. You can change your plan or billing frequency at any time through your Billing Portal inside your dashboard settings. Upgrades take effect immediately, while downgrades apply at the end of your billing cycle.",
    },
    {
      question: "Is there a contract? How do I cancel?",
      answer: "No contracts or long-term commitments. ReviewLoom operates on a month-to-month or year-to-year subscription. You can cancel with two clicks from your dashboard settings, and your features will remain active until the end of your paid period.",
    },
  ];

  const compareFeatures = [
    { name: "Active campaigns", free: "3 campaigns", pro: "Unlimited" },
    { name: "QR code downloads", free: "Standard PNG", pro: "High-resolution PNG" },
    { name: "Monthly customer scans", free: "100 scans / mo", pro: "5,000 scans / mo" },
    { name: "Private feedback inbox", free: "50 submissions / mo", pro: "2,000 submissions / mo" },
    { name: "Standee templates", free: "4 Classic templates", pro: "12+ Premium templates" },
    { name: "Branding", free: "ReviewLoom watermark", freeHighlight: true, pro: "White-label (No watermark)" },
    { name: "Performance analytics", free: "7 days history", pro: "Full lifetime history & export" },
    { name: "Customer support", free: "Community support", pro: "Priority email support" },
  ];

  return (
    <section id="pricing" className="relative px-6 py-24 md:px-8 bg-surface-bright">
      {/* Decorative gradient accents */}
      <div className="absolute left-1/4 top-20 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute right-1/4 bottom-20 -z-10 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />

      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-primary">Simple Transparent Plans</p>
          <h2 className="font-display text-3xl font-extrabold leading-tight text-on-surface md:text-5xl">
            Choose the right plan for your business
          </h2>
          <p className="text-base leading-7 text-on-surface-variant md:text-lg">
            Start collecting customer reviews and managing feedback in minutes. Upgrade as your business grows.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-6 flex justify-center">
            <div className="relative grid grid-cols-2 bg-surface-container rounded-full p-1 border border-outline-variant/30 w-full max-w-[340px] sm:max-w-[380px]">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`relative z-10 w-full text-center py-2 text-sm font-bold rounded-full transition-colors duration-300 cursor-pointer ${
                  billingPeriod === "monthly" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`relative z-10 w-full flex items-center justify-center gap-1.5 py-2 text-sm font-bold rounded-full transition-colors duration-300 cursor-pointer ${
                  billingPeriod === "yearly" ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Yearly
                <span className="bg-secondary text-on-secondary px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                  -17%
                </span>
              </button>
              {/* Sliding background element */}
              <div
                className="absolute top-1 bottom-1 rounded-full bg-white shadow-sm transition-all duration-300"
                style={{
                  width: "calc(50% - 4px)",
                  left: billingPeriod === "monthly" ? "4px" : "50%",
                }}
              />
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto items-stretch mb-24">
          {/* Free Card */}
          <div className="bg-white rounded-3xl p-8 border border-outline-variant/40 shadow-sm flex flex-col justify-between hover:border-outline transition-all duration-300">
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-outline">Starter Tier</span>
                <h3 className="text-2xl font-extrabold text-on-surface font-headline mt-1">Free Plan</h3>
                <p className="text-sm text-on-surface-variant mt-2 min-h-12">
                  Perfect for single-location small businesses testing their first QR campaign.
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-5xl font-black text-on-surface tracking-tight">$0</span>
                  <span className="text-outline text-sm font-medium">/ month</span>
                </div>
              </div>

              <div className="h-px bg-outline-variant/30 my-6" />

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Icon name="check" className="text-outline text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-medium">Up to <strong className="text-on-surface font-bold">3 active campaigns</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" className="text-outline text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-medium">100 customer scans / month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" className="text-outline text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-medium">50 private feedbacks / month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" className="text-outline text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-medium">4 Classic standee templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check" className="text-outline text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-medium">7-day performance analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="close" className="text-error/60 text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface-variant text-sm line-through">White-label customization</span>
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard"
              className="w-full py-4 rounded-xl font-bold text-primary bg-primary-fixed hover:bg-primary-fixed-dim text-center transition-colors active:scale-98 shadow-sm cursor-pointer"
            >
              Get Started for Free
            </Link>
          </div>

          {/* Pro Card (Glowing / Styled) */}
          <div className="relative rounded-3xl p-8 border-2 border-primary bg-white shadow-xl shadow-primary/5 flex flex-col justify-between hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group">
            {/* Pulsing glow background decoration */}
            <div className="absolute -right-20 -top-20 w-44 h-44 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700 pointer-events-none" />
            
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
              Most Popular
            </div>

            <div className="relative z-10">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Unlimited Growth</span>
                <h3 className="text-2xl font-extrabold text-primary font-headline mt-1">Pro Plan</h3>
                <p className="text-sm text-on-surface-variant mt-2 min-h-12">
                  Complete reputation management with private reviews routing and custom standees.
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  {billingPeriod === "monthly" ? (
                    <>
                      <span className="text-5xl font-black text-on-surface tracking-tight">$29</span>
                      <span className="text-outline text-sm font-medium">/ month</span>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-black text-on-surface tracking-tight">$24</span>
                          <span className="text-outline text-sm font-medium">/ month</span>
                        </div>
                        <span className="text-[11px] font-bold text-secondary mt-1">Billed $290 annually (save $58/yr)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="h-px bg-primary/20 my-6" />

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-semibold">
                    <strong className="text-on-surface font-extrabold">Unlimited</strong> campaigns & QR codes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-semibold">
                    Up to <strong className="text-on-surface font-extrabold">5,000 scans</strong> / month
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-semibold">
                    Up to <strong className="text-on-surface font-extrabold">2,000 private feedbacks</strong> / month
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-semibold">
                    <strong className="text-on-surface font-extrabold">White-label branding</strong> (no watermark)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-semibold">
                    All <strong className="text-on-surface font-extrabold">12+ Premium</strong> templates & categories
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-semibold">Full lifetime analytics history</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-semibold">Priority email support</span>
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard"
              className="w-full py-4 rounded-xl font-black text-white bg-primary hover:bg-primary/90 text-center transition-colors active:scale-98 shadow-lg shadow-primary/20 cursor-pointer"
            >
              Upgrade to Pro Plan
            </Link>
          </div>
        </div>

        {/* ROI Calculator section ("Lời mời tương tác") */}
        <div className="bg-surface-container rounded-3xl p-8 md:p-10 border border-outline-variant/35 mb-24 max-w-4xl mx-auto shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-5">
              <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block border border-primary/10">
                ROI Calculator
              </span>
              <h3 className="text-2xl font-extrabold text-on-surface font-headline">
                Estimate how many reviews your business will gain
              </h3>
              <p className="text-sm leading-6 text-on-surface-variant">
                Drag the slider to adjust your daily customer count. See how many customers are projected to scan, leave public reviews on Google, or provide private feedback.
              </p>

              {/* Slider Control */}
              <div className="pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-on-surface-variant">Estimated daily customers</span>
                  <span className="text-xl font-black text-primary bg-white px-3 py-1 rounded-lg border border-outline-variant/40 shadow-sm">
                    {dailyCustomers} customers
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={dailyCustomers}
                  onChange={(e) => setDailyCustomers(Number(e.target.value))}
                  className="w-full h-2 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
                  aria-label="Daily customers slider"
                />
                <div className="flex justify-between text-xs text-outline font-semibold">
                  <span>10</span>
                  <span>100</span>
                  <span>250</span>
                  <span>500+</span>
                </div>
              </div>
            </div>

            {/* Projected Outputs */}
            <div className="bg-white rounded-2xl p-6 border border-outline-variant/30 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-outline mb-2">Projected Monthly Results</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <div className="flex items-center gap-2">
                    <Icon name="qr_code_scanner" className="text-primary text-lg" />
                    <span className="text-sm font-semibold text-on-surface-variant">QR Scans / month</span>
                  </div>
                  <span className="text-base font-black text-on-surface">{estimatedScans}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-outline-variant/10">
                  <div className="flex items-center gap-2">
                    <Icon name="star" className="text-secondary text-lg" />
                    <span className="text-sm font-semibold text-on-surface-variant">Google reviews gained</span>
                  </div>
                  <span className="text-base font-black text-secondary flex items-center gap-1">
                    +{estimatedReviews}
                    <Icon name="trending_up" className="text-sm shrink-0" />
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                    <Icon name="private_connectivity" className="text-tertiary text-lg" />
                    <span className="text-sm font-semibold text-on-surface-variant">Private feedback cases</span>
                  </div>
                  <span className="text-base font-black text-on-surface">+{estimatedPrivateFeedback}</span>
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="mt-4 p-3.5 rounded-xl text-xs font-semibold leading-5 flex items-start gap-2 bg-primary/5 text-primary border border-primary/10">
                <Icon name="info" className="text-base shrink-0 mt-0.5" />
                <span>
                  {needsPro ? (
                    <>
                      At this volume, you exceed the Free plan limit. We recommend the <strong className="font-extrabold text-primary">Pro Plan</strong> to handle your traffic and remove branding.
                    </>
                  ) : (
                    <>
                      You are within the Free limit, but upgrade to <strong className="font-extrabold text-primary">Pro</strong> to access premium standee designs and remove the logo watermark.
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="mb-24 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-extrabold text-on-surface font-headline">Compare Features</h3>
            <p className="text-sm text-on-surface-variant mt-2">See exactly what you get in each tier.</p>
          </div>
          
          <div className="bg-white rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
            {/* Mobile View: Cards */}
            <div className="block sm:hidden divide-y divide-outline-variant/10">
              {compareFeatures.map((feature) => (
                <div key={feature.name} className="p-5 space-y-2">
                  <h4 className="text-sm font-bold text-on-surface">{feature.name}</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <p className="text-outline uppercase text-[9px] tracking-wider mb-1">Free</p>
                      <p className={feature.freeHighlight ? "text-error font-medium" : "text-on-surface-variant"}>{feature.free}</p>
                    </div>
                    <div>
                      <p className="text-primary uppercase text-[9px] tracking-wider mb-1">Pro</p>
                      <p className="text-primary">{feature.pro}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table */}
            <table className="hidden sm:table w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container/50 border-b border-outline-variant/30">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Features</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant w-[240px]">Free Plan</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-primary w-[240px]">Pro Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {compareFeatures.map((feature) => (
                  <tr key={feature.name} className="hover:bg-surface-container-low/20 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-on-surface">{feature.name}</td>
                    <td className={`px-6 py-4 text-sm font-semibold ${feature.freeHighlight ? "text-error" : "text-on-surface-variant"}`}>
                      {feature.free}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">{feature.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-extrabold text-on-surface font-headline">Frequently Asked Questions</h3>
            <p className="text-sm text-on-surface-variant mt-2">Have questions about ReviewLoom plans? We have answers.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-sm divide-y divide-outline-variant/15">
            {faqs.map((faq, index) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFaqIndex === index}
                onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
