import React, { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff, CheckCircle2, ArrowRight, Shield, Zap, Sparkles, ChevronRight, Activity, Award } from 'lucide-react';
import { UserProfile } from '../types/auth';
import { coachAudio } from '../utils/audioCoach';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onCancelOrBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onCancelOrBack,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('hypertrophy');
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Elite'>('Intermediate');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  // Demo user quick login presets
  const handleQuickDemoLogin = (type: 'athlete' | 'coach') => {
    setIsLoading(true);
    setTimeout(() => {
      let demoUser: UserProfile;
      if (type === 'athlete') {
        demoUser = {
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
      } else {
        demoUser = {
          id: 'user_coach_01',
          name: 'Coach Elena Rostova',
          email: 'coach.elena@kinetix.fit',
          role: 'coach',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          level: 'Elite',
          goal: 'Biomechanical Form Mastery & Conditioning',
          membership: 'Pro Athlete',
          repsCompletedTotal: 1250,
        };
      }
      localStorage.setItem('kinetix_user', JSON.stringify(demoUser));
      coachAudio.speak(`Welcome back, ${demoUser.name.split(' ')[0]}! Ready for your workout.`);
      setIsLoading(false);
      onLoginSuccess(demoUser);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (authMode === 'signup' && !fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const name = authMode === 'signup' ? fullName : email.split('@')[0];
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1);

      const user: UserProfile = {
        id: `user_${Date.now()}`,
        name: capitalized,
        email,
        role: 'athlete',
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        level: experienceLevel,
        goal: fitnessGoal === 'hypertrophy' ? 'Muscle Hypertrophy' : fitnessGoal === 'fatloss' ? 'Fat Loss & Conditioning' : 'Joint Mobility & Core Strength',
        membership: 'Pro Athlete',
        repsCompletedTotal: 0,
      };

      if (rememberMe) {
        localStorage.setItem('kinetix_user', JSON.stringify(user));
      }

      coachAudio.speak(`Welcome to Kinetix AI, ${capitalized}!`);
      setIsLoading(false);
      onLoginSuccess(user);
    }, 600);
  };

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 33;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score += 33;
    if (/[^A-Za-z0-9]/.test(pass) && pass.length >= 8) score += 34;
    return score;
  };

  const strength = calculatePasswordStrength(password);

  return (
    <div className="min-h-[82vh] flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#0e1626] border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Athletic Branding & Proof Showcase (5 Columns) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0c1524] via-[#09111e] to-[#060a12] p-8 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Wordmark */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-[0_0_12px_#10b981]" />
              <span className="text-xl font-extrabold text-white font-display tracking-tight">
                Kinetix AI
              </span>
              <span className="ml-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Pro
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display leading-tight">
                Unlock Next-Gen Biomechanical Coaching
              </h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                Precision computer-vision pose tracking, real-time auditory repetition cues, and customized fitness analytics.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Sub-Degree Joint Flexion Tracking</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Accurate 30 FPS MediaPipe skeletal kinematics.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Interactive Audio Voice Coach</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Hands-free verbal posture adjustments and milestones.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Repetition Telemetry Ledger</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Detailed angles, form scores, and JSON exports.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Strip */}
          <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Athlete" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80" alt="Trainer" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80" alt="Member" />
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-white">Over 1,200,000+ Reps Tracked</div>
                <div className="text-[11px] text-slate-400">Trusted by strength athletes and trainers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Professional Authentication Card (7 Columns) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#0e1626]">
          <div>
            {/* Top Bar with Cancel/Back button */}
            <div className="flex items-center justify-between pb-4 mb-2">
              {/* Tab Selector */}
              <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setErrorMsg(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                    authMode === 'signin'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setErrorMsg(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                    authMode === 'signup'
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <button
                type="button"
                onClick={onCancelOrBack}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Skip to Studio
              </button>
            </div>

            {/* Quick Demo Login Pill Bar */}
            <div className="p-3 bg-[#0a0f19] border border-slate-800/80 rounded-2xl mb-5">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instant 1-Click Demo Profiles:</span>
                </span>
                <span className="text-[10px] text-slate-400">No password required</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('athlete')}
                  disabled={isLoading}
                  className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-white text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all hover:border-emerald-500/50"
                >
                  <span>🏃</span>
                  <span>Athlete Demo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('coach')}
                  disabled={isLoading}
                  className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-white text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all hover:border-cyan-500/50"
                >
                  <span>🏋️</span>
                  <span>Coach Demo</span>
                </button>
              </div>
            </div>

            {/* Form Title */}
            <div className="mb-4">
              <h3 className="text-xl font-extrabold text-white">
                {authMode === 'signin' ? 'Sign in to your Kinetix account' : 'Join Kinetix Pro Athlete'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === 'signin'
                  ? 'Enter your credentials to access your personalized telemetry and workout presets.'
                  : 'Start tracking your form and biomechanical accuracy with real-time AI guidance.'}
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-950/40 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Forgot Password Confirmation */}
            {forgotSent && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-950/40 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Password reset link sent to your email address.</span>
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#0a0f19] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="athlete@kinetix.fit"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0a0f19] border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  {authMode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setForgotSent(true)}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0a0f19] border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white absolute right-3.5 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {authMode === 'signup' && password.length > 0 && (
                  <div className="mt-1.5">
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          strength < 40 ? 'bg-rose-500' : strength < 80 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                      <span>Password strength:</span>
                      <span className="font-bold text-slate-300">
                        {strength < 40 ? 'Weak' : strength < 80 ? 'Good' : 'Strong & Secure'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {authMode === 'signup' && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Primary Goal
                    </label>
                    <select
                      value={fitnessGoal}
                      onChange={(e) => setFitnessGoal(e.target.value)}
                      className="w-full bg-[#0a0f19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="hypertrophy">Muscle Hypertrophy</option>
                      <option value="fatloss">Fat Loss & Conditioning</option>
                      <option value="posture">Core & Posture Rehab</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Experience
                    </label>
                    <select
                      value={experienceLevel}
                      onChange={(e: any) => setExperienceLevel(e.target.value)}
                      className="w-full bg-[#0a0f19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-medium focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Beginner">Beginner Athlete</option>
                      <option value="Intermediate">Intermediate Lifter</option>
                      <option value="Elite">Elite / Advanced</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Remember Me */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="remember" className="text-xs text-slate-400 cursor-pointer">
                  Remember my session on this device
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{isLoading ? 'Authenticating...' : authMode === 'signin' ? 'Sign In to Studio' : 'Create Free Athlete Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Footer Terms */}
          <div className="text-center pt-4 mt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
            By continuing, you agree to Kinetix AI Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
};
