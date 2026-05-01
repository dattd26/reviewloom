import Link from 'next/link';
import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 glass-effect bg-surface/80 no-line-architecture">
      <nav className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto font-display tracking-tight">
        <Link href="/" className="text-2xl font-extrabold tracking-tighter text-primary-container flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          ReviewLoom
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-on-surface-variant">
          <Link href="/#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="/#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          <Link href="/#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
        </div>

        <div className="flex items-center gap-6">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-sm font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Log In</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-primary hover:bg-primary-container text-on-primary px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 transition-all duration-300 active:scale-95 transform cursor-pointer">Get Started</button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Link href="/dashboard" className="text-sm font-bold text-primary hover:opacity-80 transition-opacity">
              Dashboard
            </Link>
            <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-10 h-10' } }} />
          </Show>
        </div>
      </nav>
    </header>
  );
}
