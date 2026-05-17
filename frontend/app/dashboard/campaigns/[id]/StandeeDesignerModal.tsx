'use client';

import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { toPng } from 'html-to-image';
import { CampaignConfig } from './types';
import StandeeTemplate, {
  STANDEE_TEMPLATES,
} from './StandeeTemplate';

interface Props {
  campaign: CampaignConfig;
  qrCodeDataUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
  onChange: (update: Partial<CampaignConfig['standeeConfig']>) => void;
}

/** Full-res export width in pixels (4 in × 300 DPI) */
const EXPORT_WIDTH = 1200;
/** Preview width — scaled to fit the right panel */
const PREVIEW_WIDTH = 340;

export default function StandeeDesignerModal({ campaign, qrCodeDataUrl, isOpen, onClose, onChange }: Props) {
  const userConfig = campaign.standeeConfig;
  const [isDownloading, setIsDownloading] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const selectedTemplate = STANDEE_TEMPLATES.find((t) => t.id === userConfig.templateId)!;

  const handleDownload = async () => {
    if (!exportRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await toPng(exportRef.current, { quality: 1.0, pixelRatio: 1 });
      const link = document.createElement('a');
      link.download = `reviewloom-standee-${userConfig.templateId}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Standee export failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 lg:pl-64 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] w-full max-w-5xl shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[95vh] overflow-hidden">

        {/* ── Header ── */}
        <div className="px-8 py-5 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-xl">design_services</span>
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Design Your Standee</h2>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">
                4 × 6 inch · Print-ready PNG · 300 DPI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all hover:rotate-90 active:scale-90"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">

          {/* Left: Controls */}
          <div className="lg:w-[340px] shrink-0 border-r border-slate-100 overflow-y-auto p-6 flex flex-col gap-7">

            {/* Template picker */}
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                Template
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {STANDEE_TEMPLATES.map((tpl) => {
                  const isActive = userConfig.templateId === tpl.id;
                  const accent = tpl.accentColor ?? campaign.style.primaryColor;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => onChange({ templateId: tpl.id })}
                      className={`relative rounded-2xl p-3.5 text-left transition-all border-2 group ${isActive
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                    >
                      {/* Swatch */}
                      <div
                        className="w-full h-14 rounded-xl mb-2.5 overflow-hidden flex flex-col items-center justify-center gap-1 relative"
                        style={{ background: tpl.bgGradient ?? tpl.bgColor }}
                      >
                        {/* Mini accent bar */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent }} />
                        <div
                          className="w-8 h-8 rounded-md"
                          style={{ background: tpl.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.8)', border: `1px solid ${tpl.surfaceBorder}` }}
                        />
                      </div>
                      {/* Labels */}
                      <p className={`text-[11px] font-black tracking-wide ${isActive ? 'text-primary' : 'text-slate-700'}`}>
                        {tpl.label}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight">{tpl.tagline}</p>

                      {/* Pro badge */}
                      {tpl.isPro && (
                        <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-amber-400/20 text-amber-700 text-[8px] font-black uppercase tracking-wider rounded-md">
                          Pro
                        </span>
                      )}

                      {/* Active check */}
                      {isActive && (
                        <span
                          className="absolute bottom-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-white"
                          style={{ background: 'var(--color-primary)' }}
                        >
                          <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            check
                          </span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA Text */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">
                Headline Text
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={userConfig.ctaText}
                  maxLength={48}
                  onChange={(e) => onChange({ ctaText: e.target.value })}
                  className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-primary transition-colors pr-12 bg-slate-50 placeholder:text-slate-400"
                  placeholder="Review Us on Google"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">
                  {userConfig.ctaText.length}/48
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                Keep it short and action-oriented.
              </p>
            </div>

            {/* Options */}
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">
                Options
              </h3>
              <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 cursor-pointer hover:border-slate-200 transition-all">
                <div>
                  <p className="text-sm font-bold text-slate-800">Show Logo</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {campaign.logoUrl ? 'Your uploaded logo will appear on the standee.' : 'Upload a logo in the Branding section first.'}
                  </p>
                </div>
                <div
                  onClick={() => onChange({ showLogo: !userConfig.showLogo })}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${userConfig.showLogo && campaign.logoUrl ? 'bg-primary' : 'bg-slate-200'
                    } ${!campaign.logoUrl ? 'opacity-40 pointer-events-none' : 'cursor-pointer'}`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${userConfig.showLogo && campaign.logoUrl ? 'translate-x-5' : 'translate-x-0'
                      }`}
                  />
                </div>
              </label>
            </div>

            {/* Info callout */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex gap-3">
              <span className="material-symbols-outlined text-slate-400 text-[18px] shrink-0 mt-0.5">info</span>
              <div>
                <p className="text-[11px] font-bold text-slate-700 mb-0.5">Print tip</p>
                <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  Print at <strong>100% scale</strong> on 4×6 inch paper for a perfect tabletop standee. Works with most US print shops.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-8 gap-5 overflow-y-auto">
            {/* Context label */}
            <div className="flex items-center gap-2 text-slate-400">
              <span className="material-symbols-outlined text-[16px]">crop_portrait</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">4 × 6 in · Live Preview</span>
            </div>

            {/* Scaled preview */}
            <div
              className="shadow-2xl shadow-slate-900/20 rounded-md overflow-hidden"
              style={{ width: PREVIEW_WIDTH, height: PREVIEW_WIDTH * 1.5 }}
            >
              <div style={{ transform: `scale(${PREVIEW_WIDTH / EXPORT_WIDTH})`, transformOrigin: 'top left', width: EXPORT_WIDTH }}>
                <StandeeTemplate
                  campaign={campaign}
                  userConfig={userConfig}
                  qrCodeDataUrl={qrCodeDataUrl}
                  width={EXPORT_WIDTH}
                />
              </div>
            </div>

            {/* Template label */}
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {selectedTemplate.label} Template
              {selectedTemplate.isPro && <span className="ml-2 text-amber-500">· Pro</span>}
            </p>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-[16px]">high_quality</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Exports at 1200 × 1800 px · 300 DPI equivalent
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider hover:border-slate-300 hover:text-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-black text-[11px] uppercase tracking-wider hover:bg-primary-hover transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95"
            >
              {isDownloading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  Download PNG
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Hidden full-resolution export div ── */}
      <div
        style={{
          position: 'fixed',
          top: -99999,
          left: -99999,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div ref={exportRef}>
          <StandeeTemplate
            campaign={campaign}
            userConfig={userConfig}
            qrCodeDataUrl={qrCodeDataUrl}
            width={EXPORT_WIDTH}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
