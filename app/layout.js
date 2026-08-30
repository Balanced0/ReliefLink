import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { 
  ShieldCheck, HeartHandshake, ArrowRight, Building2, 
  BarChart3, PlusCircle, HelpCircle, Activity, Globe2,
  PhoneCall, ExternalLink
} from "lucide-react";
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
  title: "ReliefLink — Real-Time Disaster Resource & Volunteer Coordination",
  description: "Direct, rapid disaster response matching urgent humanitarian needs with verified volunteers, local organizations, and immediate resource dispatch.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">

        {/* Main Navbar */}
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-950 font-sans">
                    Relief<span className="text-emerald-600">Link</span>
                  </span>
                </div>
              </div>
            </Link>

            {/* Main Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 px-3.5 py-2 rounded-lg transition-all"
              >
                Browse Needs
              </Link>
              <Link
                href="/needs/new"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 px-3.5 py-2 rounded-lg transition-all"
              >
                Post a Need
              </Link>
              <Link
                href="/organizations"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 px-3.5 py-2 rounded-lg transition-all"
              >
                Organizations
              </Link>
              <Link
                href="/impact"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 px-3.5 py-2 rounded-lg transition-all"
              >
                Impact
              </Link>
              <Link
                href="/about"
                className="text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 px-3.5 py-2 rounded-lg transition-all"
              >
                About
              </Link>
            </nav>

            {/* Actions / Auth */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/needs/new"
                className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md hover:shadow-emerald-600/20 transition-all active:scale-95"
              >
                <PlusCircle size={15} />
                <span>Request Help</span>
              </Link>
              <Link
                href="/signup"
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all"
              >
                Join Volunteer
              </Link>
            </div>
          </div>

          {/* Secondary Mobile Scrollable Nav */}
          <div className="lg:hidden flex items-center gap-2 px-4 py-2 border-t border-slate-100 overflow-x-auto text-xs bg-slate-50/80">
            <Link href="/dashboard" className="shrink-0 font-medium text-slate-700 hover:text-emerald-600 px-2 py-1 rounded bg-white border border-slate-200/80">
              Browse Needs
            </Link>
            <Link href="/needs/new" className="shrink-0 font-medium text-slate-700 hover:text-emerald-600 px-2 py-1 rounded bg-white border border-slate-200/80">
              Post Need
            </Link>
            <Link href="/organizations" className="shrink-0 font-medium text-slate-700 hover:text-emerald-600 px-2 py-1 rounded bg-white border border-slate-200/80">
              Organizations
            </Link>
            <Link href="/impact" className="shrink-0 font-medium text-slate-700 hover:text-emerald-600 px-2 py-1 rounded bg-white border border-slate-200/80">
              Impact
            </Link>
            <Link href="/about" className="shrink-0 font-medium text-slate-700 hover:text-emerald-600 px-2 py-1 rounded bg-white border border-slate-200/80">
              About
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex flex-col flex-1">{children}</main>

        {/* Enhanced Modern Footer */}
        <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
              {/* Brand Col */}
              <div className="lg:col-span-2 space-y-4">
                <Link href="/" className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white">
                    Relief<span className="text-emerald-400">Link</span>
                  </span>
                </Link>
                <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                  Decentralized disaster response platform connecting affected individuals, local responders, and humanitarian groups for direct, verifiable aid delivery.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Real-Time Dispatch Engine
                  </span>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                  Coordination
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link href="/dashboard" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      Live Needs Feed
                    </Link>
                  </li>
                  <li>
                    <Link href="/needs/new" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      Request Aid
                    </Link>
                  </li>
                  <li>
                    <Link href="/organizations" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      Relief Organizations
                    </Link>
                  </li>
                  <li>
                    <Link href="/impact" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      Impact Summary
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                  Information
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>
                    <Link href="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      About ReliefLink
                    </Link>
                  </li>
                  <li>
                    <Link href="/about#principles" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      Core Principles
                    </Link>
                  </li>
                  <li>
                    <Link href="/about#how-it-works" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/about#safety" className="text-slate-400 hover:text-emerald-400 transition-colors">
                      Safety & Verification
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Emergency Banner */}
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-2">
                  <PhoneCall size={14} />
                  <span>Emergency Crisis Hotline</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  If you are in immediate life-threatening danger, contact local emergency services immediately (911/999).
                </p>
                <Link
                  href="/needs/new"
                  className="block text-center bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
                >
                  Publish Urgent Need
                </Link>
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <p>© {new Date().getFullYear()} ReliefLink Humanitarian Network. All rights reserved.</p>
              <div className="flex items-center gap-6">
                <span className="text-slate-400">Open Coordination Standard</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Verified Non-Profit Infrastructure
                </span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
