"use client";
import React from "react";
import Link from "next/link";
import { useAssignment } from "../Context/Assignment";
import { useQuiz } from "../Context/Quiz";
import { BookOpen, FileCode, FileText, Calendar, ArrowRight } from "lucide-react";

const Page = () => {
  const { assignment } = useAssignment();
  const { quiz } = useQuiz();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-brand-600">
            Assignments & Quizzes
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access your learning materials, practice coding, and take quizzes to test your knowledge.
          </p>
        </div>

        {/* ================= ASSIGNMENTS ================= */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-brand-500/10 rounded-lg">
              <FileText className="w-6 h-6 text-brand-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Assignments
            </h2>
          </div>

          {/* Empty state */}
          {(!assignment || assignment.length === 0) && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="text-muted-foreground italic">No assignments found</p>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignment &&
              assignment.map((a) => (
                <Link
                  key={a.id}
                  href={
                    a.assignment_type === "coding"
                      ? `/assignments-quiz-hub/assignment/coding/${a.id}`
                      : `/assignments-quiz-hub/assignment/pdf/${a.id}`
                  }
                  className="group glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:border-brand-500/50 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-colors">
                      {a.assignment_type === "coding" ? (
                        <FileCode className="w-5 h-5 text-brand-500" />
                      ) : (
                        <FileText className="w-5 h-5 text-brand-500" />
                      )}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {a.assignment_type}
                    </span>
                  </div>

                  <h3 className="font-bold text-foreground text-xl mb-2 group-hover:text-brand-400 transition-colors">
                    {a.title}
                  </h3>

                  <div className="mt-auto pt-4 flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(a.created_at).toLocaleDateString()}
                    </div>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-brand-500" />
                  </div>
                </Link>
              ))}
          </div>
        </section>

        {/* ================= QUIZZES ================= */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-brand-500/10 rounded-lg">
              <BookOpen className="w-6 h-6 text-brand-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Quizzes
            </h2>
          </div>

          {/* Empty state */}
          {(!quiz || quiz.length === 0) && (
            <div className="glass-card rounded-2xl p-12 text-center">
              <p className="text-muted-foreground italic">No quizzes found</p>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quiz &&
              quiz.map((q) => (
                <Link
                  key={q.id}
                  href={`/assignments-quiz-hub/quiz/${q.id}`}
                  className="group glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:border-brand-500/50 flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-brand-500/10 rounded-lg group-hover:bg-brand-500/20 transition-colors">
                      <BookOpen className="w-5 h-5 text-brand-500" />
                    </div>
                  </div>

                  <h3 className="font-bold text-foreground text-xl mb-2 group-hover:text-brand-400 transition-colors">
                    {q.title}
                  </h3>

                  <div className="mt-auto pt-4 flex items-center justify-between text-muted-foreground">
                    <div className="flex items-center gap-1.5 text-xs">
                      <FileText className="w-3.5 h-3.5" />
                      {q.questions?.length || 0} Questions
                    </div>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-brand-500" />
                  </div>
                </Link>
              ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Page;