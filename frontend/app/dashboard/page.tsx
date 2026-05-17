'use client'

import { useUser } from '@clerk/nextjs';

export default function DashboardOverview() {
  const { isSignedIn, user, isLoaded } = useUser()

  // Handle loading state
  if (!isLoaded) return <div>Loading...</div>

  // Protect the page from unauthenticated users
  if (!isSignedIn) return <div>Sign in to view this page</div>

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
              <span className="font-label text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded-full">+12.5%</span>
            </div>
            <p className="font-label text-xs font-semibold text-outline uppercase tracking-wider mb-1">Total Scans</p>
            <h3 className="font-headline font-extrabold text-3xl mb-4 text-on-surface">1,284</h3>
            {/* Mock Sparkline SVG */}
            <svg className="w-full h-12" viewBox="0 0 100 30">
              <path d="M0 25 Q 10 15, 20 20 T 40 10 T 60 15 T 80 5 T 100 12" fill="none" stroke="var(--color-primary)" strokeWidth="2"></path>
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
              <h3 className="font-headline font-extrabold text-3xl text-primary-container">94%</h3>
              <span className="font-label text-[10px] font-medium text-secondary">Routed to Google</span>
            </div>
            <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-[94%] rounded-full"></div>
            </div>
          </div>

          {/* New Private Feedback */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 group hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-error/10 rounded-xl">
                <span className="material-symbols-outlined text-error">error</span>
              </div>
              <span className="animate-pulse w-2 h-2 bg-error rounded-full"></span>
            </div>
            <p className="font-label text-xs font-semibold text-outline uppercase tracking-wider mb-1">New Private Feedback</p>
            <div className="flex items-baseline gap-2">
              <h3 className="font-headline font-extrabold text-3xl text-error">12</h3>
              <span className="font-label text-[10px] font-bold text-error uppercase">Needs Attention</span>
            </div>
            <p className="mt-4 text-xs text-outline leading-relaxed">Action required on 4 critical responses from the last 48 hours.</p>
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

          {/* Mock Chart Visual */}
          <div className="relative w-full h-80 bg-surface-container-low/30 rounded-xl flex items-end p-4 overflow-hidden border border-outline-variant/5">
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="grad-primary" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area Fill */}
              <path d="M0 320 L0 100 Q 150 150, 300 80 T 600 120 T 900 60 T 1200 90 L 1200 320 Z" fill="url(#grad-primary)" />
              {/* Scan Line */}
              <path d="M0 100 Q 150 150, 300 80 T 600 120 T 900 60 T 1200 90" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
              {/* Positive Line */}
              <path d="M0 150 Q 150 180, 300 120 T 600 160 T 900 100 T 1200 130" fill="none" stroke="var(--color-secondary)" strokeDasharray="4" strokeWidth="3" />
              {/* Negative Line */}
              <path d="M0 280 Q 150 270, 300 290 T 600 285 T 900 275 T 1200 280" fill="none" stroke="var(--color-error)" strokeWidth="2" />
            </svg>

            {/* Y Axis Labels */}
            <div className="absolute left-4 top-4 bottom-4 flex flex-col justify-between text-[10px] font-label text-outline pointer-events-none">
              <span>400</span><span>300</span><span>200</span><span>100</span><span>0</span>
            </div>
          </div>
          <div className="flex justify-between mt-4 px-4 text-[10px] font-label text-outline uppercase tracking-widest">
            <span>Oct 01</span><span>Oct 10</span><span>Oct 20</span><span>Oct 30</span>
          </div>
        </section>

        {/* 3. Recent Activity */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-headline font-bold text-lg text-on-surface">Recent Activity</h3>
            <button className="font-label text-xs font-bold text-primary flex items-center gap-1 hover:text-primary-container transition-colors group">
              View Audit Log
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
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
                    <th className="px-6 py-4 font-label text-[10px] font-bold text-outline uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  <tr className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary-container/20 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-on-secondary-container text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">New 5-star review via Table 4 QR</p>
                          <p className="text-xs text-outline italic mt-0.5">&quot;Best steak I&apos;ve had in the city.&quot;</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-on-surface-variant">Google Maps</td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-[10px] font-bold uppercase tracking-widest border border-secondary/10">Published</span>
                    </td>
                    <td className="px-6 py-5 text-xs text-outline">2 mins ago</td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-outline hover:text-on-surface">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-error text-[20px]">feedback</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">New private feedback received</p>
                          <p className="text-xs text-outline mt-0.5">Wait time at the bar was longer than expected.</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-on-surface-variant">Internal QR</td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full bg-error/10 text-error text-[10px] font-bold uppercase tracking-widest border border-error/10">Needs Attention</span>
                    </td>
                    <td className="px-6 py-5 text-xs text-outline">1 hour ago</td>
                    <td className="px-6 py-5 text-right">
                      <button className="bg-primary text-on-primary text-[10px] font-bold px-4 py-2 rounded-lg hover:bg-primary-container transition-colors uppercase tracking-widest shadow-sm">Resolve</button>
                    </td>
                  </tr>

                  <tr className="hover:bg-surface-container-low/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-outline text-[20px]">qr_code_scanner</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">Menu Scan - Patio Zone</p>
                          <p className="text-xs text-outline mt-0.5">Session ID: #88120-X</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-on-surface-variant">Entrance Hub</td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 rounded-full bg-surface-container-high text-outline text-[10px] font-bold uppercase tracking-widest border border-outline-variant/20">Logged</span>
                    </td>
                    <td className="px-6 py-5 text-xs text-outline">3 hours ago</td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors text-outline hover:text-on-surface">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
