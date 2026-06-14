'use client';

import { CampaignConfig, StandeeTemplateId, StandeeUserConfig } from '@/types/campaign';

// ─── Template Style Definitions ──────────────────────────────────────────────

export interface StandeeTemplateStyle {
  id: StandeeTemplateId;
  label: string;
  tagline: string;
  bgColor: string;
  bgGradient?: string;
  textPrimary: string;
  textMuted: string;
  /** null = inherit campaign.primaryColor */
  accentColor: string | null;
  surfaceColor: string;
  surfaceBorder: string;
  isDark: boolean;
  ornamentType:
    | 'minimal'
    | 'prestige'
    | 'blush'
    | 'kraft'
    | 'rest-modern'
    | 'rest-elegant'
    | 'rest-casual'
    | 'coffee-minimal'
    | 'coffee-cozy'
    | 'coffee-premium'
    | 'salon-minimal'
    | 'salon-luxury'
    | 'salon-barber'
    | 'serv-hvac'
    | 'serv-roofing'
    | 'serv-plumbing';
}

export const STANDEE_TEMPLATES_MAP: Record<string, StandeeTemplateStyle> = {
  // Legacy / General templates
  minimal_white: {
    id: 'minimal_white',
    label: 'Minimal White',
    tagline: 'Clean & universal',
    bgColor: '#ffffff',
    textPrimary: '#0f172a',
    textMuted: '#64748b',
    accentColor: null,
    surfaceColor: '#f8fafc',
    surfaceBorder: '#e2e8f0',
    isDark: false,
    ornamentType: 'minimal',
  },
  prestige_dark: {
    id: 'prestige_dark',
    label: 'Prestige Dark',
    tagline: 'Dark & sophisticated',
    bgColor: '#0c1a2e',
    bgGradient: 'linear-gradient(160deg, #0c1a2e 0%, #1a2d45 50%, #0c1a2e 100%)',
    textPrimary: '#f8fafc',
    textMuted: '#94a3b8',
    accentColor: '#c9a227',
    surfaceColor: 'rgba(255,255,255,0.06)',
    surfaceBorder: 'rgba(201,162,39,0.3)',
    isDark: true,
    ornamentType: 'prestige',
  },
  salon_blush: {
    id: 'salon_blush',
    label: 'Salon Blush',
    tagline: 'Warm & inviting',
    bgColor: '#fff0f3',
    bgGradient: 'radial-gradient(ellipse 130% 55% at 50% 0%, #ffe4e6 0%, #fff0f3 65%)',
    textPrimary: '#881337',
    textMuted: '#be185d',
    accentColor: '#f43f5e',
    surfaceColor: 'rgba(255,255,255,0.9)',
    surfaceBorder: '#fecdd3',
    isDark: false,
    ornamentType: 'blush',
  },
  cafe_kraft: {
    id: 'cafe_kraft',
    label: 'Cafe Kraft',
    tagline: 'Cozy & artisanal',
    bgColor: '#fef9ec',
    bgGradient: 'radial-gradient(ellipse 130% 55% at 80% 10%, #fef3c7 0%, #fef9ec 60%)',
    textPrimary: '#78350f',
    textMuted: '#92400e',
    accentColor: '#d97706',
    surfaceColor: 'rgba(255,255,255,0.85)',
    surfaceBorder: '#fcd34d',
    isDark: false,
    ornamentType: 'kraft',
  },

  // Restaurant Templates
  'restaurant-modern': {
    id: 'restaurant-modern',
    label: 'Modern Table',
    tagline: 'Sleek tabletop aesthetic',
    bgColor: '#f8fafc',
    bgGradient: 'radial-gradient(circle at top left, #f1f5f9 0%, #ffffff 80%)',
    textPrimary: '#0f172a',
    textMuted: '#475569',
    accentColor: '#0f766e',
    surfaceColor: '#ffffff',
    surfaceBorder: '#e2e8f0',
    isDark: false,
    ornamentType: 'rest-modern',
  },
  'restaurant-elegant': {
    id: 'restaurant-elegant',
    label: 'Elegant Dining',
    tagline: 'Luxury fine dining theme',
    bgColor: '#1c1917',
    bgGradient: 'linear-gradient(145deg, #1c1917 0%, #0c0a09 100%)',
    textPrimary: '#f5f5f4',
    textMuted: '#a8a29e',
    accentColor: '#d97706',
    surfaceColor: 'rgba(255,255,255,0.05)',
    surfaceBorder: 'rgba(217,119,6,0.3)',
    isDark: true,
    ornamentType: 'rest-elegant',
  },
  'restaurant-casual': {
    id: 'restaurant-casual',
    label: 'Fast Casual',
    tagline: 'Vibrant diner feel',
    bgColor: '#fffbeb',
    bgGradient: 'radial-gradient(circle at top, #fef3c7 0%, #fffbeb 100%)',
    textPrimary: '#7c2d12',
    textMuted: '#c2410c',
    accentColor: '#ea580c',
    surfaceColor: '#ffffff',
    surfaceBorder: '#fed7aa',
    isDark: false,
    ornamentType: 'rest-casual',
  },

  // Coffee Shop Templates
  'coffee-minimal': {
    id: 'coffee-minimal',
    label: 'Minimal Coffee',
    tagline: 'Simple espresso tones',
    bgColor: '#fafaf9',
    textPrimary: '#292524',
    textMuted: '#78716c',
    accentColor: '#57534e',
    surfaceColor: '#ffffff',
    surfaceBorder: '#e7e5e4',
    isDark: false,
    ornamentType: 'coffee-minimal',
  },
  'coffee-cozy': {
    id: 'coffee-cozy',
    label: 'Cozy Cafe',
    tagline: 'Warm roasted warmth',
    bgColor: '#fafaf9',
    bgGradient: 'radial-gradient(circle at 10% 20%, #f5ebe0 0%, #fdfbf7 90%)',
    textPrimary: '#4e3629',
    textMuted: '#8a5a44',
    accentColor: '#b07d62',
    surfaceColor: '#ffffff',
    surfaceBorder: '#e6ccb2',
    isDark: false,
    ornamentType: 'coffee-cozy',
  },
  'coffee-premium': {
    id: 'coffee-premium',
    label: 'Premium Coffee',
    tagline: 'Rich luxury roast',
    bgColor: '#1a120b',
    bgGradient: 'linear-gradient(135deg, #1a120b 0%, #3c2a21 100%)',
    textPrimary: '#e7dec8',
    textMuted: '#d5c7b3',
    accentColor: '#bca374',
    surfaceColor: 'rgba(255,255,255,0.06)',
    surfaceBorder: 'rgba(188,163,116,0.3)',
    isDark: true,
    ornamentType: 'coffee-premium',
  },

  // Salon & Spa Templates
  'salon-minimal': {
    id: 'salon-minimal',
    label: 'Beauty Minimal',
    tagline: 'Soft lavender breeze',
    bgColor: '#faf5ff',
    bgGradient: 'radial-gradient(circle at top right, #f3e8ff 0%, #faf5ff 100%)',
    textPrimary: '#581c87',
    textMuted: '#7e22ce',
    accentColor: '#a855f7',
    surfaceColor: '#ffffff',
    surfaceBorder: '#e9d5ff',
    isDark: false,
    ornamentType: 'salon-minimal',
  },
  'salon-luxury': {
    id: 'salon-luxury',
    label: 'Luxury Spa',
    tagline: 'Glowing therapeutic theme',
    bgColor: '#0f172a',
    bgGradient: 'linear-gradient(150deg, #0f172a 0%, #020617 100%)',
    textPrimary: '#f8fafc',
    textMuted: '#94a3b8',
    accentColor: '#2dd4bf',
    surfaceColor: 'rgba(255,255,255,0.05)',
    surfaceBorder: 'rgba(45,212,191,0.3)',
    isDark: true,
    ornamentType: 'salon-luxury',
  },
  'salon-barber': {
    id: 'salon-barber',
    label: 'Modern Barber',
    tagline: 'Classic striped style',
    bgColor: '#0f172a',
    bgGradient: 'radial-gradient(circle at bottom right, #1e293b 0%, #0f172a 100%)',
    textPrimary: '#f8fafc',
    textMuted: '#cbd5e1',
    accentColor: '#ef4444',
    surfaceColor: 'rgba(255,255,255,0.08)',
    surfaceBorder: 'rgba(239,68,68,0.4)',
    isDark: true,
    ornamentType: 'salon-barber',
  },

  // Home Services Templates
  'services-hvac': {
    id: 'services-hvac',
    label: 'HVAC Trust',
    tagline: 'Reliable eco-green',
    bgColor: '#f0fdf4',
    bgGradient: 'radial-gradient(circle at top left, #dcfce7 0%, #f0fdf4 100%)',
    textPrimary: '#14532d',
    textMuted: '#15803d',
    accentColor: '#16a34a',
    surfaceColor: '#ffffff',
    surfaceBorder: '#bbf7d0',
    isDark: false,
    ornamentType: 'serv-hvac',
  },
  'services-roofing': {
    id: 'services-roofing',
    label: 'Roofing Pro',
    tagline: 'Geometric structural blue',
    bgColor: '#f8fafc',
    bgGradient: 'radial-gradient(circle at top right, #e2e8f0 0%, #f8fafc 100%)',
    textPrimary: '#1e293b',
    textMuted: '#475569',
    accentColor: '#3b82f6',
    surfaceColor: '#ffffff',
    surfaceBorder: '#cbd5e1',
    isDark: false,
    ornamentType: 'serv-roofing',
  },
  'services-plumbing': {
    id: 'services-plumbing',
    label: 'Plumbing Expert',
    tagline: 'Deep professional blue',
    bgColor: '#0c4a6e',
    bgGradient: 'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0369a1 100%)',
    textPrimary: '#f0f9ff',
    textMuted: '#e0f2fe',
    accentColor: '#38bdf8',
    surfaceColor: 'rgba(255,255,255,0.08)',
    surfaceBorder: 'rgba(56,189,248,0.4)',
    isDark: true,
    ornamentType: 'serv-plumbing',
  },
};

