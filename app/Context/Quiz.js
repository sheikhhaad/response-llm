"use client";
import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api";

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get("/quiz");

        setQuiz(res.data);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  return (
    <QuizContext.Provider value={{ quiz, setQuiz, loading }}>
      {children}
    </QuizContext.Provider>
  );
}

export const useQuiz = () => useContext(QuizContext);