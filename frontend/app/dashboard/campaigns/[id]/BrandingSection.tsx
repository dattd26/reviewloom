'use client';
/* eslint-disable @next/next/no-img-element */

import { useRef, useState, useEffect } from 'react';
import {
  CampaignConfig,
  FONT_OPTIONS,
  FontOption,
  BackgroundStyle,
  GRADIENT_PRESETS,
} from '@/types/campaign';

interface Props {
  campaign: CampaignConfig;
  onChange: (patch: Partial<CampaignConfig>) => void;
}

const PRESET_COLORS = [
  '#0037b0', '#7c3aed', '#db2777', '#ea580c',
  '#16a34a', '#0891b2', '#854d0e', '#1e293b',
];

const BG_MODES: { id: BackgroundStyle; label: string; icon: string }[] = [
  { id: 'none', label: 'None', icon: 'block' },
  { id: 'gradient', label: 'Gradient', icon: 'gradient' },
  { id: 'image', label: 'Custom Image', icon: 'image' },
];

const LOGO_STYLES: { id: CampaignConfig['style']['logoStyle']; label: string; icon: string; radius: string }[] = [
  { id: 'circle', label: 'Circle', icon: 'circle', radius: 'rounded-full' },
  { id: 'soft', label: 'Soft', icon: 'rounded_corner', radius: 'rounded-2xl' },
  { id: 'square', label: 'Square', icon: 'square', radius: 'rounded-md' },
  { id: 'none', label: 'Flat', icon: 'layers_clear', radius: 'rounded-none' },
];

