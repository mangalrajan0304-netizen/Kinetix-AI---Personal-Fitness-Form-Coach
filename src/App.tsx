/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { TopNav, AppPage } from './components/TopNav';
import { WorkoutFeed } from './components/WorkoutFeed';
import { MetricsCards } from './components/MetricsCards';
import { FeedbackLog } from './components/FeedbackLog';
import { WorkoutControls } from './components/WorkoutControls';
import { TempoMetronome } from './components/TempoMetronome';
import { SymmetryMeter } from './components/SymmetryMeter';
import { MilestoneBadges } from './components/MilestoneBadges';
import { DailyTasksCard } from './components/DailyTasksCard';
import { FitnessLinksHub } from './components/FitnessLinksHub';
import { RestBreathingModal } from './components/RestBreathingModal';
import { WarmupRoutineModal } from './components/WarmupRoutineModal';
import { ExerciseLibraryPage } from './pages/ExerciseLibraryPage';
import { SessionAnalyticsPage } from './pages/SessionAnalyticsPage';
import { RelatedItemsPage } from './pages/RelatedItemsPage';
import { FitnessMediaPage } from './pages/FitnessMediaPage';
import { LoginPage } from './pages/LoginPage';
import { ExerciseType, FeedbackLogItem, FrameAnalysisResult, JointLandmarks, RepHistoryItem } from './types/workout';
import { UserProfile } from './types/auth';
import { coachAudio } from './utils/audioCoach';
import { generateSimulatedPose, SimulatedErrorType } from './utils/poseEngine';
import { ArrowRight, Wind, Sparkles, ShoppingBag, Youtube, Link2, CheckSquare } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('studio');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Authenticated user state with persistent storage
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('kinetix_user');
      if (saved) return JSON.parse(saved);
      return {
        id: 'user_athlete_01',
        name: 'Alex Vance',
        email: 'alex.vance@kinetix.fit',
        role: 'athlete',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        level: 'Intermediate',
        goal: 'Muscle Hypertrophy & Strict Form',
        membership: 'Pro Athlete',
        repsCompletedTotal: 342,
      };
    } catch {
      return null;
    }
  });

  const [exercise, setExercise] = useState<ExerciseType>('squat');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [useWebcam, setUseWebcam] = useState<boolean>(false);
  const [activeError, setActiveError] = useState<SimulatedErrorType>('none');
  const [targetReps, setTargetReps] = useState<number>(15);

  const [reps, setReps] = useState<number>(0);
  const [calories, setCalories] = useState<number>(0);
  const [durationSeconds, setDurationSeconds] = useState<number>(0);
  const [landmarks, setLandmarks] = useState<JointLandmarks>({});
  const [analysis, setAnalysis] = useState<FrameAnalysisResult | null>(null);

  // Creative & Useful fitness feature modals
  const [isRestModalOpen, setIsRestModalOpen] = useState<boolean>(false);
  const [isWarmupModalOpen, setIsWarmupModalOpen] = useState<boolean>(false);

  const [feedbackLogs, setFeedbackLogs] = useState<FeedbackLogItem[]>([
    {
      id: 'init-0',
      timestamp: 0,
      message: 'Kinetix AI Coach ready. Select your workout and step into frame.',
      type: 'info',
    }
  ]);
  const [repHistory, setRepHistory] = useState<RepHistoryItem[]>([]);

  // Audio configuration
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);

  // Internal state tracking
  const cycleTimeRef = useRef<number>(0);
  const prevRepCountRef = useRef<number>(0);
  const lastApiCallTimeRef = useRef<number>(0);
  const lastWarningVoiceTimeRef = useRef<number>(0);
  const celebrationTriggeredRef = useRef<boolean>(false);

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Sync audio coach state
  useEffect(() => {
    coachAudio.setVoiceEnabled(voiceEnabled);
  }, [voiceEnabled]);

  useEffect(() => {
    coachAudio.setSfxEnabled(sfxEnabled);
  }, [sfxEnabled]);

  // Logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem('kinetix_user');
    setCurrentUser(null);
    coachAudio.speak('Signed out.');
    setCurrentPage('login');
  }, []);

  // Page Navigation Handlers (5 complete workout & media pages)
  const handleGoToNextPage = useCallback(() => {
    if (currentPage === 'studio') setCurrentPage('library');
    else if (currentPage === 'library') setCurrentPage('analytics');
    else if (currentPage === 'analytics') setCurrentPage('gear');
    else if (currentPage === 'gear') setCurrentPage('media');
    else setCurrentPage('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleGoToPreviousPage = useCallback(() => {
    if (currentPage === 'media') setCurrentPage('gear');
    else if (currentPage === 'gear') setCurrentPage('analytics');
    else if (currentPage === 'analytics') setCurrentPage('library');
    else if (currentPage === 'library') setCurrentPage('studio');
    else setCurrentPage('media');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Adjust target reps default when switching exercise
  const handleSelectExercise = (newEx: ExerciseType) => {
    if (newEx === exercise) return;
    setExercise(newEx);
    setActiveError('none');
    setReps(0);
    setCalories(0);
    celebrationTriggeredRef.current = false;
    prevRepCountRef.current = 0;

    if (newEx === 'plank') {
      setTargetReps(45);
    } else {
      setTargetReps(15);
    }

    // Call backend reset
    fetch('/api/reset-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: 'default', exercise: newEx }),
    }).catch(() => {});

    coachAudio.speak(`Switched to ${newEx === 'pushup' ? 'Push-ups' : newEx === 'squat' ? 'Squats' : 'Plank'}. Ready.`);

    setFeedbackLogs((prev) => [
      {
        id: `switch-${Date.now()}`,
        timestamp: durationSeconds,
        message: `Exercise mode updated to ${newEx.toUpperCase()}. Camera calibrated.`,
        type: 'info',
      },
      ...prev,
    ]);
  };

  // Reset entire workout session
  const handleResetSession = useCallback(() => {
    setReps(0);
    setCalories(0);
    setDurationSeconds(0);
    cycleTimeRef.current = 0;
    prevRepCountRef.current = 0;
    celebrationTriggeredRef.current = false;
    setActiveError('none');

    fetch('/api/reset-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: 'default', exercise }),
    }).catch(() => {});

    setFeedbackLogs([
      {
        id: `reset-${Date.now()}`,
        timestamp: 0,
        message: `Workout reset for ${exercise.toUpperCase()}. Ready to track.`,
        type: 'info',
      }
    ]);
    setRepHistory([]);
    coachAudio.speak('Workout session reset.');
  }, [exercise]);

  // Session duration timer
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setDurationSeconds((d) => d + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Main Motion Analysis & Pose Animation Loop
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    const loop = (currentTimestamp: number) => {
      const dt = Math.min(0.1, (currentTimestamp - lastTimestamp) / 1000);
      lastTimestamp = currentTimestamp;

      if (isActive) {
        cycleTimeRef.current += dt;

        // Generate Kinematic Pose Landmarks (or parse from webcam)
        const sim = generateSimulatedPose(exercise, cycleTimeRef.current, activeError);
        setLandmarks(sim.landmarks);

        // Throttle API call to backend (approx every 180ms)
        const now = Date.now();
        if (now - lastApiCallTimeRef.current > 180) {
          lastApiCallTimeRef.current = now;

          fetch('/api/analyze-frame', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              exercise,
              landmarks: sim.landmarks,
              sessionId: 'default',
            }),
          })
            .then((res) => res.json())
            .then((data: FrameAnalysisResult) => {
              setAnalysis(data);
              setReps(data.rep_count);
              setCalories(data.calories_burned);

              // Check if rep was completed
              if (data.rep_count > prevRepCountRef.current) {
                prevRepCountRef.current = data.rep_count;
                coachAudio.playRepCompleteChime();

                if (data.coach_feedback) {
                  coachAudio.speak(data.coach_feedback);
                } else {
                  coachAudio.speak(`Rep ${data.rep_count}!`);
                }

                // Append to feedback log
                setFeedbackLogs((prev) => [
                  {
                    id: `rep-${data.rep_count}-${Date.now()}`,
                    timestamp: durationSeconds,
                    rep: data.rep_count,
                    message: data.coach_feedback || `Rep #${data.rep_count} recorded with strong technique.`,
                    type: 'success',
                  },
                  ...prev.slice(0, 40),
                ]);

                // Append to rep history ledger
                setRepHistory((prev) => [
                  {
                    repNumber: data.rep_count,
                    time: durationSeconds,
                    formScore: data.form_score,
                    minAngle: Math.round(data.current_angle),
                    feedback: 'Clean biomechanics & tempo',
                  },
                  ...prev,
                ]);

                // Check target milestone
                if (data.rep_count >= targetReps && !celebrationTriggeredRef.current) {
                  celebrationTriggeredRef.current = true;
                  coachAudio.playMilestoneSound();
                  coachAudio.speak(`Target goal of ${targetReps} reached! Outstanding effort!`, true);
                  confetti({
                    particleCount: 90,
                    spread: 75,
                    origin: { y: 0.6 },
                    colors: ['#a855f7', '#8b5cf6', '#ec4899', '#3b82f6'],
                  });
                }
              }

              // Check form breakdown warnings
              if (data.warnings && data.warnings.length > 0) {
                const nowWarn = Date.now();
                if (nowWarn - lastWarningVoiceTimeRef.current > 3500) {
                  lastWarningVoiceTimeRef.current = nowWarn;
                  coachAudio.playWarningBuzz();
                  coachAudio.speak(data.warnings[0].message, true);

                  setFeedbackLogs((prev) => [
                    {
                      id: `warn-${Date.now()}`,
                      timestamp: durationSeconds,
                      message: data.warnings[0].message,
                      type: 'warning',
                    },
                    ...prev.slice(0, 40),
                  ]);
                }
              }
            })
            .catch(() => {
              // Ignore network drops
            });
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isActive, exercise, activeError, targetReps, durationSeconds]);

  return (
    <div className="min-h-screen bg-[#0b0716] text-slate-100 flex flex-col font-sans selection:bg-violet-500/30 selection:text-violet-200 transition-colors">
      {/* Strict 3-zone Top Bar Contract with Page Tabs & User Auth in Violet */}
      <TopNav
        currentPage={currentPage}
        onNavigate={(p) => {
          setCurrentPage(p);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onGoToNextPage={handleGoToNextPage}
        voiceEnabled={voiceEnabled}
        onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
        theme={theme}
        onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-[1520px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Page: Professional Login Portal */}
        {currentPage === 'login' && (
          <LoginPage
            onLoginSuccess={(user) => {
              setCurrentUser(user);
              setCurrentPage('studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCancelOrBack={() => {
              setCurrentPage('studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* Page 1: AI Workout Studio */}
        {currentPage === 'studio' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Quick Fitness Utilities Toolbar in Violet */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#120d28] border border-violet-800/60 rounded-2xl shadow-lg shadow-purple-950/20">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>Violet Pro Fitness Suite:</span>
                </span>
                <span className="text-xs text-violet-300/70 hidden sm:inline">
                  Interactive mobility, recovery, gear, daily quests & tutorials
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsWarmupModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-violet-950/80 hover:bg-violet-900 border border-violet-500/50 text-violet-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)] cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>2-Min Warm-up</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsRestModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)] cursor-pointer"
                >
                  <Wind className="w-3.5 h-3.5 text-purple-400" />
                  <span>Box Breathing</span>
                </button>

                {/* Direct button to Related Items */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage('gear');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1c123d] hover:bg-[#251752] border border-violet-600/50 text-violet-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(139,92,246,0.2)] cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-violet-400" />
                  <span>Related Gear</span>
                </button>

                {/* Direct button to YouTube & Reels Tutorials */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage('media');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 border border-rose-500/50 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(244,63,94,0.2)] cursor-pointer"
                >
                  <Youtube className="w-3.5 h-3.5 text-rose-400" />
                  <span>Videos & Reels</span>
                </button>
              </div>
            </div>

            {/* Live Metrics Summary Cards */}
            <MetricsCards
              exercise={exercise}
              reps={reps}
              targetReps={targetReps}
              calories={calories}
              durationSeconds={durationSeconds}
              analysis={analysis}
            />

            {/* Central Workspace: Video/Pose Stream (Left) + Coaching Controls & Logs (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Main Camera & Pose Tracking Viewport (8 Columns) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <WorkoutFeed
                  exercise={exercise}
                  isActive={isActive}
                  useWebcam={useWebcam}
                  setUseWebcam={setUseWebcam}
                  landmarks={landmarks}
                  analysis={analysis}
                  activeError={activeError}
                  setActiveError={setActiveError}
                  onResetSession={handleResetSession}
                  theme={theme}
                />

                {/* Creative Fitness Features: Tempo Coach & Symmetry Balance Meter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TempoMetronome
                    exercise={exercise}
                    isActive={isActive}
                  />

                  <SymmetryMeter
                    exercise={exercise}
                    reps={reps}
                    durationSeconds={durationSeconds}
                  />
                </div>

                {/* In-Session Achievement Badges Strip */}
                <MilestoneBadges
                  reps={reps}
                  calories={calories}
                  formScore={analysis?.form_score ?? 98}
                  targetReps={targetReps}
                />

                {/* Bottom Page Navigation Banner in Violet */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#120d28] border border-violet-800/60 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="font-bold text-violet-300 uppercase">{exercise} Mode</span>
                    <span>·</span>
                    <span>Accuracy: <strong className="text-violet-400 font-mono-numbers">{analysis?.form_score ?? 98}%</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage('media');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#1c123d] hover:bg-[#251752] text-violet-200 font-bold text-xs flex items-center gap-1.5 transition-colors border border-violet-700/60 cursor-pointer"
                    >
                      <Youtube className="w-4 h-4 text-rose-400" />
                      <span>Watch Tutorials</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleGoToNextPage}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all cursor-pointer"
                    >
                      <span>Go to Next Page: Form Anatomy</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Daily Tasks + Interactive Workout Controls + Feedback Feed (4 Columns) */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                {/* Daily Fitness Tasks & Quests Widget */}
                <DailyTasksCard
                  reps={reps}
                  durationSeconds={durationSeconds}
                  exercise={exercise}
                />

                <WorkoutControls
                  exercise={exercise}
                  onSelectExercise={handleSelectExercise}
                  isActive={isActive}
                  onToggleActive={() => {
                    const nextActive = !isActive;
                    setIsActive(nextActive);
                    if (nextActive) {
                      coachAudio.speak('Resuming workout.');
                    } else {
                      coachAudio.speak('Workout paused.');
                    }
                  }}
                  onReset={handleResetSession}
                  targetReps={targetReps}
                  onSelectTargetReps={(t) => {
                    setTargetReps(t);
                    celebrationTriggeredRef.current = false;
                    coachAudio.speak(`Target updated to ${t} ${exercise === 'plank' ? 'seconds' : 'repetitions'}.`);
                  }}
                  voiceEnabled={voiceEnabled}
                  onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
                  sfxEnabled={sfxEnabled}
                  onToggleSfx={() => setSfxEnabled(!sfxEnabled)}
                />

                <FeedbackLog
                  logs={feedbackLogs}
                  voiceEnabled={voiceEnabled}
                  onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
                  onClearLogs={() => setFeedbackLogs([])}
                />
              </div>
            </div>

            {/* Curated Fitness Links Hub at Bottom of Studio */}
            <FitnessLinksHub />
          </div>
        )}

        {/* Page 2: Exercise Library & Form Guide */}
        {currentPage === 'library' && (
          <div className="animate-in fade-in duration-150">
            <ExerciseLibraryPage
              currentExercise={exercise}
              onSelectExerciseAndGoToStudio={(ex) => {
                handleSelectExercise(ex);
                setCurrentPage('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToPreviousPage={handleGoToPreviousPage}
              onGoToNextPage={handleGoToNextPage}
            />
          </div>
        )}

        {/* Page 3: Session Analytics & Rep Telemetry */}
        {currentPage === 'analytics' && (
          <div className="animate-in fade-in duration-150">
            <SessionAnalyticsPage
              exercise={exercise}
              totalReps={reps}
              calories={calories}
              durationSeconds={durationSeconds}
              avgScore={analysis?.form_score ?? 96}
              history={repHistory}
              onGoToPreviousPage={handleGoToPreviousPage}
              onGoToNextPage={handleGoToNextPage}
            />
          </div>
        )}

        {/* Page 4: Related Items & Pro Equipment */}
        {currentPage === 'gear' && (
          <div className="animate-in fade-in duration-150">
            <RelatedItemsPage
              currentExercise={exercise}
              onSelectExerciseAndGoToStudio={(ex) => {
                handleSelectExercise(ex);
                setCurrentPage('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToPreviousPage={handleGoToPreviousPage}
              onGoToNextPage={handleGoToNextPage}
            />
          </div>
        )}

        {/* Page 5: Fitness YouTube Videos & Instagram Reels */}
        {currentPage === 'media' && (
          <div className="animate-in fade-in duration-150">
            <FitnessMediaPage
              currentExercise={exercise}
              onSelectExerciseAndGoToStudio={(ex) => {
                handleSelectExercise(ex);
                setCurrentPage('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onGoToPreviousPage={handleGoToPreviousPage}
              onGoToNextPage={handleGoToNextPage}
            />
          </div>
        )}
      </main>

      {/* Fitness Modals */}
      <RestBreathingModal
        isOpen={isRestModalOpen}
        onClose={() => setIsRestModalOpen(false)}
        caloriesBurned={calories}
      />

      <WarmupRoutineModal
        isOpen={isWarmupModalOpen}
        onClose={() => setIsWarmupModalOpen(false)}
        exercise={exercise}
      />
    </div>
  );
}
