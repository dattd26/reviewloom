'use client';

import { useRef } from 'react';
import { CampaignConfig, FONT_OPTIONS, FontOption } from './types';

interface Props {
  campaign: CampaignConfig;
  onChange: (patch: Partial<CampaignConfig>) => void;
}

const PRESET_COLORS = [
  '#0037b0', '#7c3aed', '#db2777', '#ea580c',
  '#16a34a', '#0891b2', '#854d0e', '#1e293b',
];

export default function BrandingSection({ campaign, onChange }: Props) {
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange({ backgroundImage: ev.target?.result as string });
    reader.readAsDataURL(file);
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
        {/* Primary Color */}
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
                  borderColor: campaign.primaryColor === color ? color : 'transparent',
                  boxShadow: campaign.primaryColor === color ? `0 0 0 3px white, 0 0 0 5px ${color}` : 'none',
                }}
              >
                {campaign.primaryColor === color && (
                  <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                )}
              </button>
            ))}
            {/* Custom color input */}
            <label
              className="w-8 h-8 rounded-full border-2 border-dashed border-outline-variant/40 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden"
              title="Custom color"
            >
              <span className="material-symbols-outlined text-outline text-[14px]">add</span>
              <input
                type="color"
                value={campaign.primaryColor}
                onChange={(e) => onChange({ primaryColor: e.target.value })}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </label>
            <span
              className="text-xs font-mono font-semibold text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-lg border border-outline-variant/20"
            >
              {campaign.primaryColor.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Font Family */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
            Font Family
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {FONT_OPTIONS.map((font) => (
              <button
                key={font.value}
                onClick={() => onChange({ fontFamily: font.value as FontOption })}
                className={`px-3 py-2.5 rounded-xl border text-left transition-all ${
                  campaign.fontFamily === font.value
                    ? 'border-primary/50 bg-primary/5 shadow-sm'
                    : 'border-outline-variant/20 bg-surface-container-low hover:bg-surface-container'
                }`}
              >
                <p
                  className="text-sm font-semibold text-on-surface truncate"
                  style={{ fontFamily: `'${font.value}', sans-serif` }}
                >
                  {font.label}
                </p>
                <p className="text-[10px] text-on-surface-variant/60 mt-0.5">{font.category}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Background Image */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
            Background Image <span className="normal-case font-normal text-outline/70">(optional, subtle overlay)</span>
          </label>
          {campaign.backgroundImage ? (
            <div className="relative rounded-xl overflow-hidden h-24 border border-outline-variant/20">
              <img src={campaign.backgroundImage} alt="Background" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3">
                <button
                  onClick={() => bgInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-lg hover:bg-white/30 transition-colors"
                >
                  Change
                </button>
                <button
                  onClick={() => onChange({ backgroundImage: null })}
                  className="px-3 py-1.5 bg-error/80 backdrop-blur-sm text-white text-xs font-semibold rounded-lg hover:bg-error transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => bgInputRef.current?.click()}
              className="w-full border-2 border-dashed border-outline-variant/30 rounded-xl p-6 flex flex-col items-center gap-2 bg-surface-container-low/30 hover:bg-surface-container-low transition-colors cursor-pointer group"
            >
              <span className="material-symbols-outlined text-outline text-2xl group-hover:text-primary transition-colors">image</span>
              <p className="text-xs font-semibold text-on-surface-variant">Click to upload background</p>
              <p className="text-[10px] text-outline/60">PNG, JPG up to 5MB — applied as a subtle overlay</p>
            </button>
          )}
          <input ref={bgInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
        </div>
      </div>
    </section>
  );
}
