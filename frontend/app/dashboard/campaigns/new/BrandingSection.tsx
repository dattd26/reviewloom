'use client';

import { useRef, useState, useEffect } from 'react';
import {
  CampaignConfig,
  FONT_OPTIONS,
  FontOption,
  BackgroundStyle,
  GRADIENT_PRESETS,
} from './types';

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

export default function BrandingSection({ campaign, onChange }: Props) {
  const bgInputRef = useRef<HTMLInputElement>(null);
  const [showLowResWarning, setShowLowResWarning] = useState(false);

  // Sync custom gradient to backgroundGradient when custom values change
  useEffect(() => {
    if (campaign.backgroundStyle === 'gradient' && !GRADIENT_PRESETS.some(p => p.css === campaign.backgroundGradient)) {
      const customCss = `linear-gradient(${campaign.customGradientDirection}, ${campaign.customGradientStart}, ${campaign.customGradientEnd})`;
      if (campaign.backgroundGradient !== customCss) {
        onChange({ backgroundGradient: customCss });
      }
    }
  }, [campaign.customGradientStart, campaign.customGradientEnd, campaign.customGradientDirection]);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size < 150_000) {
      setShowLowResWarning(true);
    } else {
      setShowLowResWarning(false);
    }

    const reader = new FileReader();
    reader.onload = (ev) =>
      onChange({
        backgroundStyle: 'image',
        backgroundImage: ev.target?.result as string,
        backgroundGradient: '',
      });
    reader.readAsDataURL(file);
  };

  const selectGradient = (css: string) => {
    onChange({ backgroundStyle: 'gradient', backgroundGradient: css, backgroundImage: null });
  };

  const applyCustomGradient = () => {
    const customCss = `linear-gradient(${campaign.customGradientDirection}, ${campaign.customGradientStart}, ${campaign.customGradientEnd})`;
    onChange({ backgroundStyle: 'gradient', backgroundGradient: customCss, backgroundImage: null });
  };

  const clearBackground = () => {
    onChange({ backgroundStyle: 'none', backgroundGradient: '', backgroundImage: null });
    setShowLowResWarning(false);
  };

  return (
    <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[18px]">palette</span>
        </div>
        <h3 className="text-base font-headline font-bold text-on-surface">Visual Branding</h3>
      </div>

      <div className="space-y-6">
        {/* ── Brand Color ─────────────────────────────────────────── */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
            Brand Color
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                title={color}
                onClick={() => onChange({ primaryColor: color })}
                className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
                style={{
                  backgroundColor: color,
                  borderColor: 'transparent',
                  boxShadow:
                    campaign.primaryColor === color
                      ? `0 0 0 3px white, 0 0 0 5px ${color}`
                      : 'none',
                }}
              >
                {campaign.primaryColor === color && (
                  <span
                    className="material-symbols-outlined text-white text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check
                  </span>
                )}
              </button>
            ))}
            <label className="w-8 h-8 rounded-full border-2 border-dashed border-outline-variant/40 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden">
              <span className="material-symbols-outlined text-outline text-[14px]">add</span>
              <input
                type="color"
                value={campaign.primaryColor}
                onChange={(e) => onChange({ primaryColor: e.target.value })}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* ── Font Family ─────────────────────────────────────────── */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
            Font Family
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font.value}
                onClick={() => onChange({ fontFamily: font.value as FontOption })}
                className={`px-3 py-2.5 rounded-xl border text-left transition-all ${campaign.fontFamily === font.value
                  ? 'border-primary/50 bg-primary/5 shadow-sm'
                  : 'border-outline-variant/20 bg-surface-container-low hover:bg-surface-container'
                  }`}
              >
                <p className="text-sm font-semibold text-on-surface truncate" style={{ fontFamily: `'${font.value}', sans-serif` }}>
                  {font.label}
                </p>
                <p className="text-[10px] text-on-surface-variant/60 mt-0.5">{font.category}</p>
              </button>
            ))}
          </div>
        </div>

        {/* ── Background ──────────────────────────────────────────── */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
            Background Style
          </label>

          <div className="flex gap-1 p-1 bg-surface-container-low rounded-xl border border-outline-variant/10">
            {BG_MODES.map((mode) => (
              <button
                key={mode.id}
                onClick={() => {
                  if (mode.id === 'none') clearBackground();
                  else if (mode.id === 'image') bgInputRef.current?.click();
                  else onChange({ backgroundStyle: 'gradient' });
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all duration-200 ${campaign.backgroundStyle === mode.id
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
              >
                <span className="material-symbols-outlined text-[15px]">{mode.icon}</span>
                <span className="hidden sm:inline">{mode.label}</span>
              </button>
            ))}
          </div>

          {campaign.backgroundStyle === 'gradient' && (
            <div className="space-y-6 pt-2">
              {/* Presets Grid */}
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-outline opacity-70">
                  Featured Presets
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {GRADIENT_PRESETS.map((preset) => {
                    const isSelected = campaign.backgroundGradient === preset.css;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => selectGradient(preset.css)}
                        className={`relative rounded-xl overflow-hidden h-20 border-2 transition-all hover:scale-[1.03] active:scale-95 ${isSelected ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent hover:border-outline-variant/30'
                          }`}
                        style={{ background: preset.previewCss }}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[1px]">
                            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          </div>
                        )}
                        <span className={`absolute bottom-1.5 left-0 right-0 text-center text-[9px] font-black uppercase tracking-widest ${preset.isDark ? 'text-white drop-shadow-md' : 'text-slate-900/60'}`}>
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Builder */}
              <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-outline">Custom Builder</p>
                  <button
                    onClick={applyCustomGradient}
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                  >
                    Apply Custom
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant">Start Color</label>
                    <div className="flex items-center gap-2 bg-surface-container-lowest p-1.5 rounded-lg border border-outline-variant/10">
                      <input
                        type="color"
                        value={campaign.customGradientStart}
                        onChange={(e) => onChange({ customGradientStart: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                      />
                      <span className="text-[10px] font-mono font-bold uppercase">{campaign.customGradientStart}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-on-surface-variant">End Color</label>
                    <div className="flex items-center gap-2 bg-surface-container-lowest p-1.5 rounded-lg border border-outline-variant/10">
                      <input
                        type="color"
                        value={campaign.customGradientEnd}
                        onChange={(e) => onChange({ customGradientEnd: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-none p-0 bg-transparent"
                      />
                      <span className="text-[10px] font-mono font-bold uppercase">{campaign.customGradientEnd}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-on-surface-variant">Angle: {campaign.customGradientDirection}</label>
                  </div>
                  <input
                    type="range" min="0" max="360" step="45"
                    value={parseInt(campaign.customGradientDirection)}
                    onChange={(e) => onChange({ customGradientDirection: `${e.target.value}deg` })}
                    className="w-full accent-primary h-1.5 bg-surface-container-lowest rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {campaign.backgroundStyle === 'image' && campaign.backgroundImage ? (
            <div className="relative rounded-xl overflow-hidden h-28 border border-outline-variant/20">
              <img src={campaign.backgroundImage} alt="Background" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3">
                <button onClick={() => bgInputRef.current?.click()} className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-lg hover:bg-white/30 transition-colors">Change</button>
                <button onClick={clearBackground} className="px-3 py-1.5 bg-error/80 backdrop-blur-sm text-white text-xs font-semibold rounded-lg hover:bg-error transition-colors">Remove</button>
              </div>
            </div>
          ) : campaign.backgroundStyle === 'image' ? (
            <button onClick={() => bgInputRef.current?.click()} className="w-full border-2 border-dashed border-outline-variant/30 rounded-xl p-6 flex flex-col items-center gap-2 bg-surface-container-low/30 hover:bg-surface-container-low transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-outline text-2xl group-hover:text-primary transition-colors">upload_file</span>
              <p className="text-xs font-semibold text-on-surface-variant">Click to upload background</p>
              <p className="text-[10px] text-outline/60 text-center leading-relaxed">PNG, JPG up to 5 MB · Recommended: <strong>9:16</strong>, min 1080 × 1920 px</p>
            </button>
          ) : null}

          {campaign.backgroundStyle === 'image' && campaign.backgroundImage && showLowResWarning && (
            <div className="mt-6 p-5 bg-white border border-orange-200 rounded-2xl flex gap-4 items-start shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-orange-100">
                <span className="material-symbols-outlined text-orange-600 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              </div>
              <div className="flex-1">
                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em]">Quality Alert</h4>
                <p className="text-[12px] text-slate-800 font-bold mt-1 leading-snug">Image file is small (&lt; 150KB). It may look blurry on Retina displays.</p>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Recommendation: Use a photo at least <strong>1080px wide</strong> for the best look.</p>
                <div className="flex gap-5 mt-4">
                  <button onClick={() => bgInputRef.current?.click()} className="text-[10px] font-black uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors underline underline-offset-4">Change Image</button>
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
