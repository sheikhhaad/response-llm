"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  FileUp,
  FileText,
  Database,
  FileCheck2,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  X,
  AlertCircle,
  UploadCloud,
} from "lucide-react";
import { PageTransition } from "../../components/PageTransition";
import { motion, AnimatePresence } from "framer-motion";

// File size limit (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function UploadScreen() {
  const router = useRouter();
  const params = useParams();
  const moduleName = params.module === "python" ? "Python" : "Power BI";
  const isPython = params.module === "python";

  const [files, setFiles] = useState({
    pdf: null,
    dataset: null,
    response: null,
  });

  const [errors, setErrors] = useState({
    pdf: "",
    dataset: "",
    response: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [dragActive, setDragActive] = useState({});

  const processingTimerRef = useRef(null);
  const stepIntervalRef = useRef(null);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (processingTimerRef.current) clearTimeout(processingTimerRef.current);
      if (stepIntervalRef.current) clearInterval(stepIntervalRef.current);
    };
  }, []);

  // Validate file type and size
  const validateFile = (type, file) => {
    const validTypes = {
      pdf: ["application/pdf"],
      dataset: [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
      response: [], // any file
    };

    // Check type if specified
    if (validTypes[type].length > 0 && !validTypes[type].includes(file.type)) {
      return `Invalid file type. Expected: ${validTypes[type]
        .map((t) => t.split("/")[1])
        .join(", ")}`;
    }

    // Check size
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Max size: ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`;
    }

    return "";
  };

  const handleFileChange = useCallback((type, file) => {
    // Clear previous error
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

  // Drag & drop handlers
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
    if (file) {
      handleFileChange(type, file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Final validation
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

    // Simulate processing steps
    let step = 0;
    stepIntervalRef.current = setInterval(() => {
      step++;
      setActiveStep(step);
      if (step >= processingSteps.length - 1) {
        clearInterval(stepIntervalRef.current);
      }
    }, 800);

    // Navigate after all steps complete
    processingTimerRef.current = setTimeout(
      () => {
        // Store file info in localStorage or context (example)
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
          }),
        );
        router.push(`/result`);
      },
      processingSteps.length * 800 + 400,
    );
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

  return (
    <PageTransition className="py-8">
      <div className="w-full max-w-4xl mx-auto space-y-8 px-4 sm:px-6">
        {!isProcessing && (
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-sm font-medium mb-4">
              <Sparkles size={16} />
              {moduleName} Workspace
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Upload Materials
            </h1>
            <p className="text-zinc-400">
              Provide the required files to begin the {moduleName} assessment
              process.
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center min-h-[500px]
                         bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 shadow-xl"
            >
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full blur-xl bg-brand-500/30 animate-pulse" />
                <div className="relative bg-zinc-900 rounded-full p-6 border-2 border-brand-500/50 shadow-[0_0_40px_rgba(20,184,166,0.3)]">
                  <Loader2 size={48} className="text-brand-400 animate-spin" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-8">
                Processing your files
              </h2>

              <div className="w-full max-w-sm space-y-4 mb-8">
                {processingSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-500 ${
                        activeStep > index
                          ? "bg-brand-500 text-brand-950"
                          : activeStep === index
                            ? "bg-brand-500/20 text-brand-400 border border-brand-500/50"
                            : "bg-zinc-800 text-zinc-600"
                      }`}
                    >
                      {activeStep > index ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>
                    <span
                      className={`text-sm transition-colors duration-500 ${
                        activeStep >= index ? "text-zinc-200" : "text-zinc-600"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={cancelProcessing}
                className="text-sm text-zinc-500 hover:text-zinc-300 underline underline-offset-4 transition"
              >
                Cancel
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="upload-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* PDF Upload Card */}
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

                  {/* Dataset Upload Card */}
                  <FileUploadCard
                    type="dataset"
                    label="Dataset File"
                    description={
                      isPython
                        ? "CSV or Excel data file"
                        : "CSV/Excel for Power BI"
                    }
                    accept=".csv,.xlsx"
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

                  {/* Response Upload Card */}
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
                </div>

                {/* Error Summary */}
                {Object.values(errors).some((e) => e) && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle
                      className="text-red-400 shrink-0 mt-0.5"
                      size={18}
                    />
                    <div className="text-sm text-red-200">
                      <p className="font-medium mb-1">
                        Please fix the following errors:
                      </p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {errors.pdf && <li>PDF: {errors.pdf}</li>}
                        {errors.dataset && <li>Dataset: {errors.dataset}</li>}
                        {errors.response && (
                          <li>Response: {errors.response}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-6 border-t border-zinc-800">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className="py-3 px-8 bg-brand-500 hover:bg-brand-400 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed text-brand-950 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <FileUp size={18} />
                    <span>Process Files</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

// Reusable file upload card component
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

  const colorClasses = {
    brand: {
      border: "border-brand-500/50",
      bg: "bg-brand-500/20",
      text: "text-brand-400",
      shadow: "shadow-[0_0_15px_rgba(20,184,166,0.1)]",
    },
    emerald: {
      border: "border-emerald-500/50",
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      shadow: "shadow-[0_0_15px_rgba(16,185,129,0.1)]",
    },
    amber: {
      border: "border-amber-500/50",
      bg: "bg-amber-500/20",
      text: "text-amber-400",
      shadow: "shadow-[0_0_15px_rgba(245,158,11,0.1)]",
    },
    sky: {
      border: "border-sky-500/50",
      bg: "bg-sky-500/20",
      text: "text-sky-400",
      shadow: "shadow-[0_0_15px_rgba(14,165,233,0.1)]",
    },
  };

  const classes = colorClasses[color];

  return (
    <div className="flex flex-col">
      <label
        className={`
          relative rounded-2xl p-6 flex flex-col items-center justify-center gap-4 
          cursor-pointer transition-all bg-zinc-900/80 backdrop-blur-sm border
          ${dragActive ? `border-${color}-400 bg-${color}-500/10` : "border-zinc-800"}
          ${file ? `${classes.border} ${classes.shadow}` : "hover:bg-zinc-800/80 hover:border-zinc-700"}
          ${error ? "border-red-500/50" : ""}
        `}
        onDragEnter={(e) => onDrag(type, e)}
        onDragLeave={(e) => onDrag(type, e)}
        onDragOver={(e) => onDrag(type, e)}
        onDrop={(e) => onDrop(type, e)}
        role="button"
        aria-label={`Upload ${label}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0])}
        />

        {/* Remove button (shown only when file selected) */}
        {file && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
            aria-label="Remove file"
          >
            <X size={16} />
          </button>
        )}

        {/* Icon */}
        <div
          className={`p-4 rounded-xl transition-colors ${
            file ? classes.bg + " " + classes.text : "bg-zinc-800 text-zinc-400"
          } ${dragActive ? classes.bg + " " + classes.text : ""}`}
        >
          <Icon size={32} />
        </div>

        {/* Text content */}
        <div className="text-center">
          <span className="block font-medium text-white mb-1">
            {file ? truncateFileName(file.name, 20) : label}
          </span>
          <span className="text-xs text-zinc-500">
            {file
              ? `${(file.size / 1024).toFixed(0)} KB`
              : dragActive
                ? "Drop file here"
                : description}
          </span>
        </div>

        {/* Upload hint */}
        {!file && !dragActive && (
          <div className="flex items-center gap-1 text-xs text-zinc-600">
            <UploadCloud size={14} />
            <span>Click or drag & drop</span>
          </div>
        )}
      </label>

      {/* Inline error message */}
      {error && (
        <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

// Helper function
function truncateFileName(name, maxLength) {
  if (name.length <= maxLength) return name;
  const ext = name.split(".").pop();
  const base = name.substring(0, maxLength - ext.length - 3);
  return `${base}...${ext}`;
}
