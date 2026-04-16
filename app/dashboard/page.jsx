"use client";

import Link from "next/link";
import { Terminal, BarChart2, ArrowRight, Sparkles } from "lucide-react";
import { PageTransition } from "../components/PageTransition";

export default function DashboardScreen() {
  const modules = [
    {
      id: "python",
      name: "Python",
      description:
        "Upload your Python project scripts and datasets for intelligent analysis.",
      icon: Terminal,
      gradientFrom: "from-emerald-400",
      gradientTo: "to-teal-500",
      bgGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-emerald-500/20 to-teal-600/20",
      borderHover: "group-hover:border-emerald-500/40",
      shadowGlow: "group-hover:shadow-emerald-500/20",
    },
    {
      id: "power-bi",
      name: "Power BI",
      description:
        "Submit your Power BI reports and raw data for comprehensive insights.",
      icon: BarChart2,
      gradientFrom: "from-amber-400",
      gradientTo: "to-orange-500",
      bgGradient: "from-amber-500/10 via-orange-500/5 to-transparent",
      iconBg: "bg-gradient-to-br from-amber-500/20 to-orange-600/20",
      borderHover: "group-hover:border-amber-500/40",
      shadowGlow: "group-hover:shadow-amber-500/20",
    },
  ];

  return (
    <PageTransition className="relative min-h-screen pt-12 pb-8 overflow-hidden">
      {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />
        <div className="absolute top-0 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_0%,_transparent_50%)] animate-pulse-slow" />

      <div className="relative z-10 space-y-12 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with animated gradient text */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mx-auto mb-4">
            <Sparkles size={14} className="text-amber-400" />
            <span className="text-xs font-medium text-zinc-300 tracking-wide">
              Intelligent Analysis Ready
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
              Select a
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 bg-clip-text text-transparent animate-gradient">
              Processing Module
            </span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Choose your environment. Each module is purpose‑built to extract
            deep insights from your specific file types and datasets.
          </p>
        </div>

        {/* Cards Grid - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.id}
                href={`/upload/${mod.id}`}
                prefetch={true}
                aria-label={`Navigate to ${mod.name} upload page`}
                className="group block h-full focus:outline-none perspective-1000"
              >
                <div
                  className={`
                    relative h-full rounded-3xl p-8 flex flex-col justify-between
                    transition-all duration-500 ease-out
                    border border-white/10
                    bg-gradient-to-br ${mod.bgGradient}
                    backdrop-blur-md
                    ${mod.borderHover}
                    hover:scale-[1.02] hover:shadow-2xl ${mod.shadowGlow}
                    focus-within:scale-[1.02] focus-within:shadow-2xl
                    before:absolute before:inset-0 before:rounded-3xl before:p-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100
                    overflow-hidden
                  `}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                  {/* Card content */}
                  <div className="relative z-10 space-y-6">
                    {/* Icon with animated pulse on hover */}
                    <div
                      className={`inline-flex h-20 w-20 items-center justify-center rounded-2xl ${mod.iconBg} backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg`}
                    >
                      <Icon
                        size={36}
                        className={``}
                      />
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-3">
                      <h2
                        className={`text-3xl font-bold bg-gradient-to-r ${mod.gradientFrom} ${mod.gradientTo} bg-clip-text text-transparent group-hover:opacity-90 transition-opacity`}
                      >
                        {mod.name}
                      </h2>
                      <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  {/* Call to action with better animation */}
                  <div className="relative z-10 mt-12 flex items-center text-sm font-semibold text-zinc-400 group-hover:text-white transition-all duration-300">
                    <span>Launch Module</span>
                    <ArrowRight
                      size={18}
                      className="ml-2 transform group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300"
                    />
                  </div>

                  {/* Subtle bottom gradient line */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${mod.gradientFrom} ${mod.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-3xl`}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Enhanced footer note */}
        <div className="text-center pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-xs text-zinc-500">
              Your data is end‑to‑end encrypted • Never stored permanently
            </p>
          </div>
        </div>
      </div>

      {/* Add custom keyframes for animations */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </PageTransition>
  );
}