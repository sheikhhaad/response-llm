"use client";

import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useRouter } from "next/navigation";
import { Clock, Calendar, Sparkles, Loader2, ArrowRight, BookOpen, ChevronRight, Layout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Page = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [hours, setHours] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchDetail = async () => {
    try {
      const res = await api.get("/time-management");
      setAvailableCourses(res.data.available_courses || []);
      setActiveCourses(res.data.active_courses || []);
    } catch (error) {
      console.log(error);
    }
  };

  const startCourse = async () => {
    if (!selectedCourse) return;

    setLoading(true);
    setError(null);

    try {
      const dailyMinutes = hours * 60;

      await api.post("/time-management/course/start", {
        course_id: selectedCourse.id,
        daily_minutes: dailyMinutes,
        start_date: new Date().toISOString(),
      });

      setSelectedCourse(null);
      fetchDetail();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const CourseCard = ({ course, active }) => (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="glass-card p-6 rounded-[2rem] flex flex-col h-full relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <BookOpen size={64} className="text-brand-400" />
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${active ? 'bg-brand-500/20 text-brand-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {active ? 'In Progress' : 'Available'}
          </span>
        </div>

        <h2 className="text-xl font-bold text-white mb-2 leading-tight">{course.title}</h2>
        <p className="text-sm text-slate-400 line-clamp-2 mb-4">Master this course with a personalized schedule.</p>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center text-xs text-slate-400 gap-2">
            <Layout size={14} className="text-brand-400" />
            <span>{course.total_lectures} Total Lectures</span>
          </div>
          {active && (
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Completion</span>
                <span className="text-brand-400 font-bold">{course.progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-brand-500 to-brand-300"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto space-y-3">
        {!active && (
          <>
            <button
              onClick={() => setSelectedCourse(course)}
              className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
            >
              <Sparkles size={18} />
              Start Learning
            </button>
            <button
              onClick={() => router.push(`/time-management/course_detail/${course.id}`)}
              className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-3 rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/5"
            >
              Course Details
              <ChevronRight size={16} />
            </button>
          </>
        )}
        {active && (
          <button
            onClick={() => router.push(`/time-management/study-plan/${course.id}`)}
            className="w-full bg-gradient-to-r from-brand-600 to-brand-400 hover:from-brand-500 hover:to-brand-300 text-white font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
          >
            Continue Learning
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-16">
      {/* Header section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center md:text-left space-y-2"
      >
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-400">Management</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">Organize your learning path and master your schedule with AI-powered study plans.</p>
      </motion.div>

      {/* Active Courses */}
      {activeCourses.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Active Progress</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {activeCourses.map((course) => (
              <CourseCard key={course.id} course={course} active />
            ))}
          </motion.div>
        </section>
      )}

      {/* Available Courses */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Available Courses</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {availableCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
          {availableCourses.length === 0 && (
            <div className="col-span-full py-20 text-center glass-card rounded-[2rem]">
              <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-slate-500" />
              </div>
              <p className="text-slate-400">No new courses available at the moment.</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCourse(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md glass-card rounded-[2.5rem] p-8 md:p-10 relative z-10 shadow-2xl"
            >
              <div className="text-center space-y-4 mb-8">
                <div className="bg-brand-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto">
                  <Clock className="text-brand-400" size={32} />
                </div>
                <div>
                  <h2 className="text-2xl text-white font-bold">Plan Your Schedule</h2>
                  <p className="text-slate-400 text-sm mt-1">How many hours can you dedicate daily?</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-sm font-medium text-slate-400">Study Duration</span>
                    <span className="text-xl font-bold text-brand-400">{hours} {hours === 1 ? 'hour' : 'hours'}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.5"
                    value={hours}
                    onChange={(e) => setHours(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                    <span>1 Hour</span>
                    <span>12 Hours</span>
                  </div>
                </div>

                {error && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-red-400 text-xs bg-red-400/10 p-3 rounded-xl border border-red-400/20"
                  >
                    {error}
                  </motion.p>
                )}

                <div className="flex flex-col gap-3">
                  <button
                    onClick={startCourse}
                    disabled={loading}
                    className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Generate AI Plan
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="w-full bg-white/5 hover:bg-white/10 text-slate-300 font-medium py-3 rounded-2xl transition-all"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Page;

