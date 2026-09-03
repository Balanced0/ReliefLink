"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, UserPlus, AlertCircle, Loader2, User, Users, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { apiPost } from "../../lib/api";

const PASSWORD_RULES = [
  { id: "length",   label: "At least 8 characters",              test: (p) => p.length >= 8 },
  { id: "upper",    label: "At least 1 uppercase letter (A–Z)",   test: (p) => /[A-Z]/.test(p) },
  { id: "number",   label: "At least 1 number (0–9)",             test: (p) => /[0-9]/.test(p) },
  { id: "special",  label: "At least 1 special character (!@#$…)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function validatePassword(password) {
  return PASSWORD_RULES.every((r) => r.test(password));
}

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("affected");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim() || !role) {
      setError("All fields are required.");
      return;
    }

    if (!validatePassword(password)) {
      setPasswordTouched(true);
      setError("Please satisfy all password requirements below.");
      return;
    }

    setLoading(true);
    try {
      await apiPost("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-[85vh] bg-slate-50 mesh-bg px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 sm:p-10 relative overflow-hidden">
        {/* Decorative subtle header glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-950">
              Relief<span className="text-emerald-600">Link</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Join the Network</h2>
          <p className="text-sm text-slate-500 mt-1">Connect, request emergency aid, or volunteer today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/90 border border-red-200 text-red-700 rounded-2xl text-sm flex items-start gap-2.5">
            <AlertCircle size={17} className="text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="name">
              Full Name or Alias
            </label>
            <input
              id="name"
              type="text"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/40 focus:bg-white transition-all text-sm"
              placeholder="e.g. Maria Chen / Sector Lead"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/40 focus:bg-white transition-all text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/40 focus:bg-white transition-all text-sm pr-11"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordTouched(true); }}
                onBlur={() => setPasswordTouched(true)}
                disabled={loading}
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-0.5"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Live password rule checklist */}
            {passwordTouched && (
              <ul className="mt-2.5 space-y-1.5 pl-0.5">
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test(password);
                  return (
                    <li key={rule.id} className={`flex items-center gap-2 text-xs font-medium transition-colors ${passed ? "text-emerald-600" : "text-slate-400"}`}>
                      {passed
                        ? <CheckCircle2 size={13} className="shrink-0 text-emerald-500" />
                        : <XCircle size={13} className="shrink-0 text-slate-300" />
                      }
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Primary Account Role
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`flex items-start gap-3 p-3.5 border rounded-2xl cursor-pointer transition-all ${
                  role === "affected"
                    ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/30 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="affected"
                  checked={role === "affected"}
                  onChange={() => setRole("affected")}
                  disabled={loading}
                  className="sr-only"
                />
                <div className={`p-2 rounded-xl shrink-0 ${role === "affected" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                  <User size={16} />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Affected Person</span>
                  <span className="text-xs text-slate-500 mt-0.5 block leading-tight">Post &amp; receive emergency aid</span>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 border rounded-2xl cursor-pointer transition-all ${
                  role === "volunteer"
                    ? "border-slate-900 bg-slate-900/5 ring-2 ring-slate-900/20 shadow-xs"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="volunteer"
                  checked={role === "volunteer"}
                  onChange={() => setRole("volunteer")}
                  disabled={loading}
                  className="sr-only"
                />
                <div className={`p-2 rounded-xl shrink-0 ${role === "volunteer" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}>
                  <HeartHandshake size={16} />
                </div>
                <div>
                  <span className="text-sm font-bold text-slate-900 block">Volunteer</span>
                  <span className="text-xs text-slate-500 mt-0.5 block leading-tight">Claim &amp; deliver relief needs</span>
                </div>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-slate-950 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 text-sm mt-3 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin text-slate-400" /> Creating Account…</>
            ) : (
              <><UserPlus size={16} /> Create Account</>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
