import { CampaignConfig, DEFAULT_CAMPAIGN } from "./types";

/**
 * Maps the UI state (CampaignConfig) to the nested DTO structure expected by the Backend API.
 */
export const mapConfigToDto = (config: CampaignConfig) => {
  return {
    businessName: config.businessName,
    googleReviewUrl: config.googleReviewUrl,
    logoUrl: config.logoUrl,
    status: config.status,
    isActive: config.isActive,
    style: {
      primaryColor: config.style.primaryColor,
      fontFamily: config.style.fontFamily,
      logoStyle: config.style.logoStyle,
      ratingIconType: config.style.ratingIconType,
      backgroundStyle: config.style.backgroundStyle,
      backgroundImage: config.style.backgroundImage,
      backgroundGradient: config.style.backgroundGradient,
      customGradientStart: config.style.customGradientStart,
      customGradientEnd: config.style.customGradientEnd,
      customGradientDirection: config.style.customGradientDirection,
      qrDotColor: config.style.qrDotColor,
      qrFrame: config.style.qrFrame
    },
    settings: {
      routingThreshold: config.settings.routingThreshold,
      heading: config.settings.heading,
      ctaLabel: config.settings.ctaLabel,
      thankYouMessage: config.settings.thankYouMessage,
      collectContact: config.settings.collectContact,
      incentiveEnabled: config.settings.incentiveEnabled,
      incentiveCoupon: config.settings.incentiveCoupon
    },
    standeeConfig: config.standeeConfig
  };
};

/**
 * Maps the nested DTO from the Backend API back to the UI state (CampaignConfig).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapDtoToConfig = (dto: any): CampaignConfig => {
  return {
    ...DEFAULT_CAMPAIGN,
    businessName: dto.businessName || '',
    googleReviewUrl: dto.googleReviewUrl || '',
    logoUrl: dto.logoUrl,
    status: dto.status ?? 0,
    isActive: dto.isActive ?? true,
    style: {
      ...DEFAULT_CAMPAIGN.style,
      primaryColor: dto.style?.primaryColor ?? DEFAULT_CAMPAIGN.style.primaryColor,
      fontFamily: dto.style?.fontFamily ?? DEFAULT_CAMPAIGN.style.fontFamily,
      logoStyle: dto.style?.logoStyle ?? DEFAULT_CAMPAIGN.style.logoStyle,
      ratingIconType: dto.style?.ratingIconType ?? DEFAULT_CAMPAIGN.style.ratingIconType,
      backgroundStyle: dto.style?.backgroundStyle ?? DEFAULT_CAMPAIGN.style.backgroundStyle,
      backgroundImage: dto.style?.backgroundImage,
      backgroundGradient: dto.style?.backgroundGradient ?? DEFAULT_CAMPAIGN.style.backgroundGradient,
      customGradientStart: dto.style?.customGradientStart ?? DEFAULT_CAMPAIGN.style.customGradientStart,
      customGradientEnd: dto.style?.customGradientEnd ?? DEFAULT_CAMPAIGN.style.customGradientEnd,
      customGradientDirection: dto.style?.customGradientDirection ?? DEFAULT_CAMPAIGN.style.customGradientDirection,
      qrDotColor: dto.style?.qrDotColor ?? DEFAULT_CAMPAIGN.style.qrDotColor,
      qrFrame: dto.style?.qrFrame ?? DEFAULT_CAMPAIGN.style.qrFrame,
    },
    settings: {
      ...DEFAULT_CAMPAIGN.settings,
      routingThreshold: dto.settings?.routingThreshold ?? DEFAULT_CAMPAIGN.settings.routingThreshold,
      heading: dto.settings?.heading ?? DEFAULT_CAMPAIGN.settings.heading,
      ctaLabel: dto.settings?.ctaLabel ?? DEFAULT_CAMPAIGN.settings.ctaLabel,
      thankYouMessage: dto.settings?.thankYouMessage ?? DEFAULT_CAMPAIGN.settings.thankYouMessage,
      collectContact: dto.settings?.collectContact ?? DEFAULT_CAMPAIGN.settings.collectContact,
      incentiveEnabled: dto.settings?.incentiveEnabled ?? DEFAULT_CAMPAIGN.settings.incentiveEnabled,
      incentiveCoupon: dto.settings?.incentiveCoupon ?? DEFAULT_CAMPAIGN.settings.incentiveCoupon,
    },
    stats: {
      totalScans: dto.stats?.totalScans ?? 0,
      positiveScans: dto.stats?.positiveScans ?? 0,
      negativeScans: dto.stats?.negativeScans ?? 0,
    },
    standeeConfig: dto.standeeConfig ?? DEFAULT_CAMPAIGN.standeeConfig
  };
};
