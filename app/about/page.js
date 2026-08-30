"use client";

import Link from "next/link";
import {
  ShieldCheck, HeartHandshake, Zap, Globe, Users,
  CheckCircle2, ArrowRight, Eye, Sparkles, Building2,
  Lock, Activity, ArrowUpRight, Award, Compass, MessageSquare
} from "lucide-react";

export default function AboutPage() {
  const PRINCIPLES = [
    {
      icon: Zap,
      title: "Speed Over Red Tape",
      desc: "In emergencies, hours turn into lives. ReliefLink enables affected individuals to broadcast verified needs in under 60 seconds with zero paperwork or gatekeeping.",
      badge: "Rapid Response"
    },
    {
      icon: Compass,
      title: "Hyper-Local Routing",
      desc: "Connecting survivors with responders in their immediate vicinity first, optimizing supply chains and drastically cutting delivery latency.",
      badge: "Geo-Targeted"
    },
    {
      icon: Eye,
      title: "Radical Transparency",
      desc: "Every claim, comment, and fulfillment is recorded in an open, verifiable impact audit trail with peer community ratings.",
      badge: "Open Audit"
    },
    {
      icon: ShieldCheck,
      title: "Safety & Human Dignity",
      desc: "Strict content moderation flags, community protection reports, and respectful communication channels safeguard vulnerable communities.",
      badge: "Protection First"
    }
  ];

  const ROLES = [
    {
      title: "Affected Individuals & Families",
      desc: "Can immediately post single or multi-category needs with specific urgency levels and track volunteer response in real-time.",
      action: "Post a Need",
      link: "/needs/new",
      color: "bg-rose-50 border-rose-200 text-rose-800"
    },
    {
      title: "Volunteer Responders",
      desc: "Browse local dispatches by urgency and sector, claim missions, provide live delivery updates, and build a verified contribution record.",
      action: "Join as Volunteer",
      link: "/signup",
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      title: "Relief Organizations & NGOs",
      desc: "Form organized response squads, approve member volunteers, coordinate bulk supply staging, and oversee regional impact summaries.",
      action: "Explore Organizations",
      link: "/organizations",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800"
    }
  ];

  return (
    <div className="flex flex-col flex-1 bg-slate-50 mesh-bg selection:bg-emerald-500 selection:text-white">
      {/* ─── Hero Header ────────────────────────────────────────── */}
      <section className="relative pt-14 pb-20 border-b border-slate-200/80 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>The ReliefLink Mission</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight">
            Decentralizing Disaster Aid to Save Lives Faster.
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            ReliefLink was born from a fundamental truth: during catastrophic events, community members and local volunteers are the true first responders. We provide the digital infrastructure to connect them with zero friction.
          </p>
        </div>
      </section>

      {/* ─── Mission & The Problem We Solve ─────────────────────── */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Why ReliefLink Exists</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Solving the Coordination Bottleneck in Crisis Zones
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              Traditional disaster logistics suffer from massive information gaps. Centralized agencies often take days to assess damage, while duplicate aid floods accessible areas and isolated shelters are left stranded without clean water, insulin, or thermal blankets.
            </p>
            <p className="text-slate-600 leading-relaxed text-base">
              ReliefLink bridges this divide by turning every phone into an emergency dispatch radar. Requests are categorized, prioritized by critical urgency, and routed immediately to nearby volunteers and relief teams.
            </p>
            <div className="pt-2 flex items-center gap-6">
              <div>
                <div className="text-3xl font-black text-slate-950">100%</div>
                <div className="text-xs text-slate-500 font-medium">Direct Peer Coordination</div>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <div className="text-3xl font-black text-slate-950">0 Days</div>
                <div className="text-xs text-slate-500 font-medium">Waiting for Bureaucracy</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-700/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>Our Vision</span>
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              A world where no disaster victim is left unheard, where help is delivered with precision and transparency, and where communities are empowered to recover with dignity and speed.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Open humanitarian coordination standard accessible to all.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Real-time accountability without corporate overhead.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>Seamless collaboration between ad-hoc volunteers and formal NGOs.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Core Guiding Principles ────────────────────────────── */}
      <section id="principles" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
              Our Core Principles
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              Every feature and line of code on ReliefLink is guided by four humanitarian commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRINCIPLES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-3xl p-8 border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Platform Architecture: How It Connects Everyone ────── */}
      <section id="how-it-works" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Designed for Every Stakeholder in a Crisis
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Tailored workflows for survivors, individual volunteers, and relief organizations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ROLES.map((role, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${role.color}`}>
                  Role {idx + 1}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {role.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {role.desc}
                </p>
              </div>

              <Link
                href={role.link}
                className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-3 px-4 rounded-xl transition-colors"
              >
                <span>{role.action}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Safety, Privacy, & Reporting Commitment ────────────── */}
      <section id="safety" className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
            <Lock size={22} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Security, Integrity, and Protection
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            We employ rate-limiting, account verification, peer review scoring, and inline community moderation flags to ensure bad actors cannot exploit relief supply channels.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Volunteer Peer Reviews
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Community Flagging & Takedowns
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Transparent Audit Trail
            </span>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ──────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
            Be Part of the Response Network
          </h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto">
            Whether you are on the ground delivering food and medicine or coordinating from afar, ReliefLink gives you the tools to act immediately.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <span>Browse Live Needs Feed</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/organizations"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold px-8 py-3.5 rounded-xl transition-all"
            >
              <span>Explore Organizations</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
