import Link from 'next/link';

export function QuickActionsHub() {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/10 animate-slide-up">
      <h3 className="font-headline font-bold text-base text-on-surface mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-2">
        <Link href="/dashboard/campaigns/new" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-primary/5 hover:text-primary transition-colors border border-transparent hover:border-primary/10 group">
          <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-primary">add_box</span>
          </div>
          <div>
            <p className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">Create QR Campaign</p>
            <p className="text-[10px] font-medium text-outline">Set up a new table sign</p>
          </div>
        </Link>
        <Link href="/dashboard/inbox" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/20 group">
          <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-outline-variant/20">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-on-surface">mail</span>
          </div>
          <div>
            <p className="font-bold text-sm text-on-surface">View Private Inbox</p>
            <p className="text-[10px] font-medium text-outline">Respond to unhappy customers</p>
          </div>
        </Link>
        <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container-low transition-colors border border-transparent hover:border-outline-variant/20 group">
          <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center group-hover:bg-white transition-colors border border-transparent group-hover:border-outline-variant/20">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant group-hover:text-on-surface">settings</span>
          </div>
          <div>
            <p className="font-bold text-sm text-on-surface">Account Settings</p>
            <p className="text-[10px] font-medium text-outline">Manage subscription & profile</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
