import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="pt-24 overflow-hidden">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <h1 className="font-display font-extrabold text-[3.5rem] leading-[1.1] tracking-tight text-on-surface">
                  Don&apos;t let bad reviews kill your business.
                </h1>
                <p className="font-body text-lg leading-relaxed text-on-surface-variant max-w-xl">
                  Intercept negative experiences before they go public. Our automated ledger captures dissatisfaction privately while routing happy customers to Google and Yelp.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <button className="bg-primary hover:bg-primary-container text-on-primary px-8 py-4 rounded-lg font-bold text-lg shadow-lg shadow-primary/10 transition-all active:scale-95 cursor-pointer">
                  Start 14-Day Free Trial
                </button>
                <button className="bg-surface-container-highest text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-surface-container-high transition-all active:scale-95 cursor-pointer">
                  See How It Works
                </button>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-10 h-10 rounded-full border-2 border-surface" alt="professional portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALDPX2Akj5nFK2agP5utwOWvwm-G0iM6aJJjCmRCUZIb-aBkbIv6_1I34EbsKrfEWPitmK48W7ykotaEIILudzSv-DZ2vTSO0WT3UraSckcNB2n2cf1rjX68SHiBd9SCkIKTc0LrU9CCbrwVzTStZFNU2eGgmJlgrm4a7QF7R_2nm98yUGfcihlBLzZVCkVBL-tjInLB60pa59aEqsCconxNtprLkDVuDrrlpQW9ztN2PMF3lfMfqHfzGAPuvuPOqboPlpyWWdbL5X" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-10 h-10 rounded-full border-2 border-surface" alt="headshot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9-M19UwTlPbqibihWOYGNQXQyNVWO2uojfAePCRBqYS_8Wmuq4fmUqwuypLiPg-r0Iq5LFmGnsuEgKI356kn7ZquvnY95iYb6zPZMFpkPSGJft8Hvu4aF0G5Bioj_goUK2YGIOU35_Rrdw8uHRxPebrwO2MAShemw-ux-Lm-yz2D82to_HZsiBT13XNingZwp_JqG7CEgGoy6rcmv-ur9032IMFrFumoNSboKF3ulH8wPfWxPF_paNl0LiGVrI40ggfzZFDZxonyA" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-10 h-10 rounded-full border-2 border-surface" alt="closeup" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHBHS8GxV1PdMIHP2p_gJ8qneBHFjnRfpvah4s04vmWhwGkLsBMWnbdS-aoByMY_NhYNaD61aPvAs-Meprp04AmRzUweI1uDWYHODSIla7_y1Ru-3j-HrIvp9TvFq1uTvt03uFmYECz79d9czjcMmTkMOzMHZXFf97-vXSXC68PTtKcphscFsDzO-ZZ_ywLskjRlEZyOd5nurRkUDTv_yAVKN_2Xe14eBF7iQzQn0f0zsncU-gZ4TK140RvdpuJ9Rdt_dnf4TDiBTN" />
                </div>
                <span className="font-label text-sm font-semibold text-on-surface-variant tracking-wide">Trusted by 1,200+ local businesses</span>
              </div>
            </div>

            <div className="relative">
              <div className="bg-surface-container-low rounded-[2rem] p-4 lg:p-8 aspect-square flex items-center justify-center relative">
                {/* Floating Glass Card 1 */}
                <div className="absolute -top-4 -left-4 glass-effect bg-white/80 p-6 rounded-xl shadow-2xl z-10 w-64">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-secondary-container p-2 rounded-full">
                      <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                    <span className="font-label font-bold text-on-surface">Review Boosted</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[92%]"></div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">4.9/5.0 Average</span>
                    <span className="font-label text-[10px] font-bold text-secondary">+12 this week</span>
                  </div>
                </div>

                {/* Main Mockup Image */}
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="w-full h-full object-cover opacity-90" alt="clean digital dashboard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ41ttJB8hvrelUXB1xeRNMS0dPtG178g15_EQIG4lHFQW7mUAwXMVDD6cr-RqwnQPK76RF3PDeyzmmx_OrXcZTTRVs70-S-l-AKr6umoxAkbFFfHgz0nItmS0JA6k7vG-1-UaikRzgnWOGVHxYGEervpt7pCev3Pw0VWbscbv_dcFG1JKNg6w1lr_p19GW3mvhLKLn6_EiYYYjeW4-AZFKrpNxvVEdI8cejHCpldlooBaSs5rQK_8rIxOpCxYKhgERX9J71VmI-Zo" />
                </div>

                {/* Floating Glass Card 2 */}
                <div className="absolute -bottom-6 -right-4 glass-effect bg-white/80 p-6 rounded-xl shadow-2xl z-10 w-72">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-error-container p-2 rounded-full">
                      <span className="material-symbols-outlined text-on-error-container">warning</span>
                    </div>
                    <span className="font-label font-bold text-on-surface">Private Intercept</span>
                  </div>
                  <p className="text-xs text-on-surface-variant italic mb-2">&#34;The service was slow today...&#34;</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-primary text-on-primary py-2 rounded-md text-[10px] font-bold cursor-pointer">Reply Privately</button>
                    <button className="flex-1 bg-surface-container text-on-surface py-2 rounded-md text-[10px] font-bold cursor-pointer">Resolved</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works (Connected Timeline) */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <span className="font-label text-primary font-bold tracking-[0.2em] uppercase text-xs mb-4 block">The Process</span>
              <h2 className="font-display font-extrabold text-[2.5rem] text-on-surface tracking-tight">Three steps to a perfect reputation</h2>
            </div>

            <div className="relative grid md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="relative z-10 space-y-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-surface-container-lowest rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-primary text-4xl">qr_code_2</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-xl">1. Scan QR Code</h3>
                  <p className="text-on-surface-variant leading-relaxed">Customers scan your unique code at checkout or on their receipt.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 space-y-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-secondary-container rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-on-secondary-container text-4xl">sentiment_satisfied</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-xl">2. Happy? → Google</h3>
                  <p className="text-on-surface-variant leading-relaxed">Delighted customers are instantly prompted to leave a public 5-star review.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 space-y-6 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-error-container rounded-2xl flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-on-error-container text-4xl">sentiment_dissatisfied</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-xl">3. Unhappy? → Private</h3>
                  <p className="text-on-surface-variant leading-relaxed">Constructive feedback is routed to you privately, preventing a public rant.</p>
                </div>
              </div>

              {/* Connecting Line (Desktop Only) */}
              <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-0.5 bg-outline-variant opacity-20 -z-0"></div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="bg-primary rounded-[2.5rem] p-12 lg:p-20 text-on-primary relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
              <svg fill="none" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <circle cx="400" cy="0" fill="white" r="400"></circle>
              </svg>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
              <div className="space-y-8">
                <h2 className="font-display font-extrabold text-[2.5rem] lg:text-[3.5rem] leading-[1.1] tracking-tighter">
                  Increase 5-star reviews by 3x in 30 days.
                </h2>
                <p className="text-xl opacity-90 leading-relaxed">
                  Our ledger system doesn&#39;t just manage reviews; it activeley repairs customer relationships and scales your social proof on autopilot.
                </p>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-5xl opacity-50">verified_user</span>
                  <div className="font-label">
                    <p className="text-lg font-bold">100% Compliant</p>
                    <p className="text-sm opacity-70">Fully aligned with Google & Yelp review policies.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl space-y-2">
                  <div className="text-5xl font-extrabold tracking-tighter">42%</div>
                  <p className="font-label text-sm font-semibold uppercase tracking-widest opacity-80">Reduction in churn</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl space-y-2">
                  <div className="text-5xl font-extrabold tracking-tighter">310%</div>
                  <p className="font-label text-sm font-semibold uppercase tracking-widest opacity-80">Review Growth</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl space-y-2">
                  <div className="text-5xl font-extrabold tracking-tighter">24/7</div>
                  <p className="font-label text-sm font-semibold uppercase tracking-widest opacity-80">Monitoring</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl space-y-2">
                  <div className="text-5xl font-extrabold tracking-tighter">1.2s</div>
                  <p className="font-label text-sm font-semibold uppercase tracking-widest opacity-80">Response time</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
            <div className="text-center mb-16 space-y-4">
              <h2 className="font-display font-extrabold text-[2.5rem] text-on-surface">Simple, transparent pricing.</h2>
              <p className="text-on-surface-variant max-w-lg mx-auto">Everything you need to dominate your local market. No hidden fees or long-term contracts.</p>
            </div>

            <div className="w-full max-w-md">
              <div className="bg-surface-container-lowest rounded-[2rem] p-12 border-2 border-primary relative shadow-xl transform hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-6 py-1 rounded-full font-label font-bold text-xs uppercase tracking-widest">
                  Most popular
                </div>

                <div className="text-center mb-10">
                  <h3 className="font-display font-bold text-2xl mb-2">Pro</h3>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-5xl font-extrabold tracking-tighter text-on-surface">$29</span>
                    <span className="text-on-surface-variant font-medium">/month</span>
                  </div>
                </div>

                <ul className="space-y-5 mb-10">
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-on-surface-variant">Unlimited Intercepted Reviews</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-on-surface-variant">Smart QR Code Generator</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-on-surface-variant">Real-time SMS Notifications</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-on-surface-variant">Custom Feedback Dashboard</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-on-surface-variant">Dedicated Support</span>
                  </li>
                </ul>

                <button className="w-full bg-secondary hover:bg-on-secondary-container text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-secondary/20 transition-all active:scale-95 mb-6 cursor-pointer">
                  Start 14-Day Free Trial
                </button>
                <p className="text-center font-label text-xs text-on-surface-variant font-medium">
                  No credit card required. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
