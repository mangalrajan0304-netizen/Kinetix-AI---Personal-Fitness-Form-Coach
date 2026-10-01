import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, ArrowLeft, Play } from 'lucide-react';
import { ExerciseType } from '../types/workout';

interface ExerciseLibraryPageProps {
  currentExercise: ExerciseType;
  onSelectExerciseAndGoToStudio: (ex: ExerciseType) => void;
  onGoToPreviousPage: () => void;
  onGoToNextPage: () => void;
}

export const ExerciseLibraryPage: React.FC<ExerciseLibraryPageProps> = ({
  currentExercise,
  onSelectExerciseAndGoToStudio,
  onGoToPreviousPage,
  onGoToNextPage,
}) => {
  const [selectedEx, setSelectedEx] = useState<ExerciseType>(currentExercise);

  const exerciseGuides = {
    squat: {
      name: 'Bodyweight Squats',
      category: 'Compound Lower Body & Core Stability',
      icon: '🦵',
      muscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Erector Spinae', 'Abdominal Core'],
      keyAngle: 'Knee Flexion Angle',
      idealRange: '75° – 90° (Parallel or below)',
      lockout: '160° – 180° full extension',
      caloricRate: '0.35 kcal / rep',
      tempo: '2s down · 1s pause · 1s explode',
      techniqueCues: [
        'Set feet shoulder-width apart, toes flared slightly 15°-25° outward.',
        'Hinge at hips first, pushing hips backward like sitting in an ergonomic chair.',
        'Maintain proud, upright chest with neutral cervical spine throughout.',
        'Track knees directly over middle toes; actively prevent inward valgus collapse.',
        'Descend until crease of hip is at or below top of knee (90° parallel plane).',
        'Drive firmly through mid-foot and heels; squeeze glutes at the top lockout.'
      ],
      aiDetectionChecks: [
        {
          flaw: 'Knee Valgus (Inward Caving)',
          danger: 'High ACL and patellofemoral stress',
          aiFix: 'AI detects when knee distance is < 72% ankle distance and triggers instant warning "⚠️ Knees caving inward! Push outward inline with toes."'
        },
        {
          flaw: 'Excessive Torso Lean',
          danger: 'High lumbar shear stress',
          aiFix: 'AI tracks torso angle vs horizontal; triggers warning when torso collapses < 65°.'
        },
        {
          flaw: 'Shallow Depth (< 95°)',
          danger: 'Incomplete quad & glute hypertrophy stimulus',
          aiFix: 'AI holds rep count until knee angle breaks below 95° threshold.'
        }
      ]
    },
    pushup: {
      name: 'Standard Push-ups',
      category: 'Horizontal Upper Body Press & Plank',
      icon: '💪',
      muscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps Brachii', 'Serratus Anterior', 'Core Plank'],
      keyAngle: 'Elbow Joint Flexion',
      idealRange: '80° – 90° at bottom chest touch',
      lockout: '> 160° full elbow extension',
      caloricRate: '0.28 kcal / rep',
      tempo: '2s down · 0s pause · 1s push',
      techniqueCues: [
        'Hands placed slightly wider than shoulder-width, fingers spread firmly.',
        'Body forms one rigid straight line from crown of head to ankles.',
        'Elbows track backward at approximately a 45-degree angle (arrowhead shape).',
        'Inhale while lowering chest smoothly to roughly 2 inches off floor.',
        'Exhale and push floor away, locking out elbows without shrugging shoulders.'
      ],
      aiDetectionChecks: [
        {
          flaw: 'Sagging Lumbar Spine (Hips Dropping)',
          danger: 'Lumbar compression and loss of abdominal activation',
          aiFix: 'AI measures shoulder-hip-ankle line; warns "⚠️ Hips sagging! Engage glutes and core."'
        },
        {
          flaw: 'Piked Pelvis (Hips in the Air)',
          danger: 'Reduces weight load and shifts stress into traps',
          aiFix: 'AI flags excessive upward angle > 195° and advises "Lower hips into straight line."'
        },
        {
          flaw: 'Incomplete Lockout',
          danger: 'Misses triceps and serratus terminal activation',
          aiFix: 'AI requires elbow extension > 160° to credit the rep.'
        }
      ]
    },
    plank: {
      name: 'Isometric Forearm Plank',
      category: 'Anti-Extension Core Stability',
      icon: '🛡️',
      muscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Internal/External Obliques', 'Gluteal Complex'],
      keyAngle: 'Spinal Alignment Angle',
      idealRange: '170° – 180° straight axial alignment',
      lockout: 'Continuous isometric hold',
      caloricRate: '4.2 kcal / minute',
      tempo: 'Continuous isometric tension',
      techniqueCues: [
        'Forearms parallel on mat with elbows positioned directly under shoulders.',
        'Keep neck neutral by gazing gently at the floor between your forearms.',
        'Tuck pelvis into posterior pelvic tilt (contract glutes firmly).',
        'Draw belly button upward toward spine and breathe steadily without holding breath.',
        'Push actively into floor through forearms to engage serratus anterior.'
      ],
      aiDetectionChecks: [
        {
          flaw: 'Pelvic Anterior Tilt / Hip Dip',
          danger: 'Strain on facet joints in lower back',
          aiFix: 'AI detects angle dropping below 165° and pulses red alert warning.'
        },
        {
          flaw: 'Piked Butt (Pyramid Shape)',
          danger: 'Bypasses core isometric load',
          aiFix: 'AI detects angle peaking > 192° and halts timer accumulation.'
        }
      ]
    }
  };

  const current = exerciseGuides[selectedEx];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            Page 2 of 4 · Biomechanics & Anatomy
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Exercise Form & Angle Library
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Biomechanical angles, muscle maps, and computer-vision posture rules enforced by Kinetix AI.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectExerciseAndGoToStudio(selectedEx)}
          className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start {current.name} in Studio</span>
        </button>
      </div>

      {/* Exercise Selection Tabs */}
      <div className="grid grid-cols-3 gap-3">
        {(['squat', 'pushup', 'plank'] as ExerciseType[]).map((ex) => {
          const item = exerciseGuides[ex];
          const isSelected = selectedEx === ex;
          return (
            <button
              key={ex}
              type="button"
              onClick={() => setSelectedEx(ex)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#0e1626] border-emerald-500 ring-2 ring-emerald-500/30 shadow-lg'
                  : 'bg-[#0b101c] hover:bg-[#0e1626] border-slate-800 text-slate-300'
              }`}
            >
              <div className="text-2xl mb-1.5">{item.icon}</div>
              <div className="text-sm font-extrabold text-white">{item.name}</div>
              <div className="text-xs text-slate-400 mt-0.5">{item.keyAngle}</div>
            </button>
          );
        })}
      </div>

      {/* Main Breakdown Card */}
      <div className="bg-[#0e1626] border border-slate-800/80 rounded-2xl p-6 shadow-2xl space-y-6">
        {/* Metric Highlight Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 bg-[#0a0f19] border border-slate-800 rounded-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Target Flexion
            </div>
            <div className="text-lg font-black font-mono-numbers text-emerald-400">
              {current.idealRange}
            </div>
          </div>

          <div className="p-4 bg-[#0a0f19] border border-slate-800 rounded-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Lockout Angle
            </div>
            <div className="text-lg font-black font-mono-numbers text-cyan-400">
              {current.lockout}
            </div>
          </div>

          <div className="p-4 bg-[#0a0f19] border border-slate-800 rounded-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Caloric Burn Rate
            </div>
            <div className="text-lg font-black font-mono-numbers text-amber-400">
              {current.caloricRate}
            </div>
          </div>

          <div className="p-4 bg-[#0a0f19] border border-slate-800 rounded-xl">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Optimal Cadence
            </div>
            <div className="text-sm font-bold text-slate-200">
              {current.tempo}
            </div>
          </div>
        </div>

        {/* Primary Muscles */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-2.5">
            Primary Muscle Groups Targeted
          </h3>
          <div className="flex flex-wrap gap-2">
            {current.muscles.map((muscle) => (
              <span
                key={muscle}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold text-xs"
              >
                {muscle}
              </span>
            ))}
          </div>
        </div>

        {/* Step-by-Step Biomechanical Cues */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
            Execution Cues for Optimal Repetitions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {current.techniqueCues.map((cue, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#0a0f19] border border-slate-800 flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/40">
                  {idx + 1}
                </div>
                <span className="text-xs text-slate-200 font-medium leading-relaxed">
                  {cue}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Computer Vision Posture Rules */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
            Computer Vision Posture Rules & Fault Detection
          </h3>
          <div className="space-y-3">
            {current.aiDetectionChecks.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-xs"
              >
                <div className="flex items-center gap-2 text-rose-300 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{item.flaw}</span>
                  <span className="text-[11px] text-slate-300 font-normal">
                    — Risk: {item.danger}
                  </span>
                </div>
                <p className="text-slate-200 pl-6 text-xs leading-relaxed font-medium">
                  {item.aiFix}
                </p>
              </div>
            ))}
          </div>
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
          <span>Previous: Workout Studio</span>
        </button>

        <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
          Step 2 of 4: Form Guide
        </span>

        <button
          type="button"
          onClick={onGoToNextPage}
          className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-colors"
        >
          <span>Next Page: Session Analytics</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
