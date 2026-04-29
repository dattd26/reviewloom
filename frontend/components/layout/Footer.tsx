import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#f2f4f6] dark:bg-slate-900 w-full py-12">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-4 font-display text-sm leading-relaxed">
        <div className="font-bold text-slate-900 dark:text-white">ReviewLoom</div>
        <div className="flex gap-8 text-slate-500 dark:text-slate-500">
          <Link href="/privacy" className="hover:text-[#1d4ed8] dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#1d4ed8] dark:hover:text-blue-400 transition-colors">Terms of Service</Link>
          <Link href="/cookies" className="hover:text-[#1d4ed8] dark:hover:text-blue-400 transition-colors">Cookies</Link>
        </div>
        <div className="text-slate-500">© {new Date().getFullYear()} ReviewLoom. All rights reserved.</div>
      </div>
    </footer>
  );
}
