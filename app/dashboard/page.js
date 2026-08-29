"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Droplet, Pill, Home, LifeBuoy, Package,
  RefreshCw, Filter, ChevronDown, X,
  AlertTriangle, Users, CheckCheck, Inbox,
} from "lucide-react";
import NeedDetailModal from "../../components/NeedDetailModal";

/* ─── shared lookup tables ────────────────────────────────────── */
const CATEGORY_META = {
  food:     { Icon: Droplet,  label: "Food & Water" },
  medicine: { Icon: Pill,     label: "Medicine" },
  shelter:  { Icon: Home,     label: "Shelter" },
  rescue:   { Icon: LifeBuoy, label: "Rescue" },
  other:    { Icon: Package,  label: "Other" },
};

const URGENCY_META = {
  critical: {
    dot: "bg-red-500", text: "text-red-700",
    border: "border-l-red-500", badge: "bg-red-50 text-red-700 ring-1 ring-red-200",
    label: "Critical",
  },
  high: {
    dot: "bg-orange-500", text: "text-orange-700",
    border: "border-l-orange-500", badge: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
    label: "High",
  },
  medium: {
    dot: "bg-blue-500", text: "text-blue-700",
    border: "border-l-blue-500", badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    label: "Medium",
  },
  low: {
    dot: "bg-gray-400", text: "text-gray-500",
    border: "border-l-gray-300", badge: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
    label: "Low",
  },
};

