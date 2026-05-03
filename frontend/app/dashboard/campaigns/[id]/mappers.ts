import { CampaignConfig } from "./types";

/**
 * Maps the flat UI state (CampaignConfig) to the nested DTO structure expected by the Backend API.
 */
export const mapConfigToDto = (config: CampaignConfig) => {
  return {
    businessName: config.name,
    googleReviewUrl: config.googleReviewUrl,
    logoUrl: config.logo,
    style: {
      primaryColor: config.primaryColor,
      fontFamily: config.fontFamily,
      logoStyle: config.logoStyle,
      ratingIconType: config.ratingIconType,
      backgroundStyle: config.backgroundStyle,
      backgroundImage: config.backgroundImage,
      backgroundGradient: config.backgroundGradient,
      qrDotColor: config.qrDotColor,
      qrFrame: config.qrFrame
    },
    settings: {
      routingThreshold: config.routingThreshold,
      heading: config.heading,
      ctaLabel: config.ctaLabel,
      thankYouMessage: config.thankYouMessage,
      collectContact: config.collectContact,
      incentiveEnabled: config.incentiveEnabled,
      incentiveCoupon: config.incentiveCoupon
    }
  };
};

/**
 * Maps the nested DTO from the Backend API back to the flat UI state (CampaignConfig).
 */
export const mapDtoToConfig = (dto: any): CampaignConfig => {
  return {
    name: dto.businessName || '',
    googleReviewUrl: dto.googleReviewUrl || '',
    logo: dto.logoUrl,
    routingThreshold: dto.settings?.routingThreshold ?? 4,
    logoStyle: (dto.style?.logoStyle as any) ?? 'soft',
    primaryColor: dto.style?.primaryColor ?? '#0037b0',
    fontFamily: (dto.style?.fontFamily as any) ?? 'Manrope',
    backgroundStyle: (dto.style?.backgroundStyle as any) ?? 'none',
    backgroundImage: dto.style?.backgroundImage,
    backgroundGradient: dto.style?.backgroundGradient ?? '',
    customGradientStart: '#e0f2fe',
    customGradientEnd: '#ffffff',
    customGradientDirection: '180deg',
    heading: dto.settings?.heading ?? 'How was your experience?',
    thankYouMessage: dto.settings?.thankYouMessage ?? 'Thank you for your feedback! See you next time.',
    ctaLabel: dto.settings?.ctaLabel ?? 'Submit Feedback',
    qrDotColor: dto.style?.qrDotColor ?? '#000000',
    qrFrame: (dto.style?.qrFrame as any) ?? 'none',
    collectContact: dto.settings?.collectContact ?? false,
    incentiveEnabled: dto.settings?.incentiveEnabled ?? false,
    incentiveCoupon: dto.settings?.incentiveCoupon ?? '',
    ratingIconType: (dto.style?.ratingIconType as any) ?? 'stars',
    standeeConfig: dto.standeeConfig
  };
};
