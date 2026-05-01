import Link from 'next/link';
import Image from 'next/image';

export default function CampaignBuilder() {
  return (
    <>
      {/* TopNavBar (Specific to Builder) */}
      <header className="flex justify-between items-center w-full px-8 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg shadow-sm border-b border-outline-variant/10 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/campaigns" className="w-10 h-10 flex items-center justify-center bg-surface-container-lowest rounded-full hover:bg-surface-container-high transition-colors active:scale-95 duration-200 shadow-sm border border-outline-variant/10">
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </Link>
          <div>
            <h2 className="text-xl sm:text-2xl font-headline font-extrabold text-on-surface tracking-tight">Create New Campaign</h2>
            <p className="text-xs sm:text-sm font-body text-on-surface-variant">Configure your feedback routing and QR generation</p>
          </div>
        </div>
        <div className="hidden sm:flex gap-3">
          <button className="px-6 py-2.5 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-xl border border-outline-variant/20 transition-all">
            Save Draft
          </button>
          <button className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all">
            Generate QR Code
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full">
        {/* Mobile action buttons (visible only on small screens) */}
        <div className="flex sm:hidden gap-3 mb-8 w-full">
          <button className="flex-1 py-2.5 text-sm font-semibold text-on-surface-variant bg-surface-container-low rounded-xl border border-outline-variant/20 transition-all">
            Draft
          </button>
          <button className="flex-1 py-2.5 text-sm font-semibold bg-primary text-on-primary rounded-xl shadow-md transition-all">
            Generate
          </button>
        </div>

        {/* Content Area: 2-Column Bento/Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          {/* Left Column: Form Settings (3/5 width) */}
          <div className="lg:col-span-3 space-y-6">
            <section className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-outline-variant/10">
              <h3 className="text-lg font-headline font-bold text-on-surface mb-6">Campaign Settings</h3>
              <div className="space-y-6">
                
                {/* Campaign Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">Campaign Name</label>
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl px-4 py-3 text-sm font-medium transition-all outline-none text-on-surface placeholder:text-outline/50" 
                    placeholder="e.g. Downtown Cafe Summer Drive" 
                    type="text"
                  />
                </div>
                
                {/* Google Review URL */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">Google Review URL</label>
                    <button className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                      How to find this <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </button>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">link</span>
                    <input 
                      className="w-full bg-surface-container-low border border-outline-variant/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 rounded-xl pl-10 pr-4 py-3 text-sm font-medium transition-all outline-none text-on-surface placeholder:text-outline/50" 
                      placeholder="https://g.page/r/your-business-id/review" 
                      type="url"
                    />
                  </div>
                  <p className="text-[11px] text-on-surface-variant/70 leading-relaxed italic mt-1">
                    Positive feedback will be routed to this URL. Lower ratings will be routed to a private feedback form.
                  </p>
                </div>
                
                {/* Custom Logo Upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">Business Logo</label>
                  <div className="border-2 border-dashed border-outline-variant/30 rounded-2xl p-10 flex flex-col items-center justify-center bg-surface-container-low/30 hover:bg-surface-container-low transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-outline-variant/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined">upload_file</span>
                    </div>
                    <p className="text-sm font-semibold text-on-surface">Click or drag to upload logo</p>
                    <p className="text-xs text-on-surface-variant mt-1">PNG, JPG up to 5MB (400x400 recommended)</p>
                  </div>
                </div>

              </div>
            </section>

            {/* Advanced Routing Section */}
            <section className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary"></div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 pl-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[22px]">rule</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface">Feedback Routing Threshold</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5">Set the star rating that triggers a Google Review</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/20 self-start sm:self-auto w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg bg-primary text-on-primary shadow-sm">4+ Stars</button>
                  <button className="flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg text-on-surface-variant hover:bg-white hover:text-on-surface transition-colors">5 Stars Only</button>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Live Preview (2/5 width) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Mobile Mockup */}
            <div className="relative mx-auto lg:mx-0 w-full max-w-[320px]">
              <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent rounded-[3rem] blur-xl opacity-50"></div>
              <div className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl overflow-hidden border-[6px] border-slate-800">
                
                {/* Mobile Content Screen */}
                <div className="bg-white rounded-[2.2rem] h-[580px] w-full overflow-hidden flex flex-col relative">
                  {/* Status Bar */}
                  <div className="h-6 px-6 pt-3 flex justify-between items-center text-[10px] font-bold text-slate-400 absolute top-0 w-full">
                    <span>9:41</span>
                    <div className="flex gap-1 items-center">
                      <span className="material-symbols-outlined text-[12px]">signal_cellular_alt</span>
                      <span className="material-symbols-outlined text-[12px]">wifi</span>
                      <span className="material-symbols-outlined text-[12px]">battery_full</span>
                    </div>
                  </div>
                  
                  {/* App Header */}
                  <div className="flex flex-col items-center pt-16 pb-8 px-8">
                    <div className="w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-outline-variant/10 overflow-hidden">
                      <span className="material-symbols-outlined text-primary text-3xl">storefront</span>
                    </div>
                    <h5 className="text-lg font-headline font-extrabold text-on-surface text-center leading-tight">Your Business</h5>
                    <p className="text-xs text-on-surface-variant/80 mt-2 text-center px-2">Thank you for visiting us! We'd love to hear your thoughts.</p>
                  </div>
                  
                  {/* Feedback Card */}
                  <div className="flex-1 px-6">
                    <div className="bg-surface p-6 rounded-2xl border border-outline-variant/10 flex flex-col items-center shadow-sm">
                      <span className="text-sm font-bold text-on-surface mb-4">How was your experience?</span>
                      <div className="flex gap-2 text-outline-variant">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`material-symbols-outlined text-3xl cursor-pointer ${star <= 4 ? 'text-primary-container' : ''}`} style={{ fontVariationSettings: star <= 4 ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                        ))}
                      </div>
                      <div className="w-full h-24 bg-white border border-outline-variant/20 rounded-xl mt-6 p-3">
                        <p className="text-[10px] text-outline/50">Tell us more (optional)...</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Footer Button */}
                  <div className="p-6 mt-auto">
                    <button className="w-full py-3.5 bg-primary hover:bg-primary-container transition-colors text-white rounded-xl font-bold text-sm shadow-md shadow-primary/20">Submit Feedback</button>
                  </div>
                </div>
              </div>

              {/* Floating QR Preview */}
              <div className="absolute -bottom-6 -right-6 lg:-right-12 bg-white p-4 rounded-2xl shadow-xl shadow-primary/5 border border-outline-variant/10 flex flex-col items-center gap-2 max-w-[120px]">
                <div className="w-20 h-20 bg-surface-container-lowest rounded-xl flex items-center justify-center p-2 relative border border-outline-variant/20">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface text-[60px] opacity-20">qr_code_2</span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl drop-shadow-md">check_circle</span>
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">Dynamic QR</span>
              </div>
            </div>

            {/* Insight Tip Card */}
            <div className="bg-gradient-to-br from-secondary to-[#0c714d] p-6 rounded-2xl text-white shadow-lg shadow-secondary/20 relative overflow-hidden mt-8">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
              <div className="flex gap-4 relative z-10">
                <span className="material-symbols-outlined text-secondary-fixed/90 text-3xl">lightbulb</span>
                <div>
                  <h6 className="font-headline font-bold text-sm mb-1.5 text-secondary-fixed">Growth Tip</h6>
                  <p className="text-xs opacity-95 leading-relaxed font-medium text-white">Campaigns with custom logos see a <span className="font-extrabold text-white bg-white/20 px-1 rounded">24% higher</span> scan-to-feedback conversion rate. Ensure your brand is recognizable!</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
