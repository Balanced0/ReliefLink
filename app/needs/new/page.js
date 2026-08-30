"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Droplet, Pill, Home, LifeBuoy, Package, 
  AlertTriangle, CheckCircle2, ArrowLeft, Loader2, Sparkles, Send
} from "lucide-react";
import { apiPost } from "../../../lib/api";

const CATEGORIES = [
  { value: "food",     label: "Food & Water",          Icon: Droplet,  color: "text-blue-600 bg-blue-50"  },
  { value: "medicine", label: "Medicine & First Aid",   Icon: Pill,     color: "text-rose-600 bg-rose-50"  },
  { value: "shelter",  label: "Shelter & Clothing",     Icon: Home,     color: "text-amber-600 bg-amber-50" },
  { value: "rescue",   label: "Rescue & Evac",          Icon: LifeBuoy, color: "text-emerald-600 bg-emerald-50" },
  { value: "other",    label: "Other Essentials",       Icon: Package,  color: "text-purple-600 bg-purple-50" },
];

const URGENCIES = [
  {
    value: "critical",
    label: "Critical",
    dot: "bg-red-500",
    activeClass: "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500/20 font-bold",
    inactiveClass: "border-slate-200 text-slate-600 bg-white hover:border-slate-300",
  },
  {
    value: "high",
    label: "High",
    dot: "bg-orange-500",
    activeClass: "border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20 font-bold",
    inactiveClass: "border-slate-200 text-slate-600 bg-white hover:border-slate-300",
  },
  {
    value: "medium",
    label: "Medium",
    dot: "bg-blue-500",
    activeClass: "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 font-bold",
    inactiveClass: "border-slate-200 text-slate-600 bg-white hover:border-slate-300",
  },
  {
    value: "low",
    label: "Low",
    dot: "bg-slate-400",
    activeClass: "border-slate-500 bg-slate-100 text-slate-800 ring-2 ring-slate-400/20 font-bold",
    inactiveClass: "border-slate-200 text-slate-600 bg-white hover:border-slate-300",
  },
];

export default function PostNeedPage() {
  const [categories, setCategories] = useState([]);
  const [areaId, setAreaId] = useState("");
  const [urgency, setUrgency] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  const [areas, setAreas] = useState([]);
  const [areasLoading, setAreasLoading] = useState(true);
  const [areasError, setAreasError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadAreas() {
      try {
        const res = await fetch("http://localhost:5000/api/areas", {
          credentials: "include",
        });
        const data = await res.json().catch(() => []);
        if (!res.ok) {
          setAreasError("Could not load areas. Please refresh the page.");
        } else {
          setAreas(data);
        }
      } catch {
        setAreasError("Could not reach the server. Please check your connection.");
      } finally {
        setAreasLoading(false);
      }
    }
    loadAreas();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (categories.length === 0) {
      setError("Please select at least one category.");
      return;
    }
    if (!urgency) {
      setError("Please select an urgency level.");
      return;
    }
    if (!areaId) {
      setError("Please select an area.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    setLoading(true);
    try {
      const body = {
        categories,
        area_id: Number(areaId),
        urgency,
        description: description.trim(),
      };
      if (quantity.trim()) {
        body.quantity = quantity.trim();
      }

      await apiPost("/needs", body);
      setSuccess(true);
      setCategories([]);
      setAreaId("");
      setUrgency("");
      setDescription("");
      setQuantity("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 bg-slate-50 mesh-bg min-h-screen px-4 py-12">
      <div className="w-full max-w-3xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Live Needs Feed
        </Link>

        <div className="mb-8 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-bold uppercase tracking-wider mb-2">
            <AlertTriangle size={13} />
            <span>Emergency Aid Intake</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Broadcast an Urgent Need
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Specify the supplies and location. Local volunteers and registered response teams will be alerted immediately.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-6 sm:p-10 relative overflow-hidden">
          {/* Header Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />

          {success && (
            <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm flex items-start gap-3 shadow-xs">
              <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Need Published Successfully!</p>
                <p className="text-xs text-emerald-700 mt-1">
                  Responders across your area have been notified. You can track volunteer claims on the dashboard.
                </p>
                <Link href="/dashboard" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline mt-2">
                  View on Live Feed →
                </Link>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm flex items-start gap-2.5">
              <AlertTriangle size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Categories */}
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Select Required Categories <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Select all that apply</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {CATEGORIES.map(({ value, label, Icon, color }) => {
                  const selected = categories.includes(value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setCategories((prev) =>
                          prev.includes(value)
                            ? prev.filter((c) => c !== value)
                            : [...prev, value]
                        )
                      }
                      className={`relative flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border transition-all h-28 focus:outline-none ${
                        selected
                          ? "border-2 border-emerald-600 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-600/20"
                          : "border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {selected && (
                        <span className="absolute top-2 right-2 w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center">
                          <CheckCircle2 size={12} className="text-white" />
                        </span>
                      )}
                      <div className={`p-2 rounded-xl ${color}`}>
                        <Icon size={22} />
                      </div>
                      <span
                        className={`text-xs font-bold text-center leading-tight ${
                          selected ? "text-emerald-950" : "text-slate-700"
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Urgency Level <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2.5">
                {URGENCIES.map((u) => (
                  <button
                    key={u.value}
                    type="button"
                    onClick={() => setUrgency(u.value)}
                    className={`rounded-xl border px-4 py-2.5 flex items-center gap-2 text-xs font-semibold transition-all focus:outline-none ${
                      urgency === u.value ? u.activeClass : u.inactiveClass
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${u.dot}`} />
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Area */}
            <div>
              <label
                htmlFor="area"
                className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2"
              >
                Affected Area / Sector <span className="text-rose-500">*</span>
              </label>
              {areasError ? (
                <p className="text-sm text-rose-600">{areasError}</p>
              ) : (
                <select
                  id="area"
                  value={areaId}
                  onChange={(e) => setAreaId(e.target.value)}
                  disabled={areasLoading || loading}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/40 text-sm disabled:opacity-60 transition-all font-medium"
                >
                  <option value="">
                    {areasLoading ? "Loading areas…" : "Select designated crisis zone"}
                  </option>
                  {areas.map((a) => (
                    <option key={a.area_id} value={a.area_id}>
                      {a.area_name}{a.district ? ` — (${a.district})` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2"
              >
                Detailed Request &amp; Location Notes <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe exact needs, conditions, landmark coordinates, number of people affected, or special requirements…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/40 text-sm resize-none disabled:opacity-60 transition-all"
              />
            </div>

            {/* Quantity */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2"
              >
                Estimated Quantity / Headcount{" "}
                <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                id="quantity"
                type="text"
                placeholder="e.g. 50 Meals, 10 Blankets, 4 Families, 100L Water"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                disabled={loading}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/40 text-sm disabled:opacity-60 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || areasLoading}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white rounded-xl py-4 font-bold text-sm shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin text-slate-400" /> Broadcasting Need…</>
              ) : (
                <><Send size={16} /> Broadcast Emergency Need</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
