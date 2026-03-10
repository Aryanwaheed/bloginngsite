import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { TempoInit } from "@/components/tempo-init";
import { ThemeProvider } from "@/components/theme-provider";
import AnalyticsTracker from "@/components/analytics-tracker";
import GlobalAd from "@/components/global-ad";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });

export const metadata: Metadata = {
  title: "WorkHub - Jobs & Life Guider",
  description: "Find your next job or chat with your own Life Guider",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        <Script
          async
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script id="gpt-init" strategy="afterInteractive">
          {`
            window.googletag = window.googletag || {cmd: []};
            googletag.cmd.push(function() {
              googletag.defineSlot('/23334616024/Displayads', [[300, 250], 'fluid', [250, 250], [336, 280]], 'div-gpt-ad-1772287373829-0').addService(googletag.pubads());
              googletag.defineSlot('/23334616024/Displayads1', [[336, 280], 'fluid'], 'div-gpt-ad-1772472477296-0').addService(googletag.pubads());
              googletag.defineSlot('/23334616024/Displayads1', [[336, 280], 'fluid'], 'div-gpt-ad-1773129246885-0').addService(googletag.pubads());
              googletag.pubads().enableSingleRequest();
              googletag.enableServices();
            });
          `}
        </Script>
      </head>
      <body className={`${plusJakarta.variable} font-jakarta`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* Global Top Ad */}
          <GlobalAd />
          {children}
        </ThemeProvider>
        <TempoInit />
        <AnalyticsTracker />
      </body>
    </html>
  );
}
