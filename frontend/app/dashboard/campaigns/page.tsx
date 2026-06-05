'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import QRCode from 'qrcode';
import { CampaignService, CampaignResponse } from '@/services/campaign-service';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { DashboardLoading } from '@/components/dashboard/DashboardLoading';

export default function CampaignList() {
  const { getToken } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<CampaignResponse | null>(null);
  
  // Filtering and Searching states
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);
  const [rankingMetric, setRankingMetric] = useState<'scans' | 'satisfaction'>('scans');

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const data = await CampaignService.getMyCampaigns(token);
        setCampaigns(data);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };
    setTimeout(fetchCampaigns, 1000);
  }, [getToken]);

  // GSAP animation hook for entering components
  useGSAP(() => {
    if (isLoading || campaigns.length === 0) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        noPreference: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const reduceMotion = context.conditions?.reduceMotion;
        if (reduceMotion) {
          gsap.set('.animate-fade-in, .bento-tile, .campaign-card', {
            opacity: 1,
            y: 0,
            scale: 1,
          });
          return;
        }

        const tl = gsap.timeline({ defaults: { duration: 0.65, ease: 'power3.out' } });
        tl.fromTo('.animate-fade-in', { opacity: 0, y: -12 }, { opacity: 1, y: 0, stagger: 0.05 })
          .fromTo('.bento-tile', { opacity: 0, y: 20, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, stagger: 0.06 }, '-=0.3')
          .fromTo('.campaign-card', { opacity: 0, y: 30, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, stagger: 0.08 }, '-=0.3');
      }
    );

    return () => mm.revert();
  }, [isLoading, campaigns]);

  if (isLoading && campaigns.length === 0) {
    return <DashboardLoading title="Loading Campaigns..." description="Accessing your review campaigns" />;
  }

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const token = await getToken();
      if (!token) return;
      await CampaignService.deleteCampaign(deleteTarget.id, token);
      setCampaigns(prev => prev.filter(c => c.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete campaign:", error);
      alert("Failed to delete campaign. Please try again.");
    }
  };

  const handleDownloadQR = async (slug: string, businessName: string) => {
    try {
      setDownloadingSlug(slug);
      // The scanned QR points to the campaign landing route
      const scanUrl = `${window.location.origin}/r/${slug}`;
      const qrDataUrl = await QRCode.toDataURL(scanUrl, {
        errorCorrectionLevel: 'H',
        margin: 1,
        width: 512,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      const link = document.createElement('a');
      link.download = `reviewloom-qr-${slug}.png`;
      link.href = qrDataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate QR code for download', err);
      alert('Could not download QR code. Please try again.');
    } finally {
      setDownloadingSlug(null);
    }
  };

  // Aggregated Performance Statistics
  const totalScans = campaigns.reduce((acc, c) => acc + (c.stats?.totalScans || 0), 0);
  const totalPositive = campaigns.reduce((acc, c) => acc + (c.stats?.positiveScans || 0), 0);
  const totalNegative = campaigns.reduce((acc, c) => acc + (c.stats?.negativeScans || 0), 0);
  const activeCount = campaigns.filter(c => c.isActive).length;

  const overallConversionRate = totalScans > 0 
    ? Math.round((totalPositive / totalScans) * 100) 
    : 0;

  // Sort and select top 3 campaigns for the leaderboard
  const sortedRankings = [...campaigns]
    .sort((a, b) => {
      if (rankingMetric === 'scans') {
        return (b.stats?.totalScans || 0) - (a.stats?.totalScans || 0);
      } else {
        const rateA = a.stats?.totalScans > 0 ? (a.stats.positiveScans / a.stats.totalScans) : 0;
        const rateB = b.stats?.totalScans > 0 ? (b.stats.positiveScans / b.stats.totalScans) : 0;
        return rateB - rateA;
      }
    })
    .slice(0, 3);

  // Filter campaigns list
  const filteredCampaigns = campaigns.filter(c => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && c.isActive) || 
      (filter === 'inactive' && !c.isActive);
    
    const matchesSearch = c.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.slug.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesFilter && matchesSearch;
  });

  return (
    <div ref={containerRef} className="flex-1 flex flex-col min-h-screen bg-slate-50/30">
      {/* Custom Sticky Header */}
      <header className="animate-fade-in sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-outline-variant/10">
        <div className="px-8 h-20 flex justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-headline font-black text-on-surface tracking-tight leading-none">
              Review Campaigns
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-outline mt-1.5 opacity-60">
              {activeCount} Active &bull; {campaigns.length} Total Flows
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-all text-outline hover:text-primary border border-outline-variant/15 hover:border-primary/20">
              <span className="material-symbols-outlined text-[22px]">notifications</span>
            </button>
            <Link
              href="/dashboard/campaigns/new"
              className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Create Campaign
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="p-8 max-w-7xl mx-auto w-full flex-1">
        
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-in">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] uppercase tracking-[0.2em] font-black mb-4">
            Campaign Performance
          </span>
          <h2 className="text-4xl md:text-5xl font-headline font-black text-on-surface tracking-tight leading-none mb-3">
            Review Collection Channels
          </h2>
          <p className="text-on-surface-variant font-medium text-sm md:text-base max-w-[65ch] leading-relaxed">
            Monitor your customer touchpoints, track scan counts, and guide happy customers to leave Google reviews while capturing private responses from unhappy guests.
          </p>
        </div>

        {/* Aggregate Stats (Bento Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          
          {/* Tile 1: Total Customer Scans */}
          <div className="bento-tile col-span-12 md:col-span-6 lg:col-span-4 bg-slate-100/50 border border-slate-200/40 rounded-[2rem] p-2 shadow-sm flex flex-col justify-between min-h-[200px]">
            <div className="bg-white border border-slate-200/50 rounded-[calc(2rem-0.5rem)] p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Total Customer Scans</p>
                <h3 className="text-4xl font-black tracking-tight text-on-surface mb-2">{totalScans.toLocaleString()}</h3>
              </div>
              <div className="flex items-center justify-between gap-4 mt-2">
                <span className="text-[11px] font-bold text-outline">Across all active signs</span>
                <div className="h-6 w-24">
                  <svg className="w-full h-full text-success/30 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,25 Q15,10 30,18 T60,5 T90,15 T100,2" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="100" cy="2" r="3" fill="var(--color-success)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Tile 2: Scans to Review Rate */}
          <div className="bento-tile col-span-12 md:col-span-6 lg:col-span-4 bg-slate-100/50 border border-slate-200/40 rounded-[2rem] p-2 shadow-sm flex flex-col justify-between min-h-[200px]">
            <div className="bg-white border border-slate-200/50 rounded-[calc(2rem-0.5rem)] p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Review Conversion Rate</p>
                <h3 className="text-4xl font-black tracking-tight text-on-surface mb-2">{overallConversionRate}%</h3>
              </div>
              <div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${overallConversionRate}%` }} />
                </div>
                <p className="text-[10px] font-bold text-outline">Scans turned into review opportunities</p>
              </div>
            </div>
          </div>

          {/* Tile 3: Private Feedback Caught */}
          <div className="bento-tile col-span-12 lg:col-span-4 bg-slate-100/50 border border-slate-200/40 rounded-[2rem] p-2 shadow-sm flex flex-col justify-between min-h-[200px]">
            <div className="bg-white border border-slate-200/50 rounded-[calc(2rem-0.5rem)] p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-2">Private Feedback Saved</p>
                <h3 className="text-4xl font-black tracking-tight text-on-surface mb-2">{totalNegative.toLocaleString()}</h3>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="text-[10px] font-black text-success uppercase tracking-wider">All private replies captured</span>
              </div>
            </div>
          </div>

          {/* Tile 4: Campaign Performance Leaderboard (Asymmetrical Block) */}
          <div className="bento-tile col-span-12 bg-slate-100/50 border border-slate-200/40 rounded-[2rem] p-2 shadow-sm min-h-[160px] flex">
            <div className="bg-white border border-slate-200/50 rounded-[calc(2rem-0.5rem)] p-6 flex-1 flex flex-col gap-6">
              
              {/* Leaderboard Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider mb-2">
                    Performance Leaderboard
                  </span>
                  <h4 className="text-xl font-black text-on-surface tracking-tight">
                    Where Customers Scan & Review Most
                  </h4>
                </div>

                {/* Leaderboard Toggle */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
                  <button
                    onClick={() => setRankingMetric('scans')}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${
                      rankingMetric === 'scans'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    Most Scans
                  </button>
                  <button
                    onClick={() => setRankingMetric('satisfaction')}
                    className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${
                      rankingMetric === 'satisfaction'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-outline hover:text-on-surface'
                    }`}
                  >
                    Highest Satisfaction
                  </button>
                </div>
              </div>

              {/* Leaderboard List */}
              {sortedRankings.length === 0 ? (
                <div className="text-center py-6 text-sm font-medium text-outline w-full">
                  Create review campaigns and generate customer scans to display location rankings.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  {sortedRankings.map((item, idx) => {
                    const positiveRate = item.stats?.totalScans > 0
                      ? Math.round((item.stats.positiveScans / item.stats.totalScans) * 100)
                      : 0;

                    // Styling for Leaderboard Badges
                    const rankColors = [
                      { bg: 'bg-amber-50 border-amber-200 text-amber-600', label: '1st Place' },
                      { bg: 'bg-slate-50 border-slate-200 text-slate-500', label: '2nd Place' },
                      { bg: 'bg-orange-50/50 border-orange-200/30 text-orange-600', label: '3rd Place' }
                    ];

                    return (
                      <div
                        key={item.id}
                        className="bg-slate-50/50 border border-slate-200/30 rounded-2xl p-4 flex items-center justify-between gap-4 transition-all hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`px-2 py-1 rounded-lg border text-[9px] font-black uppercase tracking-wider shrink-0 ${
                              rankColors[idx]?.bg || 'bg-slate-100 border-slate-200 text-slate-500'
                            }`}
                          >
                            {rankColors[idx]?.label || `${idx + 1}`}
                          </span>
                          <div className="min-w-0">
                            <p className="font-headline font-black text-on-surface text-sm truncate">
                              {item.businessName}
                            </p>
                            <p className="text-[10px] font-bold text-outline uppercase tracking-wider mt-0.5">
                              {rankingMetric === 'scans' ? `${item.stats?.totalScans || 0} scans` : `${positiveRate}% happy`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-bold text-on-surface-variant">
                            {rankingMetric === 'scans' ? `${positiveRate}% happy` : `${item.stats?.totalScans || 0} scans`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-between items-center p-6 bg-slate-50 border border-slate-200/40 rounded-[2rem] mb-8">
          <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-xl w-full sm:w-auto justify-between sm:justify-start">
            {[
              { id: 'all', label: 'All Flows' },
              { id: 'active', label: 'Active Flows' },
              { id: 'inactive', label: 'Paused Flows' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex-1 sm:flex-initial text-center ${
                  filter === tab.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline/50 text-base">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-primary/10 transition-all outline-none text-on-surface placeholder:text-outline/40"
              placeholder="Search campaigns..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Campaigns Detailed View */}
        {filteredCampaigns.length === 0 ? (
          <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-16 text-center animate-fade-in">
            <div className="w-16 h-16 bg-white border border-slate-200/50 rounded-2xl flex items-center justify-center text-outline/30 mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">qr_code_2</span>
            </div>
            <p className="font-headline font-black text-lg text-on-surface mb-1">No campaigns found</p>
            <p className="text-sm text-outline mb-6">Create a campaign or adjust filters to start tracking scans.</p>
            <Link
              href="/dashboard/campaigns/new"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Create First Campaign
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredCampaigns.map((c) => {
              const positiveRate = c.stats?.totalScans > 0 
                ? Math.round((c.stats.positiveScans / c.stats.totalScans) * 100)
                : 0;

              return (
                <div
                  key={c.id}
                  className="campaign-card bg-slate-100/50 border border-slate-200/40 rounded-[2.5rem] p-2 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 group"
                >
                  <div className="bg-white border border-slate-200/50 rounded-[calc(2.5rem-0.5rem)] p-6 flex flex-col justify-between h-full">
                    
                    {/* Campaign Info */}
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-50 border border-slate-200/50 rounded-2xl flex items-center justify-center overflow-hidden shrink-0">
                          {c.logoUrl ? (
                            <Image
                              className="w-full h-full object-cover p-2"
                              src={c.logoUrl}
                              alt="logo"
                              width={56}
                              height={56}
                              unoptimized
                            />
                          ) : (
                            <span className="material-symbols-outlined text-2xl text-primary/75">storefront</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-headline font-black text-on-surface text-base group-hover:text-primary transition-colors leading-tight">
                            {c.businessName}
                          </h4>
                          <p className="text-[10px] font-bold text-outline uppercase tracking-wider mt-1">
                            Created {new Date(c.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {c.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] bg-success/10 text-success border border-success/20 shrink-0">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success"></span>
                          </span>
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] bg-outline/5 text-outline border border-outline/10 shrink-0">
                          <span className="h-1.5 w-1.5 rounded-full bg-outline/30"></span>
                          Paused
                        </span>
                      )}
                    </div>

                    {/* Campaign Stats Mini-Bento */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 text-center">
                        <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mb-1">
                          Scans
                        </span>
                        <span className="font-headline font-black text-lg text-on-surface">
                          {c.stats?.totalScans || 0}
                        </span>
                      </div>
                      <div className="bg-success/5 border border-success/10 rounded-2xl p-4 text-center">
                        <span className="text-[10px] font-bold text-success uppercase tracking-wider block mb-1">
                          Happy Rates
                        </span>
                        <span className="font-headline font-black text-lg text-success">
                          {positiveRate}%
                        </span>
                      </div>
                      <div className="bg-warning/5 border border-warning/10 rounded-2xl p-4 text-center">
                        <span className="text-[10px] font-bold text-warning uppercase tracking-wider block mb-1">
                          Private Forms
                        </span>
                        <span className="font-headline font-black text-lg text-warning">
                          {c.stats?.negativeScans || 0}
                        </span>
                      </div>
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 mt-auto">
                      <button
                        onClick={() => handleDownloadQR(c.slug, c.businessName)}
                        disabled={downloadingSlug === c.slug}
                        className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        {downloadingSlug === c.slug ? (
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Download Sign</span>
                            <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                              <span className="material-symbols-outlined text-[13px]">download</span>
                            </div>
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/campaigns/${c.id}`}
                          className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-primary/10 border border-slate-200/50 hover:border-primary/20 text-outline hover:text-primary transition-all active:scale-[0.98]"
                          title="Edit Campaign Settings"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </Link>

                        <button
                          onClick={() => setDeleteTarget(c)}
                          className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-error/10 border border-slate-200/50 hover:border-error/20 text-outline hover:text-error transition-all active:scale-[0.98]"
                          title="Delete Campaign"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Resources & Strategic Advice section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in">
          <div className="bg-primary/5 p-6 rounded-3xl relative overflow-hidden group hover:bg-primary/10 transition-colors border border-primary/10">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-slate-100">
              <span className="material-symbols-outlined text-primary">menu_book</span>
            </div>
            <h5 className="font-headline font-black text-on-surface mb-2">Printing Guide</h5>
            <p className="text-sm text-on-surface-variant leading-relaxed">Learn how to print high-resolution tabletop signs and window stickers for local visibility.</p>
          </div>
          <div className="bg-secondary/5 p-6 rounded-3xl relative overflow-hidden group hover:bg-secondary/10 transition-colors border border-secondary/10">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-slate-100">
              <span className="material-symbols-outlined text-secondary">insights</span>
            </div>
            <h5 className="font-headline font-black text-on-surface mb-2">Review Strategy Tips</h5>
            <p className="text-sm text-on-surface-variant leading-relaxed">Top 5 placements in your store or restaurant to multiply customer engagement.</p>
          </div>
          <div className="bg-primary/5 p-6 rounded-3xl relative overflow-hidden group hover:bg-primary/10 transition-colors border border-primary/10">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6 border border-slate-100">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
            </div>
            <h5 className="font-headline font-black text-on-surface mb-2">Dynamic Routing Links</h5>
            <p className="text-sm text-on-surface-variant leading-relaxed">Update where your customers are sent without ever re-printing physical materials.</p>
          </div>
        </div>

      </div>

      {/* Modals */}
      <DeleteConfirmationModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        campaignName={deleteTarget?.businessName || ''}
      />
    </div>
  );
}
