import React, { useState } from 'react';
import { Volume2, VolumeX, Trash2, MessageSquare, AlertTriangle, CheckCircle, Info, Sparkles } from 'lucide-react';
import { FeedbackLogItem } from '../types/workout';
import { coachAudio } from '../utils/audioCoach';

interface FeedbackLogProps {
  logs: FeedbackLogItem[];
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onClearLogs: () => void;
}

export const FeedbackLog: React.FC<FeedbackLogProps> = ({
  logs,
  voiceEnabled,
  onToggleVoice,
  onClearLogs,
}) => {
  const [filter, setFilter] = useState<'all' | 'warning' | 'success'>('all');

  const filteredLogs = logs.filter((item) => {
    if (filter === 'warning') return item.type === 'warning' || item.type === 'error';
    if (filter === 'success') return item.type === 'success';
    return true;
  });

  const formatTimestamp = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleSpeakSample = () => {
    if (logs.length > 0) {
      coachAudio.speak(logs[0].message, true);
    } else {
      coachAudio.speak('Kinetix AI Coach voice feedback online.', true);
    }
  };

  return (
    <div className="bg-[#0e1626] border border-slate-800/80 rounded-2xl p-5 flex flex-col h-full shadow-2xl transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">Coach Feedback Feed</h3>
          <span className="text-xs font-mono-numbers text-slate-400">
            ({filteredLogs.length})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleVoice}
            title={voiceEnabled ? 'Mute AI voice coach' : 'Unmute AI voice coach'}
            className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
              voiceEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[11px] font-bold hidden sm:inline">
              {voiceEnabled ? 'Voice ON' : 'Muted'}
            </span>
          </button>

          {voiceEnabled && (
            <button
              type="button"
              onClick={handleSpeakSample}
              title="Test Voice Cue"
              className="p-1.5 rounded-lg text-xs bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}

          <button
            type="button"
            onClick={onClearLogs}
            title="Clear feedback history"
            className="p-1.5 rounded-lg text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl mt-3.5">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Feeds
        </button>
        <button
          type="button"
          onClick={() => setFilter('warning')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            filter === 'warning'
              ? 'bg-rose-950/70 text-rose-300 border border-rose-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Corrections
        </button>
        <button
          type="button"
          onClick={() => setFilter('success')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
            filter === 'success'
              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Rep Log
        </button>
      </div>

      {/* Scrollable Feed */}
      <div className="flex-1 overflow-y-auto mt-3.5 pr-1 space-y-2.5 min-h-[220px] max-h-[380px]">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 text-xs">
            <Info className="w-6 h-6 mb-2 text-slate-500" />
            <span>No coach logs matching this filter yet.</span>
            <span className="text-[11px] text-slate-500 mt-1">Start moving to receive real-time posture advice.</span>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isWarn = log.type === 'warning' || log.type === 'error';
            const isSucc = log.type === 'success';

            return (
              <div
                key={log.id}
                className={`p-3 rounded-xl border text-xs transition-all ${
                  isWarn
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                    : isSucc
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-900/70 border-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    {isWarn ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    ) : isSucc ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : (
                      <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    )}
                    <span className="font-extrabold uppercase tracking-wider text-[10px]">
                      {isWarn ? 'Posture Correction' : isSucc ? `Rep #${log.rep ?? ''} Logged` : 'Coach Cue'}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono-numbers text-slate-400">
                    {formatTimestamp(log.timestamp)}
                  </span>
                </div>

                <p className="text-xs leading-relaxed pl-5 font-medium text-slate-100">
                  {log.message}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Voice Status Footer Note */}
      <div className="pt-3 mt-auto border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <span>Audio Guidance</span>
        <span className="font-bold text-slate-200">
          {voiceEnabled ? 'Verbal Prompts Active (Web Speech API)' : 'Muted'}
        </span>
      </div>
    </div>
  );
};
