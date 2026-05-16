'use client';

import { CampaignConfig, RatingIconType } from './types';

interface Props {
  campaign: CampaignConfig;
  onChange: (patch: Partial<CampaignConfig>) => void;
}

const RATING_TYPES: { value: RatingIconType; label: string; icon: string; preview: string[] }[] = [
  { value: 'stars', label: 'Stars', icon: 'star', preview: ['⭐', '⭐', '⭐', '⭐', '⭐'] },
  { value: 'emoji', label: 'Emoji', icon: 'sentiment_satisfied', preview: ['😞', '😕', '😐', '😊', '😍'] },
  { value: 'thumbs', label: 'Like / Dislike', icon: 'thumb_up', preview: ['👎', '👍'] },
];

export default function AdvancedSection({ campaign, onChange }: Props) {
  return (
    <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[18px]">tune</span>
        </div>
        <h3 className="text-base font-headline font-bold text-on-surface">Advanced Features</h3>
      </div>

      <div className="space-y-6">
        {/* Rating Icon Type */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
            Rating Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {RATING_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => onChange({ style: { ...campaign.style, ratingIconType: type.value } })}
                className={`p-3 rounded-xl border text-center transition-all ${campaign.style?.ratingIconType === type.value
                    ? 'border-primary/50 bg-primary/5 shadow-sm'
                    : 'border-outline-variant/20 bg-surface-container-low hover:bg-surface-container'
                  }`}
              >
                <div className="text-lg mb-1 truncate">
                  {type.preview.slice(0, 3).join(' ')}
                </div>
                <p className="text-xs font-semibold text-on-surface">{type.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Collect Contact Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-on-surface">Collect Contact Info</p>
              <p className="text-xs text-on-surface-variant/70 mt-0.5">
                Add optional email/phone field to negative feedback forms for follow-up.
              </p>
            </div>
            <button
              onClick={() => onChange({ settings: { ...campaign.settings, collectContact: !campaign.settings.collectContact } })}
              className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${campaign.settings.collectContact ? 'bg-primary' : 'bg-outline-variant/40'
                }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${campaign.settings.collectContact ? 'left-5' : 'left-0.5'
                  }`}
              />
            </button>
          </div>
          {campaign.settings.collectContact && (
            <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">check_circle</span>
              <p className="text-xs font-medium text-on-surface-variant">
                Customers will see an optional "Email or phone (for follow-up)" field.
              </p>
            </div>
          )}
        </div>

        {/* Incentive / Coupon */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-on-surface">Reward Incentive</p>
              <p className="text-xs text-on-surface-variant/70 mt-0.5">
                Show a coupon code to customers after they submit positive feedback.
              </p>
            </div>
            <button
              onClick={() => onChange({ settings: { ...campaign.settings, incentiveEnabled: !campaign.settings.incentiveEnabled } })}
              className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${campaign.settings.incentiveEnabled ? 'bg-primary' : 'bg-outline-variant/40'
                }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-200 ${campaign.settings.incentiveEnabled ? 'left-5' : 'left-0.5'
                  }`}
              />
            </button>
          </div>
          {campaign.settings.incentiveEnabled && (
            <div className="space-y-2">
              <input
                className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 text-sm font-mono font-bold uppercase tracking-wider transition-all outline-none text-on-surface placeholder:text-outline/50 placeholder:normal-case placeholder:tracking-normal placeholder:font-normal"
                placeholder="e.g. THANKS10"
                type="text"
                value={campaign.settings.incentiveCoupon}
                onChange={(e) => onChange({ settings: { ...campaign.settings, incentiveCoupon: e.target.value.toUpperCase() } })}
              />
              <p className="text-[11px] text-on-surface-variant/60 italic">
                Shown on the "Thank You" screen for customers who left 4+ star ratings.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
