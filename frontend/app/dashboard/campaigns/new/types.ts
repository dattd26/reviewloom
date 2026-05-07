export type RatingIconType = 'stars' | 'emoji' | 'thumbs';
export type QrFrameType = 'none' | 'scan_to_rate' | 'review_discount';
export type FontOption = 'Manrope' | 'Playfair Display' | 'Lora' | 'Dancing Script' | 'Poppins' | 'Roboto Slab';
export type BackgroundStyle = 'none' | 'image' | 'gradient';

export interface CampaignConfig {
  // Basic
  name: string;
  googleReviewUrl: string;
  routingThreshold: 4 | 5;

  // Visual Branding
  logo: string | null;
  logoStyle: 'circle' | 'square' | 'soft' | 'none';
  primaryColor: string;
  fontFamily: FontOption;
  backgroundStyle: BackgroundStyle;
  backgroundImage: string | null;
  backgroundGradient: string;
  customGradientStart: string;
  customGradientEnd: string;
  customGradientDirection: string; // e.g., '135deg'

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
  routingThreshold: 4,
  logo: null,
  logoStyle: 'soft',
  primaryColor: '#0037b0',
  fontFamily: 'Manrope',
  backgroundStyle: 'none',
  backgroundImage: null,
  backgroundGradient: '',
  customGradientStart: '#e0f2fe',
  customGradientEnd: '#ffffff',
  customGradientDirection: '180deg',
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

export interface GradientPreset {
  id: string;
  label: string;
  css: string;         // full CSS background value (radial-gradient(...))
  previewCss: string;  // same value, used for the swatch thumbnail
  isDark: boolean;     // determines if text should be white or dark
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: 'nordic_frost',
    label: 'Nordic Frost',
    css: 'radial-gradient(ellipse 85% 65% at 50% 0%, rgba(186,230,253,0.70) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 90%, rgba(165,243,252,0.40) 0%, transparent 65%), linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 60%, #ffffff 100%)',
    previewCss: 'radial-gradient(ellipse 85% 65% at 50% 0%, rgba(186,230,253,0.70) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 90%, rgba(165,243,252,0.40) 0%, transparent 65%), linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 60%, #ffffff 100%)',
    isDark: false,
  },
  {
    id: 'silk_lavender',
    label: 'Silk Lavender',
    css: 'radial-gradient(circle at 100% 0%, rgba(245,208,254,0.6) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(224,231,255,0.6) 0%, transparent 50%), linear-gradient(180deg, #fdfaff 0%, #ffffff 100%)',
    previewCss: 'radial-gradient(circle at 100% 0%, rgba(245,208,254,0.6) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(224,231,255,0.6) 0%, transparent 50%), linear-gradient(180deg, #fdfaff 0%, #ffffff 100%)',
    isDark: false,
  },
  {
    id: 'peach_bloom',
    label: 'Peach Bloom',
    css: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,237,213,0.8) 0%, transparent 100%), linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)',
    previewCss: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(255,237,213,0.8) 0%, transparent 100%), linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)',
    isDark: false,
  },
  {
    id: 'mint_dew',
    label: 'Mint Dew',
    css: 'radial-gradient(circle at 0% 0%, rgba(204,251,241,0.8) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(240,253,244,0.5) 0%, transparent 60%), linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)',
    previewCss: 'radial-gradient(circle at 0% 0%, rgba(204,251,241,0.8) 0%, transparent 60%), radial-gradient(circle at 100% 100%, rgba(240,253,244,0.5) 0%, transparent 60%), linear-gradient(180deg, #f0fdfa 0%, #ffffff 100%)',
    isDark: false,
  },
  {
    id: 'morning_mist',
    label: 'Morning Mist',
    css: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(241,245,249,0.9) 0%, transparent 100%), linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
    previewCss: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(241,245,249,0.9) 0%, transparent 100%), linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
    isDark: false,
  },
  {
    id: 'sunset_glow',
    label: 'Sunset Glow',
    css: 'radial-gradient(circle at 50% 0%, rgba(254,249,195,0.6) 0%, transparent 70%), radial-gradient(circle at 0% 100%, rgba(255,228,230,0.4) 0%, transparent 70%), linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
    previewCss: 'radial-gradient(circle at 50% 0%, rgba(254,249,195,0.6) 0%, transparent 70%), radial-gradient(circle at 0% 100%, rgba(255,228,230,0.4) 0%, transparent 70%), linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)',
    isDark: false,
  },
];
