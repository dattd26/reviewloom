"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();
  const isNewCampaignPage = pathname === '/dashboard/campaigns/new';

  // Handle loading state
  if (!isLoaded) return null;

  // Protect the page from unauthenticated users
  if (!isSignedIn) return <div>Sign in to view this page</div>

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar Navigation (Fixed Left) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="ml-64 flex-1 min-h-screen flex flex-col relative">
        {children}


        {/* Contextual FAB (Hidden on 'New' page to avoid duplication) */}
        {!isNewCampaignPage && (
          <Link
            href="/dashboard/campaigns/new"
            className="fixed bottom-8 right-8 bg-gradient-to-br from-primary to-primary-container text-on-primary p-4 rounded-xl shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group z-50"
          >
            <span className="material-symbols-outlined">add_box</span>
            <span className="font-headline font-bold text-sm">Generate QR Code</span>
          </Link>
        )}
      </main>
    </div>
  );
}
