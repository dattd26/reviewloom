"use client";

import Link from 'next/link';
import { UserButton, useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface-container-lowest border-r border-outline-variant/10 flex flex-col fixed h-screen z-50">
      <div className="p-8">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-on-primary">weaving</span>
          </div>
          <h1 className="text-xl font-headline font-black text-on-surface tracking-tighter">ReviewLoom</h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        <Link href="/dashboard" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${pathname === '/dashboard' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="font-headline font-bold text-sm">Overview</span>
        </Link>
        <Link href="/dashboard/campaigns" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${pathname.startsWith('/dashboard/campaigns') ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
          <span className="material-symbols-outlined">qr_code_2</span>
          <span className="font-headline font-bold text-sm">QR Campaigns</span>
        </Link>
        <Link href="/dashboard/inbox" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${pathname === '/dashboard/inbox' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
          <span className="material-symbols-outlined">inbox</span>
          <span className="font-headline font-bold text-sm">Feedback Inbox</span>
        </Link>
        <div className="pt-8 pb-2 px-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-outline opacity-50">Administration</p>
        </div>
        <Link href="/dashboard/settings" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${pathname === '/dashboard/settings' ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-low'}`}>
          <span className="material-symbols-outlined">settings</span>
          <span className="font-headline font-bold text-sm">Business Settings</span>
        </Link>
      </nav>

      <div className="p-6 mt-auto border-t border-outline-variant/10">
        <div className="flex items-center gap-4 px-2">
          <UserButton />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-on-surface truncate max-w-[120px]">{user?.fullName}</span>
            <span className="text-[10px] font-medium text-outline">Starter Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
