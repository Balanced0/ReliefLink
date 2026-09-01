"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck, Droplet, Pill, Home as HomeIcon, LifeBuoy, Package,
  ArrowRight, Users, HeartHandshake, MapPin, Sparkles, CheckCircle2,
  Clock, TrendingUp, Building2, Flame, AlertTriangle, ArrowUpRight,
  ExternalLink, ChevronRight, Activity, Layers
} from "lucide-react";


const CATEGORY_ITEMS = [
  {
    key: "food",
    label: "Food & Clean Water",
    desc: "MREs, bottled drinking water, emergency food kits & baby supplies.",
    Icon: Droplet,
    color: "from-blue-500/20 to-emerald-500/20",
    border: "hover:border-blue-500/50",
    iconBg: "bg-blue-500 text-white",
    badge: "bg-blue-50 text-blue-700 border-blue-200"
  },
  {
    key: "medicine",
    label: "Medicine & First Aid",
    desc: "Prescriptions, trauma dressings, insulin, dialysis kits & antiseptic.",
    Icon: Pill,
    color: "from-rose-500/20 to-red-500/20",
    border: "hover:border-rose-500/50",
    iconBg: "bg-rose-500 text-white",
    badge: "bg-rose-50 text-rose-700 border-rose-200"
  },
  {
    key: "shelter",
    label: "Shelter & Thermal Kits",
    desc: "Tents, tarps, dry blankets, thermal clothing & battery generators.",
    Icon: HomeIcon,
    color: "from-amber-500/20 to-yellow-500/20",
    border: "hover:border-amber-500/50",
    iconBg: "bg-amber-500 text-white",
    badge: "bg-amber-50 text-amber-700 border-amber-200"
  },
  {
    key: "rescue",
    label: "Rescue & Evacuation",
    desc: "Boat extraction, mobility transport, search & debris rescue.",
    Icon: LifeBuoy,
    color: "from-emerald-500/20 to-teal-500/20",
    border: "hover:border-emerald-500/50",
    iconBg: "bg-emerald-500 text-white",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    key: "other",
    label: "Special Logistics & Power",
    desc: "Fuel canisters, solar charging stations, satellite comms & infant care.",
    Icon: Package,
    color: "from-purple-500/20 to-indigo-500/20",
    border: "hover:border-purple-500/50",
    iconBg: "bg-purple-500 text-white",
    badge: "bg-purple-50 text-purple-700 border-purple-200"
  },
];

