import React from 'react';
import { Download, ArrowLeft, ArrowRight, Activity, Flame, Clock, Award } from 'lucide-react';
import { RepHistoryItem } from '../types/workout';

interface SessionAnalyticsPageProps {
  exercise: string;
  totalReps: number;
  calories: number;
  durationSeconds: number;
  avgScore: number;
  history: RepHistoryItem[];
  onGoToPreviousPage: () => void;
  onGoToNextPage: () => void;
}

export const SessionAnalyticsPage: React.FC<SessionAnalyticsPageProps> = ({
  exercise,
  totalReps,
  calories,
  durationSeconds,
  avgScore,
  history,
  onGoToPreviousPage,
  onGoToNextPage,
}) => {
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
    a.download = `kinetix-session-${exercise}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            Page 3 of 4 · Telemetry & Metrics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Workout Session Analytics
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Telemetry metrics, rep completion ledger, and biomechanical scores for {exercise.toUpperCase()}.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportJSON}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 border border-slate-700 shadow-md transition-colors"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export Telemetry (JSON)</span>
        </button>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-[#0e1626] border border-slate-800/80 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Completed Reps</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono-numbers text-white">
            {totalReps}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Tracked in current active set
          </div>
        </div>

        <div className="p-5 bg-[#0e1626] border border-slate-800/80 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Session Time</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono-numbers text-white">
            {formatTime(durationSeconds)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Pace: {totalReps > 0 ? `${(durationSeconds / totalReps).toFixed(1)}s / rep` : 'Standby'}
          </div>
        </div>

        <div className="p-5 bg-[#0e1626] border border-slate-800/80 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Energy Burned</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-mono-numbers text-white">
            {calories.toFixed(1)} <span className="text-sm font-semibold text-amber-400">kcal</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Based on active MET calculations
          </div>
        </div>

        <div className="p-5 bg-[#0e1626] border border-slate-800/80 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider">Mean Form Score</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono-numbers text-emerald-400">
            {avgScore}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Optimal posture alignment rating
          </div>
        </div>
      </div>

      {/* Repetition-by-Repetition Ledger */}
      <div className="bg-[#0e1626] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Repetition-by-Repetition Verification Ledger
          </h3>
          <span className="text-xs font-mono-numbers text-slate-400">
            {history.length} logged
          </span>
        </div>

        <div className="border border-slate-800 rounded-xl overflow-hidden bg-[#0a0f19]">
          {history.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No individual repetitions logged yet. Return to the Workout Studio to begin your set!
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[11px] font-bold">
                <tr>
                  <th className="py-3 px-4">Rep Index</th>
                  <th className="py-3 px-4">Elapsed Time</th>
                  <th className="py-3 px-4">Min Angle</th>
                  <th className="py-3 px-4">Form Score</th>
                  <th className="py-3 px-4">Biomechanical Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {history.map((rep) => (
                  <tr key={rep.repNumber} className="hover:bg-slate-850 transition-colors">
                    <td className="py-2.5 px-4 font-mono-numbers font-bold text-white">
                      #{rep.repNumber}
                    </td>
                    <td className="py-2.5 px-4 font-mono-numbers text-slate-300">
                      {formatTime(rep.time)}
                    </td>
                    <td className="py-2.5 px-4 font-mono-numbers text-cyan-400 font-semibold">
                      {rep.minAngle}°
                    </td>
                    <td className="py-2.5 px-4">
                      <span className={`font-mono-numbers font-bold ${rep.formScore >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {rep.formScore}%
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-200 font-medium">
                      {rep.feedback}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Bottom Page Navigation Bar ("Click go to next page") */}
      <div className="flex items-center justify-between p-4 bg-[#0e1626] border border-slate-800 rounded-2xl shadow-xl">
        <button
          type="button"
          onClick={onGoToPreviousPage}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous: Form Guide</span>
        </button>

        <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
          Step 3 of 4: Analytics
        </span>

        <button
          type="button"
          onClick={onGoToNextPage}
          className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-colors"
        >
          <span>Next Page: Related Gear & Items</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
