"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Mail,
  User,
  CreditCard,
  Phone,
  CheckSquare,
} from "lucide-react";
import axios from "axios";
import api from "@/lib/api";
import { PageTransition } from "../components/PageTransition";
import { LoadingButton } from "../components/Loading";

export default function EntryScreen() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // State for checkbox
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

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, cnic, phone, password } = formData;

    // Set shazaib_student based on checkbox
    const shazaib_student = isChecked;

    // validation
    if (!name || !email || !cnic || !phone || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (!shazaib_student) {
      alert("Please confirm that you are a Shazaib student.");
      return;
    }

    const rollNumber = Math.floor(Math.random() * 1000000);

    try {
      setIsSubmitting(true);

      const res = await api.post("/auth/register", {
        ...formData,
        rollNumber,
        shazaib_student, // Send checkbox value
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

            {/* CNIC Field */}
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
                onBlur={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  if (raw.length === 13) {
                    const formatted = `${raw.slice(0, 5)}-${raw.slice(5, 12)}-${raw.slice(12)}`;
                    setFormData((prev) => ({ ...prev, cnic: formatted }));
                  }
                }}
              />
            </div>

            {/* Contact Field */}
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

            {/* Password Field */}
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
                autoComplete="new-password"
                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-xl py-3 pl-11 pr-4
                           text-white placeholder-zinc-500 focus:outline-none focus:ring-2
                           focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                placeholder="Create new Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* Checkbox Field */}
            <div className="flex items-start gap-3 pt-2">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="shazaib_student"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 
                           text-brand-500 focus:ring-brand-500 focus:ring-2 
                           focus:ring-offset-0 focus:ring-offset-transparent
                           cursor-pointer"
                />
              </div>
              <label
                htmlFor="shazaib_student"
                className="text-sm text-zinc-300 cursor-pointer select-none"
              >
                I confirm that I am a{" "}
                <span className="text-brand-400 font-semibold">
                  Shazaib Student
                </span>
              </label>
            </div>
          </div>

          <LoadingButton
            type="submit"
            isLoading={isSubmitting}
            loadingText="Processing..."
            disabled={!isChecked}
            className="w-full py-3 px-4 bg-brand-500 hover:bg-brand-400 text-brand-950 font-semibold rounded-xl"
          >
            <span>Continue</span>
            <ArrowRight size={18} />
          </LoadingButton>
        </form>

        <div className="flex flex-col items-center gap-2 text-sm text-zinc-400 text-center">
          <p>
            Already have an account?{" "}
            <Link
              href="/"
              className="text-brand-400 hover:text-brand-300 font-semibold transition-colors underline underline-offset-4 decoration-zinc-800 hover:decoration-brand-300"
            >
              Login here
            </Link>
          </p>
          <p className="text-xs text-zinc-500 mt-2">
            Your information is secure and will only be used for verification.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}
