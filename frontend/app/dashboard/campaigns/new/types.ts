export type RatingIconType = 'stars' | 'emoji' | 'thumbs';
export type QrFrameType = 'none' | 'scan_to_rate' | 'review_discount';
export type FontOption = 'Manrope' | 'Playfair Display' | 'Lora' | 'Dancing Script' | 'Poppins' | 'Roboto Slab';

export interface CampaignConfig {
  // Basic
  name: string;
  googleReviewUrl: string;
  logo: string | null;
  routingThreshold: 4 | 5;

  // Visual Branding
  primaryColor: string;
  fontFamily: FontOption;
  backgroundImage: string | null;

  // Content
  heading: string;
  thankYouMessage: string;
  ctaLabel: string;

  // QR Styling
  qrDotColor: string;
  qrFrame: QrFrameType;

  // Advanced
  collectContact: boolean;
  incentiveEnabled: boolean;
  incentiveCoupon: string;
  ratingIconType: RatingIconType;
}

export const DEFAULT_CAMPAIGN: CampaignConfig = {
  name: '',
  googleReviewUrl: '',
  logo: null,
  routingThreshold: 4,
  primaryColor: '#0037b0',
  fontFamily: 'Manrope',
  backgroundImage: null,
  heading: 'How was your experience?',
  thankYouMessage: 'Thank you for your feedback! See you next time.',
  ctaLabel: 'Submit Feedback',
  qrDotColor: '#000000',
  qrFrame: 'none',
  collectContact: false,
  incentiveEnabled: false,
  incentiveCoupon: '',
  ratingIconType: 'stars',
};

export const FONT_OPTIONS: { value: FontOption; label: string; category: string }[] = [
  { value: 'Manrope', label: 'Manrope', category: 'Sans Serif' },
  { value: 'Poppins', label: 'Poppins', category: 'Sans Serif' },
  { value: 'Lora', label: 'Lora', category: 'Serif' },
  { value: 'Roboto Slab', label: 'Roboto Slab', category: 'Serif' },
  { value: 'Playfair Display', label: 'Playfair Display', category: 'Serif' },
  { value: 'Dancing Script', label: 'Dancing Script', category: 'Handwriting' },
];

export const QR_FRAMES: { value: QrFrameType; label: string }[] = [
  { value: 'none', label: 'No Frame' },
  { value: 'scan_to_rate', label: '"Scan to Rate Us"' },
  { value: 'review_discount', label: '"Review & Get 10% Off"' },
];
