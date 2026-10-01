import React, { useState } from 'react';
import { Youtube, Instagram, Play, ExternalLink, Heart, Share2, Bookmark, CheckCircle2, ArrowRight, ArrowLeft, Eye, MessageCircle, Sparkles, Filter } from 'lucide-react';
import { ExerciseType } from '../types/workout';

interface FitnessMediaPageProps {
  currentExercise: ExerciseType;
  onSelectExerciseAndGoToStudio: (ex: ExerciseType) => void;
  onGoToPreviousPage: () => void;
  onGoToNextPage: () => void;
}

interface VideoItem {
  id: string;
  type: 'youtube' | 'reel';
  title: string;
  creator: string;
  creatorHandle: string;
  creatorAvatar: string;
  youtubeId?: string;
  thumbnail: string;
  duration?: string;
  views: string;
  likes: string;
  exercise: ExerciseType;
  description: string;
  keyTakeaways: string[];
  instagramUrl?: string;
  youtubeUrl?: string;
}

export const FitnessMediaPage: React.FC<FitnessMediaPageProps> = ({
  currentExercise,
  onSelectExerciseAndGoToStudio,
  onGoToPreviousPage,
  onGoToNextPage,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'youtube' | 'reels'>('all');
  const [exerciseFilter, setExerciseFilter] = useState<ExerciseType | 'all'>(currentExercise);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const videos: VideoItem[] = [
    // YouTube Tutorials
    {
      id: 'yt-squat-1',
      type: 'youtube',
      title: 'How To Squat Properly: Step-By-Step Biomechanical Guide',
      creator: 'Jeff Nippard',
      creatorHandle: '@jeffnippard',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      youtubeId: 'YaXPRqUwItQ',
      thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
      duration: '11:24',
      views: '5.2M',
      likes: '142K',
      exercise: 'squat',
      description: 'Science-based biomechanics breakdown of foot angle, hip hinge, knee tracking, and parallel depth.',
      keyTakeaways: [
        'Set feet shoulder-width with 15°-25° flare for optimal hip socket alignment',
        'Break at knees and hips simultaneously to balance quadriceps and glute loads',
        'Maintain three points of contact: big toe, pinky toe, and heel tripod'
      ],
      youtubeUrl: 'https://www.youtube.com/watch?v=YaXPRqUwItQ',
    },
    {
      id: 'yt-squat-2',
      type: 'youtube',
      title: 'Fixing Knee Valgus & Depth Flaws in Your Squat',
      creator: 'Squat University',
      creatorHandle: '@squatuniversity',
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      youtubeId: 'bEv6CCg2BC8',
      thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
      duration: '8:45',
      views: '3.1M',
      likes: '98K',
      exercise: 'squat',
      description: 'Dr. Aaron Horschig explains how to activate glute medius and avoid inward caving knees.',
      keyTakeaways: [
        'Screw your feet into the floor to generate external rotational torque',
        'Do not let knee collapse inside the second toe vector',
        'Warm up ankles with dorsiflexion rocks for upright torso posture'
      ],
      youtubeUrl: 'https://www.youtube.com/watch?v=bEv6CCg2BC8',
    },
    {
      id: 'yt-pushup-1',
      type: 'youtube',
      title: 'The Perfect Push-Up: Avoid These 5 Common Mistakes',
      creator: 'Calisthenicmovement',
      creatorHandle: '@calimove',
      creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      youtubeId: 'IODxDxX7oi4',
      thumbnail: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=800&auto=format&fit=crop&q=80',
      duration: '7:18',
      views: '12.4M',
      likes: '380K',
      exercise: 'pushup',
      description: 'Comprehensive anatomy tutorial on shoulder blade protraction, elbow angles, and pelvic bracing.',
      keyTakeaways: [
        'Keep elbows tracking back at 45° like an arrowhead, never flared 90°',
        'Lock pelvis in posterior pelvic tilt to prevent lower back hyperextension',
        'Protact scapula at the top lockout for complete serratus anterior engagement'
      ],
      youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    },
    {
      id: 'yt-plank-1',
      type: 'youtube',
      title: 'Stop Planking Wrong! How to Do Proper RKC Planks',
      creator: 'Athlean-X',
      creatorHandle: '@athleanx',
      creatorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
      youtubeId: '6TKwE4SQR68',
      thumbnail: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=800&auto=format&fit=crop&q=80',
      duration: '9:02',
      views: '4.8M',
      likes: '115K',
      exercise: 'plank',
      description: 'Jeff Cavaliere breaks down how holding a loose plank for 5 minutes is inferior to a 30s max tension plank.',
      keyTakeaways: [
        'Actively pull forearms towards toes to ignite rectus abdominis',
        'Squeeze glutes and quads simultaneously to lock lumbar spine',
        'Avoid sagging hips or hiking pelvis into an inverted pyramid'
      ],
      youtubeUrl: 'https://www.youtube.com/watch?v=6TKwE4SQR68',
    },

    // Instagram Reels & Vertical Content
    {
      id: 'reel-squat-1',
      type: 'reel',
      title: '30-Second Squat Stance Diagnostic (Fix Heel Lift)',
      creator: 'Dr. Aaron Horschig',
      creatorHandle: '@squat_university',
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop&q=80',
      views: '1.8M',
      likes: '92.4K',
      exercise: 'squat',
      description: 'Quick reel demonstrating how elevating heels 0.5 inches with wedges cleans up squat depth immediately.',
      keyTakeaways: ['Elevated heels compensate for limited ankle dorsiflexion', 'Test your mobility with the 5-inch wall test'],
      instagramUrl: 'https://instagram.com/squat_university',
    },
    {
      id: 'reel-pushup-1',
      type: 'reel',
      title: 'Why You Feel Push-ups in Your Shoulders, Not Chest',
      creator: 'Hampton',
      creatorHandle: '@hybrid.calisthenics',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=500&auto=format&fit=crop&q=80',
      views: '3.4M',
      likes: '210K',
      exercise: 'pushup',
      description: 'Friendly calisthenics coach explains hand placement and depression of shoulder blades before descending.',
      keyTakeaways: ['Pull shoulders down away from ears', 'Form an arrow, not a T-shape with your arms'],
      instagramUrl: 'https://instagram.com/hybrid.calisthenics',
    },
    {
      id: 'reel-plank-1',
      type: 'reel',
      title: 'Plank Form Check: Anterior vs Posterior Pelvic Tilt',
      creator: 'Coach Jeremy',
      creatorHandle: '@jeremyethier',
      creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=500&auto=format&fit=crop&q=80',
      views: '950K',
      likes: '64.1K',
      exercise: 'plank',
      description: 'Visual side-by-side comparison of dangerous hyperextension vs healthy core brace alignment.',
      keyTakeaways: ['Tuck your tailbone under like a frightened dog', 'Deep breaths from the diaphragm, don’t hold breath'],
      instagramUrl: 'https://instagram.com/jeremyethier',
    },
    {
      id: 'reel-squat-2',
      type: 'reel',
      title: 'Knee Health: The Real Science of Knees Over Toes',
      creator: 'Ben Patrick',
      creatorHandle: '@kneesovertoesguy',
      creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80',
      views: '4.1M',
      likes: '315K',
      exercise: 'squat',
      description: 'Debunking the myth that knees should never pass toes and building bulletproof patellar tendons.',
      keyTakeaways: ['Knees past toes is natural in daily mechanics and sports', 'Strengthen tibialis anterior and VMO quad fibers'],
      instagramUrl: 'https://instagram.com/kneesovertoesguy',
    }
  ];

  // Filtering
  const filteredVideos = videos.filter((v) => {
    if (activeTab === 'youtube' && v.type !== 'youtube') return false;
    if (activeTab === 'reels' && v.type !== 'reel') return false;
    if (exerciseFilter !== 'all' && v.exercise !== exerciseFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Youtube className="w-4 h-4 text-rose-500" />
            <span>Page 5 of 5 · Video Masterclasses & Instagram Reels</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Fitness Tutorials & Viral Reels
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Science-backed YouTube masterclasses and high-impact Instagram Reels curated by top biomechanical coaches.
          </p>
        </div>

        {/* Action button to return to studio */}
        <button
          type="button"
          onClick={() => onSelectExerciseAndGoToStudio(currentExercise)}
          className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Launch AI Studio Camera</span>
        </button>
      </div>

      {/* Filter and Content Type Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0a0f19] border border-slate-800/80 rounded-2xl shadow-md">
        {/* Type Tabs: All, YouTube, Reels */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Content ({videos.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'youtube'
                ? 'bg-rose-950/70 text-rose-300 border border-rose-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-rose-500" />
            <span>YouTube Videos (4)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reels')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'reels'
                ? 'bg-gradient-to-r from-purple-900/60 to-pink-900/60 text-pink-300 border border-pink-500/50 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            <span>Instagram Reels (4)</span>
          </button>
        </div>

        {/* Exercise Target Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Filter by Exercise:</span>
          {(['all', 'squat', 'pushup', 'plank'] as const).map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setExerciseFilter(ex)}
              className={`px-3 py-1 rounded-lg font-bold transition-all border cursor-pointer ${
                exerciseFilter === ex
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border-slate-800'
              }`}
            >
              {ex === 'all' ? 'All Moves' : ex === 'squat' ? 'Squats' : ex === 'pushup' ? 'Push-ups' : 'Planks'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Video Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredVideos.map((video) => {
          const isLiked = likedMap[video.id];

          return (
            <div
              key={video.id}
              className={`bg-[#0e1626] border rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between transition-all group ${
                video.type === 'reel'
                  ? 'border-purple-900/40 hover:border-pink-500/60'
                  : 'border-slate-800 hover:border-rose-500/60'
              }`}
            >
              {/* Media Thumbnail Container with Play Overlay */}
              <div
                onClick={() => setSelectedVideo(video)}
                className={`relative overflow-hidden cursor-pointer ${
                  video.type === 'reel' ? 'aspect-[4/5]' : 'aspect-video'
                } bg-slate-950`}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Play Button Badge */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white backdrop-blur-md shadow-2xl transition-transform group-hover:scale-110 ${
                    video.type === 'reel'
                      ? 'bg-gradient-to-tr from-purple-600/90 to-pink-500/90'
                      : 'bg-rose-600/90'
                  }`}>
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Format Pill (YouTube or Reel) */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  {video.type === 'youtube' ? (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-rose-600 text-white shadow-md">
                      <Youtube className="w-3 h-3 fill-current" />
                      <span>YouTube</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md">
                      <Instagram className="w-3 h-3" />
                      <span>Reel</span>
                    </span>
                  )}

                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-slate-900/80 text-emerald-400 border border-slate-700 backdrop-blur-md">
                    {video.exercise}
                  </span>
                </div>

                {/* Duration Tag if Youtube */}
                {video.duration && (
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-mono-numbers font-bold bg-black/80 text-white">
                    {video.duration}
                  </div>
                )}
              </div>

              {/* Video Information Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Creator Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src={video.creatorAvatar}
                      alt={video.creator}
                      className="w-6 h-6 rounded-full object-cover border border-slate-700"
                    />
                    <div className="text-xs">
                      <span className="font-extrabold text-white flex items-center gap-1">
                        {video.creator}
                        <CheckCircle2 className="w-3 h-3 text-cyan-400 fill-cyan-400/20" />
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => setSelectedVideo(video)}
                    className="text-xs sm:text-sm font-extrabold text-white leading-snug line-clamp-2 cursor-pointer hover:text-emerald-400 transition-colors mb-2"
                  >
                    {video.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                    {video.description}
                  </p>
                </div>

                {/* Card Footer: Metrics & Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1 font-mono-numbers">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>{video.views}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleLike(video.id)}
                      className={`flex items-center gap-1 transition-colors cursor-pointer ${
                        isLiked ? 'text-rose-400 font-bold' : 'hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{video.likes}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedVideo(video)}
                    className="text-[11px] font-extrabold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Watch</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Cinema Player Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0e1626] border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a0f19]">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl text-white ${
                  selectedVideo.type === 'reel' ? 'bg-gradient-to-tr from-purple-600 to-pink-600' : 'bg-rose-600'
                }`}>
                  {selectedVideo.type === 'reel' ? <Instagram className="w-5 h-5" /> : <Youtube className="w-5 h-5 fill-current" />}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white truncate max-w-md sm:max-w-xl">
                    {selectedVideo.title}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span>by <strong>{selectedVideo.creator}</strong> ({selectedVideo.creatorHandle})</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-bold uppercase">{selectedVideo.exercise} Guide</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors text-sm font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Responsive Video Embed */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-2xl relative">
                {selectedVideo.youtubeId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-purple-950/40 via-black to-pink-950/40">
                    <Instagram className="w-16 h-16 text-pink-400 mb-4 animate-bounce" />
                    <h4 className="text-lg font-bold text-white mb-2">{selectedVideo.title}</h4>
                    <p className="text-xs text-slate-300 max-w-md mb-4">{selectedVideo.description}</p>
                    {selectedVideo.instagramUrl && (
                      <a
                        href={selectedVideo.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                      >
                        <span>Watch Full Reel on Instagram</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Key Coaching Takeaways Breakdown */}
              <div className="bg-[#0a0f19] border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>AI Coach Key Takeaways & Form Rules</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  {selectedVideo.keyTakeaways.map((tip, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#0e1626] border border-slate-800/80 text-xs text-slate-200 font-medium leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] flex items-center justify-center shrink-0 border border-emerald-500/40">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Interactive Modal Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleLike(selectedVideo.id)}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      likedMap[selectedVideo.id]
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/60'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedMap[selectedVideo.id] ? 'fill-current' : ''}`} />
                    <span>{likedMap[selectedVideo.id] ? 'Favorited' : 'Add to Favorites'}</span>
                  </button>

                  {selectedVideo.youtubeUrl && (
                    <a
                      href={selectedVideo.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Youtube className="w-3.5 h-3.5 text-rose-400" />
                      <span>Open on YouTube</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedVideo(null);
                    onSelectExerciseAndGoToStudio(selectedVideo.exercise);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Apply Technique: Train {selectedVideo.exercise.toUpperCase()} in Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Page Navigation Bar ("Click go to next page") */}
      <div className="flex items-center justify-between p-4 bg-[#0e1626] border border-slate-800 rounded-2xl shadow-xl">
        <button
          type="button"
          onClick={onGoToPreviousPage}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors border border-slate-700 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous: Related Gear & Items</span>
        </button>

        <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
          Step 5 of 5: YouTube & Instagram Fitness Media
        </span>

        <button
          type="button"
          onClick={onGoToNextPage}
          className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-colors cursor-pointer"
        >
          <span>Return to Workout Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