function formatTimeAgo(dateStr) {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (isNaN(diffSec) || diffSec < 60) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mins ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hrs ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function HomePage() {
  const [stats, setStats] = useState({ total_fulfilled: 0, active_volunteers: 0 });
  const [liveNeeds, setLiveNeeds] = useState([]);
  const [loadingNeeds, setLoadingNeeds] = useState(true);

  useEffect(() => {
    // Attempt to load general stats if available
    async function loadStats() {
      try {
        const res = await fetch("http://localhost:5000/api/stats/impact", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data) {
            setStats({
              total_fulfilled: data.total_fulfilled || 42,
              active_volunteers: data.most_active_volunteers?.length || 15
            });
          }
        }
      } catch {
        // Fallback default numbers
      }
    }

    async function loadLiveNeeds() {
      try {
        const res = await fetch("http://localhost:5000/api/needs?status=open");
        if (res.ok) {
          const data = await res.json().catch(() => []);
          setLiveNeeds(Array.isArray(data) ? data.slice(0, 3) : []);
        }
      } catch {
        setLiveNeeds([]);
      } finally {
        setLoadingNeeds(false);
      }
    }

    loadStats();
    loadLiveNeeds();
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-slate-50 mesh-bg selection:bg-emerald-500 selection:text-white">
      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden min-h-screen">
        {/* Decorative background glow spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-emerald-400/20 via-teal-300/15 to-blue-400/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 shadow-xs border border-emerald-200/80 text-slate-800 text-xs font-semibold backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">Real-Time Aid Routing</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
              Connecting Immediate Help to Those Who{" "}
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                Need It Most.
              </span>
            </h1>

            {/* Sub-Headline */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              ReliefLink is an open, hyper-local disaster coordination platform across Bangladesh. Post urgent requests, claim relief missions, and mobilize volunteer organizations instantly.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-slate-950 hover:bg-slate-800 text-white font-semibold px-7 py-3.5 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
              >
                <span>Browse Active Needs</span>
                <ArrowRight size={18} className="text-emerald-400" />
              </Link>
              <Link
                href="/needs/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 border border-slate-200/90 font-semibold px-7 py-3.5 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98]"
              >
                <AlertTriangle size={17} className="text-amber-500" />
                <span>Request Urgent Assistance</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Live Mission Feed Preview ────────────────────────────── */}
      <section className="py-14 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
                <Activity size={14} />
                <span>Live Coordination Radar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Current Priority Dispatches
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Real-time snapshot of active relief requests triage across affected sectors.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              <span>Explore Live Dashboard</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loadingNeeds ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 h-48 animate-pulse"
                />
              ))}
            </div>
          ) : liveNeeds.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <p className="text-slate-500 text-sm font-medium">No open needs currently awaiting dispatch.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {liveNeeds.map((need) => (
                <div
                  key={need.need_id}
                  className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        need.urgency === "critical"
                          ? "bg-red-100 text-red-700 border border-red-200"
                          : need.urgency === "high"
                          ? "bg-orange-100 text-orange-700 border border-orange-200"
                          : need.urgency === "medium"
                          ? "bg-blue-100 text-blue-700 border border-blue-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}>
                        {need.urgency || "Normal"} Urgency
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock size={11} /> {formatTimeAgo(need.created_at)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 line-clamp-2 mb-2">
                      {need.description}
                    </h3>

                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                      <MapPin size={12} className="text-slate-400 shrink-0" />
                      <span className="truncate">{need.area_name || (need.area_id ? `Area ${need.area_id}` : "Unknown Area")}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      need.status === "open"
                        ? "bg-blue-100 text-blue-800"
                        : need.status === "claimed"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      Status: {need.status ? need.status.charAt(0).toUpperCase() + need.status.slice(1) : "Open"}
                    </span>
                    <Link
                      href="/dashboard"
                      className="text-xs font-bold text-slate-900 hover:text-emerald-600 flex items-center gap-1"
                    >
                      <span>View</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Relief Categories ────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 mb-3">
            <Package size={13} /> Categorized Aid Flow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Targeted Support for Every Crisis Need
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            ReliefLink routes supplies with precision, ensuring resources match specific medical, food, and rescue requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORY_ITEMS.map((cat) => {
            const Icon = cat.Icon;
            return (
              <div
                key={cat.key}
                className={`bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${cat.border}`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${cat.iconBg} flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon size={22} strokeWidth={2.3} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {cat.label}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="/dashboard"
                    className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>Browse {cat.label.split(" ")[0]} Needs</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })}

          {/* Quick Action Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-7 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/30">
                <Layers size={22} className="text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Need Custom Triage?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Publish a multi-category emergency report to broadcast your exact headcount and requirements to all nearby teams.
              </p>
            </div>
            <div className="pt-6">
              <Link
                href="/needs/new"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                <AlertTriangle size={15} />
                <span>Submit Emergency Need</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works (3 Steps) ───────────────────────────────── */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              How ReliefLink Operates in Disasters
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              A clear, verified 3-step workflow designed for rapid response during chaos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative bg-slate-50 rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col">
              <div className="text-5xl font-black text-slate-200 mb-4">01</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Post Urgent Needs
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Affected communities or coordinators specify supplies, headcount, geo-tagged area, and urgency level in seconds without complex paperwork.
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
                  Instant Public Broadcast
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-slate-50 rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col">
              <div className="text-5xl font-black text-slate-200 mb-4">02</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Claim & Coordinate
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Individual volunteers and registered organizations claim specific needs, staging resources and preventing duplicate deliveries.
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-xs font-semibold text-blue-700 bg-blue-100/70 px-3 py-1 rounded-full">
                  Live Status Locking
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-slate-50 rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col">
              <div className="text-5xl font-black text-slate-200 mb-4">03</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Deliver & Confirm Impact
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Once delivered, mark as fulfilled with direct feedback, volunteer ratings, and verifiable impact logs visible platform-wide.
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-xs font-semibold text-purple-700 bg-purple-100/70 px-3 py-1 rounded-full">
                  Verified Audit Trail
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Organization Network & Collaboration ─────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          {/* Glow backdrop */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
              <Building2 size={13} />
              <span>For Relief Organizations & NGOs</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Unite Teams. Scale Your Disaster Impact.
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Create and manage volunteer organizations on ReliefLink. Dispatch group operations, review member requests, coordinate staging warehouses, and publish transparent fulfillment records.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/organizations"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-95"
              >
                <Building2 size={16} />
                <span>Explore Organizations</span>
              </Link>
              <Link
                href="/impact"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-xl transition-all"
              >
                <TrendingUp size={16} />
                <span>View Impact Data</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final Community CTA ──────────────────────────────────── */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Ready to Help Save Lives in Your Community?
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto leading-relaxed">
            Join hundreds of active local volunteers, rescue teams, and relief organizers making a verifiable difference every day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <HeartHandshake size={18} className="text-emerald-400" />
              <span>Register as a Volunteer</span>
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold px-8 py-3.5 rounded-xl transition-all"
            >
              <span>Learn About Our Mission</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
