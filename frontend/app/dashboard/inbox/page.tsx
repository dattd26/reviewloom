import { UserButton } from '@clerk/nextjs';

export default function FeedbackInbox() {
  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* TopAppBar Shell */}
      <header className="flex justify-between items-center w-full px-8 py-4 bg-white/85 backdrop-blur-xl border-b border-outline-variant/10 z-40 shadow-sm shrink-0">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-full max-w-md focus-within:ring-2 focus-within:ring-primary/20 rounded-xl transition-all">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full bg-surface-container-low border-none rounded-xl py-2.5 pl-10 pr-4 text-sm font-body focus:ring-0 text-on-surface placeholder:text-outline"
              placeholder="Search feedback..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-outline hover:text-primary transition-colors hover:bg-surface-container-high p-2 rounded-full">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface hidden sm:inline-block">The Editorial Ledger</span>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col overflow-hidden bg-surface">
        {/* Page Header & Filters */}
        <div className="px-8 py-6 flex flex-col gap-6 shrink-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Private Feedback</h2>
              <p className="text-on-surface-variant font-medium mt-1 text-sm">Managing critical customer responses from the 'Not Satisfied' segment.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 bg-surface-container-lowest text-primary px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all border border-outline-variant/10 active:scale-95">
                <span className="material-symbols-outlined text-sm">download</span>
                Export Report
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex bg-surface-container-low p-1.5 rounded-xl border border-outline-variant/10">
              <button className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white text-primary shadow-sm border border-outline-variant/5 transition-all">All</button>
              <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">Unread</button>
              <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">Pending</button>
              <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant hover:text-on-surface transition-colors">Resolved</button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/15 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors whitespace-nowrap">
              <span className="material-symbols-outlined text-sm">calendar_today</span>
              Date Range: Last 30 Days
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/15 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors whitespace-nowrap">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Campaign: Q4 Survey
            </button>
          </div>
        </div>

        {/* Layout Wrapper */}
        <div className="flex-1 flex overflow-hidden px-4 sm:px-8 pb-8 gap-6">

          {/* Left Column: Message List (35%) */}
          <section className="w-full sm:w-[350px] flex flex-col gap-4 overflow-y-auto pr-2 shrink-0 hidden sm:flex">

            {/* Feedback Card: Active/Selected */}
            <div className="bg-surface-container-lowest p-5 rounded-2xl border-l-4 border-l-primary shadow-sm cursor-pointer hover:shadow-md transition-all border-t border-r border-b border-outline-variant/10">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-on-surface text-sm">Marcus Thorne</h4>
                <span className="text-[10px] font-bold text-on-surface-variant">2 hours ago</span>
              </div>
              <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed mt-1">The checkout process was extremely frustrating. It kept declining my valid card three times before...</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-error"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-error">Unread</span>
              </div>
            </div>

            {/* Feedback Card: Unread */}
            <div className="bg-surface-container-low/30 p-5 rounded-2xl border border-outline-variant/10 hover:border-outline-variant/30 hover:bg-surface-container-lowest transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-on-surface/80 text-sm">Anonymous User</h4>
                <span className="text-[10px] font-bold text-on-surface-variant">5 hours ago</span>
              </div>
              <p className="text-sm text-on-surface-variant/80 line-clamp-2 leading-relaxed mt-1">The recent update moved all the features I use daily. I spent 20 minutes looking for the export button...</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-error"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-error">Unread</span>
              </div>
            </div>

            {/* Feedback Card: Pending */}
            <div className="bg-surface-container-low/30 p-5 rounded-2xl border border-outline-variant/10 hover:border-outline-variant/30 hover:bg-surface-container-lowest transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-on-surface/80 text-sm">Sarah Jenkins</h4>
                <span className="text-[10px] font-bold text-on-surface-variant">Oct 24</span>
              </div>
              <p className="text-sm text-on-surface-variant/80 line-clamp-2 leading-relaxed mt-1">Waiting over 48 hours for a support ticket response is unacceptable for a premium tier customer...</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-outline"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-outline">Pending</span>
              </div>
            </div>

            {/* Feedback Card: Pending */}
            <div className="bg-surface-container-low/30 p-5 rounded-2xl border border-outline-variant/10 hover:border-outline-variant/30 hover:bg-surface-container-lowest transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-on-surface/80 text-sm">Leonid Volkov</h4>
                <span className="text-[10px] font-bold text-on-surface-variant">Oct 23</span>
              </div>
              <p className="text-sm text-on-surface-variant/80 line-clamp-2 leading-relaxed mt-1">Prices increased by 15% but I don't see any corresponding value added to the dashboard toolset...</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-outline"></span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-outline">Pending</span>
              </div>
            </div>
          </section>

          {/* Right Column: Detail View (65%) */}
          <section className="flex-1 bg-surface-container-lowest rounded-2xl flex flex-col shadow-sm border border-outline-variant/10 overflow-hidden">

            {/* Detail Header */}
            <div className="p-6 sm:p-8 bg-surface-container-low/30 border-b border-outline-variant/10 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-primary text-on-primary rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm">MT</div>
                <div>
                  <h3 className="text-xl font-extrabold text-on-surface">Marcus Thorne</h3>
                  <div className="flex flex-col sm:flex-row sm:gap-4 mt-1.5 gap-1">
                    <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">mail</span>
                      m.thorne@designcorp.io
                    </span>
                    <span className="hidden sm:inline text-outline-variant">•</span>
                    <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">ads_click</span>
                      Source: Q4 Satisfaction Survey
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-outline hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
              <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 rounded-full bg-error/10 text-error text-[10px] font-extrabold uppercase tracking-widest border border-error/20">Sentiment: Critical</span>
                  <span className="text-xs text-outline font-medium">Submitted via Mobile App</span>
                </div>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-outline mb-4">Customer Feedback</h4>
                <div className="bg-surface/50 p-6 rounded-2xl border border-outline-variant/10">
                  <p className="text-[15px] leading-relaxed text-on-surface font-medium italic">
                    "The checkout process was extremely frustrating. It kept declining my valid card three times before finally going through on the fourth attempt. This caused a duplicate hold on my account which my bank is now investigating. I've been a loyal user for 3 years, but this experience makes me want to switch to a competitor. I need this resolved and the extra holds cleared immediately."
                  </p>
                </div>

                {/* Reputation Pulse Signature Component */}
                <div className="mt-8 p-6 bg-surface-container-low/50 rounded-2xl border border-outline-variant/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-error mb-1">Reputation Impact</p>
                    <p className="text-3xl font-black text-on-surface flex items-baseline gap-1">
                      -12.4
                      <span className="text-sm font-bold text-outline">pts</span>
                    </p>
                  </div>
                  <div className="h-12 w-32 hidden sm:block">
                    {/* Reputation Pulse Sparkline (Stylized) */}
                    <svg className="w-full h-full" viewBox="0 0 100 30">
                      <path d="M0 15 L20 12 L40 18 L60 5 L80 25 L100 10" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Area */}
            <div className="p-6 sm:p-8 border-t border-outline-variant/10 bg-surface-container-low/20 shrink-0">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-outline mb-4">Reply via Email</h4>
              <div className="relative bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b border-outline-variant/10 bg-surface/50">
                  <button className="p-1.5 hover:bg-surface-container-high rounded-lg text-outline hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-sm">format_bold</span></button>
                  <button className="p-1.5 hover:bg-surface-container-high rounded-lg text-outline hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-sm">format_italic</span></button>
                  <button className="p-1.5 hover:bg-surface-container-high rounded-lg text-outline hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-sm">link</span></button>
                  <div className="w-px h-4 bg-outline-variant/30 mx-2"></div>
                  <button className="p-1.5 hover:bg-surface-container-high rounded-lg text-outline hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-sm">format_list_bulleted</span></button>
                </div>
                <textarea
                  className="w-full p-4 text-sm font-body border-none focus:ring-0 resize-none bg-transparent outline-none text-on-surface placeholder:text-outline"
                  placeholder="Write your professional response here..."
                  rows={4}
                ></textarea>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                <div className="flex gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none bg-primary hover:bg-primary-container text-on-primary px-8 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">send</span>
                    Send Reply
                  </button>
                  <button className="flex-1 sm:flex-none bg-surface-container-high text-on-surface-variant px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-surface-container-highest transition-all active:scale-95 border border-outline-variant/10">
                    Mark as Resolved
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                  <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                  AI Assistant Enabled
                </div>
              </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
