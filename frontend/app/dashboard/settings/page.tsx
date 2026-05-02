import Link from 'next/link';

export default function Settings() {
  return (
    <>
      {/* TopNavBar Anchor */}
      <header className="flex justify-between items-center w-full px-8 py-4 bg-white/80 backdrop-blur-xl border-b border-outline-variant/10 z-30 sticky top-0 shadow-sm">
        <div className="flex items-center space-x-8">
          <div className="text-lg font-black font-headline tracking-tighter text-primary">Settings</div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/dashboard" className="text-outline hover:text-primary transition-colors text-sm font-medium">Dashboard</Link>
            <Link href="/dashboard/campaigns" className="text-outline hover:text-primary transition-colors text-sm font-medium">Campaigns</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">notifications</span>
            <div className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-white"></div>
          </div>
          <span className="material-symbols-outlined text-outline cursor-pointer hover:text-primary transition-colors">help_outline</span>
        </div>
      </header>

      {/* Main Content Canvas */}
      <div className="p-8 md:p-10 max-w-6xl mx-auto w-full flex-1">

        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold font-headline tracking-tight mb-2 text-on-surface">Billing & Plans</h1>
          <p className="text-on-surface-variant font-medium">Manage your subscription plans, usage limits, and billing details.</p>
        </div>

        {/* Bento Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* 1. Current Plan Summary Card */}
          <div className="col-span-1 md:col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-2xl p-8 flex flex-col justify-between shadow-sm border border-outline-variant/10 overflow-hidden relative group">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block border border-primary/10">Active Subscription</span>
                  <h2 className="text-4xl font-extrabold text-on-surface font-headline">Pro Plan</h2>
                  <p className="text-outline font-medium mt-1.5">Renews on Dec 12, 2024</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="w-full sm:w-auto bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:bg-primary-container transition-colors shadow-md shadow-primary/20 active:scale-95">
                  Manage Subscription
                </button>
                <button className="w-full sm:w-auto text-primary font-bold hover:underline px-4 py-3 rounded-xl hover:bg-primary/5 transition-colors">
                  View Features
                </button>
              </div>
            </div>
            {/* Decorative Element */}
            <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-700"></div>
          </div>

          {/* 2. Usage Card */}
          <div className="col-span-1 md:col-span-6 lg:col-span-5 bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold font-headline text-on-surface">Usage Limits</h3>
                <span className="material-symbols-outlined text-outline">query_stats</span>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-bold text-on-surface-variant">QR Campaigns active</span>
                    <span className="text-lg font-black text-on-surface">5 <span className="text-sm text-outline font-medium">/ 10</span></span>
                  </div>
                  <div className="w-full bg-surface-container-high h-3 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full w-1/2 rounded-full"></div>
                  </div>
                  <p className="text-xs text-outline font-medium mt-3">You have 50% capacity remaining this month.</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-secondary/10 rounded-xl flex items-start space-x-3 mt-8 border border-secondary/20">
              <span className="material-symbols-outlined text-secondary text-sm mt-0.5">info</span>
              <p className="text-xs text-secondary font-bold leading-relaxed">Need more campaigns? Upgrade to Business for unlimited access.</p>
            </div>
          </div>

          {/* 3. Payment Methods */}
          <div className="col-span-1 md:col-span-6 lg:col-span-4 bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/10">
            <h3 className="text-xl font-bold font-headline mb-6 text-on-surface">Payment Methods</h3>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-transparent hover:border-outline-variant/30 transition-all group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-8 bg-white border border-outline-variant/20 rounded-md flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Visa ending in 4242</p>
                    <p className="text-xs text-outline font-medium">Expires 04/26</p>
                  </div>
                </div>
                <button className="text-outline hover:text-error transition-colors p-2 rounded-lg hover:bg-error/10 opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>
            </div>
            <button className="w-full flex items-center justify-center space-x-2 py-3.5 border-2 border-dashed border-outline-variant/50 text-on-surface-variant font-bold rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Add new card</span>
            </button>
          </div>

          {/* 4. Billing History Table */}
          <div className="col-span-1 md:col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden flex flex-col">
            <div className="p-6 sm:p-8 border-b border-outline-variant/10 flex justify-between items-center bg-surface/30">
              <h3 className="text-xl font-bold font-headline text-on-surface">Billing History</h3>
              <button className="text-primary font-bold text-sm flex items-center hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors">
                <span>Export All</span>
                <span className="material-symbols-outlined ml-1 text-[18px]">file_download</span>
              </button>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-surface-container-low/50">
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Date</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Amount</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-outline">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-outline text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {[
                    { date: 'Nov 12, 2024', amount: '$29.00', status: 'Paid' },
                    { date: 'Oct 12, 2024', amount: '$29.00', status: 'Paid' },
                    { date: 'Sep 12, 2024', amount: '$29.00', status: 'Paid' },
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-surface-container-low/30 transition-colors group">
                      <td className="px-8 py-5 text-sm font-bold text-on-surface-variant">{item.date}</td>
                      <td className="px-8 py-5 text-sm font-black text-on-surface">{item.amount}</td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="p-2 text-outline hover:text-primary hover:bg-primary/10 rounded-full transition-colors">
                          <span className="material-symbols-outlined">download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
