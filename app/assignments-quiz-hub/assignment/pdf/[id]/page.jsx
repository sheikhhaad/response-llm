"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { Play, ChevronLeft, FileText, Terminal, Loader2, Maximize2, Monitor } from "lucide-react";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const assignmentId = Array.isArray(id) ? id[0] : id;

  const [pdfUrl, setPdfUrl] = useState("");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!assignmentId) return;

    const fetchFile = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/assignments/${assignmentId}/file`, {
          responseType: "blob",
        });

        const file = new Blob([res.data], { type: "application/pdf" });
        const url = URL.createObjectURL(file);

        setPdfUrl(url);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
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

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Navbar */}
      <div className="h-14 border-b border-border bg-foreground/5 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-foreground/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="h-4 w-[1px] bg-border"></div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-bold text-foreground truncate max-w-[200px]">PDF Assignment</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 px-4 py-1.5 bg-brand-500 text-white text-xs font-bold rounded-lg hover:bg-brand-600 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-brand-500/20"
          >
            {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            {running ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT - PDF Viewer */}
        <div className="w-1/2 flex flex-col border-r border-border bg-black/20">
          <div className="px-4 py-2 bg-foreground/5 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Document Preview</span>
            </div>
          </div>
          <div className="flex-1 bg-zinc-800/50">
            {pdfUrl ? (
              <iframe src={pdfUrl} className="w-full h-full border-none" title="Assignment PDF" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                <p className="text-muted-foreground text-sm">Loading document...</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT - Editor & Console */}
        <div className="w-1/2 flex flex-col bg-background/50 backdrop-blur-sm">
          
          {/* Editor Header */}
          <div className="px-4 py-2 bg-foreground/5 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-brand-500" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Python Editor</span>
            </div>
            <Maximize2 className="w-3 h-3 text-muted-foreground hover:text-foreground cursor-pointer" />
          </div>

          {/* Code Editor */}
          <div className="flex-1 relative flex">
            <div className="w-10 bg-foreground/5 border-r border-border/20 flex flex-col items-center pt-4 text-[10px] font-mono text-muted-foreground/20 select-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="h-5 leading-5">{i + 1}</div>
              ))}
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck="false"
              className="flex-1 bg-transparent p-4 font-mono text-sm text-foreground focus:outline-none resize-none placeholder:text-muted-foreground/20"
              placeholder="# Enter your Python solution here..."
            />
          </div>

          {/* Console Area */}
          <div className="h-1/3 border-t border-border flex flex-col bg-black/40">
            <div className="px-4 py-1.5 bg-foreground/5 border-b border-border/50 flex items-center gap-2">
              <Terminal className="w-3 h-3 text-brand-400" />
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Output</span>
            </div>
            <div className="flex-1 p-4 font-mono text-xs overflow-auto">
              {output ? (
                <pre className="text-brand-300 whitespace-pre-wrap">{output}</pre>
              ) : (
                <p className="text-muted-foreground/20 italic">No output yet. Click 'Run' to execute code.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}