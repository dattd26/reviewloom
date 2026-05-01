"use client"

import { ReactNode } from 'react';
import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isSignedIn, user, isLoaded } = useUser()
  // Handle loading state
  if (!isLoaded) return <div>Loading...</div>

  // Protect the page from unauthenticated users
  if (!isSignedIn) return <div>Sign in to view this page</div>

  const businessName = user?.publicMetadata?.businessName as string || 'Aurelius Fine Dining';

  return (
    <div className="text-on-surface antialiased overflow-x-hidden min-h-screen bg-surface flex">
      {/* SideNavBar Shell */}
      <aside className="fixed h-screen w-64 left-0 top-0 bg-slate-50 dark:bg-slate-950 flex flex-col p-6 gap-y-4 z-50 border-r border-outline-variant/20">
        <div className="mb-8">
          <Link href="/dashboard" className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-tighter hover:opacity-80 transition-opacity">
            ReviewLoom
          </Link>
          <p className="font-display font-bold text-sm tracking-tight text-slate-500 uppercase mt-1">Management Suite</p>
        </div>

        <nav className="flex flex-col gap-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 p-3 text-primary font-bold bg-white dark:bg-slate-900 shadow-sm rounded-lg transition-transform hover:scale-[0.98] active:scale-95"
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-display font-bold text-sm tracking-tight">Overview</span>
          </Link>
          <Link
            href="/dashboard/campaigns"
            className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">campaign</span>
            <span className="font-display font-bold text-sm tracking-tight">Campaigns</span>
          </Link>
          <Link
            href="/dashboard/inbox"
            className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">inbox</span>
            <span className="font-display font-bold text-sm tracking-tight">Inbox</span>
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 p-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-display font-bold text-sm tracking-tight">Settings</span>
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-outline-variant/20">
          <div className="p-4 bg-surface-container-low rounded-xl">
            <p className="font-label text-[10px] font-semibold text-outline uppercase tracking-widest mb-2">Logged in as</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-full h-full' } }} />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate text-on-surface">{businessName}</p>
                <p className="text-[10px] text-outline truncate">{user?.primaryEmailAddress?.emailAddress || 'Loading...'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <main className="ml-64 flex-1 min-h-screen flex flex-col relative">
        {children}

        {/* Contextual FAB (Global to Dashboard) */}
        <Link
          href="/dashboard/campaigns/new"
          className="fixed bottom-8 right-8 bg-gradient-to-br from-primary to-primary-container text-on-primary p-4 rounded-xl shadow-2xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 group z-50"
        >
          <span className="material-symbols-outlined">add_box</span>
          <span className="font-headline font-bold text-sm">Generate QR Code</span>
        </Link>
      </main>
    </div>
  );
}
