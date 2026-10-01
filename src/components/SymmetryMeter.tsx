import React from 'react';
import { Scale, Zap, Activity } from 'lucide-react';

interface SymmetryMeterProps {
  exercise: string;
  reps: number;
  durationSeconds: number;
}

export const SymmetryMeter: React.FC<SymmetryMeterProps> = ({
  exercise,
  reps,
  durationSeconds,
}) => {
  // Compute subtle real-time simulated symmetry based on reps and cadence
  const leftBalance = Math.min(54, Math.max(47, 50 + Math.sin(reps * 1.3) * 2.5));
  const rightBalance = 100 - leftBalance;

  // Velocity stability index
  const cadenceSeconds = reps > 0 ? durationSeconds / reps : 3.0;
  const stabilityIndex = Math.min(99, Math.max(82, Math.round(96 - (reps > 15 ? (reps - 15) * 0.8 : 0))));

  return (
    <div className="bg-[#0e1626] border border-slate-800/80 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Biomechanical Symmetry & Power Index
            </h4>
            <div className="text-[10px] text-slate-400">
              Left-Right kinetic weight balance & power velocity
            </div>
          </div>
        </div>

        <span className="text-[11px] font-mono-numbers text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
          {stabilityIndex}% Stable
        </span>
      </div>

      {/* Balance Bar */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-mono-numbers text-slate-300 mb-1">
          <span className="font-semibold text-emerald-400">L: {leftBalance.toFixed(1)}%</span>
          <span className="text-slate-400 text-[10px]">Optimal 50/50 Plane</span>
          <span className="font-semibold text-cyan-400">R: {rightBalance.toFixed(1)}%</span>
        </div>

        {/* Visual Dual Balance Bar */}
        <div className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
            style={{ width: `${leftBalance}%` }}
          />
          <div
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
            style={{ width: `${rightBalance}%` }}
          />
          {/* Center alignment notch */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/70 -translate-x-1/2" />
        </div>
      </div>

      {/* Velocity Cadence Meter */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div className="p-2.5 bg-[#0a0f19] border border-slate-800/80 rounded-xl flex items-center justify-between">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Rep Speed</span>
          <span className="text-white font-mono-numbers font-extrabold">
            {reps > 0 ? `${cadenceSeconds.toFixed(1)}s/rep` : '3.2s'}
          </span>
        </div>

        <div className="p-2.5 bg-[#0a0f19] border border-slate-800/80 rounded-xl flex items-center justify-between">
          <span className="text-slate-400 text-[10px] uppercase font-bold">Kinetic Load</span>
          <span className="text-emerald-400 font-mono-numbers font-extrabold">
            Balanced
          </span>
        </div>
      </div>
    </div>
  );
};
