"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FileUp,
  FileText,
  Database,
  FileCheck2,
  Loader2,
  Sparkles,
  CheckCircle2,
  X,
  AlertCircle,
  UploadCloud,
} from "lucide-react";
import { PageTransition } from "../../components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function UploadScreen() {
  const router = useRouter();
  const params = useParams();
  const moduleName = params.module === "python" ? "Python" : "Power BI";
  const isPython = params.module === "python";

  const [files, setFiles] = useState({ pdf: null, dataset: null, response: null });
  const [errors, setErrors] = useState({ pdf: "", dataset: "", response: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [dragActive, setDragActive] = useState({});

  const processingTimerRef = useRef(null);
  const stepIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (processingTimerRef.current) clearTimeout(processingTimerRef.current);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, []);

  const validateFile = (type, file) => {
    if (type === "pdf" && file.type !== "application/pdf") {
      return "Invalid file type. Expected: PDF";
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Max size: ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    }
    return "";
  };

  const handleFileChange = useCallback((type, file) => {
    setErrors((prev) => ({ ...prev, [type]: "" }));
    if (!file) return;
    const error = validateFile(type, file);
    if (error) {
      setErrors((prev) => ({ ...prev, [type]: error }));
      return;
    }
    setFiles((prev) => ({ ...prev, [type]: file }));
  }, []);

  const removeFile = (type) => {
    setFiles((prev) => ({ ...prev, [type]: null }));
    setErrors((prev) => ({ ...prev, [type]: "" }));
  };

  const handleDrag = (type, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive((prev) => ({ ...prev, [type]: true }));
    } else if (e.type === "dragleave") {
      setDragActive((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (type, e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive((prev) => ({ ...prev, [type]: false }));
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(type, file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!files.pdf || !files.dataset || !files.response) {
      setErrors({
        pdf: !files.pdf ? "PDF document is required" : "",
        dataset: !files.dataset ? "Dataset file is required" : "",
        response: !files.response ? "Response file is required" : "",
      });
      return;
    }
    setIsProcessing(true);
    setActiveStep(0);
    let step = 0;
    stepIntervalRef.current = setInterval(() => {
      step++;
      setActiveStep(step);
      if (step >= processingSteps.length - 1) clearInterval(stepIntervalRef.current);
    }, 1200);
    processingTimerRef.current = setTimeout(() => {
      localStorage.setItem(
        "uploadSummary",
        JSON.stringify({
          module: params.module,
          files: {
            pdf: files.pdf.name,
            dataset: files.dataset.name,
            response: files.response.name,
          },
          timestamp: new Date().toISOString(),
        })
      );
      router.push(`/ai-data-analyst/result`);
    }, processingSteps.length * 1200 + 1000);
  };

  const cancelProcessing = () => {
    if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    if (processingTimerRef.current) clearTimeout(processingTimerRef.current);
    setIsProcessing(false);
    setActiveStep(0);
  };

  const processingSteps = [
    "Uploading secure files...",
    "Analyzing document semantics...",
    "Running data correlations...",
    "Generating final response...",
  ];

  const isFormValid = files.pdf && files.dataset && files.response;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <PageTransition className="relative min-h-[calc(100vh-4rem)] py-8 overflow-hidden">
      {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />

      <div className="w-full max-w-6xl mx-auto space-y-12 px-4 sm:px-6 relative z-10">
        {!isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6 text-center md:text-left pt-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 text-brand-400 text-sm font-medium border border-brand-500/20 shadow-[0_0_20px_rgba(20,184,166,0.15)] mb-2 backdrop-blur-sm"
            >
              <Sparkles size={16} className="animate-pulse" />
              {moduleName} Workspace
            </motion.div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Upload Materials
              </span>
            </h1>
            <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
              Provide the required files to begin the{" "}
              <span className="text-brand-400 font-semibold">{moduleName}</span>{" "}
              assessment process. Drop them anywhere in the boxes below.
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: "spring", duration: 0.7 }}
              className="rounded-[2.5rem] p-8 md:p-14 flex flex-col items-center justify-center min-h-[500px] bg-zinc-900/60 backdrop-blur-2xl border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -top-[20%] -right-[20%] w-[70%] h-[70%] bg-brand-500/30 rounded-full blur-[100px]"
                />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-[30%] -left-[10%] w-[60%] h-[60%] bg-amber-500/20 rounded-full blur-[100px]"
                />
              </div>

              <div className="relative z-10 flex flex-col items-center w-full">
                <div className="relative mb-12">
                  <motion.div
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full blur-2xl bg-brand-500/50"
                  />
                  <div className="relative bg-zinc-900/80 rounded-full p-8 border border-brand-500/40 shadow-[0_0_60px_rgba(20,184,166,0.4)] backdrop-blur-sm">
                    <Loader2 size={64} className="text-brand-400 animate-spin" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-12 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                  Processing materials...
                </h2>

                <div className="w-full max-w-md space-y-7 mb-12">
                  {processingSteps.map((step, index) => {
                    const isActive = activeStep === index;
                    const isCompleted = activeStep > index;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-5"
                      >
                        <div className="relative flex items-center justify-center">
                          {isActive && (
                            <motion.div
                              layoutId="activeStepGlow"
                              className="absolute inset-[-10px] bg-brand-500/40 rounded-full blur-md"
                            />
                          )}
                          <motion.div
                            animate={{
                              scale: isActive ? 1.2 : 1,
                              backgroundColor: isCompleted
                                ? "rgb(20, 184, 166)"
                                : isActive
                                ? "rgba(20, 184, 166, 0.2)"
                                : "rgb(39, 39, 42)",
                            }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 ${
                              isCompleted
                                ? "text-brand-950 shadow-[0_0_20px_rgba(20,184,166,0.6)]"
                                : isActive
                                ? "text-brand-400 border-2 border-brand-500/50"
                                : "text-zinc-600 border border-zinc-700"
                            }`}
                          >
                            {isCompleted ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                              >
                                <CheckCircle2 size={20} strokeWidth={3} />
                              </motion.div>
                            ) : isActive ? (
                              <motion.div
                                className="w-3 h-3 rounded-full bg-brand-400"
                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full bg-current" />
                            )}
                          </motion.div>
                        </div>
                        <motion.span
                          animate={{ scale: isActive ? 1.05 : 1, originX: 0 }}
                          className={`text-lg transition-colors duration-300 ${
                            isCompleted
                              ? "text-zinc-400"
                              : isActive
                              ? "text-white font-semibold drop-shadow-md"
                              : "text-zinc-600 font-medium"
                          }`}
                        >
                          {step}
                        </motion.span>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelProcessing}
                  className="px-8 py-3 rounded-full bg-zinc-800/60 font-medium text-sm text-zinc-300 hover:bg-red-500/10 hover:text-red-400 border border-zinc-700/50 hover:border-red-500/30 transition-all backdrop-blur-sm"
                >
                  Cancel Process
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="upload-form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  <motion.div variants={itemVariants}>
                    <FileUploadCard
                      type="pdf"
                      label="PDF Document"
                      description="Upload project brief or instructions"
                      accept=".pdf"
                      icon={FileText}
                      color="brand"
                      file={files.pdf}
                      error={errors.pdf}
                      dragActive={dragActive.pdf}
                      onFileChange={(file) => handleFileChange("pdf", file)}
                      onRemove={() => removeFile("pdf")}
                      onDrag={handleDrag}
                      onDrop={handleDrop}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <FileUploadCard
                      type="dataset"
                      label="Dataset File"
                      description={isPython ? "CSV or Excel data file" : "CSV/Excel for Power BI"}
                      accept=".csv,.xlsx,.xls"
                      icon={Database}
                      color={isPython ? "emerald" : "amber"}
                      file={files.dataset}
                      error={errors.dataset}
                      dragActive={dragActive.dataset}
                      onFileChange={(file) => handleFileChange("dataset", file)}
                      onRemove={() => removeFile("dataset")}
                      onDrag={handleDrag}
                      onDrop={handleDrop}
                    />
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <FileUploadCard
                      type="response"
                      label="Response File"
                      description="Expected output or answer key"
                      accept=""
                      icon={FileCheck2}
                      color="sky"
                      file={files.response}
                      error={errors.response}
                      dragActive={dragActive.response}
                      onFileChange={(file) => handleFileChange("response", file)}
                      onRemove={() => removeFile("response")}
                      onDrag={handleDrag}
                      onDrop={handleDrop}
                    />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {Object.values(errors).some((e) => e) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 flex items-start gap-4 shadow-[0_0_30px_rgba(239,68,68,0.1)] backdrop-blur-sm">
                        <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={24} />
                        <div className="text-base text-red-200">
                          <p className="font-semibold mb-2 text-red-300">Please fix the following issues:</p>
                          <ul className="list-disc list-inside space-y-1.5 text-red-200/90 ml-1">
                            {errors.pdf && <li><span className="font-medium">PDF:</span> {errors.pdf}</li>}
                            {errors.dataset && <li><span className="font-medium">Dataset:</span> {errors.dataset}</li>}
                            {errors.response && <li><span className="font-medium">Response:</span> {errors.response}</li>}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div variants={itemVariants} className="flex justify-end pt-4">
                  <motion.button
                    type="submit"
                    disabled={!isFormValid}
                    whileHover={isFormValid ? { scale: 1.03, boxShadow: "0 0 30px rgba(20,184,166,0.4)" } : {}}
                    whileTap={isFormValid ? { scale: 0.97 } : {}}
                    className={`
                      py-4 px-10 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all duration-300
                      ${isFormValid 
                        ? "bg-gradient-to-r from-brand-500 to-teal-500 text-brand-950 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)]" 
                        : "bg-zinc-800/60 text-zinc-500 cursor-not-allowed border border-zinc-700/50"}
                    `}
                  >
                    <FileUp size={24} className={isFormValid ? "animate-bounce" : ""} />
                    <span>Start Processing</span>
                    {isFormValid && (
                      <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        &rarr;
                      </motion.div>
                    )}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </PageTransition>
  );
}

// ------------------------------------------------------------
// Enhanced File Upload Card Component
// ------------------------------------------------------------
function FileUploadCard({
  type,
  label,
  description,
  accept,
  icon: Icon,
  color,
  file,
  error,
  dragActive,
  onFileChange,
  onRemove,
  onDrag,
  onDrop,
}) {
  const inputRef = useRef(null);

  const colorConfig = {
    brand: { border: "border-brand-500/50", bg: "bg-brand-500/20", text: "text-brand-400", glow: "shadow-[0_0_40px_rgba(20,184,166,0.2)]", dragGlow: "shadow-[0_0_60px_rgba(20,184,166,0.4)]" },
    emerald: { border: "border-emerald-500/50", bg: "bg-emerald-500/20", text: "text-emerald-400", glow: "shadow-[0_0_40px_rgba(16,185,129,0.2)]", dragGlow: "shadow-[0_0_60px_rgba(16,185,129,0.4)]" },
    amber: { border: "border-amber-500/50", bg: "bg-amber-500/20", text: "text-amber-400", glow: "shadow-[0_0_40px_rgba(245,158,11,0.2)]", dragGlow: "shadow-[0_0_60px_rgba(245,158,11,0.4)]" },
    sky: { border: "border-sky-500/50", bg: "bg-sky-500/20", text: "text-sky-400", glow: "shadow-[0_0_40px_rgba(14,165,233,0.2)]", dragGlow: "shadow-[0_0_60px_rgba(14,165,233,0.4)]" },
  };
  const styles = colorConfig[color];

  return (
    <div className="flex flex-col h-full">
      <motion.label
        whileHover={{ y: -8 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative rounded-[2rem] p-8 flex flex-col items-center justify-center gap-5 h-full min-h-[320px]
          cursor-pointer transition-all duration-300 bg-zinc-900/40 backdrop-blur-xl border-2
          ${dragActive ? `${styles.border} ${styles.dragGlow} scale-[1.02] bg-white/5` : "border-white/10"}
          ${file ? `${styles.border} ${styles.glow} bg-white/[0.02]` : "hover:bg-white/5 hover:border-white/20"}
          ${error ? "border-red-500/60 bg-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.15)]" : ""}
          group overflow-hidden
        `}
        onDragEnter={(e) => onDrag(type, e)}
        onDragLeave={(e) => onDrag(type, e)}
        onDragOver={(e) => onDrag(type, e)}
        onDrop={(e) => onDrop(type, e)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
      >
        {!file && (
          <div className={`absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-${color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
        )}
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={(e) => onFileChange(e.target.files?.[0])} />

        <AnimatePresence>
          {file && (
            <motion.button
              initial={{ opacity: 0, scale: 0, rotate: -90 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0, rotate: 90 }}
              type="button"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="absolute top-5 right-5 p-2 rounded-full bg-zinc-800/80 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-500/50 transition-all z-20 shadow-lg backdrop-blur-sm"
            >
              <X size={18} strokeWidth={2.5} />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.div
          animate={dragActive ? { y: -8, scale: 1.15 } : { y: 0, scale: 1 }}
          className={`p-6 rounded-3xl transition-all duration-300 relative z-10 ${
            file ? `${styles.bg} ${styles.text}` : "bg-zinc-800/40 text-zinc-400 group-hover:bg-zinc-800/60 group-hover:text-zinc-300"
          }`}
        >
          <Icon size={46} strokeWidth={file || dragActive ? 2 : 1.5} />
          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.6 }}
                className="absolute -bottom-2 -right-2 bg-zinc-900 rounded-full p-1 border-2 border-zinc-900"
              >
                <CheckCircle2 size={24} className={styles.text} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="text-center relative z-10 w-full px-3">
          <span className={`block font-bold mb-3 transition-colors tracking-wide ${file ? "text-white text-xl" : "text-zinc-200 text-xl group-hover:text-white"}`}>
            {file ? truncateFileName(file.name, 22) : label}
          </span>
          <div className="h-[40px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {file ? (
                <motion.div key="size" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles.bg} ${styles.text}`}>
                    {(file.size / 1024).toFixed(0)} KB
                  </span>
                </motion.div>
              ) : dragActive ? (
                <motion.span key="drag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className={`${styles.text} font-semibold text-base animate-pulse`}>
                  Drop file to upload!
                </motion.span>
              ) : (
                <motion.span key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-sm text-zinc-500 font-medium">
                  {description}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {!file && !dragActive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute bottom-6 flex items-center gap-2 text-sm font-medium text-zinc-500/80 group-hover:text-zinc-400">
            <UploadCloud size={16} />
            <span>Click or drag & drop</span>
          </motion.div>
        )}
      </motion.label>

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-sm text-red-400 mt-4 flex items-center justify-center gap-2 font-semibold">
            <AlertCircle size={16} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function truncateFileName(name, maxLength) {
  if (name.length <= maxLength) return name;
  const ext = name.split(".").pop();
  const base = name.substring(0, Math.max(0, maxLength - ext.length - 3));
  return `${base}...${ext}`;
}