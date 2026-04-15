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
} from "lucide-react";
import { PageTransition } from "../components/PageTransition";
import { motion } from "framer-motion";

export default function ResultScreen() {
  const [uploadSummary, setUploadSummary] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Load upload summary from localStorage (set in UploadScreen)
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
    // Simulate download
    setTimeout(() => {
      // Create a dummy text file for demo
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <PageTransition className="py-8">
      <motion.div 
        className="w-full max-w-5xl mx-auto space-y-8 px-4 sm:px-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-gradient-to-b from-brand-400 to-brand-600 rounded-full" />
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                <CheckCircle className="text-brand-500" size={36} />
                Processing Complete
              </h1>
            </div>
            <p className="text-zinc-400">
              Your files were successfully analyzed and the answer sheet is ready.
              {uploadSummary && (
                <span className="block text-sm mt-1 text-zinc-500">
                  Module: {uploadSummary.module === "python" ? "Python" : "Power BI"}
                </span>
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-white font-medium transition-all flex items-center gap-2 hover:border-zinc-600"
            >
              <ArrowLeft size={18} />
              <span>Dashboard</span>
            </Link>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-400 disabled:opacity-70 disabled:cursor-not-allowed text-brand-950 font-bold transition-all active:scale-[0.98] flex items-center gap-2 shadow-lg shadow-brand-500/20"
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
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
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
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Key Findings */}
          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-zinc-800/80">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-brand-500/10 text-brand-400 rounded-xl">
                <BarChart3 size={22} />
              </div>
              <h2 className="text-xl font-bold text-white">Key Findings</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
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
              </div>
              <div className="space-y-4">
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
          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-zinc-800/80">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-800">
              <div className="p-2.5 bg-brand-500/10 text-brand-400 rounded-xl">
                <FileText size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Solved Answer Sheet</h2>
                <p className="text-sm text-zinc-500">Detailed analysis breakdown</p>
              </div>
            </div>

            <div className="space-y-6">
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
        </motion.div>

        {/* Footer Note */}
        <motion.p 
          variants={itemVariants}
          className="text-xs text-center text-zinc-600 pt-4"
        >
          Report generated on {new Date().toLocaleString()} • All data processed securely
        </motion.p>
      </motion.div>
    </PageTransition>
  );
}

// Reusable Stat Card Component
function StatCard({ icon: Icon, value, label, sublabel, trend, color = "brand" }) {
  const colorClasses = {
    brand: "from-brand-500/20 to-brand-600/5 border-brand-500/30",
    emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30",
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
    amber: "from-amber-500/20 to-amber-600/5 border-amber-500/30",
    purple: "from-purple-500/20 to-purple-600/5 border-purple-500/30",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm p-5 rounded-2xl border`}
    >
      <div className="text-zinc-400 mb-2">
        <Icon size={20} />
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {trend && (
          <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
            {trend}
          </span>
        )}
      </div>
      <div className="text-sm text-zinc-400 mt-1">{label}</div>
      {sublabel && (
        <div className="text-xs text-zinc-500 mt-0.5 truncate">{sublabel}</div>
      )}
    </motion.div>
  );
}

// Reusable Finding Item
function FindingItem({ icon: Icon, title, description, color }) {
  const colorClasses = {
    brand: "bg-brand-500/10 text-brand-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    blue: "bg-blue-500/10 text-blue-400",
    amber: "bg-amber-500/10 text-amber-400",
  };

  return (
    <div className="flex gap-4">
      <div className={`p-2.5 rounded-xl ${colorClasses[color]} shrink-0 h-fit`}>
        <Icon size={18} />
      </div>
      <div>
        <h3 className="font-medium text-white mb-1">{title}</h3>
        <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// Reusable Answer Row
function AnswerRow({ number, title, description, fileReference }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0 font-bold text-sm border border-brand-500/30">
        {number}
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-zinc-200 font-medium">{title}</h3>
          {fileReference && (
            <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded-full text-zinc-500">
              {fileReference}
            </span>
          )}
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}