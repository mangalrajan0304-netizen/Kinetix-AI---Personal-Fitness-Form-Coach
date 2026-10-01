import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Droplets, Heart, Wind, CheckCircle2 } from 'lucide-react';
import { coachAudio } from '../utils/audioCoach';

interface RestBreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
  caloriesBurned: number;
}

export const RestBreathingModal: React.FC<RestBreathingModalProps> = ({
  isOpen,
  onClose,
  caloriesBurned,
}) => {
  const [restSeconds, setRestSeconds] = useState<number>(60);
  const [initialSeconds, setInitialSeconds] = useState<number>(60);
  const [isResting, setIsResting] = useState<boolean>(true);

  // Box Breathing cycle: Inhale (4s) -> Hold (4s) -> Exhale (4s) -> Hold (4s)
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold (Empty)'>('Inhale');
  const [breathCount, setBreathCount] = useState<number>(4);

  // Suggested hydration: 15ml per kcal burned, min 150ml
  const suggestedHydrationMl = Math.max(150, Math.round(caloriesBurned * 15));

  // Rest Timer loop
  useEffect(() => {
    if (!isOpen || !isResting || restSeconds <= 0) return;

    const timer = setInterval(() => {
      setRestSeconds((prev) => {
        if (prev <= 1) {
          coachAudio.playRestCompleteChime();
          coachAudio.speak('Rest period finished! Time for your next set.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isResting, restSeconds]);

  // Box Breathing loop
  useEffect(() => {
    if (!isOpen) return;

    let count = 4;
    let phaseIdx = 0;
    const phases: Array<'Inhale' | 'Hold' | 'Exhale' | 'Hold (Empty)'> = [
      'Inhale',
      'Hold',
      'Exhale',
      'Hold (Empty)',
    ];

    const breathTimer = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        count = 4;
        phaseIdx = (phaseIdx + 1) % 4;
        setBreathPhase(phases[phaseIdx]);
      }
      setBreathCount(count);
    }, 1000);

    return () => clearInterval(breathTimer);
  }, [isOpen]);

  if (!isOpen) return null;

  const setTimerPreset = (secs: number) => {
    setInitialSeconds(secs);
    setRestSeconds(secs);
    setIsResting(true);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e1626] border border-slate-800 rounded-3xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a0f19]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Heart className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Set Rest & Cardiovascular Recovery
              </h3>
              <div className="text-xs text-slate-400">
                Box breathing pacer & heart rate recovery
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

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Rest Countdown Bar */}
          <div className="text-center space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Rest Interval Countdown
            </div>

            <div className="text-6xl font-black font-mono-numbers text-white tracking-tight">
              {formatTimer(restSeconds)}
            </div>

            {/* Presets */}
            <div className="flex items-center justify-center gap-2">
              {[30, 45, 60, 90, 120].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTimerPreset(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold font-mono-numbers transition-all ${
                    initialSeconds === s
                      ? 'bg-emerald-400 text-slate-950 shadow-md'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {s}s
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsResting(!isResting)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                {isResting ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isResting ? 'Pause Rest' : 'Resume'}</span>
              </button>

              <button
                type="button"
                onClick={() => setRestSeconds(initialSeconds)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors border border-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Interactive Box Breathing Circle */}
          <div className="p-6 bg-[#0a0f19] border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Wind className="w-4 h-4" />
              <span>Autonomic Box Breathing Guide (4-4-4-4)</span>
            </div>

            {/* Pulsing Breathing Orb */}
            <div className="relative flex items-center justify-center w-36 h-36 my-2">
              <div
                className={`absolute inset-0 rounded-full transition-all duration-1000 border-2 ${
                  breathPhase === 'Inhale'
                    ? 'scale-125 bg-cyan-500/20 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
                    : breathPhase === 'Exhale'
                    ? 'scale-75 bg-emerald-500/10 border-emerald-400'
                    : 'scale-100 bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                }`}
              />
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-xs font-extrabold uppercase tracking-wider text-white">
                  {breathPhase}
                </span>
                <span className="text-3xl font-black font-mono-numbers text-white mt-1">
                  {breathCount}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 max-w-sm mt-3 leading-relaxed">
              Inhale deeply for 4s, hold full lungs 4s, exhale slowly 4s, hold empty 4s to drop resting heart rate between sets.
            </p>
          </div>

          {/* Hydration Reminder Pill Strip */}
          <div className="p-4 bg-blue-950/20 border border-blue-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  Optimal Hydration Replenishment
                </div>
                <div className="text-[11px] text-slate-300">
                  Target for current workout effort: <strong className="text-cyan-400">{suggestedHydrationMl}ml</strong> water
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs transition-all shadow-md"
            >
              Ready to Lift!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
