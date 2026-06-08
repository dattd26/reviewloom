'use client'

import { useUser, useAuth } from '@clerk/nextjs';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { DashboardDateRange, DashboardOverviewResponse, DashboardService } from '@/services/dashboard-service';
import { DashboardTopBar } from '@/components/dashboard/DashboardTopBar';
import { ReviewGrowthChart } from '@/components/dashboard/ReviewGrowthChart';
import { DashboardSidebarMetrics } from '@/components/dashboard/DashboardSidebarMetrics';
import { QuickActionsHub } from '@/components/dashboard/QuickActionsHub';
import { StrategicAdvice } from '@/components/dashboard/StrategicAdvice';
import { LiveActivityFeed } from '@/components/dashboard/LiveActivityFeed';

import { DashboardLoading } from '@/components/dashboard/DashboardLoading';

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDefaultDateRange(): DashboardDateRange {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - 29);

  return {
    fromDate: formatDateInput(fromDate),
    toDate: formatDateInput(toDate),
  };
}

export default function DashboardOverview() {
  const { isSignedIn, user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [data, setData] = useState<DashboardOverviewResponse | null>(null);
  const [dateRange, setDateRange] = useState<DashboardDateRange>(() => getDefaultDateRange());
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        if (!token) return;
        const response = await DashboardService.getOverview(token, dateRange);
        setData(response);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isSignedIn) {
      loadDashboardData();
    }
  }, [dateRange, getToken, isSignedIn]);

  useGSAP(() => {
    if (!isLoaded || isLoading) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        reduceMotion: '(prefers-reduced-motion: reduce)',
        noPreference: '(prefers-reduced-motion: no-preference)',
      },
      (context) => {
        const reduceMotion = context.conditions?.reduceMotion;
        if (reduceMotion) {
          gsap.set('.animate-fade-in, .animate-slide-up', {
            opacity: 1,
            y: 0,
            scale: 1,
            visibility: 'visible',
          });
          return;
        }

        const tl = gsap.timeline({ defaults: { duration: 0.65, ease: 'power3.out' } });
        tl.fromTo('.animate-fade-in', { opacity: 0, y: -12 }, { opacity: 1, y: 0, stagger: 0.06 })
          .fromTo('.animate-slide-up', { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08 }, '-=0.35');
      }
    );

    return () => mm.revert();
  }, [isLoaded, isLoading, data]);

  if (!isLoaded || isLoading) return <DashboardLoading />;
  if (!isSignedIn) return <div>Sign in to view this page</div>;

  const scansGrowth = data?.scansGrowth ?? [];

  return (
    <div ref={containerRef} className="flex-1 flex flex-col min-h-screen">
      <DashboardTopBar firstName={user?.firstName} dateRange={dateRange} onDateRangeChange={setDateRange} />

      <div className="p-8 max-w-[1600px] mx-auto w-full flex-1">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Main Left Column (Command Center) */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            <ReviewGrowthChart scansGrowth={scansGrowth} />
            <LiveActivityFeed activities={data?.recentActivity ?? []} />
          </div>

          {/* Right Sidebar Column (Insights & Actions) */}
          <div className="xl:col-span-4 flex flex-col gap-8">
            <DashboardSidebarMetrics
              totalScans={data?.totalScans ?? 0}
              positivePercentage={data?.positivePercentage ?? 0}
              newPrivateFeedback={data?.newPrivateFeedback ?? 0}
            />
            <QuickActionsHub />
            <StrategicAdvice />
          </div>
          
        </div>
      </div>
    </div>
  );
}
