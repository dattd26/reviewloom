'use client';

import { useAuth } from '@clerk/nextjs';
import { useState } from 'react';
import { BillingService } from '@/services/billing-service';
import Link from 'next/link';

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export default function UpgradePage() {
  const { getToken } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [dailyCustomers, setDailyCustomers] = useState<number>(50);

  // Calculations for ROI Calculator
  const scanRate = 0.15;
  const happyRate = 0.72;
  const privateFeedbackRate = 0.28 * 0.65;

  const monthlyCustomers = dailyCustomers * 30;
  const estimatedScans = Math.round(monthlyCustomers * scanRate);
  const estimatedReviews = Math.round(estimatedScans * happyRate);
  const estimatedPrivateFeedback = Math.round(estimatedScans * privateFeedbackRate);

  const needsPro = estimatedScans > 100;

  const handleUpgrade = async (planId: 'monthly' | 'yearly') => {
    setLoadingPlan(planId);
    try {
      const token = await getToken();
      if (!token) return;
      const response = await BillingService.createCheckoutSession(token, planId);
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/40 p-6 md:p-12 relative overflow-hidden flex flex-col justify-between">
      {/* Decorative gradient accents */}
      <div className="absolute left-1/4 top-10 -z-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute right-1/4 bottom-10 -z-10 h-72 w-72 rounded-full bg-secondary/5 blur-3xl" />

      <div className="max-w-5xl w-full mx-auto flex-1">
        {/* Navigation Breadcrumbs */}
        <div className="mb-10">
          <Link href="/dashboard/settings" className="inline-flex items-center gap-2 text-outline hover:text-primary transition-colors font-bold text-sm">
            <Icon name="arrow_back" className="text-lg" />
            Back to Settings
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black font-headline text-on-surface tracking-tight">
            Upgrade your Reputation Plan
          </h1>
          <p className="text-on-surface-variant font-semibold text-base md:text-lg max-w-2xl mx-auto">
            Choose the best plan to unlock unlimited QR campaigns, premium templates, and white-label branding.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex justify-center">
            <div className="relative grid grid-cols-2 bg-surface-container rounded-full p-1 border border-outline-variant/30 w-full max-w-[340px] sm:max-w-[380px]">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`relative z-10 w-full text-center py-2 text-sm font-bold rounded-full transition-colors duration-300 cursor-pointer ${
                  billingPeriod === 'monthly' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`relative z-10 w-full flex items-center justify-center gap-1.5 py-2 text-sm font-bold rounded-full transition-colors duration-300 cursor-pointer ${
                  billingPeriod === 'yearly' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Yearly
                <span className="bg-secondary text-on-secondary px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
                  -17%
                </span>
              </button>
              {/* Sliding background */}
              <div
                className="absolute top-1 bottom-1 rounded-full bg-white shadow-sm transition-all duration-300"
                style={{
                  width: 'calc(50% - 4px)',
                  left: billingPeriod === 'monthly' ? '4px' : '50%',
                }}
              />
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto items-stretch mb-16">
          {/* Free Plan Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-outline-variant/40 shadow-sm flex flex-col justify-between opacity-80 hover:opacity-100 transition-all duration-300">
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-outline">Starter Tier</span>
                <h3 className="text-2xl font-extrabold text-on-surface font-headline mt-1">Free</h3>
                <p className="text-sm text-on-surface-variant mt-2 min-h-12">
                  Basic review collection limits with standard templates.
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-on-surface tracking-tight">$0</span>
                  <span className="text-outline text-sm font-medium">/ month</span>
                </div>
              </div>

              <div className="h-px bg-outline-variant/30 my-6" />

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Icon name="check" className="text-outline text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-medium">Up to 3 active campaigns</span>
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
                  <span className="text-on-surface text-sm font-medium">7-day performance history</span>
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard/settings"
              className="w-full py-3.5 rounded-xl font-bold text-center bg-surface-container text-outline border border-outline-variant/20"
            >
              Current Plan
            </Link>
          </div>

          {/* Pro Plan Card */}
          <div className="relative rounded-3xl p-8 border-2 border-primary bg-white shadow-xl shadow-primary/5 flex flex-col justify-between hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 group">
            {/* Glowing ring/effect */}
            <div className="absolute -right-20 -top-20 w-44 h-44 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700 pointer-events-none" />

            <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
              Most Popular
            </div>

            <div className="relative z-10">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Full Business Suite</span>
                <h3 className="text-2xl font-extrabold text-primary font-headline mt-1">Pro Plan</h3>
                <p className="text-sm text-on-surface-variant mt-2 min-h-12">
                  White-label designs, unlimited campaigns, and priority email support.
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  {billingPeriod === 'monthly' ? (
                    <>
                      <span className="text-4xl font-black text-on-surface tracking-tight">$29</span>
                      <span className="text-outline text-sm font-medium">/ month</span>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black text-on-surface tracking-tight">$24</span>
                          <span className="text-outline text-sm font-medium">/ month</span>
                        </div>
                        <span className="text-[11px] font-bold text-secondary mt-1">Billed $290 annually (save $58/yr)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="h-px bg-primary/25 my-6" />

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-semibold">Unlimited campaigns & QR codes</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-semibold">5,000 scans / month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-semibold">2,000 private feedbacks / month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-semibold">White-label customization</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="check_circle" className="text-secondary text-[20px] shrink-0 font-bold" />
                  <span className="text-on-surface text-sm font-semibold">All 12+ Premium standee designs</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleUpgrade(billingPeriod)}
              disabled={loadingPlan !== null}
              className="w-full py-4 rounded-xl font-black text-white bg-primary hover:bg-primary/95 transition-all duration-300 active:scale-98 shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loadingPlan === billingPeriod ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                `Choose Pro ${billingPeriod === 'monthly' ? 'Monthly' : 'Yearly'}`
              )}
            </button>
          </div>
        </div>

        {/* ROI Calculator section inside upgrade flow */}
        <div className="bg-white rounded-3xl p-8 border border-outline-variant/35 mb-16 max-w-3xl mx-auto shadow-sm relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-4">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest inline-block border border-primary/10">
                Growth Estimator
              </span>
              <h3 className="text-xl font-extrabold text-on-surface font-headline">
                Calculate your reputation growth
              </h3>
              <p className="text-xs leading-5 text-on-surface-variant">
                Adjust your daily customer traffic slider to estimate how many scans and positive Google reviews you can capture on our platform.
              </p>

              {/* Slider Control */}
              <div className="pt-2 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-on-surface-variant">Estimated daily traffic</span>
                  <span className="text-sm font-black text-primary bg-slate-50 px-2 py-1 rounded-lg border border-outline-variant/40 shadow-sm">
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
                  className="w-full h-1.5 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
                  aria-label="Daily customers slider"
                />
              </div>
            </div>

            {/* Projected Outputs */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-outline-variant/30 space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-outline">Projected Monthly Results</h4>
              
              <div className="space-y-3 text-sm font-semibold">
                <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant font-medium">QR Scans / month</span>
                  <span className="text-on-surface font-black">{estimatedScans}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-outline-variant/10">
                  <span className="text-on-surface-variant font-medium">New Google reviews</span>
                  <span className="text-secondary font-black">+{estimatedReviews}</span>
                </div>

                <div className="flex justify-between items-center py-1.5">
                  <span className="text-on-surface-variant font-medium">Negative reviews averted</span>
                  <span className="text-on-surface font-black">+{estimatedPrivateFeedback}</span>
                </div>
              </div>

              {/* Recommendation Note */}
              <div className="p-3 rounded-xl text-[11px] font-semibold leading-4 bg-primary/5 text-primary border border-primary/10">
                <span>
                  {needsPro ? (
                    <>
                      You will exceed Free limits ({estimatedScans}/100 scans). <strong className="font-extrabold">Pro Plan</strong> is recommended.
                    </>
                  ) : (
                    <>
                      Within Free plan limits, but Pro gives you premium designs and removes the watermark.
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
