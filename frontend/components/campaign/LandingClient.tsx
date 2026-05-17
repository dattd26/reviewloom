'use client';

import { useState } from 'react';
import RatingSystem from './RatingSystem';
import { CampaignConfig, GRADIENT_PRESETS } from '@/app/dashboard/campaigns/[id]/types';
import { ScanService } from '@/services/scan-service';

interface Props {
  slug: string;
  campaign: Partial<CampaignConfig>;
}

type Step = 'rating' | 'feedback' | 'thank-you';

export default function LandingClient({ slug, campaign }: Props) {
  const [step, setStep] = useState<Step>('rating');
  const [rating, setRating] = useState(0);
  const [isPending, setIsPending] = useState(false); // Trạng thái chờ chuyển step
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    name: '',
    email: '',
    message: ''
  });

  const primaryColor = campaign.style?.primaryColor || '#0037b0';
  const routingThreshold = campaign.settings?.routingThreshold || 4;

  // Design context
  const activeGradient = campaign.style?.backgroundStyle === 'gradient' && campaign.style?.backgroundGradient
    ? GRADIENT_PRESETS.find((g) => g.css === campaign.style?.backgroundGradient)
    : null;
  const isDarkBg = (activeGradient && activeGradient.isDark) || campaign.style?.backgroundStyle === 'image';
  const textPrimary = isDarkBg ? '#ffffff' : '#191c1e';
  const textMuted = isDarkBg ? 'rgba(255,255,255,0.7)' : 'rgba(67,70,85,0.7)';

  const handleRatingChange = (val: number) => {
    if (isPending) return; // Chặn click 

    setRating(val);
    setIsPending(true); // Khóa tương tác

    // Delay 
    setTimeout(() => {
      setStep('feedback');
      setIsPending(false); // Reset lại trạng thái 
    }, 400);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const action = rating >= routingThreshold ? 'positive' : 'negative';

    try {
      await ScanService.logScan(slug, {
        rating: rating,
        action: action,
        feedbackName: feedback.name,
        feedbackEmail: feedback.email,
        feedbackMessage: feedback.message
      });

      if (action === 'positive' && campaign.googleReviewUrl) {
        window.location.href = campaign.googleReviewUrl;
      } else {
        setStep('thank-you');
      }
    } catch (error) {
      console.error('Failed to log scan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const screenStyle: React.CSSProperties = {
    fontFamily: `'${campaign.style?.fontFamily}', sans-serif`,
    backgroundColor: '#ffffff',
  };
  if (campaign.style?.backgroundStyle === 'gradient' && campaign.style?.backgroundGradient) {
    screenStyle.backgroundImage = campaign.style?.backgroundGradient;
  }

  return (
    <div className="min-h-[100svh] w-full flex flex-col relative overflow-hidden" style={screenStyle}>
      {/* Background: custom image */}
      {campaign.style?.backgroundStyle === 'image' && campaign.style?.backgroundImage && (
        <>
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${campaign.style?.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 via-black/30 to-black/70" />
        </>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">

        {/* Branding */}
        <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div
            className={`w-24 h-24 flex items-center justify-center mb-6 transition-all duration-500 shadow-2xl border ${campaign.style?.logoStyle === 'circle' ? 'rounded-full' :
              campaign.style?.logoStyle === 'soft' ? 'rounded-3xl' :
                campaign.style?.logoStyle === 'square' ? 'rounded-lg' :
                  'rounded-none border-none shadow-none'
              }`}
            style={{
              backgroundColor: campaign.style?.logoStyle === 'none' ? 'transparent' : (isDarkBg ? `${primaryColor}40` : 'rgba(255,255,255,0.8)'),
              borderColor: campaign.style?.logoStyle === 'none' ? 'transparent' : (isDarkBg ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)'),
              backdropFilter: campaign.style?.logoStyle === 'none' ? 'none' : 'blur(12px)',
            }}
          >
            {campaign.logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={campaign.logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
            ) : (
              <span className="material-symbols-outlined text-5xl" style={{ color: primaryColor }}>storefront</span>
            )}
          </div>
          <h1 className="text-2xl font-black text-center tracking-tight" style={{ color: textPrimary }}>
            {campaign.businessName || 'Business Name'}
          </h1>
        </div>

        {/* Dynamic Card */}
        <div className="w-full bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl shadow-black/10 border border-white/20 animate-in zoom-in-95 duration-500">

          {step === 'rating' && (
            <div className="flex flex-col items-center text-center animate-in fade-in duration-500">
              <h2 className="text-xl font-extrabold mb-2" style={{ color: '#191c1e' }}>
                {campaign.settings?.heading || 'How was your experience?'}
              </h2>
              <p className="text-xs text-outline mb-6">Tap your rating below to start</p>

              <RatingSystem
                type={campaign.style?.ratingIconType || 'stars'}
                value={rating}
                onChange={handleRatingChange}
                primaryColor={primaryColor}
              />
            </div>
          )}

          {step === 'feedback' && (
            <div className="flex flex-col animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setStep('rating')}
                  className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                </button>
                <h2 className="text-lg font-black tracking-tight">Your Feedback</h2>
              </div>

              <div className="space-y-4">
                {campaign.settings?.collectContact && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-outline px-1">Your Name</label>
                      <input
                        type="text"
                        value={feedback.name}
                        onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                        placeholder="Optional"
                        className="w-full px-5 py-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/10 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-outline px-1">Email Address</label>
                      <input
                        type="email"
                        value={feedback.email}
                        onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                        placeholder="Optional"
                        className="w-full px-5 py-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/10 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline px-1">Message</label>
                  <textarea
                    value={feedback.message}
                    onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
                    placeholder="Tell us more about your experience..."
                    rows={4}
                    className="w-full px-5 py-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/10 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 mt-4 rounded-2xl font-black text-sm text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{campaign.settings?.ctaLabel || 'Submit Feedback'}</span>
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'thank-you' && (
            <div className="flex flex-col items-center text-center py-6 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-5xl">check_circle</span>
              </div>
              <h2 className="text-2xl font-black mb-3 tracking-tight">Success!</h2>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                {campaign.settings?.thankYouMessage || 'Thank you for your feedback! See you next time.'}
              </p>

              {campaign.settings?.incentiveEnabled && campaign.settings?.incentiveCoupon && (
                <div className="w-full p-6 rounded-3xl bg-surface-container-lowest border-2 border-dashed border-primary/20 flex flex-col items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-outline mb-2">Your Reward</span>
                  <p className="text-3xl font-black tracking-[0.2em] mb-1" style={{ color: primaryColor }}>
                    {campaign.settings.incentiveCoupon}
                  </p>
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Show this at checkout</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 flex flex-col items-center opacity-40">
          <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: textMuted }}>Powered by</p>
          <p className="text-xs font-black tracking-tight mt-1" style={{ color: textPrimary }}>ReviewLoom</p>
        </div>
      </main>
    </div>
  );
}
