import React, { useState, useEffect } from 'react';
import { Server, Copy, Check, Download, Terminal, Play, FileCode, ArrowLeft, ArrowRight } from 'lucide-react';

interface FastApiPageProps {
  onGoToPreviousPage: () => void;
  onGoToNextPage: () => void;
}

export const FastApiPage: React.FC<FastApiPageProps> = ({
  onGoToPreviousPage,
  onGoToNextPage,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'playground' | 'docs'>('code');
  const [codeContent, setCodeContent] = useState<string>('');
  const [playgroundOutput, setPlaygroundOutput] = useState<string>('Press "Send Test Request" to execute an endpoint.');
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<'analyze' | 'stats' | 'reset'>('analyze');

  useEffect(() => {
    fetch('/api/fastapi-code')
      .then((res) => res.json())
      .then((data) => {
        if (data.code) {
          setCodeContent(data.code);
        }
      })
      .catch(() => {
        setCodeContent('# FastAPI Backend Code ready in backend/main.py');
      });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codeContent], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const runPlaygroundTest = async () => {
    setIsLoadingApi(true);
    try {
      if (selectedEndpoint === 'analyze') {
        const payload = {
          exercise: 'squat',
          sessionId: 'default',
          landmarks: {
            left_hip: { x: 0.45, y: 0.60, visibility: 0.99 },
            left_knee: { x: 0.43, y: 0.75, visibility: 0.99 },
            left_ankle: { x: 0.42, y: 0.90, visibility: 0.99 },
            left_shoulder: { x: 0.48, y: 0.35, visibility: 0.99 },
            right_knee: { x: 0.57, y: 0.75, visibility: 0.99 },
            right_ankle: { x: 0.58, y: 0.90, visibility: 0.99 },
          }
        };
        const res = await fetch('/api/analyze-frame', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        setPlaygroundOutput(`HTTP 200 OK\nPOST /api/analyze-frame\n\n${JSON.stringify(data, null, 2)}`);
      } else if (selectedEndpoint === 'stats') {
        const res = await fetch('/api/session-stats?session_id=default');
        const data = await res.json();
        setPlaygroundOutput(`HTTP 200 OK\nGET /api/session-stats\n\n${JSON.stringify(data, null, 2)}`);
      } else {
        const res = await fetch('/api/reset-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: 'default', exercise: 'squat' })
        });
        const data = await res.json();
        setPlaygroundOutput(`HTTP 200 OK\nPOST /api/reset-session\n\n${JSON.stringify(data, null, 2)}`);
      }
    } catch (err: any) {
      setPlaygroundOutput(`Error calling endpoint: ${err.message}`);
    } finally {
      setIsLoadingApi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            Page 4 of 4 · Backend Architecture
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Python FastAPI Server Architecture & Endpoints
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Production Python FastAPI script with Pydantic validation, CORS middleware, and biomechanical posture evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-xl border border-slate-700 shadow-md transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
            <span>{copied ? 'Copied' : 'Copy Python Code'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download main.py</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#0e1626] rounded-xl w-fit text-xs border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('code')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'code'
              ? 'bg-slate-800 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span>Python Source (backend/main.py)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('playground')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'playground'
              ? 'bg-slate-800 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Interactive API Console</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('docs')}
          className={`px-4 py-2 font-bold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'docs'
              ? 'bg-slate-800 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Server className="w-4 h-4 text-amber-400" />
          <span>Endpoint Specs</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="bg-[#0e1626] border border-slate-800/80 rounded-2xl p-6 shadow-2xl">
        {activeTab === 'code' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
              <span>Production FastAPI script ready to execute:</span>
              <span className="font-mono text-cyan-300 font-bold bg-cyan-950 px-2.5 py-1 rounded-md border border-cyan-800">
                uvicorn main:app --reload --port 8000
              </span>
            </div>
            <pre className="font-mono text-xs text-slate-200 bg-[#060a12] p-5 rounded-2xl border border-slate-800 overflow-x-auto leading-relaxed max-h-[550px]">
              <code>{codeContent}</code>
            </pre>
          </div>
        )}

        {activeTab === 'playground' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0a0f19] rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-200">Select Endpoint:</span>
                <select
                  value={selectedEndpoint}
                  onChange={(e: any) => setSelectedEndpoint(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  <option value="analyze">POST /api/analyze-frame</option>
                  <option value="stats">GET /api/session-stats</option>
                  <option value="reset">POST /api/reset-session</option>
                </select>
              </div>

              <button
                type="button"
                onClick={runPlaygroundTest}
                disabled={isLoadingApi}
                className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold transition-colors flex items-center gap-2 disabled:opacity-50 shadow-md"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isLoadingApi ? 'Calling...' : 'Send Test Request'}</span>
              </button>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Response Payload:
              </div>
              <pre className="font-mono text-xs text-emerald-300 bg-[#060a12] p-5 rounded-xl border border-slate-800 overflow-x-auto min-h-[260px] leading-relaxed">
                <code>{playgroundOutput}</code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-4 text-xs">
            <div className="p-5 bg-[#0a0f19] border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm mb-2">
                <span className="bg-cyan-950 px-2.5 py-0.5 rounded border border-cyan-800">POST</span>
                <span>/api/analyze-frame</span>
              </div>
              <p className="text-slate-300 mb-3 leading-relaxed">
                Processes joint landmark coordinates from MediaPipe or browser camera, calculates joint flexion angles (knee, elbow, or spinal alignment), checks for postural breakdown flaws, and returns the real-time repetition count, form status, and coaching cues.
              </p>
              <div className="font-mono text-[11px] text-slate-300 bg-[#060a12] p-3 rounded-lg border border-slate-800">
                {`Request: { "exercise": "squat" | "pushup" | "plank", "landmarks": { "left_knee": {...}, "left_hip": {...} }, "session_id": "default" }`}
              </div>
            </div>

            <div className="p-5 bg-[#0a0f19] border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm mb-2">
                <span className="bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">GET</span>
                <span>/api/session-stats</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Fetches session telemetry including total reps, active duration in seconds, calories burned, mean form score, and historical feedback log.
              </p>
            </div>

            <div className="p-5 bg-[#0a0f19] border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-sm mb-2">
                <span className="bg-amber-950 px-2.5 py-0.5 rounded border border-amber-800">POST</span>
                <span>/api/reset-session</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Resets repetition counters, stopwatch, and posture analysis buffers for a fresh set.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Page Navigation Bar */}
      <div className="flex items-center justify-between p-4 bg-[#0e1626] border border-slate-800 rounded-2xl shadow-xl">
        <button
          type="button"
          onClick={onGoToPreviousPage}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous: Session Analytics</span>
        </button>

        <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
          Step 4 of 4: FastAPI Backend
        </span>

        <button
          type="button"
          onClick={onGoToNextPage}
          className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-colors"
        >
          <span>Return to Workout Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
