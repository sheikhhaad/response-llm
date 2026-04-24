"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  const [selectedModule, setSelectedModule] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)
  const modules = {
    python: {
      title: "Python Programming",
      icon: "🐍",
      color: "from-green-500 to-emerald-600",
      bgColor: "hover:bg-green-50",
      module: "python",
    },
    powerbi: {
      title: "Power BI",
      icon: "📊",
      color: "from-yellow-500 to-orange-600",
      bgColor: "hover:bg-yellow-50",
      module: "powerbi",
    }
  }

  const handleModuleSelect = (moduleType) => {
    router.push(`/ai-data-analyst/${moduleType}`);
  }

  const handleBackToCards = () => {
    setSelectedModule(null)
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Choose Your Learning Path
          </h1>
          <p className="text-gray-600 text-lg">Select a module to explore detailed courses</p>
        </div>

        {!selectedModule ? (
          // Two Cards View
          <div className="grid md:grid-cols-2 gap-8">
            {/* Python Card */}
            <div
              className={`group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${modules.python.bgColor}`}
              onMouseEnter={() => setHoveredCard('python')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleModuleSelect('python')}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${modules.python.color} rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              <div className="p-8">
                <div className="text-7xl mb-4">{modules.python.icon}</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">{modules.python.title}</h2>
                <p className="text-gray-600 mb-4">
                  Master Python programming from basics to advanced. Perfect for data science, web development, and automation.
                </p>
                <div className="flex items-center justify-between">
                
                  <button onClick={() => handleModuleSelect('python')} className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                    Explore →
                  </button>
                </div>
              </div>
            </div>

            {/* Power BI Card */}
            <div
              className={`group relative overflow-hidden rounded-2xl bg-white shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${modules.powerbi.bgColor}`}
              onMouseEnter={() => setHoveredCard('powerbi')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleModuleSelect('powerbi')}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${modules.powerbi.color} rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity`}></div>
              <div className="p-8">
                <div className="text-7xl mb-4">{modules.powerbi.icon}</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">{modules.powerbi.title}</h2>
                <p className="text-gray-600 mb-4">
                  Learn business intelligence and data visualization. Create stunning dashboards and insightful reports.
                </p>
                <div className="flex items-center justify-between">

                  <button onClick={() => handleModuleSelect('powerbi')} className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                    Explore →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Modules Detail View
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <button
              onClick={handleBackToCards}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back to all modules
            </button>
            
            <div className="mb-8">
              <div className="text-5xl mb-2">{modules[selectedModule].icon}</div>
              <h2 className="text-3xl font-bold text-gray-800">
                {modules[selectedModule].title} Modules
              </h2>
              <p className="text-gray-600 mt-2">
                Select a specific module to start learning
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules[selectedModule].modules.map((module) => (
                <div
                  key={module.id}
                  className="border-2 border-gray-100 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {module.name}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      module.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                      module.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {module.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span className="flex items-center gap-1">
                      ⏱️ {module.duration}
                    </span>
                  </div>
                  <button className="mt-4 w-full py-2 bg-gray-50 text-gray-700 rounded-lg font-semibold group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white transition-all">
                    Select Module
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page