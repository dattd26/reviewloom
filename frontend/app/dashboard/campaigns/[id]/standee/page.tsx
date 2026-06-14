'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';

import { CampaignConfig, StandeeTemplate, StandeeUserConfig } from '@/types/campaign';
import { CampaignService } from '@/services/campaign-service';
import { StandeeTemplateService } from '@/services/standee-template-service';
import { mapDtoToConfig } from '@/lib/campaign-mappers';
import { DashboardLoading } from '@/components/dashboard/DashboardLoading';

import StandeeTemplateComponent, { STANDEE_TEMPLATES_MAP } from '../StandeeTemplate';

const EXPORT_WIDTH = 1200;
const PREVIEW_WIDTH = 360;

export default function StandeeDesignerPage() {
  const { id } = useParams() as { id: string };
  const { getToken } = useAuth();

  const [campaign, setCampaign] = useState<CampaignConfig | null>(null);
  const [templates, setTemplates] = useState<StandeeTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  const exportRef = useRef<HTMLDivElement>(null);

  // Initial Data Load
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const token = await getToken();
        if (!token) return;

        const [campaignDto, templateList] = await Promise.all([
          CampaignService.getCampaignById(id, token),
          StandeeTemplateService.getTemplates(token)
        ]);

        setCampaign(mapDtoToConfig(campaignDto));
        setTemplates(templateList);
      } catch (err) {
        console.error('Failed to load standee designer data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id, getToken]);

  // Generate QR
  useEffect(() => {
    if (!campaign) return;
    const timer = setTimeout(async () => {
      try {
        const scanUrl = campaign.slug
          ? `${window.location.origin}/r/${campaign.slug}`
          : `${window.location.origin}/r/preview-placeholder`;
        const url = await QRCode.toDataURL(scanUrl, {
          errorCorrectionLevel: 'H',
          margin: 1,
          width: 512,
          color: {
            dark: campaign.style.qrDotColor || '#000000',
            light: '#ffffff'
          }
        });
        setQrCodeDataUrl(url);
      } catch (err) {
        console.error('Error generating QR:', err);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [campaign]);

  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const saveChanges = useCallback((updatedCampaign: CampaignConfig) => {
    if (saveTimeout) clearTimeout(saveTimeout);

    const timeout = setTimeout(async () => {
      try {
        setIsSaving(true);
        const token = await getToken();
        if (!token) return;
        await CampaignService.updateCampaign(id, updatedCampaign, token);
      } catch (err) {
        console.error('Failed to save standee config:', err);
      } finally {
        setIsSaving(false);
      }
    }, 1000);

    setSaveTimeout(timeout);
  }, [getToken, id, saveTimeout]);

  const handleConfigChange = (update: Partial<StandeeUserConfig>) => {
    if (!campaign) return;
    const updatedCampaign = {
      ...campaign,
      standeeConfig: { ...campaign.standeeConfig, ...update }
    };
    setCampaign(updatedCampaign);
    saveChanges(updatedCampaign);
  };

  const handleDownload = async () => {
    if (!exportRef.current || !campaign) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(exportRef.current, { quality: 1.0, pixelRatio: 1 });
      const link = document.createElement('a');
      link.download = `reviewloom-standee-${campaign.standeeConfig.templateId}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Standee export failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading || !campaign) return <DashboardLoading />;

  const userConfig = campaign.standeeConfig;

  const categories: Record<string, string> = {
    general: 'General & Classic',
    restaurant: 'Restaurants & Dining',
    coffee: 'Coffee Shops & Cafes',
    salon: 'Salons, Spas & Beauty',
    services: 'Home & Professional Services'
  };

  const templatesByCategory = templates.reduce((acc, tpl) => {
    const cat = tpl.category || 'general';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tpl);
    return acc;
  }, {} as Record<string, StandeeTemplate[]>);

  return (
    <div className="flex flex-col h-screen bg-surface-container-lowest">
      {/* Header */}
      <header className="h-16 px-6 border-b border-outline-variant/20 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/campaigns/${id}`}
            className="w-10 h-10 rounded-full hover:bg-surface-container-low flex items-center justify-center text-on-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-on-surface">Standee Designer</h1>
              {isSaving && <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">Saving...</span>}
            </div>
            <p className="text-[11px] text-on-surface-variant/80 font-medium">
              Campaign: {campaign.businessName || 'Untitled'}
            </p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading || !qrCodeDataUrl}
          className="h-10 px-6 rounded-xl bg-primary text-white font-black text-[11px] uppercase tracking-widest hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/20 disabled:opacity-50 active:scale-95"
        >
          {isDownloading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span className="material-symbols-outlined text-[16px]">download</span>
              Download Print PDF
            </>
          )}
        </button>
      </header>

      {/* Main Designer Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Controls) */}
        <div className="w-[380px] bg-white border-r border-outline-variant/20 overflow-y-auto shrink-0 flex flex-col">
          <div className="p-6 space-y-8">

            {/* Headline Settings */}
            <div>
              <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-3">Copywriting</h3>
              <div className="space-y-4">
                <div className="relative">
                  <label className="text-[11px] font-bold text-on-surface mb-1.5 block">Headline Call-to-Action</label>
                  <input
                    type="text"
                    value={userConfig.ctaText}
                    maxLength={48}
                    onChange={(e) => handleConfigChange({ ctaText: e.target.value })}
                    className="w-full border-2 border-outline-variant/30 rounded-xl px-4 py-3 text-sm font-semibold text-on-surface focus:outline-none focus:border-primary transition-colors pr-12 bg-surface-container-lowest placeholder:text-on-surface-variant/50"
                    placeholder="Review Us on Google"
                  />
                  <span className="absolute right-4 bottom-3 text-[10px] font-bold text-on-surface-variant/50">
                    {userConfig.ctaText.length}/48
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-outline-variant/10" />

            {/* Visual Settings */}
            <div>
              <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-3">Visuals</h3>
              <label className="flex items-center justify-between gap-3 p-4 rounded-xl border-2 border-outline-variant/20 hover:border-outline-variant/40 cursor-pointer transition-all bg-surface-container-lowest">
                <div>
                  <p className="text-[13px] font-bold text-on-surface">Display Logo</p>
                  <p className="text-[11px] text-on-surface-variant/80 mt-0.5 max-w-[220px]">
                    {campaign.logoUrl ? 'Show your brand logo on the standee.' : 'Upload a logo in Campaign Settings first.'}
                  </p>
                </div>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    if (campaign.logoUrl) handleConfigChange({ showLogo: !userConfig.showLogo });
                  }}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${userConfig.showLogo && campaign.logoUrl ? 'bg-primary' : 'bg-surface-container-highest'
                    } ${!campaign.logoUrl ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${userConfig.showLogo && campaign.logoUrl ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </div>
              </label>
            </div>

            <hr className="border-outline-variant/10" />

            {/* Template Catalog */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">Template Catalog</h3>
              </div>

              <div className="space-y-6">
                {Object.entries(categories).map(([catKey, catLabel]) => {
                  const catTemplates = templatesByCategory[catKey] || [];
                  if (catTemplates.length === 0) return null;

                  return (
                    <div key={catKey}>
                      <h4 className="text-[11px] font-bold text-on-surface/80 mb-3">{catLabel}</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {catTemplates.map((tpl) => {
                          const style = STANDEE_TEMPLATES_MAP[tpl.id] || STANDEE_TEMPLATES_MAP.minimal_white;
                          const isActive = userConfig.templateId === tpl.id;
                          const accent = style.accentColor ?? campaign.style.primaryColor;
                          const isLocked = tpl.isPremium && campaign.showWatermark;

                          return (
                            <button
                              key={tpl.id}
                              onClick={() => !isLocked && handleConfigChange({ templateId: tpl.id })}
                              disabled={isLocked}
                              title={isLocked ? 'Upgrade to Pro to unlock this template' : ''}
                              className={`relative rounded-2xl p-3 text-left transition-all border-2 group ${isActive
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : isLocked
                                  ? 'border-outline-variant/10 bg-surface-container-low opacity-60 cursor-not-allowed'
                                  : 'border-outline-variant/20 hover:border-outline-variant/40 bg-white'
                                }`}
                            >
                              <div
                                className="w-full h-16 rounded-xl mb-3 overflow-hidden flex flex-col items-center justify-center gap-1 relative border border-black/5"
                                style={{ background: style.bgGradient ?? style.bgColor }}
                              >
                                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />
                                <div
                                  className="w-8 h-8 rounded-md"
                                  style={{
                                    background: style.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.8)',
                                    border: `1px solid ${style.surfaceBorder}`,
                                  }}
                                />
                              </div>
                              <p className={`text-[11px] font-black tracking-wide truncate ${isActive ? 'text-primary' : 'text-on-surface'}`}>
                                {tpl.name}
                              </p>

                              {tpl.isPremium && (
                                <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-400/20 text-amber-700 text-[8px] font-black uppercase tracking-wider rounded-md">
                                  Pro
                                </span>
                              )}

                              {isActive && !isLocked && (
                                <span className="absolute bottom-3 right-3 w-4 h-4 rounded-full flex items-center justify-center bg-primary text-white">
                                  <span className="material-symbols-outlined text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Canvas (Live Preview) */}
        <div className="flex-1 bg-surface-container-low flex flex-col items-center p-8 relative overflow-y-auto">
          {/* Decorative background grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

          {/* Canvas Wrapper */}
          <div className="relative z-10 flex flex-col items-center m-auto">
            {/* Context Badge */}
            <div className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-outline-variant/20 shadow-sm">
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">aspect_ratio</span>
              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.15em]">A6 / 4×6 in Print Size</span>
            </div>

            {/* Standee Shadow/Container */}
            <div
              className="relative shadow-2xl rounded-[2px] bg-white overflow-hidden"
              style={{ width: PREVIEW_WIDTH, height: PREVIEW_WIDTH * 1.5, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)' }}
            >
              {/* Scaled Render */}
              <div style={{ transform: `scale(${PREVIEW_WIDTH / EXPORT_WIDTH})`, transformOrigin: 'top left', width: EXPORT_WIDTH }}>
                <StandeeTemplateComponent
                  campaign={campaign}
                  userConfig={userConfig}
                  qrCodeDataUrl={qrCodeDataUrl}
                  width={EXPORT_WIDTH}
                />
              </div>
            </div>

            {/* Info text */}
            <p className="mt-8 text-[11px] font-medium text-on-surface-variant/60 max-w-[280px] text-center leading-relaxed">
              Print at 100% scale without margins. The exported PNG is print-ready at 300 DPI.
            </p>
          </div>
        </div>
      </div>

      {/* Hidden Full-Res Render for Export */}
      <div style={{ position: 'fixed', top: -99999, left: -99999, opacity: 0, pointerEvents: 'none' }}>
        <div ref={exportRef}>
          <StandeeTemplateComponent
            campaign={campaign}
            userConfig={userConfig}
            qrCodeDataUrl={qrCodeDataUrl}
            width={EXPORT_WIDTH}
          />
        </div>
      </div>
    </div>
  );
}
