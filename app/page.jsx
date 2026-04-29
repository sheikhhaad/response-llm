"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Mail, User, CreditCard, Phone, Users } from "lucide-react";
import { PageTransition } from "./components/PageTransition";
import axios from "axios";
import api from "@/lib/api";

export default function EntryScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cnic: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, cnic, phone, password } = formData;

    // validation
    if (!name || !email || !cnic || !phone || !password) {
      alert("Please fill in all fields.");
      return;
    }

    const rollNumber = Math.floor(Math.random() * 1000000);

    try {
      setIsSubmitting(true);

      const res = await api.post("/auth/register", {
        ...formData,
        rollNumber,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageTransition className="justify-center items-center">
      <div
        // Fallback for undefined glass-card class
        className="w-full max-w-md rounded-2xl p-8 flex flex-col gap-8
                   bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 shadow-xl"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400 mb-2">
            <ArrowRight size={24} className="-rotate-45" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-zinc-400">
            Enter your details to access the workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            {/* Name Field */}
            <div className="relative">
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                <User size={18} />
              </div>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl py-3 pl-11 pr-4
                           text-white placeholder-zinc-500 focus:outline-none focus:ring-2
                           focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* CNIC Field - NEW */}
            <div className="relative">
              <label htmlFor="cnic" className="sr-only">
                CNIC Number
              </label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                <CreditCard size={18} />
              </div>
              <input
                id="cnic"
                type="text"
                required
                placeholder="CNIC (e.g., 3520212345678)"
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl py-3 pl-11 pr-4
                           text-white placeholder-zinc-500 focus:outline-none focus:ring-2
                           focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                value={formData.cnic}
                onChange={handleChange}
                // Format on blur (add dashes for readability)
                onBlur={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  if (raw.length === 13) {
                    const formatted = `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12)}`;
                    setFormData((prev) => ({ ...prev, cnic: formatted }));
                  }
                }}
              />
            </div>

            {/* Contact Field - NEW */}
            <div className="relative">
              <label htmlFor="phone" className="sr-only">
                Contact Number
              </label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                <Phone size={18} />
              </div>
              <input
                id="phone"
                type="tel"
                required
                placeholder="Mobile (e.g., 03001234567)"
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl py-3 pl-11 pr-4
                           text-white placeholder-zinc-500 focus:outline-none focus:ring-2
                           focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                value={formData.phone}
                onChange={handleChange}
                onBlur={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  if (raw.length === 11 && raw.startsWith("03")) {
                    const formatted = `${raw.slice(0, 4)}-${raw.slice(4)}`;
                    setFormData((prev) => ({ ...prev, phone: formatted }));
                  }
                }}
              />
            </div>

            {/* Email Field */}
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl py-3 pl-11 pr-4
                           text-white placeholder-zinc-500 focus:outline-none focus:ring-2
                           focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Create Password
              </label>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                <User size={18} />
              </div>
              <input
                id="password"
                type="password"
                required
                autoComplete="password"
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl py-3 pl-11 pr-4
                           text-white placeholder-zinc-500 focus:outline-none focus:ring-2
                           focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                placeholder="Create new Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-brand-500 hover:bg-brand-400 text-brand-950
                       font-semibold rounded-xl flex items-center justify-center gap-2
                       transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Optional small note */}
        <p className="text-xs text-center text-zinc-500">
          Your information is secure and will only be used for verification.
        </p>
      </div>
    </PageTransition>
  );
}
