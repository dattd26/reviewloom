'use client';

import { CampaignConfig } from '@/types/campaign';

interface Props {
  campaign: CampaignConfig;
  onChange: (patch: Partial<CampaignConfig>) => void;
}

export default function ContentSection({ campaign, onChange }: Props) {
  return (
    <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-secondary/10 rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-secondary text-[18px]">edit_note</span>
        </div>
        <h3 className="text-base font-headline font-bold text-on-surface">Content & Messaging</h3>
      </div>

      <div className="space-y-5">
        {/* Custom Heading */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
            Rating Question
          </label>
          <input
            className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none text-on-surface placeholder:text-outline/50"
            placeholder="How was your experience?"
            type="text"
            value={campaign.settings.heading}
            onChange={(e) => onChange({ settings: { ...campaign.settings, heading: e.target.value } })}
          />
          <p className="text-[11px] text-on-surface-variant/60 italic">
            Personalize the question shown to your customers.
          </p>
        </div>

        {/* Thank You Message */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
            Thank You Message
          </label>
          <textarea
            rows={3}
            className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none text-on-surface placeholder:text-outline/50 resize-none"
            placeholder="Thank you for your feedback! See you next time."
            value={campaign.settings.thankYouMessage}
            onChange={(e) => onChange({ settings: { ...campaign.settings, thankYouMessage: e.target.value } })}
          />
          <p className="text-[11px] text-on-surface-variant/60 italic">
            Shown after submission. Great place to offer a reward hint.
          </p>
        </div>

        {/* CTA Label */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
            Submit Button Label
          </label>
          <div className="flex gap-2 flex-wrap">
            {['Submit Feedback', 'Gửi ý kiến', 'Share Now', 'Done'].map((preset) => (
              <button
                key={preset}
                onClick={() => onChange({ settings: { ...campaign.settings, ctaLabel: preset } })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${campaign.settings.ctaLabel === preset
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'border-outline-variant/20 bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
              >
                {preset}
              </button>
            ))}
          </div>
          <input
            className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none text-on-surface placeholder:text-outline/50"
            placeholder="Custom label..."
            type="text"
            value={campaign.settings.ctaLabel}
            onChange={(e) => onChange({ settings: { ...campaign.settings, ctaLabel: e.target.value } })}
          />
        </div>
      </div>
    </section>
  );
}
