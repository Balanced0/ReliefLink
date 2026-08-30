"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp, Users, BarChart2, Calendar,
  Loader2, LogIn, Trophy,
} from "lucide-react";

const CATEGORY_LABELS = {
  food:     "Food & Water",
  medicine: "Medicine & First Aid",
  shelter:  "Shelter & Clothing",
  rescue:   "Rescue & Evac",
  other:    "Other Essentials",
};

const CATEGORY_COLORS = {
  food:     "bg-emerald-500",
  medicine: "bg-blue-500",
  shelter:  "bg-amber-500",
  rescue:   "bg-red-500",
  other:    "bg-slate-400",
};

export default function ImpactPage() {
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [unauthed, setUnauthed] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate]     = useState("");

  async function fetchStats(start, end) {
    setLoading(true);
    setError("");
    setUnauthed(false);
    try {
      const params = new URLSearchParams();
      if (start) params.set("startDate", start);
      if (end)   params.set("endDate",   end);
      const qs  = params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`http://localhost:5000/api/stats/impact${qs}`, {
        credentials: "include",
      });

      if (res.status === 401) {
        setUnauthed(true);
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not load impact data.");
        return;
      }

      const data = await res.json().catch(() => ({}));
      setStats(data);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats(startDate, endDate);
  }, [startDate, endDate]);

  if (!loading && unauthed) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[65vh] px-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
          <LogIn size={22} className="text-blue-600" />
        </div>
        <h1 className="text-lg font-semibold text-slate-800 mb-1">
          Sign in to view Impact Summary
        </h1>
        <p className="text-sm text-slate-500 mb-5 text-center max-w-xs">
          This page is only available to logged-in users.
        </p>
        <Link
          href="/login"
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <LogIn size={15} /> Go to Login
        </Link>
      </div>
    );
  }

  function CategoryBars({ items }) {
    if (!items || items.length === 0) {
      return <p className="text-sm text-slate-400 italic">No data.</p>;
    }
    const max = Math.max(...items.map((i) => Number(i.count) || 0));
    return (
      <div className="space-y-2.5">
        {items.map((item) => {
          const pct = max > 0 ? Math.round((Number(item.count) / max) * 100) : 0;
          const color = CATEGORY_COLORS[item.category] || "bg-slate-400";
          return (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-slate-700">
                  {CATEGORY_LABELS[item.category] || item.category}
                </span>
                <span className="text-xs font-semibold text-slate-900">
                  {item.count}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${color} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <TrendingUp size={18} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Impact Summary</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Platform-wide fulfillment stats — filter by date range or see all-time.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1" htmlFor="start-date">
                From
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-3.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/40 transition-all text-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1" htmlFor="end-date">
                To
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-sm border border-slate-200 rounded-xl px-3.5 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/40 transition-all text-slate-700"
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(""); setEndDate(""); }}
                className="text-xs text-slate-400 hover:text-slate-700 pb-2 transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={26} className="text-slate-400 animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm">{error}</p>
            <button
              onClick={() => fetchStats(startDate, endDate)}
              className="mt-3 text-sm text-blue-700 hover:underline font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {!loading && !error && stats && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-7 text-white">
              <p className="text-sm font-medium text-emerald-100/80 mb-1">
                Total Needs Fulfilled
              </p>
              <p className="text-6xl font-black tracking-tight">
                {stats.total_fulfilled ?? 0}
              </p>
              {(startDate || endDate) && (
                <p className="text-xs text-emerald-100/60 mt-2">
                  {startDate && endDate
                    ? `${startDate} — ${endDate}`
                    : startDate
                    ? `From ${startDate}`
                    : `Up to ${endDate}`}
                </p>
              )}
              {!startDate && !endDate && (
                <p className="text-xs text-emerald-100/60 mt-2">All time</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={16} className="text-amber-500" />
                  <h2 className="text-sm font-semibold text-slate-800">
                    Most Active Volunteers
                  </h2>
                </div>

                {(!stats.most_active_volunteers ||
                  stats.most_active_volunteers.length === 0) ? (
                  <p className="text-sm text-slate-400 italic">No data.</p>
                ) : (
                  <ol className="space-y-2.5">
                    {stats.most_active_volunteers.map((v, idx) => (
                      <li key={v.user_id} className="flex items-center gap-3">
                        <span
                          className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            idx === 0
                              ? "bg-amber-100 text-amber-700"
                              : idx === 1
                              ? "bg-slate-100 text-slate-600"
                              : idx === 2
                              ? "bg-orange-50 text-orange-600"
                              : "bg-slate-50 text-slate-400"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <Link
                          href={`/users/${v.user_id}`}
                          className="flex-1 text-sm font-medium text-slate-700 hover:text-blue-700 hover:underline transition-colors truncate"
                        >
                          {v.name}
                        </Link>
                        <span className="shrink-0 text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                          {v.contributions}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart2 size={16} className="text-blue-500" />
                  <h2 className="text-sm font-semibold text-slate-800">
                    Fulfilled by Category
                  </h2>
                </div>
                <CategoryBars items={stats.needs_by_category} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
