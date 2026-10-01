import React from 'react';
import { Activity, Flame, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { ExerciseType, FrameAnalysisResult } from '../types/workout';

interface MetricsCardsProps {
  exercise: ExerciseType;
  reps: number;
  targetReps: number;
  calories: number;
  durationSeconds: number;
  analysis: FrameAnalysisResult | null;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  exercise,
  reps,
  targetReps,
  calories,
  durationSeconds,
  analysis,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.round((reps / targetReps) * 100));

  // Determine form status presentation
  const isWarning = analysis && analysis.status === 'WARNING';
  const isGood = analysis && analysis.status === 'GOOD_FORM';

  let statusTitle = 'Awaiting Movement';
  let statusDetail = 'Stand into frame to initiate tracking';
  let statusColor = 'text-cyan-400';
  let statusBorder = 'border-slate-800/80 bg-[#0e1626]';

  if (isWarning) {
    statusTitle = 'Form Breakdown';
    statusDetail = analysis.form_message;
    statusColor = 'text-rose-400';
    statusBorder = 'border-rose-500/50 bg-rose-950/25 shadow-[0_0_20px_rgba(244,63,94,0.12)]';
  } else if (isGood) {
    statusTitle = 'Optimal Form';
    statusDetail = analysis.form_message;
    statusColor = 'text-emerald-400';
    statusBorder = 'border-emerald-500/40 bg-emerald-950/25 shadow-[0_0_20px_rgba(16,185,129,0.12)]';
  } else if (analysis) {
    statusTitle = analysis.phase.toUpperCase();
    statusDetail = analysis.form_message;
    statusColor = 'text-amber-400';
    statusBorder = 'border-amber-500/40 bg-amber-950/20';
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* 1. Total Reps Card */}
      <div className="bg-[#0e1626] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-bold uppercase tracking-wider text-slate-300">
            {exercise === 'plank' ? 'Hold Time' : 'Total Reps'}
          </span>
          <Activity className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="my-2 flex items-baseline gap-2">
          <span className="text-4xl font-black font-mono-numbers text-white tracking-tight">
            {reps}
          </span>
          <span className="text-xs text-slate-400 font-mono-numbers">
            / {targetReps} {exercise === 'plank' ? 'sec' : 'reps'}
          </span>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300 shadow-[0_0_8px_#10b981]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-2 text-[11px] text-slate-300 flex items-center justify-between">
          <span>Target Progress</span>
          <span className="font-mono-numbers text-emerald-400 font-bold">{progressPercent}%</span>
        </div>
      </div>

      {/* 2. Current Form Status Card */}
      <div className={`border rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all ${statusBorder}`}>
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-bold uppercase tracking-wider text-slate-300">Form Status</span>
          {isWarning ? (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          )}
        </div>

        <div className="my-2">
          <div className={`text-xl font-extrabold tracking-tight ${statusColor} line-clamp-1`}>
            {statusTitle}
          </div>
          <div className="text-xs text-slate-200 mt-1 line-clamp-2 leading-relaxed font-medium">
            {statusDetail}
          </div>
        </div>

        <div className="mt-auto text-[11px] text-slate-300 flex items-center gap-1.5">
          <span>Accuracy Score</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-numbers text-white font-bold text-xs">
            {analysis?.form_score ?? 98}%
          </span>
        </div>
      </div>

      {/* 3. Calories Burned Card */}
      <div className="bg-[#0e1626] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-bold uppercase tracking-wider text-slate-300">Energy Burned</span>
          <Flame className="w-4 h-4 text-amber-400" />
        </div>

        <div className="my-2 flex items-baseline gap-1.5">
          <span className="text-4xl font-black font-mono-numbers text-white tracking-tight">
            {calories.toFixed(1)}
          </span>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            kcal
          </span>
        </div>

        <div className="mt-auto text-[11px] text-slate-300 flex items-center gap-1.5">
          <span>MET Active Rate</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-numbers text-slate-200 font-semibold">
            {exercise === 'squat' ? '8.0 MET' : exercise === 'pushup' ? '8.2 MET' : '3.8 MET'}
          </span>
        </div>
      </div>

      {/* 4. Session Duration Card */}
      <div className="bg-[#0e1626] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-lg transition-all">
        <div className="flex items-center justify-between text-xs text-slate-300">
          <span className="font-bold uppercase tracking-wider text-slate-300">Session Time</span>
          <Clock className="w-4 h-4 text-cyan-400" />
        </div>

        <div className="my-2 flex items-baseline gap-2">
          <span className="text-4xl font-black font-mono-numbers text-white tracking-tight">
            {formatTime(durationSeconds)}
          </span>
          <span className="text-xs text-slate-400 uppercase font-mono-numbers">
            mm:ss
          </span>
        </div>

        <div className="mt-auto text-[11px] text-slate-300 flex items-center gap-1.5">
          <span>Pace Cadence</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-numbers text-cyan-400 font-semibold">
            {reps > 0 ? `${(durationSeconds / reps).toFixed(1)}s / rep` : 'Standby'}
          </span>
        </div>
      </div>
    </div>
  );
};
