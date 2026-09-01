"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ShieldCheck, User, LogOut, PlusCircle, Star,
  ChevronDown, Building2, HeartHandshake, LogIn, UserPlus,
  Compass, BarChart3, AlertTriangle, Check, Menu, X as XIcon,
  LayoutDashboard, Activity, Info, Users as UsersIcon,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [authData, setAuthData] = useState(null); // { user_id, role } or false
  const [profile, setProfile] = useState(null);   // full user object or null
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Fetch current user auth on mount & on route change
  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        credentials: "include",
      });
      if (res.ok) {
        const me = await res.json().catch(() => null);
        if (me && me.user_id) {
          setAuthData(me);
          // Fetch detailed profile for name, email, ratings
          try {
            const userRes = await fetch(`http://localhost:5000/api/users/${me.user_id}`, {
              credentials: "include",
            });
            if (userRes.ok) {
              const userData = await userRes.json().catch(() => null);
              setProfile(userData);
            }
          } catch {
            // Profile fetch optional fallback
          }
          setLoading(false);
          return;
        }
      }
      setAuthData(false);
      setProfile(null);
    } catch {
      setAuthData(false);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setAuthData(false);
      setProfile(null);
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  // Helper for initials
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const displayName = profile?.name || (authData?.user_id ? `User #${authData.user_id}` : "User");
  const displayEmail = profile?.email || "";
  const displayRole = profile?.role || authData?.role || "user";
  const userInitials = getInitials(displayName);

  const navLinkCls = (href) =>
    `text-sm font-semibold px-3.5 py-2 rounded-lg transition-all ${
      pathname === href
        ? "bg-emerald-50 text-emerald-700 font-bold"
        : "text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-slate-950 font-sans">
                Relief<span className="text-emerald-600">Link</span>
              </span>
            </div>
          </div>
        </Link>

        {/* Main Nav Links — Desktop only */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link href="/dashboard" className={navLinkCls("/dashboard")}>Browse Needs</Link>
          {authData?.role !== "volunteer" && (
            <Link href="/needs/new" className={navLinkCls("/needs/new")}>Post a Need</Link>
          )}
          {authData?.role !== "affected" && (
            <Link href="/organizations" className={navLinkCls("/organizations")}>Organizations</Link>
          )}
          <Link href="/impact" className={navLinkCls("/impact")}>Impact</Link>
          <Link href="/about" className={navLinkCls("/about")}>About</Link>

          {authData && authData.role === "admin" && (
            <div className="flex items-center gap-1 border-l border-slate-200 ml-1 pl-2">
              <Link href="/admin/reports" className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${pathname === "/admin/reports" ? "bg-amber-50 text-amber-700 font-bold" : "text-slate-700 hover:text-amber-700 hover:bg-amber-50/70"}`}>
                Reports Queue
              </Link>
              <Link href="/admin/users" className={`text-sm font-semibold px-3 py-1.5 rounded-lg transition-all ${pathname === "/admin/users" ? "bg-amber-50 text-amber-700 font-bold" : "text-slate-700 hover:text-amber-700 hover:bg-amber-50/70"}`}>
                Manage Users
              </Link>
            </div>
          )}
        </nav>

        {/* Auth / Avatar Section */}
        <div className="flex items-center gap-2">
          {loading ? (
            <div className="w-9 h-9 rounded-full bg-slate-100 animate-pulse" />
          ) : authData && authData.user_id ? (
            /* ─── Authenticated User Avatar Dropdown ─── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 p-1.5 rounded-2xl hover:bg-slate-100/80 transition-all border border-slate-200/80 shadow-xs group focus:outline-none focus:ring-2 focus:ring-slate-900/20"
                aria-label="User profile menu"
              >
                {/* Avatar circle */}
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-800 text-white flex items-center justify-center font-bold text-xs shadow-xs relative">
                  <span>{userInitials}</span>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>

                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[110px]">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium capitalize">
                    {displayRole}
                  </span>
                </div>

                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200/90 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* User info header */}
                  <div className="px-5 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 to-emerald-800 text-white flex items-center justify-center font-black text-sm shadow-sm">
                        {userInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {displayName}
                        </p>
                        {displayEmail && (
                          <p className="text-xs text-slate-400 truncate">
                            {displayEmail}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            displayRole === "volunteer"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : displayRole === "admin"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}>
                            {displayRole}
                          </span>
                          {profile?.average_rating && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              <Star size={10} className="fill-amber-400 text-amber-400" />
                              {profile.average_rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2 space-y-1">
                    <Link
                      href={`/users/${authData.user_id}`}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 transition-colors"
                    >
                      <User size={15} className="text-emerald-600" />
                      <div className="flex-1">
                        <span>View Full Profile</span>
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Stats, contributions &amp; ratings
                        </span>
                      </div>
                    </Link>

                    {authData?.role === "affected" && (
                      <Link
                        href="/needs/new"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 transition-colors"
                      >
                        <PlusCircle size={15} className="text-blue-600" />
                        <span>Post a Need</span>
                      </Link>
                    )}

                    {authData?.role !== "affected" && authData?.role !== "admin" && (
                      <Link
                        href="/organizations"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 transition-colors"
                      >
                        <Building2 size={15} className="text-purple-600" />
                        <span>Organizations</span>
                      </Link>
                    )}

                    {authData?.role === "admin" && (
                      <div className="pt-2 mt-1 border-t border-slate-100 space-y-1">
                        <p className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Admin Operations
                        </p>
                        <Link
                          href="/admin/reports"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-800 hover:bg-amber-50/70 transition-colors"
                        >
                          <AlertTriangle size={15} className="text-amber-600" />
                          <span>Reports Queue</span>
                        </Link>
                        <Link
                          href="/admin/users"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-800 hover:bg-amber-50/70 transition-colors"
                        >
                          <ShieldCheck size={15} className="text-amber-600" />
                          <span>User Management</span>
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Logout Button */}
                  <div className="p-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50/80 transition-colors disabled:opacity-50"
                    >
                      <LogOut size={15} />
                      <span>{loggingOut ? "Signing out…" : "Log Out"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ─── Unauthenticated Actions (Desktop) ─── */
            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-700 hover:text-slate-950 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all"
              >
                Register
              </Link>
            </div>
          )}

          {/* ─── Hamburger Button (Mobile/Tablet) ─── */}
          <div className="lg:hidden" ref={mobileMenuRef}>
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900/20"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <XIcon size={22} /> : <Menu size={22} />}
            </button>

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
              <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">

                  {/* Nav links */}
                  <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${pathname === "/dashboard" ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    <LayoutDashboard size={17} className="text-emerald-600" />
                    Browse Needs
                  </Link>

                  {authData?.role !== "volunteer" && (
                    <Link
                      href="/needs/new"
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${pathname === "/needs/new" ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      <PlusCircle size={17} className="text-blue-600" />
                      Post a Need
                    </Link>
                  )}

                  {authData?.role !== "affected" && authData !== false && (
                    <Link
                      href="/organizations"
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${pathname === "/organizations" ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      <Building2 size={17} className="text-purple-600" />
                      Organizations
                    </Link>
                  )}

                  <Link
                    href="/impact"
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${pathname === "/impact" ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    <Activity size={17} className="text-teal-600" />
                    Impact
                  </Link>

                  <Link
                    href="/about"
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${pathname === "/about" ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"}`}
                  >
                    <Info size={17} className="text-slate-500" />
                    About
                  </Link>

                  {authData && authData.role === "admin" && (
                    <>
                      <div className="border-t border-slate-100 my-1 pt-1">
                        <p className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Admin</p>
                      </div>
                      <Link
                        href="/admin/reports"
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <AlertTriangle size={17} className="text-amber-600" />
                        Reports Queue
                      </Link>
                      <Link
                        href="/admin/users"
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <UsersIcon size={17} className="text-amber-600" />
                        Manage Users
                      </Link>
                    </>
                  )}

                  {/* Auth actions in mobile menu */}
                  <div className="border-t border-slate-100 pt-3 mt-2 space-y-2">
                    {authData && authData.user_id ? (
                      <>
                        <Link
                          href={`/users/${authData.user_id}`}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User size={17} className="text-emerald-600" />
                          View Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          disabled={loggingOut}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
                        >
                          <LogOut size={17} />
                          {loggingOut ? "Signing out…" : "Log Out"}
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/login"
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          <LogIn size={17} />
                          Sign In
                        </Link>
                        <Link
                          href="/signup"
                          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
                        >
                          <UserPlus size={17} />
                          Register
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
