"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  User, Star, CheckCircle, MapPin, Calendar,
  Loader2, ArrowLeft, Layers,
} from "lucide-react";

const CATEGORY_LABELS = {
  food: "Food & Water",
  medicine: "Medicine & First Aid",
  shelter: "Shelter & Clothing",
  rescue: "Rescue & Evac",
  other: "Other Essentials",
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

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          aria-label={`${s} star${s !== 1 ? "s" : ""}`}
          className="focus:outline-none"
        >
          <Star
            size={22}
            className={
              s <= (hover || value)
                ? "text-amber-400 fill-amber-400"
                : "text-slate-300 fill-slate-300"
            }
          />
        </button>
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

  const [profile, setProfile]       = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError]     = useState("");

  const [me, setMe] = useState(null);

  const [stars, setStars]             = useState(0);
  const [comment, setComment]         = useState("");
  const [rateLoading, setRateLoading] = useState(false);
  const [rateError, setRateError]     = useState("");
  const [rateSuccess, setRateSuccess] = useState("");

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
    } catch {
      setProfileError("Could not reach the server.");
    } finally {
      setProfileLoading(false);
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

  async function handleRate(e) {
    e.preventDefault();
    if (!stars) return;
    setRateLoading(true);
    setRateError("");
    setRateSuccess("");
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ stars, ...(comment.trim() ? { comment: comment.trim() } : {}) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setRateError(data.error || "Could not submit rating.");
      } else {
        setRateSuccess("Rating submitted — thank you!");
        setStars(0);
        setComment("");
        await fetchProfile();
        setTimeout(() => setRateSuccess(""), 4000);
      }
    } catch {
      setRateError("Could not reach the server.");
    } finally {
      setRateLoading(false);
    }
  }

  const isOwnProfile = me && me.user_id === Number(id);
  const canRate = me && !isOwnProfile;

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

  const avg = profile.average_rating ? Number(profile.average_rating).toFixed(1) : null;
  const ratings = profile.ratings || [];
  const contributions = profile.contributions || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 mb-5 transition-colors"
          >
            <ArrowLeft size={13} /> Back
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shrink-0">
              <User size={28} className="text-slate-500" />
            </div>

            <div className="min-w-0">
              <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
              <p className="text-sm text-slate-400 capitalize mt-0.5">
                {profile.role} · {profile.account_type}
              </p>

              <div className="flex items-center gap-2 mt-1.5">
                {avg ? (
                  <>
                    <StarDisplay value={avg} />
                    <span className="text-sm font-semibold text-slate-700">{avg}</span>
                    <span className="text-xs text-slate-400">
                      ({ratings.length} rating{ratings.length !== 1 ? "s" : ""})
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 italic">No ratings yet</span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              Joined {formatDate(profile.created_at)}
            </span>
            <span className={`px-2 py-0.5 rounded-full font-medium ${
              profile.account_status === "active"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}>
              {profile.account_status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {canRate && (
          <section className="bg-white border border-slate-100 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-slate-800 mb-4">
              Rate this volunteer
            </h2>
            <form onSubmit={handleRate} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">
                  Stars <span className="text-red-400">*</span>
                </label>
                <StarPicker value={stars} onChange={setStars} />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">
                  Comment (optional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  maxLength={500}
                  placeholder="Share your experience…"
                  className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:bg-white placeholder-slate-400 transition-all resize-none"
                />
              </div>
              {rateError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {rateError}
                </p>
              )}
              {rateSuccess && (
                <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                  {rateSuccess}
                </p>
              )}
              <button
                type="submit"
                disabled={rateLoading || !stars}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {rateLoading ? (
                  <><Loader2 size={14} className="animate-spin" /> Submitting…</>
                ) : (
                  <>Submit Rating</>
                )}
              </button>
            </form>
          </section>
        )}

        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Ratings &amp; Reviews
          </h2>

          {ratings.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center">
              <Star size={20} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No reviews yet.</p>
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
                        {r.rater_name || "Anonymous"}
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
            Contribution History
          </h2>

          {contributions.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-6 text-center">
              <CheckCircle size={20} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No contributions yet.</p>
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
                      <MapPin size={11} /> {c.area_name || "Unknown area"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar size={11} /> Fulfilled {formatDate(c.fulfilled_at)}
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
      </div>
    </div>
  );
}
