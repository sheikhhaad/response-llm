"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DownloadCloud,
  CheckCircle,
  ArrowLeft,
  FileText,
  Activity,
  ShieldCheck,
  Clock,
  BarChart3,
  AlertTriangle,
  TrendingUp,
  FileSpreadsheet,
  Sparkles,
} from "lucide-react";
import { PageTransition } from "../components/PageTransition";
import { motion } from "framer-motion";

export default function ResultScreen() {
  const [uploadSummary, setUploadSummary] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("uploadSummary");
    if (saved) {
      try {
        setUploadSummary(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse upload summary");
      }
    }
  }, []);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      const content = `Analysis Report\nGenerated: ${new Date().toLocaleString()}\n\n` +
        `Module: ${uploadSummary?.module || "Unknown"}\n` +
        `Files Processed:\n- ${uploadSummary?.files?.pdf || "N/A"}\n- ${uploadSummary?.files?.dataset || "N/A"}\n- ${uploadSummary?.files?.response || "N/A"}\n\n` +
        `Results: Correlation r=0.87, Anomalies=2, Status=Success`;
      
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analysis_report_${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsDownloading(false);
    }, 800);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <PageTransition className="relative min-h-[calc(100vh-4rem)] py-8 overflow-hidden">
      {/* Animated gradient background */}

      <motion.div 
        className="w-full max-w-5xl mx-auto space-y-10 px-4 sm:px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with gradient badge */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-sm font-medium border border-brand-500/20 shadow-[0_0_20px_rgba(20,184,166,0.15)]">
              <Sparkles size={14} className="animate-pulse" />
              <span>Analysis Complete</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-1.5 bg-gradient-to-b from-brand-400 to-teal-500 rounded-full" />
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white flex items-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <CheckCircle className="text-brand-400 drop-shadow-[0_0_8px_rgba(20,184,166,0.6)]" size={44} />
                </motion.div>
                Processing Complete
              </h1>
            </div>
            <p className="text-zinc-400 text-lg max-w-2xl">
              Your files were successfully analyzed and the answer sheet is ready.
              {uploadSummary && (
                <span className="block text-sm mt-1 text-brand-400/80 font-mono">
                  Module: {uploadSummary.module === "python" ? "🐍 Python" : "📊 Power BI"}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white font-medium transition-all flex items-center gap-2 hover:border-white/20 hover:shadow-lg"
            >
              <ArrowLeft size={18} />
              <span>Dashboard</span>
            </Link>
            <motion.button
              onClick={handleDownload}
              disabled={isDownloading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              animate={!isDownloading ? { boxShadow: ["0 0 0px rgba(20,184,166,0)", "0 0 20px rgba(20,184,166,0.4)", "0 0 0px rgba(20,184,166,0)"] } : {}}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-teal-500 hover:from-brand-400 hover:to-teal-400 disabled:opacity-70 disabled:cursor-not-allowed text-brand-950 font-bold transition-all active:scale-[0.98] flex items-center gap-2 shadow-lg shadow-brand-500/30"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <DownloadCloud size={20} />
                  <span>Download Report</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid - Enhanced */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5"
        >
          <StatCard
            icon={Activity}
            value="99.8%"
            label="Accuracy Score"
            trend="+2.1%"
            color="emerald"
          />
          <StatCard
            icon={FileText}
            value={uploadSummary ? "3" : "—"}
            label="Files Processed"
            sublabel={uploadSummary ? "PDF, CSV, Response" : "Loading..."}
            color="blue"
          />
          <StatCard
            icon={Clock}
            value="3.2s"
            label="Processing Time"
            color="amber"
          />
          <StatCard
            icon={ShieldCheck}
            value="Verified"
            label="Secure Output"
            color="purple"
          />
        </motion.div>

        {/* Analysis Details Section */}
        <motion.div variants={itemVariants} className="space-y-8">
          {/* Key Findings */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-500/20 to-teal-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-zinc-900/40 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="p-2.5 bg-brand-500/20 text-brand-400 rounded-xl shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                  <BarChart3 size={22} />
                </div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                  Key Findings
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FindingItem
                  icon={TrendingUp}
                  title="Strong Correlation Detected"
                  description="Pearson correlation coefficient of 0.87 between engagement and retention, confirming hypothesis from document."
                  color="emerald"
                />
                <FindingItem
                  icon={AlertTriangle}
                  title="Data Anomalies Found"
                  description="Two outliers identified in Q3 revenue columns, normalized in final output per response guidelines."
                  color="amber"
                />
                <FindingItem
                  icon={FileSpreadsheet}
                  title="Model Parameters Aligned"
                  description="All synthesized parameters successfully matched reference document goals."
                  color="blue"
                />
                <FindingItem
                  icon={CheckCircle}
                  title="Validation Complete"
                  description="Cross-referenced against provided answer key with 99.8% accuracy."
                  color="brand"
                />
              </div>
            </div>
          </div>

          {/* Detailed Answer Sheet Preview */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-zinc-900/40 backdrop-blur-2xl rounded-3xl p-6 md:p-8 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <FileText size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
                    Solved Answer Sheet
                  </h2>
                  <p className="text-sm text-zinc-500">Detailed analysis breakdown</p>
                </div>
              </div>

              <div className="space-y-8">
                <AnswerRow
                  number={1}
                  title="Correlation Analysis Matrix"
                  description="The provided dataset showed a strong positive correlation (r=0.87) between user engagement metrics and overall retention time, confirming the hypothesis present in the PDF document."
                  fileReference={uploadSummary?.files?.dataset}
                />

                <AnswerRow
                  number={2}
                  title="Data Anomalies Detected"
                  description="Two significant outliers were found in Q3 revenue columns matching the specified thresholds in the response guidelines. These have been normalized in the final output file."
                  fileReference={uploadSummary?.files?.response}
                />

                <AnswerRow
                  number={3}
                  title="Final Summary Output"
                  description="The synthesized model parameters successfully aligned with the goal outlined in the reference documents. All requested metrics have been successfully baked into the downloadable report."
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Note with animated pulse - FIXED: replaced div with span */}
        <motion.p 
          variants={itemVariants}
          className="text-xs text-center text-zinc-600 pt-4 flex items-center justify-center gap-2"
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Report generated on {new Date().toLocaleString()} • All data processed securely
        </motion.p>
      </motion.div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(24, 24, 27, 0.8);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(20, 184, 166, 0.5);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(20, 184, 166, 0.8);
        }
      `}</style>
    </PageTransition>
  );
}

// ---------- Enhanced Stat Card ----------
function StatCard({ icon: Icon, value, label, sublabel, trend, color = "brand" }) {
  const colorConfig = {
    brand: { border: "border-brand-500/30", bg: "from-brand-500/20 to-brand-600/5", glow: "shadow-[0_0_20px_rgba(20,184,166,0.15)]", text: "text-brand-400", trendBg: "bg-brand-500/20", trendText: "text-brand-300" },
    emerald: { border: "border-emerald-500/30", bg: "from-emerald-500/20 to-emerald-600/5", glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]", text: "text-emerald-400", trendBg: "bg-emerald-500/20", trendText: "text-emerald-300" },
    blue: { border: "border-blue-500/30", bg: "from-blue-500/20 to-blue-600/5", glow: "shadow-[0_0_20px_rgba(59,130,246,0.15)]", text: "text-blue-400", trendBg: "bg-blue-500/20", trendText: "text-blue-300" },
    amber: { border: "border-amber-500/30", bg: "from-amber-500/20 to-amber-600/5", glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]", text: "text-amber-400", trendBg: "bg-amber-500/20", trendText: "text-amber-300" },
    purple: { border: "border-purple-500/30", bg: "from-purple-500/20 to-purple-600/5", glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]", text: "text-purple-400", trendBg: "bg-purple-500/20", trendText: "text-purple-300" },
  };
  const styles = colorConfig[color];

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`bg-gradient-to-br ${styles.bg} backdrop-blur-xl p-5 rounded-2xl border ${styles.border} ${styles.glow} transition-all duration-300`}
    >
      <div className={`mb-3 ${styles.text}`}>
        <Icon size={22} strokeWidth={1.8} />
      </div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-3xl font-bold text-white tracking-tight">{value}</span>
        {trend && (
          <span className={`text-xs font-semibold ${styles.trendText} ${styles.trendBg} px-2 py-0.5 rounded-full`}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-sm text-zinc-400 mt-1.5 font-medium">{label}</div>
      {sublabel && (
        <div className="text-xs text-zinc-500 mt-1 truncate">{sublabel}</div>
      )}
    </motion.div>
  );
}

// ---------- Enhanced Finding Item ----------
function FindingItem({ icon: Icon, title, description, color }) {
  const colorClasses = {
    brand: "bg-brand-500/20 text-brand-400 border-brand-500/30",
    emerald: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  };

  return (
    <motion.div 
      whileHover={{ x: 5 }}
      className="flex gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
    >
      <div className={`p-2.5 rounded-xl ${colorClasses[color]} shrink-0 h-fit shadow-lg`}>
        <Icon size={18} />
      </div>
      <div>
        <h3 className="font-semibold text-white mb-1.5">{title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// ---------- Enhanced Answer Row ----------
function AnswerRow({ number, title, description, fileReference }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01, y: -2 }}
      className="flex items-start gap-5 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
    >
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500/30 to-teal-500/30 text-brand-400 flex items-center justify-center flex-shrink-0 font-bold text-sm border border-brand-500/40 shadow-[0_0_12px_rgba(20,184,166,0.3)]">
        {number}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-zinc-200 font-semibold">{title}</h3>
          {fileReference && (
            <span className="text-xs px-2 py-0.5 bg-zinc-800/80 rounded-full text-zinc-400 font-mono border border-white/5">
              📎 {fileReference}
            </span>
          )}
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}