"use client";

import { useState, useEffect } from "react";
import { Users, Plus, UserPlus, Building2, ChevronRight, Loader2 } from "lucide-react";

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [orgDesc, setOrgDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState("");

  const [joinState, setJoinState] = useState({});

  async function fetchOrgs() {
    setLoadingOrgs(true);
    setFetchError("");
    try {
      const res = await fetch("http://localhost:5000/api/organizations");
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFetchError(data.error || "Could not load organizations.");
        return;
      }
      const data = await res.json().catch(() => []);
      setOrgs(Array.isArray(data) ? data : []);
    } catch {
      setFetchError("Could not reach the server.");
    } finally {
      setLoadingOrgs(false);
    }
  }

  useEffect(() => {
    fetchOrgs();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!orgName.trim()) return;
    setCreating(true);
    setCreateError("");
    setCreateSuccess("");
    try {
      const res = await fetch("http://localhost:5000/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          org_name: orgName.trim(),
          ...(orgDesc.trim() ? { description: orgDesc.trim() } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setCreateError(data.error || "Could not create organization.");
      } else {
        setCreateSuccess(`Organization "${orgName.trim()}" created!`);
        setOrgName("");
        setOrgDesc("");
        setShowCreate(false);
        await fetchOrgs();
        setTimeout(() => setCreateSuccess(""), 4000);
      }
    } catch {
      setCreateError("Could not reach the server.");
    } finally {
      setCreating(false);
    }
  }

  async function handleJoin(orgId) {
    setJoinState((prev) => ({
      ...prev,
      [orgId]: { loading: true, msg: "", error: "" },
    }));
    try {
      const res = await fetch(
        `http://localhost:5000/api/organizations/${orgId}/join`,
        { method: "POST", credentials: "include" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setJoinState((prev) => ({
          ...prev,
          [orgId]: { loading: false, msg: "", error: data.error || "Could not send request." },
        }));
      } else {
        setJoinState((prev) => ({
          ...prev,
          [orgId]: { loading: false, msg: data.message || "Request sent!", error: "" },
        }));
      }
    } catch {
      setJoinState((prev) => ({
        ...prev,
        [orgId]: { loading: false, msg: "", error: "Could not reach the server." },
      }));
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Building2 size={18} className="text-emerald-700" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Organizations</h1>
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Browse volunteer groups and request to join one, or start your own.
              </p>
            </div>
            <button
              onClick={() => { setShowCreate((v) => !v); setCreateError(""); }}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all"
            >
              <Plus size={15} />
              Create Organization
            </button>
          </div>

          {showCreate && (
            <form
              onSubmit={handleCreate}
              className="mt-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3"
            >
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                <Plus size={14} /> New Organization
              </h2>
              <div className="space-y-2">
                <input
                  id="org-name"
                  type="text"
                  required
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  placeholder="Organization name *"
                  maxLength={100}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/40 placeholder-slate-400 transition-all"
                />
                <textarea
                  id="org-description"
                  value={orgDesc}
                  onChange={(e) => setOrgDesc(e.target.value)}
                  placeholder="Description (optional)"
                  maxLength={500}
                  rows={3}
                  className="w-full text-sm border border-slate-200 rounded-xl px-3.5 py-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/40 placeholder-slate-400 transition-all resize-none"
                />
              </div>
              {createError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {createError}
                </p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={creating || !orgName.trim()}
                  className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {creating ? (
                    <><Loader2 size={14} className="animate-spin" /> Creating…</>
                  ) : (
                    <><Plus size={14} /> Create</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowCreate(false); setCreateError(""); }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {createSuccess && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
              {createSuccess}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingOrgs && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-white border border-slate-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loadingOrgs && fetchError && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-sm">{fetchError}</p>
            <button
              onClick={fetchOrgs}
              className="mt-3 text-sm text-blue-700 hover:underline font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {!loadingOrgs && !fetchError && orgs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Users size={22} className="text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">No organizations yet.</p>
            <p className="text-sm text-slate-400 mt-1">Be the first to create one!</p>
          </div>
        )}

        {!loadingOrgs && !fetchError && orgs.length > 0 && (
          <div className="space-y-3">
            {orgs.map((org) => {
              const js = joinState[org.org_id] || {};
              return (
                <div
                  key={org.org_id}
                  className="group bg-white border border-slate-100 rounded-2xl p-5 flex items-start gap-4 hover:border-slate-200 hover:shadow-sm transition-all"
                >
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Building2 size={18} className="text-emerald-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h2 className="text-base font-semibold text-slate-900">
                        {org.org_name}
                      </h2>
                      <span className="text-xs text-slate-400">
                        by {org.owner_name || "Unknown"}
                      </span>
                    </div>
                    {org.description && (
                      <p className="text-sm text-slate-500 mt-0.5 line-clamp-2">
                        {org.description}
                      </p>
                    )}

                    {js.msg && (
                      <p className="text-xs text-emerald-600 mt-1.5 font-medium">{js.msg}</p>
                    )}
                    {js.error && (
                      <p className="text-xs text-red-500 mt-1.5">{js.error}</p>
                    )}
                  </div>

                  {!js.msg && (
                    <button
                      onClick={() => handleJoin(org.org_id)}
                      disabled={js.loading}
                      className="shrink-0 flex items-center gap-1.5 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                    >
                      {js.loading ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <UserPlus size={13} />
                      )}
                      {js.loading ? "Requesting…" : "Request to Join"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
