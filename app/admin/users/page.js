"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert, ShieldCheck, Users, Search, RefreshCw,
  Loader2, AlertTriangle, CheckCircle2, UserX, UserCheck,
  ArrowRight, Flag, Mail, Calendar, User
} from "lucide-react";

export default function AdminUsersPage() {
  const [authStatus, setAuthStatus] = useState("checking"); // "checking" | "unauthorized" | "authorized"
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "active" | "suspended"
  const [processingId, setProcessingId] = useState(null);
  const [rowError, setRowError] = useState({});

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
        await fetchUsers();
      } catch (err) {
        setAuthStatus("unauthorized");
        setLoading(false);
      }
    }

    checkAuthAndLoad();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        credentials: "include",
      });

      if (res.status === 401 || res.status === 403) {
        setAuthStatus("unauthorized");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to load users list.");
        return;
      }

      const data = await res.json().catch(() => []);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(userId, currentStatus) {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    setProcessingId(userId);
    setRowError((prev) => ({ ...prev, [userId]: null }));

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ account_status: nextStatus }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Show the backend error message inline (e.g. self-suspension error 400)
        setRowError((prev) => ({
          ...prev,
          [userId]: data.error || `Failed to ${nextStatus === "suspended" ? "suspend" : "reactivate"} user.`,
        }));
        return;
      }

      // Update local state with new status
      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId ? { ...u, account_status: nextStatus } : u))
      );
    } catch (err) {
      setRowError((prev) => ({
        ...prev,
        [userId]: "Network error occurred while updating account status.",
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

  // Filter users based on search and status
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchQuery ||
      (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.role && u.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.account_type && u.account_type.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      u.account_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <span>Admin Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              User Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View all registered users and manage account access status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/reports"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200/90 shadow-xs hover:bg-slate-50 transition-colors"
            >
              <Flag size={14} className="text-rose-500" />
              <span>Reports Queue</span>
              <ArrowRight size={13} className="text-slate-400" />
            </Link>
            <button
              onClick={fetchUsers}
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

        {/* Filters and Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or role…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <span className="text-xs font-semibold text-slate-500 mr-1">Status:</span>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === "active"
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Active ({users.filter((u) => u.account_status === "active").length})
            </button>
            <button
              onClick={() => setStatusFilter("suspended")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === "suspended"
                  ? "bg-rose-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Suspended ({users.filter((u) => u.account_status === "suspended").length})
            </button>
          </div>
        </div>

        {/* Users Table / List */}
        <div className="mt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
              <p className="text-sm text-slate-500">Loading user accounts…</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-3xl border border-slate-200/80 shadow-xs text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                <Users size={24} className="text-slate-400" />
              </div>
              <h2 className="text-base font-bold text-slate-800">No users found</h2>
              <p className="text-xs text-slate-400 mt-1">
                {searchQuery || statusFilter !== "all"
                  ? "No accounts match your search filters."
                  : "There are no registered users on ReliefLink yet."}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-5">User</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Account Type</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Joined Date</th>
                      <th className="py-3.5 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {filteredUsers.map((u) => {
                      const isProcessing = processingId === u.user_id;
                      const isActive = u.account_status === "active";
                      const rowErrMsg = rowError[u.user_id];

                      return (
                        <tr key={u.user_id} className="hover:bg-slate-50/50 transition-colors">
                          {/* User Name & Email */}
                          <td className="py-4 px-5">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">
                                {u.name || `User #${u.user_id}`}
                              </span>
                              <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <Mail size={11} />
                                {u.email}
                              </span>
                              {rowErrMsg && (
                                <span className="text-xs font-semibold text-rose-600 mt-1.5 flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                  <AlertTriangle size={12} className="shrink-0" />
                                  {rowErrMsg}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Role */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                              u.role === "admin"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : u.role === "volunteer"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}>
                              {u.role || "user"}
                            </span>
                          </td>

                          {/* Account Type */}
                          <td className="py-4 px-4 whitespace-nowrap capitalize text-xs text-slate-600 font-medium">
                            {u.account_type || "individual"}
                          </td>

                          {/* Account Status Badge */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            {isActive ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                Suspended
                              </span>
                            )}
                          </td>

                          {/* Joined Date */}
                          <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                            {u.created_at ? (
                              new Date(u.created_at).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            ) : (
                              "—"
                            )}
                          </td>

                          {/* Action Button */}
                          <td className="py-4 px-5 whitespace-nowrap text-right">
                            {isActive ? (
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleToggleStatus(u.user_id, u.account_status)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50"
                              >
                                {isProcessing ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <UserX size={12} />
                                )}
                                <span>Suspend</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={isProcessing}
                                onClick={() => handleToggleStatus(u.user_id, u.account_status)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-50"
                              >
                                {isProcessing ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : (
                                  <UserCheck size={12} />
                                )}
                                <span>Reactivate</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
