"use client"

import { useEffect, useState } from "react"
import api from "@/app/utils/api"
import {
  Loader2,
  Upload,
  BookOpen,
  Plus,
  LayoutDashboard,
  Video,
  ChevronRight,
  Sparkles,
  Search,
  Settings
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const Page = () => {
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [courses, setCourses] = useState([])
  
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
  })

  const [lectureData, setLectureData] = useState({
    course_id: "",
    title: "",
    video_url: "",
    duration: "",
  })

  const fetchCourses = async () => {
    try {
      setFetching(true)
      const res = await api.get("/study/course/all")
      setCourses(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const createCourse = async (e) => {
    e.preventDefault()
    if (!courseData.title) return;

    try {
      setLoading(true)
      await api.post("/study/course/create", courseData)
      setCourseData({ title: "", description: "" })
      fetchCourses()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const uploadLecture = async (e) => {
    e.preventDefault()
    if (!lectureData.course_id || !lectureData.title) return;

    try {
      setLoading(true)
      const selectedCourse = courses.find(c => c.id === lectureData.course_id)

      await api.post("/study/lecture/upload", {
        course_id: lectureData.course_id,
        title: lectureData.title,
        video_url: lectureData.video_url,
        duration: Number(lectureData.duration),
        order_index: selectedCourse?.total_lectures + 1 || 1,
      })

      setLectureData({ course_id: "", title: "", video_url: "", duration: "" })
      fetchCourses()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-brand-400" size={36} />
            Admin <span className="text-brand-400">Panel</span>
          </h1>
          <p className="text-slate-400 mt-1">Manage your courses and learning content with ease.</p>
        </motion.div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand-400 transition-colors" size={18} />
            <input 
              placeholder="Search everything..."
              className="bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all w-full md:w-64"
            />
          </div>
          <button className="bg-white/5 p-3 rounded-2xl text-slate-400 hover:text-white transition-colors border border-white/5">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Forms Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* Create Course */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Plus size={80} className="text-brand-400" />
            </div>
            
            <div className="flex items-center gap-3 mb-6 relative">
              <div className="bg-brand-500/10 p-2.5 rounded-xl">
                <BookOpen className="text-brand-400" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">New Course</h2>
            </div>

            <form onSubmit={createCourse} className="space-y-4 relative">
              <input
                placeholder="Course Title"
                value={courseData.title}
                onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500/50 transition-all"
              />
              <textarea
                placeholder="Description"
                rows={3}
                value={courseData.description}
                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500/50 transition-all resize-none"
              />
              <button 
                disabled={loading}
                className="w-full bg-brand-500 hover:bg-brand-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Create Course</>}
              </button>
            </form>
          </motion.div>

          {/* Upload Lecture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Video size={80} className="text-blue-400" />
            </div>

            <div className="flex items-center gap-3 mb-6 relative">
              <div className="bg-blue-500/10 p-2.5 rounded-xl">
                <Upload className="text-blue-400" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Add Lecture</h2>
            </div>

            <form onSubmit={uploadLecture} className="space-y-4 relative">
              <select
                value={lectureData.course_id}
                onChange={(e) => setLectureData({ ...lectureData, course_id: e.target.value })}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900">Select Course</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id} className="bg-slate-900">{course.title}</option>
                ))}
              </select>
              <input
                placeholder="Lecture Title"
                value={lectureData.title}
                onChange={(e) => setLectureData({ ...lectureData, title: e.target.value })}
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="Video URL"
                  value={lectureData.video_url}
                  onChange={(e) => setLectureData({ ...lectureData, video_url: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <input
                  type="number"
                  placeholder="Duration (m)"
                  value={lectureData.duration}
                  onChange={(e) => setLectureData({ ...lectureData, duration: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <button 
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={20} /> Add to Syllabus</>}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Stats & List Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-3xl">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total Courses</p>
              <h3 className="text-4xl font-black text-white">{courses.length}</h3>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 rounded-3xl">
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Total Lectures</p>
              <h3 className="text-4xl font-black text-white">
                {courses.reduce((acc, c) => acc + (c.total_lectures || 0), 0)}
              </h3>
            </motion.div>
          </div>

          <div className="glass-card rounded-[2.5rem] overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Active Courses</h2>
              <button onClick={fetchCourses} className="text-xs text-brand-400 font-bold hover:underline">Refresh List</button>
            </div>
            
            <div className="divide-y divide-white/5">
              {fetching ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-brand-400" size={32} />
                  <p className="text-slate-500 animate-pulse">Fetching latest data...</p>
                </div>
              ) : courses.length > 0 ? (
                courses.map((course, i) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-6 hover:bg-white/5 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-brand-400 font-bold shrink-0 group-hover:scale-110 transition-transform">
                        {i + 1}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-white font-bold truncate pr-4">{course.title}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-3 mt-1">
                          <span>{course.total_lectures} Lectures</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700" />
                          <span>Status: {course.status}</span>
                        </p>
                      </div>
                    </div>
                    <button className="bg-white/5 p-2 rounded-lg text-slate-500 hover:text-white transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="p-20 text-center">
                  <BookOpen className="mx-auto text-slate-800 mb-4" size={48} />
                  <p className="text-slate-500 font-medium">No courses found. Create your first one!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page