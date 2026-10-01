import React, { useState } from 'react';
import { CheckCircle2, Circle, Flame, Sparkles, Trophy, Calendar, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { coachAudio } from '../utils/audioCoach';

interface DailyTask {
  id: string;
  title: string;
  category: 'Strength' | 'Core' | 'Mobility' | 'Recovery';
  rewardXp: number;
  completed: boolean;
  autoCriteria?: string;
}

interface DailyTasksCardProps {
  reps: number;
  durationSeconds: number;
  exercise: string;
}

export const DailyTasksCard: React.FC<DailyTasksCardProps> = ({
  reps,
  durationSeconds,
  exercise,
}) => {
  const [tasks, setTasks] = useState<DailyTask[]>([
    {
      id: 'task-1',
      title: 'Complete 15 Parallel Squats below 90°',
      category: 'Strength',
      rewardXp: 50,
      completed: false,
    },
    {
      id: 'task-2',
      title: 'Hold 45-Second Strict Anti-Extension Plank',
      category: 'Core',
      rewardXp: 40,
      completed: false,
    },
    {
      id: 'task-3',
      title: 'Perform 10 Push-ups with 45° Elbow Tuck',
      category: 'Strength',
      rewardXp: 45,
      completed: false,
    },
    {
      id: 'task-4',
      title: 'Finish 2-Minute Pre-Workout Joint Mobility Routine',
      category: 'Mobility',
      rewardXp: 30,
      completed: true,
    },
    {
      id: 'task-5',
      title: 'Target Hydration: Replenish 500ml Cool Water',
      category: 'Recovery',
      rewardXp: 25,
      completed: false,
    },
  ]);

  const streakDays = 5;

  const toggleTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) => {
        if (t.id === id) {
          const newState = !t.completed;
          if (newState) {
            coachAudio.playRepCompleteChime();
            coachAudio.speak(`Quest completed: ${t.title}`);
          }
          return { ...t, completed: newState };
        }
        return t;
      });

      const completedCount = next.filter((t) => t.completed).length;
      if (completedCount === next.length) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#8b5cf6', '#ec4899', '#3b82f6'],
        });
        coachAudio.playMilestoneSound();
        coachAudio.speak('All daily fitness tasks completed! Outstanding discipline!');
      }

      return next;
    });
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);
  const totalXpEarned = tasks.filter((t) => t.completed).reduce((acc, t) => acc + t.rewardXp, 0);

  return (
    <div className="bg-[#120d28] border border-violet-800/60 rounded-2xl p-4 shadow-xl flex flex-col gap-3.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Daily Fitness Quests</span>
              <span className="text-[10px] text-violet-400 bg-violet-950/80 border border-violet-700/80 px-2 py-0.5 rounded-full font-mono font-bold">
                {completedCount}/{tasks.length} Done
              </span>
            </h4>
            <div className="text-[10px] text-violet-300/70">
              Consistency builds elite biomechanics
            </div>
          </div>
        </div>

        {/* Streak Pill */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold shadow-sm">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
          <span>{streakDays} Day Streak!</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-slate-300 font-medium">Daily Objective Progress</span>
          <span className="font-mono-numbers font-bold text-violet-300">{progressPct}% ({totalXpEarned} XP)</span>
        </div>
        <div className="w-full h-2 bg-slate-900/80 rounded-full overflow-hidden border border-violet-900/50">
          <div
            className="h-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Task Checklist Items */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
              task.completed
                ? 'bg-violet-950/30 border-violet-700/50 text-slate-300'
                : 'bg-[#0e0920] border-violet-900/40 hover:border-violet-700/80 text-white hover:bg-[#150d30]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {task.completed ? (
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              <span className={`text-xs font-semibold truncate ${task.completed ? 'line-through text-slate-400' : ''}`}>
                {task.title}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-900/60 text-violet-300 border border-violet-800/60 font-mono">
                +{task.rewardXp} XP
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
