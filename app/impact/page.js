"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp, Users, BarChart2, Calendar,
  Loader2, Trophy, CheckCircle2, ShieldCheck,
  AlertTriangle, MapPin, ArrowRight, HeartHandshake,
  Clock, Activity, Droplet, Pill, Home, LifeBuoy, Package
} from "lucide-react";

const CATEGORY_LABELS = {
  food:     "Food & Water",
  medicine: "Medicine & First Aid",
  shelter:  "Shelter & Clothing",
  rescue:   "Rescue & Evac",
  other:    "Other Essentials",
};

const CATEGORY_ICONS = {
  food: Droplet,
  medicine: Pill,
  shelter: Home,
  rescue: LifeBuoy,
  other: Package,
};

const CATEGORY_COLORS = {
  food:     "bg-emerald-500",
  medicine: "bg-blue-500",
  shelter:  "bg-amber-500",
  rescue:   "bg-red-500",
  other:    "bg-purple-500",
};

const URGENCY_CONFIG = {
  critical: { label: "Critical Priority", color: "bg-red-500", text: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  high:     { label: "High Priority",     color: "bg-orange-500", text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  medium:   { label: "Medium Priority",   color: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  low:      { label: "Low Priority",      color: "bg-slate-400", text: "text-slate-700", bg: "bg-slate-100", border: "border-slate-200" },
};

export default function ImpactPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function fetchStats(start, end) {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (start) params.set("startDate", start);
      if (end) params.set("endDate", end);
      const qs = params.toString() ? `?${params.toString()}` : "";
      
      const res = await fetch(`http://localhost:5000/api/stats/impact${qs}`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setStats(data);
      } else {
        setError("Could not load impact data from server.");
      }
    } catch {
      setError("Unable to connect to the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats(startDate, endDate);
  }, [startDate, endDate]);

  const totalNeeds = stats?.total_needs || 0;
  const totalFulfilled = stats?.total_fulfilled || 0;
  const resolutionRate = totalNeeds > 0 ? Math.round((totalFulfilled / totalNeeds) * 100) : (totalFulfilled > 0 ? 100 : 0);
  const areasCovered = stats?.needs_by_area?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Activity size={14} className="text-emerald-600" />
              <span>Real-Time Relief Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Impact &amp; Transparency
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Public verification of broadcasted emergency requests, volunteer dispatches, and sector coverage.
            </p>
          </div>

          {/* Date Range Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
              <Calendar size={15} className="text-slate-400 ml-1" />
              <div className="flex items-center gap-1.5 text-xs">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  aria-label="Start date"
                  className="bg-transparent text-slate-700 focus:outline-none text-xs"
                />
                <span className="text-slate-300">—</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  aria-label="End date"
                  className="bg-transparent text-slate-700 focus:outline-none text-xs"
                />
              </div>
              {(startDate || endDate) && (
                <button
                  onClick={() => { setStartDate(""); setEndDate(""); }}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 px-2 py-0.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={32} className="text-emerald-600 animate-spin mb-3" />
            <p className="text-sm text-slate-500 font-medium">Aggregating real-time impact metrics…</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
            <AlertTriangle size={32} className="text-rose-500 mx-auto mb-2" />
            <p className="text-slate-700 text-sm font-semibold">{error}</p>
            <button
              onClick={() => fetchStats(startDate, endDate)}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : stats && (
          <div className="space-y-8">
            
            {/* 1. Top Key KPI Grid (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Fulfilled */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between opacity-80 text-xs font-bold uppercase tracking-wider mb-2">
                    <span>Needs Fulfilled</span>
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="text-4xl sm:text-5xl font-black tracking-tight">
                    {totalFulfilled}
                  </div>
                </div>
                <p className="text-xs text-emerald-100/75 mt-4">
                  {startDate || endDate ? "Filtered time window" : "All-time verified relief aid"}
                </p>
              </div>

              {/* Card 2: Resolution Rate */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span>Resolution Rate</span>
                    <TrendingUp size={16} className="text-emerald-600" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-900">{resolutionRate}%</span>
                    <span className="text-xs font-semibold text-slate-400">resolved</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(resolutionRate, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5">{totalFulfilled} of {totalNeeds} total needs closed</p>
                </div>
              </div>

              {/* Card 3: Total Broadcasts */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span>Total Broadcasts</span>
                    <Activity size={16} className="text-blue-600" />
                  </div>
                  <div className="text-4xl font-extrabold text-slate-900">
                    {totalNeeds}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  Emergency requests received
                </p>
              </div>

              {/* Card 4: Sectors Served */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span>Active Sectors</span>
                    <MapPin size={16} className="text-purple-600" />
                  </div>
                  <div className="text-4xl font-extrabold text-slate-900">
                    {areasCovered}
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4">
                  Crisis zones with active dispatch
                </p>
              </div>

            </div>

            {/* 2. Middle Row: Category Breakdown + Urgency Level Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Category Breakdown */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <BarChart2 size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Fulfilled by Category</h2>
                      <p className="text-xs text-slate-400">Distribution of delivered emergency supplies</p>
                    </div>
                  </div>
                </div>

                {!stats.needs_by_category || stats.needs_by_category.length === 0 ? (
                  <div className="text-center py-10">
                    <Package size={24} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No category breakdown data recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {(() => {
                      const maxCat = Math.max(...stats.needs_by_category.map((i) => Number(i.count) || 0));
                      return stats.needs_by_category.map((item) => {
                        const count = Number(item.count) || 0;
                        const pct = maxCat > 0 ? Math.round((count / maxCat) * 100) : 0;
                        const color = CATEGORY_COLORS[item.category] || "bg-slate-400";
                        const Icon = CATEGORY_ICONS[item.category] || Package;
                        const label = CATEGORY_LABELS[item.category] || item.category;

                        return (
                          <div key={item.category} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                                <Icon size={13} className="text-slate-400" />
                                {label}
                              </span>
                              <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                                {count} {count === 1 ? "delivery" : "deliveries"}
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
                      });
                    })()}
                  </div>
                )}
              </div>

              {/* Urgency Resolution Breakdown */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <AlertTriangle size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Urgency Level Resolution</h2>
                      <p className="text-xs text-slate-400">Response distribution across crisis tiers</p>
                    </div>
                  </div>
                </div>

                {!stats.needs_by_urgency || stats.needs_by_urgency.length === 0 ? (
                  <div className="text-center py-10">
                    <Clock size={24} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No urgency resolution data recorded yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {["critical", "high", "medium", "low"].map((urg) => {
                      const match = stats.needs_by_urgency.find((u) => u.urgency === urg);
                      const count = match ? Number(match.count) : 0;
                      const cfg = URGENCY_CONFIG[urg];

                      return (
                        <div key={urg} className={`p-3.5 rounded-2xl border ${cfg.border} ${cfg.bg} flex flex-col justify-between`}>
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className={`w-2 h-2 rounded-full ${cfg.color}`} />
                            <span className={`text-xs font-bold ${cfg.text} capitalize`}>
                              {urg}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900">{count}</span>
                            <span className="text-[11px] font-semibold text-slate-500">fulfilled</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>

            {/* 3. Third Row: Volunteer Leaderboard + Sector Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Leaderboard: Most Active Volunteers */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Trophy size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Top Responders Leaderboard</h2>
                      <p className="text-xs text-slate-400">Volunteers with highest verified closed requests</p>
                    </div>
                  </div>
                </div>

                {!stats.most_active_volunteers || stats.most_active_volunteers.length === 0 ? (
                  <div className="text-center py-10">
                    <Users size={24} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Volunteers are actively fulfilling broadcasts.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {stats.most_active_volunteers.map((v, idx) => (
                      <div key={v.user_id} className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors border border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            idx === 0 ? "bg-amber-100 text-amber-700"
                            : idx === 1 ? "bg-slate-200 text-slate-700"
                            : idx === 2 ? "bg-orange-100 text-orange-700"
                            : "bg-slate-100 text-slate-500"
                          }`}>
                            {idx + 1}
                          </span>
                          <Link href={`/users/${v.user_id}`} className="text-sm font-bold text-slate-800 hover:text-emerald-700 transition-colors">
                            {v.name}
                          </Link>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                          {v.contributions} {v.contributions === 1 ? "delivery" : "deliveries"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Aid Distribution by Crisis Zone / Area */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">Aid by Crisis Zone</h2>
                      <p className="text-xs text-slate-400">Geographic delivery distribution</p>
                    </div>
                  </div>
                </div>

                {!stats.needs_by_area || stats.needs_by_area.length === 0 ? (
                  <div className="text-center py-10">
                    <MapPin size={24} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">No regional fulfillment data available.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.needs_by_area.map((area) => (
                      <div key={area.area_name} className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50/70 border border-slate-100">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <MapPin size={13} className="text-purple-600" />
                          {area.area_name}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          {area.count} {area.count === 1 ? "fulfilled" : "fulfilled"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* 4. Fourth Row: Recent Verified Deliveries Timeline */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Recent Verified Deliveries</h2>
                    <p className="text-xs text-slate-400">Latest completed aid dispatches</p>
                  </div>
                </div>
              </div>

              {!stats.recent_deliveries || stats.recent_deliveries.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={24} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No recent delivery records found.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {stats.recent_deliveries.map((item) => (
                    <div key={item.need_id} className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {item.description || `Need #${item.need_id}`}
                          </span>
                          <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                            <MapPin size={10} /> {item.area_name}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Fulfilled by <span className="font-semibold text-slate-600">{item.volunteer_name || "Volunteer"}</span>
                        </p>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 shrink-0">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Call-To-Action Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div>
                <h3 className="text-lg sm:text-xl font-bold">Ready to make an impact in your crisis zone?</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Join our verified relief network today as a volunteer or register your aid organization to mobilize resources.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/signup"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition-colors shadow-xs"
                >
                  Join as Volunteer
                </Link>
                <Link
                  href="/dashboard"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Browse Needs
                </Link>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

