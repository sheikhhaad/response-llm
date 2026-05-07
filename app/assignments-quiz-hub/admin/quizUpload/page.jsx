"use client";
import { useState, useMemo } from "react";
import api from "@/app/utils/api";
import { useQuiz } from "@/app/Context/Quiz";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Trash2,
  Plus,
  BookOpen,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  ChevronRight,
  FileQuestion,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuizAdminPage() {
  const { quiz, setQuiz, loading: contextLoading } = useQuiz();
  const [title, setTitle] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState(null);
  const router = useRouter();

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const uploadPDF = async (e) => {
    e.preventDefault();

    if (!pdfFile || !title) {
      showNotification("Title and PDF file are required", "error");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", pdfFile);

      const response = await api.post("/admin/quiz/upload-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update context state
      if (response.data) {
        setQuiz((prev) => [...prev, response.data]);
      } else {
        // Fallback: re-fetch if API doesn't return the new item
        const res = await api.get("/quiz");
        setQuiz(res.data);
      }

      showNotification("Quiz uploaded and processed successfully");
      setTitle("");
      setPdfFile(null);
    } catch (error) {
      console.error(error);
      showNotification(
        error?.response?.data?.detail || "PDF upload failed",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/admin/quiz/${deleteId}`);
      setQuiz((prev) => prev.filter((q) => q.id !== deleteId));
      setDeleteId(null);
      showNotification("Quiz deleted successfully");
    } catch (err) {
      console.error(err);
      showNotification("Delete failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = useMemo(() => {
    if (!quiz) return [];
    return quiz.filter((q) =>
      q.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [quiz, searchQuery]);

  return (
    <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border ${
              notification.type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-brand-500/10 border-brand-500/20 text-brand-400"
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            <p className="font-medium">{notification.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest"
          >
            Quiz Controller
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Quiz <span className="text-brand-500">Admin Panel</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Upload PDF materials to automatically generate interactive quizzes
            powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Upload Sidebar */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-3xl p-8 border border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>

              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                <div className="p-2 bg-brand-500/10 rounded-xl">
                  <FileQuestion className="w-6 h-6 text-brand-400" />
                </div>
                Create New Quiz
              </h2>

              <form onSubmit={uploadPDF} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-background/50 border border-white/10 rounded-2xl p-4 text-foreground focus:ring-2 focus:ring-brand-500 outline-none transition-all placeholder:text-muted-foreground/30"
                    placeholder="e.g. Python Advanced Concepts"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">
                    Source PDF
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      onChange={(e) => setPdfFile(e.target.files[0])}
                      accept=".pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div
                      className={`w-full border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all ${
                        pdfFile
                          ? "border-brand-500/50 bg-brand-500/5"
                          : "border-white/10 group-hover:border-brand-500/30 group-hover:bg-white/5"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-full ${
                          pdfFile
                            ? "bg-brand-500/20 text-brand-400"
                            : "bg-white/5 text-muted-foreground"
                        }`}
                      >
                        <Upload className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-center">
                        {pdfFile ? pdfFile.name : "Click or drag PDF source"}
                      </p>
                      {pdfFile && (
                        <p className="text-xs text-brand-500 font-bold uppercase tracking-widest">
                          {(pdfFile.size / 1024).toFixed(1)} KB
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-500 hover:bg-brand-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Generate Quiz
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

          {/* List Main Area */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                <input
                  type="text"
                  placeholder="Search quizzes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-foreground outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>
              <div className="text-sm font-bold text-muted-foreground whitespace-nowrap bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                {filteredQuizzes.length} Quizzes
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {contextLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-brand-500" />
                    <p className="font-medium">Loading quizzes...</p>
                  </div>
                ) : filteredQuizzes.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20 glass-card rounded-3xl border-white/5"
                  >
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <p className="text-muted-foreground font-medium">
                      No quizzes found
                    </p>
                    <p className="text-sm text-muted-foreground/50 mt-1">
                      Upload a PDF to generate your first quiz
                    </p>
                  </motion.div>
                ) : (
                  filteredQuizzes.map((q) => (
                    <motion.div
                      layout
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group glass-card rounded-2xl p-5 border border-white/5 hover:border-brand-500/30 transition-all flex items-center justify-between gap-4"
                    >
                      <div className="flex-1 flex items-center gap-4">
                        <div className="p-3 bg-brand-500/10 rounded-xl group-hover:bg-brand-500/20 transition-colors">
                          <BookOpen className="w-6 h-6 text-brand-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-brand-400 transition-colors">
                            {q.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] uppercase font-black tracking-widest text-brand-500/60 px-2 py-0.5 bg-brand-500/5 rounded border border-brand-500/10">
                              {q.questions?.length || 0} Questions
                            </span>
                            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/60">
                              ID: {q.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDeleteId(q.id)}
                          className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all hover:scale-110 active:scale-95"
                          title="Delete Quiz"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <div
                          className="p-2 text-muted-foreground/20 group-hover:text-brand-500/40 transition-colors"
                          onClick={() =>
                            router.push(`/assignments-quiz-hub/quiz/${q.id}`)
                          }
                        >
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            ></motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-card max-w-md w-full rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>

              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-2">
                Delete Quiz?
              </h3>
              <p className="text-muted-foreground mb-8">
                This will permanently remove the quiz and all its generated
                questions. Students will no longer be able to access it.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 px-6 py-4 rounded-2xl border border-white/10 font-bold hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 px-6 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>

              <button
                onClick={() => setDeleteId(null)}
                className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
