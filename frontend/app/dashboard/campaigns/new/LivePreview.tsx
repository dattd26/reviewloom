'use client';

import { CampaignConfig, GRADIENT_PRESETS } from './types';

interface Props {
  campaign: CampaignConfig;
}

const EMOJI_MAP = ['😞', '😕', '😐', '😊', '😍'];

function RatingPreview({ campaign }: { campaign: CampaignConfig }) {
  if (campaign.ratingIconType === 'thumbs') {
    return (
      <div className="flex gap-4 mt-2">
        {['👎', '👍'].map((icon, i) => (
          <button
            key={i}
            className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl transition-all"
            style={{ borderColor: `${campaign.primaryColor}30` }}
          >
            {icon}
          </button>
        ))}
      </div>
    );
  }
  if (campaign.ratingIconType === 'emoji') {
    return (
      <div className="flex gap-1 mt-2">
        {EMOJI_MAP.map((emoji, i) => (
          <button key={i} className="text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            {emoji}
          </button>
        ))}
      </div>
    );
  }
  // Stars default
  return (
    <div className="flex gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="material-symbols-outlined text-2xl cursor-pointer"
          style={{
            color: star <= 4 ? campaign.primaryColor : '#c4c5d7',
            fontVariationSettings: star <= 4 ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          star
        </span>
      ))}
    </div>
  );
}

