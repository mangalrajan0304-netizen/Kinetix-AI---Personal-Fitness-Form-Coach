import React, { useState } from 'react';
import { Volume2, VolumeX, Sun, Moon, ArrowRight, User, LogOut, ChevronDown, Video } from 'lucide-react';
import { UserProfile } from '../types/auth';

export type AppPage = 'studio' | 'library' | 'analytics' | 'gear' | 'media' | 'login';

interface TopNavProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onGoToNextPage: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentPage,
  onNavigate,
  onGoToNextPage,
  voiceEnabled,
  onToggleVoice,
  theme,
  onToggleTheme,
  currentUser,
  onLogout,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems: Array<{ id: AppPage; label: string; badge?: string }> = [
    { id: 'studio', label: 'Workout Studio' },
    { id: 'library', label: 'Form Anatomy' },
    { id: 'analytics', label: 'Session Analytics' },
    { id: 'gear', label: 'Related Items & Gear' },
    { id: 'media', label: 'Videos & Reels', badge: 'NEW' },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-violet-900/50 bg-[#0d091e]/95 backdrop-blur-md sticky top-0 z-40 shadow-xl shadow-purple-950/20">
      {/* Zone 1: Wordmark with glowing violet indicator */}
      <button
        type="button"
        onClick={() => onNavigate('studio')}
        className="text-lg font-extrabold tracking-tight font-display flex items-center gap-2 cursor-pointer group"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-violet-400 inline-block shadow-[0_0_12px_#8b5cf6] group-hover:scale-125 transition-transform" />
        <span className="text-white group-hover:text-violet-300 transition-colors">
          Kinetix AI
        </span>
        <span className="text-[10px] font-mono font-bold bg-violet-900/60 border border-violet-700/60 text-violet-300 px-1.5 py-0.5 rounded">
          VIOLET
        </span>
      </button>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-semibold">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
                isActive
                  ? 'text-violet-400 font-bold underline underline-offset-8 decoration-2 decoration-violet-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/40">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Actions + Profile Widget */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-violet-900/40 transition-colors cursor-pointer border border-transparent hover:border-violet-800/40"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-300" />}
        </button>

        {/* Voice Toggle */}
        <button
          type="button"
          onClick={onToggleVoice}
          title={voiceEnabled ? 'Voice coach active' : 'Voice coach muted'}
          className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-violet-900/40 transition-colors cursor-pointer border border-transparent hover:border-violet-800/40"
        >
          {voiceEnabled ? (
            <Volume2 className="w-4 h-4 text-violet-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* User Profile / Login Button */}
        {currentUser ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-[#140e2e] border border-violet-800/60 hover:border-violet-500 transition-all text-xs font-bold text-white shadow-sm cursor-pointer"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-6 h-6 rounded-full object-cover border border-violet-400"
              />
              <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#120d28] border border-violet-800/80 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-2.5 border-b border-violet-900/60">
                  <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-violet-300 bg-violet-950/80 border border-violet-700/80 px-1.5 py-0.5 rounded">
                      {currentUser.membership}
                    </span>
                    <span className="text-[10px] text-slate-400">· {currentUser.level}</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onNavigate('studio');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-violet-900/40 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Workout Studio</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onNavigate('media');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-violet-900/40 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>YouTube Videos & Reels</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onNavigate('analytics');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-violet-900/40 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>My Telemetry History</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onNavigate('login');
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-violet-900/40 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Switch User Account</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-violet-900/60">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#140e2e] hover:bg-violet-900/60 rounded-xl border border-violet-800/80 transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-violet-400" />
            <span>Sign In</span>
          </button>
        )}

        {/* Go To Next Page CTA Button in Violet */}
        {currentPage !== 'login' && (
          <button
            type="button"
            onClick={onGoToNextPage}
            className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.35)] hover:shadow-[0_0_20px_rgba(139,92,246,0.55)] cursor-pointer"
          >
            <span>Next Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </header>
  );
};
