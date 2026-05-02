import Link from 'next/link';

export default function CampaignList() {
  return (
    <>
      {/* Top Nav */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-outline-variant/5">
        <div className="px-8 h-20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div className="flex items-center gap-8 w-full sm:w-auto">
            <div>
              <h2 className="text-xl font-headline font-black text-on-surface tracking-tight leading-none">
                QR Campaigns
              </h2>
              <p className="text-[11px] font-bold uppercase tracking-widest text-outline mt-1.5 opacity-70">
                Active &bull; 24 Touchpoints
              </p>
            </div>

            <div className="relative hidden md:block w-72">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline/50 text-lg">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-surface-container-low/50 border border-outline-variant/10 rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/10 transition-all outline-none text-on-surface placeholder:text-outline/40"
                placeholder="Search campaigns..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-high transition-all text-outline hover:text-primary border border-outline-variant/10 sm:border-none">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <Link
              href="/dashboard/campaigns/new"
              className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Create New
            </Link>
          </div>
        </div>
      </header>


      {/* Page Canvas */}
      <div className="p-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight mb-2">QR Campaigns</h2>
          <p className="text-on-surface-variant font-medium">Manage and monitor your customer engagement touchpoints.</p>
        </div>

        {/* Dashboard Highlights (Asymmetric Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          <div className="col-span-1 md:col-span-8 bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10 flex items-end justify-between overflow-hidden relative group">
            <div className="relative z-10">
              <p className="font-label text-on-surface-variant font-semibold tracking-wider uppercase text-[10px] mb-2">Network Performance</p>
              <h3 className="font-display text-5xl font-bold tracking-tighter text-on-surface mb-4 flex items-end gap-3">
                2,400
                <span className="text-sm font-bold text-secondary bg-secondary/10 px-2 py-1 rounded-md flex items-center mb-1">
                  <span className="material-symbols-outlined text-sm mr-1">trending_up</span> 12%
                </span>
              </h3>
              <p className="text-sm text-on-surface-variant max-w-xs">Total scans across all active QR codes this month.</p>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] w-1/2 h-[120%] opacity-5 pointer-events-none group-hover:scale-105 transition-transform duration-700">
              <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'wght' 100" }}>qr_code_2</span>
            </div>
          </div>

          <div className="col-span-1 md:col-span-4 bg-secondary/10 p-8 rounded-2xl border border-secondary/20 flex flex-col justify-center">
            <p className="text-secondary font-bold tracking-wider uppercase text-[10px] mb-2">Conversion Rate</p>
            <h3 className="text-4xl font-bold tracking-tighter text-secondary mb-4">42.5%</h3>
            <div className="h-2 w-full bg-secondary/20 rounded-full overflow-hidden">
              <div className="h-full bg-secondary w-[42.5%] rounded-full"></div>
            </div>
            <p className="text-xs text-secondary/80 font-medium mt-4">Scans to Review Ratio</p>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-outline-variant/10 bg-surface/50 gap-4 sm:gap-0">
            <h4 className="font-bold text-lg text-on-surface">Active Campaigns</h4>
            <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-lg">
              <button className="px-4 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface rounded-md transition-colors">All</button>
              <button className="px-4 py-1.5 text-xs font-bold text-primary bg-white shadow-sm rounded-md transition-all">Active</button>
              <button className="px-4 py-1.5 text-xs font-bold text-on-surface-variant hover:text-on-surface rounded-md transition-colors">Inactive</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="text-on-surface-variant font-bold text-[10px] uppercase tracking-widest bg-surface/30 border-b border-outline-variant/10">
                  <th className="px-8 py-4">Campaign Name</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Total Scans</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {/* Row 1 */}
                <tr className="group hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                        <span className="material-symbols-outlined text-xl">storefront</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">Downtown Branch - Main Entrance</p>
                        <p className="text-xs text-outline mt-0.5">Created Oct 12, 2023</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20">
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-on-surface text-lg">1,240</p>
                    <p className="text-[10px] text-secondary font-bold flex items-center mt-0.5">
                      <span className="material-symbols-outlined text-[12px] mr-1">arrow_upward</span> +5.2%
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-10 h-10 flex items-center justify-center hover:bg-surface rounded-full text-outline hover:text-primary transition-all" title="Download QR">
                        <span className="material-symbols-outlined text-xl">download</span>
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center hover:bg-surface rounded-full text-outline hover:text-primary transition-all" title="Edit">
                        <span className="material-symbols-outlined text-xl">edit_note</span>
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center hover:bg-surface rounded-full text-outline hover:text-primary transition-all" title="View Stats">
                        <span className="material-symbols-outlined text-xl">analytics</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="group hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                        <span className="material-symbols-outlined text-xl">restaurant</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">Uptown Branch - Table 4</p>
                        <p className="text-xs text-outline mt-0.5">Created Nov 05, 2023</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20">
                      Active
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-on-surface text-lg">850</p>
                    <p className="text-[10px] text-secondary font-bold flex items-center mt-0.5">
                      <span className="material-symbols-outlined text-[12px] mr-1">arrow_upward</span> +2.1%
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-10 h-10 flex items-center justify-center hover:bg-surface rounded-full text-outline hover:text-primary transition-all" title="Download QR">
                        <span className="material-symbols-outlined text-xl">download</span>
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center hover:bg-surface rounded-full text-outline hover:text-primary transition-all" title="Edit">
                        <span className="material-symbols-outlined text-xl">edit_note</span>
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center hover:bg-surface rounded-full text-outline hover:text-primary transition-all" title="View Stats">
                        <span className="material-symbols-outlined text-xl">analytics</span>
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="group hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center text-outline flex-shrink-0">
                        <span className="material-symbols-outlined text-xl">outdoor_grill</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">Westside Cafe - Outdoor Seating</p>
                        <p className="text-xs text-outline mt-0.5">Created Sep 18, 2023</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-surface-container-highest text-outline border border-outline-variant/30">
                      Inactive
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-on-surface text-lg">310</p>
                    <p className="text-[10px] text-error font-bold flex items-center mt-0.5">
                      <span className="material-symbols-outlined text-[12px] mr-1">arrow_downward</span> -0.4%
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-10 h-10 flex items-center justify-center hover:bg-surface rounded-full text-outline hover:text-primary transition-all" title="Download QR">
                        <span className="material-symbols-outlined text-xl">download</span>
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center hover:bg-surface rounded-full text-outline hover:text-primary transition-all" title="Edit">
                        <span className="material-symbols-outlined text-xl">edit_note</span>
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center hover:bg-surface rounded-full text-outline hover:text-primary transition-all" title="View Stats">
                        <span className="material-symbols-outlined text-xl">analytics</span>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination/Footer */}
          <div className="px-8 py-4 bg-surface/50 border-t border-outline-variant/10 flex items-center justify-between">
            <p className="text-xs text-outline font-medium">Showing 3 of 24 campaigns</p>
            <div className="flex items-center gap-1.5">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-highest text-on-surface shadow-sm text-sm font-bold">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface-variant text-sm font-bold transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface-variant text-sm font-bold transition-colors">3</button>
              <span className="px-1 text-outline">...</span>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-on-surface-variant text-sm font-bold transition-colors">8</button>
            </div>
          </div>
        </div>

        {/* Help/Resource Cards (Editorial Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="bg-primary/5 p-6 rounded-2xl relative overflow-hidden group hover:bg-primary/10 transition-colors border border-primary/10">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary">help_center</span>
            </div>
            <h5 className="font-bold mb-2 text-on-surface">Printing Guide</h5>
            <p className="text-sm text-on-surface-variant leading-relaxed">Learn how to print high-resolution QR codes for window decals and menus.</p>
          </div>
          <div className="bg-secondary/5 p-6 rounded-2xl relative overflow-hidden group hover:bg-secondary/10 transition-colors border border-secondary/10">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-secondary">lightbulb</span>
            </div>
            <h5 className="font-bold mb-2 text-on-surface">Strategy Tips</h5>
            <p className="text-sm text-on-surface-variant leading-relaxed">Top 5 locations to place your QR codes to maximize daily customer engagement.</p>
          </div>
          <div className="bg-primary/5 p-6 rounded-2xl relative overflow-hidden group hover:bg-primary/10 transition-colors border border-primary/10">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
            </div>
            <h5 className="font-bold mb-2 text-on-surface">Dynamic Links</h5>
            <p className="text-sm text-on-surface-variant leading-relaxed">How to change the destination URL without re-printing your physical materials.</p>
          </div>
        </div>
      </div>
    </>
  );
}
