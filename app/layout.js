import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ReliefLink - Disaster Resource Coordination",
  description: "Connecting Help With Those Who Need It Most",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-xl font-bold tracking-tight text-slate-950">ReliefLink</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="#" className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors">How It Works</Link>
              <Link href="#" className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors">Browse Needs</Link>
              <Link href="/needs/new" className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors">Post a Need</Link>
              <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors">Dashboard</Link>
              <Link href="#" className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors">About</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-950 px-3 py-2 transition-colors">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        <main className="flex flex-col flex-1">{children}</main>
      </body>
    </html>
  );
}

