"use client";
import React from 'react';
import Link from 'next/link';

const Page = () => {
  const assignments = [
    {
      id: 1,
      title: "React Fundamentals",
      description: "Complete exercises on React hooks, components, and state management"
    },
    {
      id: 2,
      title: "Python Data Structures",
      description: "Implement lists, dictionaries, and tuples with practical examples"
    },
    {
      id: 3,
      title: "Database Design",
      description: "Create ER diagrams and write SQL queries for a library system"
    },
    {
      id: 4,
      title: "UI/UX Principles",
      description: "Design a user interface following modern UX guidelines"
    }
  ];

  const quizzes = [
    { id: 1, title: "JavaScript Basics" },
    { id: 2, title: "Python Programming" },
    { id: 3, title: "SQL Fundamentals" },
    { id: 4, title: "React & Modern JS" }
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-200 mb-2">
            Assignments & Quizzes
          </h1>
          <p className="text-gray-200 text-lg">
            Browse your tasks and test your knowledge
          </p>
        </div>

        {/* Assignments Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-200 mb-6">Assignments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignments.map((assignment) => (
              <Link
                key={assignment.id}
                href={`/assignments-quiz-hub/assignment/${assignment.id}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 cursor-pointer border border-gray-100 hover:border-gray-200"
              >
                <h3 className="font-semibold text-gray-800 text-lg mb-2">
                  {assignment.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {assignment.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Quizzes Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-200 mb-6">Quizzes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100 flex flex-col"
              >
                <h3 className="font-semibold text-gray-900 text-lg mb-4">
                  {quiz.title}
                </h3>
                <Link
                  href={`/assignments-quiz-hub/quiz/${quiz.id}`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors w-full"
                >
                  Attempt Quiz
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;