"use client";
import React from "react";
import Link from "next/link";
import { useAssignment } from "../Context/Assignment";
import { useQuiz } from "../Context/Quiz";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  FileCode,
  FileText,
  Calendar,
  ArrowRight,
  Download,
  Loader2,
  Sparkles,
} from "lucide-react";
import api from "../utils/api";

const HubPage = () => {
  const { assignment, loading: assignmentLoading } = useAssignment();
  const { quiz, loading: quizLoading } = useQuiz();

  const downloadAssignment = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await api.get(`/assignments/${id}/file`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      const contentDisposition = response.headers["content-disposition"];
      let filename = `assignment_${id}.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download file");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen pb-20 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-600/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* Hero Section */}
        <div className="text-center mb-24 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Learning Management
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-foreground mb-6 tracking-tight leading-tight"
          >
            Assignments & <span className="text-brand-500">Quizzes</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Access your resources, practice your skills, and master new concepts
            through interactive materials.
          </motion.p>
        </div>

        {/* Assignments Section */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-500/10 rounded-2xl">
                <FileText className="w-6 h-6 text-brand-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-foreground">
                  Assignments
                </h2>
                <p className="text-sm text-muted-foreground">
                  Practical resources and coding tasks
                </p>
              </div>
            </div>
            {assignment?.length > 0 && (
              <span className="text-xs font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-full text-muted-foreground">
                {assignment.length} Resources
              </span>
            )}
          </div>

          {assignmentLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="glass-card h-64 rounded-3xl animate-pulse bg-white/5"
                ></div>
              ))}
            </div>
          ) : !assignment || assignment.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-3xl p-16 text-center border-white/5"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-muted-foreground/20" />
              </div>
              <p className="text-muted-foreground italic text-lg font-medium">
                No assignments available yet
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {assignment.map((a) => (
                <motion.div
                  key={a.id}
                  variants={itemVariants}
                  className="group glass-card rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] hover:border-brand-500/40 flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 blur-3xl rounded-full -mr-16 -mt-16 transition-all group-hover:bg-brand-500/10"></div>

                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-brand-500/10 rounded-2xl group-hover:bg-brand-500/20 transition-all group-hover:rotate-6">
                      {a.assignment_type === "coding" ? (
                        <FileCode className="w-6 h-6 text-brand-500" />
                      ) : (
                        <FileText className="w-6 h-6 text-brand-500" />
                      )}
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {a.assignment_type}
                    </span>
                  </div>

                  <h3 className="font-bold text-foreground text-2xl mb-4 group-hover:text-brand-400 transition-colors">
                    {a.title}
                  </h3>

                  <div className="mt-auto pt-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground/60 text-xs font-bold uppercase tracking-tighter">
                      <Calendar className="w-4 h-4" />
                      {new Date(a.created_at).toLocaleDateString()}
                    </div>

                    <div className="flex gap-2">
                      {a.assignment_type === "coding" ? (
                        <Link
                          href={`/assignments-quiz-hub/assignment/coding/${a.id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded-xl transition-all hover:bg-brand-600 font-bold text-sm"
                        >
                          Code
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={(e) => downloadAssignment(a.id, e)}
                            className="p-3 bg-white/5 hover:bg-brand-500/20 text-muted-foreground hover:text-brand-400 rounded-xl transition-all"
                            title="Download PDF"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <Link
                            href={`/assignments-quiz-hub/assignment/pdf/${a.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 rounded-xl transition-all font-bold text-sm border border-brand-500/20"
                          >
                            View
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* Quizzes Section */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-2xl">
                <BookOpen className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-foreground">Quizzes</h2>
                <p className="text-sm text-muted-foreground">
                  Interactive assessments and practice
                </p>
              </div>
            </div>
            {quiz?.length > 0 && (
              <span className="text-xs font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-full text-muted-foreground">
                {quiz.length} Challenges
              </span>
            )}
          </div>

          {quizLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="glass-card h-64 rounded-3xl animate-pulse bg-white/5"
                ></div>
              ))}
            </div>
          ) : !quiz || quiz.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-3xl p-16 text-center border-white/5"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-muted-foreground/20" />
              </div>
              <p className="text-muted-foreground italic text-lg font-medium">
                No quizzes available at the moment
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {quiz.map((q) => (
                <Link
                  key={q.id}
                  href={`/assignments-quiz-hub/quiz/${q.id}`}
                  className="group relative"
                >
                  <motion.div
                    variants={itemVariants}
                    className="glass-card rounded-3xl p-8 transition-all duration-500 hover:scale-[1.02] hover:border-purple-500/40 flex flex-col h-full overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full -mr-16 -mt-16 transition-all group-hover:bg-purple-500/10"></div>

                    <div className="flex justify-between items-start mb-6">
                      <div className="p-3 bg-purple-500/10 rounded-2xl group-hover:bg-purple-500/20 transition-all group-hover:-rotate-6">
                        <BookOpen className="w-6 h-6 text-purple-500" />
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                        <Sparkles className="w-3 h-3" />
                        AI GENERATED
                      </div>
                    </div>

                    <h3 className="font-bold text-foreground text-2xl mb-4 group-hover:text-purple-400 transition-colors">
                      {q.title}
                    </h3>

                    <div className="mt-auto pt-8 flex items-center justify-between text-muted-foreground/60">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase">
                        <FileText className="w-4 h-4" />
                        {q.questions?.length || 0} Questions
                      </div>
                      <div className="p-2 rounded-full bg-purple-500/10 text-purple-500 group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HubPage;
