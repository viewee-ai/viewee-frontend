import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
// import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from './components/landing/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GetCooked AI',
  description: '--',
  // icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en" className={inter.className}>
        <body className="flex flex-col gap-4">
          <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
            {children}
          {/* <Analytics /> */}  
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}