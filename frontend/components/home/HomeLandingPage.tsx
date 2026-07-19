"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { PricingSection } from "./PricingSection";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const painPoints = [
  {
    icon: "reviews",
    title: "Happy customers often leave without writing a review",
    copy: "Even satisfied guests move on quickly when there is no clear, low-friction review prompt at the right moment.",
  },
  {
    icon: "forum",
    title: "Unhappy customers need a private channel",
    copy: "When feedback has nowhere to go, frustrated customers are more likely to share the problem publicly first.",
  },
  {
    icon: "query_stats",
    title: "Most QR review signs stop at the scan",
    copy: "Generic QR campaigns rarely show review intent, private feedback volume, or campaign performance by location.",
  },
  {
    icon: "branding_watermark",
    title: "Printed signs should look like your brand",
    copy: "A branded standee feels intentional at a table, front desk, waiting room, checkout counter, or salon station.",
  },
];

const businessTypes = ["Restaurants", "Cafes", "Salons", "Spas", "Dental clinics", "Hotels", "Local services"];

const standeeFeatures = [
  "Customize logo, colors, headline, and call-to-action",
  "Generate campaign-specific QR codes",
  "Preview before printing",
  "Export print-ready PNG assets",
];

const steps = [
  {
    title: "Create a campaign",
    copy: "Set your brand, review link, routing threshold, and campaign settings.",
    icon: "add_business",
  },
  {
    title: "Place your QR standee",
    copy: "Print your branded standee and place it where customers naturally see it.",
    icon: "qr_code_scanner",
  },
  {
    title: "Route feedback intelligently",
    copy: "Happy customers go to Google. Unhappy customers share private feedback with your team.",
    icon: "alt_route",
  },
];

const analytics = [
  { label: "Total scans", value: 1248, suffix: "" },
  { label: "Positive review intent", value: 71, suffix: "%" },
  { label: "Private feedback", value: 86, suffix: "" },
  { label: "Conversion rate", value: 43, suffix: "%" },
];

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`reveal space-y-4 ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}`}>
      <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="font-display text-3xl font-extrabold leading-tight text-on-surface md:text-5xl">{title}</h2>
      <p className="text-base leading-7 text-on-surface-variant md:text-lg">{description}</p>
    </div>
  );
}

