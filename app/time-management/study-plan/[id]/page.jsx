"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/app/utils/api";
import {
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  Loader2,
  ChevronLeft,
  Zap,
  Play,
  Trophy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);

  const fetchDetail = async () => {
    try {
      const [courseRes, progressRes] = await Promise.all([
        api.get(`/time-management/study-plan/${id}`),
        api.get(`/time-management/progress/${id}`),
      ]);
      console.log("courseRes", courseRes.data);
      setCourse(courseRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.log(error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  const completeLecture = async (lectureId) => {
    try {
      setCompleting(lectureId);

      await api.post("/time-management/lecture/complete", {
        course_id: id,
        lecture_id: lectureId,
      });

      await fetchDetail();
    } catch (error) {
      console.log(error.response?.data || error);
    } finally {
      setCompleting(null);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-400 w-10 h-10" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 font-bold">
        No Study Plan Found
      </div>
    );
  }

  const completedLectures = progress?.completed_lectures || [];
  const progressPercentage = progress?.progress_percentage || 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="max-w-8xl mx-auto p-6 md:p-10 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Your Study <span className="text-brand-400">Plan</span>
          </h1>
          <p className="text-slate-400">
            Follow your personalized learning path to mastery.
          </p>
        </div>

        <div className="glass-card p-6 rounded-[2rem] flex items-center gap-6 md:min-w-[300px]">
          <div className="relative w-20 h-20 shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                className="text-white/5 stroke-current"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              ></circle>
              <motion.circle
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progressPercentage / 100 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="text-brand-500 stroke-current"
                strokeWidth="8"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "50% 50%",
                }}
              ></motion.circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-black text-white">
              {progressPercentage.toFixed(0)}%
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
              Total Progress
            </p>
            <h3 className="text-white font-bold flex items-center gap-2">
              <Trophy className="text-yellow-500" size={16} />
              Almost there!
            </h3>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            icon: <Calendar className="text-blue-400" />,
            label: "Total Days",
            value: course.total_days,
          },
          {
            icon: <Clock className="text-green-400" />,
            label: "Daily Mins",
            value: course.daily_minutes,
          },
          {
            icon: <BookOpen className="text-purple-400" />,
            label: "Total Duration",
            value: `${course.total_duration}m`,
          },
          {
            icon: <Zap className="text-yellow-400" />,
            label: "Status",
            value: "Active",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 rounded-2xl flex flex-col items-center text-center"
          >
            <div className="bg-white/5 p-3 rounded-xl mb-3">{stat.icon}</div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              {stat.label}
            </p>
            <h2 className="text-xl font-bold text-white mt-1">{stat.value}</h2>
          </motion.div>
        ))}
      </div>

      {/* Days Plan */}
      <div className="space-y-10">
        {Object.entries(course.plan || {}).map(([day, lectures], dayIndex) => (
          <motion.section
            key={day}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white capitalize">
                {day}
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {lectures.map((lecture, i) => {
                const isCompleted = completedLectures.includes(lecture.id);
                const isCompleting = completing === lecture.id;

                return (
                  <motion.div
                    key={lecture.id}
                    whileHover={{ scale: 1.01 }}
                    className={`glass-card p-5 rounded-[1.5rem] flex flex-col justify-between gap-4 border transition-colors ${isCompleted ? "border-brand-500/30 bg-brand-500/5" : "border-white/5"}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-[10px] text-brand-400 font-black uppercase tracking-[0.2em] mb-1">
                          Lecture {i + 1}
                        </p>
                        <h3
                          className={`font-bold truncate ${isCompleted ? "text-brand-400" : "text-white"}`}
                        >
                          {lecture.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock size={12} /> {lecture.duration} mins
                          </span>
                          {lecture.video_url && (
                            <a
                              href={lecture.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-brand-400 transition-colors"
                            >
                              <Play size={12} /> Video
                            </a>
                          )}
                        </div>
                      </div>
                      {isCompleted && (
                        <div className="bg-brand-500/20 p-2 rounded-full">
                          <CheckCircle className="text-brand-400" size={20} />
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => completeLecture(lecture.id)}
                      disabled={isCompleting || isCompleted}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        isCompleted
                          ? "bg-brand-500/10 text-brand-400 cursor-default"
                          : "bg-white/5 hover:bg-white/10 text-white border border-white/5"
                      }`}
                    >
                      {isCompleting ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : isCompleted ? (
                        "Goal Reached"
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Mark Completed
                        </>
                      )}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
};

export default Page;
