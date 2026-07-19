"use client";

import Link from 'next/link';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Logo } from '@/components/ui/Logo';

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 glass-effect bg-surface/80 no-line-architecture">
      <nav className="flex justify-between items-center px-4 py-4 md:px-8 md:py-5 max-w-7xl mx-auto font-display tracking-tight">
        <Link id="header-logo-link" href="/" className="text-xl md:text-2xl font-extrabold tracking-tighter text-primary flex items-center gap-1.5 md:gap-2">
          <Logo className="w-7 h-7 md:w-8 md:h-8 text-primary" />
          ReviewLoom
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-on-surface-variant">
          <Link id="header-link-features" href="/#features" className="hover:text-primary transition-colors">Features</Link>
          <Link id="header-link-pricing" href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link id="header-link-how-it-works" href="/#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button id="header-btn-login" className="text-xs md:text-sm font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Log In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button id="header-btn-get-started" className="bg-primary hover:bg-primary-container text-on-primary px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold shadow-lg shadow-primary/20 transition-all duration-300 active:scale-95 transform cursor-pointer">Get Started</button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link id="header-link-dashboard" href="/dashboard" className="text-xs md:text-sm font-bold text-primary hover:opacity-80 transition-opacity">
              Dashboard
            </Link>
            <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-8 h-8 md:w-10 md:h-10' } }} />
          </Show>
        </div>
      </nav>
    </header>
  );
}
