import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, Terminal, Play, Server, FileCode } from 'lucide-react';

interface FastApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FastApiModal: React.FC<FastApiModalProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0b101a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080d16]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-300 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
                Python FastAPI Backend Architecture
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span>FastAPI 0.115+</span>
                <span aria-hidden="true">·</span>
                <span>Pydantic v2 Models</span>
                <span aria-hidden="true">·</span>
                <span>Biomechanical Angle Engine</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Python Code'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download main.py</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/70 dark:bg-[#090e18] text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Python Source (backend/main.py)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('playground')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'playground'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Live API Playground</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('docs')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'docs'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>Endpoint Specifications</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-[#080d16]">
          {activeTab === 'code' && (
            <div className="relative">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-3 flex items-center justify-between font-medium">
                <span>Production FastAPI script with posture evaluation rules, CORS, and Pydantic validation:</span>
                <span className="font-mono text-cyan-700 dark:text-cyan-400 font-bold">uvicorn main:app --reload</span>
              </div>
              <pre className="font-mono text-xs text-slate-800 dark:text-slate-300 bg-white dark:bg-[#05080f] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto leading-relaxed max-h-[500px] shadow-xs">
                <code>{codeContent}</code>
              </pre>
            </div>
          )}

          {activeTab === 'playground' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">Target Endpoint:</span>
                  <select
                    value={selectedEndpoint}
                    onChange={(e: any) => setSelectedEndpoint(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-slate-800 dark:text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 font-bold"
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
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-xs"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isLoadingApi ? 'Executing...' : 'Send Test Request'}</span>
                </button>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Live Response Output:
                </div>
                <pre className="font-mono text-xs text-slate-900 dark:text-emerald-300 bg-white dark:bg-[#05080f] p-4 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto min-h-[220px] shadow-xs">
                  <code>{playgroundOutput}</code>
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-400 font-mono font-bold text-sm mb-1.5">
                  <span className="bg-cyan-100 dark:bg-cyan-950 px-2 py-0.5 rounded border border-cyan-300 dark:border-cyan-800/80">POST</span>
                  <span>/api/analyze-frame</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
                  Receives landmark coordinates from MediaPipe or browser pose tracking, processes angle rules (knee angle, elbow flexion, body alignment), checks for form errors (knee valgus, lumbar rounding, hip sag), and returns updated rep counts and real-time coaching feedback.
                </p>
                <div className="font-mono text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                  {`Request Body: { "exercise": "squat" | "pushup" | "plank", "landmarks": { "left_knee": {...}, "left_hip": {...} }, "session_id": "default" }`}
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-sm mb-1.5">
                  <span className="bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800/80">GET</span>
                  <span>/api/session-stats</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Fetches summary stats for the active workout session including total completed reps, calories burned, duration in seconds, average form score, and historical coaching notes.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-mono font-bold text-sm mb-1.5">
                  <span className="bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-800/80">POST</span>
                  <span>/api/reset-session</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  Resets counters, timers, and telemetry buffers to start a fresh set.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
