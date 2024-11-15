import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./components/landing/ThemeProvider";
import { SessionProvider } from "./utils/session_provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Viewee",
  description: "--",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <SessionProvider>
        <html lang="en" className={inter.className}>
          <body className="flex flex-col gap-4">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </body>
        </html>
      </SessionProvider>
    </ClerkProvider>
  );
}
