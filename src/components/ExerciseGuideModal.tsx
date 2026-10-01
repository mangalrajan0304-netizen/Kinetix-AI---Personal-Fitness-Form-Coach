import React from 'react';
import { X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ExerciseType } from '../types/workout';

interface ExerciseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedExercise: ExerciseType;
  onSelectExercise: (ex: ExerciseType) => void;
}

export const ExerciseGuideModal: React.FC<ExerciseGuideModalProps> = ({
  isOpen,
  onClose,
  selectedExercise,
  onSelectExercise,
}) => {
  if (!isOpen) return null;

  const exerciseGuides = {
    squat: {
      name: 'Bodyweight Squats',
      category: 'Compound Lower Body & Core',
      muscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Erector Spinae', 'Core'],
      keyAngle: 'Knee Flexion (Femur to Tibia)',
      idealRange: '75° – 90° (Parallel or below)',
      lockout: '160° – 180° full hip extension',
      caloricRate: '~0.35 kcal per completed rep',
      techniqueCues: [
        'Set feet shoulder-width apart, toes flared slightly 15°-30° outward.',
        'Hinge at hips first, pushing hips backward like sitting in a chair.',
        'Maintain proud, upright chest with neutral spine throughout.',
        'Track knees directly over middle toes; actively prevent valgus collapse.',
        'Descend until crease of hip is at or below top of knee (90° parallel).',
        'Drive through mid-foot and heels; squeeze glutes at the top lockout.'
      ],
      aiDetectionChecks: [
        {
          flaw: 'Knee Valgus (Inward Caving)',
          danger: 'High ACL and patellofemoral stress',
          aiFix: 'AI detects when knee distance is < 72% ankle distance and triggers instant warning "⚠️ Knees caving inward! Push outward."'
        },
        {
          flaw: 'Excessive Torso Lean',
          danger: 'Excessive lumbar shear stress',
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
      category: 'Horizontal Upper Body Press',
      muscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps Brachii', 'Serratus Anterior', 'Core Plank'],
      keyAngle: 'Elbow Joint Flexion',
      idealRange: '80° – 90° at bottom chest touch',
      lockout: '> 160° full elbow extension',
      caloricRate: '~0.28 kcal per completed rep',
      techniqueCues: [
        'Hands placed slightly wider than shoulder-width, fingers spread.',
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
          flaw: 'Flared Elbows (90° to Torso)',
          danger: 'Subacromial shoulder impingement',
          aiFix: 'AI measures upper arm vector relative to torso boundary.'
        }
      ]
    },
    plank: {
      name: 'Isometric Forearm Plank',
      category: 'Anti-Extension Core Stability',
      muscles: ['Transverse Abdominis', 'Rectus Abdominis', 'Internal/External Obliques', 'Gluteal Complex'],
      keyAngle: 'Spinal Alignment Angle',
      idealRange: '170° – 180° straight axial alignment',
      lockout: 'Continuous isometric hold',
      caloricRate: '~4.2 kcal per active minute',
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

  const current = exerciseGuides[selectedExercise];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#0b101a] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#080d16]">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
              Biomechanical Form Anatomy & Rules
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              <span>{current.category}</span>
              <span aria-hidden="true">·</span>
              <span>Computer Vision Guidance</span>
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

        {/* Exercise Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/70 dark:bg-[#090e18]">
          {(['squat', 'pushup', 'plank'] as ExerciseType[]).map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => onSelectExercise(ex)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                selectedExercise === ex
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {exerciseGuides[ex].name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#080d16]">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-semibold">Target Flexion</div>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{current.idealRange}</div>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-semibold">Lockout Threshold</div>
              <div className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{current.lockout}</div>
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl col-span-2 sm:col-span-1 shadow-xs">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 font-semibold">Energy Burn</div>
              <div className="text-sm font-bold text-amber-600 dark:text-amber-400">{current.caloricRate}</div>
            </div>
          </div>

          {/* Primary Muscles */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
              Primary Muscle Groups Activated
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {current.muscles.map((m) => (
                <span
                  key={m}
                  className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium shadow-xs"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Coaching Cues */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
              Gold-Standard Biomechanical Cues
            </div>
            <ul className="space-y-2">
              {current.techniqueCues.map((cue, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{cue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Detection Rules */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
              AI Real-Time Posture Enforcement Rules
            </div>
            <div className="space-y-2.5">
              {current.aiDetectionChecks.map((item, i) => (
                <div key={i} className="p-3.5 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>{item.flaw}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">({item.danger})</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 pl-5 text-[11px] leading-relaxed">
                    {item.aiFix}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
