<<<<<<< HEAD
"use client";
import api from "@/app/lib/api";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BookOpen, FileText, CheckCircle2, ChevronLeft, Trophy, AlertCircle } from "lucide-react";

const Page = () => {
  const { id } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/quiz/${id}`);
        setQuiz(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchQuiz();
  }, [id]);

  const handleSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    const answers = Object.entries(selectedAnswers).map(
      ([question_id, selected_answer]) => ({
        question_id,
        selected_answer,
      })
    );

    // guard: all questions answered
    if (answers.length !== quiz.questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }

    const payload = { answers };

    try {
      const res = await api.post(`/quiz/${id}/submit`, payload);
      setResult(res.data);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card p-12 rounded-2xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Not Found</h2>
          <p className="text-muted-foreground mb-6">The quiz you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.back()}
            className="px-6 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-brand-400 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className="text-muted-foreground text-lg mb-4">{quiz.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-500/10 text-brand-400 rounded-full border border-brand-500/20">
              <BookOpen className="w-4 h-4" />
              <span>{quiz.questions?.length || 0} Questions</span>
            </div>
          </div>
        </div>

        {/* Result Display */}
        {result && (
          <div className="glass-card p-8 rounded-2xl mb-10 border-brand-500/30 bg-brand-500/5 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-500"></div>
            <Trophy className="w-16 h-16 text-brand-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]" />
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Quiz Completed!
            </h2>
            <div className="grid grid-cols-2 gap-4 mt-8 max-w-sm mx-auto">
              <div className="bg-background/50 p-4 rounded-xl border border-border">
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Score</p>
                <p className="text-2xl font-bold text-foreground">{result.score} / {result.total}</p>
              </div>
              <div className="bg-background/50 p-4 rounded-xl border border-border">
                <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Percentage</p>
                <p className="text-2xl font-bold text-brand-400">{result.percentage}%</p>
              </div>
            </div>
            <button 
              onClick={() => router.push('/assignments-quiz-hub')}
              className="mt-8 px-8 py-3 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-all hover:scale-105 active:scale-95"
            >
              Back to Dashboard
            </button>
          </div>
        )}

        {/* Questions */}
        {!result && (
          <div className="space-y-6">
            {quiz.questions?.map((q, index) => (
              <div
                key={q.id}
                className="glass-card rounded-2xl overflow-hidden border-border/50 hover:border-brand-500/30 transition-colors"
              >
                {/* Question Header */}
                <div className="p-6 border-b border-border/50 bg-foreground/5">
                  <div className="flex items-start gap-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 text-sm font-bold border border-brand-500/20">
                      {index + 1}
                    </span>
                    <h2 className="text-lg font-bold text-foreground flex-1 pt-0.5">
                      {q.question}
                    </h2>
                  </div>
                </div>

                {/* Options List */}
                <div className="p-6 space-y-3">
                  {[
                    { key: "A", value: q.option_a },
                    { key: "B", value: q.option_b },
                    { key: "C", value: q.option_c },
                    { key: "D", value: q.option_d },
                  ].map((option) => (
                    <label
                      key={option.key}
                      className={`group flex items-center p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        selectedAnswers[q.id] === option.key
                          ? "bg-brand-500/10 border-brand-500 shadow-[0_0_20px_rgba(20,184,166,0.1)]"
                          : "bg-background/40 border-transparent hover:border-border hover:bg-background/60"
                      }`}
                    >
                      <div className="relative flex items-center justify-center w-5 h-5 mr-4">
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={option.key}
                          checked={selectedAnswers[q.id] === option.key}
                          onChange={() => handleSelect(q.id, option.key)}
                          className="peer hidden"
                        />
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground peer-checked:border-brand-500 transition-colors"></div>
                        <div className="absolute w-2.5 h-2.5 rounded-full bg-brand-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                      </div>
                      <span className={`text-base transition-colors ${
                        selectedAnswers[q.id] === option.key ? "text-foreground font-bold" : "text-muted-foreground"
                      }`}>
                        <span className="mr-2 font-mono opacity-50">{option.key}.</span>
                        {option.value}
                      </span>
                      {selectedAnswers[q.id] === option.key && (
                        <CheckCircle2 className="w-5 h-5 text-brand-500 ml-auto animate-in zoom-in duration-300" />
                      )}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={handleSubmit}
                disabled={Object.keys(selectedAnswers).length < (quiz.questions?.length || 0)}
                className="w-full py-4 bg-brand-500 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-brand-500/20 hover:bg-brand-600 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Submit Quiz
              </button>
              <p className="text-center text-muted-foreground text-sm mt-4">
                Make sure you've answered all {quiz.questions?.length} questions.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Page;
=======
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
>>>>>>> 67db70a45b72594d37640b4972b3aaf0db36801e
