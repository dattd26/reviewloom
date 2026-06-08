import { apiClient } from '@/lib/api-client';
import { CampaignConfig } from '@/types/campaign';
import LandingClient from '@/components/campaign/LandingClient';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    slug: string;
  };
}

// Dynamic metadata for SEO and Social Sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const campaign = await apiClient<Partial<CampaignConfig>>(`/r/${slug}`);
    return {
      title: `${campaign.businessName} - Rate Your Experience`,
      description: `Share your feedback with ${campaign.businessName} and help us improve.`,
      openGraph: {
        images: campaign.logoUrl ? [campaign.logoUrl] : [],
      },
    };
  } catch {
    return {
      title: 'ReviewLoom',
    };
  }
}

export default async function LandingPage({ params }: Props) {
  const { slug } = await params;
  let campaign: Partial<CampaignConfig> | null = null;

  try {
    // Fetch campaign data (Public endpoint)
    campaign = await apiClient<Partial<CampaignConfig>>(`/r/${slug}`, {
      cache: 'no-store' // Ensure we get fresh data (e.g. status changes)
    });
  } catch (error) {
    console.error('Landing page fetch error:', error);
  }

  if (!campaign) {
    return notFound();
  }

  return <LandingClient slug={slug} campaign={campaign} />;
}