// Array export for client catalog fallback
export const STANDEE_TEMPLATES: StandeeTemplateStyle[] = Object.values(STANDEE_TEMPLATES_MAP);

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  campaign: CampaignConfig;
  userConfig: StandeeUserConfig;
  qrCodeDataUrl: string | null;
  /**
   * Rendered width in px. Height is derived at 2:3 ratio (4×6 inch standard).
   * Full-res export target: 1200px wide (= 4 in × 300 DPI).
   */
  width?: number;
}

export default function StandeeTemplate({ campaign, userConfig, qrCodeDataUrl, width = 1200 }: Props) {
  const tpl = STANDEE_TEMPLATES_MAP[userConfig.templateId] ?? STANDEE_TEMPLATES_MAP.minimal_white;
  const accent = tpl.accentColor ?? campaign.style.primaryColor;
  const H = Math.round(width * 1.5); // 2:3 ratio → 4×6 inch
  const s = width / 1200; // scale factor for all absolute sizes

  const px = (n: number) => `${Math.round(n * s)}px`;

  return (
    <div
      style={{
        width,
        height: H,
        position: 'relative',
        overflow: 'hidden',
        background: tpl.bgGradient ?? tpl.bgColor,
        fontFamily: `'${campaign.style.fontFamily}', 'Manrope', 'Inter', sans-serif`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* ── Decoration Ornaments layer ── */}

      {/* Minimal & Coffee-Minimal: solid accent bars top + bottom */}
      {(tpl.ornamentType === 'minimal' || tpl.ornamentType === 'coffee-minimal') && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: px(12), background: accent }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: px(12), background: accent }} />
        </>
      )}

      {/* Prestige & Coffee-Premium: corner bracket ornaments */}
      {(tpl.ornamentType === 'prestige' || tpl.ornamentType === 'coffee-premium') &&
        (['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((pos) => {
          const isTop = pos.startsWith('top');
          const isLeft = pos.endsWith('left');
          return (
            <div
              key={pos}
              style={{
                position: 'absolute',
                top: isTop ? px(56) : undefined,
                bottom: !isTop ? px(56) : undefined,
                left: isLeft ? px(56) : undefined,
                right: !isLeft ? px(56) : undefined,
                width: px(72),
                height: px(72),
                borderTop: isTop ? `${px(3)} solid ${accent}` : undefined,
                borderBottom: !isTop ? `${px(3)} solid ${accent}` : undefined,
                borderLeft: isLeft ? `${px(3)} solid ${accent}` : undefined,
                borderRight: !isLeft ? `${px(3)} solid ${accent}` : undefined,
              }}
            />
          );
        })}

      {/* Blush & Salon-Minimal: soft overlapping circles */}
      {(tpl.ornamentType === 'blush' || tpl.ornamentType === 'salon-minimal') && (
        <>
          <div style={{ position: 'absolute', top: px(-80), right: px(-80), width: px(360), height: px(360), borderRadius: '50%', background: `${accent}12` }} />
          <div style={{ position: 'absolute', bottom: px(60), left: px(-60), width: px(240), height: px(240), borderRadius: '50%', background: `${accent}10` }} />
          <div style={{ position: 'absolute', top: px(200), left: px(-40), width: px(120), height: px(120), borderRadius: '50%', background: `${accent}08` }} />
        </>
      )}

      {/* Kraft & Coffee-Cozy: organic soft blobs */}
      {(tpl.ornamentType === 'kraft' || tpl.ornamentType === 'coffee-cozy') && (
        <>
          <div style={{ position: 'absolute', top: px(-50), right: px(80), width: px(280), height: px(280), borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%', background: `${accent}15` }} />
          <div style={{ position: 'absolute', bottom: px(100), left: px(30), width: px(200), height: px(200), borderRadius: '40% 60% 30% 70% / 60% 40% 50% 40%', background: `${accent}10` }} />
        </>
      )}

      {/* Restaurant Modern: sleek minimalist circles in top right / bottom left */}
      {tpl.ornamentType === 'rest-modern' && (
        <>
          <div style={{ position: 'absolute', top: px(-100), right: px(-100), width: px(320), height: px(320), borderRadius: '50%', border: `${px(2)} solid ${accent}25` }} />
          <div style={{ position: 'absolute', bottom: px(-50), left: px(-50), width: px(200), height: px(200), borderRadius: '50%', border: `${px(2)} solid ${accent}15` }} />
        </>
      )}

      {/* Restaurant Elegant: luxurious double gold border frame */}
      {tpl.ornamentType === 'rest-elegant' && (
        <div
          style={{
            position: 'absolute',
            inset: px(28),
            border: `${px(1.5)} solid ${accent}60`,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: px(6),
              border: `${px(3)} solid ${accent}`,
              pointerEvents: 'none',
            }}
          />
        </div>
      )}

      {/* Restaurant Casual: dots along the sides */}
      {tpl.ornamentType === 'rest-casual' && (
        <>
          <div style={{ position: 'absolute', top: px(20), left: px(20), right: px(20), height: px(4), backgroundImage: `radial-gradient(${accent} 50%, transparent 50%)`, backgroundSize: `${px(12)} ${px(4)}` }} />
          <div style={{ position: 'absolute', bottom: px(20), left: px(20), right: px(20), height: px(4), backgroundImage: `radial-gradient(${accent} 50%, transparent 50%)`, backgroundSize: `${px(12)} ${px(4)}` }} />
        </>
      )}

      {/* Salon Luxury: neon side glowing tubes */}
      {tpl.ornamentType === 'salon-luxury' && (
        <>
          <div style={{ position: 'absolute', top: px(40), bottom: px(40), left: px(20), width: px(4), background: accent, borderRadius: px(99), boxShadow: `0 0 ${px(16)} ${accent}` }} />
          <div style={{ position: 'absolute', top: px(40), bottom: px(40), right: px(20), width: px(4), background: accent, borderRadius: px(99), boxShadow: `0 0 ${px(16)} ${accent}` }} />
        </>
      )}

      {/* Salon Barber: Barber pole stripes on sides */}
      {tpl.ornamentType === 'salon-barber' && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: px(16),
              background: `repeating-linear-gradient(45deg, #ef4444, #ef4444 ${px(15)}, #ffffff ${px(15)}, #ffffff ${px(30)}, #3b82f6 ${px(30)}, #3b82f6 ${px(45)}, #ffffff ${px(45)}, #ffffff ${px(60)})`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: 0,
              width: px(16),
              background: `repeating-linear-gradient(-45deg, #ef4444, #ef4444 ${px(15)}, #ffffff ${px(15)}, #ffffff ${px(30)}, #3b82f6 ${px(30)}, #3b82f6 ${px(45)}, #ffffff ${px(45)}, #ffffff ${px(60)})`,
            }}
          />
        </>
      )}

      {/* Services HVAC: tech grid accents */}
      {tpl.ornamentType === 'serv-hvac' && (
        <>
          <div style={{ position: 'absolute', top: 0, right: 0, width: px(240), height: px(240), background: `radial-gradient(circle, ${accent}12 10%, transparent 70%)` }} />
          <div style={{ position: 'absolute', bottom: px(80), left: px(40), width: px(16), height: px(16), borderRadius: '50%', background: accent }} />
          <div style={{ position: 'absolute', bottom: px(120), left: px(50), width: px(10), height: px(10), borderRadius: '50%', background: `${accent}80` }} />
        </>
      )}

      {/* Services Roofing: sleek angular home roof polygon decoration */}
      {tpl.ornamentType === 'serv-roofing' && (
        <div
          style={{
            position: 'absolute',
            top: px(-120),
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: px(400),
            height: px(400),
            borderRight: `${px(2.5)} solid ${accent}30`,
            borderBottom: `${px(2.5)} solid ${accent}30`,
          }}
        />
      )}

      {/* Services Plumbing: ocean blue wave curves at bottom */}
      {tpl.ornamentType === 'serv-plumbing' && (
        <>
          <div
            style={{
              position: 'absolute',
              bottom: px(-20),
              left: px(-10),
              right: px(-10),
              height: px(120),
              background: `${accent}18`,
              borderRadius: '80% 80% 0 0 / 100% 100% 0 0',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: px(-10),
              right: px(-10),
              height: px(70),
              background: `${accent}25`,
              borderRadius: '70% 90% 0 0 / 80% 90% 0 0',
            }}
          />
        </>
      )}

      {/* ── Main content ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: `${px(80)} ${px(80)} ${px(80)}`,
          boxSizing: 'border-box',
        }}
      >
        {/* Logo */}
        {userConfig.showLogo && campaign.logoUrl && (
          <div style={{ marginBottom: px(28), display: 'flex', justifyContent: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={campaign.logoUrl}
              alt="Logo"
              style={{ height: px(100), maxWidth: px(360), objectFit: 'contain' }}
            />
          </div>
        )}

        {/* Business name */}
        <p
          style={{
            fontSize: px(36),
            fontWeight: 600,
            color: tpl.textMuted,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: px(20),
            textAlign: 'center',
          }}
        >
          {campaign.businessName || 'Your Business'}
        </p>

        {/* Accent divider */}
        <div style={{ width: px(80), height: px(3), background: accent, borderRadius: px(99), marginBottom: px(40) }} />

        {/* CTA Headline */}
        <h1
          style={{
            fontSize: px(tpl.ornamentType === 'prestige' || tpl.isDark ? 84 : 92),
            fontWeight: 900,
            color: tpl.textPrimary,
            lineHeight: 1.08,
            textAlign: 'center',
            letterSpacing: '-0.02em',
            marginBottom: px(48),
          }}
        >
          {userConfig.ctaText}
        </h1>

        {/* QR Code card */}
        <div
          style={{
            background: tpl.isDark ? '#ffffff' : tpl.surfaceColor,
            border: `${px(3)} solid ${tpl.isDark ? 'transparent' : tpl.surfaceBorder}`,
            borderRadius: px(40),
            padding: px(48),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: px(24),
            boxShadow: tpl.isDark
              ? `0 ${px(32)} ${px(80)} rgba(0,0,0,0.5)`
              : `0 ${px(16)} ${px(48)} rgba(0,0,0,0.06)`,
            flex: '0 0 auto',
          }}
        >
          {/* QR image with optional logo overlay */}
          <div style={{ position: 'relative', width: px(520), height: px(520) }}>
            {qrCodeDataUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCodeDataUrl} alt="QR Code" style={{ width: '100%', height: '100%', display: 'block' }} />
                {campaign.logoUrl && userConfig.showLogo && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: px(124),
                        height: px(124),
                        background: '#ffffff',
                        borderRadius: px(20),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: px(12),
                        boxShadow: `0 ${px(4)} ${px(16)} rgba(0,0,0,0.15)`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={campaign.logoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ width: '100%', height: '100%', background: '#f1f5f9', borderRadius: px(12) }} />
            )}
          </div>

          {/* Scan instruction */}
          <p
            style={{
              fontSize: px(28),
              fontWeight: 600,
              color: tpl.isDark ? 'rgba(0,0,0,0.45)' : tpl.textMuted,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            Point your camera to scan
          </p>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Footer branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: px(20), flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: px(20) }}>
            <div style={{ height: px(1), width: px(80), background: tpl.isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1' }} />
            <p
              style={{
                fontSize: px(22),
                fontWeight: 800,
                color: tpl.isDark ? 'rgba(255,255,255,0.3)' : '#94a3b8',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
              }}
            >
              ReviewLoom
            </p>
            <div style={{ height: px(1), width: px(80), background: tpl.isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1' }} />
          </div>
          {campaign.showWatermark && (
            <p
              style={{
                fontSize: px(18),
                fontWeight: 600,
                color: tpl.isDark ? 'rgba(255,255,255,0.2)' : '#94a3b8',
                marginTop: px(8),
              }}
            >
              Created with Free Plan - reviewloom.com
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
