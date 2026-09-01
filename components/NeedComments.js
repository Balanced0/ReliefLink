"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send, User } from "lucide-react";

export default function NeedComments({ needId, postedBy, claimedById }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState("");
  const [postSuccess, setPostSuccess] = useState("");

  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          credentials: "include",
        });
        setUser(res.ok ? await res.json().catch(() => null) : false);
      } catch {
        setUser(false);
      }
    })();
  }, []);

  async function fetchComments() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:5000/api/needs/${needId}/comments`,
        { credentials: "include" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Could not load updates.");
        return;
      }
      const data = await res.json().catch(() => ({ comments: [] }));
      setComments(data.comments || []);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchComments();
    } else if (user === false) {
      setLoading(false);
    }
  }, [user, needId]);

  async function handlePost(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    setPostError("");
    setPostSuccess("");
    try {
      const res = await fetch(
        `http://localhost:5000/api/needs/${needId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ content: content.trim() }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPostError(data.error || "Could not post update.");
      } else {
        setContent("");
        setPostSuccess("Update posted.");
        await fetchComments();
        setTimeout(() => setPostSuccess(""), 3000);
      }
    } catch {
      setPostError("Could not reach the server.");
    } finally {
      setPosting(false);
    }
  }

  function formatDate(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const isPoster = Boolean(user && Number(user.user_id) === Number(postedBy));
  const isClaimant = Boolean(user && claimedById && Number(user.user_id) === Number(claimedById));
  const canComment = isPoster || isClaimant;

  return (
    <div className="border-t border-gray-100 pt-4 mt-2">
      <div className="flex items-center gap-2 px-6 mb-3">
        <MessageCircle size={15} className="text-gray-400" />
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Updates &amp; Comments
        </h3>
      </div>

      <div className="px-6 space-y-3">
        {loading && (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-12 rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        )}

        {!loading && error && (
          <p className="text-xs text-gray-400 italic">{error}</p>
        )}

        {!loading && user === false && (
          <p className="text-xs text-gray-400 italic">
            Log in to see updates on this need.
          </p>
        )}

        {!loading && !error && user && comments.length === 0 && (
          <p className="text-xs text-gray-400 italic">
            No updates yet.
          </p>
        )}

        {!loading &&
          !error &&
          comments.map((c) => (
            <div
              key={c.comment_id}
              className="flex gap-2.5 bg-gray-50 rounded-xl p-3 border border-gray-100"
            >
              <div className="shrink-0 w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
                <User size={13} className="text-slate-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-gray-800">
                    {c.name || "User"}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {formatDate(c.created_at)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">
                  {c.content}
                </p>
              </div>
            </div>
          ))}

        {user && (
          canComment ? (
            <form onSubmit={handlePost} className="pt-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Add an update…"
                  maxLength={500}
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900/40 placeholder-gray-400 transition-all"
                />
                <button
                  type="submit"
                  disabled={posting || !content.trim()}
                  className="shrink-0 flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Send size={13} />
                  {posting ? "Posting…" : "Post"}
                </button>
              </div>
              {postError && (
                <p className="text-xs text-red-600 mt-1.5">{postError}</p>
              )}
              {postSuccess && (
                <p className="text-xs text-emerald-600 mt-1.5">{postSuccess}</p>
              )}
            </form>
          ) : (
            <p className="text-xs text-slate-400 italic bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-center">
              Updates are restricted to the person who posted this need and the assigned volunteer.
            </p>
          )
        )}
      </div>
    </div>
  );
}
