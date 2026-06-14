export type StandeeTemplateId = string;

export interface StandeeTemplateSchema {
  layout: string;
  editableFields: string[];
}

export interface StandeeTemplate {
  id: string;
  name: string;
  category: string;
  isPremium: boolean;
  thumbnailUrl: string;
  schema: StandeeTemplateSchema;
}

export interface StandeeUserConfig {
  templateId: StandeeTemplateId;
  ctaText: string;
  showLogo: boolean;
}

export type RatingIconType = 'stars' | 'emoji' | 'thumbs';
export type QrFrameType = 'none' | 'scan_to_rate' | 'review_discount';
export type FontOption = 'Manrope' | 'Playfair Display' | 'Lora' | 'Dancing Script' | 'Poppins' | 'Roboto Slab';
export type BackgroundStyle = 'none' | 'image' | 'gradient';

export type CampaignStatus = 0 | 1 | 2; // Draft, Published, Archived

export interface CampaignSettings {
  routingThreshold: 4 | 5;
  heading: string;
  ctaLabel: string;
  thankYouMessage: string;
  collectContact: boolean;
  incentiveEnabled: boolean;
  incentiveCoupon: string;
}

export interface CampaignStyle {
  primaryColor: string;
  fontFamily: FontOption;
  logoStyle: 'circle' | 'square' | 'soft' | 'none';
  ratingIconType: RatingIconType;
  backgroundStyle: BackgroundStyle;
  backgroundImage?: string | null;
  backgroundGradient?: string;
  customGradientStart?: string;
  customGradientEnd?: string;
  customGradientDirection?: string; // e.g., '135deg'
  qrDotColor?: string;
  qrFrame?: QrFrameType;
}

export interface CampaignConfig {
  // Basic
  slug?: string;
  businessName: string;
  googleReviewUrl: string;
  placement: string;
  status: CampaignStatus;
  isActive: boolean;
  // Visual Branding
  logoUrl: string | null;
  style: CampaignStyle;
  settings: CampaignSettings;
  showWatermark: boolean;

  // Stats
  stats: {
    totalScans: number;
    positiveScans: number;
    negativeScans: number;
  };

  // Standee Designer
  standeeConfig: StandeeUserConfig;
}

export const DEFAULT_STANDEE_CONFIG: StandeeUserConfig = {
  templateId: 'minimal_white',
  ctaText: 'Review Us on Google',
  showLogo: true,
};

export const DEFAULT_CAMPAIGN: CampaignConfig = {
  slug: '',
  businessName: '',
  googleReviewUrl: '',
  placement: '',
  status: 0, // Draft
  logoUrl: null,
  isActive: true,
  showWatermark: true,
  style: {
    logoStyle: 'soft',
    ratingIconType: 'stars',
    primaryColor: '#0037b0',
    fontFamily: 'Manrope',
    backgroundStyle: 'none',
    backgroundImage: null,
    backgroundGradient: '',
    customGradientStart: '#e0f2fe',
    customGradientEnd: '#ffffff',
    customGradientDirection: '180deg',
    qrDotColor: '#000000',
    qrFrame: 'none',
  },
  settings: {
    routingThreshold: 4,
    heading: 'How was your experience?',
    thankYouMessage: 'Thank you for your feedback! See you next time.',
    ctaLabel: 'Submit Feedback',
    collectContact: false,
    incentiveEnabled: false,
    incentiveCoupon: '',
  },
  standeeConfig: { ...DEFAULT_STANDEE_CONFIG },
  stats: {
    totalScans: 0,
    positiveScans: 0,
    negativeScans: 0,
  },
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
