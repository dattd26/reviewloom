import Link from 'next/link';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#f7f9fb]/80 dark:bg-slate-950/80 backdrop-blur-md no-line-architecture">
      <nav className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto font-display font-medium tracking-tight">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-[#1d4ed8] dark:text-blue-400">
          ReviewLoom
        </Link>
        <div className="flex items-center gap-8">
          <Show when="signed-out">
            <SignInButton>
              <button className="text-slate-600 dark:text-slate-400 hover:text-[#1d4ed8] transition-colors cursor-pointer">Log In</button>
            </SignInButton>
            <SignUpButton>
              <button className="bg-primary hover:bg-primary-container text-on-primary px-6 py-2.5 rounded-lg font-bold transition-all duration-300 active:scale-95 transform cursor-pointer">
                Start Free Trial
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard" className="text-slate-600 dark:text-slate-400 hover:text-[#1d4ed8] transition-colors font-semibold">
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>
      </nav>
    </header>
  );
}
