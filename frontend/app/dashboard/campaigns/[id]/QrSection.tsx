'use client';

import { CampaignConfig, QR_FRAMES, QrFrameType } from './types';

interface Props {
  campaign: CampaignConfig;
  onChange: (patch: Partial<CampaignConfig>) => void;
}

const QR_DOT_PRESETS = ['#000000', '#1e293b', '#0037b0', '#7c3aed', '#db2777', '#16a34a'];

export default function QrSection({ campaign, onChange }: Props) {
  return (
    <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-tertiary/10 rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-tertiary text-[18px]">qr_code_2</span>
        </div>
        <h3 className="text-base font-headline font-bold text-on-surface">QR Code Styling</h3>
      </div>

      <div className="space-y-6">
        {/* Logo in QR */}
        <div className="flex items-start gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
          <div className="flex-1">
            <p className="text-sm font-semibold text-on-surface">Embed Logo in QR Center</p>
            <p className="text-xs text-on-surface-variant/70 mt-0.5">
              Automatically places your uploaded logo in the middle of the QR code.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">
              {campaign.logoUrl ? 'Logo ready' : 'Upload logo first'}
            </span>
            <div
              className={`w-10 h-5 rounded-full relative transition-all cursor-pointer ${campaign.logoUrl ? 'bg-primary' : 'bg-outline-variant/40 cursor-not-allowed'
                }`}
            >
              <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
            </div>
          </div>
        </div>

        {/* QR Dot Color */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
            QR Dot Color
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {QR_DOT_PRESETS.map((color) => (
              <button
                key={color}
                onClick={() => onChange({ style: { ...campaign.style, qrDotColor: color } })}
                className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: color,
                  borderColor: 'transparent',
                  boxShadow: campaign.style.qrDotColor === color ? `0 0 0 3px white, 0 0 0 5px ${color}` : '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            ))}
            <label className="w-8 h-8 rounded-full border-2 border-dashed border-outline-variant/40 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden">
              <span className="material-symbols-outlined text-outline text-[14px]">add</span>
              <input
                type="color"
                value={campaign.style.qrDotColor}
                onChange={(e) => onChange({ style: { ...campaign.style, qrDotColor: e.target.value } })}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* QR Frame */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
            QR Frame Text
          </label>
          <div className="space-y-2">
            {QR_FRAMES.map((frame) => (
              <label
                key={frame.value}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${campaign.style.qrFrame === frame.value
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-outline-variant/20 bg-surface-container-low hover:bg-surface-container'
                  }`}
              >
                <input
                  type="radio"
                  name="qrFrame"
                  value={frame.value}
                  checked={campaign.style.qrFrame === frame.value}
                  onChange={() => onChange({ style: { ...campaign.style, qrFrame: frame.value as QrFrameType } })}
                  className="accent-primary"
                />
                <span className="text-sm font-medium text-on-surface">{frame.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