export function HomeLandingPage() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          noPreference: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const reduceMotion = context.conditions?.reduceMotion;

          if (reduceMotion) {
            gsap.set(
              ".hero-copy, .hero-visual, .hero-metric, .reveal, .routing-node, .routing-branch, .editor-panel, .standee-preview, .bar-fill, .step-card, .cta-panel",
              {
                autoAlpha: 1,
                y: 0,
                x: 0,
                scale: 1,
                clearProps: "transform,visibility",
              },
            );
            gsap.set(".routing-path", { strokeDashoffset: 0 });
            gsap.set(".bar-fill", { scaleX: 1 });
            return;
          }

          const heroTimeline = gsap.timeline({ defaults: { duration: 0.75, ease: "power3.out" } });
          heroTimeline
            .from(".hero-copy", { y: 26, autoAlpha: 0, stagger: 0.12 })
            .from(".hero-visual", { y: 28, scale: 0.96, autoAlpha: 0 }, "-=0.45")
            .from(".hero-metric", { y: 18, autoAlpha: 0, stagger: 0.08 }, "-=0.35")
            .to(".float-soft", { y: -10, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.25 }, "+=0.1");

          gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
            gsap.from(element, {
              y: 28,
              autoAlpha: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: element,
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            });
          });

          gsap.utils.toArray<HTMLElement>(".pain-card").forEach((card, index) => {
            gsap.from(card, {
              y: 30,
              autoAlpha: 0,
              duration: 0.65,
              delay: index * 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 84%",
                toggleActions: "play none none reverse",
              },
            });
          });

          const routingTimeline = gsap.timeline({
            defaults: { duration: 0.55, ease: "power2.out" },
            scrollTrigger: {
              trigger: ".routing-diagram",
              start: "top 72%",
              toggleActions: "play none none reverse",
            },
          });

          routingTimeline
            .from(".routing-node", { y: 18, autoAlpha: 0, stagger: 0.12 })
            .fromTo(".routing-path", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.95, ease: "power1.inOut" }, "-=0.35")
            .from(".rating-card", { scale: 0.96, autoAlpha: 0 }, "-=0.55")
            .from(".routing-branch", { y: 18, autoAlpha: 0, stagger: 0.15 }, "-=0.25")
            .from(".routing-label", { y: 10, autoAlpha: 0, stagger: 0.08 }, "-=0.2");

          gsap.from(".editor-panel", {
            y: 24,
            autoAlpha: 0,
            stagger: 0.12,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".standee-editor",
              start: "top 76%",
              toggleActions: "play none none reverse",
            },
          });

          gsap.to(".standee-preview", {
            y: -16,
            ease: "none",
            scrollTrigger: {
              trigger: ".standee-editor",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          });

          gsap.utils.toArray<HTMLElement>(".counter").forEach((counter) => {
            const target = Number(counter.dataset.count || 0);
            const suffix = counter.dataset.suffix || "";
            const value = { current: 0 };
            gsap.to(value, {
              current: target,
              duration: 1.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: counter,
                start: "top 84%",
                toggleActions: "play none none reverse",
              },
              onUpdate: () => {
                counter.textContent = `${Math.round(value.current).toLocaleString("en-US")}${suffix}`;
              },
            });
          });

          gsap.fromTo(
            ".bar-fill",
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "left center",
              duration: 0.9,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".analytics-dashboard",
                start: "top 76%",
                toggleActions: "play none none reverse",
              },
            },
          );

          gsap.from(".step-card", {
            y: 28,
            autoAlpha: 0,
            stagger: 0.12,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".steps-grid",
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });

          gsap.from(".cta-panel", {
            y: 22,
            scale: 0.98,
            autoAlpha: 0,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".cta-panel",
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <main ref={rootRef} className="overflow-hidden pt-24">
      <HeroSection />
      <ProblemSection />
      <SmartRoutingSection />
      <StandeeDesignerSection />
      <AnalyticsPreviewSection />
      <HowItWorksSection />
      <PricingSection />
      <HomeCTASection />
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative px-6 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-9">
          <div className="space-y-5">
            <p className="hero-copy inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-fixed/55 px-4 py-2 font-label text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Review generation for local businesses
            </p>
            <h1 className="hero-copy max-w-4xl font-display text-4xl font-extrabold leading-[1.05] text-on-surface md:text-6xl">
              Guide happy customers to Google. Capture unhappy feedback privately.
            </h1>
            <p className="hero-copy max-w-2xl text-lg leading-8 text-on-surface-variant">
              ReviewLoom helps local businesses collect more public reviews from happy customers while routing negative experiences into a private feedback flow your team can act on.
            </p>
          </div>

          <div className="hero-copy flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 font-bold text-on-primary shadow-lg shadow-primary/15 transition hover:bg-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              Start your first campaign
              <Icon name="arrow_forward" className="text-xl" />
            </Link>
            <Link
              href="#smart-routing"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-outline-variant/70 bg-white px-6 py-4 font-bold text-primary transition hover:bg-surface-container-low focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              See how it works
            </Link>
          </div>

          <div className="hero-copy flex flex-wrap gap-2 pt-2" aria-label="Business types served">
            {businessTypes.map((type) => (
              <span key={type} className="rounded-full bg-surface-container-low px-3 py-1.5 text-sm font-semibold text-on-surface-variant">
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-visual relative min-h-[560px]">
          <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(135deg,#eef3ff,#f7f9fb_45%,#eafaf3)]" />
          <div className="relative mx-auto flex h-full max-w-xl items-center justify-center p-4 md:p-8">
            <div className="float-soft standee-preview w-[250px] rounded-2xl bg-white p-5 shadow-2xl shadow-primary/10 ring-1 ring-outline-variant/40 md:w-[292px]">
              <div className="rounded-xl bg-primary px-5 py-4 text-on-primary">
                <p className="text-sm font-bold">Harbor Dental Studio</p>
                <p className="mt-1 text-xs text-on-primary/80">Tell us about your visit</p>
              </div>
              <div className="mx-auto mt-6 grid h-36 w-36 grid-cols-5 gap-1 rounded-xl bg-surface p-3" aria-hidden="true">
                {Array.from({ length: 25 }).map((_, index) => (
                  <div key={index} className={`rounded-sm ${index % 3 === 0 || index % 7 === 0 ? "bg-on-surface" : "bg-surface-container-highest"}`} />
                ))}
              </div>
              <p className="mt-5 text-center text-xl font-extrabold text-on-surface">Scan to leave feedback</p>
              <p className="mt-2 text-center text-sm leading-6 text-on-surface-variant">Your review helps local patients choose with confidence.</p>
            </div>

            <div className="float-soft absolute left-0 top-6 hidden w-56 rounded-xl border border-outline-variant/40 bg-white/90 p-4 shadow-xl shadow-primary/10 glass-effect sm:block">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Product flow</p>
              <div className="mt-4 space-y-3 text-sm font-semibold text-on-surface">
                {["Scan QR", "Choose rating", "Smart routing", "Google review or private feedback"].map((label) => (
                  <div key={label} className="flex items-center gap-2">
                    <Icon name="check_circle" className="text-lg text-secondary" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <MetricCard className="hero-metric left-2 bottom-20" icon="monitoring" label="Campaign scans measured" value="1,248" />
            <MetricCard className="hero-metric right-2 top-14" icon="rate_review" label="Review intent tracked" value="71%" />
            <MetricCard className="hero-metric right-0 bottom-8" icon="lock" label="Private feedback captured" value="86" />
            <MetricCard className="hero-metric left-8 top-[330px]" icon="print" label="Print-ready standees" value="PNG" />
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ icon, label, value, className }: { icon: string; label: string; value: string; className: string }) {
  return (
    <div className={`absolute hidden w-52 rounded-xl border border-outline-variant/40 bg-white/90 p-4 shadow-xl shadow-primary/10 glass-effect md:block ${className}`}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-primary">
          <Icon name={icon} className="text-xl" />
        </div>
        <div>
          <div className="text-xl font-extrabold text-on-surface">{value}</div>
          <p className="text-xs font-semibold text-on-surface-variant">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section id="features" className="bg-surface-container-low px-6 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="The problem"
          title="Local reviews are too important to leave to chance"
          description="ReviewLoom gives restaurants, cafes, salons, spas, dental clinics, hotels, and service businesses a measurable way to ask for reviews and respond to concerns before they become public."
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((point) => (
            <article key={point.title} className="pain-card rounded-xl border border-outline-variant/35 bg-white p-6 shadow-sm">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-primary-fixed text-primary">
                <Icon name={point.icon} />
              </div>
              <h3 className="text-lg font-extrabold leading-7 text-on-surface">{point.title}</h3>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{point.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SmartRoutingSection() {
  return (
    <section id="smart-routing" className="px-6 py-24 md:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHeader
          align="left"
          eyebrow="Smart routing"
          title="Smart Feedback Routing"
          description="Set a rating threshold once. ReviewLoom automatically guides each customer to the right next step based on their experience."
        />

        <div className="routing-diagram rounded-2xl border border-outline-variant/40 bg-white p-5 shadow-xl shadow-primary/5 md:p-8">
          <div className="grid gap-5 md:grid-cols-[1fr_120px_1fr] md:items-center">
            <RoutingNode icon="qr_code_2" title="Customer scans QR" copy="A table standee, receipt, front desk sign, or checkout counter starts the flow." />
            <div className="routing-node hidden justify-center md:flex">
              <Icon name="arrow_forward" className="text-4xl text-outline" />
            </div>
            <div className="rating-card rounded-xl border border-primary/20 bg-primary-fixed/55 p-5">
              <p className="font-bold text-on-surface">Selects a rating</p>
              <div className="mt-4 grid grid-cols-5 gap-2" aria-label="Five star rating selector mockup">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <div key={rating} className={`flex aspect-square items-center justify-center rounded-lg text-sm font-extrabold ${rating >= 4 ? "bg-secondary text-on-secondary" : "bg-white text-on-surface-variant"}`}>
                    {rating}
                  </div>
                ))}
              </div>
              <p className="routing-label mt-4 rounded-lg bg-white px-3 py-2 text-sm font-bold text-primary">Routing threshold: 4 stars</p>
            </div>
          </div>

          <svg className="my-4 hidden h-24 w-full md:block" viewBox="0 0 760 120" fill="none" aria-hidden="true">
            <path className="routing-path" pathLength="1" d="M380 4 V52 C380 82 255 82 255 116" stroke="#0037b0" strokeWidth="3" strokeLinecap="round" strokeDasharray="1" />
            <path className="routing-path" pathLength="1" d="M380 52 C380 82 505 82 505 116" stroke="#006c49" strokeWidth="3" strokeLinecap="round" strokeDasharray="1" />
          </svg>

          <div className="grid gap-5 md:grid-cols-2">
            <RoutingBranch
              tone="positive"
              label="Positive experience"
              title="Route to Google review"
              copy="Customers who select 4-5 stars continue to your Google review link."
              icon="open_in_new"
            />
            <RoutingBranch
              tone="attention"
              label="Needs attention"
              title="Capture private feedback"
              copy="Customers who select 1-3 stars can send private feedback to your team."
              icon="shield_lock"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function RoutingNode({ icon, title, copy }: { icon: string; title: string; copy: string }) {
  return (
    <div className="routing-node rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-on-primary">
        <Icon name={icon} />
      </div>
      <p className="font-extrabold text-on-surface">{title}</p>
      <p className="mt-2 text-sm leading-6 text-on-surface-variant">{copy}</p>
    </div>
  );
}

function RoutingBranch({
  tone,
  label,
  title,
  copy,
  icon,
}: {
  tone: "positive" | "attention";
  label: string;
  title: string;
  copy: string;
  icon: string;
}) {
  const isPositive = tone === "positive";
  return (
    <div className={`routing-branch rounded-xl border p-5 ${isPositive ? "border-secondary/25 bg-secondary-container/25" : "border-error/20 bg-error-container/35"}`}>
      <p className={`routing-label text-xs font-bold uppercase tracking-[0.16em] ${isPositive ? "text-secondary" : "text-on-error-container"}`}>{label}</p>
      <div className="mt-4 flex items-start gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isPositive ? "bg-secondary text-on-secondary" : "bg-error text-on-error"}`}>
          <Icon name={icon} className="text-xl" />
        </div>
        <div>
          <h3 className="font-extrabold text-on-surface">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">{copy}</p>
        </div>
      </div>
    </div>
  );
}

function StandeeDesignerSection() {
  return (
    <section className="bg-surface-container-low px-6 py-24 md:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="standee-editor order-2 grid gap-4 md:grid-cols-[0.8fr_1.05fr_0.8fr] lg:order-1">
          <div className="editor-panel rounded-xl border border-outline-variant/35 bg-white p-5 shadow-sm">
            <p className="font-bold text-on-surface">Brand settings</p>
            <div className="mt-5 space-y-4">
              <MockControl label="Logo" value="Uploaded" />
              <MockControl label="Primary color" value="Blue" />
              <MockControl label="Headline" value="Scan to share feedback" />
            </div>
          </div>
          <div className="standee-preview editor-panel rounded-2xl border border-primary/20 bg-white p-5 shadow-xl shadow-primary/10">
            <div className="rounded-xl bg-on-surface px-4 py-5 text-center text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/70">Standee preview</p>
              <h3 className="mt-3 text-2xl font-extrabold">How was your visit?</h3>
            </div>
            <div className="mx-auto mt-6 grid h-32 w-32 grid-cols-6 gap-1 rounded-xl bg-surface p-3" aria-hidden="true">
              {Array.from({ length: 36 }).map((_, index) => (
                <span key={index} className={`rounded-[2px] ${index % 4 === 0 || index % 9 === 0 ? "bg-on-surface" : "bg-surface-container-highest"}`} />
              ))}
            </div>
            <p className="mt-5 text-center text-sm font-semibold text-on-surface-variant">Scan. Rate. Share.</p>
          </div>
          <div className="editor-panel rounded-xl border border-outline-variant/35 bg-white p-5 shadow-sm">
            <p className="font-bold text-on-surface">Export controls</p>
            <div className="mt-5 space-y-3">
              <MockControl label="Format" value="PNG" />
              <MockControl label="Quality" value="High resolution" />
              <button className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary">Export PNG</button>
            </div>
          </div>
        </div>

        <div className="order-1 space-y-7 lg:order-2">
          <SectionHeader
            align="left"
            eyebrow="Standee designer"
            title="Design print-ready QR standees in minutes"
            description="Create branded table standees for your front desk, dining tables, waiting room, or checkout counter. Export high-resolution PNG files ready for print."
          />
          <ul className="reveal grid gap-3">
            {standeeFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-3 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-on-surface shadow-sm">
                <Icon name="check_circle" className="text-xl text-secondary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function MockControl({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">{label}</p>
      <div className="mt-2 rounded-lg bg-surface-container-low px-3 py-2 text-sm font-semibold text-on-surface">{value}</div>
    </div>
  );
}

function AnalyticsPreviewSection() {
  return (
    <section className="px-6 py-24 md:px-8">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHeader
          align="left"
          eyebrow="Analytics"
          title="Know what happens after every scan"
          description="Track scan activity, review intent, private feedback, and campaign performance from one dashboard."
        />
        <div className="analytics-dashboard rounded-2xl border border-outline-variant/40 bg-white p-5 shadow-xl shadow-primary/5 md:p-7">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {analytics.map((item) => (
              <div key={item.label} className="rounded-xl bg-surface-container-low p-4">
                <p className="text-sm font-semibold text-on-surface-variant">{item.label}</p>
                <p className="counter mt-3 text-3xl font-extrabold text-on-surface" data-count={item.value} data-suffix={item.suffix}>
                  0{item.suffix}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-7 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-extrabold text-on-surface">Campaign performance</h3>
                <span className="rounded-full bg-secondary-container px-3 py-1 text-xs font-bold text-on-secondary-container">Live view</span>
              </div>
              <div className="space-y-4">
                {[
                  ["Front desk standee", "82%"],
                  ["Dining table QR", "68%"],
                  ["Receipt insert", "54%"],
                  ["Checkout counter", "47%"],
                ].map(([label, width]) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between text-sm font-semibold text-on-surface-variant">
                      <span>{label}</span>
                      <span>{width}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-surface-container-high">
                      <div className="bar-fill h-full rounded-full bg-primary" style={{ width }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-on-surface p-5 text-white">
              <h3 className="font-extrabold">Top performing locations</h3>
              <div className="mt-5 space-y-4">
                {["Downtown clinic", "Lakeview cafe", "Northside salon"].map((location, index) => (
                  <div key={location} className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-3">
                    <span className="text-sm font-semibold">{location}</span>
                    <span className="text-sm font-bold text-secondary-container">#{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-surface-container-low px-6 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="How it works"
          title="How ReviewLoom works"
          description="Launch a QR campaign, place your branded standee, and let Smart Feedback Routing guide customers to the right destination."
        />
        <div className="steps-grid relative mt-14 grid gap-5 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-12 hidden h-px bg-outline-variant/60 md:block" aria-hidden="true" />
          {steps.map((step, index) => (
            <article key={step.title} className="step-card relative rounded-xl border border-outline-variant/35 bg-white p-7 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-on-primary">
                <Icon name={step.icon} className="text-3xl" />
              </div>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-primary">Step {index + 1}</p>
              <h3 className="mt-2 text-xl font-extrabold text-on-surface">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-on-surface-variant">{step.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeCTASection() {
  return (
    <section id="get-started-cta" className="px-6 py-24 md:px-8">
      <div className="cta-panel mx-auto grid max-w-7xl gap-8 rounded-2xl bg-primary p-8 text-on-primary shadow-2xl shadow-primary/20 md:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="max-w-3xl">
          <p className="font-label text-xs font-bold uppercase tracking-[0.18em] text-on-primary/75">Launch smarter review campaigns</p>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-5xl">
            Build a smarter review funnel for your local business
          </h2>
          <p className="mt-5 text-lg leading-8 text-on-primary/85">
            Use ReviewLoom to launch branded QR campaigns, capture private feedback, and measure review performance from one place.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-4 font-bold text-primary transition hover:bg-primary-fixed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Start your first campaign
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center rounded-lg border border-white/35 px-6 py-4 font-bold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            View pricing
          </Link>
        </div>
      </div>
    </section>
  );
}
