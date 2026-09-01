"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Droplet, Pill, Home, LifeBuoy, Package,
  RefreshCw, Filter, ChevronDown, X,
  AlertTriangle, Users, CheckCheck, Inbox,
  PlusCircle, MapPin, Layers, Clock, Activity, ShieldCheck,
  Bookmark, BookmarkCheck, Check, Loader2,
} from "lucide-react";
import Link from "next/link";
import NeedDetailModal from "../../components/NeedDetailModal";

/* ─── shared lookup tables ────────────────────────────────────── */
const CATEGORY_META = {
  food:     { Icon: Droplet,  label: "Food & Water",        bg: "bg-blue-50 text-blue-700 border-blue-200" },
  medicine: { Icon: Pill,     label: "Medicine",            bg: "bg-rose-50 text-rose-700 border-rose-200" },
  shelter:  { Icon: Home,     label: "Shelter",             bg: "bg-amber-50 text-amber-700 border-amber-200" },
  rescue:   { Icon: LifeBuoy, label: "Rescue",              bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  other:    { Icon: Package,  label: "Other",               bg: "bg-purple-50 text-purple-700 border-purple-200" },
};

const URGENCY_META = {
  critical: {
    dot: "bg-red-500", text: "text-red-700",
    border: "border-l-red-500", badge: "bg-red-50 text-red-700 border border-red-200 font-bold",
    label: "Critical",
  },
  high: {
    dot: "bg-orange-500", text: "text-orange-700",
    border: "border-l-orange-500", badge: "bg-orange-50 text-orange-700 border border-orange-200 font-bold",
    label: "High",
  },
  medium: {
    dot: "bg-blue-500", text: "text-blue-700",
    border: "border-l-blue-500", badge: "bg-blue-50 text-blue-700 border border-blue-200 font-bold",
    label: "Medium",
  },
  low: {
    dot: "bg-slate-400", text: "text-slate-500",
    border: "border-l-slate-300", badge: "bg-slate-100 text-slate-600 border border-slate-200",
    label: "Low",
  },
};

/* ─── NeedCard ────────────────────────────────────────────────── */
function NeedCard({ need, isBookmarked, onClick }) {
  const u = URGENCY_META[need.urgency] || URGENCY_META.low;

  return (
    <button
      onClick={() => onClick(need)}
      className={`w-full text-left bg-white rounded-2xl border-l-4 ${u.border} border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 group p-4`}
    >
      {/* Top row: categories + urgency badge */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex flex-wrap gap-1">
          {(need.categories || []).map((cat) => {
            const meta = CATEGORY_META[cat];
            if (!meta) return null;
            const { Icon, label, bg } = meta;
            return (
              <span
                key={cat}
                title={label}
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg border ${bg}`}
              >
                <Icon size={11} />
                {label}
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {isBookmarked && (
            <span
              title="In your bookmarked operating area"
              className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
            >
              <BookmarkCheck size={10} />
              <span>My Area</span>
            </span>
          )}
          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${u.badge}`}>
            {u.label}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-2 mb-3 group-hover:text-slate-950 transition-colors">
        {need.description}
      </p>

      {/* Footer metadata */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1 truncate max-w-[55%] font-medium text-slate-600">
          <MapPin size={12} className="text-slate-400 shrink-0" />
          <span className="truncate">{need.area_name || `Area ${need.area_id}`}</span>
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {need.quantity && (
            <span className="bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5 text-[11px] font-semibold text-slate-600 truncate max-w-[90px]">
              {need.quantity}
            </span>
          )}
          <span className="text-slate-400 truncate max-w-[70px] text-[11px]">
            {need.poster_name || "Anonymous"}
          </span>
        </div>
      </div>
    </button>
  );
}

/* ─── EmptyState ──────────────────────────────────────────────── */
function EmptyState({ label, isMyAreasEmpty, onManageAreas }) {
  if (isMyAreasEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-white/60 rounded-2xl border border-dashed border-emerald-200 p-6">
        <Bookmark size={32} className="text-emerald-400 mb-2" />
        <p className="text-sm font-semibold text-slate-800">No Needs in Bookmarked Areas</p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          You have no active {label.toLowerCase()} dispatches in your saved areas.
        </p>
        {onManageAreas && (
          <button
            onClick={onManageAreas}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
          >
            <BookmarkCheck size={12} />
            Manage Operating Areas
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white/60 rounded-2xl border border-dashed border-slate-200">
      <Inbox size={32} className="text-slate-300 mb-2" />
      <p className="text-sm font-semibold text-slate-500">No {label.toLowerCase()} needs found</p>
      <p className="text-xs text-slate-400 mt-0.5">Adjust your filters or check back shortly</p>
    </div>
  );
}

/* ─── Column skeleton ─────────────────────────────────────────── */
function ColumnSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[110, 95, 125].map((h, i) => (
        <div
          key={i}
          className="rounded-2xl bg-slate-200/70 animate-pulse border-l-4 border-l-slate-300"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
}

/* ─── StatusColumn ────────────────────────────────────────────── */
const COLUMN_STYLES = {
  open: {
    icon: AlertTriangle,
    headerBg: "bg-blue-50 border-blue-200 text-blue-900",
    icon_color: "text-blue-600",
    badge_bg: "bg-blue-600 text-white",
    tab_active: "border-blue-600 text-blue-700 bg-blue-50"
  },
  claimed: {
    icon: Users,
    headerBg: "bg-amber-50 border-amber-200 text-amber-900",
    icon_color: "text-amber-600",
    badge_bg: "bg-amber-600 text-white",
    tab_active: "border-amber-500 text-amber-700 bg-amber-50"
  },
  fulfilled: {
    icon: CheckCheck,
    headerBg: "bg-emerald-50 border-emerald-200 text-emerald-900",
    icon_color: "text-emerald-600",
    badge_bg: "bg-emerald-600 text-white",
    tab_active: "border-emerald-600 text-emerald-700 bg-emerald-50"
  },
};

function StatusColumn({ statusKey, label, needs, bookmarkedAreaIds, onCardClick, isMyAreasActive, onManageAreas }) {
  const s = COLUMN_STYLES[statusKey];
  const Icon = s.icon;

  return (
    <div className="flex flex-col min-w-0">
      <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border mb-4 shadow-xs ${s.headerBg}`}>
        <div className="flex items-center gap-2">
          <Icon size={16} className={s.icon_color} />
          <span className="font-bold text-sm tracking-tight">{label} Needs</span>
        </div>
        <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${s.badge_bg}`}>
          {needs.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 min-h-[200px]">
        {needs.length === 0 ? (
          <EmptyState label={label} isMyAreasEmpty={isMyAreasActive} onManageAreas={onManageAreas} />
        ) : (
          needs.map((need) => (
            <NeedCard
              key={need.need_id}
              need={need}
              isBookmarked={bookmarkedAreaIds.includes(need.area_id)}
              onClick={onCardClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Main Dashboard Page ─────────────────────────────────────── */
export default function DashboardPage() {
  const [needs, setNeeds] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [user, setUser] = useState(null);
  const [bookmarkedAreaIds, setBookmarkedAreaIds] = useState([]);
  const [myAreasOnly, setMyAreasOnly] = useState(false);
  const [showAreaManager, setShowAreaManager] = useState(false);
  const [bookmarkingAreaId, setBookmarkingAreaId] = useState(null);
  const [areaSearch, setAreaSearch] = useState("");

  const [filterStatus, setFilterStatus]     = useState("");
  const [filterUrgency, setFilterUrgency]   = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterAreaId, setFilterAreaId]     = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [activeTab, setActiveTab] = useState("open");

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

  async function fetchBookmarks() {
    try {
      const res = await fetch("http://localhost:5000/api/bookmarks", { credentials: "include" });
      if (res.ok) {
        const data = await res.json().catch(() => []);
        if (Array.isArray(data)) {
          setBookmarkedAreaIds(data.map((b) => b.area_id));
        }
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const u = await res.json().catch(() => null);
          setUser(u);
          if (u?.role === "volunteer") {
            fetchBookmarks();
          }
        } else {
          setUser(false);
        }
      } catch {
        setUser(false);
      }
    })();
  }, []);

  useEffect(() => { fetchNeeds(); }, [fetchNeeds]);

  useEffect(() => {
    fetch("http://localhost:5000/api/areas", { credentials: "include" })
      .then((r) => r.json().catch(() => []))
      .then((d) => { if (Array.isArray(d)) setAreas(d); })
      .catch(() => {});
  }, []);

  async function handleToggleBookmark(areaId) {
    const isBookmarked = bookmarkedAreaIds.includes(areaId);
    setBookmarkingAreaId(areaId);
    try {
      if (isBookmarked) {
        const res = await fetch(`http://localhost:5000/api/bookmarks/${areaId}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (res.ok) {
          setBookmarkedAreaIds((prev) => prev.filter((id) => id !== areaId));
        }
      } else {
        const res = await fetch("http://localhost:5000/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ area_id: areaId }),
        });
        if (res.ok) {
          setBookmarkedAreaIds((prev) => [...prev, areaId]);
        }
      }
    } catch {
      // ignore
    } finally {
      setBookmarkingAreaId(null);
    }
  }

  const isVolunteer = user?.role === "volunteer";

  const displayedNeeds = (isVolunteer && myAreasOnly)
    ? needs.filter((n) => bookmarkedAreaIds.includes(n.area_id))
    : needs;

  const openNeeds      = displayedNeeds.filter((n) => n.status === "open");
  const claimedNeeds   = displayedNeeds.filter((n) => n.status === "claimed");
  const fulfilledNeeds = displayedNeeds.filter((n) => n.status === "fulfilled");

  const hasFilters = filterStatus || filterUrgency || filterCategory || filterAreaId || myAreasOnly;
  const selectCls = "w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/40 transition-all appearance-none";

  const tabs = [
    { key: "open",      label: "Open",      count: openNeeds.length,      ...COLUMN_STYLES.open },
    { key: "claimed",   label: "Claimed",   count: claimedNeeds.length,   ...COLUMN_STYLES.claimed },
    { key: "fulfilled", label: "Fulfilled", count: fulfilledNeeds.length, ...COLUMN_STYLES.fulfilled },
  ];

  const columnNeeds = { open: openNeeds, claimed: claimedNeeds, fulfilled: fulfilledNeeds };

  const filteredAreasForManager = areas.filter((a) =>
    a.area_name.toLowerCase().includes(areaSearch.toLowerCase()) ||
    (a.district && a.district.toLowerCase().includes(areaSearch.toLowerCase()))
  );

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-slate-50 mesh-bg">
      {/* ── Hero header ───────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white border-b border-slate-800 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Live Coordination Radar</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Disaster Needs Dashboard
              </h1>
              <p className="text-slate-300 text-sm mt-1 max-w-xl">
                Real-time situational feed of incoming requests, active volunteer responses, and verified supply deliveries.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {isVolunteer && (
                <button
                  onClick={() => setShowAreaManager(true)}
                  className="flex items-center gap-2 text-xs font-bold text-emerald-200 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 rounded-xl px-3.5 py-2.5 transition-all shadow-xs"
                >
                  <BookmarkCheck size={14} className="text-emerald-400" />
                  <span>My Areas ({bookmarkedAreaIds.length})</span>
                </button>
              )}
              {!isVolunteer && (
                <Link
                  href="/needs/new"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <PlusCircle size={15} />
                  <span>Post a Need</span>
                </Link>
              )}
              <button
                onClick={fetchNeeds}
                disabled={loading}
                className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2.5 transition-all disabled:opacity-50"
              >
                <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Stat pills */}
          <div className="mt-8 grid grid-cols-3 gap-3 max-w-2xl">
            {[
              { label: "Open Requests",      count: openNeeds.length,      bg: "bg-blue-950/70 border-blue-800/80 text-blue-300",    dot: "bg-blue-400"  },
              { label: "Claimed Missions",   count: claimedNeeds.length,   bg: "bg-amber-950/70 border-amber-800/80 text-amber-300", dot: "bg-amber-400" },
              { label: "Fulfilled Aid",      count: fulfilledNeeds.length, bg: "bg-emerald-950/70 border-emerald-800/80 text-emerald-300", dot: "bg-emerald-400" },
            ].map(({ label, count, bg, dot }) => (
              <div key={label} className={`flex items-center gap-3 ${bg} border rounded-2xl px-4 py-3 shadow-xs`}>
                <span className={`w-2.5 h-2.5 rounded-full ${dot} shrink-0`} />
                <div className="min-w-0">
                  <div className="text-xl font-black text-white leading-none">
                    {loading ? "—" : count}
                  </div>
                  <div className="text-[11px] font-medium text-slate-300 mt-0.5 truncate">
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters bar ───────────────────────────────────────── */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-13 flex-wrap gap-2 py-2 sm:py-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters((p) => !p)}
                className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${showFilters ? "text-emerald-700" : "text-slate-700 hover:text-slate-950"}`}
              >
                <Filter size={14} />
                <span>Filter Feed</span>
                {hasFilters && (
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-900 text-white text-[10px] font-bold">
                    {[filterStatus, filterUrgency, filterCategory, filterAreaId, myAreasOnly].filter(Boolean).length}
                  </span>
                )}
                <ChevronDown size={13} className={`transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`} />
              </button>

              {isVolunteer && (
                <button
                  onClick={() => setMyAreasOnly((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    myAreasOnly
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <BookmarkCheck size={13} />
                  <span>My Areas View</span>
                  {bookmarkedAreaIds.length > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${myAreasOnly ? "bg-emerald-800 text-emerald-100" : "bg-slate-200 text-slate-600"}`}>
                      {bookmarkedAreaIds.length}
                    </span>
                  )}
                </button>
              )}
            </div>

            {hasFilters && (
              <button
                onClick={() => {
                  setFilterStatus("");
                  setFilterUrgency("");
                  setFilterCategory("");
                  setFilterAreaId("");
                  setMyAreasOnly(false);
                }}
                className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
              >
                <X size={12} /> Clear all filters
              </button>
            )}
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="pb-4 pt-1 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100">
              <div className="relative">
                <select id="filter-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectCls}>
                  <option value="">All Statuses</option>
                  <option value="open">Open</option>
                  <option value="claimed">Claimed</option>
                  <option value="fulfilled">Fulfilled</option>
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="relative">
                <select id="filter-urgency" value={filterUrgency} onChange={(e) => setFilterUrgency(e.target.value)} className={selectCls}>
                  <option value="">All Urgencies</option>
                  <option value="critical">Critical Urgency</option>
                  <option value="high">High Urgency</option>
                  <option value="medium">Medium Urgency</option>
                  <option value="low">Low Urgency</option>
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="relative">
                <select id="filter-category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={selectCls}>
                  <option value="">All Categories</option>
                  <option value="food">Food &amp; Water</option>
                  <option value="medicine">Medicine &amp; First Aid</option>
                  <option value="shelter">Shelter &amp; Clothing</option>
                  <option value="rescue">Rescue &amp; Evac</option>
                  <option value="other">Other Essentials</option>
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="relative">
                <select id="filter-area" value={filterAreaId} onChange={(e) => setFilterAreaId(e.target.value)} className={selectCls}>
                  <option value="">All Designated Zones</option>
                  {areas.map((a) => (
                    <option key={a.area_id} value={a.area_id}>
                      {a.area_name}{a.district ? ` — (${a.district})` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown size={13} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {isVolunteer && myAreasOnly && bookmarkedAreaIds.length === 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-900 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2.5">
              <Bookmark className="text-amber-600 shrink-0" size={18} />
              <span>You have not bookmarked any operating areas yet.</span>
            </div>
            <button
              onClick={() => setShowAreaManager(true)}
              className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              Bookmark Operating Areas
            </button>
          </div>
        )}

        {/* ── Mobile: tab switcher ─────────────────────────────── */}
        <div className="md:hidden">
          <div className="flex bg-white rounded-2xl p-1 shadow-xs border border-slate-200/80 mb-5">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 flex flex-col items-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === t.key
                    ? t.tab_active + " border shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span className="text-base font-black leading-none mb-0.5">
                  {loading ? "—" : columnNeeds[t.key].length}
                </span>
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <ColumnSkeleton />
          ) : (
            <StatusColumn
              statusKey={activeTab}
              label={tabs.find((t) => t.key === activeTab)?.label}
              needs={columnNeeds[activeTab]}
              bookmarkedAreaIds={bookmarkedAreaIds}
              onCardClick={setSelectedNeed}
              isMyAreasActive={myAreasOnly}
              onManageAreas={() => setShowAreaManager(true)}
            />
          )}
        </div>

        {/* ── Desktop: 3 columns ───────────────────────────────── */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {loading ? (
            [0, 1, 2].map((i) => (
              <div key={i}>
                <div className="h-12 rounded-2xl bg-slate-200/70 animate-pulse mb-4" />
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
                bookmarkedAreaIds={bookmarkedAreaIds}
                onCardClick={setSelectedNeed}
                isMyAreasActive={myAreasOnly}
                onManageAreas={() => setShowAreaManager(true)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Operating Area Manager Modal ──────────────────────── */}
      {showAreaManager && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
          onClick={() => setShowAreaManager(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <BookmarkCheck size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Bookmark Operating Areas</h3>
                  <p className="text-xs text-slate-500">Save zones you operate in to filter custom dispatches.</p>
                </div>
              </div>
              <button
                onClick={() => setShowAreaManager(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Search zones or districts…"
              value={areaSearch}
              onChange={(e) => setAreaSearch(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 bg-slate-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-slate-900/20"
            />

            <div className="overflow-y-auto flex-1 space-y-2 pr-1">
              {filteredAreasForManager.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">No areas found.</p>
              ) : (
                filteredAreasForManager.map((a) => {
                  const isSaved = bookmarkedAreaIds.includes(a.area_id);
                  const isPending = bookmarkingAreaId === a.area_id;

                  return (
                    <div
                      key={a.area_id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{a.area_name}</p>
                        <p className="text-xs text-slate-400">{a.district || "Designated Sector"}</p>
                      </div>

                      <button
                        onClick={() => handleToggleBookmark(a.area_id)}
                        disabled={isPending}
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                          isSaved
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {isPending ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : isSaved ? (
                          <>
                            <Check size={13} className="text-emerald-600" />
                            <span>Bookmarked</span>
                          </>
                        ) : (
                          <>
                            <Bookmark size={13} />
                            <span>Bookmark</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {bookmarkedAreaIds.length} area{bookmarkedAreaIds.length !== 1 ? "s" : ""} saved
              </span>
              <button
                onClick={() => setShowAreaManager(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Need Detail Modal ──────────────────────────────────── */}
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
