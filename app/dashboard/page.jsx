"use client";

import Link from "next/link";
import { Terminal, BarChart2, ArrowRight } from "lucide-react";
import { PageTransition } from "../components/PageTransition";

export default function DashboardScreen() {
  const modules = [
    {
      id: "python",
      name: "Python",
      description:
        "Upload your Python project scripts and datasets for intelligent analysis.",
      icon: Terminal,
      color: "from-emerald-500/20 to-teal-900/20",
      iconColor: "text-emerald-400",
      borderColor: "group-hover:border-emerald-500/50",
    },
    {
      id: "power-bi",
      name: "Power BI",
      description:
        "Submit your Power BI reports and raw data for comprehensive insights.",
      icon: BarChart2,
      color: "from-amber-500/20 to-orange-900/20",
      iconColor: "text-amber-400",
      borderColor: "group-hover:border-amber-500/50",
    },
  ];

  return (
    <PageTransition className="pt-12 pb-8">
      <div className="space-y-12 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Select a Module
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl md:mx-0 mx-auto">
            Choose the environment you want to work in. Each module is tailored
            to process specific file types and datasets.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {modules.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.id}
                href={`/upload/${mod.id}`}
                prefetch={true}
                aria-label={`Navigate to ${mod.name} upload page`}
                className="group block h-full focus:outline-none"
              >
                <div
                  className={`
                    h-full rounded-3xl p-8 flex flex-col justify-between
                    transition-all duration-300
                    border border-transparent
                    bg-zinc-900/80 backdrop-blur-sm
                    ${mod.borderColor}
                    hover:bg-zinc-800/90 hover:shadow-2xl hover:-translate-y-1
                    focus-within:bg-zinc-800/90 focus-within:shadow-2xl focus-within:-translate-y-1
                    focus-within:border-opacity-50
                  `}
                  // Fallback if glass-card is missing – you can keep glass-card if defined globally
                >
                  <div className="space-y-6">
                    {/* Icon */}
                    <div
                      className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${mod.color}`}
                    >
                      <Icon size={32} className={mod.iconColor} />
                    </div>

                    {/* Title & Description */}
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold text-white group-hover:text-brand-300 transition-colors">
                        {mod.name}
                      </h2>
                      <p className="text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                        {mod.description}
                      </p>
                    </div>
                  </div>

                  {/* Call to action */}
                  <div
                    className="mt-12 flex items-center text-sm font-semibold text-zinc-500 group-hover:text-brand-400 transition-colors"
                    aria-hidden="true"
                  >
                    <span>Continue to Upload</span>
                    <ArrowRight
                      size={18}
                      className="ml-2 transform group-hover:translate-x-2 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Optional: Subtle footer note */}
        <p className="text-xs text-center text-zinc-600 pt-4">
          Your data is processed securely and never stored permanently.
        </p>
      </div>
    </PageTransition>
  );
}
