'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { BillingService } from '@/services/billing-service';
import Link from 'next/link';

export default function UpgradePage() {
  const { getToken } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      const token = await getToken();
      if (!token) return;
      const response = await BillingService.createCheckoutSession(token, 'pro');
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-outline hover:text-primary transition-colors font-semibold text-sm mb-6">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-black font-headline text-on-surface tracking-tight mb-4">
            Upgrade your Business
          </h1>
          <p className="text-on-surface-variant font-medium text-lg">
            Unlock premium features to get more reviews and grow your reputation.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10 shadow-sm flex flex-col relative opacity-80">
            <div className="mb-8">
              <h3 className="text-2xl font-black text-on-surface font-headline mb-2">Free</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-on-surface">$0</span>
                <span className="text-outline font-medium">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                '1 location',
                '1 campaign',
                '100 scans / month',
                '50 feedback / month',
                'Analytics (7 days)',
                'ReviewLoom watermark on landing page',
                'ReviewLoom watermark on standee',
                'No custom domain'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-outline text-[20px] shrink-0">check</span>
                  <span className="text-on-surface-variant text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              disabled
              className="w-full py-3.5 rounded-xl font-bold bg-surface-container-low text-outline cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-3xl p-8 border-2 border-primary shadow-xl shadow-primary/10 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
              Most Popular
            </div>

            <div className="mb-8 mt-2">
              <h3 className="text-2xl font-black text-primary font-headline mb-2">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-on-surface">$29</span>
                <span className="text-outline font-medium">/month</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {[
                'Unlimited campaigns',
                'Unlimited QR codes',
                '5,000 scans / month',
                '2,000 feedback / month',
                'White-label branding',
                'Full Analytics',
                'Premium standee templates',
                'No watermark',
                'Email support'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 font-bold">check_circle</span>
                  <span className="text-on-surface font-semibold text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="w-full py-3.5 rounded-xl font-black text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Upgrade to Pro'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
