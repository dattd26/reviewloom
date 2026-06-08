'use client';

import { CampaignConfig } from './types';

// ─── Template Definitions ───────────────────────────────────────────────────

export type StandeeTemplateId = 'minimal_white' | 'prestige_dark' | 'salon_blush' | 'cafe_kraft';

export interface StandeeTemplateConfig {
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
  isPro: boolean;
}

export const STANDEE_TEMPLATES: StandeeTemplateConfig[] = [
  {
    id: 'minimal_white',
    label: 'Minimal',
    tagline: 'Clean & universal',
    bgColor: '#ffffff',
    textPrimary: '#0f172a',
    textMuted: '#64748b',
    accentColor: null,
    surfaceColor: '#f8fafc',
    surfaceBorder: '#e2e8f0',
    isDark: false,
    isPro: false,
  },
  {
    id: 'prestige_dark',
    label: 'Prestige',
    tagline: 'Dark & sophisticated',
    bgColor: '#0c1a2e',
    bgGradient: 'linear-gradient(160deg, #0c1a2e 0%, #1a2d45 50%, #0c1a2e 100%)',
    textPrimary: '#f8fafc',
    textMuted: '#94a3b8',
    accentColor: '#c9a227',
    surfaceColor: 'rgba(255,255,255,0.06)',
    surfaceBorder: 'rgba(201,162,39,0.3)',
    isDark: true,
    isPro: true,
  },
  {
    id: 'salon_blush',
    label: 'Blush',
    tagline: 'Warm & inviting',
    bgColor: '#fff0f3',
    bgGradient: 'radial-gradient(ellipse 130% 55% at 50% 0%, #ffe4e6 0%, #fff0f3 65%)',
    textPrimary: '#881337',
    textMuted: '#be185d',
    accentColor: '#f43f5e',
    surfaceColor: 'rgba(255,255,255,0.9)',
    surfaceBorder: '#fecdd3',
    isDark: false,
    isPro: true,
  },
  {
    id: 'cafe_kraft',
    label: 'Kraft',
    tagline: 'Cozy & artisanal',
    bgColor: '#fef9ec',
    bgGradient: 'radial-gradient(ellipse 130% 55% at 80% 10%, #fef3c7 0%, #fef9ec 60%)',
    textPrimary: '#78350f',
    textMuted: '#92400e',
    accentColor: '#d97706',
    surfaceColor: 'rgba(255,255,255,0.85)',
    surfaceBorder: '#fcd34d',
    isDark: false,
    isPro: false,
  },
];

// ─── User-editable config (local to the designer, not part of CampaignConfig) ─

export interface StandeeUserConfig {
  templateId: StandeeTemplateId;
  ctaText: string;
  showLogo: boolean;
}

export const DEFAULT_STANDEE_CONFIG: StandeeUserConfig = {
  templateId: 'minimal_white',
  ctaText: 'Review Us on Google',
  showLogo: true,
};

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
  const tpl = STANDEE_TEMPLATES.find((t) => t.id === userConfig.templateId) ?? STANDEE_TEMPLATES[0];
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
      {/* ── Decoration layer ── */}

      {/* Minimal: solid accent bars top + bottom */}
      {tpl.id === 'minimal_white' && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: px(10), background: accent }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: px(10), background: accent }} />
        </>
      )}

      {/* Prestige: corner bracket ornaments */}
      {tpl.id === 'prestige_dark' &&
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

      {/* Blush: soft circles */}
      {tpl.id === 'salon_blush' && (
        <>
          <div style={{ position: 'absolute', top: px(-80), right: px(-80), width: px(360), height: px(360), borderRadius: '50%', background: `${accent}12` }} />
          <div style={{ position: 'absolute', bottom: px(60), left: px(-60), width: px(240), height: px(240), borderRadius: '50%', background: `${accent}10` }} />
          <div style={{ position: 'absolute', top: px(200), left: px(-40), width: px(120), height: px(120), borderRadius: '50%', background: `${accent}08` }} />
        </>
      )}

      {/* Kraft: organic blobs */}
      {tpl.id === 'cafe_kraft' && (
        <>
          <div style={{ position: 'absolute', top: px(-50), right: px(80), width: px(280), height: px(280), borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%', background: `${accent}15` }} />
          <div style={{ position: 'absolute', bottom: px(100), left: px(30), width: px(200), height: px(200), borderRadius: '40% 60% 30% 70% / 60% 40% 50% 40%', background: `${accent}10` }} />
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
            fontSize: px(tpl.id === 'prestige_dark' ? 88 : 96),
            fontWeight: 900,
            color: tpl.textPrimary,
            lineHeight: 1.05,
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
              color: tpl.isDark ? 'rgba(255,255,255,0.55)' : tpl.textMuted,
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
