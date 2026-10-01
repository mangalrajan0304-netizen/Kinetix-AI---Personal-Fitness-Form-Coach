import React, { useState } from 'react';
import { ShoppingBag, ArrowLeft, ArrowRight, Play, Star, ShieldCheck, Dumbbell, Sparkles, Filter, Check, ExternalLink } from 'lucide-react';
import { ExerciseType } from '../types/workout';

interface RelatedItemsPageProps {
  currentExercise: ExerciseType;
  onSelectExerciseAndGoToStudio: (ex: ExerciseType) => void;
  onGoToPreviousPage: () => void;
  onGoToNextPage: () => void;
}

export const RelatedItemsPage: React.FC<RelatedItemsPageProps> = ({
  currentExercise,
  onSelectExerciseAndGoToStudio,
  onGoToPreviousPage,
  onGoToNextPage,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'gear' | 'variations' | 'recovery'>('all');
  const [selectedEx, setSelectedEx] = useState<ExerciseType>(currentExercise);
  const [savedItems, setSavedItems] = useState<Record<string, boolean>>({});

  const toggleSave = (id: string) => {
    setSavedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Comprehensive database of related items mapped to exercises
  const relatedDatabase = {
    squat: {
      exerciseName: 'Squats',
      gear: [
        {
          id: 'sq_gear_1',
          name: '7mm Neoprene Knee Compression Sleeves',
          category: 'Support Gear',
          rating: 4.9,
          price: '$45.00',
          benefit: 'Provides joint warmth, proprioception, and patellar tendon stability during deep flexion below 90°.',
          icon: '🛡️',
          tag: 'Biomechanical Support',
        },
        {
          id: 'sq_gear_2',
          name: 'High-Density Squat Wedge Blocks (20° Incline)',
          category: 'Mobility Equipment',
          rating: 4.8,
          price: '$28.00',
          benefit: 'Compensates for tight ankle dorsiflexion, allowing deeper upright squats without torso collapsing.',
          icon: '📐',
          tag: 'Form Correction',
        },
        {
          id: 'sq_gear_3',
          name: 'Fabric Glute Resistance Activation Loop Bands',
          category: 'Training Tool',
          rating: 4.9,
          price: '$18.00',
          benefit: 'Forces knee abductors (gluteus medius) to actively push outward, eliminating knee valgus collapse.',
          icon: '⭕',
          tag: 'Cues & Feedback',
        },
      ],
      variations: [
        {
          id: 'sq_var_1',
          name: 'Bulgarian Split Squats (Rear-Foot Elevated)',
          difficulty: 'Intermediate',
          primaryMuscles: 'Quadriceps, Glutes, Hamstrings',
          targetKey: 'Single-leg stability & pelvic leveling',
          benefit: 'Fixes unilateral muscle imbalances between left and right legs.',
          icon: '🦵',
        },
        {
          id: 'sq_var_2',
          name: 'Tempo Goblet Squats (3s Eccentric Hold)',
          difficulty: 'Beginner - Advanced',
          primaryMuscles: 'Core, Quads, Hip Adductors',
          targetKey: 'Upright torso & core bracing',
          benefit: 'Front-loaded counterbalance teaches pristine upright chest mechanics.',
          icon: '🏺',
        },
        {
          id: 'sq_var_3',
          name: 'Pistol Squats (Full Single-Leg Mastery)',
          difficulty: 'Advanced',
          primaryMuscles: 'Quadriceps, Ankle Calves, Core',
          targetKey: 'Pure unilateral power & balance',
          benefit: 'Ultimate bodyweight leg strength benchmark.',
          icon: '🎯',
        },
      ],
      recovery: [
        {
          id: 'sq_rec_1',
          name: 'High-Density Deep Tissue Grid Foam Roller',
          category: 'Myofascial Release',
          rating: 4.8,
          price: '$24.00',
          benefit: 'Relieves quad tightness, IT-band tension, and glute stiffness post-workout.',
          icon: '🧘',
          tag: 'Recovery',
        },
        {
          id: 'sq_rec_2',
          name: 'Electrolyte Hydration Salts (Sodium + Potassium + Magnesium)',
          category: 'Intra/Post Nutrition',
          rating: 4.9,
          price: '$22.00',
          benefit: 'Prevents muscular cramping and optimizes intracellular water balance.',
          icon: '⚡',
          tag: 'Hydration',
        },
      ],
    },
    pushup: {
      exerciseName: 'Push-ups',
      gear: [
        {
          id: 'pu_gear_1',
          name: 'Rotating Ergonomic Push-Up Handles',
          category: 'Wrist Protection',
          rating: 4.9,
          price: '$29.00',
          benefit: 'Allows natural forearm rotation and removes hyperextension wrist pain.',
          icon: '🔄',
          tag: 'Joint Friendly',
        },
        {
          id: 'pu_gear_2',
          name: 'Heavy-Duty Elastic Resistance Push-Up Harness',
          category: 'Progressive Overload',
          rating: 4.8,
          price: '$32.00',
          benefit: 'Adds up to 60 lbs of linear resistance at the top lockout phase.',
          icon: '⚡',
          tag: 'Strength Builder',
        },
        {
          id: 'pu_gear_3',
          name: '18-Inch Reinforced Elastic Wrist Wraps',
          category: 'Support Gear',
          rating: 4.7,
          price: '$16.00',
          benefit: 'Locks carpals in neutral alignment during high-volume pressing sets.',
          icon: '🧤',
          tag: 'Wrist Support',
        },
      ],
      variations: [
        {
          id: 'pu_var_1',
          name: 'Diamond Close-Grip Push-ups',
          difficulty: 'Intermediate',
          primaryMuscles: 'Triceps Brachii, Inner Pecs',
          targetKey: 'Elbow extension lockout',
          benefit: 'Shifts primary load to triceps and clavicular pec fibers.',
          icon: '💎',
        },
        {
          id: 'pu_var_2',
          name: 'Decline Feet-Elevated Push-ups',
          difficulty: 'Intermediate',
          primaryMuscles: 'Upper Pectoralis, Anterior Deltoids',
          targetKey: 'Upper chest angle recruitment',
          benefit: 'Increases bodyweight load from 64% to 74% of total body mass.',
          icon: '📐',
        },
        {
          id: 'pu_var_3',
          name: 'Archer / Typewriter Lateral Push-ups',
          difficulty: 'Advanced',
          primaryMuscles: 'Chest, Serratus, Scapular Core',
          targetKey: 'Unilateral pressing capacity',
          benefit: 'Prepares the shoulders and chest for single-arm push-up progressions.',
          icon: '🏹',
        },
      ],
      recovery: [
        {
          id: 'pu_rec_1',
          name: 'Lacrosse Trigger Point Mobility Ball',
          category: 'Targeted Release',
          rating: 4.8,
          price: '$12.00',
          benefit: 'Releases anterior deltoid and pec minor tight knots.',
          icon: '🎾',
          tag: 'Mobility',
        },
        {
          id: 'pu_rec_2',
          name: 'Hydrolyzed Whey Isolate (25g Protein + 5.5g BCAA)',
          category: 'Protein Synthesis',
          rating: 4.9,
          price: '$39.00',
          benefit: 'Fast-digesting leucine-rich protein to spark muscular repair.',
          icon: '🥤',
          tag: 'Nutrition',
        },
      ],
    },
    plank: {
      exerciseName: 'Planks',
      gear: [
        {
          id: 'pl_gear_1',
          name: 'Extra-Thick High Density Non-Slip Exercise Mat (10mm)',
          category: 'Joint Comfort',
          rating: 4.9,
          price: '$34.00',
          benefit: 'Cushions elbow olecranon bones and prevents slipping during sweat accumulation.',
          icon: '🛡️',
          tag: 'Elbow Cushion',
        },
        {
          id: 'pl_gear_2',
          name: 'Dual-Wheel Abdominal Roller with Auto-Rebound',
          category: 'Anti-Extension Tool',
          rating: 4.8,
          price: '$26.00',
          benefit: 'Trains intense core anti-extension strength and lat engagement.',
          icon: '⚙️',
          tag: 'Core Power',
        },
        {
          id: 'pl_gear_3',
          name: 'Smooth Core Stability Sliding Discs',
          category: 'Dynamic Core',
          rating: 4.7,
          price: '$14.00',
          benefit: 'Enables plank jacks, mountain climbers, and body saws with low joint friction.',
          icon: '🥏',
          tag: 'Dynamic Plank',
        },
      ],
      variations: [
        {
          id: 'pl_var_1',
          name: 'RKC Hardstyle Plank (Max Contraction)',
          difficulty: 'Intermediate',
          primaryMuscles: 'Rectus Abdominis, Glutes, Lats',
          targetKey: 'Total body isometric tension',
          benefit: 'Tuck pelvis, pull elbows to toes for 10x muscular contraction in 15 seconds.',
          icon: '🔥',
        },
        {
          id: 'pl_var_2',
          name: 'Lateral Forearm Side Plank with Leg Raise',
          difficulty: 'Intermediate',
          primaryMuscles: 'Internal/External Obliques, Glute Medius',
          targetKey: 'Frontal plane stability',
          benefit: 'Strengthens quadratus lumborum to prevent lower back pain.',
          icon: '⚖️',
        },
        {
          id: 'pl_var_3',
          name: 'Hollow Body Isometric Hold',
          difficulty: 'Advanced',
          primaryMuscles: 'Deep Transverse Abdominis, Hip Flexors',
          targetKey: 'Posterior pelvic tilt',
          benefit: 'The foundational gymnastics core hold for rock-solid posture.',
          icon: '⭐',
        },
      ],
      recovery: [
        {
          id: 'pl_rec_1',
          name: 'Lumbar Spine Acupressure Decompression Stretcher',
          category: 'Spinal Decompression',
          rating: 4.7,
          price: '$21.00',
          benefit: 'Decompresses lumbar vertebrae and relaxes lower back erector spinae muscles.',
          icon: '🧘',
          tag: 'Back Health',
        },
        {
          id: 'pl_rec_2',
          name: 'Magnesium Glycinate + L-Theanine Sleep Recovery',
          category: 'Neuro Recovery',
          rating: 4.9,
          price: '$24.00',
          benefit: 'Calms central nervous system and promotes deep slow-wave muscular repair.',
          icon: '🌙',
          tag: 'Rest',
        },
      ],
    },
  };

  const activeData = relatedDatabase[selectedEx];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            Page 4 of 5 · Related Items & Equipment
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Recommended Gear, Progressions & Recovery
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Curated gear, equipment, and training progressions tailored to {activeData.exerciseName}.
          </p>
        </div>

        {/* Exercise Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0e1626] border border-slate-800 rounded-xl text-xs">
          {(['squat', 'pushup', 'plank'] as ExerciseType[]).map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setSelectedEx(ex)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedEx === ex
                  ? 'bg-emerald-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {ex === 'squat' ? '🦵 Squat Items' : ex === 'pushup' ? '💪 Push-up Items' : '🛡️ Plank Items'}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-2 rounded-xl font-bold transition-all border whitespace-nowrap ${
            filterCategory === 'all'
              ? 'bg-slate-800 text-white border-slate-700 shadow-md'
              : 'bg-[#0a0f19] text-slate-400 border-slate-800/80 hover:text-white'
          }`}
        >
          All Items ({activeData.gear.length + activeData.variations.length + activeData.recovery.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterCategory('gear')}
          className={`px-4 py-2 rounded-xl font-bold transition-all border whitespace-nowrap ${
            filterCategory === 'gear'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md'
              : 'bg-[#0a0f19] text-slate-400 border-slate-800/80 hover:text-white'
          }`}
        >
          🎒 Recommended Equipment ({activeData.gear.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterCategory('variations')}
          className={`px-4 py-2 rounded-xl font-bold transition-all border whitespace-nowrap ${
            filterCategory === 'variations'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md'
              : 'bg-[#0a0f19] text-slate-400 border-slate-800/80 hover:text-white'
          }`}
        >
          ⚡ Exercise Progressions ({activeData.variations.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterCategory('recovery')}
          className={`px-4 py-2 rounded-xl font-bold transition-all border whitespace-nowrap ${
            filterCategory === 'recovery'
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
              : 'bg-[#0a0f19] text-slate-400 border-slate-800/80 hover:text-white'
          }`}
        >
          🥤 Recovery & Mobility ({activeData.recovery.length})
        </button>
      </div>

      {/* Grid of Related Items */}
      <div className="space-y-6">
        {/* Section 1: Recommended Gear & Equipment */}
        {(filterCategory === 'all' || filterCategory === 'gear') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Recommended Equipment & Support Gear for {activeData.exerciseName}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeData.gear.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0e1626] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-xl hover:border-slate-700 transition-all group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#0a0f19] border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                        {item.tag}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-white leading-snug mb-1">
                      {item.name}
                    </h4>

                    <div className="flex items-center gap-2 text-xs mb-3">
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="ml-1 font-bold text-white">{item.rating}</span>
                      </div>
                      <span className="text-slate-500">·</span>
                      <span className="font-mono-numbers text-slate-300 font-semibold">{item.price}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {item.benefit}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleSave(item.id)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                        savedItems[item.id]
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      {savedItems[item.id] ? <Check className="w-3.5 h-3.5" /> : null}
                      <span>{savedItems[item.id] ? 'Added to Kit' : 'Add to Workout Kit'}</span>
                    </button>

                    <span className="text-[10px] text-slate-400 font-semibold">
                      Coach Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Related Workout Progressions & Variations */}
        {(filterCategory === 'all' || filterCategory === 'variations') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Related Exercise Progressions & Advanced Variations
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeData.variations.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0e1626] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-xl hover:border-slate-700 transition-all group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-[#0a0f19] border border-slate-800 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                        {item.difficulty}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-white leading-snug mb-1">
                      {item.name}
                    </h4>

                    <div className="text-[11px] text-slate-400 mb-2">
                      Muscles: <strong className="text-slate-200">{item.primaryMuscles}</strong>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-medium">
                      {item.benefit}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onSelectExerciseAndGoToStudio(selectedEx)}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Track in Studio</span>
                    </button>

                    <span className="text-[10px] text-slate-400">
                      {item.targetKey}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Recovery & Nutrition Items */}
        {(filterCategory === 'all' || filterCategory === 'recovery') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Targeted Recovery & Fuel for {activeData.exerciseName}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeData.recovery.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0e1626] border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-xl"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#0a0f19] border border-slate-800 flex items-center justify-center text-3xl shrink-0">
                      {item.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                          {item.tag}
                        </span>
                        <span className="text-xs font-mono-numbers font-bold text-white">{item.price}</span>
                      </div>

                      <h4 className="text-sm font-extrabold text-white mb-1.5">
                        {item.name}
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {item.benefit}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">Post-workout protocol</span>
                    <button
                      type="button"
                      onClick={() => toggleSave(item.id)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg border transition-all ${
                        savedItems[item.id]
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      {savedItems[item.id] ? 'Saved to Routine' : 'Save to Routine'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Page Navigation Bar ("Click go to next page") */}
      <div className="flex items-center justify-between p-4 bg-[#0e1626] border border-slate-800 rounded-2xl shadow-xl">
        <button
          type="button"
          onClick={onGoToPreviousPage}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous: Session Analytics</span>
        </button>

        <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
          Step 4 of 5: Related Gear & Items
        </span>

        <button
          type="button"
          onClick={onGoToNextPage}
          className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-colors cursor-pointer"
        >
          <span>Next Page: YouTube Videos & Reels</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
