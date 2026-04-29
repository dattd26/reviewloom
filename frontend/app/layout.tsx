import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Manrope, Inter } from 'next/font/google'
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
  title: 'ReviewLoom | Build Trust, Automate Growth',
  description: "Intercept negative experiences before they go public. Our automated ledger captures dissatisfaction privately while routing happy customers to Google and Yelp.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="light">
        <body className={`${manrope.variable} ${inter.variable} antialiased font-body bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}