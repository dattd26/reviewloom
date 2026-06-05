'use client'

import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { DashboardService, DashboardOverviewResponse } from '@/services/dashboard-service';
import Link from 'next/link';

export default function DashboardOverview() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [data, setData] = useState<DashboardOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Handle loading state
  if (!isLoaded || isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs font-bold text-outline uppercase tracking-widest">Loading Dashboard...</p>
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

  const generateAreaPoints = (width: number, height: number) => {
    if (scansGrowth.length === 0) return '';
    const linePoints = generateChartPoints('total', width, height);
    return `0,${height} ${linePoints} ${width},${height} Z`;
  };

  return (
    <>
      {/* TopAppBar */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-outline-variant/5">
        <div className="px-8 h-20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div>
            <h2 className="text-xl font-headline font-black text-on-surface tracking-tight leading-none">
              Welcome back, {user?.firstName || 'Owner'}
            </h2>
            <p className="text-[11px] font-bold uppercase tracking-widest text-outline mt-1.5 opacity-70">
              Reputation Overview &bull; Last 30 Days
            </p>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <div className="flex items-center bg-surface-container-low/50 px-4 py-2 rounded-xl gap-3 border border-outline-variant/10 hover:bg-surface-container-high transition-all cursor-pointer group">
              <span className="material-symbols-outlined text-outline text-sm group-hover:text-primary transition-colors">calendar_today</span>
              <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Last 30 Days</span>
              <span className="material-symbols-outlined text-outline text-sm">expand_more</span>
            </div>
            <button className="w-10 h-10 flex items-center justify-center text-outline hover:text-primary transition-all rounded-xl hover:bg-primary/5 border border-outline-variant/10 sm:border-none">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </div>
      </header>


      {/* Content Canvas */}
      <div className="p-8 space-y-8 flex-1">
        {/* 1. Key Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Scans */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 group hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-primary/10 rounded-xl">
                <span className="material-symbols-outlined text-primary">qr_code_2</span>
              </div>
            </div>
            <p className="font-label text-xs font-semibold text-outline uppercase tracking-wider mb-1">Total Scans</p>
            <h3 className="font-headline font-extrabold text-3xl mb-4 text-on-surface">{totalScans.toLocaleString()}</h3>
            {/* Sparkline SVG */}
            <svg className="w-full h-12" viewBox="0 0 100 30">
              <path d={generateSparklinePoints(100, 30)} fill="none" stroke="var(--color-primary)" strokeWidth="2"></path>
            </svg>
          </div>

          {/* Positive Feedback % */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 group hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-secondary/10 rounded-xl">
                <span className="material-symbols-outlined text-secondary">sentiment_very_satisfied</span>
              </div>
              <span className="material-symbols-outlined text-secondary text-sm">trending_up</span>
            </div>
            <p className="font-label text-xs font-semibold text-outline uppercase tracking-wider mb-1">Positive Feedback %</p>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="font-headline font-extrabold text-3xl text-primary-container">{positivePercentage}%</h3>
              <span className="font-label text-[10px] font-medium text-secondary">Routed to Google</span>
            </div>
            <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
              <div className="h-full bg-secondary rounded-full transition-all duration-500" style={{ width: `${positivePercentage}%` }}></div>
            </div>
          </div>

          {/* New Private Feedback */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 group hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-error/10 rounded-xl">
                <span className="material-symbols-outlined text-error">error</span>
              </div>
              {newPrivateFeedback > 0 && <span className="animate-pulse w-2 h-2 bg-error rounded-full"></span>}
            </div>
            <p className="font-label text-xs font-semibold text-outline uppercase tracking-wider mb-1">New Private Feedback</p>
            <div className="flex items-baseline gap-2">
              <h3 className="font-headline font-extrabold text-3xl text-error">{newPrivateFeedback}</h3>
              <span className="font-label text-[10px] font-bold text-error uppercase">Needs Attention</span>
            </div>
            <p className="mt-4 text-xs text-outline leading-relaxed">
              {newPrivateFeedback > 0 
                ? `Action required on ${newPrivateFeedback} private response${newPrivateFeedback > 1 ? 's' : ''} from unhappy customers.` 
                : "No negative feedback currently needs attention. Good job!"}
            </p>
          </div>
        </section>

        {/* 2. Main Chart */}
        <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h3 className="font-headline font-bold text-xl text-on-surface">Review Growth Over Time</h3>
              <p className="font-label text-sm text-outline mt-1">Comparative analysis of scans vs feedback sentiment</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="font-label text-xs font-semibold text-on-surface-variant">Scans</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <span className="font-label text-xs font-semibold text-on-surface-variant">Positive</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-error"></span>
                <span className="font-label text-xs font-semibold text-on-surface-variant">Negative</span>
              </div>
            </div>
          </div>

          {/* Dynamic SVG Chart */}
          <div className="relative w-full h-80 bg-surface-container-low/30 rounded-xl flex items-end p-4 overflow-hidden border border-outline-variant/5">
            {scansGrowth.length > 0 ? (
              <>
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 320">
                  <defs>
                    <linearGradient id="grad-primary" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Area Fill */}
                  <polygon points={generateAreaPoints(1000, 320)} fill="url(#grad-primary)" />
                  {/* Scan Line */}
                  <polyline points={generateChartPoints('total', 1000, 320)} fill="none" stroke="var(--color-primary)" strokeWidth="3" />
                  {/* Positive Line */}
                  <polyline points={generateChartPoints('positive', 1000, 320)} fill="none" stroke="var(--color-secondary)" strokeDasharray="4" strokeWidth="3" />
                  {/* Negative Line */}
                  <polyline points={generateChartPoints('negative', 1000, 320)} fill="none" stroke="var(--color-error)" strokeWidth="2" />
                </svg>

                {/* Y Axis Labels */}
                <div className="absolute left-4 top-4 bottom-4 flex flex-col justify-between text-[10px] font-label text-outline pointer-events-none">
                  <span>{maxVal}</span>
                  <span>{Math.round(maxVal * 0.75)}</span>
                  <span>{Math.round(maxVal * 0.5)}</span>
                  <span>{Math.round(maxVal * 0.25)}</span>
                  <span>0</span>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-outline">
                No activity records in the last 30 days.
              </div>
            )}
          </div>
          
          {scansGrowth.length > 0 && (
            <div className="flex justify-between mt-4 px-4 text-[10px] font-label text-outline uppercase tracking-widest">
              <span>{new Date(scansGrowth[0].date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
              <span>{new Date(scansGrowth[Math.floor(scansGrowth.length / 2)].date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
              <span>{new Date(scansGrowth[scansGrowth.length - 1].date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span>
            </div>
          )}
        </section>

        {/* 3. Recent Activity */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-headline font-bold text-lg text-on-surface">Recent Activity</h3>
            <Link href="/dashboard/inbox" className="font-label text-xs font-bold text-primary flex items-center gap-1 hover:text-primary-container transition-colors group">
              View Inbox
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-surface-container-low border-b border-outline-variant/10">
                  <tr>
                    <th className="px-6 py-4 font-label text-[10px] font-bold text-outline uppercase tracking-wider">Event</th>
                    <th className="px-6 py-4 font-label text-[10px] font-bold text-outline uppercase tracking-wider">Source</th>
                    <th className="px-6 py-4 font-label text-[10px] font-bold text-outline uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-label text-[10px] font-bold text-outline uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {(!data?.recentActivity || data.recentActivity.length === 0) ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-sm text-outline">
                        No activity found. Scan dynamic QR codes to log events here.
                      </td>
                    </tr>
                  ) : (
                    data.recentActivity.map((activity) => {
                      const isPositive = activity.action === 'positive';
                      return (
                        <tr key={activity.id} className="hover:bg-surface-container-low/30 transition-colors group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
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
                                  <p className="text-xs text-outline italic mt-0.5">&quot;{activity.feedbackMessage}&quot;</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-sm font-medium text-on-surface-variant">
                            {isPositive ? 'Google reviews' : 'Smart feedback flow'}
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                              isPositive 
                                ? 'bg-secondary-container/20 text-on-secondary-container border-secondary/10' 
                                : 'bg-error/10 text-error border-error/10'
                            }`}>
                              {isPositive ? 'Published' : 'Private'}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-xs text-outline">
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
    </>
  );
}
