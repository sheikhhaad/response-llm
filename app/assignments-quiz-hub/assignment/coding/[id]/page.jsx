"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { Play, ChevronLeft, FileCode, Terminal, Loader2, AlertCircle } from "lucide-react";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const assignmentId = Array.isArray(id) ? id[0] : id;

  const [assignment, setAssignment] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!assignmentId) return;

    const fetchAssignment = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/assignments/${assignmentId}`);
        const data = res.data;

        setAssignment(data);
        setCode(data?.starter_code || "");
      } catch (err) {
        console.error(err);
        setAssignment(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  const handleRun = async () => {
    setRunning(true);
    setOutput("Running code...");

    try {
      const res = await api.post(`/practice-code/submit`, {
        code,
        assignment_id: assignmentId,
        language: "python",
      });

      setOutput(typeof res.data === 'object' ? JSON.stringify(res.data, null, 2) : res.data);
    } catch (err) {
      setOutput(err?.response?.data?.detail || err?.message || "Execution Error");
    } finally {
      setRunning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-brand-500 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading assignment environment...</p>
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center glass-card p-12 rounded-2xl max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Assignment Not Found</h2>
          <button 
            onClick={() => router.back()}
            className="mt-6 px-6 py-2 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Navigation */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-brand-400 transition-colors mb-6 group"
        >
          <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Hub
        </button>

        {/* Header Section */}
        <div className="glass-card rounded-2xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FileCode className="w-24 h-24 text-brand-500" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-400 text-xs font-bold border border-brand-500/20 uppercase tracking-wider">
              Coding Assignment
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mb-3">{assignment.title}</h1>
          <p className="text-muted-foreground text-lg">{assignment.description}</p>
        </div>

        {/* Editor Section */}
        <div className="grid grid-cols-1 gap-6">
          <div className="glass-card rounded-2xl overflow-hidden border-border/50">
            <div className="px-6 py-3 border-b border-border/50 bg-foreground/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-brand-500" />
                <span className="text-sm font-bold text-foreground uppercase tracking-tight">main.py</span>
              </div>
              <button
                onClick={handleRun}
                disabled={running}
                className="flex items-center gap-2 px-6 py-2 bg-brand-500 text-white text-sm font-bold rounded-lg hover:bg-brand-600 transition-all active:scale-95 disabled:opacity-50"
              >
                {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                {running ? "Running..." : "Run Code"}
              </button>
            </div>
            
            <div className="relative group">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-foreground/5 border-r border-border/30 flex flex-col items-center pt-4 text-muted-foreground/30 font-mono text-xs select-none">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} className="h-6 leading-6">{i + 1}</div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                className="w-full h-80 pl-16 pr-6 py-4 bg-background/20 text-foreground font-mono text-sm resize-none focus:outline-none focus:ring-1 focus:ring-brand-500/50 transition-all placeholder:text-muted-foreground/30"
                placeholder="# Write your Python code here..."
              />
            </div>
          </div>

          {/* Console Section */}
          <div className="glass-card rounded-2xl overflow-hidden border-border/50">
            <div className="px-6 py-3 border-b border-border/50 bg-foreground/5 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-400" />
              <span className="text-sm font-bold text-foreground uppercase tracking-tight">Output Console</span>
            </div>
            <div className="p-6 bg-black/40 min-h-[160px] font-mono text-sm overflow-auto">
              {output ? (
                <pre className="text-brand-300 animate-in fade-in slide-in-from-top-1 duration-300 whitespace-pre-wrap">
                  {output}
                </pre>
              ) : (
                <p className="text-muted-foreground/40 italic">Run your code to see the output here...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
