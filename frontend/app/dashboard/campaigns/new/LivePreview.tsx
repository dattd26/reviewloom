'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
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
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);
  const qrOnlyRef = useRef<HTMLDivElement>(null);

  // Generate real QR Code with Debouncing to improve performance during color dragging
  useEffect(() => {
    const timer = setTimeout(() => {
      const generateQR = async () => {
        try {
          const url = await QRCode.toDataURL(campaign.googleReviewUrl || 'https://reviewloom.com', {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 512,
            color: {
              dark: campaign.qrDotColor || '#000000',
              light: '#ffffff'
            }
          });
          setQrCodeDataUrl(url);
        } catch (err) {
          console.error('Error generating QR code:', err);
        }
      };
      generateQR();
    }, 150);
    // mỗi lần component re-render thì clear timer cũ, 
    // Mỗi lần có change huỷ timer cũ và tạo một setTimeout(150ms) mới
    // => Khi user đang kéo color thì không generate QR liên tục
    return () => clearTimeout(timer);
  }, [campaign.googleReviewUrl, campaign.qrDotColor]);

  const handleDownload = async (type: 'qr' | 'standee') => {
    const ref = type === 'qr' ? qrOnlyRef : printableRef;
    if (!ref.current) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(ref.current, { quality: 1.0, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `reviewloom-${type}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsDownloading(false);
    }
  };

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
                    className={`w-16 h-16 flex items-center justify-center mb-4 transition-all duration-500 ${campaign.logoStyle === 'circle' ? 'rounded-full shadow-xl border' :
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

        {/* Redesigned QR Asset Card (Safe layout, real QR generation) */}
        <div className="mt-8 bg-surface-container-lowest p-4 rounded-3xl shadow-sm border border-outline-variant/10 flex items-center gap-5 w-[300px] sm:w-[320px] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 relative z-30">
          <div className="relative w-[76px] h-[76px] rounded-2xl overflow-hidden bg-white flex items-center justify-center shrink-0 shadow-sm border border-outline-variant/10">
            {qrCodeDataUrl ? (
              <img src={qrCodeDataUrl} alt="QR Code" className="w-full h-full object-contain p-1" />
            ) : (
              <span className="material-symbols-outlined text-[40px] opacity-20" style={{ color: campaign.qrDotColor }}>qr_code_2</span>
            )}

            {/* Embedded Logo */}
            {campaign.logo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[22px] h-[22px] bg-white rounded-md flex items-center justify-center shadow-md border border-outline-variant/10 overflow-hidden">
                  <img src={campaign.logo} alt="Embedded Logo" className="w-full h-full object-contain p-0.5" />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 relative z-40">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[14px]">qr_code_scanner</span>
                <h6 className="text-[10px] font-black uppercase tracking-widest text-on-surface">Dynamic Asset</h6>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownload('qr'); }}
                  title="Download QR Only"
                  disabled={isDownloading}
                  className="w-8 h-8 rounded-lg hover:bg-surface-container-high flex items-center justify-center transition-colors text-outline-variant hover:text-primary pointer-events-auto"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownload('standee'); }}
                  title="Download Print-ready Standee"
                  disabled={isDownloading}
                  className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center transition-colors text-primary hover:bg-primary hover:text-white pointer-events-auto"
                >
                  <span className="material-symbols-outlined text-[18px]">print</span>
                </button>
              </div>
            </div>
            <p className="text-[11px] font-bold text-on-surface-variant/80 leading-tight">
              {qrFrameLabel || 'Standard QR Code'}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shadow-inner border border-black/5" style={{ backgroundColor: campaign.qrDotColor }}></span>
              <span className="text-[9px] font-mono font-bold text-outline uppercase tracking-wider">{campaign.qrDotColor}</span>
            </div>
          </div>
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

      {/* --- HIDDEN EXPORT TEMPLATES (Moved outside main flow for safety) --- */}
      <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none overflow-hidden" style={{ opacity: 0 }}>
        {/* 1. QR Only High-Res Template */}
        <div ref={qrOnlyRef} className="w-[1024px] h-[1024px] bg-white flex items-center justify-center relative">
          {qrCodeDataUrl && (
            <img src={qrCodeDataUrl} className="w-full h-full object-contain" alt="" />
          )}
          {campaign.logo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[280px] h-[280px] bg-white rounded-[60px] flex items-center justify-center shadow-2xl border-[16px] border-white overflow-hidden">
                <img src={campaign.logo} className="w-full h-full object-contain p-4" alt="" />
              </div>
            </div>
          )}
        </div>

        {/* 2. Professional Standee Template (A5 Ratio) */}
        <div
          ref={printableRef}
          className="w-[1240px] h-[1754px] bg-white p-20 flex flex-col items-center justify-between text-center"
          style={{ fontFamily: `'${campaign.fontFamily}', sans-serif` }}
        >
          {/* Header Area */}
          <div className="w-full space-y-12 pt-20">
            {campaign.logo && (
              <img src={campaign.logo} className="h-32 mx-auto object-contain mb-8" alt="" />
            ) || <div className="h-32" />}
            <h1 className="text-8xl font-black tracking-tight text-slate-900 leading-tight">
              {campaign.heading}
            </h1>
            <p className="text-4xl font-bold text-slate-400 uppercase tracking-[0.4em] pt-4">
              SCAN TO REVIEW
            </p>
          </div>

          {/* QR Focus Area */}
          <div className="relative">
            {/* Decorative Frame */}
            <div className="absolute -inset-16 border-[12px] border-slate-100 rounded-[120px] -z-10" />
            <div
              className="p-12 bg-white rounded-[100px] shadow-[0_40px_80px_rgba(0,0,0,0.1)] border-8"
              style={{ borderColor: `${campaign.qrDotColor}20` }}
            >
              <div className="relative w-[600px] h-[600px]">
                {qrCodeDataUrl && (
                  <img src={qrCodeDataUrl} className="w-full h-full" alt="" />
                )}
                {campaign.logo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[180px] h-[180px] bg-white rounded-[40px] flex items-center justify-center shadow-xl border-8 border-white overflow-hidden">
                      <img src={campaign.logo} className="w-full h-full object-contain p-2" alt="" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Frame Label */}
            {qrFrameLabel && (
              <div
                className="mt-16 inline-block px-12 py-6 rounded-full text-white text-4xl font-black uppercase tracking-widest"
                style={{ backgroundColor: campaign.qrDotColor }}
              >
                {qrFrameLabel}
              </div>
            )}
          </div>

          {/* Footer Area */}
          <div className="w-full pb-20 space-y-8">
            <div className="flex items-center justify-center gap-6">
              <span className="w-24 h-2 bg-slate-200 rounded-full"></span>
              <p className="text-4xl font-black text-slate-800">ReviewLoom</p>
              <span className="w-24 h-2 bg-slate-200 rounded-full"></span>
            </div>
            <p className="text-3xl text-slate-400 font-medium tracking-wide">
              Thank you for supporting our local business!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
