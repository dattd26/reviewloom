import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-surface-container-low border-t border-outline-variant/10 w-full pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="text-2xl font-extrabold tracking-tighter text-primary-container">
              ReviewLoom
            </div>
            <p className="text-on-surface-variant max-w-sm leading-relaxed">
              The premier reputation management platform for physical stores. 
              Capture satisfied moments and intercept dissatisfaction before it goes public.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-bold text-on-surface uppercase tracking-widest text-xs">Product</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link href="/#features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-primary transition-colors">How it works</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-on-surface uppercase tracking-widest text-xs">Legal</h4>
            <ul className="space-y-4 text-sm text-on-surface-variant">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-outline-variant/10 gap-4 font-display text-sm">
          <div className="text-on-surface-variant/60 italic font-medium">
            Designed for the local business heartbeat.
          </div>
          <div className="text-on-surface-variant/60">
            © {new Date().getFullYear()} ReviewLoom. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