/* ─── NeedCard ────────────────────────────────────────────────── */
function NeedCard({ need, onClick }) {
  const u = URGENCY_META[need.urgency] || URGENCY_META.low;

  return (
    <button
      onClick={() => onClick(need)}
      className={`w-full text-left bg-white rounded-xl border-l-4 ${u.border} border border-gray-100 shadow-sm hover:shadow-md hover:translate-y-[-1px] transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-1 group`}
    >
      {/* Card body */}
      <div className="p-4">
        {/* Top row: categories + urgency badge */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5">
            {(need.categories || []).map((cat) => {
              const meta = CATEGORY_META[cat];
              if (!meta) return null;
              const { Icon, label } = meta;
              return (
                <span
                  key={cat}
                  title={label}
                  className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded-md"
                >
                  <Icon size={11} />
                  {label}
                </span>
              );
            })}
          </div>
          <span className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-md ${u.badge}`}>
            {u.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-[13px] text-gray-800 leading-snug line-clamp-2 mb-3 group-hover:text-gray-900 transition-colors">
          {need.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span className="flex items-center gap-1 truncate max-w-[55%]">
            <span className="font-medium text-gray-600 truncate">{need.area_name || `Area ${need.area_id}`}</span>
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {need.quantity && (
              <span className="bg-gray-50 border border-gray-100 rounded px-1.5 py-0.5 text-[11px] text-gray-500 truncate max-w-[80px]">
                {need.quantity}
              </span>
            )}
            <span className="text-gray-400 truncate max-w-[60px]">{need.poster_name || "Anon"}</span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ─── EmptyState ──────────────────────────────────────────────── */
function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <Inbox size={32} className="text-gray-300 mb-3" />
      <p className="text-sm font-medium text-gray-400">No {label.toLowerCase()} needs</p>
      <p className="text-xs text-gray-300 mt-1">Check back soon</p>
    </div>
  );
}

/* ─── Column skeleton ─────────────────────────────────────────── */
function ColumnSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[100, 80, 120].map((h, i) => (
        <div
          key={i}
          className="rounded-xl bg-gray-100 animate-pulse border-l-4 border-l-gray-200"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

/* ─── StatusColumn ────────────────────────────────────────────── */
const COLUMN_STYLES = {
  open:      { icon: AlertTriangle, ring: "ring-blue-200",   icon_color: "text-blue-500",   label_color: "text-blue-800",   count_bg: "bg-blue-600",   tab_active: "border-blue-600 text-blue-700 bg-blue-50" },
  claimed:   { icon: Users,         ring: "ring-orange-200", icon_color: "text-orange-500", label_color: "text-orange-800", count_bg: "bg-orange-500", tab_active: "border-orange-500 text-orange-700 bg-orange-50" },
  fulfilled: { icon: CheckCheck,    ring: "ring-green-200",  icon_color: "text-green-500",  label_color: "text-green-800",  count_bg: "bg-green-600",  tab_active: "border-green-600 text-green-700 bg-green-50" },
};

function StatusColumn({ statusKey, label, needs, onCardClick }) {
  const s = COLUMN_STYLES[statusKey];
  const Icon = s.icon;

  return (
    <div className="flex flex-col min-w-0">
      {/* Column header */}
      <div className={`flex items-center justify-between mb-4 pb-3 border-b border-gray-100`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg bg-white ring-1 ${s.ring} shadow-xs`}>
            <Icon size={14} className={s.icon_color} />
          </div>
          <span className={`text-sm font-bold ${s.label_color}`}>{label}</span>
        </div>
        <span className={`text-white text-xs font-bold px-2 py-0.5 rounded-full ${s.count_bg}`}>
          {needs.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {needs.length === 0
          ? <EmptyState label={label} />
          : needs.map((n) => <NeedCard key={n.need_id} need={n} onClick={onCardClick} />)
        }
      </div>
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────────── */
export default function DashboardPage() {
  const [needs, setNeeds]           = useState([]);
  const [areas, setAreas]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab]   = useState("open");   // mobile tab

  const [filterStatus,   setFilterStatus]   = useState("");
  const [filterUrgency,  setFilterUrgency]  = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAreaId,   setFilterAreaId]   = useState("");

  const [selectedNeed, setSelectedNeed] = useState(null);

  const fetchNeeds = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filterStatus)   params.set("status",   filterStatus);
      if (filterUrgency)  params.set("urgency",  filterUrgency);
      if (filterCategory) params.set("category", filterCategory);
      if (filterAreaId)   params.set("area_id",  filterAreaId);
      const q = params.toString() ? `?${params}` : "";
      const res  = await fetch(`http://localhost:5000/api/needs${q}`, { credentials: "include" });
      const data = await res.json().catch(() => []);
      if (!res.ok) setError("Failed to load needs. Please try again.");
      else setNeeds(Array.isArray(data) ? data : []);
    } catch {
      setError("Could not reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterUrgency, filterCategory, filterAreaId]);

  useEffect(() => { fetchNeeds(); }, [fetchNeeds]);

  useEffect(() => {
    fetch("http://localhost:5000/api/areas", { credentials: "include" })
      .then((r) => r.json().catch(() => []))
      .then((d) => { if (Array.isArray(d)) setAreas(d); })
      .catch(() => {});
  }, []);

  const openNeeds      = needs.filter((n) => n.status === "open");
  const claimedNeeds   = needs.filter((n) => n.status === "claimed");
  const fulfilledNeeds = needs.filter((n) => n.status === "fulfilled");

  const hasFilters = filterStatus || filterUrgency || filterCategory || filterAreaId;

  const selectCls = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all appearance-none";

  const tabs = [
    { key: "open",      label: "Open",      count: openNeeds.length,      ...COLUMN_STYLES.open },
    { key: "claimed",   label: "Claimed",   count: claimedNeeds.length,   ...COLUMN_STYLES.claimed },
    { key: "fulfilled", label: "Fulfilled", count: fulfilledNeeds.length, ...COLUMN_STYLES.fulfilled },
  ];

  const columnNeeds = { open: openNeeds, claimed: claimedNeeds, fulfilled: fulfilledNeeds };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-gray-50">

      {/* ── Hero header ───────────────────────────────────────── */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-blue-300 text-xs font-semibold uppercase tracking-widest mb-1">Live Overview</p>
              <h1 className="text-2xl sm:text-3xl font-bold">Needs Dashboard</h1>
              <p className="text-blue-200 text-sm mt-1">Real-time community relief coordination</p>
            </div>

            <button
              onClick={fetchNeeds}
              disabled={loading}
              className="flex items-center gap-2 self-start sm:self-auto text-sm font-medium text-white border border-white/30 hover:border-white/60 hover:bg-white/10 rounded-xl px-4 py-2 transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Stat pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: "Open",      count: openNeeds.length,      bg: "bg-blue-800 ring-blue-700",    dot: "bg-blue-400"  },
              { label: "Claimed",   count: claimedNeeds.length,   bg: "bg-orange-900/60 ring-orange-700", dot: "bg-orange-400" },
              { label: "Fulfilled", count: fulfilledNeeds.length, bg: "bg-green-900/60 ring-green-700",   dot: "bg-green-400" },
            ].map(({ label, count, bg, dot }) => (
              <div key={label} className={`flex items-center gap-2.5 ${bg} ring-1 rounded-2xl px-4 py-2`}>
                <span className={`w-2 h-2 rounded-full ${dot}`} />
                <span className="text-white text-sm">
                  <span className="font-bold text-lg leading-none mr-1">{loading ? "—" : count}</span>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters bar ───────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100 shadow-xs sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter toggle row */}
          <div className="flex items-center justify-between h-12">
            <button
              onClick={() => setShowFilters((p) => !p)}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${showFilters ? "text-blue-900" : "text-gray-600 hover:text-gray-900"}`}
            >
              <Filter size={15} />
              Filters
              {hasFilters && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-900 text-white text-[10px] font-bold">
                  {[filterStatus, filterUrgency, filterCategory, filterAreaId].filter(Boolean).length}
                </span>
              )}
              <ChevronDown size={14} className={`transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {hasFilters && (
              <button
                onClick={() => { setFilterStatus(""); setFilterUrgency(""); setFilterCategory(""); setFilterAreaId(""); }}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-600 transition-colors"
              >
                <X size={12} /> Clear all
              </button>
            )}
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="pb-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Status */}
              <div className="relative">
                <select id="filter-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectCls}>
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="claimed">Claimed</option>
                  <option value="fulfilled">Fulfilled</option>
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {/* Urgency */}
              <div className="relative">
                <select id="filter-urgency" value={filterUrgency} onChange={(e) => setFilterUrgency(e.target.value)} className={selectCls}>
                  <option value="">All Urgencies</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {/* Category */}
              <div className="relative">
                <select id="filter-category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={selectCls}>
                  <option value="">All Categories</option>
                  <option value="food">Food &amp; Water</option>
                  <option value="medicine">Medicine &amp; First Aid</option>
                  <option value="shelter">Shelter &amp; Clothing</option>
                  <option value="rescue">Rescue &amp; Evac</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              {/* Area */}
              <div className="relative">
                <select id="filter-area" value={filterAreaId} onChange={(e) => setFilterAreaId(e.target.value)} className={selectCls}>
                  <option value="">All Areas</option>
                  {areas.map((a) => (
                    <option key={a.area_id} value={a.area_id}>
                      {a.area_name}{a.district ? ` — ${a.district}` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* ── Mobile: tab switcher ─────────────────────────────── */}
        <div className="md:hidden">
          {/* Tabs */}
          <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-gray-100 mb-5">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 flex flex-col items-center py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === t.key
                    ? t.tab_active + " border"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <span className="text-lg font-bold leading-none mb-0.5">
                  {loading ? "—" : columnNeeds[t.key].length}
                </span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Active column */}
          {loading ? (
            <ColumnSkeleton />
          ) : (
            <StatusColumn
              statusKey={activeTab}
              label={tabs.find((t) => t.key === activeTab)?.label}
              needs={columnNeeds[activeTab]}
              onCardClick={setSelectedNeed}
            />
          )}
        </div>

        {/* ── Desktop: 3 columns ───────────────────────────────── */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {loading ? (
            [0, 1, 2].map((i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gray-200 animate-pulse" />
                    <div className="h-4 w-16 rounded bg-gray-200 animate-pulse" />
                  </div>
                  <div className="h-5 w-6 rounded-full bg-gray-200 animate-pulse" />
                </div>
                <ColumnSkeleton />
              </div>
            ))
          ) : (
            [
              { key: "open",      label: "Open",      data: openNeeds },
              { key: "claimed",   label: "Claimed",   data: claimedNeeds },
              { key: "fulfilled", label: "Fulfilled", data: fulfilledNeeds },
            ].map(({ key, label, data }) => (
              <StatusColumn
                key={key}
                statusKey={key}
                label={label}
                needs={data}
                onCardClick={setSelectedNeed}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────────── */}
      {selectedNeed && (
        <NeedDetailModal
          need={selectedNeed}
          onClose={() => setSelectedNeed(null)}
          onActionSuccess={fetchNeeds}
        />
      )}
    </div>
  );
}
