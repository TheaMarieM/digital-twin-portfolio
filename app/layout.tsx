import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marithea Magno — Portfolio",
  description: "IT student showcasing projects, designs, and AI experiments.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          {/* Light mode subtle blobs */}
          <div className="block dark:hidden">
            <div className="absolute left-[-10%] top-[-20%] h-[45vh] w-[55vw] rounded-full blur-3xl opacity-[0.14]" style={{background: 'radial-gradient(closest-side, rgba(168,85,247,0.28), transparent 70%)'}} />
            <div className="absolute right-[-15%] bottom-[-20%] h-[40vh] w-[50vw] rounded-full blur-3xl opacity-[0.12]" style={{background: 'radial-gradient(closest-side, rgba(236,72,153,0.22), transparent 70%)'}} />
          </div>
          {/* Dark mode stronger blobs + starfield */}
          <div className="hidden dark:block">
            <div className="absolute left-[-15%] top-[-25%] h-[55vh] w-[65vw] rounded-full blur-3xl opacity-[0.18]" style={{background: 'radial-gradient(closest-side, rgba(168,85,247,0.4), transparent 70%)'}} />
            <div className="absolute right-[-20%] bottom-[-25%] h-[50vh] w-[60vw] rounded-full blur-3xl opacity-[0.16]" style={{background: 'radial-gradient(closest-side, rgba(217,70,239,0.38), transparent 70%)'}} />
            <div className="absolute inset-0 opacity-12" style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1.5px)', backgroundSize: '3px 3px'}} />
          </div>
        </div>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[rgb(var(--card))] focus:px-3 focus:py-2 focus:text-sm focus:shadow-soft border border-[rgb(var(--border))]"
        >
          Skip to content
        </a>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                var saved = localStorage.getItem('theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var shouldDark = saved ? saved === 'dark' : prefersDark;
                var el = document.documentElement;
                if (shouldDark) el.classList.add('dark'); else el.classList.remove('dark');
              } catch (_) {}
            })();
          `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