export default function LivePreview({ campaign }: Props) {
  const qrFrameLabel =
    campaign.qrFrame === 'scan_to_rate'
      ? 'Scan to Rate Us'
      : campaign.qrFrame === 'review_discount'
        ? 'Review & Get 10% Off'
        : null;

  return (
    <div className="lg:col-span-2 flex flex-col gap-8 lg:sticky lg:top-28 lg:h-fit">
      {/* Phone Mockup */}
      <div className="relative mx-auto lg:mx-0 w-full max-w-[300px]">
        {/* Glow */}
        <div
          className="absolute -inset-1 rounded-[3rem] blur-xl opacity-40 transition-all duration-500"
          style={{ background: `linear-gradient(to bottom, ${campaign.primaryColor}40, transparent)` }}
        />

        {/* Phone Shell */}
        <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl overflow-hidden border-[6px] border-slate-800">
          {/* Screen */}
          {(() => {
            // Derive which gradient preset is active (if any) to determine dark/light context
            const activeGradient =
              campaign.backgroundStyle === 'gradient' && campaign.backgroundGradient
                ? GRADIENT_PRESETS.find((g) => g.css === campaign.backgroundGradient)
                : null;

            const isDarkBg = (activeGradient && activeGradient.isDark) || campaign.backgroundStyle === 'image';

            const textPrimary = isDarkBg ? '#ffffff' : '#0f172a';
            const textMuted = isDarkBg ? 'rgba(255,255,255,0.75)' : 'rgba(51,65,85,0.75)';

            // Build the screen background style
            const screenStyle: React.CSSProperties = {
              fontFamily: `'${campaign.fontFamily}', sans-serif`,
              backgroundColor: '#ffffff',
            };
            if (campaign.backgroundStyle === 'gradient' && campaign.backgroundGradient) {
              screenStyle.backgroundImage = campaign.backgroundGradient;
            }

            return (
              <div
                className="rounded-[2.2rem] h-[580px] w-full overflow-hidden flex flex-col relative"
                style={screenStyle}
              >

                {/* Background: custom image */}
                {campaign.backgroundStyle === 'image' && campaign.backgroundImage && (
                  <>
                    <div
                      className="absolute inset-0 z-0"
                      style={{
                        backgroundImage: `url(${campaign.backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    />
                    {/* Readability Scrim: Darker at top and bottom, subtle in middle */}
                    <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/30 to-black/70" />
                  </>
                )}

                {/* Status Bar */}
                <div
                  className="h-6 px-6 pt-3 flex justify-between items-center text-[10px] font-bold absolute top-0 w-full z-10"
                  style={{ color: isDarkBg ? 'rgba(255,255,255,0.9)' : '#64748b' }}
                >
                  <span>9:41</span>
                  <div className="flex gap-1 items-center">
                    <span className="material-symbols-outlined text-[12px]">signal_cellular_alt</span>
                    <span className="material-symbols-outlined text-[12px]">wifi</span>
                    <span className="material-symbols-outlined text-[12px]">battery_full</span>
                  </div>
                </div>

                {/* App Header */}
                <div className="relative z-10 flex flex-col items-center pt-16 pb-6 px-6">
                  <div
                    className={`w-16 h-16 flex items-center justify-center mb-4 transition-all duration-500 ${
                      campaign.logoStyle === 'circle' ? 'rounded-full shadow-xl border' : 
                      campaign.logoStyle === 'soft' ? 'rounded-2xl shadow-xl border' : 
                      campaign.logoStyle === 'square' ? 'rounded-md shadow-xl border' : 
                      'rounded-none shadow-none border-none'
                    }`}
                    style={{
                      backgroundColor: campaign.logoStyle === 'none' ? 'transparent' : (isDarkBg ? `${campaign.primaryColor}40` : 'rgba(255,255,255,0.7)'),
                      borderColor: campaign.logoStyle === 'none' ? 'transparent' : (isDarkBg ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.08)'),
                      backdropFilter: campaign.logoStyle === 'none' ? 'none' : 'blur(10px)',
                    }}
                  >
                    {campaign.logo ? (
                      <img
                        src={campaign.logo}
                        alt="Logo"
                        className={`w-full h-full object-contain drop-shadow-sm ${campaign.logoStyle === 'none' ? 'p-0' : 'p-2'}`}
                      />
                    ) : (
                      <span className="material-symbols-outlined text-3xl" style={{ color: campaign.primaryColor }}>
                        storefront
                      </span>
                    )}
                  </div>
                  <h5
                    className="text-base font-extrabold text-center leading-tight transition-all duration-300 drop-shadow-md"
                    style={{
                      fontFamily: `'${campaign.fontFamily}', sans-serif`,
                      color: textPrimary ?? '#191c1e',
                      textShadow: isDarkBg ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
                    }}
                  >
                    {campaign.name || 'Business Name'}
                  </h5>
                  <p
                    className="text-[10px] mt-1.5 text-center px-2 font-medium drop-shadow-sm"
                    style={{
                      color: textMuted ?? 'rgba(67,70,85,0.7)',
                      textShadow: isDarkBg ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                    }}
                  >
                    Thank you for visiting us! We&apos;d love to hear your thoughts.
                  </p>
                </div>

                {/* Feedback Card */}
                <div className="relative z-10 flex-1 px-4">
                  <div
                    className="p-5 rounded-2xl border flex flex-col items-center shadow-sm"
                    style={{
                      backgroundColor: isDarkBg ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.92)',
                      backdropFilter: 'blur(12px)',
                      borderColor: isDarkBg ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)',
                    }}
                  >
                    <span
                      className="text-xs font-bold text-center transition-all duration-300"
                      style={{ fontFamily: `'${campaign.fontFamily}', sans-serif`, color: textPrimary ?? '#191c1e' }}
                    >
                      {campaign.heading || 'How was your experience?'}
                    </span>

                    <RatingPreview campaign={campaign} />

                    <div
                      className="w-full h-16 rounded-xl mt-4 p-2 border"
                      style={{
                        backgroundColor: isDarkBg ? 'rgba(255,255,255,0.07)' : '#f9fafb',
                        borderColor: isDarkBg ? 'rgba(255,255,255,0.10)' : '#f3f4f6',
                      }}
                    >
                      <p className="text-[9px]" style={{ color: textMuted ?? 'rgba(116,118,134,0.5)' }}>
                        Tell us more (optional)...
                      </p>
                    </div>

                    {campaign.collectContact && (
                      <div
                        className="w-full h-8 rounded-xl mt-2 p-2 flex items-center border"
                        style={{
                          backgroundColor: isDarkBg ? 'rgba(255,255,255,0.07)' : '#f9fafb',
                          borderColor: isDarkBg ? 'rgba(255,255,255,0.10)' : '#f3f4f6',
                        }}
                      >
                        <p className="text-[9px]" style={{ color: textMuted ?? 'rgba(116,118,134,0.5)' }}>
                          Email or phone (optional)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="relative z-10 p-4 mt-auto">
                  <button
                    className="w-full py-3 font-bold text-xs text-white rounded-xl shadow-md transition-all duration-300"
                    style={{
                      backgroundColor: campaign.primaryColor,
                      fontFamily: `'${campaign.fontFamily}', sans-serif`,
                      boxShadow: `0 4px 14px ${campaign.primaryColor}40`,
                    }}
                  >
                    {campaign.ctaLabel || 'Submit Feedback'}
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Floating QR Preview */}
        <div className="absolute -bottom-6 -right-6 lg:-right-10 bg-white p-3 rounded-2xl shadow-xl border border-outline-variant/10 flex flex-col items-center gap-1.5 w-[110px]">
          {/* QR Dots simulation */}
          <div className="w-[72px] h-[72px] rounded-lg border border-outline-variant/20 relative overflow-hidden flex items-center justify-center bg-white">
            <span
              className="material-symbols-outlined text-[60px] opacity-80"
              style={{ color: campaign.qrDotColor }}
            >
              qr_code_2
            </span>
            {campaign.logo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded-sm p-0.5 shadow-sm">
                  <img src={campaign.logo} alt="" className="w-full h-full object-contain" />
                </div>
              </div>
            )}
          </div>
          {qrFrameLabel && (
            <span
              className="text-[8px] font-black text-center leading-tight px-1"
              style={{ color: campaign.qrDotColor }}
            >
              {qrFrameLabel}
            </span>
          )}
          <span className="text-[8px] font-black uppercase tracking-widest text-on-surface-variant">
            Dynamic QR
          </span>
        </div>
      </div>

      {/* Incentive Preview (if enabled) */}
      {campaign.incentiveEnabled && campaign.incentiveCoupon && (
        <div
          className="mx-auto lg:mx-0 w-full max-w-[300px] p-4 rounded-2xl border-2 border-dashed text-center transition-all duration-300"
          style={{ borderColor: `${campaign.primaryColor}50`, backgroundColor: `${campaign.primaryColor}08` }}
        >
          <span className="text-lg">🎁</span>
          <p className="text-xs font-semibold text-on-surface-variant mt-1">After submit, customers see:</p>
          <p
            className="text-xl font-black font-mono tracking-widest mt-2 transition-all duration-300"
            style={{ color: campaign.primaryColor }}
          >
            {campaign.incentiveCoupon}
          </p>
          <p className="text-[10px] text-on-surface-variant/60 mt-1">Reward coupon code</p>
        </div>
      )}

      {/* Growth Tip Card */}
      <div className="bg-gradient-to-br from-secondary to-[#0c714d] p-5 rounded-2xl text-white shadow-lg shadow-secondary/20 relative overflow-hidden mx-auto lg:mx-0 w-full max-w-[300px]">
        <div className="absolute top-0 right-0 w-28 h-28 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
        <div className="flex gap-3 relative z-10">
          <span className="material-symbols-outlined text-secondary-fixed/90 text-2xl">lightbulb</span>
          <div>
            <h6 className="font-headline font-bold text-xs mb-1 text-secondary-fixed">Growth Tip</h6>
            <p className="text-[10px] opacity-95 leading-relaxed font-medium text-white">
              Campaigns with custom logos see a{' '}
              <span className="font-extrabold text-white bg-white/20 px-1 rounded">24% higher</span>{' '}
              scan-to-feedback conversion rate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
