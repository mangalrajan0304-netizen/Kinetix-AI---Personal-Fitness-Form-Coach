import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Target } from 'lucide-react';
import { ExerciseType } from '../types/workout';

interface WorkoutControlsProps {
  exercise: ExerciseType;
  onSelectExercise: (ex: ExerciseType) => void;
  isActive: boolean;
  onToggleActive: () => void;
  onReset: () => void;
  targetReps: number;
  onSelectTargetReps: (target: number) => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  sfxEnabled: boolean;
  onToggleSfx: () => void;
}

export const WorkoutControls: React.FC<WorkoutControlsProps> = ({
  exercise,
  onSelectExercise,
  isActive,
  onToggleActive,
  onReset,
  targetReps,
  onSelectTargetReps,
  voiceEnabled,
  onToggleVoice,
  sfxEnabled,
  onToggleSfx,
}) => {
  const exercises: Array<{ id: ExerciseType; name: string; tag: string; icon: string }> = [
    { id: 'squat', name: 'Squats', tag: 'Legs & Glutes', icon: '🦵' },
    { id: 'pushup', name: 'Push-ups', tag: 'Chest & Arms', icon: '💪' },
    { id: 'plank', name: 'Planks', tag: 'Core Stability', icon: '🛡️' },
  ];

  const targetPresets = exercise === 'plank' ? [30, 45, 60, 90] : [10, 15, 20, 30];

  return (
    <div className="bg-[#0e1626] border border-slate-800/80 rounded-2xl p-5 shadow-2xl flex flex-col gap-5 transition-colors">
      {/* Exercise Selection Segment */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-300 mb-2.5 font-bold">
          <span className="uppercase tracking-wider">Target Workout</span>
          <span className="text-[11px] font-normal text-slate-400">Select movement to track</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {exercises.map((item) => {
            const isSelected = exercise === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectExercise(item.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/80 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/50'
                    : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/90 hover:border-slate-700'
                }`}
              >
                <span className="text-xl mb-1">{item.icon}</span>
                <span className="text-xs font-extrabold text-white">{item.name}</span>
                <span className="text-[10px] text-slate-400 mt-0.5 font-medium">{item.tag}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Reps / Duration Presets */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-300 mb-2 font-bold">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>Set Goal ({exercise === 'plank' ? 'Seconds' : 'Reps'})</span>
          </span>
          <span className="text-emerald-400 font-mono-numbers font-bold">
            {targetReps} {exercise === 'plank' ? 'sec' : 'reps'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {targetPresets.map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onSelectTargetReps(val)}
              className={`flex-1 py-1.5 text-xs font-mono-numbers font-bold rounded-lg border transition-all ${
                targetReps === val
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Workout Playback Controls */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2.5">
        <button
          type="button"
          onClick={onToggleActive}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-extrabold tracking-wide transition-all shadow-xl ${
            isActive
              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/25'
              : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-emerald-400/25'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Workout</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start Workout</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          title="Reset Rep Counters & Stopwatch"
          className="flex items-center justify-center p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Audio Guidance Preferences */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
        <span className="text-slate-300 font-bold">Audio Feedback:</span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleVoice}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              voiceEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-slate-850 text-slate-400 hover:text-white'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Voice Coach</span>
          </button>

          <button
            type="button"
            onClick={onToggleSfx}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              sfxEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-850 text-slate-400 hover:text-white'
            }`}
          >
            <span>SFX Chimes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
