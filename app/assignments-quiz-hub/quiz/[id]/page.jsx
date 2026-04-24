"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const QuizPage = () => {
  const { id } = useParams();
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // data/quizzes.ts or inside the page component
  const quizQuestions = {
    1: [
      // JavaScript Basics
      {
        question: "Which keyword is used to declare a variable in JavaScript?",
        options: ["var", "let", "const", "All of the above"],
        correct: 3,
      },
      {
        question: "What does `console.log(typeof [])` output?",
        options: ["array", "object", "undefined", "number"],
        correct: 1,
      },
      {
        question: "Which company developed JavaScript?",
        options: ["Microsoft", "Netscape", "Google", "Mozilla"],
        correct: 1,
      },
    ],
    2: [
      // Python Programming
      {
        question: "What is the correct way to create a function in Python?",
        options: [
          "function myFunc():",
          "def myFunc():",
          "create myFunc():",
          "new myFunc():",
        ],
        correct: 1,
      },
      {
        question: "Which data type is immutable in Python?",
        options: ["list", "dict", "tuple", "set"],
        correct: 2,
      },
      {
        question: "What does `len('hello')` return?",
        options: ["4", "5", "6", "Error"],
        correct: 1,
      },
    ],
    3: [
      // SQL Fundamentals
      {
        question:
          "Which SQL statement is used to extract data from a database?",
        options: ["GET", "SELECT", "EXTRACT", "OPEN"],
        correct: 1,
      },
      {
        question: "What does `WHERE` clause do?",
        options: ["Filters rows", "Sorts rows", "Groups rows", "Joins tables"],
        correct: 0,
      },
      {
        question: "Which keyword is used to sort results?",
        options: ["SORT BY", "ORDER BY", "GROUP BY", "ARRANGE BY"],
        correct: 1,
      },
    ],
    4: [
      // React & Modern JS
      {
        question:
          "Which hook is used to manage state in a functional component?",
        options: ["useEffect", "useState", "useContext", "useReducer"],
        correct: 1,
      },
      {
        question: "What is the virtual DOM?",
        options: [
          "A copy of real DOM",
          "A faster DOM",
          "A React API",
          "A browser feature",
        ],
        correct: 0,
      },
      {
        question: "Which method is used to update state in class components?",
        options: [
          "this.state",
          "this.setUpdate",
          "this.setState",
          "this.updateState",
        ],
        correct: 2,
      },
    ],
  };

  const quizTitle = {
    1: "JavaScript Basics",
    2: "Python Programming",
    3: "SQL Fundamentals",
    4: "React & Modern JS",
  };

  const currentQuiz = quizQuestions[id];
  const title = quizTitle[id];
  const totalQuestions = currentQuiz?.length || 0;
  const answeredCount = Object.keys(selected).length;

  const handleSubmit = () => {
    if (answeredCount < totalQuestions) {
      alert(`Please answer all ${totalQuestions} questions before submitting.`);
      return;
    }
    setSubmitted(true);
  };

  const calculateScore = () => {
    let score = 0;
    currentQuiz.forEach((q, i) => {
      if (selected[i] === q.correct) {
        score++;
      }
    });
    return score;
  };

  const handleReset = () => {
    setSelected({});
    setSubmitted(false);
  };

  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Not Found</h2>
          <p className="text-gray-600">The quiz you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    const score = calculateScore();
    const percentage = (score / totalQuestions) * 100;
    return (
      <div className="min-h-screen  py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className=" rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white mb-2">Quiz Results</h2>
              <p className="text-purple-100">{title}</p>
            </div>
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 mb-6">
                <span className="text-4xl font-bold text-purple-600">{score}/{totalQuestions}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-200 mb-2">
                You scored {percentage}%
              </h3>
              <p className="text-gray-600 mb-6">
                {percentage >= 70 
                  ? "Great job! You've mastered this topic!" 
                  : "Keep practicing! You'll get better!"}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                >
                  Take Again
                </button>
                <button
                  onClick={() => window.location.href = '/assignments-quiz-hub'}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Back to Hub
                </button>
              </div>
            </div>
            <div className="bg-gray-50 px-8 py-6">
              <h4 className="font-semibold text-gray-800 mb-4">Question Summary</h4>
              <div className="space-y-3">
                {currentQuiz.map((q, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selected[i] === q.correct 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {selected[i] === q.correct ? '✓' : '✗'}
                    </div>
                    <span className="text-gray-700">Question {i + 1}: {q.question.substring(0, 60)}...</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {title}
          </h1>
          <p className="text-gray-600">
            Question {answeredCount} of {totalQuestions} answered
          </p>
          <div className="w-full max-w-md mx-auto bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {currentQuiz.map((q, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold text-sm">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {q.question}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {q.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selected[i] === idx
                          ? "border-purple-500 bg-purple-50 shadow-md"
                          : "border-gray-200 hover:border-purple-300 hover:bg-purple-50/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        checked={selected[i] === idx}
                        onChange={() =>
                          setSelected((prev) => ({ ...prev, [i]: idx }))
                        }
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="ml-3 text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Submit Quiz
          </button>
          {answeredCount < totalQuestions && (
            <p className="text-sm text-orange-600 mt-3">
              ⚠️ You have {totalQuestions - answeredCount} unanswered question(s)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;