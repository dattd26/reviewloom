import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Manrope, Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import 'material-symbols/outlined.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ReviewLoom | Smart QR Review Campaigns',
  description: 'ReviewLoom helps local businesses collect more Google reviews, capture private feedback, and measure QR campaign performance.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="light" suppressHydrationWarning>
        <body className={`${manrope.variable} ${inter.variable} antialiased font-body bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed`}>
          <Toaster position="bottom-right" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}