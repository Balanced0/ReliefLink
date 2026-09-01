"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  User, Star, CheckCircle, MapPin, Calendar,
  Loader2, ArrowLeft, Layers, Building2, ShieldCheck,
  HeartHandshake, AlertTriangle, PlusCircle, CheckCircle2,
  Clock, HandHeart, Sparkles, Activity
} from "lucide-react";
import NeedDetailModal from "../../../components/NeedDetailModal";

const CATEGORY_LABELS = {
  food: "Food & Water",
  medicine: "Medicine & First Aid",
  shelter: "Shelter & Clothing",
  rescue: "Rescue & Evac",
  other: "Other Essentials",
};

const URGENCY_CONFIG = {
  critical: { label: "Critical", pill: "bg-red-50 text-red-700 border-red-200" },
  high:     { label: "High",     pill: "bg-orange-50 text-orange-700 border-orange-200" },
  medium:   { label: "Medium",   pill: "bg-blue-50 text-blue-700 border-blue-200" },
  low:      { label: "Low",      pill: "bg-slate-100 text-slate-700 border-slate-200" },
};

function StarDisplay({ value }) {
  const filled = Math.round(Number(value) || 0);
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={14}
          className={s <= filled ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"}
        />
      ))}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function UserProfilePage() {
  const { id } = useParams();

  const [profile, setProfile]               = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError]     = useState("");

  const [me, setMe] = useState(null);

  // For affected accounts: posted needs list
  const [userNeeds, setUserNeeds]           = useState([]);
  const [needsLoading, setNeedsLoading]     = useState(false);
  const [selectedNeed, setSelectedNeed]     = useState(null);

  async function fetchProfile() {
    setProfileLoading(true);
    setProfileError("");
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setProfileError(data.error || "Could not load profile.");
        return;
      }
      const data = await res.json();
      setProfile(data);

      // If this is an affected user, load their posted emergency requests
      if (data.role === "affected") {
        fetchUserNeeds(data.user_id);
      }
    } catch {
      setProfileError("Could not reach the server.");
    } finally {
      setProfileLoading(false);
    }
  }

  async function fetchUserNeeds(userId) {
    setNeedsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/needs");
      if (res.ok) {
        const allNeeds = await res.json().catch(() => []);
        const mine = Array.isArray(allNeeds) ? allNeeds.filter((n) => n.posted_by === Number(userId)) : [];
        setUserNeeds(mine);
      }
    } catch (err) {
      console.error("Could not fetch user needs:", err);
    } finally {
      setNeedsLoading(false);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, [id]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });
        setMe(res.ok ? await res.json().catch(() => null) : false);
      } catch {
        setMe(false);
      }
    })();
  }, []);

  const isOwnProfile = me && me.user_id === Number(id);

  if (profileLoading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh]">
        <Loader2 size={28} className="text-slate-400 animate-spin" />
        <p className="text-sm text-slate-400 mt-3">Loading profile…</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[60vh] px-4">
        <p className="text-slate-600 font-medium">{profileError}</p>
        <Link href="/" className="mt-4 text-sm text-blue-700 hover:underline">
          ← Back to home
        </Link>
      </div>
    );
  }

  if (!profile) return null;

  const isVolunteer = profile.role === "volunteer";
  const isAffected = profile.role === "affected";
  const isAdmin = profile.role === "admin";

  const avg = profile.average_rating ? Number(profile.average_rating).toFixed(1) : null;
  const ratings = profile.ratings || [];
  const contributions = profile.contributions || [];

  // Computed metrics for affected user
  const totalRequests = userNeeds.length;
  const fulfilledRequests = userNeeds.filter((n) => n.status === "fulfilled").length;
  const pendingRequests = totalRequests - fulfilledRequests;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Profile Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 mb-5 transition-colors"
          >
            <ArrowLeft size={13} /> Back
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                isVolunteer
                  ? "bg-gradient-to-br from-emerald-500 to-teal-700 text-white"
                  : isAffected
                  ? "bg-gradient-to-br from-blue-500 to-indigo-700 text-white"
                  : "bg-gradient-to-br from-amber-500 to-amber-700 text-white"
              }`}>
                {isVolunteer ? (
                  <HeartHandshake size={28} />
                ) : isAffected ? (
                  <User size={28} />
                ) : (
                  <ShieldCheck size={28} />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
                  {isOwnProfile && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      You
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    isVolunteer
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : isAffected
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}>
                    {isAffected ? "Community Member" : profile.role}
                  </span>
                  <span className="text-xs text-slate-400 capitalize">
                    {profile.account_type}
                  </span>
                </div>

                {/* Rating display ONLY for volunteers */}
                {isVolunteer && (
                  <div className="flex items-center gap-2 mt-1.5">
                    {avg ? (
                      <>
                        <StarDisplay value={avg} />
                        <span className="text-sm font-semibold text-slate-700">{avg}</span>
                        <span className="text-xs text-slate-400">
                          ({ratings.length} review{ratings.length !== 1 ? "s" : ""})
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No reviews yet</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* If affected user viewing own profile, show Post a Need CTA */}
            {isOwnProfile && isAffected && (
              <Link
                href="/needs/new"
                className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
              >
                <PlusCircle size={14} />
                <span>Broadcast New Need</span>
              </Link>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-400 pt-4 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              Joined {formatDate(profile.created_at)}
            </span>
            <span className={`px-2 py-0.5 rounded-full font-medium ${
              profile.account_status === "active"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}>
              Account: {profile.account_status}
            </span>
          </div>

          {profile.organizations && profile.organizations.length > 0 && (
            <div className="mt-3.5 flex items-center gap-2 text-xs text-slate-600 flex-wrap">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Building2 size={13} className="text-slate-400" />
                Member of:
              </span>
              {profile.organizations.map((org) => (
                <span
                  key={org.org_id}
                  className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                >
                  {org.org_name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ─── AFFECTED USER VIEW ─── */}
        {isAffected && (
          <div className="space-y-6">
            
            {/* Quick Stat Cards for Affected User */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs text-center">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Broadcasts</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{totalRequests}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs text-center">
                <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Needs Resolved</p>
                <p className="text-2xl font-black text-emerald-700 mt-1">{fulfilledRequests}</p>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs text-center">
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">In Progress</p>
                <p className="text-2xl font-black text-blue-700 mt-1">{pendingRequests}</p>
              </div>
            </div>

            {/* Emergency Broadcast History */}
            <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Emergency Broadcast History
                  </h2>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {totalRequests} {totalRequests === 1 ? "request" : "requests"}
                </span>
              </div>

              {needsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={22} className="animate-spin text-slate-400" />
                </div>
              ) : userNeeds.length === 0 ? (
                <div className="text-center py-10">
                  <HandHeart size={28} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-700">No relief requests broadcasted yet</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isOwnProfile
                      ? "When you broadcast an emergency need, it will appear here for tracking."
                      : "This community member has not posted any active requests."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 space-y-1">
                  {userNeeds.map((need) => {
                    const urgCfg = URGENCY_CONFIG[need.urgency] || URGENCY_CONFIG.low;
                    const isFulfilled = need.status === "fulfilled";
                    const isClaimed = need.status === "claimed";

                    return (
                      <div
                        key={need.need_id}
                        onClick={() => setSelectedNeed(need)}
                        className="pt-3 pb-3 first:pt-0 last:pb-0 hover:bg-slate-50/70 p-3 rounded-2xl transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${urgCfg.pill}`}>
                                {urgCfg.label} Urgency
                              </span>
                              {isFulfilled ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                  <CheckCircle2 size={10} /> Fulfilled
                                </span>
                              ) : isClaimed ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                                  Claimed {need.claimed_by_name ? `by ${need.claimed_by_name}` : ""}
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                  Open Request
                                </span>
                              )}
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <MapPin size={11} /> {need.area_name}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-slate-800 line-clamp-2">
                              {need.description}
                            </p>
                          </div>
                          <span className="text-[11px] text-slate-400 shrink-0">
                            {formatDate(need.created_at)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ─── VOLUNTEER VIEW ─── */}
        {isVolunteer && (
          <>
            <section>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Verified Reviews &amp; Feedback
              </h2>

              {ratings.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center">
                  <Star size={20} className="text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No peer reviews recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ratings.map((r) => (
                    <div
                      key={r.rating_id}
                      className="bg-white border border-slate-100 rounded-2xl p-4 flex gap-3"
                    >
                      <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <User size={14} className="text-slate-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-slate-800">
                            {r.rater_name || "Community Member"}
                          </span>
                          <StarDisplay value={r.stars} />
                        </div>
                        {r.comment && (
                          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                            {r.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Verified Deliveries &amp; Contribution History
              </h2>

              {contributions.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center">
                  <CheckCircle size={20} className="text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">No completed deliveries yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {contributions.map((c) => (
                    <div
                      key={c.contribution_id}
                      className="bg-white border border-slate-100 rounded-2xl p-4"
                    >
                      <p className="text-sm font-medium text-slate-800 leading-relaxed">
                        {c.description}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin size={11} /> {c.area_name || "Designated Area"}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Calendar size={11} /> Delivered {formatDate(c.fulfilled_at)}
                        </span>
                      </div>
                      {Array.isArray(c.categories) && c.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {c.categories.map((cat) => (
                            <span
                              key={cat}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500"
                            >
                              {CATEGORY_LABELS[cat] || cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* ─── ADMIN VIEW ─── */}
        {isAdmin && (
          <section className="bg-white border border-slate-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">Platform Administrator</h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              This account holds administrative clearance to oversee crisis reports, moderate community broadcasts, and manage platform safety.
            </p>
          </section>
        )}

      </div>

      {/* Need Detail Modal if user clicks on one of their requests */}
      {selectedNeed && (
        <NeedDetailModal
          need={selectedNeed}
          onClose={() => setSelectedNeed(null)}
          onClaimSuccess={() => fetchUserNeeds(profile.user_id)}
          onFulfillSuccess={() => fetchUserNeeds(profile.user_id)}
        />
      )}
    </div>
  );
}

