'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { CampaignConfig, DEFAULT_CAMPAIGN, CampaignStatus } from './types';
import { useAuth } from '@clerk/nextjs';
import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { CampaignService } from '@/services/campaign-service';
import { mapDtoToConfig } from './mappers';
import BrandingSection from './BrandingSection';
import ContentSection from './ContentSection';
import QrSection from './QrSection';
import AdvancedSection from './AdvancedSection';
import LivePreview from './LivePreview';

type ActiveTab = 'branding' | 'content' | 'qr' | 'advanced';

const TABS: { id: ActiveTab; label: string; icon: string }[] = [
  { id: 'branding', label: 'Branding', icon: 'palette' },
  { id: 'content', label: 'Content', icon: 'edit_note' },
  { id: 'qr', label: 'QR Style', icon: 'qr_code_2' },
  { id: 'advanced', label: 'Advanced', icon: 'tune' },
];

export default function CampaignBuilder() {
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isEditMode = id && id !== 'new';

  const [campaign, setCampaign] = useState<CampaignConfig>(DEFAULT_CAMPAIGN);
  const [activeTab, setActiveTab] = useState<ActiveTab>('branding');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isDirty, setIsDirty] = useState(false);
  const isInitialLoad = useRef(true);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          const token = await getToken();
          if (!token) return;
          const data = await CampaignService.getCampaignById(id, token);
          setCampaign(mapDtoToConfig(data));
          setTimeout(() => { isInitialLoad.current = false; }, 500);
        } catch (error) {
          console.error("Failed to fetch campaign:", error);
          router.push('/dashboard/campaigns');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      isInitialLoad.current = false;
    }
  }, [id, isEditMode, getToken, router]);

  // Auto-save logic
  useEffect(() => {
    if (isInitialLoad.current || !isDirty || isLoading) return;

    const timer = setTimeout(async () => {
      await handleSave(true); // silent auto-save as draft
    }, 3000);

    return () => clearTimeout(timer);
  }, [campaign, isDirty, isLoading]);

  const patch = (update: Partial<CampaignConfig>) => {
    setCampaign((prev) => ({ ...prev, ...update }));
    setIsDirty(true);
  };

  const handleSave = async (isAutoSave = false, forceStatus?: CampaignStatus) => {
    // Determine the target status:
    // 1. Use forceStatus if provided (manual button click)
    // 2. If auto-saving, maintain the current campaign status to avoid regressions
    // 3. Default to 1 (Published) for manual "Go Live" actions
    const targetStatus: CampaignStatus = forceStatus !== undefined ? forceStatus : (isAutoSave ? campaign.status : 1);

    // Guard: Don't auto-save if name is empty (backend requirement) or if already saving
    if (isAutoSave && !campaign.name?.trim()) return;
    if (isSaving && isAutoSave) return;

    // Strict validation for Publishing actions
    if (targetStatus === 1 && (!campaign.name?.trim() || !campaign.googleReviewUrl?.trim())) {
      if (!isAutoSave) {
        alert("Please provide a Campaign Name and Google Review URL to publish your campaign.");
      }
      return;
    }

    if (!isAutoSave) setIsSaving(true);
    setSaveStatus('saving');

    try {
      const token = await getToken();
      if (!token) throw new Error("Authentication session expired. Please sign in again.");

      const campaignToSave = { ...campaign, status: targetStatus as any };

      if (isEditMode) {
        await CampaignService.updateCampaign(id, campaignToSave, token);
      } else {
        const result = await CampaignService.createCampaign(campaignToSave, token);
        
        // Transition to edit mode immediately after creation to prevent duplicate POSTs
        if (result && result.id) {
          router.replace(`/dashboard/campaigns/${result.id}`, { scroll: false });
          
          if (isAutoSave) {
            // Stop here; the router change will trigger a re-render/fetch which syncs state
            setIsDirty(false);
            setSaveStatus('saved');
            setTimeout(() => setSaveStatus('idle'), 2000);
            return;
          }
        }
      }

      // Sync local state immediately for a smooth UI experience
      setCampaign(prev => ({ ...prev, status: targetStatus }));
      setIsDirty(false);
      setSaveStatus('saved');
      
      // Reset indicator after success
      setTimeout(() => setSaveStatus('idle'), 2000);

      // Navigate back on manual publish success
      if (!isAutoSave && targetStatus === 1) {
        router.push('/dashboard/campaigns');
      }
    } catch (error: any) {
      console.error("[CampaignSave] Failed:", error);
      setSaveStatus('error');
      if (!isAutoSave) {
        alert(error.message || "Failed to save changes. Please check your connection and try again.");
      }
    } finally {
      if (!isAutoSave) setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => patch({ logo: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* Top Nav */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-outline-variant/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-5">
            <Link
              href="/dashboard/campaigns"
              className="w-11 h-11 flex items-center justify-center bg-surface-container-lowest rounded-2xl hover:bg-surface-container-high transition-all active:scale-90 shadow-sm border border-outline-variant/10 group"
            >
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">arrow_back</span>
            </Link>
            <div>
              <h2 className="text-xl sm:text-2xl font-headline font-black text-on-surface tracking-tight leading-none">
                {isEditMode ? 'Edit Campaign' : 'Create Campaign'}
              </h2>
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-outline mt-1.5 opacity-70">
                Builder &bull; v1.0
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            {/* Transient Save Status */}
            <div className={`flex items-center gap-2 px-3 py-1.5 transition-all duration-500 ${
              saveStatus === 'idle' ? 'opacity-0 translate-x-2 pointer-events-none' : 'opacity-100 translate-x-0'
            }`}>
              <span className={`w-1 h-1 rounded-full ${
                saveStatus === 'saving' ? 'bg-primary animate-pulse' : 
                saveStatus === 'saved' ? 'bg-success' : 'bg-error'
              }`} />
              <span className="text-[9px] font-black uppercase tracking-widest text-outline">
                {saveStatus === 'saving' ? 'Saving' : 
                 saveStatus === 'saved' ? 'Saved' : 'Error'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 mr-2">
                {campaign.status === 1 ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter bg-success/10 text-success border border-success/20">
                    <span className="w-1 h-1 rounded-full bg-success animate-pulse"></span>
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter bg-outline/10 text-outline border border-outline/20">
                    <span className="w-1 h-1 rounded-full bg-outline/40"></span>
                    Draft
                  </span>
                )}
              </div>

              <button
                onClick={() => handleSave(false, 0)}
                disabled={isSaving || !isDirty}
                className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-low rounded-xl border border-outline-variant/20 transition-all disabled:opacity-40"
              >
                Save Draft
              </button>
              <button
                onClick={() => handleSave(false, 1)}
                disabled={isSaving}
                className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest text-on-primary rounded-xl shadow-xl transition-all flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-primary/20 active:scale-[0.98]'
                  }`}
                style={{
                  background: isSaving
                    ? '#94a3b8'
                    : `linear-gradient(135deg, ${campaign.primaryColor}, ${campaign.primaryColor}cc)`,
                }}
              >
                {isSaving ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  campaign.status === 1 ? 'Update Live' : 'Go Live'
                )}
              </button>
            </div>
          </div>
        </div>
      </header>


      <div className="p-5 sm:p-8 max-w-7xl mx-auto w-full">
        {/* Mobile CTAs */}
        <div className="flex sm:hidden gap-3 mb-6 w-full">
          <button
            onClick={() => handleSave(false, 0)}
            disabled={isSaving || !isDirty}
            className="flex-1 py-2.5 text-sm font-semibold text-on-surface-variant bg-surface-container-low rounded-xl border border-outline-variant/20 disabled:opacity-50"
          >
            Draft
          </button>
          <button
            onClick={() => handleSave(false, 1)}
            disabled={isSaving}
            className="flex-1 py-2.5 text-sm font-semibold text-on-primary rounded-xl shadow-md flex items-center justify-center gap-2"
            style={{ backgroundColor: isSaving ? '#94a3b8' : campaign.primaryColor }}
          >
            {isSaving ? 'Saving...' : (campaign.status === 1 ? 'Update' : 'Publish')}
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-bold text-outline animate-pulse uppercase tracking-widest">Loading Campaign...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Left Column: Settings (3/5) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Core Settings Card */}
              <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
                <h3 className="text-base font-headline font-bold text-on-surface mb-6">Campaign Settings</h3>
                <div className="space-y-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
                      Campaign Name
                    </label>
                    <input
                      className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none text-on-surface placeholder:text-outline/50"
                      placeholder="e.g. Downtown Cafe Summer Drive"
                      type="text"
                      value={campaign.name}
                      onChange={(e) => patch({ name: e.target.value })}
                    />
                  </div>

                  {/* Google Review URL */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
                        Google Review URL
                      </label>
                      <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                        How to find this{' '}
                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </button>
                    </div>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
                        link
                      </span>
                      <input
                        className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl pl-10 pr-4 py-3 text-sm font-medium transition-all outline-none text-on-surface placeholder:text-outline/50"
                        placeholder="https://g.page/r/your-business-id/review"
                        type="url"
                        value={campaign.googleReviewUrl}
                        onChange={(e) => patch({ googleReviewUrl: e.target.value })}
                      />
                    </div>
                    <p className="text-[11px] text-on-surface-variant/60 italic">
                      Positive feedback routes here. Lower ratings go to a private form.
                    </p>
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
                      Business Logo
                    </label>
                    {campaign.logo ? (
                      <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-outline-variant/20 flex-shrink-0 bg-white">
                          <img src={campaign.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-on-surface">Logo uploaded</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">Will appear in QR center and preview</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => logoInputRef.current?.click()}
                            className="px-3 py-1.5 text-xs font-semibold text-on-surface-variant bg-surface-container rounded-lg border border-outline-variant/20 hover:bg-surface-container-high transition-colors"
                          >
                            Change
                          </button>
                          <button
                            onClick={() => patch({ logo: null })}
                            className="px-3 py-1.5 text-xs font-semibold text-error bg-error/5 rounded-lg border border-error/20 hover:bg-error/10 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => logoInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center bg-surface-container-low/30 hover:bg-surface-container-low transition-colors cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-outline-variant/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined">upload_file</span>
                        </div>
                        <p className="text-sm font-semibold text-on-surface">Click or drag to upload logo</p>
                        <p className="text-xs text-on-surface-variant mt-1">PNG, JPG up to 5MB (400×400 recommended)</p>
                      </button>
                    )}
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </div>

                  {/* Routing Threshold */}
                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-l-xl" />
                    <div className="pl-3">
                      <p className="text-sm font-bold text-on-surface">Feedback Routing Threshold</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">
                        Set the minimum star rating that triggers a Google Review
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-outline-variant/20 self-start sm:self-auto">
                      {([4, 5] as const).map((val) => (
                        <button
                          key={val}
                          onClick={() => patch({ routingThreshold: val })}
                          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${campaign.routingThreshold === val
                            ? 'bg-primary text-on-primary shadow-sm'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                            }`}
                        >
                          {val === 4 ? '4+ Stars' : '5 Stars Only'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Tabbed Customization Sections */}
              <div className="space-y-0">
                {/* Tab Bar */}
                <div className="flex gap-1 p-1 bg-surface-container-low rounded-2xl border border-outline-variant/10 mb-4">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded-xl transition-all duration-200 ${activeTab === tab.id
                        ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                        }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Panel */}
                <div className="transition-all duration-200">
                  {activeTab === 'branding' && <BrandingSection campaign={campaign} onChange={patch} />}
                  {activeTab === 'content' && <ContentSection campaign={campaign} onChange={patch} />}
                  {activeTab === 'qr' && <QrSection campaign={campaign} onChange={patch} />}
                  {activeTab === 'advanced' && <AdvancedSection campaign={campaign} onChange={patch} />}
                </div>
              </div>
            </div>

            {/* Right Column: Live Preview (2/5) */}
            <LivePreview campaign={campaign} onChange={patch} />
          </div>
        )}
      </div>
    </>
  );
}
