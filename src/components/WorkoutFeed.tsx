import React, { useEffect, useRef, useState } from 'react';
import { Camera, Video, AlertTriangle, CheckCircle2, ShieldAlert, RefreshCw, Zap } from 'lucide-react';
import { ExerciseType, FormWarning, FrameAnalysisResult, JointLandmarks } from '../types/workout';
import { SimulatedErrorType } from '../utils/poseEngine';

interface WorkoutFeedProps {
  exercise: ExerciseType;
  isActive: boolean;
  useWebcam: boolean;
  setUseWebcam: (val: boolean) => void;
  landmarks: JointLandmarks;
  analysis: FrameAnalysisResult | null;
  activeError: SimulatedErrorType;
  setActiveError: (err: SimulatedErrorType) => void;
  onResetSession: () => void;
  theme?: 'light' | 'dark';
}

export const WorkoutFeed: React.FC<WorkoutFeedProps> = ({
  exercise,
  isActive,
  useWebcam,
  setUseWebcam,
  landmarks,
  analysis,
  activeError,
  setActiveError,
  onResetSession,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webcamAvailable, setWebcamAvailable] = useState<boolean>(true);
  const [webcamError, setWebcamError] = useState<string | null>(null);

  // Manage real webcam stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    if (useWebcam) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user',
            },
            audio: false,
          })
          .then((mediaStream) => {
            stream = mediaStream;
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
              videoRef.current.play().catch(() => {});
            }
            setWebcamError(null);
          })
          .catch((err) => {
            console.warn('Webcam access error:', err);
            setWebcamAvailable(false);
            setWebcamError('Camera access not granted or unavailable. Switched to AI Simulation Engine.');
            setUseWebcam(false);
          });
      } else {
        setWebcamAvailable(false);
        setUseWebcam(false);
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useWebcam, setUseWebcam]);

  // Render skeleton and angle HUD onto canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // If not using webcam, draw gym mat grid
    if (!useWebcam) {
      // Perspective dark gym studio
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#0c1220');
      bgGrad.addColorStop(0.65, '#070b13');
      bgGrad.addColorStop(1, '#05080e');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Floor line
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.78);
      ctx.lineTo(width, height * 0.78);
      ctx.stroke();

      // Floor perspective grid
      ctx.strokeStyle = 'rgba(51, 65, 85, 0.3)';
      for (let i = -width; i < width * 2; i += 80) {
        ctx.beginPath();
        ctx.moveTo(width / 2, height * 0.65);
        ctx.lineTo(i, height);
        ctx.stroke();
      }

      // Horizontal floor depth lines
      for (let y = height * 0.78; y <= height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center atmospheric spotlight
      const spotGrad = ctx.createRadialGradient(width / 2, height * 0.5, 20, width / 2, height * 0.5, width * 0.45);
      spotGrad.addColorStop(0, 'rgba(16, 185, 129, 0.08)');
      spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = spotGrad;
      ctx.fillRect(0, 0, width, height);
    }

    // Kinematic target parallel guide line for Squats
    if (exercise === 'squat') {
      const parallelY = height * 0.76;
      ctx.setLineDash([6, 6]);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(40, parallelY);
      ctx.lineTo(width - 40, parallelY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
      ctx.font = 'bold 11px JetBrains Mono, monospace';
      ctx.fillText('90° PARALLEL DEPTH PLANE', 45, parallelY - 8);
    }

    if (!landmarks || Object.keys(landmarks).length === 0) {
      return;
    }

    // Determine colors based on form status (Violet theme)
    const isWarning = analysis && analysis.status === 'WARNING';
    const isGood = analysis && analysis.status === 'GOOD_FORM';
    
    const primaryColor = isWarning ? '#f43f5e' : isGood ? '#a855f7' : '#818cf8';
    const glowColor = isWarning ? 'rgba(244, 63, 94, 0.45)' : isGood ? 'rgba(168, 85, 247, 0.45)' : 'rgba(129, 140, 248, 0.45)';

    // Skeleton bone connections
    const bones: [string, string][] = [
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['left_knee', 'left_ankle'],
      ['right_hip', 'right_knee'],
      ['right_knee', 'right_ankle'],
    ];

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    bones.forEach(([p1Key, p2Key]) => {
      const p1 = landmarks[p1Key];
      const p2 = landmarks[p2Key];
      if (p1 && p2) {
        const x1 = p1.x * width;
        const y1 = p1.y * height;
        const x2 = p2.x * width;
        const y2 = p2.y * height;

        // Glow layer
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Core bone
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    });

    // Draw Joint Nodes
    Object.entries(landmarks).forEach(([key, pt]) => {
      if (key === 'nose') return;
      const x = pt.x * width;
      const y = pt.y * height;

      // Outer halo
      ctx.fillStyle = glowColor;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Solid inner core
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Draw Head node
    if (landmarks.nose) {
      const hx = landmarks.nose.x * width;
      const hy = landmarks.nose.y * height;
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(hx, hy, 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = glowColor;
      ctx.fill();
    }

    // Draw Angle Arc on key joint
    let vertexPt: { x: number; y: number } | null = null;
    let label = '';
    const angleValue = analysis?.current_angle ?? 180;

    if (exercise === 'squat' && landmarks.left_knee) {
      vertexPt = { x: landmarks.left_knee.x * width, y: landmarks.left_knee.y * height };
      label = `KNEE ${Math.round(angleValue)}°`;
    } else if (exercise === 'pushup' && landmarks.left_elbow) {
      vertexPt = { x: landmarks.left_elbow.x * width, y: landmarks.left_elbow.y * height };
      label = `ELBOW ${Math.round(angleValue)}°`;
    } else if (exercise === 'plank' && landmarks.left_hip) {
      vertexPt = { x: landmarks.left_hip.x * width, y: landmarks.left_hip.y * height };
      label = `ALIGNMENT ${Math.round(angleValue)}°`;
    }

    if (vertexPt) {
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(vertexPt.x, vertexPt.y, 28, 0, Math.PI * 0.85);
      ctx.stroke();

      const badgeWidth = 110;
      const badgeHeight = 28;
      const bx = Math.min(width - badgeWidth - 12, vertexPt.x + 36);
      const by = Math.max(24, vertexPt.y - 14);

      ctx.fillStyle = 'rgba(11, 17, 30, 0.92)';
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(bx, by, badgeWidth, badgeHeight, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = primaryColor;
      ctx.font = 'bold 12px JetBrains Mono, monospace';
      ctx.fillText(label, bx + 10, by + 18);
    }
  }, [landmarks, analysis, exercise, useWebcam]);

  const activeWarnings: FormWarning[] = analysis?.warnings || [];

  return (
    <div className="relative flex flex-col w-full bg-[#120d28] border border-violet-800/60 rounded-2xl overflow-hidden shadow-2xl transition-colors">
      {/* Top Feed Header & Status Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#0e0920] border-b border-violet-900/50 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isActive ? 'bg-violet-400 opacity-75' : 'bg-amber-400 opacity-75'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isActive ? 'bg-violet-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="font-bold tracking-wide uppercase text-white">
              {isActive ? 'Live Pose Analysis' : 'Session Paused'}
            </span>
          </div>
          <span className="text-violet-700 hidden sm:inline">|</span>
          <span className="text-violet-300/80 font-mono-numbers hidden sm:inline">
            30 FPS · MediaPipe Kinematics
          </span>
        </div>

        {/* Stream Source Toggle Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setUseWebcam(!useWebcam)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              useWebcam
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/50 shadow-[0_0_10px_rgba(139,92,246,0.25)]'
                : 'bg-slate-850 text-slate-200 hover:bg-slate-800 border border-slate-700'
            }`}
          >
            {useWebcam ? <Camera className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
            <span>{useWebcam ? 'Webcam Active' : 'AI Simulation Mode'}</span>
          </button>

          <button
            type="button"
            onClick={onResetSession}
            title="Reset counter & pose engine"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-violet-900/40 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Video/Canvas Feed Container */}
      <div className="relative aspect-video w-full bg-[#05080e] overflow-hidden flex items-center justify-center">
        {/* Real Webcam Video Element */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover -scale-x-100 ${useWebcam ? 'opacity-90' : 'hidden'}`}
          playsInline
          muted
        />

        {/* Biomechanical Skeleton Overlay Canvas */}
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
        />

        {/* Overlay Scanner Line Animation */}
        <div className="absolute inset-x-0 h-2 bg-gradient-to-b from-emerald-500/30 via-emerald-400/10 to-transparent pointer-events-none animate-scanline z-10" />

        {/* Real-time Visual Warning Alert Banners */}
        {activeWarnings.length > 0 && (
          <div className="absolute top-4 left-4 right-4 z-30 flex flex-col gap-2 max-w-lg mx-auto">
            {activeWarnings.map((warn, idx) => (
              <div
                key={`${warn.code}-${idx}`}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border animate-pulse ${
                  warn.severity === 'error'
                    ? 'bg-rose-950/90 border-rose-500/80 text-rose-100'
                    : 'bg-amber-950/90 border-amber-500/80 text-amber-100'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${warn.severity === 'error' ? 'bg-rose-500/30' : 'bg-amber-500/30'}`}>
                  {warn.severity === 'error' ? (
                    <ShieldAlert className="w-5 h-5 text-rose-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    Form Correction Needed
                  </div>
                  <div className="text-sm font-bold text-white">{warn.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feed Bottom Overlay HUD */}
        <div className="absolute bottom-4 inset-x-4 z-20 flex flex-wrap items-end justify-between gap-3 pointer-events-none">
          {/* Left: Dynamic Form State Badge */}
          <div className="bg-[#0b111e]/90 backdrop-blur-md border border-slate-700/80 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                analysis?.status === 'WARNING'
                  ? 'bg-rose-500 shadow-[0_0_12px_#f43f5e]'
                  : analysis?.status === 'GOOD_FORM'
                  ? 'bg-emerald-400 shadow-[0_0_12px_#10b981]'
                  : 'bg-cyan-400 shadow-[0_0_12px_#06b6d4]'
              }`}
            />
            <div>
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
                Movement Status
              </div>
              <div className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>{analysis?.form_message || 'Align posture with guide'}</span>
                {analysis?.status === 'GOOD_FORM' && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 inline" />
                )}
              </div>
            </div>
          </div>

          {/* Right: Real-time Joint Angle HUD Card */}
          <div className="bg-[#0b111e]/90 backdrop-blur-md border border-slate-700/80 px-4 py-2.5 rounded-xl shadow-xl text-right">
            <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400">
              Joint Angle Flexion
            </div>
            <div className="text-xl font-black font-mono-numbers text-emerald-400">
              {Math.round(analysis?.current_angle || 180)}°
              <span className="text-xs font-semibold text-slate-300 ml-1.5">
                (Target: {analysis?.target_angle_range ? `${analysis.target_angle_range[0]}°-${analysis.target_angle_range[1]}°` : '75°-90°'})
              </span>
            </div>
          </div>
        </div>

        {/* Camera Permission Warning Banner */}
        {webcamError && !useWebcam && (
          <div className="absolute bottom-20 left-4 right-4 z-20 bg-slate-900/95 border border-amber-500/60 p-3 rounded-xl text-xs text-amber-300 flex items-center justify-between shadow-2xl">
            <span>{webcamError}</span>
            <button
              onClick={() => setWebcamError(null)}
              className="text-slate-400 hover:text-white ml-2 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Interactive Simulation Error Injector Drawer */}
      {!useWebcam && (
        <div className="p-3.5 bg-[#0a0f19] border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Form Stress-Test:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveError('none')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                activeError === 'none'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Flawless Form
            </button>

            {exercise === 'squat' && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveError('knee_valgus')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeError === 'knee_valgus'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  Test Knee Valgus
                </button>
                <button
                  type="button"
                  onClick={() => setActiveError('torso_lean')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeError === 'torso_lean'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  Test Torso Lean
                </button>
                <button
                  type="button"
                  onClick={() => setActiveError('shallow_depth')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeError === 'shallow_depth'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  Test Shallow Depth
                </button>
              </>
            )}

            {exercise === 'pushup' && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveError('hip_sag')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeError === 'hip_sag'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  Test Sagging Hips
                </button>
                <button
                  type="button"
                  onClick={() => setActiveError('hip_pike')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeError === 'hip_pike'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  Test Piked Hips
                </button>
              </>
            )}

            {exercise === 'plank' && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveError('hip_sag')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeError === 'hip_sag'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  Simulate Hip Drop
                </button>
                <button
                  type="button"
                  onClick={() => setActiveError('hip_pike')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeError === 'hip_pike'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                  }`}
                >
                  Simulate Elevated Pelvis
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
