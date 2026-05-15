"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  Terminal, 
  BarChart3, 
  ArrowRight, 
  Sparkles, 
  Code2, 
  Database,
  TrendingUp,
  BrainCircuit
} from "lucide-react";
import { motion } from "framer-motion";

const Page = () => {
  const router = useRouter();

  const modules = [
    {
      id: "python",
      title: "Python Programming",
      description: "Master Python programming from basics to advanced. Perfect for data science, web development, and automation.",
      icon: Terminal,
      color: "teal",
      gradient: "from-teal-500 to-emerald-600",
      features: ["Data Analysis", "Automation Scripts", "Machine Learning"]
    },
    {
      id: "powerbi",
      title: "Power BI",
      description: "Learn business intelligence and data visualization. Create stunning dashboards and insightful reports.",
      icon: BarChart3,
      color: "yellow",
      gradient: "from-yellow-500 to-orange-600",
      features: ["Dashboard Design", "DAX Formulas", "Data Modeling"]
    }
  ];

  const handleModuleSelect = (moduleType) => {
    router.push(`/ai-data-analyst/${moduleType}`);
  };

  return (
    <div className="min-h-screen p-4 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">

      <div className="max-w-6xl w-full">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <BrainCircuit className="text-teal-400 w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            AI Data Analyst Hub
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            Choose your specialized path and leverage AI to transform your data analysis workflow.
          </p>
        </motion.div>

        {/* Module Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 px-4">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ y: -8 }}
              className="group relative cursor-pointer"
              onClick={() => handleModuleSelect(module.id)}
            >
              {/* Card Glow Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${module.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-500`} />
              
              <div className="relative glass-card p-8 md:p-10 rounded-3xl border border-white/5 flex flex-col h-full space-y-6">
                <div className="flex justify-between items-start">
                  <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-${module.color}-500/30 transition-colors`}>
                    <module.icon className={`w-8 h-8 ${module.id === 'python' ? 'text-teal-400' : 'text-yellow-400'}`} />
                  </div>
                  <motion.div 
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="p-2"
                  >
                    <Sparkles className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <h2 className="text-3xl font-bold text-white group-hover:bg-gradient-to-r from-white to-zinc-400 bg-clip-text group-hover:text-transparent transition-all">
                    {module.title}
                  </h2>
                  <p className="text-zinc-400 leading-relaxed">
                    {module.description}
                  </p>
                </div>

                {/* Feature Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {module.features.map(feature => (
                    <span key={feature} className="px-3 py-1 bg-white/5 border border-white/5 rounded-full text-xs text-zinc-500 font-medium group-hover:border-white/10 group-hover:text-zinc-300 transition-colors">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="pt-6 mt-auto">
                  <div className={`
                    w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all
                    bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20
                  `}>
                    Start Module
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

    
      </div>
    </div>
  );
};

export default Page;
