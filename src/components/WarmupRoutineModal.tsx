import React, { useState, useEffect } from 'react';
import { X, Play, Pause, CheckCircle2, ChevronRight, Sparkles, Dumbbell } from 'lucide-react';
import { ExerciseType } from '../types/workout';
import { coachAudio } from '../utils/audioCoach';

interface WarmupRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: ExerciseType;
}

export const WarmupRoutineModal: React.FC<WarmupRoutineModalProps> = ({
  isOpen,
  onClose,
  exercise,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [stepTimer, setStepTimer] = useState<number>(30);
  const [isActive, setIsActive] = useState<boolean>(true);

  const routines: Record<ExerciseType, Array<{ name: string; duration: number; cue: string; icon: string }>> = {
    squat: [
      {
        name: 'Ankle Dorsiflexion Rocks',
        duration: 30,
        cue: 'Kneel and rock knee forward over middle toe while keeping heel glued to mat to unlock deep squat ankle mobility.',
        icon: '🦶',
      },
      {
        name: 'Hip 90/90 Internal & External Rotations',
        duration: 30,
        cue: 'Sit with both knees at 90-degree angles. Rotate through hips without rounding lower back.',
        icon: '🔄',
      },
      {
        name: 'Deep Goblet Squat Isometric Pry',
        duration: 30,
        cue: 'Sit into bottom of squat, push elbows against inside knees, and maintain an upright chest.',
        icon: '🦵',
      },
      {
        name: 'Glute Bridge Activation Pulses',
        duration: 30,
        cue: 'Drive through heels, squeeze glutes hard at the top, and lock ribs down.',
        icon: '⚡',
      },
    ],
    pushup: [
      {
        name: 'Wrist Extension & Quadruped Rocking',
        duration: 30,
        cue: 'Fingers forward, gently rock shoulders forward past wrists to warm up carpals and forearm flexors.',
        icon: '🤲',
      },
      {
        name: 'Scapular Push-ups (Serratus Activation)',
        duration: 30,
        cue: 'In high plank, pinch shoulder blades together, then push floor away without bending elbows.',
        icon: '📐',
      },
      {
        name: 'Doorway Pec & Bicep Stretch',
        duration: 30,
        cue: 'Open chest muscles with light rotational breathing to prevent shoulder impingement.',
        icon: '💪',
      },
      {
        name: 'Downward Dog to Plank Drive',
        duration: 30,
        cue: 'Stretch posterior chain and warm up anterior deltoids and core.',
        icon: '🐕',
      },
    ],
    plank: [
      {
        name: 'Cat-Cow Spinal Articulations',
        duration: 30,
        cue: 'Inhale to arch spine (cow), exhale to tuck tailbone and push floor away (cat).',
        icon: '🐈',
      },
      {
        name: 'Bird-Dog Cross Core Holds',
        duration: 30,
        cue: 'Extend opposite arm and leg while keeping hips perfectly level with floor.',
        icon: '🦅',
      },
      {
        name: 'Deadbug Core Brace Pulses',
        duration: 30,
        cue: 'Press lumbar spine flat into the deck and extend opposite limb under deep control.',
        icon: '🛡️',
      },
      {
        name: 'Forearm Hollow Body Isometric',
        duration: 30,
        cue: 'Tuck pelvis, contract abdominals, and prime core for strict plank stability.',
        icon: '🔥',
      },
    ],
  };

  const steps = routines[exercise] || routines.squat;
  const currentStep = steps[currentStepIdx];

  useEffect(() => {
    if (!isOpen || !isActive) return;

    const timer = setInterval(() => {
      setStepTimer((prev) => {
        if (prev <= 1) {
          coachAudio.playRepCompleteChime();
          if (currentStepIdx < steps.length - 1) {
            setCurrentStepIdx((idx) => idx + 1);
            coachAudio.speak(`Next drill: ${steps[currentStepIdx + 1].name}`);
            return steps[currentStepIdx + 1].duration;
          } else {
            coachAudio.speak('Mobility warm-up complete! You are primed to perform.');
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isActive, currentStepIdx, steps]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e1626] border border-slate-800 rounded-3xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a0f19]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Pre-Workout Joint Mobility Routine
              </h3>
              <div className="text-xs text-slate-400">
                2-Minute dynamic activation for {exercise.toUpperCase()}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Active Step Card */}
          <div className="p-6 bg-[#0a0f19] border border-slate-800 rounded-2xl flex flex-col items-center text-center space-y-4">
            <div className="text-5xl">{currentStep.icon}</div>

            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                Drill {currentStepIdx + 1} of {steps.length}
              </div>
              <h4 className="text-xl font-extrabold text-white">
                {currentStep.name}
              </h4>
            </div>

            <p className="text-xs text-slate-300 max-w-md leading-relaxed font-medium">
              {currentStep.cue}
            </p>

            {/* Big Countdown */}
            <div className="text-5xl font-black font-mono-numbers text-white">
              00:{stepTimer.toString().padStart(2, '0')}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-2 transition-colors border border-slate-700"
              >
                {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isActive ? 'Pause' : 'Resume'}</span>
              </button>

              {currentStepIdx < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    const next = currentStepIdx + 1;
                    setCurrentStepIdx(next);
                    setStepTimer(steps[next].duration);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Skip Drill</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs transition-colors"
                >
                  Start Workout!
                </button>
              )}
            </div>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="grid grid-cols-4 gap-2">
            {steps.map((st, i) => (
              <div
                key={i}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  i === currentStepIdx
                    ? 'bg-emerald-500/20 border-emerald-500/80 text-emerald-300'
                    : i < currentStepIdx
                    ? 'bg-slate-900 border-slate-800 text-slate-500'
                    : 'bg-[#0a0f19] border-slate-800/80 text-slate-400'
                }`}
              >
                <div className="text-[10px] font-bold uppercase truncate">
                  {st.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
