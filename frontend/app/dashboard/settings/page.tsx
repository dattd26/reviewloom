'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { BillingService, SubscriptionOverviewResponse } from '@/services/billing-service';

import { DashboardLoading } from '@/components/dashboard/DashboardLoading';

export default function Settings() {
  const { getToken, isSignedIn } = useAuth();
  const router = useRouter();
  const [subData, setSubData] = useState<SubscriptionOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBillingData = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const response = await BillingService.getSubscriptionOverview(token);
        setSubData(response);
      } catch (error) {
        console.error("Failed to load billing statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isSignedIn) {
      loadBillingData();
    }
  }, [isSignedIn, getToken]);

  if (isLoading) {
    return <DashboardLoading title="Loading Settings..." description="Accessing your billing & plan status" />;
  }

  const planName = subData?.planName ?? 'Free Plan';
  const subStatus = subData?.status ?? 'active';
  const renewsAt = subData?.renewsAt ? new Date(subData.renewsAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : null;
  const campaignsUsed = subData?.campaignsUsed ?? 0;
  const campaignsLimit = subData?.campaignsLimit ?? 3;
  const cardBrand = subData?.cardBrand;
  const cardLast4 = subData?.cardLast4;
  const billingHistory = subData?.billingHistory ?? [];

  const handleManageSubscription = async () => {
    if (planName === 'Free Plan' || planName === 'Free') {
      router.push('/dashboard/upgrade');
      return;
    }

    try {
      const token = await getToken();
      if (!token) return;
      const res = await BillingService.createPortalSession(token);
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (error) {
      console.error('Failed to open portal:', error);
    }
  };

  // Percentage calculations for progress bar
  const limitPercentage = Math.min((campaignsUsed / campaignsLimit) * 100, 100);

  return (
    <>
      {/* TopNavBar Anchor */}
      <header className="flex justify-between items-center w-full px-8 py-4 bg-white/80 backdrop-blur-xl border-b border-outline-variant/10 z-30 sticky top-0 shadow-sm">
        <div className="flex items-center space-x-8">
          <div className="text-lg font-black font-headline tracking-tighter text-primary">Settings</div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/dashboard" className="text-outline hover:text-primary transition-colors text-sm font-medium">Dashboard</Link>
            <Link href="/dashboard/campaigns" className="text-outline hover:text-primary transition-colors text-sm font-medium">Campaigns</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">notifications</span>
          </div>
          <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">help_outline</span>
        </div>
      </header>

      {/* Main Content Canvas */}
      <div className="p-8 md:p-10 max-w-6xl mx-auto w-full flex-1">

        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold font-headline tracking-tight mb-2 text-on-surface">Billing & Plans</h1>
          <p className="text-on-surface-variant font-medium">Manage your subscription plans, usage limits, and billing details.</p>
        </div>

        {/* Bento Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* 1. Current Plan Summary Card */}
          <div className="col-span-1 md:col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-outline-variant/10 overflow-hidden relative group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block border border-primary/10">
                    {subStatus.toUpperCase()} SUBSCRIPTION
                  </span>
                  <h2 className="text-4xl font-extrabold text-on-surface font-headline">{planName}</h2>
                  {renewsAt && (
                    <p className="text-outline font-medium mt-1.5">
                      {subStatus === 'trialing' ? `Trial ends on ${renewsAt}` : `Renews on ${renewsAt}`}
                    </p>
                  )}
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={handleManageSubscription}
                  className="w-full sm:w-auto bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:bg-primary-container transition-colors shadow-md shadow-primary/20 active:scale-95">
                  {planName === 'Free Plan' || planName === 'Free' ? 'Upgrade to Pro' : 'Manage Subscription'}
                </button>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700"></div>
          </div>

          {/* 2. Usage Card */}
          <div className="col-span-1 md:col-span-6 lg:col-span-5 bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold font-headline text-on-surface">Usage Limits</h3>
                <span className="material-symbols-outlined text-outline">query_stats</span>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-bold text-on-surface-variant">QR Campaigns active</span>
                    <span className="text-lg font-black text-on-surface">{campaignsUsed} <span className="text-sm text-outline font-medium">/ {campaignsLimit}</span></span>
                  </div>
                  <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${limitPercentage}%` }}></div>
                  </div>
                  <p className="text-xs text-outline font-medium mt-3">
                    {campaignsLimit - campaignsUsed > 0 
                      ? `You have ${campaignsLimit - campaignsUsed} campaign opportunities remaining.` 
                      : "You have reached your active campaigns limit. Upgrade for more."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Payment Methods */}
          <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/10">
            <h3 className="text-xl font-bold font-headline mb-6 text-on-surface">Payment Methods</h3>
            <div className="space-y-4 mb-8">
              {cardLast4 ? (
                <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-transparent hover:border-outline-variant/30 transition-all group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-white border border-outline-variant/20 rounded-md flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{cardBrand} ending in {cardLast4}</p>
                      <p className="text-xs text-outline font-medium">Active Card</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-surface-container-low/50 rounded-xl text-center text-xs text-outline font-medium border border-dashed border-outline-variant/20">
                  No billing cards saved. Subscribe to add a card.
                </div>
              )}
            </div>
          </div>

          {/* 4. Billing History Table */}
          <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden flex flex-col">
            <div className="p-6 sm:p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface/30">
              <h3 className="text-xl font-bold font-headline text-on-surface">Billing History</h3>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Date</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Amount</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {billingHistory.map((item, index) => (
                    <tr key={index} className="hover:bg-surface-container-low/30 transition-colors group">
                      <td className="px-8 py-5 text-sm font-bold text-on-surface-variant">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-on-surface">{item.amount}</td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
