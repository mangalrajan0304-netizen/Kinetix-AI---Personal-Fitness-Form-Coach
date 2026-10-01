import React, { useState, useEffect } from 'react';
import { Timer, Volume2, VolumeX, Play, Pause, RefreshCw, Zap } from 'lucide-react';
import { coachAudio } from '../utils/audioCoach';

interface TempoMetronomeProps {
  exercise: string;
  isActive: boolean;
}

export const TempoMetronome: React.FC<TempoMetronomeProps> = ({ exercise, isActive }) => {
  const [tempoPreset, setTempoPreset] = useState<'control' | 'power' | 'endurance'>('control');
  const [metronomeAudio, setMetronomeAudio] = useState<boolean>(false);
  const [tempoPhase, setTempoPhase] = useState<'eccentric' | 'pause' | 'concentric'>('eccentric');
  const [phaseSeconds, setPhaseSeconds] = useState<number>(3);

  // Preset definition: [eccentricSec, pauseSec, concentricSec]
  const presets = {
    control: { name: 'Hypertrophy TUT (3-1-1)', down: 3, hold: 1, up: 1 },
    power: { name: 'Explosive Power (2-0-1)', down: 2, hold: 0, up: 1 },
    endurance: { name: 'Eccentric Focus (4-2-1)', down: 4, hold: 2, up: 1 },
  };

  const currentPreset = presets[tempoPreset];

  useEffect(() => {
    if (!isActive) return;

    let timer: NodeJS.Timeout;
    let step = 0;
    const totalCycle = currentPreset.down + currentPreset.hold + currentPreset.up;

    const interval = setInterval(() => {
      step = (step + 1) % totalCycle;

      if (step < currentPreset.down) {
        setTempoPhase('eccentric');
        setPhaseSeconds(currentPreset.down - step);
        if (metronomeAudio) coachAudio.playTempoTick(false);
      } else if (step < currentPreset.down + currentPreset.hold) {
        setTempoPhase('pause');
        setPhaseSeconds(currentPreset.down + currentPreset.hold - step);
        if (metronomeAudio) coachAudio.playTempoTick(true);
      } else {
        setTempoPhase('concentric');
        setPhaseSeconds(totalCycle - step);
        if (metronomeAudio) coachAudio.playTempoTick(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, tempoPreset, metronomeAudio, currentPreset]);

  return (
    <div className="bg-[#0e1626] border border-slate-800/80 rounded-2xl p-4 shadow-xl flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Time Under Tension (TUT) Pacer
            </h4>
            <div className="text-[10px] text-slate-400">
              Rhythmic cadence for optimal muscle hypertrophy
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMetronomeAudio(!metronomeAudio)}
          title={metronomeAudio ? 'Mute metronome tick' : 'Enable audio metronome tick'}
          className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
            metronomeAudio
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.25)]'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {metronomeAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="text-[10px] font-bold hidden sm:inline">
            {metronomeAudio ? 'Tick ON' : 'Mute Tick'}
          </span>
        </button>
      </div>

      {/* Tempo Phase Visualizer Bar */}
      <div className="p-3 bg-[#0a0f19] border border-slate-800 rounded-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-3.5 h-3.5 rounded-full animate-ping ${
              tempoPhase === 'eccentric'
                ? 'bg-cyan-400'
                : tempoPhase === 'pause'
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
          />
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Active Movement Phase
            </div>
            <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
              <span>
                {tempoPhase === 'eccentric'
                  ? '⬇️ Lowering (Eccentric)'
                  : tempoPhase === 'pause'
                  ? '⏸️ Bottom Hold (Inflection)'
                  : '⬆️ Drive Up (Concentric)'}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
            Phase Countdown
          </div>
          <div className="text-2xl font-black font-mono-numbers text-white">
            {phaseSeconds}s
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex items-center gap-1.5">
        {(['control', 'power', 'endurance'] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTempoPreset(key)}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
              tempoPreset === key
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'
            }`}
          >
            {key === 'control' ? '3-1-1 Control' : key === 'power' ? '2-0-1 Power' : '4-2-1 Deep'}
          </button>
        ))}
      </div>
    </div>
  );
};