export default function BrandingSection({ campaign, onChange }: Props) {
  const bgInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [showLowResWarning, setShowLowResWarning] = useState(false);

  // Sync custom gradient to backgroundGradient when custom values change
  useEffect(() => {
    const isKnownPreset = GRADIENT_PRESETS.some(p => p.css === campaign.style.backgroundGradient);
    if (campaign.style.backgroundStyle === 'gradient' && !isKnownPreset) {
      const customCss = `linear-gradient(${campaign.style.customGradientDirection}, ${campaign.style.customGradientStart}, ${campaign.style.customGradientEnd})`;
      if (campaign.style.backgroundGradient !== customCss) {
        onChange({ style: { ...campaign.style, backgroundGradient: customCss } });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign.style.customGradientStart, campaign.style.customGradientEnd, campaign.style.customGradientDirection, campaign.style.backgroundStyle]);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size < 150_000) setShowLowResWarning(true);
    else setShowLowResWarning(false);

    const reader = new FileReader();
    reader.onload = (ev) =>
      onChange({
        style: {
          ...campaign.style,
          backgroundStyle: 'image',
          backgroundImage: ev.target?.result as string,
          backgroundGradient: '',
        }
      });
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ logoUrl: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  const selectGradient = (css: string) => {
    onChange({
      style: {
        ...campaign.style,
        backgroundStyle: 'gradient',
        backgroundGradient: css,
        backgroundImage: null
      }
    });
  };

  const applyCustomGradient = () => {
    const customCss = `linear-gradient(${campaign.style.customGradientDirection}, ${campaign.style.customGradientStart}, ${campaign.style.customGradientEnd})`;
    onChange({
      style: {
        ...campaign.style,
        backgroundStyle: 'gradient',
        backgroundGradient: customCss,
        backgroundImage: null
      }
    });
  };

  const clearBackground = () => {
    onChange({
      style: {
        ...campaign.style,
        backgroundStyle: 'none',
        backgroundGradient: '',
        backgroundImage: null
      }
    });
    setShowLowResWarning(false);
  };

  return (
    <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[18px]">palette</span>
        </div>
        <h3 className="text-base font-headline font-black text-on-surface tracking-tight uppercase">Visual Branding</h3>
      </div>

      <div className="space-y-10">
        {/* ── Logo Section ────────────────────────────────────────── */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60">
            Brand Identity
          </label>

          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10">
            <div className="relative group">
              <div className={`w-24 h-24 bg-surface-container-lowest border-2 border-dashed border-outline-variant/30 flex items-center justify-center overflow-hidden transition-all duration-500 shadow-sm ${LOGO_STYLES.find(s => s.id === campaign.style.logoStyle)?.radius}`}>
                {campaign.logoUrl ? (
                  <img src={campaign.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <span className="material-symbols-outlined text-outline/30 text-3xl">add_photo_alternate</span>
                )}
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-white text-xl">upload</span>
                </button>
              </div>
              {campaign.logoUrl && (
                <button
                  onClick={() => onChange({ logoUrl: null })}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              )}
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div>
                <p className="text-xs font-bold text-on-surface">Upload Business Logo</p>
                <p className="text-[10px] text-on-surface-variant/60 mt-1">Recommended: PNG or SVG with transparent background.</p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {LOGO_STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => onChange({ style: { ...campaign.style, logoStyle: style.id } })}
                    className={`flex flex-col items-center gap-1.5 py-2 rounded-xl border transition-all ${campaign.style.logoStyle === style.id
                      ? 'bg-primary/5 border-primary/40 text-primary shadow-sm'
                      : 'bg-surface-container-lowest border-outline-variant/10 text-on-surface-variant hover:border-outline-variant/30'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{style.icon}</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter">{style.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        </div>

        {/* ── Brand Color ─────────────────────────────────────────── */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60">
            Brand Color
          </label>
          <div className="flex flex-wrap items-center gap-3 p-1">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                title={color}
                onClick={() => onChange({ style: { ...campaign.style, primaryColor: color } })}
                className="w-9 h-9 rounded-full border-2 transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                style={{
                  backgroundColor: color,
                  borderColor: 'transparent',
                  boxShadow:
                    campaign.style.primaryColor === color
                      ? `0 0 0 2px var(--surface-container-lowest), 0 0 0 4px ${color}`
                      : 'none',
                }}
              >
                {campaign.style.primaryColor === color && (
                  <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                )}
              </button>
            ))}
            <label className="w-9 h-9 rounded-full border-2 border-dashed border-outline-variant/40 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden group">
              <span className="material-symbols-outlined text-outline text-[16px] group-hover:text-primary transition-colors">add</span>
              <input
                type="color"
                value={campaign.style.primaryColor}
                onChange={(e) => onChange({ style: { ...campaign.style, primaryColor: e.target.value } })}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* ── Font Family ─────────────────────────────────────────── */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60">
            Typography
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font.value}
                onClick={() => onChange({ style: { ...campaign.style, fontFamily: font.value as FontOption } })}
                className={`px-4 py-3.5 rounded-2xl border text-left transition-all ${campaign.style.fontFamily === font.value
                  ? 'border-primary/40 bg-primary/5 shadow-sm'
                  : 'border-outline-variant/10 bg-surface-container-low hover:bg-surface-container'
                  }`}
              >
                <p className="text-sm font-black text-on-surface truncate leading-none" style={{ fontFamily: `'${font.value}', sans-serif` }}>
                  {font.label}
                </p>
                <p className="text-[9px] font-bold text-on-surface-variant/40 mt-1.5 uppercase tracking-widest">{font.category}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Background ──────────────────────────────────────────── */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60">
            Background Surface
          </label>

          <div className="flex gap-1 p-1 bg-surface-container-low rounded-2xl border border-outline-variant/10">
            {BG_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  if (mode.id === 'none') clearBackground();
                  else if (mode.id === 'image') bgInputRef.current?.click();
                  else onChange({ style: { ...campaign.style, backgroundStyle: 'gradient' } });
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${campaign.style.backgroundStyle === mode.id
                  ? 'bg-white text-primary shadow-sm border border-outline-variant/5'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
              >
                <span className="material-symbols-outlined text-[16px]">{mode.icon}</span>
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            ))}
          </div>

          {campaign.style.backgroundStyle === 'gradient' && (
            <div className="space-y-8 pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
              {/* Presets Grid */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-3 bg-primary/40 rounded-full"></span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/70">
                    Artisan Presets
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {GRADIENT_PRESETS.map((preset) => {
                    const isSelected = campaign.style.backgroundGradient === preset.css;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => selectGradient(preset.css)}
                        className={`relative rounded-2xl overflow-hidden h-24 border-2 transition-all hover:scale-[1.03] active:scale-95 group ${isSelected ? 'border-primary shadow-xl shadow-primary/10' : 'border-transparent hover:border-outline-variant/30'
                          }`}
                        style={{ background: preset.previewCss }}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
                            <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/10 to-transparent">
                          <p className={`text-center text-[9px] font-black uppercase tracking-[0.1em] ${preset.isDark ? 'text-white' : 'text-slate-900/60'}`}>
                            {preset.label}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Builder */}
              <div className="p-6 bg-surface-container-low rounded-3xl border border-outline-variant/10 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">auto_awesome</span>
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface">Gradient Builder</p>
                  </div>
                  <button
                    onClick={applyCustomGradient}
                    className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-primary/20 transition-all active:scale-95"
                  >
                    Generate
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Start</label>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-outline-variant/10 shadow-sm">
                      <input
                        type="color"
                        value={campaign.style.customGradientStart}
                        onChange={(e) => onChange({ style: { ...campaign.style, customGradientStart: e.target.value } })}
                        className="w-7 h-7 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                      />
                      <span className="text-[10px] font-mono font-bold uppercase text-on-surface tracking-wider">{campaign.style.customGradientStart}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">End</label>
                    <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-outline-variant/10 shadow-sm">
                      <input
                        type="color"
                        value={campaign.style.customGradientEnd}
                        onChange={(e) => onChange({ style: { ...campaign.style, customGradientEnd: e.target.value } })}
                        className="w-7 h-7 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                      />
                      <span className="text-[10px] font-mono font-bold uppercase text-on-surface tracking-wider">{campaign.style.customGradientEnd}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Angle: {campaign.style.customGradientDirection}</label>
                  </div>
                  <input
                    type="range" min="0" max="360" step="45"
                    value={parseInt(campaign.style.customGradientDirection ?? "0")}
                    onChange={(e) => onChange({ style: { ...campaign.style, customGradientDirection: `${e.target.value}deg` } })}
                    className="w-full accent-primary h-2 bg-surface-container-lowest rounded-full appearance-none cursor-pointer border border-outline-variant/5 shadow-inner"
                  />
                </div>
              </div>
            </div>
          )}

          {campaign.style?.backgroundStyle === 'image' && campaign.style?.backgroundImage ? (
            <div className="relative rounded-2xl overflow-hidden h-36 border-2 border-outline-variant/10 shadow-md">
              <img src={campaign.style.backgroundImage} alt="Background" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center gap-4">
                <button onClick={() => bgInputRef.current?.click()} className="px-4 py-2 bg-white text-on-surface text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-surface-container transition-all active:scale-95 shadow-lg">Change</button>
                <button onClick={clearBackground} className="px-4 py-2 bg-error text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-error-container transition-all active:scale-95 shadow-lg shadow-error/20">Remove</button>
              </div>
            </div>
          ) : campaign.style.backgroundStyle === 'image' ? (
            <button onClick={() => bgInputRef.current?.click()} className="w-full border-2 border-dashed border-outline-variant/30 rounded-3xl p-10 flex flex-col items-center gap-4 bg-surface-container-low/30 hover:bg-surface-container-low hover:border-primary/40 transition-all cursor-pointer group shadow-sm">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-3xl">add_photo_alternate</span>
              </div>
              <div className="text-center">
                <p className="text-xs font-black text-on-surface uppercase tracking-widest">Select Background Image</p>
                <p className="text-[10px] text-outline/60 mt-2 leading-relaxed max-w-[240px]">High-res vertical photos work best for premium mobile experience (1080×1920px).</p>
              </div>
            </button>
          ) : null}

          {campaign.style.backgroundStyle === 'image' && campaign.style.backgroundImage && showLowResWarning && (
            <div className="mt-8 p-6 bg-white border border-orange-200 rounded-3xl flex gap-5 items-start shadow-xl shadow-orange-900/5 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-orange-100">
                <span className="material-symbols-outlined text-orange-600 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              </div>
              <div className="flex-1">
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Quality Alert</h4>
                <p className="text-[13px] text-slate-800 font-bold mt-1.5 leading-snug text-balance">Image file is small (&lt; 150KB). It may look blurry on Retina displays.</p>
                <p className="text-[11px] text-slate-500 mt-1.5 font-medium">Pro Tip: Use photos at least 1080px wide for a crisp, high-end feel.</p>
                <div className="flex gap-6 mt-5">
                  <button onClick={() => bgInputRef.current?.click()} className="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors underline underline-offset-8 decoration-2">Change Image</button>
                  <button onClick={() => setShowLowResWarning(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Keep anyway</button>
                </div>
              </div>
            </div>
          )}

          <input ref={bgInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
        </div>
      </div>
    </section>
  );
}
