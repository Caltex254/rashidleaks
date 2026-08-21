// RASHID LEAKS - Root Layout with All Providers

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav, MobileNavSpacer } from "@/components/layout/MobileNav";
import { Providers } from "@/app/providers";
import { SplashScreen } from "@/components/SplashScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "RASHID LEAKS - Premium Adult Video Platform",
    template: "%s | RASHID LEAKS"
  },
  description: "RASHID LEAKS is a premium adult video-sharing platform. Watch, upload, and discover adult content in a safe, moderated environment. 18+ only.",
  keywords: ["adult", "video", "sharing", "platform", "18+", "premium content"],
  authors: [{ name: "RASHID LEAKS" }],
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    title: "RASHID LEAKS - Premium Adult Video Platform",
    description: "Watch, upload, and discover premium adult content. 18+ only.",
    type: "website",
    locale: "en_US",
    siteName: "RASHID LEAKS",
  },
  twitter: {
    card: "summary_large_image",
    title: "RASHID LEAKS - Premium Adult Video Platform",
    description: "Watch, upload, and discover premium adult content. 18+ only.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0f0f0f' },
    { media: '(prefers-color-scheme: light)', color: '#0f0f0f' },
  ],
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Prevent FOUC of unstyled content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var darkMode = localStorage.getItem('theme') === 'dark' || 
                    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (darkMode) document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f0f0f] text-white min-h-screen flex flex-col`}
      >
        <Providers>
          {/* Splash Screen - Shows for 3 seconds on initial load */}
          <SplashScreen />
          
          {/* Skip to main content for accessibility */}
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-red-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
          >
            Skip to main content
          </a>
          
          {/* Header */}
          <Header />
          
          {/* Main Content */}
          <main id="main-content" className="flex-1">
            {children}
          </main>
          
          {/* Spacer for mobile nav */}
          <MobileNavSpacer />
          
          {/* Footer */}
          <Footer />
          
          {/* Mobile Bottom Navigation */}
          <MobileNav />
          
          {/* Toast Notifications */}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
