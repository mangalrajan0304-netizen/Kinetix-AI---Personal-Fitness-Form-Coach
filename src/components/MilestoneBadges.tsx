import React from 'react';
import { Award, Shield, Zap, Flame, Trophy } from 'lucide-react';

interface MilestoneBadgesProps {
  reps: number;
  calories: number;
  formScore: number;
  targetReps: number;
}

export const MilestoneBadges: React.FC<MilestoneBadgesProps> = ({
  reps,
  calories,
  formScore,
  targetReps,
}) => {
  const badges = [
    {
      id: 'first_rep',
      name: 'Ignition',
      desc: 'First clean repetition verified',
      icon: '⚡',
      unlocked: reps >= 1,
    },
    {
      id: 'form_master',
      name: 'Form Virtuoso',
      desc: 'Form accuracy maintained > 95%',
      icon: '✨',
      unlocked: formScore >= 95 && reps >= 3,
    },
    {
      id: 'halfway',
      name: 'Midway Drive',
      desc: 'Crossed 50% of workout target',
      icon: '🎯',
      unlocked: reps >= Math.ceil(targetReps / 2),
    },
    {
      id: 'calorie_burn',
      name: 'Energy Forge',
      desc: 'Burned 5+ active kcal',
      icon: '🔥',
      unlocked: calories >= 5.0,
    },
    {
      id: 'target_met',
      name: 'Set Victor',
      desc: 'Completed full target repetition set',
      icon: '🏆',
      unlocked: reps >= targetReps,
    },
  ];

  return (
    <div className="bg-[#0e1626] border border-slate-800/80 rounded-2xl p-4 shadow-xl flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Session Achievements & Badges</span>
        </div>
        <span className="text-[11px] font-mono-numbers text-slate-400">
          {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {badges.map((b) => (
          <div
            key={b.id}
            className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
              b.unlocked
                ? 'bg-gradient-to-b from-amber-500/15 to-transparent border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.15)] text-white'
                : 'bg-slate-900/40 border-slate-800/80 opacity-40 text-slate-400'
            }`}
          >
            <span className="text-xl mb-1">{b.icon}</span>
            <span className="text-[11px] font-extrabold line-clamp-1">{b.name}</span>
            <span className="text-[9px] text-slate-400 mt-0.5 line-clamp-1 leading-tight">{b.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
