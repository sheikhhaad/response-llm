"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Lock,
  Hash,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/api";
import { PageTransition } from "./components/PageTransition";

export default function LoginScreen() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleStudentIdChange = (e) => {
    // Only allow numeric input for roll number
    const val = e.target.value.replace(/\D/g, "");
    setStudentId(val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!studentId) {
      setError("Please enter your Student ID.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Roll numbers are stored as numbers on the backend
      const rollNumber = parseInt(studentId, 10);

      const res = await api.post("/auth/login", {
        rollNumber,
        password,
      });

      // Redirect to dashboard on success
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        "Invalid Student ID or Password. Please try again.";
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="justify-center items-center">
      <div
        className="w-full max-w-md rounded-2xl p-8 flex flex-col gap-8
                   bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 shadow-xl"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 mb-2">
            <Lock size={22} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
            Student Login
          </h1>
          <p className="text-sm text-zinc-400">
            Enter your Student ID and password to access the portal.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {/* Student ID / Roll Number Field */}
            <div className="relative">
              <label htmlFor="studentId" className="sr-only">
                Student ID / Roll Number
              </label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                <Hash size={18} />
              </div>
              <input
                id="studentId"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl py-3 pl-11 pr-4
                           text-white placeholder-zinc-500 focus:outline-none focus:ring-2
                           focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                placeholder="Student ID (e.g. 123456)"
                value={studentId}
                onChange={handleStudentIdChange}
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl py-3 pl-11 pr-12
                           text-white placeholder-zinc-500 focus:outline-none focus:ring-2
                           focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-brand-500 hover:bg-brand-400 text-brand-950
                       font-semibold rounded-xl flex items-center justify-center gap-2
                       transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-brand-950"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="flex flex-col items-center gap-2 text-sm text-zinc-400 text-center">
          <p>
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-brand-400 hover:text-brand-300 font-semibold transition-colors underline underline-offset-4 decoration-zinc-800 hover:decoration-brand-300"
            >
              Register here
            </Link>
          </p>
          <p className="text-xs text-zinc-500 mt-2">
            Your information is secure and encrypted.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
