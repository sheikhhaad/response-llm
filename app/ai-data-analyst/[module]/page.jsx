"use client";

import { useState, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Loader2,
  X,
  FileText,
  Table2,
  FileCode,
  CloudUpload,
  CheckCircle2,
  ArrowRight,
  Download,
  AlertCircle,
  BrainCircuit,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/app/utils/api";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function UploadScreen() {
  const params = useParams();

  const isPython = params.module === "python";
  const moduleName = isPython ? "Python" : "Power BI";

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

  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const backendApi = api.defaults.baseURL?.split("/api").join("");
  const stepIntervalRef = useRef(null);

  const processingSteps = [
    { label: "Uploading files...", icon: CloudUpload },
    { label: "Analyzing PDF content...", icon: FileText },
    { label: "Processing dataset...", icon: Table2 },
    { label: "Generating insights...", icon: BrainCircuit },
  ];

  const ALLOWED_DATASET_TYPES = new Set([
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "application/x-ipynb+json",
    "application/octet-stream",
    "application/vnd.ms-powerbi",
    "text/x-python",
    "text/plain"
  ]);

  const ALLOWED_EXTENSIONS = {
    pdf: [".pdf"],
    dataset: [".csv", ".xlsx", ".xls"],
    response: isPython
      ? [".ipynb", ".py"]
      : [".pbix"],
  };

  const validateFile = (type, file) => {
    if (!file) return "No file selected";

    if (file.size > MAX_FILE_SIZE) {
      return "File too large (max 10MB)";
    }

    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf("."));

    if (type === "pdf") {
      if (file.type !== "application/pdf" && fileExtension !== ".pdf") {
        return "Only PDF allowed";
      }
      return "";
    }

    if (type === "dataset" || type === "response") {
      const allowedExts = ALLOWED_EXTENSIONS[type];
      const isAllowedType = ALLOWED_DATASET_TYPES.has(file.type);
      const isAllowedExt = allowedExts.includes(fileExtension);

      if (!isAllowedType && !isAllowedExt) {
        return `Only ${allowedExts
          .join(", ")
          .toUpperCase()
          .replace(/\./g, "")} files allowed`;
      }

      return "";
    }

    return "Invalid file type";
  };

  const handleFileChange = useCallback((type, file) => {
    if (!file) return;

    const error = validateFile(type, file);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [type]: error,
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      [type]: "",
    }));

    setFiles((prev) => ({
      ...prev,
      [type]: file,
    }));
  }, []);

  const removeFile = (type) => {
    setFiles((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!files.pdf || !files.dataset || !files.response) {
      setErrors({
        pdf: !files.pdf ? "PDF required" : "",
        dataset: !files.dataset ? "Dataset required" : "",
        response: !files.response ? "Response required" : "",
      });
      return;
    }

    setIsProcessing(true);
    setActiveStep(0);

    stepIntervalRef.current = setInterval(() => {
      setActiveStep((prev) =>
        prev < processingSteps.length - 1 ? prev + 1 : prev,
      );
    }, 1500);

    try {
      const formData = new FormData();

      formData.append("pdf", files.pdf);
      formData.append("dataset", files.dataset);
      formData.append("response_file", files.response);

      const endpoint = isPython
        ? "/solved-assignment/process-python"
        : "/solved-assignment/process-powerbi";

      const res = await api.post(endpoint, formData);
      console.log(res.data);
      if (res.data.success) {
        setResult(res.data);
        setShowModal(true);
      }
    } catch (err) {
      console.log(err.response?.data || err.message);

      setErrors({
        pdf: "",
        dataset: "",
        response:
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Processing failed",
      });
      setIsProcessing(false);
    } finally {
      clearInterval(stepIntervalRef.current);
      if (!result) setIsProcessing(false);
    }
  };

  const isFormValid = files.pdf && files.dataset && files.response;

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center relative overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        {!isProcessing ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center space-y-2 mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-16 h-16 bg-teal-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-teal-500/30"
              >
                <Sparkles className="text-teal-400 w-8 h-8" />
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                {moduleName} AI Analyst
              </h1>
              <p className="text-zinc-400 text-lg">
                Upload your files and let AI handle the heavy lifting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FileBox
                label="Case Study / PDF"
                subLabel="Upload assignment details"
                icon={FileText}
                accept=".pdf"
                file={files.pdf}
                error={errors.pdf}
                onChange={(f) => handleFileChange("pdf", f)}
                onRemove={() => removeFile("pdf")}
              />

              <FileBox
                label="Dataset"
                subLabel="Upload CSV/XLSX file"
                icon={Table2}
                accept=".csv,.xlsx,.xls"
                file={files.dataset}
                error={errors.dataset}
                onChange={(f) => handleFileChange("dataset", f)}
                onRemove={() => removeFile("dataset")}
              />

              <FileBox
                label={isPython ? "Python Notebook / Script" : "Power BI File"}
                subLabel={isPython ? "Upload .ipynb or .py" : "Upload .pbix response"}
                icon={FileCode}
                accept={isPython ? ".ipynb,.py" : ".pbix"}
                file={files.response}
                error={errors.response}
                onChange={(f) => handleFileChange("response", f)}
                onRemove={() => removeFile("response")}
              />
            </div>

            <div className="flex justify-center pt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!isFormValid}
                className={`
                  relative group px-10 py-4 rounded-2xl font-semibold text-lg transition-all
                  ${isFormValid
                    ? "bg-teal-600 text-white shadow-[0_0_20px_rgba(13,148,136,0.3)] hover:shadow-[0_0_30px_rgba(13,148,136,0.5)]"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  Generate Response
                  <ArrowRight
                    className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${!isFormValid && "opacity-0"}`}
                  />
                </span>
              </motion.button>
            </div>
          </form>
        ) : (
          <ProcessingState
            steps={processingSteps}
            activeStep={activeStep}
            onCancel={() => setIsProcessing(false)}
          />
        )}
      </motion.div>

      {/* Result Modal */}
      <AnimatePresence>
        {showModal && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card p-8 rounded-3xl max-w-lg w-full space-y-6 border border-white/10"
            >
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="text-green-500 w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">Analysis Complete!</h2>
                <p className="text-zinc-400">
                  {result.questions_processed !== undefined
                    ? `Processed ${result.questions_processed} questions successfully.`
                    : result.visuals_generated !== undefined
                      ? `Generated ${result.visuals_generated} visuals successfully.`
                      : "Processed successfully."}
                </p>
              </div>

              <div className="space-y-3">
                {result?.download_urls && Object.entries(result.download_urls).map(([key, url]) => {
                  if (!url) return null;

                  let label = "Download File";
                  let IconComponent = FileText;
                  let colorClass = "bg-teal-500/20 text-teal-400";

                  if (key === "notebook") {
                    label = "Download Notebook";
                    IconComponent = FileCode;
                    colorClass = "bg-teal-500/20 text-teal-400";
                  } else if (key === "powerbi_response") {
                    label = "Download Power BI File";
                    IconComponent = Table2;
                    colorClass = "bg-amber-500/20 text-amber-400";
                  } else if (key === "summary") {
                    label = "Download Summary";
                    IconComponent = FileText;
                    colorClass = "bg-blue-500/20 text-blue-400";
                  } else if (key === "python_response") {
                    label = "Download Python Response";
                    IconComponent = FileCode;
                    colorClass = "bg-teal-500/20 text-teal-400";
                  }

                  return (
                    <a
                      key={key}
                      href={`${backendApi}${url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 ${colorClass} rounded-lg`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span>{label}</span>
                      </div>
                      <Download className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                    </a>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  setIsProcessing(false);
                  setFiles({ pdf: null, dataset: null, response: null });
                }}
                className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl font-semibold transition-colors"
              >
                Start New Analysis
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FileBox({
  label,
  subLabel,
  icon: Icon,
  accept,
  file,
  error,
  onChange,
  onRemove,
}) {
  const inputRef = useRef(null);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`
        glass-card p-6 rounded-3xl border transition-all relative overflow-hidden
        ${file ? "border-teal-500/50 bg-teal-500/5" : "border-white/10 hover:border-white/20"}
        ${error ? "border-red-500/50 bg-red-500/5" : ""}
      `}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div
          className={`p-4 rounded-2xl ${file ? "bg-teal-500/20" : "bg-white/5"}`}
        >
          <Icon
            className={`w-8 h-8 ${file ? "text-teal-400" : "text-zinc-500"}`}
          />
        </div>

        <div>
          <h3 className="font-semibold text-white">{label}</h3>
          <p className="text-xs text-zinc-500 mt-1">{subLabel}</p>
        </div>

        {!file ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            <CloudUpload className="w-4 h-4" />
            Choose File
          </button>
        ) : (
          <div className="flex items-center gap-2 w-full">
            <div className="flex-1 bg-white/5 px-3 py-2 rounded-xl text-xs truncate text-zinc-400">
              {file.name}
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="p-2 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <input
          type="file"
          accept={accept}
          ref={inputRef}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0])}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400 flex items-center gap-1 mt-2"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

function ProcessingState({ steps, activeStep, onCancel }) {
  return (
    <div className="max-w-md mx-auto space-y-8 py-12">
      <div className="text-center space-y-4 mb-12">
        <div className="relative w-24 h-24 mx-auto">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-teal-500/20 border-t-teal-500 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Processing...</h2>
        <p className="text-zinc-400">Please wait while we analyze your data.</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${isActive
                ? "bg-teal-500/10 border-teal-500/30"
                : "border-white/5 opacity-50"
                }`}
            >
              <div
                className={`p-2 rounded-lg ${isCompleted ? "bg-green-500/20 text-green-500" : isActive ? "bg-teal-500/20 text-teal-500" : "bg-white/5 text-zinc-500"}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <span
                className={`font-medium ${isActive ? "text-white" : "text-zinc-500"}`}
              >
                {step.label}
              </span>
              {isActive && (
                <div className="ml-auto">
                  <div className="flex gap-1">
                    <motion.div
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-1 h-1 bg-teal-500 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-1 h-1 bg-teal-500 rounded-full"
                    />
                    <motion.div
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-1 h-1 bg-teal-500 rounded-full"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={onCancel}
        className="w-full text-zinc-500 hover:text-red-400 transition-colors text-sm font-medium pt-8"
      >
        Cancel Process
      </button>
    </div>
  );
}
