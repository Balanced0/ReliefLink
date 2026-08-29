"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Droplet, Pill, Home, LifeBuoy, Package,
  X, MapPin, User, Calendar, Layers, CheckCircle, LogIn,
  HandHeart,
} from "lucide-react";

const CATEGORY_META = {
  food:     { Icon: Droplet,  label: "Food & Water" },
  medicine: { Icon: Pill,     label: "Medicine & First Aid" },
  shelter:  { Icon: Home,     label: "Shelter & Clothing" },
  rescue:   { Icon: LifeBuoy, label: "Rescue & Evac" },
  other:    { Icon: Package,  label: "Other Essentials" },
};

const URGENCY_META = {
  critical: {
    dot: "bg-red-500",    text: "text-red-700",
    headerBg: "from-red-900 to-red-800",
    badge: "bg-red-500/20 text-red-200 ring-1 ring-red-400/30",
    label: "Critical",
  },
  high: {
    dot: "bg-orange-400", text: "text-orange-700",
    headerBg: "from-orange-900 to-orange-800",
    badge: "bg-orange-500/20 text-orange-200 ring-1 ring-orange-400/30",
    label: "High",
  },
  medium: {
    dot: "bg-blue-500",   text: "text-blue-700",
    headerBg: "from-blue-900 to-blue-800",
    badge: "bg-blue-500/20 text-blue-200 ring-1 ring-blue-400/30",
    label: "Medium",
  },
  low: {
    dot: "bg-gray-400",   text: "text-gray-500",
    headerBg: "from-slate-700 to-slate-600",
    badge: "bg-white/10 text-slate-300 ring-1 ring-white/20",
    label: "Low",
  },
};

const STATUS_META = {
  open:      { pill: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",    label: "Open" },
  claimed:   { pill: "bg-orange-100 text-orange-800 ring-1 ring-orange-200", label: "Claimed" },
  fulfilled: { pill: "bg-green-100 text-green-800 ring-1 ring-green-200",  label: "Fulfilled" },
};

function MetaChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
      <div className="shrink-0 w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-xs">
        <Icon size={15} className="text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{value}</p>
      </div>
    </div>
  );
}

const LS_KEY = "rl_my_claims";

function readClaims() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}" ); }
  catch { return {}; }
}
function saveClaim(needId, claimId) {
  const claims = readClaims();
  claims[needId] = claimId;
  localStorage.setItem(LS_KEY, JSON.stringify(claims));
}
function removeClaim(needId) {
  const claims = readClaims();
  delete claims[needId];
  localStorage.setItem(LS_KEY, JSON.stringify(claims));
}

