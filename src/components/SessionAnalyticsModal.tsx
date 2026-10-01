import React from 'react';
import { X, BarChart3, Download } from 'lucide-react';
import { RepHistoryItem } from '../types/workout';

interface SessionAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: string;
  totalReps: number;
  calories: number;
  durationSeconds: number;
  avgScore: number;
  history: RepHistoryItem[];
}

export const SessionAnalyticsModal: React.FC<SessionAnalyticsModalProps> = ({
  isOpen,
  onClose,
  exercise,
  totalReps,
  calories,
  durationSeconds,
  avgScore,
  history,
}) => {
  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleExportJSON = () => {
    const data = {
      exercise,
      totalReps,
      caloriesBurned: calories,
      durationSeconds,
      averageFormScore: avgScore,
      reps: history,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kinetix-workout-${exercise}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0b101a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080d16]">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
                Workout Session Telemetry
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Exercise: {exercise.toUpperCase()}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-slate-50 dark:bg-[#080d16] text-xs">
          {/* Summary Metric Strip */}
          <div className="grid grid-cols-4 gap-2.5">
            <div className="p-3 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-center shadow-xs">
              <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">Reps Logged</div>
              <div className="text-2xl font-black font-mono-numbers text-slate-900 dark:text-white">{totalReps}</div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-center shadow-xs">
              <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">Duration</div>
              <div className="text-2xl font-black font-mono-numbers text-cyan-600 dark:text-cyan-400">{formatTime(durationSeconds)}</div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-center shadow-xs">
              <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">Calories</div>
              <div className="text-2xl font-black font-mono-numbers text-amber-600 dark:text-amber-400">{calories.toFixed(1)}</div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl text-center shadow-xs">
              <div className="text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-wider mb-1 font-semibold">Avg Form</div>
              <div className="text-2xl font-black font-mono-numbers text-emerald-600 dark:text-emerald-400">{avgScore}%</div>
            </div>
          </div>

          {/* Reps breakdown table */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              <span>Completed Repetition Ledger</span>
              <span className="text-slate-400 font-normal">Real-time biomechanical analysis</span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900/40 shadow-xs">
              {history.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No individual repetitions recorded in current set yet.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Rep #</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Form Score</th>
                      <th className="py-2.5 px-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {history.map((rep) => (
                      <tr key={rep.repNumber} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="py-2 px-3 font-mono-numbers font-bold text-slate-900 dark:text-white">#{rep.repNumber}</td>
                        <td className="py-2 px-3 font-mono-numbers text-slate-500 dark:text-slate-400">{formatTime(rep.time)}</td>
                        <td className="py-2 px-3">
                          <span className={`font-mono-numbers font-semibold ${rep.formScore >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                            {rep.formScore}%
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-300 font-medium">{rep.feedback}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-2 text-xs font-semibold shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Session Telemetry (JSON)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
