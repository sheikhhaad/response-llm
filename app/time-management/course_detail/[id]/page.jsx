"use client"

import api from "@/app/utils/api"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Loader2,
  CheckCircle,
  ChevronLeft,
  PlayCircle,
  Clock,
  BookOpen
} from "lucide-react"
import { motion } from "framer-motion"

const Page = () => {
  const { id } = useParams()
  const router = useRouter()

  const [lectures, setLectures] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDetail = async () => {
    try {
      const res = await api.get(`/study/lecture/course/${id}`)
      setLectures(res.data)
    } catch (error) {
      console.log(error.response?.data || error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchDetail()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="text-brand-400 w-10 h-10" />
        </motion.div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Courses
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-4xl font-black text-white tracking-tight">
          Course <span className="text-brand-400">Curriculum</span>
        </h1>
        <p className="text-slate-400">Explore the lectures and deep dive into the course content.</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {lectures.length > 0 ? (
          lectures.map((lecture, index) => (
            <motion.div
              key={lecture.id}
              variants={itemVariants}
              whileHover={{ x: 5 }}
              className="glass-card p-5 rounded-2xl flex items-center gap-5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400 font-bold shrink-0">
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate group-hover:text-brand-400 transition-colors">
                  {lecture.title}
                </h3>
                <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock size={14} />
                    <span>{lecture.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <PlayCircle size={14} />
                    <span>Video Lecture</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-white/5 px-2 py-1 rounded">
                  Locked
                </div>
                <CheckCircle className="text-slate-700" size={20} />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 glass-card rounded-3xl border-dashed">
            <BookOpen className="mx-auto text-slate-700 mb-4" size={48} />
            <p className="text-slate-500">No lectures uploaded for this course yet.</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Page