export default function NeedDetailModal({ need, onClose, onActionSuccess }) {
  const [user, setUser]               = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [claimId, setClaimId]         = useState(() => readClaims()[need.need_id] ?? null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError]     = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", { credentials: "include" });
        setUser(res.ok ? await res.json().catch(() => null) : false);
      } catch {
        setUser(false);
      } finally {
        setAuthLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  async function handleClaim() {
    setActionError(""); setActionSuccess(""); setActionLoading(true);
    try {
      const res  = await fetch(`http://localhost:5000/api/needs/${need.need_id}/claim`, {
        method: "POST", credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setActionError(data.error || "Could not claim this need.");
      } else {
        setClaimId(data.claim_id);
        saveClaim(need.need_id, data.claim_id);
        setActionSuccess("You've claimed this need! You can mark it fulfilled any time.");
        if (onActionSuccess) onActionSuccess();
      }
    } catch {
      setActionError("Could not reach the server.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleFulfill() {
    setActionError(""); setActionSuccess(""); setActionLoading(true);
    try {
      const res  = await fetch(`http://localhost:5000/api/claims/${claimId}/fulfill`, {
        method: "PATCH", credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setActionError(data.error || "Could not mark as fulfilled.");
      } else {
        removeClaim(need.need_id);
        setActionSuccess("Marked as fulfilled — thank you for making a difference!");
        if (onActionSuccess) onActionSuccess();
      }
    } catch {
      setActionError("Could not reach the server.");
    } finally {
      setActionLoading(false);
    }
  }

  const u          = URGENCY_META[need.urgency] || URGENCY_META.low;
  const statusMeta = STATUS_META[need.status]   || { pill: "bg-gray-100 text-gray-600", label: need.status };
  const postedAt   = need.created_at
    ? new Date(need.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

  function renderAction() {
    if (authLoading) {
      return <div className="h-11 rounded-xl bg-gray-100 animate-pulse" />;
    }

    if (claimId !== null && !(actionSuccess && actionSuccess.includes("fulfilled"))) {
      return (
        <button
          onClick={handleFulfill}
          disabled={actionLoading}
          className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white rounded-xl py-3 font-semibold text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 disabled:opacity-50"
        >
          <CheckCircle size={16} />
          {actionLoading ? "Marking…" : "Mark as Fulfilled"}
        </button>
      );
    }

    if (need.status === "open") {
      if (user) {
        return (
          <button
            onClick={handleClaim}
            disabled={actionLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 active:bg-blue-950 text-white rounded-xl py-3 font-semibold text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 disabled:opacity-50"
          >
            <HandHeart size={16} />
            {actionLoading ? "Claiming…" : "Claim This Need"}
          </button>
        );
      }
      return (
        <div className="space-y-3">
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 bg-blue-900/40 text-white/70 rounded-xl py-3 font-semibold text-sm cursor-not-allowed"
          >
            <HandHeart size={16} />
            Claim This Need
          </button>
          <p className="text-center text-sm text-gray-500">
            <Link href="/login" className="inline-flex items-center gap-1 text-blue-900 font-semibold hover:underline">
              <LogIn size={13} /> Log in
            </Link>{" "}
            to claim this need
          </p>
        </div>
      );
    }

    if (need.status === "claimed") {
      return (
        <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0 animate-pulse" />
          <p className="text-sm text-orange-800 font-medium">A volunteer has already claimed this need.</p>
        </div>
      );
    }

    if (need.status === "fulfilled") {
      return (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <CheckCircle size={18} className="text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-800 font-medium">This need has been fulfilled. Thank you!</p>
        </div>
      );
    }

    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/50 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg bg-white sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden max-h-[95dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`bg-gradient-to-br ${u.headerBg} px-6 pt-5 pb-6 relative`}>
          <div className="sm:hidden w-10 h-1 bg-white/30 rounded-full mx-auto mb-4" />

          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${statusMeta.pill}`}>
              {statusMeta.label}
            </span>
            <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${u.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${u.dot}`} />
              {u.label} Urgency
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {(need.categories || []).map((cat) => {
              const meta = CATEGORY_META[cat];
              if (!meta) return null;
              const { Icon, label } = meta;
              return (
                <span
                  key={cat}
                  title={label}
                  className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/20"
                >
                  <Icon size={12} />
                  {label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-5">
            <p className="text-gray-800 text-sm leading-relaxed">
              {need.description}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <MetaChip icon={MapPin}   label="Area"      value={need.area_name || `Area ${need.area_id}`} />
              <MetaChip icon={User}     label="Posted by" value={need.poster_name || "Anonymous"} />
              {need.quantity && (
                <MetaChip icon={Layers} label="Quantity"  value={need.quantity} />
              )}
              {postedAt && (
                <MetaChip icon={Calendar} label="Posted on" value={postedAt} />
              )}
            </div>

            {actionError && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl text-sm">
                {actionError}
              </div>
            )}
            {actionSuccess && (
              <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-xl text-sm">
                {actionSuccess}
              </div>
            )}
          </div>

          <div className="px-6 pb-6 pt-2 mt-auto">
            {renderAction()}
          </div>
        </div>
      </div>
    </div>
  );
}
