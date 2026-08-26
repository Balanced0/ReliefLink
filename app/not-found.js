import Link from "next/link";

export const metadata = {
  title: "404 – Page Not Found | ReliefLink",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-[85vh] bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center shadow-sm">
            <svg
              className="w-10 h-10 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <p className="text-7xl font-extrabold text-slate-900 tracking-tight mb-2">
          404
        </p>

        <h1 className="text-2xl font-bold text-slate-800 mb-3">
          Page not found
        </h1>

        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have been moved, deleted, or never existed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow transition-all focus:outline-none focus:ring-2 focus:ring-slate-500"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            Dashboard
          </Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-slate-400">
          <svg
            className="w-4 h-4 text-emerald-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
          <span className="text-xs font-medium">ReliefLink</span>
        </div>
      </div>
    </div>
  );
}
