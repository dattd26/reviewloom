'use client'

import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect, useState, useRef } from 'react';
import { DashboardService, DashboardOverviewResponse } from '@/services/dashboard-service';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function DashboardOverview() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [data, setData] = useState<DashboardOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const response = await DashboardService.getOverview(token);
        setData(response);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isSignedIn) {
      loadDashboardData();
    }
  }, [isSignedIn, getToken]);

  // GSAP Entrance Animations
  useGSAP(() => {
    if (!isLoaded || isLoading) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        noPreference: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const reduceMotion = context.conditions?.reduceMotion;
        if (reduceMotion) {
          gsap.set(".animate-fade-in, .animate-slide-up", {
            opacity: 1,
            y: 0,
            scale: 1,
            visibility: "visible",
          });
          return;
        }

        const tl = gsap.timeline({ defaults: { duration: 0.65, ease: "power3.out" } });
        tl.fromTo(".animate-fade-in", 
          { opacity: 0, y: -12 },
          { opacity: 1, y: 0, stagger: 0.06 }
        )
        .fromTo(".animate-slide-up", 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.08 }, 
          "-=0.35"
        );
      }
    );

    return () => mm.revert();
  }, [isLoaded, isLoading]);

  // Handle loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary/10 border-t-primary rounded-full animate-spin" />
          <p className="font-headline text-[10px] font-bold text-outline uppercase tracking-[0.2em] opacity-80">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  // Protect the page from unauthenticated users
  if (!isSignedIn) return <div>Sign in to view this page</div>;

  const getRelativeTimeString = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 10) return 'Just now';
    if (diffSecs < 60) return `${diffSecs} seconds ago`;
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const totalScans = data?.totalScans ?? 0;
  const positivePercentage = data?.positivePercentage ?? 0;
  const newPrivateFeedback = data?.newPrivateFeedback ?? 0;

  // Chart and Sparkline Calculations
  const scansGrowth = data?.scansGrowth ?? [];
  const maxVal = scansGrowth.length > 0 ? Math.max(...scansGrowth.map(g => g.total), 10) : 10;
  const lastIndex = scansGrowth.length - 1;

  const generateSparklinePoints = (width: number, height: number) => {
    if (scansGrowth.length === 0) {
      return "M0,25 Q10,15 20,20 T40,10 T60,15 T80,5 T100,12"; // default fallback
    }
    const maxGrowthTotal = Math.max(...scansGrowth.map(g => g.total), 1);
    const points = scansGrowth.map((g, index) => {
      const x = (index / Math.max(scansGrowth.length - 1, 1)) * width;
      const y = height - ((g.total / maxGrowthTotal) * (height - 10)) - 5;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    });
    return points.join(' ');
  };

  const generateSparklineAreaPoints = (width: number, height: number) => {
    const linePath = generateSparklinePoints(width, height);
    if (!linePath) return '';
    return `${linePath} L ${width} ${height} L 0 ${height} Z`;
  };

  const generateChartPoints = (key: 'total' | 'positive' | 'negative', width: number, height: number) => {
    if (scansGrowth.length === 0) return '';
    const points = scansGrowth.map((g, index) => {
      const x = (index / Math.max(scansGrowth.length - 1, 1)) * width;
      const val = g[key] || 0;
      const y = height - ((val / maxVal) * (height - 40)) - 20;
      return `${x},${y}`;
    });
    return points.join(' ');
  };

  const generateAreaPoints = (key: 'total' | 'positive' | 'negative', width: number, height: number) => {
    if (scansGrowth.length === 0) return '';
    const linePoints = generateChartPoints(key, width, height);
    return `0,${height} ${linePoints} ${width},${height} Z`;
  };

  return (
    <div ref={containerRef} className="flex-1 flex flex-col min-h-screen">
      {/* TopAppBar */}
      <header className="animate-fade-in sticky top-0 z-40 w-full bg-white/85 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="px-8 h-20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div>
            <h2 className="text-xl font-headline font-black text-on-surface tracking-tight leading-none">
              Welcome back, {user?.firstName || 'Owner'}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-outline mt-1.5 opacity-60">
              Reputation Overview &bull; Last 30 Days
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center bg-surface-container-lowest/80 px-4 py-2 rounded-xl gap-3 border border-outline-variant/15 hover:bg-surface-container-low hover:border-outline-variant/30 transition-[background-color,border-color] duration-300 cursor-pointer group">
              <span className="material-symbols-outlined text-outline text-sm group-hover:text-primary transition-colors">calendar_today</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant select-none">Last 30 Days</span>
              <span className="material-symbols-outlined text-outline text-sm transition-transform group-hover:translate-y-[1px]">expand_more</span>
            </div>
            <button className="w-10 h-10 flex items-center justify-center text-outline hover:text-primary transition-all rounded-xl hover:bg-primary/5 border border-outline-variant/15 hover:border-primary/20">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content Canvas */}
      <div className="p-8 space-y-8 flex-1">
        {/* 1. Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Scans */}
          <div className="animate-slide-up bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:border-primary/20 hover:shadow-md transition-[border-color,box-shadow,transform,background-color] duration-300 hover:-translate-y-[2px] group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-xl transition-colors group-hover:bg-primary/15">
                <span className="material-symbols-outlined text-primary">qr_code_2</span>
              </div>
            </div>
            <p className="font-label text-[11px] font-bold text-outline uppercase tracking-[0.12em] mb-1.5">Total Scans</p>
            <h3 className="font-headline font-extrabold text-3xl mb-4 text-on-surface">{totalScans.toLocaleString()}</h3>
            
            {/* Sparkline SVG with area fill */}
            <svg className="w-full h-12 overflow-visible" viewBox="0 0 100 30">
              <defs>
                <linearGradient id="sparkline-total-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={generateSparklineAreaPoints(100, 30)} fill="url(#sparkline-total-grad)" />
              <path d={generateSparklinePoints(100, 30)} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>

          {/* Positive Feedback % */}
          <div className="animate-slide-up bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:border-secondary/20 hover:shadow-md transition-[border-color,box-shadow,transform,background-color] duration-300 hover:-translate-y-[2px] group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-secondary/10 rounded-xl transition-colors group-hover:bg-secondary/15">
                <span className="material-symbols-outlined text-secondary">sentiment_very_satisfied</span>
              </div>
              <span className="material-symbols-outlined text-secondary text-sm animate-bounce">trending_up</span>
            </div>
            <p className="font-label text-[11px] font-bold text-outline uppercase tracking-[0.12em] mb-1.5">Positive Feedback %</p>
            <div className="flex items-baseline gap-2 mb-3">
              <h3 className="font-headline font-extrabold text-3xl text-secondary">{positivePercentage}%</h3>
              <span className="font-label text-[10px] font-bold text-secondary uppercase tracking-wider">Routed to Google</span>
            </div>
            <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden relative">
              <div className="h-full bg-gradient-to-r from-secondary to-secondary/80 rounded-full transition-all duration-500" style={{ width: `${positivePercentage}%` }} />
            </div>
          </div>

          {/* New Private Feedback */}
          <div className={`animate-slide-up bg-surface-container-lowest p-6 rounded-2xl shadow-sm transition-[border-color,box-shadow,transform,background-color] duration-300 hover:-translate-y-[2px] group ${
            newPrivateFeedback > 0 
              ? 'border border-error/20 hover:border-error/40 hover:shadow-error/[0.02]' 
              : 'border border-outline-variant/10 hover:border-outline/20 hover:shadow-md'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-xl transition-colors ${newPrivateFeedback > 0 ? 'bg-error/10' : 'bg-outline/10'}`}>
                <span className={`material-symbols-outlined ${newPrivateFeedback > 0 ? 'text-error' : 'text-outline'}`}>
                  {newPrivateFeedback > 0 ? 'warning' : 'inbox'}
                </span>
              </div>
              {newPrivateFeedback > 0 && (
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error"></span>
                </span>
              )}
            </div>
            <p className="font-label text-[11px] font-bold text-outline uppercase tracking-[0.12em] mb-1.5">New Private Feedback</p>
            <div className="flex items-baseline gap-2">
              <h3 className={`font-headline font-extrabold text-3xl ${newPrivateFeedback > 0 ? 'text-error' : 'text-on-surface'}`}>{newPrivateFeedback}</h3>
              <span className={`font-label text-[10px] font-bold uppercase tracking-wider ${newPrivateFeedback > 0 ? 'text-error' : 'text-outline opacity-70'}`}>
                {newPrivateFeedback > 0 ? 'Needs Attention' : 'All Cleared'}
              </span>
            </div>
            <p className="mt-4 text-xs text-outline leading-relaxed">
              {newPrivateFeedback > 0 
                ? `Action required on ${newPrivateFeedback} private response${newPrivateFeedback > 1 ? 's' : ''} from unhappy customers.` 
                : "No private complaints require attention at this time."}
            </p>
          </div>
        </section>

        {/* 2. Main Chart */}
        <section className="animate-slide-up bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h3 className="font-headline font-bold text-lg text-on-surface tracking-tight">Review Growth Over Time</h3>
              <p className="font-label text-xs text-outline mt-1">Comparative view of scans versus customer feedback sentiment</p>
            </div>
            <div className="flex gap-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="font-label text-xs font-semibold text-on-surface-variant">Scans</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <span className="font-label text-xs font-semibold text-on-surface-variant">Positive</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                <span className="font-label text-xs font-semibold text-on-surface-variant">Negative</span>
              </div>
            </div>
          </div>

          {/* Dynamic SVG Chart */}
          <div className="relative w-full h-80 bg-surface-container-low/20 rounded-2xl flex items-end p-4 overflow-hidden border border-outline-variant/5">
            {scansGrowth.length > 0 ? (
              <>
                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 320">
                  <defs>
                    <linearGradient id="chart-grad-primary" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                    </linearGradient>
                    <filter id="shadow-total" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="var(--color-primary)" floodOpacity="0.12" />
                    </filter>
                    <filter id="shadow-positive" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="var(--color-secondary)" floodOpacity="0.1" />
                    </filter>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  <line x1="0" y1="20" x2="1000" y2="20" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />
                  <line x1="0" y1="90" x2="1000" y2="90" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />
                  <line x1="0" y1="160" x2="1000" y2="160" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />
                  <line x1="0" y1="230" x2="1000" y2="230" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />
                  <line x1="0" y1="300" x2="1000" y2="300" stroke="var(--color-outline-variant)" strokeOpacity="0.12" strokeWidth="1" />

                  {/* Area Fill for Total Scans */}
                  <polygon points={generateAreaPoints('total', 1000, 320)} fill="url(#chart-grad-primary)" />

                  {/* Scan Line (Total) */}
                  <polyline points={generateChartPoints('total', 1000, 320)} fill="none" stroke="var(--color-primary)" strokeWidth="3.5" filter="url(#shadow-total)" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Positive Line */}
                  <polyline points={generateChartPoints('positive', 1000, 320)} fill="none" stroke="var(--color-secondary)" strokeWidth="3" filter="url(#shadow-positive)" strokeLinecap="round" strokeLinejoin="round" />
                  
                  {/* Negative Line */}
                  <polyline points={generateChartPoints('negative', 1000, 320)} fill="none" stroke="var(--color-error)" strokeWidth="2" strokeDasharray="5,5" strokeLinecap="round" />

                  {/* Glow dots for last coordinates */}
                  <circle cx={1000} cy={320 - ((scansGrowth[lastIndex].total / maxVal) * 280) - 20} r="6" fill="var(--color-primary)" stroke="#ffffff" strokeWidth="2.5" className="animate-pulse" />
                  <circle cx={1000} cy={320 - (((scansGrowth[lastIndex].positive || 0) / maxVal) * 280) - 20} r="6" fill="var(--color-secondary)" stroke="#ffffff" strokeWidth="2.5" className="animate-pulse" />
                </svg>

                {/* Y Axis Labels */}
                <div className="absolute left-6 top-4 bottom-4 flex flex-col justify-between text-[10px] font-label font-bold text-outline opacity-50 pointer-events-none select-none">
                  <span>{maxVal}</span>
                  <span>{Math.round(maxVal * 0.75)}</span>
                  <span>{Math.round(maxVal * 0.5)}</span>
                  <span>{Math.round(maxVal * 0.25)}</span>
                  <span>0</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-sm text-outline opacity-60">
                <span className="material-symbols-outlined text-3xl">show_chart</span>
                <p className="font-semibold text-xs">No activity records in the last 30 days</p>
              </div>
            )}
          </div>
          
          {scansGrowth.length > 0 && (
            <div className="flex justify-between mt-4 px-4 text-[9px] font-label font-bold text-outline uppercase tracking-[0.2em] opacity-60">
              <span>{new Date(scansGrowth[0].date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
              <span>{new Date(scansGrowth[Math.floor(scansGrowth.length / 2)].date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
              <span>{new Date(scansGrowth[scansGrowth.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
            </div>
          )}
        </section>

        {/* 3. Recent Activity */}
        <section className="animate-slide-up space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-headline font-bold text-lg text-on-surface tracking-tight">Recent Activity</h3>
            <Link href="/dashboard/inbox" className="font-label text-xs font-bold text-primary flex items-center gap-1 hover:text-primary-container transition-colors group">
              View Inbox
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-surface-container-low/40 border-b border-outline-variant/10">
                  <tr>
                    <th className="px-8 py-4 font-label text-[10px] font-bold text-outline uppercase tracking-[0.16em]">Event</th>
                    <th className="px-8 py-4 font-label text-[10px] font-bold text-outline uppercase tracking-[0.16em]">Source</th>
                    <th className="px-8 py-4 font-label text-[10px] font-bold text-outline uppercase tracking-[0.16em]">Status</th>
                    <th className="px-8 py-4 font-label text-[10px] font-bold text-outline uppercase tracking-[0.16em]">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {(!data?.recentActivity || data.recentActivity.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center border border-outline-variant/15 text-outline/40 mb-4 animate-[pulse_3s_infinite]">
                            <span className="material-symbols-outlined text-3xl">query_stats</span>
                          </div>
                          <h4 className="text-sm font-headline font-bold text-on-surface mb-1">Awaiting Campaign Scans</h4>
                          <p className="text-xs text-outline leading-relaxed">
                            Once customers scan your QR codes and leave public reviews or private feedback, their activity will appear here in real-time.
                          </p>
                          <Link href="/dashboard/campaigns/new" className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/15 transition-all text-xs font-headline font-bold rounded-lg border border-primary/10">
                            <span className="material-symbols-outlined text-sm">add_box</span>
                            Create a QR Campaign
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.recentActivity.map((activity) => {
                      const isPositive = activity.action === 'positive';
                      return (
                        <tr key={activity.id} className="hover:bg-surface-container-low/30 transition-colors group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                                isPositive ? 'bg-secondary-container/20 text-on-secondary-container' : 'bg-error/10 text-error'
                              }`}>
                                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isPositive ? "'FILL' 1" : "" }}>
                                  {isPositive ? 'star' : 'feedback'}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-on-surface">
                                  {isPositive 
                                    ? `New ${activity.rating}-star review for ${activity.campaignBusinessName}`
                                    : `Private feedback received for ${activity.campaignBusinessName}`
                                  }
                                </p>
                                {activity.feedbackMessage && (
                                  <p className="text-xs text-outline italic mt-1">&quot;{activity.feedbackMessage}&quot;</p>
                                )}
                                {isPositive && (
                                  <div className="flex items-center gap-0.5 mt-1 text-secondary">
                                    {Array.from({ length: activity.rating }).map((_, i) => (
                                      <span key={i} className="material-symbols-outlined text-xs font-fill" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    ))}
                                    {Array.from({ length: 5 - activity.rating }).map((_, i) => (
                                      <span key={i} className="material-symbols-outlined text-xs">star</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-sm font-semibold text-on-surface-variant">
                            {isPositive ? 'Google reviews' : 'Smart feedback flow'}
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                              isPositive 
                                ? 'bg-secondary-container/20 text-on-secondary-container border-secondary/10' 
                                : 'bg-error/10 text-error border-error/10'
                            }`}>
                              {isPositive ? 'Published' : 'Private'}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-xs text-outline">
                            {getRelativeTimeString(activity.scannedAt)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

