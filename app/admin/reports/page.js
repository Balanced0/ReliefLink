"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert, AlertTriangle, Eye, EyeOff, CheckCircle2,
  Loader2, RefreshCw, Flag, MapPin, User, ArrowRight, ShieldCheck, Users
} from "lucide-react";

export default function AdminReportsPage() {
  const [authStatus, setAuthStatus] = useState("checking"); // "checking" | "unauthorized" | "authorized"
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [actionError, setActionError] = useState({});

  useEffect(() => {
    async function checkAuthAndLoad() {
      try {
        const authRes = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });

        if (!authRes.ok) {
          setAuthStatus("unauthorized");
          setLoading(false);
          return;
        }

        const authUser = await authRes.json().catch(() => null);
        if (!authUser || authUser.role !== "admin") {
          setAuthStatus("unauthorized");
          setLoading(false);
          return;
        }

        setAuthStatus("authorized");
        await fetchReports();
      } catch (err) {
        setAuthStatus("unauthorized");
        setLoading(false);
      }
    }

    checkAuthAndLoad();
  }, []);

  async function fetchReports() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/admin/reports", {
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        setAuthStatus("unauthorized");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to load flagged reports.");
        return;
      }

      const data = await res.json().catch(() => []);
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleModerate(needId, isHidden) {
    setProcessingId(needId);
    setActionError((prev) => ({ ...prev, [needId]: null }));

    try {
      const res = await fetch(`http://localhost:5000/api/admin/needs/${needId}/moderate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ is_hidden: isHidden }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setActionError((prev) => ({
          ...prev,
          [needId]: data.error || "Failed to update need moderation status.",
        }));
        return;
      }

      // Moderation resolves open reports, so remove it from current list
      setReports((prev) => prev.filter((item) => item.need_id !== needId));
    } catch (err) {
      setActionError((prev) => ({
        ...prev,
        [needId]: "Network error occurred while moderating need.",
      }));
    } finally {
      setProcessingId(null);
    }
  }

  if (authStatus === "checking") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
        <p className="text-sm font-medium">Verifying administrator access…</p>
      </div>
    );
  }

  if (authStatus === "unauthorized") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-[65vh] px-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 shadow-xs">
          <ShieldAlert size={28} className="text-rose-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-1">Not Authorized</h1>
        <p className="text-sm text-slate-500 mb-6 text-center max-w-sm">
          You do not have permission to view this page. This area is restricted to ReliefLink administrators only.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Back to Feed
          </Link>
          <Link
            href="/login"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Sign In with Different Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Navigation Breadcrumb / Tabs */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <span>Admin Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Reported Needs Queue
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Review flagged content and take moderation actions to ensure community safety.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200/90 shadow-xs hover:bg-slate-50 transition-colors"
            >
              <Users size={14} />
              <span>Manage Users</span>
              <ArrowRight size={13} className="text-slate-400" />
            </Link>
            <button
              onClick={fetchReports}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200/90 shadow-xs hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
            <AlertTriangle size={18} className="shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="mt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
              <p className="text-sm text-slate-500">Loading flagged reports…</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mb-3">
                <CheckCircle2 size={26} className="text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">All clear!</h2>
              <p className="text-sm text-slate-500 max-w-sm mt-1">
                There are no open reports or hidden needs requiring moderation at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Showing <strong>{reports.length}</strong> flagged/hidden {reports.length === 1 ? "need" : "needs"}</span>
              </div>

              {reports.map((item) => {
                const isProcessing = processingId === item.need_id;
                const reportsList = Array.isArray(item.reports) ? item.reports : [];

                return (
                  <div
                    key={item.need_id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
                  >
                    {/* Need Top Bar */}
                    <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Need #{item.need_id}
                        </span>

                        {/* Visibility Status Badge */}
                        {item.is_hidden ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <EyeOff size={13} />
                            Currently Hidden
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Eye size={13} />
                            Reported &amp; Visible in Feed
                          </span>
                        )}

                        {/* Urgency Badge */}
                        {item.urgency && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                            item.urgency === "critical" || item.urgency === "high"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : item.urgency === "medium"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}>
                            {item.urgency} urgency
                          </span>
                        )}
                      </div>

                      {/* Poster and Area info */}
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        {item.poster_name && (
                          <span className="flex items-center gap-1">
                            <User size={13} className="text-slate-400" />
                            Poster: <strong className="text-slate-700 font-semibold">{item.poster_name}</strong>
                          </span>
                        )}
                        {item.area_name && (
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-slate-400" />
                            <strong className="text-slate-700 font-semibold">{item.area_name}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Need Description */}
                    <div className="p-5 sm:p-6">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Need Content
                      </h3>
                      <p className="text-base text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium whitespace-pre-wrap">
                        {item.description || "(No description provided)"}
                      </p>

                      {/* Reports Breakdown Section */}
                      <div className="mt-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Flag size={14} className="text-rose-500" />
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Reports Filed ({reportsList.length})
                          </h4>
                        </div>

                        {reportsList.length === 0 ? (
                          <p className="text-xs text-slate-400 italic">
                            No individual report records attached (flagged manually or via direct hide).
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {reportsList.map((rep, idx) => (
                              <div
                                key={rep.report_id || idx}
                                className="bg-amber-50/50 border border-amber-200/70 p-3.5 rounded-2xl"
                              >
                                <div className="flex items-center justify-between gap-2 mb-1.5">
                                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                    Reason: {rep.reason || "Unspecified"}
                                  </span>
                                  {rep.created_at && (
                                    <span className="text-[11px] text-slate-400">
                                      {new Date(rep.created_at).toLocaleDateString(undefined, {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-600 flex items-center gap-1">
                                  <span>Reported by:</span>
                                  <strong className="text-slate-800 font-semibold">
                                    {rep.reporter_name || "Anonymous User"}
                                  </strong>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Error if any */}
                      {actionError[item.need_id] && (
                        <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                          <AlertTriangle size={14} className="shrink-0" />
                          <span>{actionError[item.need_id]}</span>
                        </div>
                      )}
                    </div>

                    {/* Moderation Actions Footer */}
                    <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3">
                      <span className="text-xs text-slate-400 mr-auto">
                        Moderation will resolve all pending reports for this need.
                      </span>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleModerate(item.need_id, true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <EyeOff size={13} />}
                        <span>Keep Hidden</span>
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleModerate(item.need_id, false)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-sm transition-colors disabled:opacity-50"
                      >
                        {isProcessing ? <Loader2 size={13} className="animate-spin" /> : <Eye size={13} />}
                        <span>Restore to Feed</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
